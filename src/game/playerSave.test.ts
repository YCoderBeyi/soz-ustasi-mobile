import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { loadPlayerSave, persistPlayerSave, resolveCollectedWords, getDefaultSave, type PlayerSave } from './playerSave';

const store = new Map<string, string>();

beforeAll(() => {
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    },
  });
});

beforeEach(() => {
  store.clear();
});

describe('getDefaultSave', () => {
  it('returns a valid save with starting values', () => {
    const save = getDefaultSave();
    expect(save.version).toBe(2);
    expect(save.coins).toBe(120);
    expect(save.completedLevels).toEqual([]);
    expect(save.soundEnabled).toBe(true);
    expect(save.hapticsEnabled).toBe(true);
  });
});

describe('persistPlayerSave / loadPlayerSave', () => {
  it('round-trips a save through localStorage', () => {
    const save: PlayerSave = {
      version: 2,
      currentLevelId: 1,
      coins: 200,
      completedLevels: [1, 2, 3],
      awardedLevels: [],
      collectedWords: ['TEST'],
      favoriteWords: [],
      soundEnabled: false,
      hapticsEnabled: true,
      levelMastery: { 1: { stars: 3, objectives: ['complete', 'discovery', 'noHint'] } },
      ownedShopItems: [],
      hintsRemaining: 0,
      coinMultiplier: 1,
      levelStats: {},
    };
    persistPlayerSave(save);
    const loaded = loadPlayerSave();
    expect(loaded.coins).toBe(200);
    expect(loaded.completedLevels).toEqual([1, 2, 3]);
    expect(loaded.levelMastery[1]).toEqual({ stars: 3, objectives: ['complete', 'discovery', 'noHint'] });
  });

  it('returns defaults when localStorage is empty', () => {
    const loaded = loadPlayerSave();
    expect(loaded.coins).toBe(120);
    expect(loaded.completedLevels).toEqual([]);
  });

  it('sanitizes negative coin values', () => {
    window.localStorage.setItem('soz-ustasi-player-v1', JSON.stringify({ coins: -50 }));
    expect(loadPlayerSave().coins).toBe(120);
  });

  it('sanitizes non-finite coin values', () => {
    window.localStorage.setItem('soz-ustasi-player-v1', JSON.stringify({ coins: Infinity }));
    expect(loadPlayerSave().coins).toBe(120);
  });

  it('sanitizes NaN coin values', () => {
    window.localStorage.setItem('soz-ustasi-player-v1', JSON.stringify({ coins: 'abc' }));
    expect(loadPlayerSave().coins).toBe(120);
  });

  it('removes unknown levelIds from completedLevels', () => {
    window.localStorage.setItem('soz-ustasi-player-v1', JSON.stringify({ completedLevels: [999, 1] }));
    const loaded = loadPlayerSave();
    expect(loaded.completedLevels).not.toContain(999);
  });

  it('deduplicates completedLevels', () => {
    window.localStorage.setItem('soz-ustasi-player-v1', JSON.stringify({ completedLevels: [1, 1, 2, 2] }));
    expect(loadPlayerSave().completedLevels).toEqual([1, 2]);
  });
});

describe('resolveCollectedWords', () => {
  it('resolves words that exist in level data', () => {
    // BALON is a real word in level data
    const result = resolveCollectedWords(['BALON']);
    expect(result.length).toBe(1);
    expect(result[0].word).toBe('BALON');
  });

  it('filters out non-existent words', () => {
    const result = resolveCollectedWords(['ASLAVAR']);
    expect(result).toEqual([]);
  });

  it('matches regardless of case and diacritics', () => {
    const result = resolveCollectedWords(['balon']);
    expect(result.length).toBe(1);
    expect(result[0].word).toBe('BALON');
  });
});
