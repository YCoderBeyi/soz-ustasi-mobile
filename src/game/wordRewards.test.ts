import { describe, expect, it } from 'vitest';
import { getBonusWordReward } from './wordRewards';

describe('getBonusWordReward', () => {
  it('rewards words by length', () => {
    expect(getBonusWordReward('ERK', 0)).toBe(1);
    expect(getBonusWordReward('KARE', 0)).toBe(2);
    expect(getBonusWordReward('MERAK', 0)).toBe(3);
    expect(getBonusWordReward('KELİMELER', 0)).toBe(3);
  });

  it('stops paying after five rewarded bonus words', () => {
    expect(getBonusWordReward('MERAK', 4)).toBe(3);
    expect(getBonusWordReward('MERAK', 5)).toBe(0);
    expect(getBonusWordReward('MERAK', 8)).toBe(0);
  });
});
