import { useSyncExternalStore } from 'react';
import { getRewardedAdsLeftToday, subscribeRewardedAdsLeft } from './admob';

export function useRewardedAdsLeftToday(): number {
  return useSyncExternalStore(
    subscribeRewardedAdsLeft,
    getRewardedAdsLeftToday,
    getRewardedAdsLeftToday,
  );
}
