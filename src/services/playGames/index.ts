import { Capacitor } from '@capacitor/core';
import { PLAY_GAMES_LEADERBOARDS, isLeaderboardConfigured, type PlayGamesLeaderboardKey } from './ids';
import { shouldSubmitToLeague, totalMasteryStars } from './league';
import type { LevelMastery } from '../../types';
import type { LeaderboardScore, PlayerInfo } from '@modbender/capacitor-play-games';

export { PLAY_GAMES_LEADERBOARDS, isLeaderboardConfigured, shouldSubmitToLeague, totalMasteryStars };
export type { PlayGamesLeaderboardKey };

export type LeagueStandingValue = {
  score: number;
  rank: number | null;
  displayRank: string;
  displayScore: string;
};

export type LeagueStanding =
  | { status: 'ok'; standing: LeagueStandingValue }
  | { status: 'no-score' | 'signed-out' | 'unavailable' }
  | { status: 'error'; detail?: 'sign-in-failed' | 'load-failed' };

export type LeaguePreview = {
  player: PlayerInfo;
  scores: LeaderboardScore[];
  ownScore: LeaderboardScore | null;
};

const isNativeAndroid = () => Capacitor.getPlatform() === 'android';

/** Lazy: plugin CJS breaks Vitest ESM when imported at module top-level. */
let playGamesImportFlight: Promise<typeof import('@modbender/capacitor-play-games').PlayGames> | null = null;
async function getPlayGames() {
  if (!playGamesImportFlight) {
    const flight = import('@modbender/capacitor-play-games').then((mod) => mod.PlayGames);
    playGamesImportFlight = flight;
    void flight.catch(() => {
      if (playGamesImportFlight === flight) playGamesImportFlight = null;
    });
  }
  return playGamesImportFlight;
}

let initializationFlight: Promise<void> | null = null;
async function ensureInitialized() {
  if (!initializationFlight) {
    const flight = (async () => {
      const PlayGames = await getPlayGames();
      await PlayGames.initialize();
    })();
    initializationFlight = flight;
    void flight.catch(() => {
      if (initializationFlight === flight) initializationFlight = null;
    });
  }
  await initializationFlight;
}

export async function isPlayGamesAvailable(): Promise<boolean> {
  return isNativeAndroid();
}

type SignInStatus = 'signed-in' | 'signed-out' | 'error' | 'unavailable';

async function performSilentSignIn(): Promise<SignInStatus> {
  try {
    await ensureInitialized();
    const PlayGames = await getPlayGames();
    const silent = await PlayGames.signIn({ silent: true });
    return silent.signedIn ? 'signed-in' : 'signed-out';
  } catch {
    return 'error';
  }
}

let silentSignInFlight: Promise<SignInStatus> | null = null;
let interactiveSignInFlight: Promise<SignInStatus> | null = null;

function getSilentSignIn(): Promise<SignInStatus> {
  if (interactiveSignInFlight) return interactiveSignInFlight;
  if (!silentSignInFlight) {
    const flight = performSilentSignIn();
    silentSignInFlight = flight;
    void flight.then(() => {
      if (silentSignInFlight === flight) silentSignInFlight = null;
    });
  }
  return silentSignInFlight;
}

function getInteractiveSignIn(): Promise<SignInStatus> {
  if (interactiveSignInFlight) return interactiveSignInFlight;
  const flight = (async (): Promise<SignInStatus> => {
    const silent = silentSignInFlight
      ? await silentSignInFlight
      : await performSilentSignIn();
    if (silent !== 'signed-out') return silent;
    try {
      await ensureInitialized();
      const PlayGames = await getPlayGames();
      const prompted = await PlayGames.signIn({ silent: false });
      return prompted.signedIn ? 'signed-in' : 'signed-out';
    } catch {
      return 'error';
    }
  })();
  interactiveSignInFlight = flight;
  void flight.then(() => {
    if (interactiveSignInFlight === flight) interactiveSignInFlight = null;
  });
  return flight;
}

async function signInStatus(interactive: boolean): Promise<SignInStatus> {
  if (!isNativeAndroid()) return 'unavailable';
  return interactive ? getInteractiveSignIn() : getSilentSignIn();
}

export async function ensurePlayGamesSignedIn(interactive = false): Promise<boolean> {
  return (await signInStatus(interactive)) === 'signed-in';
}

