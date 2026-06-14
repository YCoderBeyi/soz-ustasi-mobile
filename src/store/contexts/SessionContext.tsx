import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { LevelData, WordEntry, ScreenName, ThemeData } from '../../types';
import type { Feedback } from '../../game/playerSave';
import type { SfxName } from '../../audio';
import { normalizeWord } from '../../game/normalize';
import { shuffle } from '../../game/shuffle';
import { createCleanupRegistry } from '../../game/cleanup';
import { getTheme } from '../../data/themes';
import { initialLevel, levels } from '../../data/levels';
import type { ObjectiveKey } from '../../game/objectives';
import { getRunObjectives } from '../../game/objectives';

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
  rewardSummary: { base: number; hidden: number; flawless?: boolean; region?: number };
  earnedObjectives: ObjectiveKey[];
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
  play,
  haptic,
  awardedLevels,
  markLevelCompleted,
  markLevelAwarded,
  mergeMastery,
  addCollectedWord,
  updateStats,
}: {
  children: ReactNode;
  initialLevelId: number;
  setCurrentLevelId: (levelId: number) => void;
  addCoins: (amount: number) => void;
  play: (name: SfxName) => void;
  haptic: (pattern: number | number[]) => void;
  awardedLevels: number[];
  markLevelCompleted: (levelId: number) => void;
  markLevelAwarded: (levelId: number) => void;
  mergeMastery: (levelId: number, objectives: ObjectiveKey[]) => void;
  addCollectedWord: (entry: WordEntry) => void;
  updateStats: (levelId: number, time: number, streak: number) => void;
}) {
  const [level, setLevelState] = useState<LevelData>(
    () => levels.find((item) => item.levelId === initialLevelId) ?? initialLevel,
  );
  const [letters, setLetters] = useState<string[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [hiddenFound, setHiddenFound] = useState<WordEntry[]>([]);
  const [revealedLetters, setRevealedLetters] = useState<Record<string, number[]>>({});
  const [meaning, setMeaning] = useState<WordEntry | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [sealOpen, setSealOpen] = useState(false);
  const [canSeal, setCanSeal] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [levelTransitionKey, setLevelTransitionKey] = useState(0);
  const [modal, setModal] = useState<Modal>(null);
  const [toast, setToast] = useState('');
  const [screen, setScreen] = useState<ScreenName>('splash');
  const [rewardSummary, setRewardSummary] = useState<{ base: number; hidden: number; flawless?: boolean; region?: number }>({ base: 0, hidden: 0 });
  const [earnedObjectives, setEarnedObjectives] = useState<ObjectiveKey[]>([]);

  const cleanup = useRef(createCleanupRegistry()).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => cleanup.flushAll, []);

  const currentWord = selected.map((i) => letters[i]).join('');
  const complete = found.length === (level?.mainWords?.length ?? 0);
  const theme = getTheme(level?.themeId ?? 'eski-istanbul');

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
  }, []);

  const submitWord = useCallback((word: string) => {
    if (!word || !level) return;
    const normalized = normalizeWord(word);
    const main = level.mainWords.find((entry) => normalizeWord(entry.word) === normalized);
    const hidden = level.hiddenWords.find((entry) => normalizeWord(entry.word) === normalized);

    if (main && !found.includes(main.word)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((v) => Math.max(v, nextStreak));
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
      setHiddenFound((items) => [...items, hidden]);
      addCollectedWord(hidden);
      setMeaning(hidden);
      setFeedback('correct');
      setToast(`Gizli Kelime: ${hidden.word}`);
      play('hidden');
      haptic([30, 50, 30]);
      clearSelection();
      cleanup.safeTimeout(() => setMeaning(null), 5000);
      cleanup.safeTimeout(() => setFeedback(null), 600);
      cleanup.safeTimeout(() => setToast(''), 2200);
      return;
    }

    setStreak(0);
    setFeedback('wrong');
    play('wrong');
    haptic(100);
    clearSelection();
    cleanup.safeTimeout(() => setFeedback(null), 600);
  }, [level, found, hiddenFound, streak, cleanup, play, haptic, clearSelection]);

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
    setRevealedLetters({});
    setMeaning(null);
    setToast('');
    setStreak(0);
    setMaxStreak(0);
    setUsedHint(false);
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
  }, []);

  const revealLetterHint = useCallback(() => {
  }, []);

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
      const hiddenMultiplier = modifier?.type === 'cappadocia' ? 2 : 1;
      const hiddenBonus = hiddenFound.length * level.reward.hiddenWordBonus * hiddenMultiplier;
      const coinMult = modifier?.type === 'anatolian_autumn' ? 1.5 : 1;
      const baseReward = Math.round(level.reward.baseCoin * coinMult);
      
      const isRegionCompletion = level.levelId % 6 === 0;
      const regionBonus = isRegionCompletion ? 150 : 0;
      
      const totalReward = baseReward + hiddenBonus + regionBonus;
      addCoins(totalReward);
      markLevelAwarded(level.levelId);
      setRewardSummary({ base: baseReward, hidden: hiddenBonus, region: regionBonus });
    } else {
      setRewardSummary({ base: 0, hidden: 0 });
    }

    const runObjectives = getRunObjectives(level, hiddenFound.length, usedHint, maxStreak);
    setEarnedObjectives(runObjectives);
    mergeMastery(level.levelId, runObjectives);
    updateStats(level.levelId, elapsedTime, maxStreak);

    play('reward');
    cleanup.safeTimeout(() => setModal('reward'), 1200);
  }, [level, hiddenFound, usedHint, maxStreak, elapsedTime,
      sealOpen, awardedLevels, theme,
      addCoins, markLevelCompleted, markLevelAwarded,
      mergeMastery, updateStats, play, cleanup]);

  const setLevel = useCallback((lvl: LevelData) => {
    setLevelState(lvl);
    setCurrentLevelId(lvl.levelId);
  }, [setCurrentLevelId]);

  const value: SessionContextValue = {
    level, screen, letters, selected, found, hiddenFound, revealedLetters,
    meaning, feedback, streak, maxStreak, usedHint,
    sealOpen, canSeal, elapsedTime, complete, currentWord,
    levelTransitionKey, modal, toast, theme, rewardSummary, earnedObjectives,
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
