/**
 * Play Console → Play Games Services → Leaderboards.
 * Replace placeholders after creating boards in the console.
 */
export const PLAY_GAMES_LEADERBOARDS = {
  /** Play Console: "Haftalık Puan" — UI opens with WEEKLY time span. */
  weeklyScore: 'Cgklg4fap68eEAIQAg',
  /** Play Console: "Söz Ustaları" — cumulative mastery stars (ALL_TIME). */
  regionStars: 'Cgklg4fap68eEAIQAQ',
} as const;

export type PlayGamesLeaderboardKey = keyof typeof PLAY_GAMES_LEADERBOARDS;

export function isLeaderboardConfigured(id: string): boolean {
  return Boolean(id) && !id.startsWith('REPLACE_');
}
