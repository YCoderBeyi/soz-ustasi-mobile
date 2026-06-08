import type { LevelMastery, LevelStats, WordEntry } from '../types';
import type { ObjectiveKey } from './objectives';
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
  collectedWords: string[];
  favoriteWords: string[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  levelMastery: Record<number, LevelMastery>;
  ownedShopItems: string[];
  hintsRemaining: number;
  coinMultiplier: number;
  levelStats: Record<number, LevelStats>;
};

export type Feedback = 'correct' | 'wrong' | 'hidden' | 'shuffle' | 'seal' | null;

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
    collectedWords: [],
    favoriteWords: [],
    soundEnabled: true,
    hapticsEnabled: true,
    levelMastery: {},
    ownedShopItems: [],
    hintsRemaining: 0,
    coinMultiplier: 1,
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

  const currentLevelId = typeof data.currentLevelId === 'number' && validLevelIds.has(data.currentLevelId)
    ? data.currentLevelId
    : initialLevel.levelId;

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
      return [[levelId, { stars: Math.min(3, Math.max(0, objectives.length)), objectives }]];
    }),
  );

  return {
    version: 2,
    currentLevelId,
    coins: typeof data.coins === 'number' && Number.isFinite(data.coins) && data.coins >= 0
      ? Math.floor(data.coins)
      : 120,
    completedLevels: [...new Set(completedLevels)],
    awardedLevels: [...new Set(awardedLevels)],
    collectedWords: Array.isArray(data.collectedWords)
      ? [...new Set((data.collectedWords as unknown[]).filter((w): w is string => typeof w === 'string'))]
      : [],
    favoriteWords: Array.isArray(data.favoriteWords)
      ? [...new Set((data.favoriteWords as unknown[]).filter((w): w is string => typeof w === 'string'))]
      : [],
    soundEnabled: data.soundEnabled !== false,
    hapticsEnabled: data.hapticsEnabled !== false,
    levelMastery,
    ownedShopItems: Array.isArray(data.ownedShopItems)
      ? (data.ownedShopItems as unknown[]).filter((i): i is string => typeof i === 'string')
      : [],
    hintsRemaining: typeof data.hintsRemaining === 'number' ? Math.max(0, data.hintsRemaining) : 0,
    coinMultiplier: typeof data.coinMultiplier === 'number' ? Math.max(1, data.coinMultiplier) : 1,
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
