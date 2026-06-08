import { levels } from '../data/levels';
import type { DailyChallenge } from '../types';

function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function getTodaySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function getDailyChallenge(): DailyChallenge {
  const seed = getTodaySeed();
  const index = Math.floor(seededRandom(seed) * levels.length);
  const level = levels[index];
  const dateStr = new Date().toISOString().split('T')[0];

  const saved = loadDailyChallenge();
  if (saved && saved.date === dateStr) return saved;

  const challenge: DailyChallenge = {
    date: dateStr,
    levelId: level.levelId,
    completed: false,
    reward: (level.reward.baseCoin + level.reward.hiddenWordBonus) * 2,
  };
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
