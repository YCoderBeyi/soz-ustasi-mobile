import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { SessionProvider, useSession } from './SessionContext';
import type { LevelData } from '../../types';
import type { DailyChallenge } from '../../types';
import { levels } from '../../data/levels';
import { normalizeWord } from '../../game/normalize';
import { findBonusDictionaryWord } from '../../game/bonusDictionary';
import { GENERATED_BONUS_WORDS } from '../../data/bonusWords.generated';

vi.mock('../../services/admob', () => ({
  showRewardedAd: vi.fn(),
  initializeAdMob: vi.fn(),
  showAdPrivacyOptions: vi.fn(),
  getRewardedAdsLeftToday: vi.fn(() => 6),
  subscribeRewardedAdsLeft: vi.fn(() => () => undefined),
}));

import { showRewardedAd } from '../../services/admob';

const mockedShowRewardedAd = vi.mocked(showRewardedAd);

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
  secondChanceEnabled?: boolean;
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
        updateStats={vi.fn(() => 0)}
        dailyChallenge={options.dailyChallenge ?? null}
        claimDailyReward={options.claimDailyReward ?? vi.fn()}
        selectedThemeId={null}
        secondChanceEnabled={options.secondChanceEnabled ?? false}
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

  it('keeps every score update when several words land in the same render', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });
    act(() => result.current.startLevel({
      ...testLevel,
      mainWords: [
        { word: 'BALON', meaning: 'a' }, { word: 'BAL', meaning: 'b' }, { word: 'ALON', meaning: 'c' },
      ],
    }));
    act(() => {
      result.current.submitWord('BALON');
      result.current.submitWord('BAL');
      result.current.submitWord('ALON');
    });
    // 50 + 30 + 40 with no multiplier yet (combo reaches 3 only after the third word).
    expect(result.current.score).toBe(120);
    act(() => result.current.submitWord('XXXXX'));
    expect(result.current.score).toBe(120);
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

  it('letter hint skips a crossword cell already visible through a found crossing word', () => {
    const crossingLevel: LevelData = {
      ...testLevel,
      mainWords: [
        { word: 'BALON', meaning: 'Birinci kelime' },
        { word: 'BOL', meaning: 'İkinci kelime' },
      ],
    };
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });

    act(() => result.current.startLevel(crossingLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.revealLetterHint());

    expect(result.current.revealedLetters.BOL).toEqual([1]);
  });

  it('completes a word and unlocks the seal when its final letter is revealed by hints', () => {
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper() });

    act(() => result.current.startLevel(testLevel));
    for (let index = 0; index < testLevel.mainWords[0].word.length; index++) {
      act(() => result.current.revealLetterHint());
    }

    expect(result.current.found).toContain('BALON');
    expect(result.current.complete).toBe(true);
    expect(result.current.canSeal).toBe(true);
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

  it('level 34 treats KATİP as a main word and TAKİP as a hidden discovery', () => {
    const addCoins = vi.fn();
    const level34 = levels.find((item) => item.levelId === 34);
    expect(level34).toBeDefined();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ addCoins }),
    });

    act(() => result.current.startLevel(level34));
    act(() => result.current.submitWord('KATİP'));
    act(() => result.current.submitWord('TAKİP'));

    expect(result.current.found).toContain('KATİP');
    expect(result.current.hiddenFound.map((entry) => entry.word)).toContain('TAKİP');
    expect(addCoins).toHaveBeenCalledWith(10);
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
    act(() => result.current.submitWord('KAP'));

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

  it('treats a buildable word outside the reviewed lists as neutral: no streak, no reward, no penalty', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper({ addCoins }) });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('NALOB'));

    expect(result.current.streak).toBe(1);
    expect(result.current.feedback).toBe('unknown');
    expect(result.current.toast).toContain('listemizde yok');
    expect(result.current.wrongAttempts).toBe(0);
    expect(addCoins).not.toHaveBeenCalled();
  });

  it('does not pay a bonus when an already-found main word is submitted again', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper({ addCoins }) });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('BALON'));

    expect(result.current.feedback).toBe('unknown');
    expect(result.current.toast).toContain('zaten bulundu');
    expect(result.current.streak).toBe(1);
    expect(result.current.wrongAttempts).toBe(0);
    expect(addCoins).not.toHaveBeenCalled();
  });

  it('never pays a bonus for a catalog word that the level letters cannot build', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper({ addCoins }) });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('KULAK'));

    expect(addCoins).not.toHaveBeenCalled();
    expect(result.current.streak).toBe(0);
    expect(result.current.feedback).toBe('wrong');
  });

  it('rewards a reviewed word without a hand-written meaning and shows no empty meaning card', () => {
    const authored = new Set(levels.flatMap((item) =>
      [...item.mainWords, ...item.hiddenWords].map((entry) => normalizeWord(entry.word))));
    const pick = GENERATED_BONUS_WORDS.find((word) =>
      [...word].length >= 4 && !authored.has(word) && !findBonusDictionaryWord(word)?.meaning);
    expect(pick).toBeDefined();

    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), { wrapper: createWrapper({ addCoins }) });
    act(() => result.current.startLevel({ ...testLevel, letters: [...pick!] }));
    act(() => result.current.submitWord(pick!));

    expect(result.current.feedback).toBe('hidden');
    expect(result.current.toast).toContain('Bonus Kelime');
    expect(result.current.meaning).toBeNull();
    expect(result.current.streak).toBe(1);
    expect(addCoins).toHaveBeenCalledTimes(1);
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

