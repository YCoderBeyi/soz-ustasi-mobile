import type { LevelStats } from '../types';

const STORAGE_KEY = 'soz-stats-v1';

export function loadLevelStats(): Record<number, LevelStats> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveLevelStats(stats: Record<number, LevelStats>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // storage unavailable
  }
}

export function updateLevelStats(
  stats: Record<number, LevelStats>,
  levelId: number,
  time: number,
  streak: number,
  success: boolean,
): Record<number, LevelStats> {
  const prev = stats[levelId];
  const entry: LevelStats = {
    bestTime: prev ? Math.min(prev.bestTime, time) : time,
    bestStreak: prev ? Math.max(prev.bestStreak, streak) : streak,
    attempts: prev ? prev.attempts + 1 : 1,
    completions: prev ? prev.completions + (success ? 1 : 0) : (success ? 1 : 0),
  };
  return { ...stats, [levelId]: entry };
}
