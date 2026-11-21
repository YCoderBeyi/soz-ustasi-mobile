/**
 * Play Console → Play Games Services → Leaderboards.
 * Replace placeholders after creating boards in the console.
 */
export const PLAY_GAMES_LEADERBOARDS = {
  /** Weekly all-time-high style board; UI opens with WEEKLY time span. */
  weeklyScore: 'REPLACE_LEADERBOARD_WEEKLY_SCORE',
  /** Cumulative region mastery stars (all-time). */
  regionStars: 'REPLACE_LEADERBOARD_REGION_STARS',
} as const;

export type PlayGamesLeaderboardKey = keyof typeof PLAY_GAMES_LEADERBOARDS;

export function isLeaderboardConfigured(id: string): boolean {
  return Boolean(id) && !id.startsWith('REPLACE_');
}
