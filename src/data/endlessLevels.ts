import type { LevelData, WordEntry } from '../types';
import { EASY_ENDLESS_WORDS } from './easyEndlessWords';
import { levels } from './levels';
import { themes } from './themes';
import { findBonusDictionaryWord } from '../game/bonusDictionary';
import { levelDifficulty } from '../game/difficulty';
import { normalizeWord } from '../game/normalize';
import approvedWordData from '../../vault/07-Production/word-quality-v1/approved-words.json';

export const FIRST_ENDLESS_LEVEL = 76;

type Recipe = { anchor: WordEntry; companion: WordEntry; hidden: WordEntry[]; letters: string[] };

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
const authoredLetterPools = new Set(
  levels.map((level) => level.letters.map(normalizeWord).sort().join('')),
);

function mergeLetterPools(first: string, second: string): string[] {
  const counts = new Map<string, number>();
  for (const word of [first, second]) {
    const wordCounts = new Map<string, number>();
    for (const letter of Array.from(normalizeWord(word))) {
      wordCounts.set(letter, (wordCounts.get(letter) ?? 0) + 1);
    }
    for (const [letter, count] of wordCounts) {
      counts.set(letter, Math.max(counts.get(letter) ?? 0, count));
    }
  }
  return [...counts].sort(([a], [b]) => a.localeCompare(b, 'tr'))
    .flatMap(([letter, count]) => Array(count).fill(letter));
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
  const words = buildReviewedWordBank().filter((entry) => {
    const length = Array.from(normalizeWord(entry.word)).length;
    return length >= 3 && length <= 6;
  });
  const wordProfiles = words.map((entry) => {
    const counts = new Map<string, number>();
    for (const letter of Array.from(normalizeWord(entry.word))) {
      counts.set(letter, (counts.get(letter) ?? 0) + 1);
    }
    return { entry, key: normalizeWord(entry.word), counts: [...counts] };
  });
  const recipes: Recipe[] = [];
  const seen = new Set<string>();
  const seenLetterPools = new Set(authoredLetterPools);
  const hiddenWordsByPool = new Map<string, typeof wordProfiles>();

  for (let firstIndex = 0; firstIndex < words.length; firstIndex += 1) {
    const anchor = words[firstIndex];
    const anchorKey = normalizeWord(anchor.word);
    for (const companion of words.slice(firstIndex + 1)) {
      const companionKey = normalizeWord(companion.word);
      const pairKey = [anchorKey, companionKey].sort().join('|');
      if (authoredPairs.has(pairKey) || seen.has(pairKey)) continue;

      const letters = mergeLetterPools(anchor.word, companion.word);
      if (letters.length > 8) continue;
      // Both required answers must intersect so the shared crossword renderer can place them.
      if (![...anchorKey].some((letter) => companionKey.includes(letter))) continue;
      const poolKey = letters.join('');
      if (seenLetterPools.has(poolKey)) continue;
      seen.add(pairKey);
      seenLetterPools.add(poolKey);

      let hiddenCandidates = hiddenWordsByPool.get(poolKey);
      if (!hiddenCandidates) {
        const poolCounts = new Map<string, number>();
        for (const letter of letters) poolCounts.set(letter, (poolCounts.get(letter) ?? 0) + 1);
        hiddenCandidates = wordProfiles.filter((profile) =>
          profile.counts.every(([letter, count]) => count <= (poolCounts.get(letter) ?? 0)),
        );
        hiddenWordsByPool.set(poolKey, hiddenCandidates);
      }
      const hidden = hiddenCandidates
        .filter((profile) => profile.key !== anchorKey && profile.key !== companionKey)
        .slice(0, 3)
        .map(({ entry }) => ({ ...entry, reward: 5 }));
      recipes.push({ anchor, companion, hidden, letters });
    }
  }

  if (recipes.length === 0) {
    throw new Error('Endless level bank needs at least one unique, reviewed, crossable word pair.');
  }
  const recipeDifficulty = (recipe: Recipe) => levelDifficulty({
    letters: recipe.letters,
    mainWords: [recipe.anchor, recipe.companion],
    hiddenWords: recipe.hidden,
  });
  // Finite difficulty pacing: recovery levels alternate with nearby challenges,
  // then every remaining unique recipe is used once in ascending difficulty.
  const sorted = recipes
    .map((recipe) => ({ recipe, difficulty: recipeDifficulty(recipe) }))
    .sort((a, b) => a.difficulty - b.difficulty
      || (endlessWordOrder.get(normalizeWord(a.recipe.anchor.word)) ?? 0) - (endlessWordOrder.get(normalizeWord(b.recipe.anchor.word)) ?? 0)
      || (endlessWordOrder.get(normalizeWord(a.recipe.companion.word)) ?? 0) - (endlessWordOrder.get(normalizeWord(b.recipe.companion.word)) ?? 0))
  const recovery = sorted.filter(({ difficulty }) => difficulty <= 9.5);
  const rising = sorted.filter(({ difficulty }) => difficulty > 9.5);
  const paced: Recipe[] = [];
  while (recovery.length > 0) {
    const low = recovery.shift()!;
    const candidates = rising.filter(({ difficulty }) => difficulty - low.difficulty >= 1.25
      && difficulty - low.difficulty <= 4);
    const selected = candidates.slice(-4);
    for (const recipe of selected) rising.splice(rising.indexOf(recipe), 1);
    paced.push(low.recipe, ...selected.map(({ recipe }) => recipe));
  }
  paced.push(...rising.map(({ recipe }) => recipe));
  return paced;
}

const recipes = buildRecipes();
export const MAX_LEVEL_ID = FIRST_ENDLESS_LEVEL + recipes.length - 1;

function makeEndlessLevel(levelId: number): LevelData | undefined {
  const recipe = recipes[levelId - FIRST_ENDLESS_LEVEL];
  if (!recipe) return undefined;
  const regionStart = Math.floor((levelId - 1) / 6) * 6 + 1;
  const themeIndex = regionStart <= levels.length
    ? themes.findIndex((theme) => theme.themeId === levels[regionStart - 1]?.themeId)
    : Math.floor((regionStart - FIRST_ENDLESS_LEVEL) / 6) % themes.length;
  const letters = recipe.letters;
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
    const nextLevel = makeEndlessLevel(nextId);
    if (!nextLevel) break;
    levels.push(nextLevel);
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