describe('SessionContext - ikinci şans ve reklamlı ipuçları', () => {
  beforeEach(() => {
    mockedShowRewardedAd.mockReset();
    mockedShowRewardedAd.mockResolvedValue(true);
  });

  it('ilk yanlışta İkinci Şans modalını açar ve cezayı erteler', () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ secondChanceEnabled: true }),
    });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('XXXXX'));

    expect(result.current.modal).toBe('secondChance');
    expect(result.current.streak).toBe(1);
    expect(result.current.wrongAttempts).toBe(0);
  });

  it('reklam izlenirse kusursuz bonus ve seri korunur', async () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ secondChanceEnabled: true, addCoins }),
    });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('XXXXX'));
    await act(async () => { await result.current.acceptSecondChance(); });

    expect(mockedShowRewardedAd).toHaveBeenCalledOnce();
    expect(result.current.modal).toBeNull();
    expect(result.current.streak).toBe(1);
    expect(result.current.wrongAttempts).toBe(0);

    act(() => result.current.submitWord('BALON'));
    act(() => result.current.manualOpenSeal());
    expect(result.current.rewardSummary.flawless).toBe(true);
    expect(addCoins).toHaveBeenCalledWith(75); // 50 + %50 (25)
  });

  it('vazgeçilirse ceza uygulanır ve kusursuz bonus verilmez', () => {
    const addCoins = vi.fn();
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ secondChanceEnabled: true, addCoins }),
    });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('XXXXX'));
    act(() => result.current.declineSecondChance());

    expect(result.current.modal).toBeNull();
    expect(result.current.streak).toBe(0);
    expect(result.current.wrongAttempts).toBe(1);

    act(() => result.current.submitWord('BALON'));
    act(() => result.current.manualOpenSeal());
    expect(result.current.rewardSummary.flawless).toBe(false);
    expect(addCoins).toHaveBeenCalledWith(50);
  });

  it('ikinci şans bir kez kullanıldıktan sonra tekrar teklif edilmez', async () => {
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ secondChanceEnabled: true }),
    });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('XXXXX'));
    await act(async () => { await result.current.acceptSecondChance(); });

    act(() => result.current.submitWord('YYYYY'));
    expect(result.current.modal).toBeNull();
    expect(result.current.wrongAttempts).toBe(1);
    expect(result.current.streak).toBe(0);
  });

  it('reklam başarısızsa İkinci Şans modalı açık kalır', async () => {
    mockedShowRewardedAd.mockResolvedValue(false);
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ secondChanceEnabled: true }),
    });
    act(() => result.current.startLevel(testLevel));
    act(() => result.current.submitWord('BALON'));
    act(() => result.current.submitWord('XXXXX'));
    await act(async () => { await result.current.acceptSecondChance(); });

    expect(result.current.modal).toBe('secondChance');
    expect(result.current.toast).toContain('Reklam');
    expect(result.current.wrongAttempts).toBe(0);
  });

  it('anlam ipucu reklamla altın harcamadan açılır', async () => {
    const spendHint = vi.fn(() => true);
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ spendHint }),
    });
    act(() => result.current.startLevel(testLevel));
    await act(async () => { await result.current.revealMeaningHintViaAd(); });

    expect(mockedShowRewardedAd).toHaveBeenCalledOnce();
    expect(spendHint).not.toHaveBeenCalled();
    expect(result.current.usedHint).toBe(true);
    expect(result.current.meaning?.meaning).toBe('test');
  });

  it('harf aç reklamla altın harcamadan bir harf gösterir', async () => {
    const spendHint = vi.fn(() => true);
    const { result } = renderHook(() => useSession(), {
      wrapper: createWrapper({ spendHint }),
    });
    act(() => result.current.startLevel(testLevel));
    await act(async () => { await result.current.revealLetterHintViaAd(); });

    expect(mockedShowRewardedAd).toHaveBeenCalledOnce();
    expect(spendHint).not.toHaveBeenCalled();
    expect(result.current.revealedLetters.BALON).toHaveLength(1);
    expect(result.current.usedHint).toBe(true);
  });

  describe('stall assist', () => {
    const twoWordLevel: LevelData = {
      ...testLevel,
      mainWords: [{ word: 'BALON', meaning: 'a' }, { word: 'BAL', meaning: 'b' }],
    };

    beforeEach(() => { vi.useFakeTimers(); });
    afterEach(() => { vi.useRealTimers(); });

    function setup() {
      const spendHint = vi.fn(() => true);
      const hook = renderHook(() => useSession(), { wrapper: createWrapper({ spendHint }) });
      act(() => hook.result.current.startLevel(twoWordLevel));
      return { ...hook, spendHint };
    }

    it('offers a free letter after 40 quiet seconds and gives it without cost or penalty', () => {
      const { result, spendHint } = setup();
      act(() => { vi.advanceTimersByTime(39_000); });
      expect(result.current.stallAssistOffer).toBe(false);
      act(() => { vi.advanceTimersByTime(2_000); });
      expect(result.current.stallAssistOffer).toBe(true);

      act(() => result.current.acceptStallAssist());
      expect(spendHint).not.toHaveBeenCalled();
      expect(Object.values(result.current.revealedLetters).flat()).toHaveLength(1);
      expect(result.current.usedHint).toBe(false);
      expect(result.current.stallAssistOffer).toBe(false);
    });

    it('resets the idle clock whenever the player finds a word', () => {
      const { result } = setup();
      act(() => { vi.advanceTimersByTime(30_000); });
      act(() => result.current.submitWord('BAL'));
      act(() => { vi.advanceTimersByTime(30_000); });
      expect(result.current.stallAssistOffer).toBe(false);
      act(() => { vi.advanceTimersByTime(12_000); });
      expect(result.current.stallAssistOffer).toBe(true);
    });

    it('offers only once per level, even after a dismissal', () => {
      const { result } = setup();
      act(() => { vi.advanceTimersByTime(41_000); });
      expect(result.current.stallAssistOffer).toBe(true);
      act(() => result.current.dismissStallAssist());
      act(() => { vi.advanceTimersByTime(120_000); });
      expect(result.current.stallAssistOffer).toBe(false);
    });

    it('lets the offer fade away on its own', () => {
      const { result } = setup();
      act(() => { vi.advanceTimersByTime(41_000); });
      expect(result.current.stallAssistOffer).toBe(true);
      act(() => { vi.advanceTimersByTime(16_000); });
      expect(result.current.stallAssistOffer).toBe(false);
    });

    it('gives a fresh budget on the next level', () => {
      const { result } = setup();
      act(() => { vi.advanceTimersByTime(41_000); });
      act(() => result.current.dismissStallAssist());
      act(() => result.current.startLevel(testLevel));
      act(() => { vi.advanceTimersByTime(2_000); });
      act(() => { vi.advanceTimersByTime(41_000); });
      expect(result.current.stallAssistOffer).toBe(true);
    });
  });
});
