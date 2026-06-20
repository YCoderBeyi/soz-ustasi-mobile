import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { SfxName } from '../../audio';
import { playSfx } from '../../audio';
import { createCleanupRegistry } from '../../game/cleanup';
import { shopItems } from '../../data/shop';
import { loadPlayerSave, persistPlayerSave } from '../../game/playerSave';

type ResourceState = {
  coins: number;
  hintsRemaining: number;
  lanternCount: number;
  coinMultiplier: number;
  doublerRemaining: number;
  freeHintNext: boolean;
  ownedShopItems: string[];
  selectedThemeId: string | null;
  selectedSealId: string | null;
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
  buyShopItem: (itemId: string) => void;
  selectShopItem: (itemId: string) => void;
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
  soundVolume,
  hapticsEnabled,
}: {
  children: ReactNode;
  soundEnabled: boolean;
  soundVolume: number;
  hapticsEnabled: boolean;
}) {
  const initialSave = useRef(loadPlayerSave()).current;
  const [coins, setCoins] = useState(initialSave.coins);
  const [hintsRemaining, setHintsRemaining] = useState(initialSave.hintsRemaining);
  const [lanternCount] = useState(0);
  const [coinMultiplier, setCoinMultiplier] = useState(initialSave.coinMultiplier);
  const [doublerRemaining] = useState(0);
  const [freeHintNext, setFreeHintNext] = useState(initialSave.freeHintNext);
  const [ownedShopItems, setOwnedShopItems] = useState<string[]>(initialSave.ownedShopItems);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(initialSave.selectedThemeId);
  const [selectedSealId, setSelectedSealId] = useState<string | null>(initialSave.selectedSealId);
  const [coinPulse, setCoinPulse] = useState(false);

  const cleanup = useRef(createCleanupRegistry()).current;

  useEffect(() => cleanup.flushAll, []);

  useEffect(() => {
    const latest = loadPlayerSave();
    persistPlayerSave({
      ...latest,
      coins,
      hintsRemaining,
      coinMultiplier,
      freeHintNext,
      ownedShopItems,
      selectedThemeId,
      selectedSealId,
    });
  }, [coins, hintsRemaining, coinMultiplier, freeHintNext, ownedShopItems, selectedThemeId, selectedSealId]);

  const soundRef = useRef(soundEnabled);
  soundRef.current = soundEnabled;
  const soundVolumeRef = useRef(soundVolume);
  soundVolumeRef.current = soundVolume;
  const hapticRef = useRef(hapticsEnabled);
  hapticRef.current = hapticsEnabled;

  const play = useCallback((name: SfxName) => {
    playSfx(name, soundRef.current, soundVolumeRef.current);
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

  const isItemOwned = useCallback((itemId: string) => ownedShopItems.includes(itemId), [ownedShopItems]);

  const buyShopItem = useCallback((itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item) {
      play('wrong');
      return;
    }
    if (ownedShopItems.includes(itemId)) {
      play('wrong');
      return;
    }
    if (coins < item.price) {
      play('wrong');
      return;
    }
    setCoins((v) => v - item.price);
    setOwnedShopItems((prev) => [...prev, itemId]);
    if (item.category === 'theme') setSelectedThemeId(itemId);
    if (item.category === 'seal') setSelectedSealId(itemId);
    if (itemId.startsWith('hint_')) {
      const count = itemId === 'hint_3' ? 3 : 5;
      setHintsRemaining((prev) => prev + count);
    }
    if (itemId === 'doubler') {
      setCoinMultiplier((prev) => prev * 2);
    }
    play('reward');
  }, [coins, ownedShopItems, play]);

  const selectShopItem = useCallback((itemId: string) => {
    const item = shopItems.find((candidate) => candidate.id === itemId);
    if (!item || !ownedShopItems.includes(itemId)) return;
    if (item.category === 'theme') setSelectedThemeId(itemId);
    if (item.category === 'seal') setSelectedSealId(itemId);
    play('tap');
  }, [ownedShopItems, play]);

  const pulseCoins = useCallback(() => {
    setCoinPulse(false);
    if (cleanup) {
      cleanup.safeRaf(() => setCoinPulse(true));
      cleanup.safeTimeout(() => setCoinPulse(false), 520);
    }
  }, [cleanup]);

  const value: ResourceContextValue = {
    coins, hintsRemaining, lanternCount, coinMultiplier, doublerRemaining,
    freeHintNext, ownedShopItems, selectedThemeId, selectedSealId, coinPulse,
    addCoins, spendCoins, spendHint, addHints, setCoinMultiplier,
    addOwnedItem, isItemOwned, buyShopItem, selectShopItem, pulseCoins, play, haptic,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
