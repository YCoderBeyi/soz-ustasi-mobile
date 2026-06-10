import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { LevelData, LevelMastery, WordEntry, DailyChallenge, LevelStats } from '../../types';
import type { ObjectiveKey } from '../../game/objectives';
import { levels, initialLevel } from '../../data/levels';
import { normalizeWord } from '../../game/normalize';
import { loadPlayerSave, persistPlayerSave, resolveCollectedWords } from '../../game/playerSave';
import { getDailyChallenge, claimDailyReward as claimDaily } from '../../game/dailyChallenge';
import { loadLevelStats, saveLevelStats, updateLevelStats } from '../../game/levelStats';

type PersistenceState = {
  currentLevelId: number;
  completedLevels: number[];
  awardedLevels: number[];
  levelMastery: Record<number, LevelMastery>;
  collectedWords: WordEntry[];
  favoriteWords: string[];
  levelStats: Record<number, LevelStats>;
  dailyChallenge: DailyChallenge | null;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
};

type PersistenceActions = {
  isLevelUnlocked: (candidate: LevelData) => boolean;
  markLevelCompleted: (levelId: number) => void;
  markLevelAwarded: (levelId: number) => void;
  mergeMastery: (levelId: number, objectives: ObjectiveKey[]) => void;
  addCollectedWord: (entry: WordEntry) => void;
  toggleFavorite: (word: string) => void;
  setSoundEnabled: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
  updateStats: (levelId: number, time: number, streak: number) => void;
  claimDailyReward: () => void;
};

type PersistenceContextValue = PersistenceState & PersistenceActions;

const PersistenceContext = createContext<PersistenceContextValue | null>(null);

export function usePersistence() {
  const ctx = useContext(PersistenceContext);
  if (!ctx) throw new Error('usePersistence must be used within PersistenceProvider');
  return ctx;
}

export function PersistenceProvider({ children }: { children: ReactNode }) {
  const save = loadPlayerSave();
  const [currentLevelId, setCurrentLevelId] = useState(save.currentLevelId);
  const [completedLevels, setCompletedLevels] = useState<number[]>(save.completedLevels);
  const [awardedLevels, setAwardedLevels] = useState<number[]>(save.awardedLevels);
  const [levelMastery, setLevelMastery] = useState<Record<number, LevelMastery>>(save.levelMastery);
  const [collectedWords, setCollectedWords] = useState<WordEntry[]>(() => resolveCollectedWords(save.collectedWords));
  const [favoriteWords, setFavoriteWords] = useState<string[]>(save.favoriteWords);
  const [soundEnabled, setSoundEnabled] = useState(save.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState(save.hapticsEnabled);
  const [levelStats, setLevelStats] = useState<Record<number, LevelStats>>(() => loadLevelStats());
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(() => getDailyChallenge());

  useEffect(() => {
    persistPlayerSave({
      version: 2, currentLevelId, coins: 0, completedLevels, awardedLevels,
      collectedWords: collectedWords.map((w) => w.word), favoriteWords,
      soundEnabled, hapticsEnabled, levelMastery, ownedShopItems: [],
      hintsRemaining: 0, lanternCount: 0, coinMultiplier: 1,
      doublerRemaining: 0, freeHintNext: false, levelStats,
    });
  }, [completedLevels, awardedLevels, levelMastery, collectedWords, favoriteWords,
      soundEnabled, hapticsEnabled, levelStats]);

  const isLevelUnlocked = useCallback((candidate: LevelData) => {
    if (candidate.levelId === 1) return true;
    if (completedLevels.includes(candidate.levelId)) return true;
    return completedLevels.includes(candidate.levelId - 1);
  }, [completedLevels]);

  const markLevelCompleted = useCallback((levelId: number) => {
    setCompletedLevels((items) => items.includes(levelId) ? items : [...items, levelId]);
  }, []);

  const markLevelAwarded = useCallback((levelId: number) => {
    setAwardedLevels((items) => items.includes(levelId) ? items : [...items, levelId]);
  }, []);

  const mergeMastery = useCallback((levelId: number, objectives: ObjectiveKey[]) => {
    setLevelMastery((prev) => {
      const existing = prev[levelId];
      const merged = existing
        ? [...new Set([...existing.objectives, ...objectives])]
        : objectives;
      return { ...prev, [levelId]: { stars: Math.min(3, merged.length), objectives: merged } };
    });
  }, []);

  const addCollectedWord = useCallback((entry: WordEntry) => {
    setCollectedWords((items) =>
      items.some((item) => normalizeWord(item.word) === normalizeWord(entry.word))
        ? items : [...items, entry]
    );
  }, []);

  const toggleFavorite = useCallback((word: string) => {
    setFavoriteWords((prev) => prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]);
  }, []);

  const updateStats = useCallback((levelId: number, time: number, streak: number) => {
    setLevelStats((prev) => {
      const updated = updateLevelStats(prev, levelId, time, streak, true);
      saveLevelStats(updated);
      return updated;
    });
  }, []);

  const claimDailyRewardImpl = useCallback(() => {
    if (dailyChallenge) {
      const updated = claimDaily(dailyChallenge);
      setDailyChallenge(updated);
    }
  }, [dailyChallenge]);

  const value: PersistenceContextValue = {
    currentLevelId, completedLevels, awardedLevels, levelMastery,
    collectedWords, favoriteWords, levelStats, dailyChallenge,
    soundEnabled, hapticsEnabled,
    isLevelUnlocked, markLevelCompleted, markLevelAwarded,
    mergeMastery, addCollectedWord, toggleFavorite,
    setSoundEnabled, setHapticsEnabled, updateStats,
    claimDailyReward: claimDailyRewardImpl,
  };

  return (
    <PersistenceContext.Provider value={value}>
      {children}
    </PersistenceContext.Provider>
  );
}
