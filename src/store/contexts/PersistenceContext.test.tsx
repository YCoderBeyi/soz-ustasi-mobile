import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PersistenceProvider, usePersistence } from './PersistenceContext';
import type { LevelData } from '../../types';

const testLevel: LevelData = {
  levelId: 1, themeId: 'eski-istanbul', sealId: 'balon',
  letters: [], mainWords: [], hiddenWords: [],
  story: '', reward: { baseCoin: 50, hiddenWordBonus: 25 },
};

describe('PersistenceContext', () => {
  it('isLevelUnlocked returns true for level 1', () => {
    const { result } = renderHook(() => usePersistence(), {
      wrapper: PersistenceProvider,
    });
    expect(result.current.isLevelUnlocked(testLevel)).toBe(true);
  });

  it('markLevelCompleted adds to completedLevels', () => {
    const { result } = renderHook(() => usePersistence(), {
      wrapper: PersistenceProvider,
    });
    act(() => result.current.markLevelCompleted(1));
    expect(result.current.completedLevels).toContain(1);
  });

  it('persists calm mode across restarts and defaults to off', () => {
    localStorage.clear();
    const first = renderHook(() => usePersistence(), { wrapper: PersistenceProvider });
    expect(first.result.current.calmMode).toBe(false);
    act(() => first.result.current.setCalmMode(true));
    first.unmount();
    const second = renderHook(() => usePersistence(), { wrapper: PersistenceProvider });
    expect(second.result.current.calmMode).toBe(true);
  });

  it('returns the previous best score and keeps the highest', () => {
    const { result } = renderHook(() => usePersistence(), { wrapper: PersistenceProvider });
    let before = -1;
    act(() => { before = result.current.updateStats(7, 30, 2, 200); });
    expect(before).toBe(0);
    act(() => { before = result.current.updateStats(7, 28, 2, 150); });
    expect(before).toBe(200);
    expect(result.current.levelStats[7]?.bestScore).toBe(200);
  });

  it('persists levelStats across app restarts', () => {
    localStorage.clear();
    const first = renderHook(() => usePersistence(), { wrapper: PersistenceProvider });
    act(() => first.result.current.updateStats(1, 42, 3));
    expect(first.result.current.levelStats[1]?.bestTime).toBe(42);
    expect(first.result.current.levelStats[1]?.bestStreak).toBe(3);
    first.unmount();

    // Simulate a fresh app launch: a new provider re-reads localStorage.
    const second = renderHook(() => usePersistence(), { wrapper: PersistenceProvider });
    expect(second.result.current.levelStats[1]?.bestTime).toBe(42);
    expect(second.result.current.levelStats[1]?.bestStreak).toBe(3);
  });
});
