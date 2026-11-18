import { describe, expect, it } from 'vitest';
import { getLevelStory } from './levelStories';
import { ensureLevelsThrough, getEndlessRecipeCount, getLevelById, MAX_LEVEL_ID } from './endlessLevels';
import { normalizeWord } from '../game/normalize';
import { buildCrosswordLayout } from '../game/crossword';

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
  it('keeps the reviewed main-word pair cycle broad', () => {
    expect(getEndlessRecipeCount()).toBeGreaterThanOrEqual(175);
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

  it('keeps every recipe in the first cycle solvable and unique', () => {
    const count = getEndlessRecipeCount();
    const cycle = Array.from({ length: count }, (_, index) => getLevelById(76 + index)!);
    const pairs = cycle.map((level) => level.mainWords.map((word) => normalizeWord(word.word)).join('|'));
    expect(new Set(pairs).size).toBe(count);
    for (const level of cycle) {
      expect(level.mainWords).toHaveLength(2);
      expect(level.letters.length).toBeLessThanOrEqual(6);
      expect(level.hiddenWords.length).toBeLessThanOrEqual(3);
      for (const word of [...level.mainWords, ...level.hiddenWords]) {
        expect(word.meaning.length).toBeGreaterThanOrEqual(10);
        expect(canBuild(word.word, level.letters)).toBe(true);
      }
    }
  });

  it('extends progression and gives generated levels word-meaning cards', () => {
    ensureLevelsThrough(120);
    expect(getLevelById(120)?.levelId).toBe(120);
    const card = getLevelStory(120);
    expect(card.era).toBe('Kelime bilgisi');
    expect(card.body).toContain(getLevelById(120)?.mainWords[0].word ?? '');
    expect(card.body).not.toContain(getLevelStory(1).title);
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
  });
});
