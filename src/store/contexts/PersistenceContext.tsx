import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { LevelData, LevelMastery, WordEntry, DailyChallenge, LevelStats } from '../../types';
import type { ObjectiveKey } from '../../game/objectives';
import { chooseBestMastery } from '../../game/objectives';
import { normalizeWord } from '../../game/normalize';
import { loadPlayerSave, persistPlayerSave, resolveCollectedWords } from '../../game/playerSave';
import { getDailyChallenge, claimDailyReward as claimDaily } from '../../game/dailyChallenge';
import { saveLevelStats, updateLevelStats } from '../../game/levelStats';
import { levels } from '../../data/levels';

type PersistenceState = {
  currentLevelId: number;
  completedLevels: number[];
  awardedLevels: number[];
  rewardedWordKeys: string[];
  levelMastery: Record<number, LevelMastery>;
  collectedWords: WordEntry[];
  favoriteWords: string[];
  levelStats: Record<number, LevelStats>;
  dailyChallenge: DailyChallenge | null;
  soundEnabled: boolean;
  soundVolume: number;
  hapticsEnabled: boolean;
  reduceMotion: boolean;
};

type PersistenceActions = {
  setCurrentLevelId: (levelId: number) => void;
  isLevelUnlocked: (candidate: LevelData) => boolean;
  markLevelCompleted: (levelId: number) => void;
  markLevelAwarded: (levelId: number) => void;
  markWordRewarded: (key: string) => void;
  isWordRewarded: (key: string) => boolean;
  countRewardedBonus: (levelId: number) => number;
  mergeMastery: (levelId: number, objectives: ObjectiveKey[]) => void;
  addCollectedWord: (entry: WordEntry) => void;
  toggleFavorite: (word: string) => void;
  setSoundEnabled: (value: boolean) => void;
  setSoundVolume: (value: number) => void;
  setHapticsEnabled: (value: boolean) => void;
  setReduceMotion: (value: boolean) => void;
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
  const [rewardedWordKeys, setRewardedWordKeys] = useState<string[]>(save.rewardedWordKeys);
  const [levelMastery, setLevelMastery] = useState<Record<number, LevelMastery>>(save.levelMastery);
  const [collectedWords, setCollectedWords] = useState<WordEntry[]>(() => resolveCollectedWords(save.collectedWords));
  const [favoriteWords, setFavoriteWords] = useState<string[]>(save.favoriteWords);
  const [soundEnabled, setSoundEnabled] = useState(save.soundEnabled);
  const [soundVolume, setSoundVolume] = useState(save.soundVolume);
  const [hapticsEnabled, setHapticsEnabled] = useState(save.hapticsEnabled);
  const [reduceMotion, setReduceMotion] = useState(save.reduceMotion);
  // levelStats are read from the migrated player save (loadPlayerSave already
  // merges + removes the legacy soz-stats-v1 key). Reading via loadLevelStats()
  // here returned {} on every restart because the legacy key was already gone,
  // silently wiping best time/streak/attempts/completions each launch.
  const [levelStats, setLevelStats] = useState<Record<number, LevelStats>>(() => save.levelStats);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(() => {
    const eligibleLevelIds = levels
      .filter((level) =>
        level.levelId === 1
        || save.completedLevels.includes(level.levelId)
        || save.completedLevels.includes(level.levelId - 1)
      )
      .map((level) => level.levelId);
    return getDailyChallenge(eligibleLevelIds);
  });

  useEffect(() => {
    persistPlayerSave({
      ...loadPlayerSave(), version: 2, currentLevelId, completedLevels, awardedLevels, rewardedWordKeys,
      collectedWords: collectedWords.map((w) => w.word), favoriteWords,
      soundEnabled, soundVolume, hapticsEnabled, reduceMotion, levelMastery, levelStats,
    });
  }, [completedLevels, awardedLevels, rewardedWordKeys, levelMastery, collectedWords, favoriteWords,
      currentLevelId, soundEnabled, soundVolume, hapticsEnabled, reduceMotion, levelStats]);

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

  const markWordRewarded = useCallback((key: string) => {
    setRewardedWordKeys((items) => items.includes(key) ? items : [...items, key]);
  }, []);

  const isWordRewarded = useCallback((key: string) => rewardedWordKeys.includes(key), [rewardedWordKeys]);

  // Count of bonus words already rewarded for a level. Persisted across replays
  // so the MAX_REWARDED_BONUS_WORDS cap can't be reset by re-entering the level.
  const countRewardedBonus = useCallback(
    (levelId: number) => rewardedWordKeys.filter((key) => key.startsWith(`${levelId}:bonus:`)).length,
    [rewardedWordKeys],
  );

  const mergeMastery = useCallback((levelId: number, objectives: ObjectiveKey[]) => {
    setLevelMastery((prev) => {
      return { ...prev, [levelId]: chooseBestMastery(prev[levelId], objectives) };
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
    currentLevelId, completedLevels, awardedLevels, rewardedWordKeys, levelMastery,
    collectedWords, favoriteWords, levelStats, dailyChallenge,
    soundEnabled, soundVolume, hapticsEnabled, reduceMotion,
    setCurrentLevelId, isLevelUnlocked, markLevelCompleted, markLevelAwarded,
    markWordRewarded, isWordRewarded, countRewardedBonus,
    mergeMastery, addCollectedWord, toggleFavorite,
    setSoundEnabled, setSoundVolume, setHapticsEnabled, setReduceMotion, updateStats,
    claimDailyReward: claimDailyRewardImpl,
  };

  return (
    <PersistenceContext.Provider value={value}>
      {children}
    </PersistenceContext.Provider>
  );
}
