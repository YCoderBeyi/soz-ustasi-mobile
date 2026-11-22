import { describe, expect, it } from 'vitest';
import { updateLevelStats } from './levelStats';

describe('updateLevelStats bestScore', () => {
  it('keeps the highest score and never lowers it', () => {
    const first = updateLevelStats({}, 1, 40, 3, true, 300);
    const lower = updateLevelStats(first, 1, 35, 4, true, 120);
    const higher = updateLevelStats(lower, 1, 30, 5, true, 450);
    expect(first[1].bestScore).toBe(300);
    expect(lower[1].bestScore).toBe(300);
    expect(higher[1].bestScore).toBe(450);
  });

  it('treats saves without bestScore as zero', () => {
    const old = { 1: { bestTime: 50, bestStreak: 2, attempts: 1, completions: 1 } };
    expect(updateLevelStats(old, 1, 40, 2, true, 90)[1].bestScore).toBe(90);
  });
});
