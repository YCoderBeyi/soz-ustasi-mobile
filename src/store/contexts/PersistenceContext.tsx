import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';
import type { LevelData, LevelMastery, WordEntry, DailyChallenge, LevelStats } from '../../types';
import type { ObjectiveKey } from '../../game/objectives';
import { chooseBestMastery } from '../../game/objectives';
import { normalizeWord } from '../../game/normalize';
import { loadPlayerSave, persistPlayerSave, resolveCollectedWords, CURRENT_SAVE_VERSION } from '../../game/playerSave';
import { getDailyChallenge, claimDailyReward as claimDaily } from '../../game/dailyChallenge';
import { saveLevelStats, updateLevelStats } from '../../game/levelStats';
import { rewardKeyPrefix } from '../../game/lexicon';
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
  calmMode: boolean;
  leagueOptIn: boolean;
  leagueConsentAnswered: boolean;
  resources: ResourceSaveSlice;
};

/** Resource slice of PlayerSave — written only through Persistence (SSOT). */
export type ResourceSaveSlice = {
  coins: number;
  hintsRemaining: number;
  doublerRemaining: number;
  freeHintNext: boolean;
  ownedShopItems: string[];
  selectedThemeId: string | null;
  selectedSealId: string | null;
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
  setCalmMode: (value: boolean) => void;
  setLeagueOptIn: (value: boolean) => void;
  setLeagueConsentAnswered: (value: boolean) => void;
  /** Records the run and returns the best score stored before it (0 when none). */
  updateStats: (levelId: number, time: number, streak: number, score?: number) => number;
  claimDailyReward: () => void;
  /** Atomic in-memory update; this context owns persistence for the resource slice too. */
  updateResources: (updater: (current: ResourceSaveSlice) => ResourceSaveSlice) => ResourceSaveSlice;
};

type PersistenceContextValue = PersistenceState & PersistenceActions;

const PersistenceContext = createContext<PersistenceContextValue | null>(null);

export function usePersistence() {
  const ctx = useContext(PersistenceContext);
  if (!ctx) throw new Error('usePersistence must be used within PersistenceProvider');
  return ctx;
}

export function PersistenceProvider({ children }: { children: ReactNode }) {
  const [save] = useState(loadPlayerSave);
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
  const [calmMode, setCalmMode] = useState(save.calmMode);
  const [leagueOptIn, setLeagueOptIn] = useState(save.leagueOptIn);
  const [leagueConsentAnswered, setLeagueConsentAnswered] = useState(save.leagueConsentAnswered);
  const [resources, setResources] = useState<ResourceSaveSlice>(() => ({
    coins: save.coins,
    hintsRemaining: save.hintsRemaining,
    doublerRemaining: save.doublerRemaining,
    freeHintNext: save.freeHintNext,
    ownedShopItems: save.ownedShopItems,
    selectedThemeId: save.selectedThemeId,
    selectedSealId: save.selectedSealId,
  }));
  const resourcesRef = useRef(resources);
  const updateResources = useCallback((updater: (current: ResourceSaveSlice) => ResourceSaveSlice) => {
    const current = resourcesRef.current;
    const next = updater(current);
    if (next !== current) {
      resourcesRef.current = next;
      setResources(next);
    }
    return next;
  }, []);
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

  // This is the sole PlayerSave writer for progression, preferences and resources.
  useEffect(() => {
    persistPlayerSave({
      ...loadPlayerSave(), ...resources, version: CURRENT_SAVE_VERSION, currentLevelId, completedLevels, awardedLevels, rewardedWordKeys,
      collectedWords: collectedWords.map((w) => w.word), favoriteWords,
      soundEnabled, soundVolume, hapticsEnabled, reduceMotion, calmMode, leagueOptIn, leagueConsentAnswered, levelMastery, levelStats,
    });
  }, [completedLevels, awardedLevels, rewardedWordKeys, levelMastery, collectedWords, favoriteWords,
      currentLevelId, soundEnabled, soundVolume, hapticsEnabled, reduceMotion, calmMode, leagueOptIn, leagueConsentAnswered, levelStats, resources]);

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
  // so the bonus coin curve can't be reset by re-entering the level.
  const countRewardedBonus = useCallback(
    (levelId: number) => rewardedWordKeys.filter((key) => key.startsWith(rewardKeyPrefix(levelId, 'bonus'))).length,
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

  const levelStatsRef = useRef(levelStats);
  levelStatsRef.current = levelStats;

  const updateStats = useCallback((levelId: number, time: number, streak: number, score = 0) => {
    const previousBest = levelStatsRef.current[levelId]?.bestScore ?? 0;
    setLevelStats((prev) => {
      const updated = updateLevelStats(prev, levelId, time, streak, true, score);
      saveLevelStats(updated);
      return updated;
    });
    return previousBest;
  }, []);

  const claimDailyRewardImpl = useCallback(() => {
    if (dailyChallenge) {
      const updated = claimDaily(dailyChallenge);
      setDailyChallenge(updated);
    }
  }, [dailyChallenge]);

  const value: PersistenceContextValue = {
    currentLevelId, completedLevels, awardedLevels, rewardedWordKeys, levelMastery,
    collectedWords, favoriteWords, levelStats, dailyChallenge, resources,
    soundEnabled, soundVolume, hapticsEnabled, reduceMotion, calmMode, leagueOptIn, leagueConsentAnswered,
    setCurrentLevelId, isLevelUnlocked, markLevelCompleted, markLevelAwarded,
    markWordRewarded, isWordRewarded, countRewardedBonus,
    mergeMastery, addCollectedWord, toggleFavorite,
    setSoundEnabled, setSoundVolume, setHapticsEnabled, setReduceMotion, setCalmMode, setLeagueOptIn, setLeagueConsentAnswered, updateStats,
    claimDailyReward: claimDailyRewardImpl,
    updateResources,
  };

  return (
    <PersistenceContext.Provider value={value}>
      {children}
    </PersistenceContext.Provider>
  );
}
