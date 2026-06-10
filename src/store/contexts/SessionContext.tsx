import { createContext, useContext, useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import type { LevelData, WordEntry } from '../../types';
import type { Feedback } from '../../game/playerSave';
import type { SfxName } from '../../audio';
import { normalizeWord } from '../../game/normalize';
import { shuffle } from '../../game/shuffle';
import { createCleanupRegistry } from '../../game/cleanup';

type Modal = 'level' | 'hint' | 'pause' | 'privacy' | 'reward' | null;

type SessionState = {
  level: LevelData;
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
  addCoins,
  play,
  haptic,
}: {
  children: ReactNode;
  addCoins: (amount: number) => void;
  play: (name: SfxName) => void;
  haptic: (pattern: number | number[]) => void;
}) {
  const [level, setLevel] = useState<LevelData>(null!);
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

  const cleanup = useRef(createCleanupRegistry()).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => cleanup.flushAll, []);

  const currentWord = selected.map((i) => letters[i]).join('');
  const complete = found.length === (level?.mainWords?.length ?? 0);

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
      setMeaning(main);
      setFeedback('correct');
      play('correct');
      haptic(50);
      clearSelection();
      startTimer();
      cleanup.safeTimeout(() => setMeaning(null), 2200);
      cleanup.safeTimeout(() => setFeedback(null), 600);
      return;
    }

    if (hidden && !hiddenFound.some((entry) => normalizeWord(entry.word) === normalized)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((v) => Math.max(v, nextStreak));
      setHiddenFound((items) => [...items, hidden]);
      setMeaning(hidden);
      setFeedback('correct');
      setToast(`Gizli Kelime: ${hidden.word}`);
      play('hidden');
      haptic([30, 50, 30]);
      clearSelection();
      cleanup.safeTimeout(() => setMeaning(null), 2200);
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
    setLevel(nextLevel);
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
  }, []);

  const goToNextLevel = useCallback(() => {
    setModal(null);
  }, []);

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
  }, []);

  const value: SessionContextValue = {
    level, letters, selected, found, hiddenFound, revealedLetters,
    meaning, feedback, streak, maxStreak, usedHint,
    sealOpen, canSeal, elapsedTime, complete, currentWord,
    levelTransitionKey, modal, toast,
    startLevel, goToNextLevel, submitWord, clearSelection, shuffleLetters,
    revealMeaningHint, revealLetterHint,
    setModal, setToast, submitCurrentWord, manualOpenSeal,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
