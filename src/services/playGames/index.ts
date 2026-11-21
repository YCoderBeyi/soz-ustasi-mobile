import { Capacitor } from '@capacitor/core';
import { PLAY_GAMES_LEADERBOARDS, isLeaderboardConfigured, type PlayGamesLeaderboardKey } from './ids';
import { shouldSubmitToLeague, totalMasteryStars } from './league';
import type { LevelMastery } from '../../types';

export { PLAY_GAMES_LEADERBOARDS, isLeaderboardConfigured, shouldSubmitToLeague, totalMasteryStars };
export type { PlayGamesLeaderboardKey };

export type LeagueStanding = {
  score: number;
  rank: number | null;
  displayRank: string;
  displayScore: string;
};

const isNativeAndroid = () => Capacitor.getPlatform() === 'android';

/** Lazy: plugin CJS breaks Vitest ESM when imported at module top-level. */
async function getPlayGames() {
  const mod = await import('@modbender/capacitor-play-games');
  return mod.PlayGames;
}

let initialized = false;
async function ensureInitialized() {
  if (initialized) return;
  const PlayGames = await getPlayGames();
  await PlayGames.initialize();
  initialized = true;
}

export async function isPlayGamesAvailable(): Promise<boolean> {
  return isNativeAndroid();
}

export async function ensurePlayGamesSignedIn(interactive = false): Promise<boolean> {
  if (!isNativeAndroid()) return false;
  try {
    await ensureInitialized();
    const PlayGames = await getPlayGames();
    const silent = await PlayGames.signIn({ silent: true });
    if (silent.signedIn) return true;
    if (!interactive) return false;
    const prompted = await PlayGames.signIn({ silent: false });
    return prompted.signedIn;
  } catch {
    return false;
  }
}

export async function submitLeagueScores(input: {
  leagueOptIn: boolean;
  calmMode: boolean;
  levelScore: number;
  levelMastery: Record<number, LevelMastery | undefined>;
}): Promise<{ submitted: boolean; reason?: string }> {
  if (!shouldSubmitToLeague(input.leagueOptIn, input.calmMode)) {
    return { submitted: false, reason: input.calmMode ? 'calm' : 'opt-out' };
  }
  if (!isNativeAndroid()) return { submitted: false, reason: 'web' };

  const signedIn = await ensurePlayGamesSignedIn(true);
  if (!signedIn) return { submitted: false, reason: 'signed-out' };

  const PlayGames = await getPlayGames();
  const weeklyId = PLAY_GAMES_LEADERBOARDS.weeklyScore;
  const starsId = PLAY_GAMES_LEADERBOARDS.regionStars;
  const tasks: Promise<unknown>[] = [];

  if (isLeaderboardConfigured(weeklyId) && input.levelScore > 0) {
    tasks.push(PlayGames.submitScore({ leaderboardId: weeklyId, score: Math.floor(input.levelScore) }));
  }
  if (isLeaderboardConfigured(starsId)) {
    const stars = totalMasteryStars(input.levelMastery);
    tasks.push(PlayGames.submitScore({ leaderboardId: starsId, score: Math.floor(stars) }));
  }

  if (tasks.length === 0) return { submitted: false, reason: 'unconfigured' };
  await Promise.allSettled(tasks);
  return { submitted: true };
}

export async function loadLeagueStanding(key: PlayGamesLeaderboardKey): Promise<LeagueStanding | null> {
  if (!isNativeAndroid()) return null;
  const leaderboardId = PLAY_GAMES_LEADERBOARDS[key];
  if (!isLeaderboardConfigured(leaderboardId)) return null;
  const signedIn = await ensurePlayGamesSignedIn(false);
  if (!signedIn) return null;
  try {
    const PlayGames = await getPlayGames();
    const { score } = await PlayGames.loadCurrentPlayerScore({
      leaderboardId,
      timeSpan: key === 'weeklyScore' ? 'weekly' : 'allTime',
      collection: 'public',
    });
    if (!score) return null;
    return {
      score: score.rawScore ?? 0,
      rank: typeof score.rank === 'number' && score.rank > 0 ? score.rank : null,
      displayRank: score.displayRank || '—',
      displayScore: score.displayScore || String(score.rawScore ?? 0),
    };
  } catch {
    return null;
  }
}

export async function showLeagueBoard(key: PlayGamesLeaderboardKey): Promise<boolean> {
  if (!isNativeAndroid()) return false;
  const leaderboardId = PLAY_GAMES_LEADERBOARDS[key];
  if (!isLeaderboardConfigured(leaderboardId)) return false;
  const signedIn = await ensurePlayGamesSignedIn(true);
  if (!signedIn) return false;
  const PlayGames = await getPlayGames();
  await PlayGames.showLeaderboard({
    leaderboardId,
    timeSpan: key === 'weeklyScore' ? 'weekly' : 'allTime',
    collection: 'public',
  });
  return true;
}
