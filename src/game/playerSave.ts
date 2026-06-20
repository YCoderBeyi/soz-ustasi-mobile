import type { LevelMastery, LevelStats, WordEntry } from '../types';
import type { ObjectiveKey } from './objectives';
import { toRunMastery } from './objectives';
import { levels, initialLevel } from '../data/levels';
import { normalizeWord } from './normalize';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PlayerSave = {
  version: 2;
  currentLevelId: number;
  coins: number;
  completedLevels: number[];
  awardedLevels: number[];
  rewardedWordKeys: string[];
  collectedWords: string[];
  favoriteWords: string[];
  soundEnabled: boolean;
  soundVolume: number;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
  levelMastery: Record<number, LevelMastery>;
  ownedShopItems: string[];
  selectedThemeId: string | null;
  selectedSealId: string | null;
  hintsRemaining: number;
  doublerRemaining: number;
  freeHintNext: boolean;
  levelStats: Record<number, LevelStats>;
};

export type Feedback = 'correct' | 'wrong' | 'unknown' | 'hidden' | 'hint' | 'shuffle' | 'seal' | null;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const CURRENT_SAVE_VERSION = 2;
const SAVE_KEY = 'soz-ustasi-player-v1';
const LEGACY_STATS_KEY = 'soz-stats-v1';

// ---------------------------------------------------------------------------
// Default / helpers
// ---------------------------------------------------------------------------

export function getDefaultSave(): PlayerSave {
  return {
    version: 2,
    currentLevelId: initialLevel.levelId,
    coins: 120,
    completedLevels: [],
    awardedLevels: [],
    rewardedWordKeys: [],
    collectedWords: [],
    favoriteWords: [],
    soundEnabled: true,
    soundVolume: 80,
    hapticsEnabled: true,
    reduceMotion: false,
    levelMastery: {},
    ownedShopItems: [],
    selectedThemeId: null,
    selectedSealId: null,
    hintsRemaining: 0,
    doublerRemaining: 0,
    freeHintNext: false,
    levelStats: {},
  };
}

// ---------------------------------------------------------------------------
// Migration
// ---------------------------------------------------------------------------

type RawSave = Record<string, unknown>;

/** Lift a v1 save to v2 by merging legacy soz-stats-v1 into levelStats. */
function migrateV1ToV2(raw: RawSave): RawSave {
  let levelStats: Record<string, unknown> = {};
  try {
    if (typeof window !== 'undefined') {
      const statsRaw = window.localStorage.getItem(LEGACY_STATS_KEY);
      if (statsRaw) {
        const parsed = JSON.parse(statsRaw);
        if (parsed && typeof parsed === 'object') levelStats = parsed as Record<string, unknown>;
      }
    }
  } catch {
    // ignore — legacy stats are best-effort
  }
  return { ...raw, version: 2, levelStats: { ...(raw.levelStats as object | undefined), ...levelStats } };
}

const MIGRATIONS: Record<number, (raw: RawSave) => RawSave> = {
  1: migrateV1ToV2,
};

/**
 * Pure migration function: upgrades any raw unknown value to the current
 * PlayerSave version. Safe to call from tests without side-effects.
 */
export function migratePlayerSave(raw: unknown): PlayerSave {
  let data: RawSave = (raw !== null && typeof raw === 'object' && !Array.isArray(raw))
    ? (raw as RawSave)
    : {};

  let detectedVersion = typeof data.version === 'number' ? data.version : 1;

  while (detectedVersion < CURRENT_SAVE_VERSION) {
    const migFn = MIGRATIONS[detectedVersion];
    if (!migFn) break;
    data = migFn(data);
    detectedVersion++;
  }

  return sanitize(data);
}

// ---------------------------------------------------------------------------
// Sanitize (validates and fills missing fields)
// ---------------------------------------------------------------------------

function sanitizeLevelStats(raw: unknown): Record<number, LevelStats> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  const result: Record<number, LevelStats> = {};
  for (const [k, v] of Object.entries(raw as Record<string, unknown>)) {
    const id = Number(k);
    if (!Number.isFinite(id) || !v || typeof v !== 'object') continue;
    const s = v as Partial<LevelStats>;
    result[id] = {
      bestTime: typeof s.bestTime === 'number' && s.bestTime >= 0 ? s.bestTime : 0,
      bestStreak: typeof s.bestStreak === 'number' && s.bestStreak >= 0 ? s.bestStreak : 0,
      attempts: typeof s.attempts === 'number' && s.attempts >= 0 ? s.attempts : 0,
      completions: typeof s.completions === 'number' && s.completions >= 0 ? s.completions : 0,
    };
  }
  return result;
}

