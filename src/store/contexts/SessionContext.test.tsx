import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SessionProvider, useSession } from './SessionContext';
import type { LevelData } from '../../types';
import type { DailyChallenge } from '../../types';

const testLevel: LevelData = {
  levelId: 1, themeId: 'eski-istanbul', sealId: 'balon',
  letters: ['B','A','L','O','N'],
  mainWords: [{ word: 'BALON', meaning: 'test' }],
  hiddenWords: [],
  story: '', reward: { baseCoin: 50, hiddenWordBonus: 25 },
};

function createWrapper(options: {
  spendHint?: () => boolean;
  addCoins?: (amount: number) => void;
  dailyChallenge?: DailyChallenge | null;
  claimDailyReward?: () => void;
} = {}) {
  const spendHint = options.spendHint ?? vi.fn(() => true);
  const addCoins = options.addCoins ?? vi.fn();

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider
        initialLevelId={1}
        setCurrentLevelId={vi.fn()}
        addCoins={addCoins}
        spendHint={spendHint}
        play={vi.fn()}
        haptic={vi.fn()}
        awardedLevels={[]}
        markLevelCompleted={vi.fn()}
        markLevelAwarded={vi.fn()}
        mergeMastery={vi.fn()}
        addCollectedWord={vi.fn()}
        updateStats={vi.fn()}
        dailyChallenge={options.dailyChallenge ?? null}
        claimDailyReward={options.claimDailyReward ?? vi.fn()}
      >
        {children}
      </SessionProvider>
    );
  };
}

describe('SessionContext', () => {
  it('startLevel sets level data and resets state', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });
    act(() => result.current.startLevel(testLevel));
    expect(result.current.level.levelId).toBe(1);
    expect(result.current.screen).toBe('game');
    expect(result.current.streak).toBe(0);
    expect(result.current.found).toEqual([]);
    expect(result.current.sealOpen).toBe(false);
  });

  it('submitWord with correct main word updates found and streak', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    expect(result.current.found).toEqual(['BALON']);
    expect(result.current.currentWord).toBe('');
    expect(result.current.streak).toBe(1);
  });

  it('submitWord with wrong word resets streak', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    expect(result.current.streak).toBe(1);
    act(() => result.current.submitWord('XXXXX'));
    expect(result.current.streak).toBe(0);
  });

  it('clearSelection resets selected indices', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.clearSelection());
    expect(result.current.currentWord).toBe('');
  });

  it('meaning hint spends one hint and reveals an unresolved word meaning', () => {
    const spendHint = vi.fn(() => true);
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ spendHint }),
    });

    act(() => result.current.startLevel(testLevel));
    act(() => result.current.revealMeaningHint());

    expect(spendHint).toHaveBeenCalledOnce();
    expect(result.current.usedHint).toBe(true);
    expect(result.current.meaning?.meaning).toBe('test');
    expect(result.current.modal).toBeNull();
  });

  it('does not reveal a hint when payment fails', () => {
    const spendHint = vi.fn(() => false);
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ spendHint }),
    });

    act(() => result.current.startLevel(testLevel));
    act(() => result.current.revealMeaningHint());

    expect(result.current.usedHint).toBe(false);
    expect(result.current.meaning).toBeNull();
    expect(result.current.toast).toContain('20');
  });

  it('letter hint reveals one new letter in an unresolved word', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });

    act(() => result.current.startLevel(testLevel));
    act(() => result.current.revealLetterHint());

    expect(result.current.revealedLetters.BALON).toHaveLength(1);
    expect(result.current.usedHint).toBe(true);
  });

  it('accepts a built-in dictionary word as a bonus discovery', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });

    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BOL'));

    expect(result.current.feedback).toBe('hidden');
    expect(result.current.toast).toContain('Bonus Kelime');
    expect(addCoins).toHaveBeenCalledWith(3);
    expect(result.current.streak).toBe(1);
  });

  it('awards a matching daily challenge once when the seal opens', () => {
    const addCoins = vi.fn();
    const claimDailyReward = vi.fn();
    const dailyChallenge: DailyChallenge = {
      date: '2026-06-14',
      levelId: 1,
      completed: false,
      reward: 100,
    };
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins, dailyChallenge, claimDailyReward }),
    });

    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.manualOpenSeal());
    act(() => result.current.manualOpenSeal());

    expect(addCoins).toHaveBeenCalledWith(100);
    expect(claimDailyReward).toHaveBeenCalledOnce();
  });
});
