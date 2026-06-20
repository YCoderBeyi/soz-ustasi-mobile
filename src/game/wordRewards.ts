export const MAX_REWARDED_BONUS_WORDS = 5;

export function getBonusWordReward(word: string, rewardedCount: number): number {
  if (rewardedCount >= MAX_REWARDED_BONUS_WORDS) return 0;
  const length = [...word].length;
  if (length <= 3) return 1;
  if (length === 4) return 2;
  return 3;
}