function sanitize(data: RawSave): PlayerSave {
  const validLevelIds = new Set(levels.map((e) => e.levelId));

  const completedLevels = Array.isArray(data.completedLevels)
    ? (data.completedLevels as unknown[]).filter((id): id is number => typeof id === 'number' && validLevelIds.has(id))
    : [];

  const awardedLevels = Array.isArray(data.awardedLevels)
    ? (data.awardedLevels as unknown[]).filter((id): id is number => typeof id === 'number' && validLevelIds.has(id))
    : [];

  const collectedWords = Array.isArray(data.collectedWords)
    ? [...new Set((data.collectedWords as unknown[]).filter((w): w is string => typeof w === 'string'))]
    : [];
  const migratedRewardedWordKeys = levels.flatMap((level) =>
    level.hiddenWords
      .filter((entry) => collectedWords.some((word) => normalizeWord(word) === normalizeWord(entry.word)))
      .map((entry) => `${level.levelId}:hidden:${normalizeWord(entry.word)}`)
  );
  const rewardedWordKeys = Array.isArray(data.rewardedWordKeys)
    ? [...new Set((data.rewardedWordKeys as unknown[]).filter((key): key is string => typeof key === 'string'))]
    : migratedRewardedWordKeys;

  const highestCompletedId = Math.max(0, ...completedLevels);
  const nextUncompletedLevel = levels.find((level) =>
    level.levelId > highestCompletedId && !completedLevels.includes(level.levelId)
  );
  const inferredCurrentLevelId = nextUncompletedLevel?.levelId
    ?? (validLevelIds.has(highestCompletedId) ? highestCompletedId : initialLevel.levelId);
  const currentLevelId = typeof data.currentLevelId === 'number' && validLevelIds.has(data.currentLevelId)
    ? data.currentLevelId
    : inferredCurrentLevelId;

  const rawLevelMastery = (data.levelMastery ?? {}) as Record<string, unknown>;
  const levelMastery: Record<number, LevelMastery> = Object.fromEntries(
    Object.entries(rawLevelMastery).flatMap(([key, value]) => {
      const levelId = Number(key);
      if (!validLevelIds.has(levelId) || !value || typeof value !== 'object') return [];
      const m = value as Partial<LevelMastery>;
      const objectives = Array.isArray(m.objectives)
        ? (m.objectives as unknown[]).filter((item): item is ObjectiveKey =>
            ['complete', 'discovery', 'noHint'].includes(item as string))
        : [];
      return [[levelId, toRunMastery(objectives)]];
    }),
  );

  const ownedShopItems = Array.isArray(data.ownedShopItems)
    ? [...new Set((data.ownedShopItems as unknown[]).filter((i): i is string => typeof i === 'string'))]
    : [];
  const selectedThemeId = typeof data.selectedThemeId === 'string'
    && ownedShopItems.includes(data.selectedThemeId) && data.selectedThemeId.startsWith('theme_')
    ? data.selectedThemeId : null;
  const selectedSealId = typeof data.selectedSealId === 'string'
    && ownedShopItems.includes(data.selectedSealId) && data.selectedSealId.startsWith('seal_')
    ? data.selectedSealId : null;

  return {
    version: 2,
    currentLevelId,
    coins: typeof data.coins === 'number' && Number.isFinite(data.coins) && data.coins >= 0
      ? Math.floor(data.coins)
      : 120,
    completedLevels: [...new Set(completedLevels)],
    awardedLevels: [...new Set(awardedLevels)],
    rewardedWordKeys,
    collectedWords,
    favoriteWords: Array.isArray(data.favoriteWords)
      ? [...new Set((data.favoriteWords as unknown[]).filter((w): w is string => typeof w === 'string'))]
      : [],
    soundEnabled: data.soundEnabled !== false,
    soundVolume: typeof data.soundVolume === 'number' && Number.isFinite(data.soundVolume)
      ? Math.min(100, Math.max(0, Math.round(data.soundVolume)))
      : 80,
    hapticsEnabled: data.hapticsEnabled !== false,
    reduceMotion: data.reduceMotion === true,
    levelMastery,
    ownedShopItems,
    selectedThemeId,
    selectedSealId,
    hintsRemaining: typeof data.hintsRemaining === 'number' ? Math.max(0, data.hintsRemaining) : 0,
    doublerRemaining: typeof data.doublerRemaining === 'number' ? Math.max(0, data.doublerRemaining) : 0,
    freeHintNext: data.freeHintNext === true,
    levelStats: sanitizeLevelStats(data.levelStats),
  };
}

// ---------------------------------------------------------------------------
// Load / persist
// ---------------------------------------------------------------------------

export function loadPlayerSave(): PlayerSave {
  if (typeof window === 'undefined') return getDefaultSave();

  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return getDefaultSave();

    const parsed: unknown = JSON.parse(raw);
    const save = migratePlayerSave(parsed);

    // Clean up the legacy stats key after successful migration
    try {
      window.localStorage.removeItem(LEGACY_STATS_KEY);
    } catch {
      // ignore — not critical
    }

    return save;
  } catch {
    return getDefaultSave();
  }
}

export function persistPlayerSave(save: PlayerSave): void {
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(save));
  } catch {
    // Storage can be unavailable in restricted webviews
  }
}

// ---------------------------------------------------------------------------
// Helpers used by GameContext
// ---------------------------------------------------------------------------

export function resolveCollectedWords(words: string[]): WordEntry[] {
  const catalog = new Map<string, WordEntry>();
  for (const entry of levels) {
    for (const word of [...entry.mainWords, ...entry.hiddenWords]) {
      catalog.set(normalizeWord(word.word), word);
    }
  }
  return words
    .map((word) => catalog.get(normalizeWord(word)))
    .filter((word): word is WordEntry => Boolean(word));
}
