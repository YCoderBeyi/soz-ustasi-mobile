import { levels } from '../data/levels';
import type { DailyChallenge } from '../types';

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getSeed(now: Date): number {
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

/**
 * Local-calendar date string (YYYY-MM-DD). The daily seed is derived from the
 * local date, so the stored date must also be local — using toISOString() (UTC)
 * made the "already saved today" guard fail during the UTC offset window
 * (e.g. 00:00–03:00 in UTC+3), re-rolling the challenge and resetting `completed`.
 */
export function toLocalDateStr(now: Date): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDailyChallenge(eligibleLevelIds?: number[]): DailyChallenge {
  const now = new Date();
  const seed = getSeed(now);
  const eligibleLevels = eligibleLevelIds?.length
    ? levels.filter((level) => eligibleLevelIds.includes(level.levelId))
    : levels;
  const challengePool = eligibleLevels.length > 0 ? eligibleLevels : [levels[0]];
  const index = Math.floor(seededRandom(seed) * challengePool.length);
  const level = challengePool[index];
  const dateStr = toLocalDateStr(now);

  const saved = loadDailyChallenge();
  if (
    saved
    && saved.date === dateStr
    && challengePool.some((candidate) => candidate.levelId === saved.levelId)
  ) return saved;

  const challenge: DailyChallenge = {
    date: dateStr,
    levelId: level.levelId,
    completed: false,
    reward: (level.reward.baseCoin + level.reward.hiddenWordBonus) * 2,
  };
  persistDailyChallenge(challenge);
  return challenge;
}

export function claimDailyReward(challenge: DailyChallenge): DailyChallenge {
  const updated = { ...challenge, completed: true };
  persistDailyChallenge(updated);
  return updated;
}

const STORAGE_KEY = 'soz-daily-v1';

function loadDailyChallenge(): DailyChallenge | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistDailyChallenge(challenge: DailyChallenge) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(challenge));
  } catch {
    // storage unavailable
  }
}
