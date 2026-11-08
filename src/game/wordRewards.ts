// Bonus coins fade out per level so the loop pays in score, not in coin inflation.
const BONUS_COIN_CURVE: readonly number[] = [3, 2, 1, 1];

export function getBonusWordReward(word: string, rewardedCount: number): number {
  const ceiling = BONUS_COIN_CURVE[rewardedCount] ?? 0;
  const length = [...word].length;
  const byLength = length <= 3 ? 1 : length === 4 ? 2 : 3;
  return Math.min(byLength, ceiling);
}
