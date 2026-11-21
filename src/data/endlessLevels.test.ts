import { describe, expect, it } from 'vitest';
import { getLevelStory, levelStories } from './levelStories';
import { ensureLevelsThrough, getEndlessRecipeCount, getLevelById, MAX_LEVEL_ID } from './endlessLevels';
import { normalizeWord } from '../game/normalize';
import { buildCrosswordLayout } from '../game/crossword';
import { levelDifficulty } from '../game/difficulty';
import approvedWordData from '../../vault/07-Production/word-quality-v1/approved-words.json';
import requiredTargetExclusions from '../../vault/07-Production/word-quality-v1/required-target-exclusions.json';

const approvedWords = new Set(approvedWordData.words.map(normalizeWord));

function canBuild(word: string, letters: string[]): boolean {
  const counts = new Map<string, number>();
  for (const letter of letters) counts.set(normalizeWord(letter), (counts.get(normalizeWord(letter)) ?? 0) + 1);
  for (const letter of Array.from(normalizeWord(word))) {
    const count = counts.get(letter) ?? 0;
    if (count === 0) return false;
    counts.set(letter, count - 1);
  }
  return true;
}

describe('endless level generation', () => {
  it('marks authored cards without an editorial sign-off as drafts', () => {
    expect(levelStories).toHaveLength(75);
    expect(levelStories.every((card) => ['draft', 'reviewed', 'approved'].includes(card.contentReviewStatus ?? ''))).toBe(true);
    expect(getLevelStory(46).contentReviewStatus).toBe('draft');
  });

  it('fills the supported progression with unique approved-word recipes and has no replay cycle', () => {
    expect(getEndlessRecipeCount()).toBe(MAX_LEVEL_ID - 76 + 1);
    expect(getEndlessRecipeCount()).toBeGreaterThan(5_000);
    expect(getLevelById(MAX_LEVEL_ID + 1)).toBeUndefined();
  });

  it('creates short, meaning-backed goals whose letters are always buildable', () => {
    const level = getLevelById(76);
    expect(level).toBeDefined();
    expect(level?.mainWords).toHaveLength(2);
    expect(level?.letters.length).toBeLessThanOrEqual(6);
    for (const word of level?.mainWords ?? []) {
      expect(word.meaning.length).toBeGreaterThanOrEqual(10);
      expect(canBuild(word.word, level?.letters ?? [])).toBe(true);
    }
    for (const word of level?.hiddenWords ?? []) {
      expect(canBuild(word.word, level?.letters ?? [])).toBe(true);
    }
  });

  it('keeps every recipe solvable and unique across the supported progression', () => {
    const count = getEndlessRecipeCount();
    const generatedLevels = Array.from({ length: count }, (_, index) => getLevelById(76 + index)!);
    const pairs = generatedLevels.map((level) => level.mainWords.map((word) => normalizeWord(word.word)).sort().join('|'));
    expect(new Set(pairs).size).toBe(count);
    expect(new Set(generatedLevels.map((level) => level.letters.map(normalizeWord).sort().join(''))).size).toBe(count);
    for (const level of generatedLevels) {
      expect(level.mainWords).toHaveLength(2);
      expect(level.letters.length).toBeLessThanOrEqual(8);
      expect(level.hiddenWords.length).toBeLessThanOrEqual(3);
      for (const word of [...level.mainWords, ...level.hiddenWords]) {
        expect(word.meaning.length).toBeGreaterThanOrEqual(10);
        expect(canBuild(word.word, level.letters)).toBe(true);
      }
    }
  }, 30_000);

  it('never promotes unreviewed bonus-dictionary words into required targets', () => {
    const count = getEndlessRecipeCount();
    const generatedLevels = Array.from({ length: count }, (_, index) => getLevelById(76 + index)!);
    for (const level of generatedLevels) {
      for (const word of [...level.mainWords, ...level.hiddenWords]) {
        expect(approvedWords.has(normalizeWord(word.word)), `Level ${level.levelId}: ${word.word}`).toBe(true);
      }
    }
  });

  it('never promotes target-excluded forms into generated main or hidden goals', () => {
    const excluded = new Set(Object.keys(requiredTargetExclusions).map(normalizeWord));
    for (let levelId = 76; levelId <= MAX_LEVEL_ID; levelId += 1) {
      const level = getLevelById(levelId)!;
      for (const word of [...level.mainWords, ...level.hiddenWords]) {
        expect(excluded.has(normalizeWord(word.word)), `Level ${levelId}: ${word.word}`).toBe(false);
      }
    }
  });

  it('keeps adjacent generated challenge jumps bounded', () => {
    const count = getEndlessRecipeCount();
    const scores = Array.from({ length: count }, (_, index) => levelDifficulty(getLevelById(76 + index)!));
    for (let index = 1; index < scores.length; index += 1) {
      expect(
        scores[index] - scores[index - 1],
        `Generated level ${76 + index}: ${scores[index - 1]} → ${scores[index]}`,
      ).toBeLessThanOrEqual(4);
    }
  });

  it('extends progression with a truthful, explicitly unreviewed word card', () => {
    ensureLevelsThrough(120);
    expect(getLevelById(120)?.levelId).toBe(120);
    const card = getLevelStory(76);
    expect(card.era).toBe('Kelime bilgisi');
    expect(card.body).toContain(getLevelById(76)?.mainWords[0].word ?? '');
    expect(card.body).not.toContain(getLevelStory(1).title);
    expect(card.title).toBe('Kelime turu tamamlandı');
    expect(card.body).not.toContain('yeni kelimeler');
    expect(card.contentReviewStatus).toBe('draft');

    expect(getLevelById(MAX_LEVEL_ID + 1)).toBeUndefined();
  });

  it('supports a solvable path from the first generated level through the final level', () => {
    ensureLevelsThrough(MAX_LEVEL_ID);
    for (let levelId = 76; levelId <= MAX_LEVEL_ID; levelId += 1) {
      const level = getLevelById(levelId);
      expect(level?.levelId).toBe(levelId);
      expect(buildCrosswordLayout(level?.mainWords ?? [])).not.toBeNull();
      for (const word of [...(level?.mainWords ?? []), ...(level?.hiddenWords ?? [])]) {
        expect(word.meaning.length, `Seviye ${levelId}: ${word.word} anlamı`).toBeGreaterThanOrEqual(10);
        expect(canBuild(word.word, level?.letters ?? []), `Seviye ${levelId}: ${word.word}`).toBe(true);
      }
    }
    expect(getLevelById(MAX_LEVEL_ID + 1)).toBeUndefined();
  }, 30_000);
});
