import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  platform: 'android' as string,
  initialize: vi.fn(),
  signIn: vi.fn(),
  submitScore: vi.fn(),
  loadCurrentPlayerScore: vi.fn(),
}));

vi.mock('@capacitor/core', () => ({
  Capacitor: { getPlatform: () => mocks.platform },
}));

vi.mock('@modbender/capacitor-play-games', () => ({
  PlayGames: {
    initialize: mocks.initialize,
    signIn: mocks.signIn,
    submitScore: mocks.submitScore,
    loadCurrentPlayerScore: mocks.loadCurrentPlayerScore,
  },
}));

const baseInput = {
  leagueOptIn: true,
  calmMode: false,
  levelScore: 120,
  levelMastery: { 1: { stars: 2, objectives: ['complete'] } },
};

async function loadService() {
  vi.resetModules();
  return import('./index');
}

describe('Play Games service result handling', () => {
  beforeEach(() => {
    mocks.platform = 'android';
    mocks.initialize.mockReset().mockResolvedValue(undefined);
    mocks.signIn.mockReset().mockResolvedValue({ signedIn: true });
    mocks.submitScore.mockReset().mockResolvedValue({ results: [] });
    mocks.loadCurrentPlayerScore.mockReset().mockResolvedValue({ score: null, stale: false });
  });

  it('reports submit failure and partial success accurately', async () => {
    const service = await loadService();
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    mocks.submitScore.mockRejectedValue(new Error('network failure'));
    await expect(service.submitLeagueScores(baseInput)).resolves.toEqual({ submitted: false, reason: 'error' });
    expect(warn).toHaveBeenCalledWith('[PlayGames] score submission failed', {
      successes: 0,
      failedBoards: ['weekly', 'stars'],
    });

    mocks.submitScore.mockReset()
      .mockResolvedValueOnce({ results: [] })
      .mockRejectedValueOnce(new Error('board unavailable'));
    await expect(service.submitLeagueScores(baseInput)).resolves.toEqual({
      submitted: true,
      reason: 'partial-failure',
    });
    expect(warn).toHaveBeenLastCalledWith('[PlayGames] score submission failed', {
      successes: 1,
      failedBoards: ['stars'],
    });
    expect(warn.mock.calls.flat().join(' ')).not.toContain('network failure');
    warn.mockRestore();
  });

  it('turns initialization and plugin errors into a result instead of a rejection', async () => {
    const service = await loadService();
    mocks.initialize.mockRejectedValueOnce(new Error('plugin initialization failed'));
    await expect(service.submitLeagueScores(baseInput)).resolves.toEqual({ submitted: false, reason: 'error' });
  });

  it('does not open interactive sign-in during a level completion submission', async () => {
    const service = await loadService();
    mocks.signIn.mockResolvedValueOnce({ signedIn: false });

    await expect(service.submitLeagueScores(baseInput)).resolves.toEqual({
      submitted: false,
      reason: 'signed-out',
    });
    expect(mocks.signIn).toHaveBeenCalledTimes(1);
    expect(mocks.signIn).toHaveBeenCalledWith({ silent: true });
  });

  it('shares initialization and silent sign-in across concurrent standing loads', async () => {
    const service = await loadService();
    let releaseInitialize!: () => void;
    mocks.initialize.mockImplementationOnce(() => new Promise<void>((resolve) => {
      releaseInitialize = resolve;
    }));

    const standings = Promise.all([
      service.loadLeagueStanding('weeklyScore'),
      service.loadLeagueStanding('regionStars'),
    ]);
    await vi.waitFor(() => expect(mocks.initialize).toHaveBeenCalledTimes(1));
    releaseInitialize();

    await expect(standings).resolves.toEqual([
      { status: 'no-score' },
      { status: 'no-score' },
    ]);
    expect(mocks.initialize).toHaveBeenCalledTimes(1);
    expect(mocks.signIn).toHaveBeenCalledTimes(1);
    expect(mocks.signIn).toHaveBeenCalledWith({ silent: true });
  });

  it('returns distinct standing statuses for score, no score, auth, platform, and errors', async () => {
    const service = await loadService();
    await expect(service.loadLeagueStanding('weeklyScore')).resolves.toEqual({ status: 'no-score' });

    mocks.loadCurrentPlayerScore.mockResolvedValueOnce({
      score: { rawScore: 140, rank: 4, displayRank: '#4', displayScore: '140' },
      stale: false,
    });
    await expect(service.loadLeagueStanding('weeklyScore')).resolves.toEqual({
      status: 'ok',
      standing: { score: 140, rank: 4, displayRank: '#4', displayScore: '140' },
    });

    mocks.signIn.mockResolvedValueOnce({ signedIn: false });
    await expect(service.loadLeagueStanding('weeklyScore')).resolves.toEqual({ status: 'signed-out' });

    mocks.platform = 'web';
    await expect(service.loadLeagueStanding('weeklyScore')).resolves.toEqual({ status: 'unavailable' });

    mocks.platform = 'android';
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    mocks.loadCurrentPlayerScore.mockRejectedValueOnce(new Error('private error details'));
    await expect(service.loadLeagueStanding('weeklyScore')).resolves.toEqual({
      status: 'error',
      detail: 'load-failed',
    });
    expect(warn).toHaveBeenCalledWith('[PlayGames] leaderboard load failed');
    expect(warn).not.toHaveBeenCalledWith(expect.stringContaining('private error details'));
    warn.mockRestore();
  });
});
