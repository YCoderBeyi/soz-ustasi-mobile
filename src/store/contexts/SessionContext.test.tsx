import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SessionProvider, useSession } from './SessionContext';
import type { LevelData } from '../../types';
import type { DailyChallenge } from '../../types';
import { levels } from '../../data/levels';

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
  consumeDoubler?: () => boolean;
  dailyChallenge?: DailyChallenge | null;
  claimDailyReward?: () => void;
  rewardedWordKeys?: string[];
} = {}) {
  const spendHint = options.spendHint ?? vi.fn(() => true);
  const addCoins = options.addCoins ?? vi.fn();
  const consumeDoubler = options.consumeDoubler ?? vi.fn(() => false);
  const rewardedWordKeys = new Set(options.rewardedWordKeys ?? []);

  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <SessionProvider
        initialLevelId={1}
        setCurrentLevelId={vi.fn()}
        addCoins={addCoins}
        spendHint={spendHint}
        consumeDoubler={consumeDoubler}
        play={vi.fn()}
        haptic={vi.fn()}
        awardedLevels={[]}
        markLevelCompleted={vi.fn()}
        markLevelAwarded={vi.fn()}
        markWordRewarded={(key) => rewardedWordKeys.add(key)}
        isWordRewarded={(key) => rewardedWordKeys.has(key)}
        countRewardedBonus={(levelId) =>
          [...rewardedWordKeys].filter((key) => key.startsWith(`${levelId}:bonus:`)).length}
        mergeMastery={vi.fn()}
        addCollectedWord={vi.fn()}
        updateStats={vi.fn()}
        dailyChallenge={options.dailyChallenge ?? null}
        claimDailyReward={options.claimDailyReward ?? vi.fn()}
        selectedThemeId={null}
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

  it('does not reveal a hint after three wrong attempts', () => {
    const spendHint = vi.fn(() => true);
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ spendHint }),
    });
    act(() => result.current.startLevel(testLevel));

    act(() => result.current.submitWord('XXXXX'));
    act(() => result.current.submitWord('YYYYY'));
    act(() => result.current.submitWord('ZZZZZ'));

    expect(spendHint).not.toHaveBeenCalled();
    expect(result.current.wrongAttempts).toBe(3);
    expect(result.current.meaning).toBeNull();
    expect(result.current.toast).not.toContain('ipucu');
    expect(result.current.usedHint).toBe(false);
  });

  it('awards the configured reward when level 5 hidden word ERK is found', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });
    act(() => result.current.startLevel({
      levelId: 5,
      themeId: 'cappadocia',
      sealId: 'seal_cappadocia_01',
      letters: ['M', 'E', 'R', 'A', 'K'],
      mainWords: [{ word: 'MERAK', meaning: 'Merak.' }],
      hiddenWords: [{ word: 'ERK', meaning: 'Güç ve yetki.', reward: 8 }],
      reward: { baseCoin: 34, hiddenWordBonus: 7 },
    }));

    act(() => result.current.submitWord('ERK'));

    expect(result.current.hiddenFound.map((entry) => entry.word)).toContain('ERK');
    expect(result.current.toast).toContain('Gizli Kelime');
    expect(addCoins).toHaveBeenCalledWith(16);
  });

  it('resets consecutive wrong attempts after a correct discovery', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });
    act(() => result.current.startLevel({
      ...testLevel,
      mainWords: [
        { word: 'BALON', meaning: 'test' },
        { word: 'BOL', meaning: 'ikinci' },
      ],
    }));

    act(() => result.current.submitWord('XXXXX'));
    act(() => result.current.submitWord('YYYYY'));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('XXXXX'));

    expect(result.current.wrongAttempts).toBe(1);
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
    expect(addCoins).toHaveBeenCalledWith(1);
    expect(result.current.streak).toBe(1);
  });

  it('does not reward the same hidden word again on a replay', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({
        addCoins,
        rewardedWordKeys: ['5:hidden:ERK'],
      }),
    });
    act(() => result.current.startLevel({
      levelId: 5,
      themeId: 'cappadocia',
      sealId: 'seal_cappadocia_01',
      letters: ['M', 'E', 'R', 'A', 'K'],
      mainWords: [{ word: 'MERAK', meaning: 'Merak.' }],
      hiddenWords: [{ word: 'ERK', meaning: 'Güç ve yetki.', reward: 8 }],
      reward: { baseCoin: 34, hiddenWordBonus: 7 },
    }));

    act(() => result.current.submitWord('ERK'));

    expect(addCoins).not.toHaveBeenCalled();
    expect(result.current.hiddenFound.map((entry) => entry.word)).toContain('ERK');
    expect(result.current.toast).toContain('daha önce ödüllendirildi');
  });

  it('does not reward the same bonus word again on a replay', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({
        addCoins,
        rewardedWordKeys: ['1:bonus:BOL'],
      }),
    });

    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BOL'));

    expect(addCoins).not.toHaveBeenCalled();
    expect(result.current.feedback).toBe('hidden');
    expect(result.current.toast).toContain('daha önce ödüllendirildi');
  });

  it('keeps the bonus reward cap across replays via the persisted rewarded count', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({
        addCoins,
        // 5 bonus words already rewarded for level 1 in previous sessions.
        rewardedWordKeys: ['1:bonus:AAA', '1:bonus:BBB', '1:bonus:CCC', '1:bonus:DDD', '1:bonus:EEE'],
      }),
    });

    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BOL')); // a fresh, never-rewarded bonus word

    expect(result.current.feedback).toBe('hidden'); // still recognized as a discovery
    expect(result.current.toast).toContain('ödül sınırına ulaşıldı');
    expect(addCoins).not.toHaveBeenCalled();
  });

  it('does not pay a hidden word again when the seal opens', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });
    act(() => result.current.startLevel({
      levelId: 5,
      themeId: 'cappadocia',
      sealId: 'seal_cappadocia_01',
      letters: ['M', 'E', 'R', 'A', 'K'],
      mainWords: [{ word: 'MERAK', meaning: 'Merak.' }],
      hiddenWords: [{ word: 'ERK', meaning: 'Güç ve yetki.', reward: 8 }],
      reward: { baseCoin: 34, hiddenWordBonus: 7 },
    }));

    act(() => result.current.submitWord('ERK'));
    act(() => result.current.submitWord('MERAK'));
    act(() => result.current.manualOpenSeal());

    expect(addCoins).toHaveBeenCalledWith(16); // gizli ERK (cappadocia 2x)
    // Hatasız + ipuçsuz tamamlama: base 34 + KUSURSUZ %50 (17) = 51
    expect(addCoins).toHaveBeenCalledWith(51);
    expect(addCoins).toHaveBeenCalledTimes(2);
    expect(result.current.rewardSummary.hidden).toBe(0);
  });

  it('hatasız ve ipuçsuz tamamlamada KUSURSUZ +%50 ödülü verir', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });
    act(() => result.current.startLevel(testLevel)); // baseCoin 50, gizli yok
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.manualOpenSeal());

    expect(result.current.rewardSummary.flawless).toBe(true);
    expect(addCoins).toHaveBeenCalledWith(75); // 50 + %50 (25)
  });

  it('doubler buff aktifse bölüm ödülünü 2 katına çıkarır ve bir hak tüketir', () => {
    const addCoins = vi.fn();
    const consumeDoubler = vi.fn(() => true);
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins, consumeDoubler }),
    });
    act(() => result.current.startLevel(testLevel)); // baseCoin 50, gizli yok
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.manualOpenSeal());

    // base 50 + KUSURSUZ %50 (25) = 75, doubler ile ×2 = 150
    expect(consumeDoubler).toHaveBeenCalledTimes(1);
    expect(result.current.rewardSummary.doubled).toBe(true);
    expect(addCoins).toHaveBeenCalledWith(150);
  });

  it('yanlış deneme varsa KUSURSUZ ödülü verilmez', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('XXXXX')); // yanlış deneme
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.manualOpenSeal());

    expect(result.current.rewardSummary.flawless).toBe(false);
    expect(addCoins).toHaveBeenCalledWith(50); // sadece base, %50 yok
  });

  it('reports the remaining hidden discoveries', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });
    act(() => result.current.startLevel({
      ...testLevel,
      hiddenWords: [
        { word: 'BAL', meaning: 'Bal.', reward: 4 },
        { word: 'BOL', meaning: 'Bol.', reward: 4 },
      ],
    }));

    expect(result.current.missingHiddenCount).toBe(2);
    expect(result.current.missingHiddenWordLengths).toEqual([3, 3]);
    act(() => result.current.submitWord('BAL'));
    expect(result.current.missingHiddenCount).toBe(1);
  });

  it('accepts a curated common word missing from level objectives', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });
    act(() => result.current.startLevel({
      ...testLevel,
      letters: ['M', 'E', 'R', 'A', 'K'],
    }));

    act(() => result.current.submitWord('KREMA'));

    expect(result.current.feedback).toBe('hidden');
    expect(result.current.toast).toContain('Bonus Kelime');
    expect(addCoins).toHaveBeenCalledWith(3);
  });

  it('level 34 treats KATİP as a main word and KİL as a hidden discovery', () => {
    const addCoins = vi.fn();
    const level34 = levels.find((item) => item.levelId === 34);
    expect(level34).toBeDefined();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });

    act(() => result.current.startLevel(level34));
    act(() => result.current.submitWord('KATİP'));
    act(() => result.current.submitWord('KİL'));

    expect(result.current.found).toContain('KATİP');
    expect(result.current.hiddenFound.map((entry) => entry.word)).toContain('KİL');
    expect(addCoins).toHaveBeenCalledWith(8);
  });

  it('accepts safe side words from level 34 letters as bonus discoveries', () => {
    const addCoins = vi.fn();
    const level34 = levels.find((item) => item.levelId === 34);
    expect(level34).toBeDefined();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });

    act(() => result.current.startLevel(level34));
    act(() => result.current.submitWord('TİP'));
    act(() => result.current.submitWord('TAK'));

    expect(result.current.feedback).toBe('hidden');
    expect(addCoins).toHaveBeenCalledWith(1);
    expect(addCoins).toHaveBeenCalledTimes(2);
  });

  it('level 39 keeps sensitive MAL out and accepts AL as the hidden discovery', () => {
    const addCoins = vi.fn();
    const level39 = levels.find((item) => item.levelId === 39);
    expect(level39).toBeDefined();
    expect([
      ...level39!.mainWords.map((entry) => entry.word),
      ...level39!.hiddenWords.map((entry) => entry.word),
    ]).not.toContain('MAL');

    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });

    act(() => result.current.startLevel(level39));
    act(() => result.current.submitWord('AL'));

    expect(result.current.hiddenFound.map((entry) => entry.word)).toContain('AL');
    expect(addCoins).toHaveBeenCalledWith(20);
  });

  it('does not break the streak for an unknown but plausible word', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('NALOB'));

    expect(result.current.streak).toBe(1);
    expect(result.current.feedback).toBe('unknown');
    expect(result.current.toast).toContain('sözlüğümüzde');
    expect(result.current.wrongAttempts).toBe(0);
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