export async function submitLeagueScores(input: {
  leagueOptIn: boolean;
  calmMode: boolean;
  levelScore: number;
  levelMastery: Record<number, LevelMastery | undefined>;
}): Promise<{ submitted: boolean; reason?: string }> {
  try {
    if (!shouldSubmitToLeague(input.leagueOptIn, input.calmMode)) {
      return { submitted: false, reason: input.calmMode ? 'calm' : 'opt-out' };
    }
    if (!isNativeAndroid()) return { submitted: false, reason: 'web' };
    // Session completion is not an appropriate moment to open native auth UI.
    const auth = await signInStatus(false);
    if (auth !== 'signed-in') return { submitted: false, reason: auth === 'error' ? 'error' : 'signed-out' };

    const PlayGames = await getPlayGames();
    const weeklyId = PLAY_GAMES_LEADERBOARDS.weeklyScore;
    const starsId = PLAY_GAMES_LEADERBOARDS.regionStars;
    const tasks: { board: 'weekly' | 'stars'; promise: Promise<unknown> }[] = [];
    if (isLeaderboardConfigured(weeklyId) && input.levelScore > 0) {
      tasks.push({
        board: 'weekly',
        promise: PlayGames.submitScore({ leaderboardId: weeklyId, score: Math.floor(input.levelScore) }),
      });
    }
    if (isLeaderboardConfigured(starsId)) {
      const stars = totalMasteryStars(input.levelMastery);
      tasks.push({
        board: 'stars',
        promise: PlayGames.submitScore({ leaderboardId: starsId, score: Math.floor(stars) }),
      });
    }
    if (tasks.length === 0) return { submitted: false, reason: 'unconfigured' };

    const results = await Promise.allSettled(tasks.map(({ promise }) => promise));
    const successes = results.filter((result) => result.status === 'fulfilled').length;
    const failures = results.length - successes;
    if (failures > 0) {
      const failedBoards = tasks
        .filter((_, index) => results[index].status === 'rejected')
        .map(({ board }) => board);
      console.warn('[PlayGames] score submission failed', { successes, failedBoards });
    }
    if (successes === 0) return { submitted: false, reason: 'error' };
    return { submitted: true, ...(failures > 0 ? { reason: 'partial-failure' } : {}) };
  } catch {
    // Session completion calls this fire-and-forget; never leak a rejection.
    return { submitted: false, reason: 'error' };
  }
}

export async function loadLeagueStanding(key: PlayGamesLeaderboardKey): Promise<LeagueStanding> {
  if (!isNativeAndroid()) return { status: 'unavailable' };
  const leaderboardId = PLAY_GAMES_LEADERBOARDS[key];
  if (!isLeaderboardConfigured(leaderboardId)) return { status: 'unavailable' };
  const auth = await signInStatus(false);
  if (auth !== 'signed-in') {
    if (auth === 'error') {
      console.warn('[PlayGames] leaderboard sign-in failed');
      return { status: 'error', detail: 'sign-in-failed' };
    }
    return { status: 'signed-out' };
  }
  try {
    const PlayGames = await getPlayGames();
    const { score } = await PlayGames.loadCurrentPlayerScore({
      leaderboardId,
      timeSpan: key === 'weeklyScore' ? 'weekly' : 'allTime',
      collection: 'public',
    });
    if (!score) return { status: 'no-score' };
    return {
      status: 'ok',
      standing: {
        score: score.rawScore ?? 0,
        rank: typeof score.rank === 'number' && score.rank > 0 ? score.rank : null,
        displayRank: score.displayRank || '—',
        displayScore: score.displayScore || String(score.rawScore ?? 0),
      },
    };
  } catch {
    console.warn('[PlayGames] leaderboard load failed');
    return { status: 'error', detail: 'load-failed' };
  }
}

/** Load real public leaderboard rows and the signed-in player's profile for the custom profile preview. */
export async function loadLeaguePreview(key: PlayGamesLeaderboardKey): Promise<LeaguePreview | null> {
  if (!isNativeAndroid()) return null;
  const leaderboardId = PLAY_GAMES_LEADERBOARDS[key];
  if (!isLeaderboardConfigured(leaderboardId) || await signInStatus(false) !== 'signed-in') return null;
  const PlayGames = await getPlayGames();
  const timeSpan = key === 'weeklyScore' ? 'weekly' : 'allTime';
  const [top, own, player] = await Promise.all([
    PlayGames.loadTopScores({ leaderboardId, timeSpan, collection: 'public', maxResults: 10 }),
    PlayGames.loadCurrentPlayerScore({ leaderboardId, timeSpan, collection: 'public' }),
    PlayGames.getPlayer(),
  ]);
  return { player, scores: top.scores, ownScore: own.score };
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
