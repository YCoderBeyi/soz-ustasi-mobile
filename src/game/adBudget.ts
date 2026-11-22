import { loadPlayerSave, persistPlayerSave, type AdWatchStats } from './playerSave';
import { toLocalDateStr } from './dailyChallenge';

// Günlük ödüllü reklam limiti: hem Play politikası hem de oyuncu deneyimi için
// tek katmanda zorlanır (tüm reklam yerleşimleri bu havuzdan harcar).
export const DAILY_REWARDED_AD_LIMIT = 6;

const listeners = new Set<() => void>();

export function subscribeAdBudget(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyAdBudget(): void {
  for (const listener of listeners) listener();
}

function readStats(): AdWatchStats {
  return loadPlayerSave().adWatchStats;
}

export function getRewardedAdsLeftToday(): number {
  const stats = readStats();
  if (stats.date !== toLocalDateStr(new Date())) return DAILY_REWARDED_AD_LIMIT;
  return Math.max(0, DAILY_REWARDED_AD_LIMIT - stats.count);
}

export function canWatchRewardedAd(): boolean {
  return getRewardedAdsLeftToday() > 0;
}

export function consumeRewardedAd(): void {
  const today = toLocalDateStr(new Date());
  const stats = readStats();
  const next: AdWatchStats = stats.date === today
    ? { date: today, count: stats.count + 1 }
    : { date: today, count: 1 };
  const save = loadPlayerSave();
  persistPlayerSave({ ...save, adWatchStats: next });
  notifyAdBudget();
}
