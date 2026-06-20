import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { DailyChallenge, LevelData, WordEntry, ScreenName, ThemeData } from '../../types';
import type { Feedback } from '../../game/playerSave';
import type { SfxName } from '../../audio';
import { normalizeWord } from '../../game/normalize';
import { shuffle } from '../../game/shuffle';
import { createCleanupRegistry } from '../../game/cleanup';
import { getTheme } from '../../data/themes';
import { initialLevel, levels } from '../../data/levels';
import type { ObjectiveKey } from '../../game/objectives';
import { getRunObjectives } from '../../game/objectives';
import { findBonusDictionaryWord } from '../../game/bonusDictionary';
import { getThemeIdForShopItem } from '../../data/shop';
import { getBonusWordReward } from '../../game/wordRewards';

type Modal = 'level' | 'hint' | 'pause' | 'privacy' | 'reward' | null;

type SessionState = {
  level: LevelData;
  screen: ScreenName;
  letters: string[];
  selected: number[];
  found: string[];
  hiddenFound: WordEntry[];
  revealedLetters: Record<string, number[]>;
  meaning: WordEntry | null;
  feedback: Feedback;
  streak: number;
  maxStreak: number;
  wrongAttempts: number;
  usedHint: boolean;
  sealOpen: boolean;
  canSeal: boolean;
  elapsedTime: number;
  complete: boolean;
  currentWord: string;
  levelTransitionKey: number;
  modal: Modal;
  toast: string;
  theme: ThemeData;
  rewardSummary: { base: number; hidden: number; flawless?: boolean; region?: number; doubled?: boolean };
  earnedObjectives: ObjectiveKey[];
  missingHiddenCount: number;
  missingHiddenWordLengths: number[];
};

type SessionActions = {
  startLevel: (level?: LevelData) => void;
  goToNextLevel: () => void;
  submitWord: (word: string) => void;
  clearSelection: () => void;
  shuffleLetters: () => void;
  revealMeaningHint: () => void;
  revealLetterHint: () => void;
  setModal: (modal: Modal) => void;
  setToast: (message: string) => void;
  setScreen: (screen: ScreenName) => void;
  setLevel: (level: LevelData) => void;
  setRewardSummary: (summary: { base: number; hidden: number }) => void;
  setEarnedObjectives: (keys: ObjectiveKey[]) => void;
  submitCurrentWord: () => void;
  manualOpenSeal: () => void;
};

type SessionContextValue = SessionState & SessionActions;

const SessionContext = createContext<SessionContextValue | null>(null);

