import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SessionProvider, useSession } from './SessionContext';
import type { LevelData } from '../../types';

const testLevel: LevelData = {
  levelId: 1, themeId: 'eski-istanbul', sealId: 'balon',
  letters: ['B','A','L','O','N'],
  mainWords: [{ word: 'BALON', meaning: 'test' }],
  hiddenWords: [],
  story: '', reward: { baseCoin: 50, hiddenWordBonus: 25 },
};

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider addCoins={vi.fn()} play={vi.fn()} haptic={vi.fn()}>
      {children}
    </SessionProvider>
  );
}

describe('SessionContext', () => {
  it('startLevel sets level data and resets state', () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    act(() => result.current.startLevel(testLevel));
    expect(result.current.level.levelId).toBe(1);
    expect(result.current.streak).toBe(0);
    expect(result.current.found).toEqual([]);
    expect(result.current.sealOpen).toBe(false);
  });

  it('submitWord with correct main word updates found and streak', () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    expect(result.current.found).toEqual(['BALON']);
    expect(result.current.currentWord).toBe('');
    expect(result.current.streak).toBe(1);
  });

  it('submitWord with wrong word resets streak', () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    expect(result.current.streak).toBe(1);
    act(() => result.current.submitWord('XXXXX'));
    expect(result.current.streak).toBe(0);
  });

  it('clearSelection resets selected indices', () => {
    const { result } = renderHook(() => useSession(), { wrapper });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.clearSelection());
    expect(result.current.currentWord).toBe('');
  });
});
