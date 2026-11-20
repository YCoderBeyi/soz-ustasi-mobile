import { describe, expect, it } from 'vitest';
import { SEAL_CONFETTI_COUNT, shouldShowSealConfetti } from './sealRevealFx';

describe('sealRevealFx', () => {
  it('confetti sayısı üst sınırın altında (≤34)', () => {
    expect(SEAL_CONFETTI_COUNT).toBeLessThanOrEqual(34);
    expect(SEAL_CONFETTI_COUNT).toBe(28);
  });

  it.each([
    { reduceMotion: true, calmMode: false, show: false },
    { reduceMotion: false, calmMode: true, show: false },
    { reduceMotion: true, calmMode: true, show: false },
    { reduceMotion: false, calmMode: false, show: true },
  ])('reduceMotion=$reduceMotion calmMode=$calmMode → confetti=$show', ({ reduceMotion, calmMode, show }) => {
    expect(shouldShowSealConfetti(reduceMotion, calmMode)).toBe(show);
  });
});