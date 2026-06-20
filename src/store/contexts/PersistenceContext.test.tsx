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
