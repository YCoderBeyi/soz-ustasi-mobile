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
    expect(result.current.doublerRemaining).toBe(0);
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

  it('doubler is a repeatable power-up that stacks remaining games and persists', () => {
    const { result } = renderHook(() => useResource(), { wrapper });
    expect(result.current.doublerRemaining).toBe(0);

    act(() => result.current.buyShopItem('doubler'));
    expect(result.current.coins).toBe(60); // 120 - 60
    expect(result.current.doublerRemaining).toBe(3);

    act(() => result.current.buyShopItem('doubler')); // rebuyable, stacks
    expect(result.current.coins).toBe(0);
    expect(result.current.doublerRemaining).toBe(6);

    const saved = JSON.parse(window.localStorage.getItem('soz-ustasi-player-v1') ?? '{}');
    expect(saved.doublerRemaining).toBe(6);
    // Consumable power-ups are not tracked as owned cosmetics.
    expect(result.current.ownedShopItems).not.toContain('doubler');
  });

  it('consumeDoubler decrements one game and reports whether it was active', () => {
    const { result } = renderHook(() => useResource(), { wrapper });
    act(() => result.current.buyShopItem('doubler'));

    let active: boolean;
    act(() => { active = result.current.consumeDoubler(); });
    expect(active!).toBe(true);
    expect(result.current.doublerRemaining).toBe(2);

    act(() => { result.current.consumeDoubler(); });
    act(() => { result.current.consumeDoubler(); });
    expect(result.current.doublerRemaining).toBe(0);

    act(() => { active = result.current.consumeDoubler(); });
    expect(active!).toBe(false); // nothing left to consume
    expect(result.current.doublerRemaining).toBe(0);
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
