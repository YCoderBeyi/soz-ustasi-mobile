import { describe, expect, it } from 'vitest';
import { levelDifficulty } from '../game/difficulty';
import { findCatalogWord } from '../game/lexicon';
import { levels } from './levels';

const scores = levels.map((level) => ({ id: level.levelId, d: levelDifficulty(level) }));

// A step bigger than this is a "wall". There are no structural walls left; if a future level needs one,
// list it here with a reason and the test insists the entry stays honest.
const MAX_STEP = 4;
const STRUCTURAL_WALLS: Record<number, string> = {};

describe('difficulty curve', () => {
  it('gives the player a breather in every block of five levels', () => {
    for (let start = 0; start + 5 <= scores.length; start += 5) {
      const block = scores.slice(start, start + 5).map((s) => s.d);
      const average = block.reduce((a, b) => a + b, 0) / block.length;
      const lowest = Math.min(...block);
      expect(
        average - lowest,
        `Level ${start + 1}-${start + 5}: nefes alma yok (ortalama ${average.toFixed(1)}, en dusuk ${lowest.toFixed(1)})`,
      ).toBeGreaterThanOrEqual(1);
    }
  });

  it('has no sudden wall except the documented structural ones', () => {
    for (let i = 1; i < scores.length; i += 1) {
      const step = scores[i].d - scores[i - 1].d;
      const id = scores[i].id;
      if (STRUCTURAL_WALLS[id]) {
        expect(step, `Level ${id} artik duvar degil, STRUCTURAL_WALLS listesinden cikar`).toBeGreaterThan(MAX_STEP);
      } else {
        expect(step, `Level ${id}: ${step.toFixed(1)} puanlik ani zorluk sicramasi`).toBeLessThanOrEqual(MAX_STEP);
      }
    }
  });

  it('never asks for fewer than two words to open a seal', () => {
    for (const level of levels) expect(level.mainWords.length, `Level ${level.levelId}`).toBeGreaterThanOrEqual(2);
  });

  it('keeps every word removed to ease a level as an accepted bonus word', () => {
    // Easing a level must not punish a player who still types a real word they know.
    for (const word of ['HAL', 'VALİ', 'ASMA', 'ALMA', 'İLK']) {
      expect(findCatalogWord(word), word).toBeDefined();
    }
  });
});
