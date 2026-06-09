import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { SfxName } from '../../audio';
import { playSfx } from '../../audio';
import { createCleanupRegistry } from '../../game/cleanup';

type ResourceState = {
  coins: number;
  hintsRemaining: number;
  lanternCount: number;
  coinMultiplier: number;
  doublerRemaining: number;
  freeHintNext: boolean;
  ownedShopItems: string[];
  coinPulse: boolean;
};

type ResourceActions = {
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  spendHint: () => boolean;
  addHints: (count: number) => void;
  setCoinMultiplier: (value: number) => void;
  addOwnedItem: (itemId: string) => void;
  isItemOwned: (itemId: string) => boolean;
  pulseCoins: () => void;
  play: (name: SfxName) => void;
  haptic: (pattern: number | number[]) => void;
};

type ResourceContextValue = ResourceState & ResourceActions;

const ResourceContext = createContext<ResourceContextValue | null>(null);

export function useResource() {
  const ctx = useContext(ResourceContext);
  if (!ctx) throw new Error('useResource must be used within ResourceProvider');
  return ctx;
}

export function ResourceProvider({
  children,
  soundEnabled,
  hapticsEnabled,
}: {
  children: ReactNode;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
}) {
  const [coins, setCoins] = useState(120);
  const [hintsRemaining, setHintsRemaining] = useState(0);
  const [lanternCount, setLanternCount] = useState(0);
  const [coinMultiplier, setCoinMultiplier] = useState(1);
  const [doublerRemaining, setDoublerRemaining] = useState(0);
  const [freeHintNext, setFreeHintNext] = useState(false);
  const [ownedShopItems, setOwnedShopItems] = useState<string[]>([]);
  const [coinPulse, setCoinPulse] = useState(false);

  const cleanup = useRef(createCleanupRegistry()).current;

  useEffect(() => cleanup.flushAll, []);

  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;
  const hapticRef = useRef(hapticsEnabled);
  hapticRef.current = hapticsEnabled;

  const play = useCallback((name: SfxName) => {
    playSfx(name, soundRef.current);
  }, []);

  const haptic = useCallback((pattern: number | number[]) => {
    if (!hapticRef.current) return;
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  }, []);

  const addCoins = useCallback((amount: number) => {
    setCoins((v) => Math.floor(Math.max(0, v + amount)));
  }, []);

  const spendCoins = useCallback((amount: number): boolean => {
    let success = false;
    setCoins((v) => {
      if (v >= amount) {
        success = true;
        return v - amount;
      }
      return v;
    });
    return success;
  }, []);

  const spendHint = useCallback((): boolean => {
    if (freeHintNext) {
      setFreeHintNext(false);
      return true;
    }
    if (hintsRemaining > 0) {
      setHintsRemaining((v) => v - 1);
      return true;
    }
    const cost = 20;
    return spendCoins(cost);
  }, [freeHintNext, hintsRemaining, spendCoins]);

  const addHints = useCallback((count: number) => {
    setHintsRemaining((v) => v + count);
  }, []);

  const addOwnedItem = useCallback((itemId: string) => {
    setOwnedShopItems((prev) => prev.includes(itemId) ? prev : [...prev, itemId]);
  }, []);

  const isItemOwned = useCallback((itemId: string) => {
    let result = false;
    setOwnedShopItems((prev) => { result = prev.includes(itemId); return prev; });
    return result;
  }, []);

  const pulseCoins = useCallback(() => {
    setCoinPulse(false);
    if (cleanup) {
      cleanup.safeRaf(() => setCoinPulse(true));
      cleanup.safeTimeout(() => setCoinPulse(false), 520);
    }
  }, [cleanup]);

  const value: ResourceContextValue = {
    coins, hintsRemaining, lanternCount, coinMultiplier, doublerRemaining,
    freeHintNext, ownedShopItems, coinPulse,
    addCoins, spendCoins, spendHint, addHints, setCoinMultiplier,
    addOwnedItem, isItemOwned, pulseCoins, play, haptic,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
