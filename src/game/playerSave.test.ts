import { describe, it, expect, beforeAll, beforeEach, vi } from 'vitest';
import { loadPlayerSave, persistPlayerSave, resolveCollectedWords, getDefaultSave, migratePlayerSave, type PlayerSave } from './playerSave';

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
    expect(save.version).toBe(3);
    expect(save.coins).toBe(120);
    expect(save.completedLevels).toEqual([]);
    expect(save.soundEnabled).toBe(true);
    expect(save.soundVolume).toBe(80);
    expect(save.hapticsEnabled).toBe(true);
  });
});

describe('persistPlayerSave / loadPlayerSave', () => {
  it('round-trips a save through localStorage', () => {
    const save: PlayerSave = {
      version: 3,
      currentLevelId: 1,
      coins: 200,
      completedLevels: [1, 2, 3],
      awardedLevels: [],
      rewardedWordKeys: [],
      collectedWords: ['TEST'],
      favoriteWords: [],
      soundEnabled: false,
      soundVolume: 65,
      hapticsEnabled: true,
      reduceMotion: false,
      calmMode: false,
      levelMastery: { 1: { stars: 3, objectives: ['complete', 'discovery', 'noHint'] } },
      ownedShopItems: [],
      selectedThemeId: null,
      selectedSealId: null,
      hintsRemaining: 0,
      doublerRemaining: 0,
      freeHintNext: false,
      levelStats: {},
      adWatchStats: { date: '', count: 0 },
    };
    persistPlayerSave(save);
    const loaded = loadPlayerSave();
    expect(loaded.coins).toBe(200);
    expect(loaded.soundVolume).toBe(65);
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

  it('clamps saved sound volume to the supported range', () => {
    expect(migratePlayerSave({ version: 2, soundVolume: 140 }).soundVolume).toBe(100);
    expect(migratePlayerSave({ version: 2, soundVolume: -10 }).soundVolume).toBe(0);
    expect(migratePlayerSave({ version: 2, soundVolume: 'loud' }).soundVolume).toBe(80);
  });

  it('keeps valid selected shop cosmetics and rejects unowned selections', () => {
    const save = migratePlayerSave({
      version: 2,
      ownedShopItems: ['theme_ege', 'seal_gold'],
      selectedThemeId: 'theme_ege',
      selectedSealId: 'seal_gold',
    });
    expect(save.selectedThemeId).toBe('theme_ege');
    expect(save.selectedSealId).toBe('seal_gold');

    const invalid = migratePlayerSave({
      version: 2,
      ownedShopItems: [],
      selectedThemeId: 'theme_ege',
      selectedSealId: 'seal_gold',
    });
    expect(invalid.selectedThemeId).toBeNull();
    expect(invalid.selectedSealId).toBeNull();
  });

  it('normalizes legacy mastery so noHint cannot bypass discovery', () => {
    const save = migratePlayerSave({
      version: 2,
      levelMastery: {
        1: { stars: 2, objectives: ['complete', 'noHint'] },
      },
    });
    expect(save.levelMastery[1]).toEqual({ stars: 1, objectives: ['complete'] });
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

  it('preserves complete legacy progress during an app update', () => {
    window.localStorage.setItem('soz-ustasi-player-v1', JSON.stringify({
      version: 1,
      currentLevelId: 6,
      coins: 845,
      completedLevels: [1, 2, 3, 4, 5],
      awardedLevels: [1, 2, 3, 4, 5],
      collectedWords: ['BALON'],
      favoriteWords: ['BALON'],
      levelMastery: {
        1: { stars: 3, objectives: ['complete', 'discovery', 'noHint'] },
        5: { stars: 2, objectives: ['complete', 'discovery'] },
      },
      ownedShopItems: ['theme_ege', 'seal_gold'],
      selectedThemeId: 'theme_ege',
      selectedSealId: 'seal_gold',
      hintsRemaining: 4,
      doublerRemaining: 3,
      freeHintNext: true,
    }));

    const loaded = loadPlayerSave();
    expect(loaded.currentLevelId).toBe(6);
    expect(loaded.completedLevels).toEqual([1, 2, 3, 4, 5]);
    expect(loaded.coins).toBe(845);
    expect(loaded.levelMastery[5]).toEqual({ stars: 2, objectives: ['complete', 'discovery'] });
    expect(loaded.ownedShopItems).toEqual(['theme_ege', 'seal_gold']);
    expect(loaded.selectedThemeId).toBe('theme_ege');
    expect(loaded.selectedSealId).toBe('seal_gold');
    expect(loaded.hintsRemaining).toBe(4);
    expect(loaded.doublerRemaining).toBe(3);
    expect(loaded.freeHintNext).toBe(true);
  });

  it('infers the next playable level when an old save has no currentLevelId', () => {
    const loaded = migratePlayerSave({
      version: 1,
      completedLevels: [1, 2, 3, 4, 5],
    });
    expect(loaded.currentLevelId).toBe(6);
    expect(loaded.completedLevels).toEqual([1, 2, 3, 4, 5]);
  });

  it('migrates collected hidden words into one-time reward keys', () => {
    const loaded = migratePlayerSave({
      version: 2,
      collectedWords: ['KAR'],
    });
    expect(loaded.rewardedWordKeys).toContain('5:hidden:KAR');
  });

  it('1.0.15 -> 1.0.16 update keeps the reached level and all completed progress', () => {
    // A real 1.0.15 save still carries economy fields removed in 1.0.16
    // (coinMultiplier, lanternCount). Loading with the new code must ignore them
    // WITHOUT dropping the player's reached level or completed levels.
    const completed = Array.from({ length: 41 }, (_, i) => i + 1); // levels 1..41
    window.localStorage.setItem('soz-ustasi-player-v1', JSON.stringify({
      version: 2,
      currentLevelId: 42,
      completedLevels: completed,
      awardedLevels: completed,
      coins: 500,
      coinMultiplier: 2, // removed in 1.0.16 — must be ignored, not fatal
      lanternCount: 5,   // removed in 1.0.16
      hintsRemaining: 3,
      levelMastery: { 10: { stars: 3, objectives: ['complete', 'discovery', 'noHint'] } },
    }));

    const loaded = loadPlayerSave();

    expect(loaded.currentLevelId).toBe(42);
    expect(loaded.completedLevels).toEqual(completed);
    expect(loaded.awardedLevels).toEqual(completed);
    expect(loaded.coins).toBe(500);
    expect(loaded.levelMastery[10]).toEqual({ stars: 3, objectives: ['complete', 'discovery', 'noHint'] });
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
