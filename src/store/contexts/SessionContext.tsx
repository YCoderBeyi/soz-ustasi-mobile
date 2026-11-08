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
import { useStallAssist } from '../../hooks/useStallAssist';
import { findCatalogWord, findWordEntry, rewardKey } from '../../game/lexicon';
import { getThemeIdForShopItem } from '../../data/shop';
import { getBonusWordReward } from '../../game/wordRewards';
import {
  applyApprovedWord, applyWrongWord, comboProgress, INITIAL_SCORE_STATE, multiplierFor, multiplierTier,
  type ScoreKind, type ScoreState,
} from '../../game/score';
import { buildCrosswordLayout, type CrosswordLayout } from '../../game/crossword';
import { showRewardedAd } from '../../services/admob';

type Modal = 'level' | 'hint' | 'pause' | 'privacy' | 'reward' | 'secondChance' | null;

type SecondChanceStatus = 'available' | 'used' | 'skipped';

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
  score: number;
  multiplier: number;
  comboTier: number;
  comboProgress: number;
  wrongAttempts: number;
  usedHint: boolean;
  /** One free letter is on offer because the player seems stuck. */
  stallAssistOffer: boolean;
  sealOpen: boolean;
  canSeal: boolean;
  elapsedTime: number;
  complete: boolean;
  currentWord: string;
  levelTransitionKey: number;
  modal: Modal;
  toast: string;
  theme: ThemeData;
  scoreSummary: { score: number; previousBest: number; isRecord: boolean };
  rewardSummary: { base: number; hidden: number; flawless?: boolean; region?: number; doubled?: boolean };
  earnedObjectives: ObjectiveKey[];
  missingHiddenCount: number;
  missingHiddenWordLengths: number[];
  secondChance: SecondChanceStatus;
};

