import { describe, expect, it } from 'vitest';
import { skinEvolution, skinForLevel } from './tileSkins';

describe('tile skins', () => {
  it('keeps the first ten levels classic', () => {
    for (let id = 1; id <= 10; id += 1) expect(skinForLevel(id)).toBe('classic');
  });

  it('rotates candy, fruit, block every ten levels and is deterministic', () => {
    expect([11, 20, 21, 30, 31, 40, 41].map(skinForLevel)).toEqual([
      'candy', 'candy', 'fruit', 'fruit', 'block', 'block', 'candy',
    ]);
    expect(skinForLevel(57)).toBe(skinForLevel(57));
  });

  it('maps multiplier tiers to three evolution steps', () => {
    expect([0, 1, 2, 3].map(skinEvolution)).toEqual([0, 1, 2, 2]);
  });
});

import { blendHex, contrastRatio } from './contrast';
import { EVOLUTION_GLOSS_ALPHA, TILE_SKIN_PALETTES } from './tileSkins';

describe('tile skin contrast', () => {
  it('computes known WCAG ratios', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 0);
    expect(contrastRatio('#777777', '#777777')).toBeCloseTo(1, 5);
  });

  it.each(Object.entries(TILE_SKIN_PALETTES))('%s keeps letters and clue numbers readable on every gradient stop, glossy included', (_name, p) => {
    for (const stop of [p.from, p.to]) {
      expect(contrastRatio(p.ink, stop)).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(p.ink, blendHex(stop, '#ffffff', EVOLUTION_GLOSS_ALPHA))).toBeGreaterThanOrEqual(4.5);
      expect(contrastRatio(p.num, stop)).toBeGreaterThanOrEqual(3);
    }
  });
});
