import { useEffect, useSyncExternalStore } from 'react';
import {
  hideTopBanner,
  isBannerSlotReserved,
  subscribeBannerSlotState,
  showTopBanner,
  type BannerOwner,
} from '../services/admob';

export function useTopBanner(owner: BannerOwner | null): void {
  useEffect(() => {
    if (owner) void showTopBanner(owner);
    else void hideTopBanner();
  }, [owner]);
}

export function useBannerSlotReserved(): boolean {
  return useSyncExternalStore(
    subscribeBannerSlotState,
    isBannerSlotReserved,
    () => false,
  );
}
