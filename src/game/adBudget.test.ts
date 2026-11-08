import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  DAILY_REWARDED_AD_LIMIT,
  canWatchRewardedAd,
  consumeRewardedAd,
  getRewardedAdsLeftToday,
} from './adBudget';
import { getDefaultSave, persistPlayerSave } from './playerSave';
import { toLocalDateStr } from './dailyChallenge';

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => store.set(key, value),
      removeItem: (key: string) => store.delete(key),
      clear: () => store.clear(),
    },
  });
});

describe('adBudget', () => {
  it('starts with the daily limit available', () => {
    persistPlayerSave(getDefaultSave());
    expect(getRewardedAdsLeftToday()).toBe(DAILY_REWARDED_AD_LIMIT);
    expect(canWatchRewardedAd()).toBe(true);
  });

  it('consumes one watch per rewarded ad', () => {
    persistPlayerSave(getDefaultSave());
    consumeRewardedAd();
    expect(getRewardedAdsLeftToday()).toBe(DAILY_REWARDED_AD_LIMIT - 1);
  });

  it('exhausts the limit and blocks further ads', () => {
    persistPlayerSave(getDefaultSave());
    for (let i = 0; i < DAILY_REWARDED_AD_LIMIT; i++) consumeRewardedAd();
    expect(getRewardedAdsLeftToday()).toBe(0);
    expect(canWatchRewardedAd()).toBe(false);
  });

  it('resets the counter on a new local day', () => {
    const today = toLocalDateStr(new Date());
    persistPlayerSave({ ...getDefaultSave(), adWatchStats: { date: today, count: DAILY_REWARDED_AD_LIMIT } });
    expect(getRewardedAdsLeftToday()).toBe(0);

    persistPlayerSave({ ...getDefaultSave(), adWatchStats: { date: '2000-01-01', count: DAILY_REWARDED_AD_LIMIT } });
    expect(getRewardedAdsLeftToday()).toBe(DAILY_REWARDED_AD_LIMIT);
    expect(canWatchRewardedAd()).toBe(true);
  });
});