function canBuildFromLetters(word: string, letters: string[]): boolean {
  const available = letters.map(normalizeWord);
  return [...normalizeWord(word)].every((char) => {
    const index = available.indexOf(char);
    if (index === -1) return false;
    available.splice(index, 1);
    return true;
  });
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

export function SessionProvider({
  children,
  initialLevelId,
  setCurrentLevelId,
  addCoins,
  spendHint,
  consumeDoubler,
  play,
  haptic,
  awardedLevels,
  markLevelCompleted,
  markLevelAwarded,
  markWordRewarded,
  isWordRewarded,
  countRewardedBonus,
  mergeMastery,
  addCollectedWord,
  updateStats,
  dailyChallenge,
  claimDailyReward,
  selectedThemeId,
}: {
  children: ReactNode;
  initialLevelId: number;
  setCurrentLevelId: (levelId: number) => void;
  addCoins: (amount: number) => void;
  spendHint: () => boolean;
  consumeDoubler: () => boolean;
  play: (name: SfxName) => void;
  haptic: (pattern: number | number[]) => void;
  awardedLevels: number[];
  markLevelCompleted: (levelId: number) => void;
  markLevelAwarded: (levelId: number) => void;
  markWordRewarded: (key: string) => void;
  isWordRewarded: (key: string) => boolean;
  countRewardedBonus: (levelId: number) => number;
  mergeMastery: (levelId: number, objectives: ObjectiveKey[]) => void;
  addCollectedWord: (entry: WordEntry) => void;
  updateStats: (levelId: number, time: number, streak: number) => void;
  dailyChallenge: DailyChallenge | null;
  claimDailyReward: () => void;
  selectedThemeId: string | null;
}) {
  const [level, setLevelState] = useState<LevelData>(
    () => levels.find((item) => item.levelId === initialLevelId) ?? initialLevel,
  );
  const [letters, setLetters] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [hiddenFound, setHiddenFound] = useState<WordEntry[]>([]);
  const [bonusFound, setBonusFound] = useState<string[]>([]);
  const [revealedLetters, setRevealedLetters] = useState<Record<string, number[]>>({});
  const [meaning, setMeaning] = useState<WordEntry | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  // KUSURSUZ takibi: wrongAttempts doğru kelimede sıfırlandığı için (ipucu mantığı)
  // gerçek "hatasız" durumu ayrı, korunan bir bayrakla izlenir.
  const [perfectRun, setPerfectRun] = useState(true);
  const [sealOpen, setSealOpen] = useState(false);
  const [canSeal, setCanSeal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [levelTransitionKey, setLevelTransitionKey] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState('');
  const [screen, setScreen] = useState<ScreenName>('splash');
  const [rewardSummary, setRewardSummary] = useState<{ base: number; hidden: number; flawless?: boolean; region?: number; doubled?: boolean }>({ base: 0, hidden: 0 });
  const [earnedObjectives, setEarnedObjectives] = useState<ObjectiveKey[]>([]);

  const cleanup = useRef(createCleanupRegistry()).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => cleanup.flushAll, []);

  const currentWord = selected.map((i) => letters[i]).join('');
  const complete = found.length === (level?.mainWords?.length ?? 0);
  const selectedGameThemeId = getThemeIdForShopItem(selectedThemeId);
  const theme = getTheme(selectedGameThemeId ?? level?.themeId ?? 'old_istanbul');
  const missingHiddenWords = level.hiddenWords.filter(
    (entry) => !hiddenFound.some((foundEntry) => normalizeWord(foundEntry.word) === normalizeWord(entry.word)),
  );
  const missingHiddenCount = missingHiddenWords.length;
  const missingHiddenWordLengths = missingHiddenWords.map((entry) => [...entry.word].length);

  useEffect(() => {
    if (screen === 'game' && complete && !sealOpen && !canSeal) {
      stopTimer();
      setCanSeal(true);
      play('seal');
      haptic([40, 20, 60, 20, 80]);
    }
  }, [complete, sealOpen, canSeal, screen]);

  function startTimer() {
    if (timerRef.current) return;
    elapsedRef.current = 0;
    timerRef.current = setInterval(() => {
      elapsedRef.current++;
      setElapsedTime(elapsedRef.current);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  function resetTimer() {
    stopTimer();
    elapsedRef.current = 0;
    setElapsedTime(0);
  }

  const clearSelection = useCallback(() => {
    setSelected([]);
  }, []);

  const shuffleLetters = useCallback(() => {
    setLetters((prev) => shuffle(prev));
    play('shuffle');
    setToast('Harfler karıştırıldı');
    cleanup.safeTimeout(() => setToast(''), 900);
  }, [cleanup, play]);

  const submitWord = useCallback((word: string) => {
    if (!word || !level) return;
    const normalized = normalizeWord(word);
    const main = level.mainWords.find((entry) => normalizeWord(entry.word) === normalized);
    const hidden = level.hiddenWords.find((entry) => normalizeWord(entry.word) === normalized);
    const dictionaryEntry = levels
      .flatMap((item) => [...item.mainWords, ...item.hiddenWords])
      .find((entry) => normalizeWord(entry.word) === normalized)
      ?? findBonusDictionaryWord(normalized);

    if (main && !found.includes(main.word)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((v) => Math.max(v, nextStreak));
      setWrongAttempts(0);
      setFound((items) => [...items, main.word]);
      addCollectedWord(main);
      setMeaning(main);
      setFeedback('correct');
      play('correct');
      haptic(50);
      clearSelection();
      startTimer();
      cleanup.safeTimeout(() => setMeaning(null), 5000);
      cleanup.safeTimeout(() => setFeedback(null), 600);
      return;
    }

    if (hidden && !hiddenFound.some((entry) => normalizeWord(entry.word) === normalized)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((v) => Math.max(v, nextStreak));
      setWrongAttempts(0);
      setHiddenFound((items) => [...items, hidden]);
      addCollectedWord(hidden);
      const hiddenMultiplier = theme.modifier?.type === 'cappadocia' ? 2 : 1;
      const hiddenReward = (hidden.reward ?? level.reward.hiddenWordBonus) * hiddenMultiplier;
      const rewardKey = `${level.levelId}:hidden:${normalized}`;
      const shouldReward = !isWordRewarded(rewardKey);
      if (shouldReward) {
        addCoins(hiddenReward);
        markWordRewarded(rewardKey);
      }
      setMeaning(hidden);
      setFeedback('correct');
      setToast(
        shouldReward
          ? `Gizli Kelime: ${hidden.word} · +${hiddenReward} altın`
          : `Gizli Kelime: ${hidden.word} · daha önce ödüllendirildi`,
      );
      play('hidden');
      haptic([30, 50, 30]);
      clearSelection();
      cleanup.safeTimeout(() => setMeaning(null), 5000);
      cleanup.safeTimeout(() => setFeedback(null), 600);
      cleanup.safeTimeout(() => setToast(''), 2200);
      return;
    }

    if (dictionaryEntry && !bonusFound.includes(normalized)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((v) => Math.max(v, nextStreak));
      setWrongAttempts(0);
      setBonusFound((items) => [...items, normalized]);
      addCollectedWord(dictionaryEntry);
      const bonusReward = getBonusWordReward(dictionaryEntry.word, countRewardedBonus(level.levelId));
      const rewardKey = `${level.levelId}:bonus:${normalized}`;
      const alreadyRewarded = isWordRewarded(rewardKey);
      const shouldReward = bonusReward > 0 && !alreadyRewarded;
      if (shouldReward) {
        addCoins(bonusReward);
        markWordRewarded(rewardKey);
      }
      setMeaning(dictionaryEntry);
      setFeedback('hidden');
      setToast(
        shouldReward
          ? `Bonus Kelime: ${dictionaryEntry.word} · +${bonusReward} altın`
          : alreadyRewarded
            ? `Bonus Kelime: ${dictionaryEntry.word} · daha önce ödüllendirildi`
          : `Bonus Kelime: ${dictionaryEntry.word} · ödül sınırına ulaşıldı`,
      );
      play('hidden');
      haptic([20, 30, 20]);
      clearSelection();
      startTimer();
      cleanup.safeTimeout(() => setMeaning(null), 5000);
      cleanup.safeTimeout(() => setFeedback(null), 600);
      cleanup.safeTimeout(() => setToast(''), 2200);
      return;
    }

    if (normalized.length >= 2 && canBuildFromLetters(normalized, level.letters)) {
      setFeedback('unknown');
      setToast('Bu kelime henüz sözlüğümüzde yok; seri bozulmadı');
      play('tap');
      clearSelection();
      cleanup.safeTimeout(() => setFeedback(null), 700);
      cleanup.safeTimeout(() => setToast(''), 2200);
      return;
    }

    setStreak(0);
    setPerfectRun(false);
    const nextWrongAttempts = wrongAttempts + 1;
    setWrongAttempts(nextWrongAttempts);
    setFeedback('wrong');
    play('wrong');
    haptic(100);
    clearSelection();
    cleanup.safeTimeout(() => setFeedback(null), 600);
  }, [
    level, found, hiddenFound, bonusFound, streak, wrongAttempts, cleanup, play, haptic, theme,
    clearSelection, addCollectedWord, addCoins, isWordRewarded, markWordRewarded, countRewardedBonus,
  ]);

  const startLevel = useCallback((nextLevel?: LevelData) => {
    if (!nextLevel) return;
    if (resetTimerRef.current) {
      clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    resetTimer();
    setLevelTransitionKey((k) => k + 1);
    setLevelState(nextLevel);
    setCurrentLevelId(nextLevel.levelId);
    setLetters(shuffle(nextLevel.letters));
    setSelected([]);
    setFound([]);
    setHiddenFound([]);
    setBonusFound([]);
    setRevealedLetters({});
    setMeaning(null);
    setToast('');
    setStreak(0);
    setMaxStreak(0);
    setWrongAttempts(0);
    setUsedHint(false);
    setPerfectRun(true);
    setSealOpen(false);
    setCanSeal(false);
    setModal(null);
    setScreen('game');
  }, [setCurrentLevelId]);

  const goToNextLevel = useCallback(() => {
    setModal(null);
    const currentIndex = levels.findIndex((item) => item.levelId === level.levelId);
    const nextLevel = levels[currentIndex + 1];
    if (nextLevel) {
      startLevel(nextLevel);
    } else {
      setScreen('map');
      setToast('Tüm yayın seviyeleri tamamlandı');
      cleanup.safeTimeout(() => setToast(''), 1600);
    }
  }, [level, startLevel, setScreen, cleanup]);

  const revealMeaningHint = useCallback(() => {
    const target = level.mainWords.find((entry) => !found.includes(entry.word));
    if (!target) {
      setToast('Bu seviyedeki tüm ana kelimeleri buldun');
      setModal(null);
      return;
    }
    if (!spendHint()) {
      setToast('İpucu için 20 altın gerekiyor');
      return;
    }
    setUsedHint(true);
    setMeaning({ word: 'ANLAM İPUCU', meaning: target.meaning });
    setFeedback('hint');
    play('hint');
    setModal(null);
    cleanup.safeTimeout(() => setMeaning(null), 6000);
    cleanup.safeTimeout(() => setFeedback(null), 700);
  }, [level, found, spendHint, cleanup, play]);

  const revealLetterHint = useCallback(() => {
    const target = level.mainWords.find((entry) => {
      const revealed = revealedLetters[entry.word] ?? [];
      return !found.includes(entry.word) && revealed.length < entry.word.length;
    });
    if (!target) {
      setToast('Açılacak harf kalmadı');
      setModal(null);
      return;
    }
    if (!spendHint()) {
      setToast('İpucu için 20 altın gerekiyor');
      return;
    }
    const revealed = revealedLetters[target.word] ?? [];
    const nextIndex = [...target.word].findIndex((_, index) => !revealed.includes(index));
    setRevealedLetters((items) => ({
      ...items,
      [target.word]: [...(items[target.word] ?? []), nextIndex],
    }));
    setUsedHint(true);
    setToast(`${target.word.length} harfli bir kelimeden harf açıldı`);
    setFeedback('hint');
    play('hint');
    setModal(null);
    cleanup.safeTimeout(() => setFeedback(null), 700);
    cleanup.safeTimeout(() => setToast(''), 1800);
  }, [level, found, revealedLetters, spendHint, cleanup, play]);

  const submitCurrentWord = useCallback(() => {
    const word = selected.map((i) => letters[i]).join('');
    if (word) submitWord(word);
    clearSelection();
  }, [selected, letters, submitWord, clearSelection]);

  const manualOpenSeal = useCallback(() => {
    if (sealOpen) return;
    setSealOpen(true);
    stopTimer();
    markLevelCompleted(level.levelId);

    if (!awardedLevels.includes(level.levelId)) {
      const modifier = theme.modifier;
      const coinMult = modifier?.type === 'anatolian_autumn' ? 1.5 : 1;
      const baseReward = Math.round(level.reward.baseCoin * coinMult);
      
      const isRegionCompletion = level.levelId % 6 === 0;
      const regionBonus = isRegionCompletion ? 150 : 0;

      // KUSURSUZ: hatasız ve ipuçsuz tamamlama. RewardModal "+%50" satırını zaten
      // gösteriyordu fakat hiç tetiklenmiyordu; vaat edilen ödül burada gerçek yapılır.
      const isFlawless = perfectRun && !usedHint;
      const flawlessBonus = isFlawless ? Math.round(baseReward * 0.5) : 0;

      let totalReward = baseReward + regionBonus + flawlessBonus;
      // Altın Katlayıcı buff'ı aktifse bölüm ödülünü 2'ye katlar ve bir hak tüketir.
      const doubled = consumeDoubler();
      if (doubled) totalReward *= 2;
      addCoins(totalReward);
      markLevelAwarded(level.levelId);
      setRewardSummary({ base: baseReward, hidden: 0, region: regionBonus, flawless: isFlawless, doubled });
    } else {
      setRewardSummary({ base: 0, hidden: 0 });
    }

    if (
      dailyChallenge
      && !dailyChallenge.completed
      && dailyChallenge.levelId === level.levelId
    ) {
      addCoins(dailyChallenge.reward);
      claimDailyReward();
      setToast(`Günün görevi tamamlandı: +${dailyChallenge.reward} altın`);
    }

    const runObjectives = getRunObjectives(level, hiddenFound.length, usedHint, maxStreak);
    setEarnedObjectives(runObjectives);
    mergeMastery(level.levelId, runObjectives);
    updateStats(level.levelId, elapsedTime, maxStreak);

    play('reward');
    cleanup.safeTimeout(() => setModal('reward'), 1200);
  }, [level, hiddenFound, usedHint, maxStreak, elapsedTime,
      sealOpen, awardedLevels, theme, perfectRun,
      addCoins, markLevelCompleted, markLevelAwarded, consumeDoubler,
      mergeMastery, updateStats, play, cleanup, dailyChallenge, claimDailyReward]);

  const setLevel = useCallback((lvl: LevelData) => {
    setLevelState(lvl);
    setCurrentLevelId(lvl.levelId);
  }, [setCurrentLevelId]);

  const value: SessionContextValue = {
    level, screen, letters, selected, found, hiddenFound, revealedLetters,
    meaning, feedback, streak, maxStreak, wrongAttempts, usedHint,
    sealOpen, canSeal, elapsedTime, complete, currentWord,
    levelTransitionKey, modal, toast, theme, rewardSummary, earnedObjectives,
    missingHiddenCount, missingHiddenWordLengths,
    startLevel, goToNextLevel, submitWord, clearSelection, shuffleLetters,
    revealMeaningHint, revealLetterHint,
    setModal, setToast, setScreen, setLevel, setRewardSummary, setEarnedObjectives,
    submitCurrentWord, manualOpenSeal,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
