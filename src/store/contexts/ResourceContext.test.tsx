import { beforeEach, describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ResourceProvider, useResource } from './ResourceContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ResourceProvider soundEnabled={false} soundVolume={80} hapticsEnabled={false}>
      {children}
    </ResourceProvider>
  );
}

describe('ResourceContext', () => {
  beforeEach(() => window.localStorage.clear());

  it('starts with default values', () => {
    const { result } = renderHook(() => useResource(), { wrapper });
    expect(result.current.coins).toBe(120);
    expect(result.current.hintsRemaining).toBe(0);
    expect(result.current.coinMultiplier).toBe(1);
  });

  it('addCoins increases coins', () => {
    const { result } = renderHook(() => useResource(), { wrapper });
    act(() => result.current.addCoins(50));
    expect(result.current.coins).toBe(170);
  });

  it('spendCoins returns false when insufficient', () => {
    const { result } = renderHook(() => useResource(), { wrapper });
    let success: boolean;
    act(() => { success = result.current.spendCoins(999); });
    expect(success!).toBe(false);
    expect(result.current.coins).toBe(120);
  });

  it('spendCoins returns true when sufficient', () => {
    const { result } = renderHook(() => useResource(), { wrapper });
    let success: boolean;
    act(() => { success = result.current.spendCoins(20); });
    expect(success!).toBe(true);
    expect(result.current.coins).toBe(100);
  });

  it('buys, selects and persists a theme', () => {
    const { result } = renderHook(() => useResource(), { wrapper });
    act(() => result.current.buyShopItem('theme_ege'));
    expect(result.current.coins).toBe(40);
    expect(result.current.isItemOwned('theme_ege')).toBe(true);
    expect(result.current.selectedThemeId).toBe('theme_ege');

    const saved = JSON.parse(window.localStorage.getItem('soz-ustasi-player-v1') ?? '{}');
    expect(saved.ownedShopItems).toContain('theme_ege');
    expect(saved.selectedThemeId).toBe('theme_ege');
  });

  it('does not charge twice and allows owned cosmetics to be selected', () => {
    const { result } = renderHook(() => useResource(), { wrapper });
    act(() => result.current.buyShopItem('seal_gold'));
    act(() => result.current.buyShopItem('seal_gold'));
    expect(result.current.coins).toBe(70);
    expect(result.current.ownedShopItems).toEqual(['seal_gold']);

    act(() => result.current.selectShopItem('seal_gold'));
    expect(result.current.selectedSealId).toBe('seal_gold');
  });
});
