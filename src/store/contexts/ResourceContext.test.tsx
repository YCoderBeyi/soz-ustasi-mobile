import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ResourceProvider, useResource } from './ResourceContext';

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ResourceProvider soundEnabled={true} hapticsEnabled={true}>
      {children}
    </ResourceProvider>
  );
}

describe('ResourceContext', () => {
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
});
