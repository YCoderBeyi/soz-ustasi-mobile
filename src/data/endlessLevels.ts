import type { LevelData, WordEntry } from '../types';
import { EASY_ENDLESS_WORDS } from './easyEndlessWords';
import { levels } from './levels';
import { themes } from './themes';
import { findBonusDictionaryWord } from '../game/bonusDictionary';
import { levelDifficulty } from '../game/difficulty';
import { normalizeWord } from '../game/normalize';
import approvedWordData from '../../vault/07-Production/word-quality-v1/approved-words.json';

export const FIRST_ENDLESS_LEVEL = 76;
export const MAX_LEVEL_ID = 10_000;

type Recipe = { anchor: WordEntry; companion: WordEntry; hidden: WordEntry[] };

// The independent word-quality review is the single gate for required targets.
// Bonus-dictionary membership alone is not enough to make a word a seal/star objective.
const approvedWordSet = new Set(approvedWordData.words.map(normalizeWord));
const easyWordSet = new Set(EASY_ENDLESS_WORDS.map(normalizeWord));
const endlessWordOrder = new Map(
  [...EASY_ENDLESS_WORDS, ...approvedWordData.words.filter((word) => !easyWordSet.has(normalizeWord(word)))]
    .map((word, index) => [normalizeWord(word), index]),
);
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

function buildReviewedWordBank(): WordEntry[] {
  const byWord = new Map<string, WordEntry>();
  for (const level of levels) {
    for (const entry of level.mainWords) {
      const key = normalizeWord(entry.word);
      if (approvedWordSet.has(key) && entry.meaning.length >= 10) byWord.set(key, entry);
    }
  }
  for (const word of approvedWordData.words) {
    const key = normalizeWord(word);
    const entry = findBonusDictionaryWord(key);
    if (entry?.meaning && entry.meaning.length >= 10 && !byWord.has(key)) byWord.set(key, entry);
  }
  return [...byWord.values()].sort(
    (a, b) => (endlessWordOrder.get(normalizeWord(a.word)) ?? 0) - (endlessWordOrder.get(normalizeWord(b.word)) ?? 0),
  );
}

function buildRecipes(): Recipe[] {
  const words = buildReviewedWordBank();
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
        anchor,
        companion,
        hidden,
      });
    }
  }

  if (recipes.length < 12) {
    throw new Error(`Endless level bank needs at least 12 approved recipes; found ${recipes.length}.`);
  }
  const recipeDifficulty = (recipe: Recipe) => levelDifficulty({
    letters: Array.from(normalizeWord(recipe.anchor.word)),
    mainWords: [recipe.anchor, recipe.companion],
    hiddenWords: recipe.hidden,
  });
  const sorted = recipes.sort((a, b) => recipeDifficulty(a) - recipeDifficulty(b));
  const recovery = sorted.filter((recipe) => recipeDifficulty(recipe) <= 9.5);
  const rising = sorted.filter((recipe) => recipeDifficulty(recipe) > 9.5);
  const paced: Recipe[] = [];
  while (recovery.length > 0) {
    const low = recovery[0];
    const lowScore = recipeDifficulty(low);
    const candidates = rising.filter((recipe) => {
      const increase = recipeDifficulty(recipe) - lowScore;
      return increase >= 1.25 && increase <= 4;
    });
    if (candidates.length < 4) {
      recovery.shift();
      continue;
    }
    const selected = candidates.slice(-4);
    selected.forEach((recipe) => rising.splice(rising.indexOf(recipe), 1));
    paced.push(low, ...selected.sort((a, b) => recipeDifficulty(a) - recipeDifficulty(b)));
    recovery.shift();
  }
  if (paced.length < 175) {
    throw new Error(`Endless level bank needs at least 175 runtime-paced approved recipes; found ${paced.length}.`);
  }
  return paced;
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