type SessionActions = {
  startLevel: (level?: LevelData) => void;
  goToNextLevel: () => void;
  submitWord: (word: string) => void;
  clearSelection: () => void;
  shuffleLetters: () => void;
  revealMeaningHint: () => void;
  revealLetterHint: () => void;
  acceptStallAssist: () => void;
  dismissStallAssist: () => void;
  revealMeaningHintViaAd: () => Promise<void>;
  revealLetterHintViaAd: () => Promise<void>;
  acceptSecondChance: () => Promise<void>;
  declineSecondChance: () => void;
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

// Bulmacada görünür harf indekslerini hesaplar: kelime bulunduysa veya çapraz
// kelime/önceden açılmış harf hücreyi görünür kılıyorsa indeks dönülür.
function getVisibleIndexes(
  word: string,
  layout: CrosswordLayout | null,
  revealedState: Record<string, number[]>,
  foundWords: string[],
): number[] {
  const placement = layout?.placements.find((item) => item.word === word);
  if (!layout || !placement) return revealedState[word] ?? [];

  return [...word].flatMap((_, index) => {
    const row = placement.direction === 'across' ? placement.row : placement.row + index;
    const col = placement.direction === 'across' ? placement.col + index : placement.col;
    const cell = layout.cells.find((item) => item.row === row && item.col === col);
    const visible = cell?.words.some((cellWord) => {
      if (foundWords.includes(cellWord)) return true;
      const cellPlacement = layout.placements.find((item) => item.word === cellWord);
      if (!cellPlacement) return false;
      const cellIndex = cellPlacement.direction === 'across'
        ? col - cellPlacement.col
        : row - cellPlacement.row;
      return (revealedState[cellWord] ?? []).includes(cellIndex);
    });
    return visible ? [index] : [];
  });
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within SessionProvider');
  return ctx;
}

// The meaning card must never compete with the puzzle for attention: short, at the bottom.
const MEANING_VISIBLE_MS = 3500;

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
  secondChanceEnabled = true,
  calmMode = false,
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
  updateStats: (levelId: number, time: number, streak: number, score?: number) => number;
  dailyChallenge: DailyChallenge | null;
  claimDailyReward: () => void;
  selectedThemeId: string | null;
  secondChanceEnabled?: boolean;
  calmMode?: boolean;
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
  const [scoreState, setScoreState] = useState<ScoreState>(INITIAL_SCORE_STATE);
  // The ref is the source of truth so two updates in one render never overwrite each other.
  const scoreRef = useRef<ScoreState>(INITIAL_SCORE_STATE);
  const commitScore = useCallback((next: ScoreState) => {
    scoreRef.current = next;
    setScoreState(next);
  }, []);
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
  const [scoreSummary, setScoreSummary] = useState({ score: 0, previousBest: 0, isRecord: false });
  const [rewardSummary, setRewardSummary] = useState<{ base: number; hidden: number; flawless?: boolean; region?: number; doubled?: boolean }>({ base: 0, hidden: 0 });
  const [earnedObjectives, setEarnedObjectives] = useState<ObjectiveKey[]>([]);
  const [secondChance, setSecondChance] = useState<SecondChanceStatus>('available');

  const cleanup = useRef(createCleanupRegistry()).current;
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const elapsedRef = useRef(0);

  useEffect(() => cleanup.flushAll, []);

  const currentWord = selected.map((i) => letters[i]).join('');
  const complete = found.length === (level?.mainWords?.length ?? 0);
  const stall = useStallAssist({
    playing: screen === 'game' && modal === null && !sealOpen,
    finished: complete || sealOpen || canSeal,
    progress: found.length + hiddenFound.length + bonusFound.length,
    levelKey: `${level.levelId}:${levelTransitionKey}`,
  });
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

  // Yanlış kelimenin istatistiksel cezası (seri sıfırlama + kusursuz kaybı).
  // İkinci şans mekaniği bu cezayı erteleyerek reklamla affettirir.
  const applyWrongPenalty = useCallback(() => {
    setStreak(0);
    commitScore(applyWrongWord(scoreRef.current));
    setPerfectRun(false);
    setWrongAttempts((n) => n + 1);
  }, [commitScore]);

  // Reads the combo before the word is counted so a tier-up can play its rising cue exactly once.
  const awardScore = (word: string, kind: ScoreKind) => {
    const prev = scoreRef.current;
    const next = applyApprovedWord(prev, word, kind, calmMode);
    commitScore(next);
    const tier = multiplierTier(next.combo);
    if (!calmMode && tier > multiplierTier(prev.combo)) play(`combo${tier as 1 | 2 | 3}`);
  };

  const submitWord = useCallback((word: string) => {
    if (!word || !level) return;
    const normalized = normalizeWord(word);
    const main = findWordEntry(level.mainWords, normalized);
    const hidden = findWordEntry(level.hiddenWords, normalized);
    const dictionaryEntry = findCatalogWord(normalized);

    if (main && !found.includes(main.word)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((v) => Math.max(v, nextStreak));
      setWrongAttempts(0);
      awardScore(main.word, 'main');
      setFound((items) => [...items, main.word]);
      addCollectedWord(main);
      setMeaning(main);
      setFeedback('correct');
      play('correct');
      haptic(50);
      clearSelection();
      startTimer();
      cleanup.safeTimeout(() => setMeaning(null), MEANING_VISIBLE_MS);
      cleanup.safeTimeout(() => setFeedback(null), 600);
      return;
    }

    if (hidden && !hiddenFound.some((entry) => normalizeWord(entry.word) === normalized)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((v) => Math.max(v, nextStreak));
      setWrongAttempts(0);
      awardScore(hidden.word, 'hidden');
      setHiddenFound((items) => [...items, hidden]);
      addCollectedWord(hidden);
      const hiddenMultiplier = theme.modifier?.type === 'cappadocia' ? 2 : 1;
      const hiddenReward = (hidden.reward ?? level.reward.hiddenWordBonus) * hiddenMultiplier;
      const hiddenKey = rewardKey(level.levelId, 'hidden', normalized);
      const shouldReward = !isWordRewarded(hiddenKey);
      if (shouldReward) {
        addCoins(hiddenReward);
        markWordRewarded(hiddenKey);
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
      cleanup.safeTimeout(() => setMeaning(null), MEANING_VISIBLE_MS);
      cleanup.safeTimeout(() => setFeedback(null), 600);
      cleanup.safeTimeout(() => setToast(''), 2200);
      return;
    }

    // Already discovered in this run: neutral, no reward, no streak change, no penalty.
    const alreadyFound = Boolean(main && found.includes(main.word))
      || Boolean(hidden && hiddenFound.some((entry) => normalizeWord(entry.word) === normalized))
      || bonusFound.includes(normalized);
    if (alreadyFound) {
      setFeedback('unknown');
      setToast(`${normalized} · zaten bulundu`);
      play('tap');
      clearSelection();
      cleanup.safeTimeout(() => setFeedback(null), 700);
      cleanup.safeTimeout(() => setToast(''), 2200);
      return;
    }

    // The wheel only submits buildable words today, but the bonus tier must not depend on the UI.
    if (dictionaryEntry && canBuildFromLetters(normalized, level.letters)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((v) => Math.max(v, nextStreak));
      setWrongAttempts(0);
      awardScore(normalized, 'bonus');
      setBonusFound((items) => [...items, normalized]);
      if (dictionaryEntry.meaning) addCollectedWord(dictionaryEntry);
      const bonusReward = getBonusWordReward(dictionaryEntry.word, countRewardedBonus(level.levelId));
      const bonusKey = rewardKey(level.levelId, 'bonus', normalized);
      const alreadyRewarded = isWordRewarded(bonusKey);
      const shouldReward = bonusReward > 0 && !alreadyRewarded;
      if (shouldReward) {
        addCoins(bonusReward);
        markWordRewarded(bonusKey);
      }
      if (dictionaryEntry.meaning) setMeaning(dictionaryEntry);
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
      cleanup.safeTimeout(() => setMeaning(null), MEANING_VISIBLE_MS);
      cleanup.safeTimeout(() => setFeedback(null), 600);
      cleanup.safeTimeout(() => setToast(''), 2200);
      return;
    }

    // Buildable but not in any reviewed list: neutral. No reward, no streak, no penalty,
    // so a real Turkish word outside the curated set is never punished and gibberish never pays.
    if (normalized.length >= 2 && canBuildFromLetters(normalized, level.letters)) {
      setFeedback('unknown');
      setToast(`${normalized} · listemizde yok, seri korundu`);
      play('tap');
      clearSelection();
      cleanup.safeTimeout(() => setFeedback(null), 700);
      cleanup.safeTimeout(() => setToast(''), 2200);
      return;
    }

    if (secondChanceEnabled && secondChance === 'available' && perfectRun && !usedHint) {
      setModal('secondChance');
    } else {
      applyWrongPenalty();
    }
    setFeedback('wrong');
    play('wrong');
    haptic(100);
    clearSelection();
    cleanup.safeTimeout(() => setFeedback(null), 600);
  }, [
    level, found, hiddenFound, bonusFound, streak, wrongAttempts, calmMode, cleanup, play, haptic, theme,
    clearSelection, addCollectedWord, addCoins, isWordRewarded, markWordRewarded, countRewardedBonus,
    secondChanceEnabled, secondChance, perfectRun, usedHint, applyWrongPenalty,
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
    commitScore(INITIAL_SCORE_STATE);
    setWrongAttempts(0);
    setUsedHint(false);
    setPerfectRun(true);
    setSecondChance('available');
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

  // İkinci Şans: yanlış cevaptan sonra reklam izleyerek bu turun cezasını siler.
  const acceptSecondChance = useCallback(async () => {
    const rewarded = await showRewardedAd();
    if (!rewarded) {
      setToast('Reklam izlenemedi, tekrar dene');
      cleanup.safeTimeout(() => setToast(''), 2000);
      return;
    }
    setSecondChance('used');
    setModal(null);
    setToast('İkinci şans kullanıldı, kusursuz bonus korundu');
    cleanup.safeTimeout(() => setToast(''), 2400);
  }, [cleanup]);

  const declineSecondChance = useCallback(() => {
    setSecondChance('skipped');
    applyWrongPenalty();
    setModal(null);
  }, [applyWrongPenalty]);

  const applyMeaningHint = useCallback((target: WordEntry) => {
    setUsedHint(true);
    setMeaning({ word: 'ANLAM İPUCU', meaning: target.meaning });
    setFeedback('hint');
    play('hint');
    setModal(null);
    cleanup.safeTimeout(() => setMeaning(null), 6000);
    cleanup.safeTimeout(() => setFeedback(null), 700);
  }, [cleanup, play]);

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
    applyMeaningHint(target);
  }, [level, found, spendHint, applyMeaningHint]);

  const revealMeaningHintViaAd = useCallback(async () => {
    const target = level.mainWords.find((entry) => !found.includes(entry.word));
    if (!target) {
      setToast('Bu seviyedeki tüm ana kelimeleri buldun');
      setModal(null);
      return;
    }
    const rewarded = await showRewardedAd();
    if (!rewarded) {
      setToast('Reklam izlenemedi, tekrar dene');
      return;
    }
    applyMeaningHint(target);
  }, [level, found, showRewardedAd, applyMeaningHint]);

  const findLetterHintTarget = useCallback((): WordEntry | null => {
    const layout = buildCrosswordLayout(level.mainWords);
    return level.mainWords.find((entry) => {
      const visible = getVisibleIndexes(entry.word, layout, revealedLetters, found);
      return !found.includes(entry.word) && visible.length < entry.word.length;
    }) ?? null;
  }, [level, revealedLetters, found]);

  const applyLetterHint = useCallback((target: WordEntry, countAsHint = true) => {
    const layout = buildCrosswordLayout(level.mainWords);
    const visible = getVisibleIndexes(target.word, layout, revealedLetters, found);
    const nextIndex = [...target.word].findIndex((_, index) => !visible.includes(index));
    if (nextIndex === -1) {
      setToast('Açılacak harf kalmadı');
      setModal(null);
      return;
    }
    const nextRevealedLetters = {
      ...revealedLetters,
      [target.word]: [...(revealedLetters[target.word] ?? []), nextIndex],
    };
    setRevealedLetters((items) => ({
      ...items,
      [target.word]: [...(items[target.word] ?? []), nextIndex],
    }));
    const completedByHint = level.mainWords.filter((entry) =>
      !found.includes(entry.word)
      && getVisibleIndexes(entry.word, layout, nextRevealedLetters, found).length === entry.word.length,
    );
    if (completedByHint.length > 0) {
      setFound((items) => [
        ...items,
        ...completedByHint.map((entry) => entry.word).filter((word) => !items.includes(word)),
      ]);
      completedByHint.forEach(addCollectedWord);
    }
    // A free assist is a gift: it must not cost the player their no-hint star or the flawless bonus.
    if (countAsHint) setUsedHint(true);
    setToast(
      completedByHint.length > 0
        ? `${target.word.length} harfli kelime ipucuyla tamamlandı`
        : `${target.word.length} harfli bir kelimeden harf açıldı`,
    );
    setFeedback('hint');
    play('hint');
    setModal(null);
    cleanup.safeTimeout(() => setFeedback(null), 700);
    cleanup.safeTimeout(() => setToast(''), 1800);
  }, [level, found, revealedLetters, cleanup, play, addCollectedWord]);

  const revealLetterHint = useCallback(() => {
    const target = findLetterHintTarget();
    if (!target) {
      setToast('Açılacak harf kalmadı');
      setModal(null);
      return;
    }
    if (!spendHint()) {
      setToast('İpucu için 20 altın gerekiyor');
      return;
    }
    applyLetterHint(target);
  }, [findLetterHintTarget, spendHint, applyLetterHint]);

  const consumeStallAssist = stall.consume;
  const acceptStallAssist = useCallback(() => {
    consumeStallAssist();
    const target = findLetterHintTarget();
    if (!target) return;
    applyLetterHint(target, false);
  }, [consumeStallAssist, findLetterHintTarget, applyLetterHint]);

  const dismissStallAssist = consumeStallAssist;

  const revealLetterHintViaAd = useCallback(async () => {
    const target = findLetterHintTarget();
    if (!target) {
      setToast('Açılacak harf kalmadı');
      setModal(null);
      return;
    }
    const rewarded = await showRewardedAd();
    if (!rewarded) {
      setToast('Reklam izlenemedi, tekrar dene');
      return;
    }
    applyLetterHint(target);
  }, [findLetterHintTarget, showRewardedAd, applyLetterHint]);

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

    const runObjectives = getRunObjectives(level, hiddenFound.length, usedHint, maxStreak, perfectRun);
    setEarnedObjectives(runObjectives);
    mergeMastery(level.levelId, runObjectives);
    const previousBest = updateStats(level.levelId, elapsedTime, maxStreak, scoreRef.current.score) ?? 0;
    setScoreSummary({
      score: scoreRef.current.score,
      previousBest,
      // A first-ever score is not a "record": there is nothing yet to beat.
      isRecord: previousBest > 0 && scoreRef.current.score > previousBest,
    });

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
    stallAssistOffer: stall.offered,
    score: scoreState.score, multiplier: multiplierFor(scoreState.combo, calmMode), comboTier: calmMode ? 0 : multiplierTier(scoreState.combo), comboProgress: calmMode ? 0 : comboProgress(scoreState.combo),
    sealOpen, canSeal, elapsedTime, complete, currentWord,
    levelTransitionKey, modal, toast, theme, rewardSummary, scoreSummary, earnedObjectives,
    missingHiddenCount, missingHiddenWordLengths, secondChance,
    startLevel, goToNextLevel, submitWord, clearSelection, shuffleLetters,
    revealMeaningHint, revealLetterHint, acceptStallAssist, dismissStallAssist,
    revealMeaningHintViaAd, revealLetterHintViaAd,
    acceptSecondChance, declineSecondChance,
    setModal, setToast, setScreen, setLevel, setRewardSummary, setEarnedObjectives,
    submitCurrentWord, manualOpenSeal,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}
