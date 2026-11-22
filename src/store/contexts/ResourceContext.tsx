import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { SfxName } from '../../audio';
import { playSfx } from '../../audio';
import { createCleanupRegistry } from '../../game/cleanup';
import { shopItems } from '../../data/shop';
import { usePersistence } from './PersistenceContext';

// Altın Katlayıcı (doubler) süreli bir buff: satın alınca sonraki bu kadar
// bölümün ödülünü 2 katına çıkarır, her mühürlemede bir hak tükenir.
export const DOUBLER_GAMES = 3;

type ResourceState = {
  coins: number;
  hintsRemaining: number;
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
  consumeDoubler: () => boolean;
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
  const { resources, updateResources } = usePersistence();
  const {
    coins, hintsRemaining, doublerRemaining, freeHintNext,
    ownedShopItems, selectedThemeId, selectedSealId,
  } = resources;
  const [coinPulse, setCoinPulse] = useState(false);

  const cleanup = useRef(createCleanupRegistry()).current;

  useEffect(() => cleanup.flushAll, []);

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
    if (!Number.isFinite(amount) || amount <= 0) return;
    updateResources((current) => ({ ...current, coins: Math.floor(Math.max(0, current.coins + amount)) }));
  }, [updateResources]);

  const spendCoins = useCallback((amount: number): boolean => {
    if (!Number.isFinite(amount) || amount <= 0) return false;
    let spent = false;
    updateResources((current) => {
      if (current.coins < amount) return current;
      spent = true;
      return { ...current, coins: current.coins - amount };
    });
    return spent;
  }, [updateResources]);

  const spendHint = useCallback((): boolean => {
    let spent = false;
    updateResources((current) => {
      if (current.freeHintNext) {
        spent = true;
        return { ...current, freeHintNext: false };
      }
      if (current.hintsRemaining > 0) {
        spent = true;
        return { ...current, hintsRemaining: current.hintsRemaining - 1 };
      }
      if (current.coins >= 20) {
        spent = true;
        return { ...current, coins: current.coins - 20 };
      }
      return current;
    });
    return spent;
  }, [updateResources]);

  const isItemOwned = useCallback((itemId: string) => ownedShopItems.includes(itemId), [ownedShopItems]);

  const buyShopItem = useCallback((itemId: string) => {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item) {
      play('wrong');
      return;
    }
    // Power-up'lar tüketilebilir: tekrar tekrar satın alınabilir. Kozmetikler
    // (tema/mühür) ise tek seferlik — ikinci alımı engelle.
    const consumable = item.category === 'power_up';
    let purchased = false;
    updateResources((current) => {
      if ((!consumable && current.ownedShopItems.includes(itemId)) || current.coins < item.price) return current;
      purchased = true;
      return {
        ...current,
        coins: current.coins - item.price,
        ownedShopItems: consumable || current.ownedShopItems.includes(itemId)
          ? current.ownedShopItems
          : [...current.ownedShopItems, itemId],
        selectedThemeId: item.category === 'theme' ? itemId : current.selectedThemeId,
        selectedSealId: item.category === 'seal' ? itemId : current.selectedSealId,
        doublerRemaining: itemId === 'doubler' ? current.doublerRemaining + DOUBLER_GAMES : current.doublerRemaining,
      };
    });
    if (!purchased) {
      play('wrong');
      return;
    }
    play('reward');
  }, [play, updateResources]);

  // Bir kullanım hakkı varsa tüketir ve buff'ın aktif olup olmadığını döndürür.
  const consumeDoubler = useCallback((): boolean => {
    let consumed = false;
    updateResources((current) => {
      if (current.doublerRemaining <= 0) return current;
      consumed = true;
      return { ...current, doublerRemaining: current.doublerRemaining - 1 };
    });
    return consumed;
  }, [updateResources]);

  const selectShopItem = useCallback((itemId: string) => {
    const item = shopItems.find((candidate) => candidate.id === itemId);
    if (!item) return;
    let selected = false;
    updateResources((current) => {
      if (!current.ownedShopItems.includes(itemId)) return current;
      if (item.category !== 'theme' && item.category !== 'seal') return current;
      selected = true;
      return {
        ...current,
        selectedThemeId: item.category === 'theme' ? itemId : current.selectedThemeId,
        selectedSealId: item.category === 'seal' ? itemId : current.selectedSealId,
      };
    });
    if (!selected) return;
    play('tap');
  }, [play, updateResources]);

  const pulseCoins = useCallback(() => {
    setCoinPulse(false);
    if (cleanup) {
      cleanup.safeRaf(() => setCoinPulse(true));
      cleanup.safeTimeout(() => setCoinPulse(false), 520);
    }
  }, [cleanup]);

  const value: ResourceContextValue = {
    coins, hintsRemaining, doublerRemaining,
    freeHintNext, ownedShopItems, selectedThemeId, selectedSealId, coinPulse,
    addCoins, spendCoins, spendHint, consumeDoubler,
    isItemOwned, buyShopItem, selectShopItem, pulseCoins, play, haptic,
  };

  return (
    <ResourceContext.Provider value={value}>
      {children}
    </ResourceContext.Provider>
  );
}
