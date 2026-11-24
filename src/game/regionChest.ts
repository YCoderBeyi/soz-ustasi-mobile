/** Region-completion chest reward contract shared by briefing and award flow. */
export const REGION_CHEST_COINS = 150;
export const LEVELS_PER_REGION = 6;

export function getRegionChestCoins(levelId: number): number {
  return levelId > 0 && levelId % LEVELS_PER_REGION === 0 ? REGION_CHEST_COINS : 0;
}
