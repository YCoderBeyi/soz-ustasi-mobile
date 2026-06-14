import { describe, it, expect } from 'vitest';
import { levels } from './levels';
import { getTheme } from './themes';
import { getLevelStory } from './levelStories';
import { buildCrosswordLayout } from '../game/crossword';
import { normalizeWord } from '../game/normalize';

describe('level data integrity', () => {
  for (const level of levels) {
    it(`Level ${level.levelId}: geçerli tema referansı`, () => {
      expect(getTheme(level.themeId).themeId).toBe(level.themeId);
    });

    it(`Level ${level.levelId}: geçerli story referansı`, () => {
      const story = getLevelStory(level.levelId);
      expect(story.levelId).toBe(level.levelId);
    });

    it(`Level ${level.levelId}: en az 2 ana kelime`, () => {
      expect(level.mainWords.length).toBeGreaterThanOrEqual(2);
    });

    it(`Level ${level.levelId}: her kelimenin harfleri havuzda yeterli sayıda`, () => {
      const pool = level.letters.map((l) => normalizeWord(l));
      const words = [...level.mainWords, ...level.hiddenWords];
      for (const entry of words) {
        const wordLetters = [...entry.word].map((c) => normalizeWord(c));
        const poolCopy = [...pool];
        for (const letter of wordLetters) {
          const idx = poolCopy.indexOf(letter);
          expect(idx, `${entry.word} → '${letter}' normalize edilmiş hali havuzda yok (${pool.join(',')})`).not.toBe(-1);
          poolCopy.splice(idx, 1);
        }
      }
    });

    it(`Level ${level.levelId}: tüm ana kelimeler benzersiz (normalize)`, () => {
      const normalized = level.mainWords.map((w) => normalizeWord(w.word));
      expect(new Set(normalized).size).toBe(normalized.length);
    });

    it(`Level ${level.levelId}: tüm gizli kelimeler benzersiz (normalize)`, () => {
      const normalized = level.hiddenWords.map((w) => normalizeWord(w.word));
      expect(new Set(normalized).size).toBe(normalized.length);
    });

    it(`Level ${level.levelId}: gizli kelimeler ana kelimelerden farklı`, () => {
      const mainNorm = new Set(level.mainWords.map((w) => normalizeWord(w.word)));
      for (const hw of level.hiddenWords) {
        expect(mainNorm.has(normalizeWord(hw.word))).toBe(false);
      }
    });

    it(`Level ${level.levelId}: pozitif ödül`, () => {
      expect(level.reward.baseCoin).toBeGreaterThan(0);
      expect(level.reward.hiddenWordBonus).toBeGreaterThan(0);
    });

    it(`Level ${level.levelId}: kelimeler boş değil`, () => {
      for (const entry of level.mainWords) {
        expect(entry.word.length).toBeGreaterThan(0);
        expect(entry.meaning.length).toBeGreaterThan(0);
      }
      for (const entry of level.hiddenWords) {
        expect(entry.word.length).toBeGreaterThan(0);
        expect(entry.meaning.length).toBeGreaterThan(0);
      }
    });
  }
});

describe('crossword layout generation', () => {
  for (const level of levels) {
    it(`Level ${level.levelId}: buildCrosswordLayout sonuç verir`, () => {
      const result = buildCrosswordLayout(level.mainWords);
      expect(result).not.toBeNull();
      if (result) {
        expect(result.placements.length).toBe(level.mainWords.length);
        expect(result.cells.length).toBeGreaterThan(0);
        // Her hücrenin koordinatları 0 tabanlı
        for (const cell of result.cells) {
          expect(cell.row).toBeGreaterThanOrEqual(0);
          expect(cell.col).toBeGreaterThanOrEqual(0);
          expect(cell.row).toBeLessThan(result.rowCount);
          expect(cell.col).toBeLessThan(result.colCount);
        }
      }
    });
  }
});
