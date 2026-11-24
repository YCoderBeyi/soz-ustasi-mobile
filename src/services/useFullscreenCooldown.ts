import { useSyncExternalStore } from 'react';
import { getFullscreenCooldownRemainingSeconds } from './admob';
import { subscribeAdFullscreenPolicy } from './ads/adPolicyEngine';

function subscribe(onStoreChange: () => void): () => void {
  const unsub = subscribeAdFullscreenPolicy(onStoreChange);
  const id = window.setInterval(onStoreChange, 1000);
  return () => {
    unsub();
    window.clearInterval(id);
  };
}

/** Remaining shared fullscreen-ad cooldown; updates on policy writes and every second. */
export function useFullscreenCooldownRemaining(): number {
  return useSyncExternalStore(
    subscribe,
    getFullscreenCooldownRemainingSeconds,
    () => 0,
  );
}
