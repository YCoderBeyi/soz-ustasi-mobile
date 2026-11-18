import type { LevelData, WordEntry } from '../types';
import { EASY_ENDLESS_WORDS } from './easyEndlessWords';
import { levels } from './levels';
import { themes } from './themes';
import { findBonusDictionaryWord } from '../game/bonusDictionary';
import { normalizeWord } from '../game/normalize';

export const FIRST_ENDLESS_LEVEL = 76;
export const MAX_LEVEL_ID = 10_000;

type Recipe = { anchor: WordEntry; companion: WordEntry; hidden: WordEntry[] };

const easyWordOrder = new Map(EASY_ENDLESS_WORDS.map((word, index) => [normalizeWord(word), index]));
const authoredPairs = new Set(
  levels.flatMap((level) => level.mainWords.flatMap((first, index) => (
    level.mainWords.slice(index + 1).map((second) => (
      [normalizeWord(first.word), normalizeWord(second.word)].sort().join('|')
    ))
  ))),
);

function canBuildWord(word: string, letters: readonly string[]): boolean {
  const counts = new Map<string, number>();
  for (const letter of letters) counts.set(letter, (counts.get(letter) ?? 0) + 1);
  for (const letter of Array.from(normalizeWord(word))) {
    const count = counts.get(letter) ?? 0;
    if (count === 0) return false;
    counts.set(letter, count - 1);
  }
  return true;
}

function buildEasyWordBank(): WordEntry[] {
  const byWord = new Map<string, WordEntry>();
  for (const level of levels) {
    for (const entry of level.mainWords) {
      const key = normalizeWord(entry.word);
      if (easyWordOrder.has(key) && entry.meaning.length >= 10) byWord.set(key, entry);
    }
  }
  for (const word of EASY_ENDLESS_WORDS) {
    const key = normalizeWord(word);
    const entry = findBonusDictionaryWord(key);
    if (entry?.meaning && entry.meaning.length >= 10 && !byWord.has(key)) byWord.set(key, entry);
  }
  return [...byWord.values()].sort(
    (a, b) => (easyWordOrder.get(normalizeWord(a.word)) ?? 0) - (easyWordOrder.get(normalizeWord(b.word)) ?? 0),
  );
}

function buildRecipes(): Recipe[] {
  const words = buildEasyWordBank();
  const recipes: Recipe[] = [];
  const seen = new Set<string>();

  for (const anchor of words) {
    const anchorLength = Array.from(anchor.word).length;
    if (anchorLength < 4 || anchorLength > 6) continue;
    const letters = Array.from(normalizeWord(anchor.word));

    for (const companion of words) {
      const companionLength = Array.from(companion.word).length;
      if (companionLength < 3 || companionLength >= anchorLength) continue;
      if (!canBuildWord(companion.word, letters)) continue;
      const authoredPair = [normalizeWord(anchor.word), normalizeWord(companion.word)].sort().join('|');
      if (authoredPairs.has(authoredPair)) continue;

      const key = `${normalizeWord(anchor.word)}|${normalizeWord(companion.word)}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const hidden = words
        .filter((entry) => {
          const word = normalizeWord(entry.word);
          return word !== normalizeWord(anchor.word)
            && word !== normalizeWord(companion.word)
            && Array.from(entry.word).length >= 3
            && canBuildWord(entry.word, letters);
        })
        .slice(0, 3)
        .map((entry) => ({ ...entry, reward: 5 }));
      recipes.push({
        anchor: { ...anchor, difficulty: 1 },
        companion: { ...companion, difficulty: 1 },
        hidden,
      });
    }
  }

  if (recipes.length < 12) {
    throw new Error(`Endless level bank needs at least 12 easy recipes; found ${recipes.length}.`);
  }
  return recipes;
}

const recipes = buildRecipes();

function makeEndlessLevel(levelId: number): LevelData {
  const recipe = recipes[(levelId - FIRST_ENDLESS_LEVEL) % recipes.length];
  const regionStart = Math.floor((levelId - 1) / 6) * 6 + 1;
  const themeIndex = regionStart <= levels.length
    ? themes.findIndex((theme) => theme.themeId === levels[regionStart - 1]?.themeId)
    : Math.floor((regionStart - FIRST_ENDLESS_LEVEL) / 6) % themes.length;
  const letters = Array.from(normalizeWord(recipe.anchor.word));
  const hiddenWords = recipe.hidden;

  return {
    levelId,
    themeId: themes[themeIndex >= 0 ? themeIndex : 0].themeId,
    sealId: `seal_endless_${String(((levelId - FIRST_ENDLESS_LEVEL) % 6) + 1).padStart(2, '0')}`,
    puzzleType: 'crossword',
    letters,
    mainWords: [recipe.anchor, recipe.companion],
    hiddenWords,
    reward: {
      baseCoin: 30 + Math.min(10, Math.floor((levelId - FIRST_ENDLESS_LEVEL) / 25)),
      hiddenWordBonus: hiddenWords.length > 0 ? 5 : 0,
    },
  };
}

/** Extends the shared runtime catalog only as far as progression needs. */
export function ensureLevelsThrough(levelId: number): void {
  const target = Math.min(MAX_LEVEL_ID, Math.max(1, Math.floor(levelId)));
  while (levels.length < target) {
    const nextId = (levels.at(-1)?.levelId ?? 0) + 1;
    if (nextId < FIRST_ENDLESS_LEVEL) break;
    levels.push(makeEndlessLevel(nextId));
  }
}

export function getLevelById(levelId: number): LevelData | undefined {
  if (!Number.isSafeInteger(levelId) || levelId < 1 || levelId > MAX_LEVEL_ID) return undefined;
  ensureLevelsThrough(levelId);
  return levels[levelId - 1];
}

export function getEndlessRecipeCount(): number {
  return recipes.length;
}
