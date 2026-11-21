import { describe, expect, it } from 'vitest';
import { shouldSubmitToLeague, totalMasteryStars } from './league';

describe('league helpers', () => {
  it('requires opt-in and rejects calm mode', () => {
    expect(shouldSubmitToLeague(true, false)).toBe(true);
    expect(shouldSubmitToLeague(false, false)).toBe(false);
    expect(shouldSubmitToLeague(true, true)).toBe(false);
  });

  it('sums mastery stars across levels', () => {
    expect(totalMasteryStars({
      1: { stars: 3, objectives: ['complete', 'discovery', 'noHint'] },
      2: { stars: 1, objectives: ['complete'] },
      3: undefined,
    })).toBe(4);
  });
});
