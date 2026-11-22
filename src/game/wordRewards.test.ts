import { describe, expect, it } from 'vitest';
import { getBonusWordReward } from './wordRewards';

describe('getBonusWordReward', () => {
  it('rewards longer words more, up to the current ceiling', () => {
    expect(getBonusWordReward('ERK', 0)).toBe(1);
    expect(getBonusWordReward('KARE', 0)).toBe(2);
    expect(getBonusWordReward('MERAK', 0)).toBe(3);
    expect(getBonusWordReward('KELİMELER', 0)).toBe(3);
  });

  it('fades the ceiling 3, 2, 1, 1 and then pays nothing', () => {
    expect(getBonusWordReward('MERAK', 1)).toBe(2);
    expect(getBonusWordReward('MERAK', 2)).toBe(1);
    expect(getBonusWordReward('MERAK', 3)).toBe(1);
    expect(getBonusWordReward('MERAK', 4)).toBe(0);
    expect(getBonusWordReward('MERAK', 8)).toBe(0);
  });

  it('never pays a short word more than its length reward', () => {
    expect(getBonusWordReward('ERK', 0)).toBeLessThanOrEqual(1);
    expect(getBonusWordReward('KARE', 1)).toBe(2);
  });
});
