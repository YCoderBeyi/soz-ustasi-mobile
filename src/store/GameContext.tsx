import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react';
import type { LevelData, LevelMastery, WordEntry, DailyChallenge, LevelStats } from '../types';
import { levels, initialLevel } from '../data/levels';
import { getTheme } from '../data/themes';
import { shopItems } from '../data/shop';
import { playSfx, type SfxName } from '../audio';
import { normalizeWord } from '../game/normalize';
import { shuffle } from '../game/shuffle';
import { type ObjectiveKey, getRunObjectives } from '../game/objectives';
import { loadPlayerSave, resolveCollectedWords, persistPlayerSave, type PlayerSave, type Feedback } from '../game/playerSave';
import { getDailyChallenge, claimDailyReward as claimDaily } from '../game/dailyChallenge';
import { loadLevelStats, saveLevelStats, updateLevelStats } from '../game/levelStats';
import type { ThemeData } from '../types';

const HINT_COST_BASE = 20;

type Screen = 'splash' | 'onboarding' | 'map' | 'game' | 'dictionary' | 'shop' | 'profile' | 'settings';
type Modal = 'level' | 'hint' | 'pause' | 'privacy' | 'reward' | null;

type GameState = {
  screen: Screen;
  level: LevelData;
  letters: string[];
  selected: number[];
  found: string[];
  hiddenFound: WordEntry[];
  collectedWords: WordEntry[];
  favoriteWords: string[];
  revealedLetters: Record<string, number[]>;
  meaning: WordEntry | null;
  toast: string;
  coins: number;
  completedLevels: number[];
  awardedLevels: number[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  levelMastery: Record<number, LevelMastery>;
  modal: Modal;
  sealOpen: boolean;
  feedback: Feedback;
  coinPulse: boolean;
  rewardSummary: { base: number; hidden: number };
  streak: number;
  maxStreak: number;
  usedHint: boolean;
  earnedObjectives: ObjectiveKey[];
  theme: ThemeData;
  currentWord: string;
  complete: boolean;
  ownedShopItems: string[];
  hintsRemaining: number;
  coinMultiplier: number;
  dailyChallenge: DailyChallenge | null;
  levelStats: Record<number, LevelStats>;
  elapsedTime: number;
  puzzleType: string;
  currentPuzzleType: string;
  levelTransitionKey: number;
};

type GameActions = {
  play: (name: SfxName) => void;
  haptic: (pattern: number | number[]) => void;
  setScreen: (screen: Screen) => void;
  setLevel: (level: LevelData) => void;
  setModal: (modal: Modal) => void;
  setSoundEnabled: (value: boolean) => void;
  setHapticsEnabled: (value: boolean) => void;
  setToast: (message: string) => void;
  startLevel: (nextLevel?: LevelData) => void;
  goToNextLevel: () => void;
  submitWord: (word: string) => void;
  handlePointerDown: (index: number) => void;
  handlePointerMove: (clientX: number, clientY: number) => void;
  handlePointerUp: (clientX?: number, clientY?: number) => void;
  handlePointerCancel: () => void;
  findLetterAtPoint: (clientX: number, clientY: number) => number | null;
  clearSelection: () => void;
  shuffleLetters: () => void;
  revealMeaningHint: () => void;
  revealLetterHint: () => void;
  isLevelUnlocked: (candidate: LevelData) => boolean;
  pulseCoins: () => void;
  buyShopItem: (itemId: string) => void;
  isItemOwned: (itemId: string) => boolean;
  claimDailyReward: () => void;
  submitCurrentWord: () => void;
  toggleFavorite: (word: string) => void;
};

const GameContext = createContext<(GameState & GameActions) | null>(null);

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [initialSave] = useState(loadPlayerSave);
  const savedLevel = levels.find((entry) => entry.levelId === initialSave.currentLevelId) ?? initialLevel;

  const [screen, setScreen] = useState<Screen>('splash');

  const [level, setLevel] = useState<LevelData>(savedLevel);
  const [letters, setLetters] = useState(() => shuffle(savedLevel.letters));
  const [selected, setSelected] = useState<number[]>([]);
  const [found, setFound] = useState<string[]>([]);
  const [hiddenFound, setHiddenFound] = useState<WordEntry[]>([]);
  const [collectedWords, setCollectedWords] = useState<WordEntry[]>(() => resolveCollectedWords(initialSave.collectedWords));
  const [favoriteWords, setFavoriteWords] = useState<string[]>(initialSave.favoriteWords);
  const [revealedLetters, setRevealedLetters] = useState<Record<string, number[]>>({});
  const [meaning, setMeaning] = useState<WordEntry | null>(null);
  const [toast, setToast] = useState('');

  const [coins, setCoins] = useState(initialSave.coins);
  const [completedLevels, setCompletedLevels] = useState<number[]>(initialSave.completedLevels);
  const [awardedLevels, setAwardedLevels] = useState<number[]>(initialSave.awardedLevels);
  const [soundEnabled, setSoundEnabled] = useState(initialSave.soundEnabled);
  const [hapticsEnabled, setHapticsEnabled] = useState(initialSave.hapticsEnabled);
  const [levelMastery, setLevelMastery] = useState<Record<number, LevelMastery>>(initialSave.levelMastery);
  const [ownedShopItems, setOwnedShopItems] = useState<string[]>(initialSave.ownedShopItems);
  const [hintsRemaining, setHintsRemaining] = useState(initialSave.hintsRemaining);
  const [coinMultiplier, setCoinMultiplier] = useState(initialSave.coinMultiplier);

  const [modal, setModal] = useState<Modal>(null);
  const [sealOpen, setSealOpen] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [coinPulse, setCoinPulse] = useState(false);
  const [rewardSummary, setRewardSummary] = useState({ base: 0, hidden: 0 });
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [earnedObjectives, setEarnedObjectives] = useState<ObjectiveKey[]>([]);

  const rewardTimerRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const timerIntervalRef = useRef<number | null>(null);
  const timerActiveRef = useRef(false);
  const draggingRef = useRef(false);
  const dragSelectionRef = useRef<number[]>([]);

  const [levelTransitionKey, setLevelTransitionKey] = useState(0);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [dailyChallenge, setDailyChallenge] = useState<DailyChallenge | null>(() => getDailyChallenge());
  const [levelStats, setLevelStats] = useState<Record<number, LevelStats>>(() => loadLevelStats());

  const theme = getTheme(level.themeId);
  const currentWord = selected.map((index) => letters[index]).join('');
  const complete = found.length === level.mainWords.length;
  const currentPuzzleType = level.puzzleType ?? 'crossword';
  const puzzleType = currentPuzzleType;

  // Timer management
  function startTimer() {
    if (timerIntervalRef.current) return;
    elapsedRef.current = 0;
    timerActiveRef.current = true;
    timerIntervalRef.current = window.setInterval(() => {
      elapsedRef.current++;
      setElapsedTime(elapsedRef.current);
    }, 1000);
  }

  function stopTimer() {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    timerActiveRef.current = false;
  }

  function resetTimer() {
    stopTimer();
    elapsedRef.current = 0;
    setElapsedTime(0);
  }

  // Start timer on game screen
  useEffect(() => {
    if (screen === 'game') {
      startTimer();
    } else {
      stopTimer();
    }
    return stopTimer;
  }, [screen]);

  // Seal open on completion
  useEffect(() => {
    if (screen === 'game' && complete && !sealOpen) {
      stopTimer();
      const alreadyAwarded = awardedLevels.includes(level.levelId);
      setCompletedLevels((items) => (items.includes(level.levelId) ? items : [...items, level.levelId]));

      // Track level stats
      setLevelStats((prev) => {
        const updated = updateLevelStats(prev, level.levelId, elapsedRef.current, maxStreak, true);
        saveLevelStats(updated);
        return updated;
      });

      if (!alreadyAwarded) {
        const modifier = theme.modifier;
        const hiddenMultiplier = modifier?.type === 'cappadocia' ? 2 : 1;
        const hiddenBonus = hiddenFound.length * level.reward.hiddenWordBonus * hiddenMultiplier;
        const coinMult = modifier?.type === 'anatolian_autumn' ? 1.5 : 1;
        const baseReward = Math.round(level.reward.baseCoin * coinMult);
        const finalReward = baseReward * coinMultiplier;
        setRewardSummary({ base: finalReward, hidden: hiddenBonus });
        setCoins((value) => value + finalReward + hiddenBonus);
        setAwardedLevels((items) => [...items, level.levelId]);
        pulseCoins();
      }

      // Auto-claim daily challenge when its level is completed
      if (dailyChallenge && !dailyChallenge.completed && dailyChallenge.levelId === level.levelId) {
        const reward = dailyChallenge.reward;
        setCoins((value) => value + reward);
        const updated = claimDaily(dailyChallenge);
        setDailyChallenge(updated);
        setToast(`Günlük ödül: +${reward} 💎`);
        setTimeout(() => setToast(''), 2000);
      } else {
        setRewardSummary({ base: 0, hidden: 0 });
      }
      const runObjectives = getRunObjectives(level, hiddenFound.length, usedHint, maxStreak);
      setEarnedObjectives(runObjectives);
      setLevelMastery((items) => {
        const previous = items[level.levelId]?.objectives ?? [];
        const objectives = [...new Set([...previous, ...runObjectives])];
        return { ...items, [level.levelId]: { stars: objectives.length, objectives } };
      });
      triggerFeedback('seal', 'seal');
      setSealOpen(true);
      rewardTimerRef.current = window.setTimeout(() => setModal('reward'), 1200);
    }
  }, [complete, sealOpen, screen, level.levelId, hiddenFound, usedHint, maxStreak, awardedLevels, theme, coinMultiplier]);

  useEffect(() => () => {
    if (rewardTimerRef.current) window.clearTimeout(rewardTimerRef.current);
  }, []);

  // Persist save
  useEffect(() => {
    const save: PlayerSave = {
      version: 2,
      currentLevelId: level.levelId,
      coins,
      completedLevels,
      awardedLevels,
      collectedWords: collectedWords.map((word) => word.word),
      favoriteWords,
      soundEnabled,
      hapticsEnabled,
      levelMastery,
      ownedShopItems,
      hintsRemaining,
      coinMultiplier,
      levelStats,
    };
    persistPlayerSave(save);
    }, [coins, completedLevels, awardedLevels, collectedWords, favoriteWords, level.levelId, levelMastery, soundEnabled, hapticsEnabled, ownedShopItems, hintsRemaining, coinMultiplier, levelStats]);

  useEffect(() => {
    if (modal === 'reward') play('reward');
  }, [modal]);

  function play(name: SfxName) {
    playSfx(name, soundEnabled);
  }

  function haptic(pattern: number | number[]) {
    if (!hapticsEnabled) return;
    if ('vibrate' in navigator) navigator.vibrate(pattern);
  }

  function pulseCoins() {
    setCoinPulse(false);
    window.requestAnimationFrame(() => setCoinPulse(true));
    window.setTimeout(() => setCoinPulse(false), 520);
  }

  function triggerFeedback(next: Feedback, sfx?: SfxName) {
    if (sfx) play(sfx);
    if (next === 'correct') haptic(18);
    if (next === 'wrong') haptic([12, 24, 12]);
    if (next === 'hidden') haptic([18, 36, 24]);
    if (next === 'seal') haptic([30, 45, 40]);
    setFeedback(null);
    window.requestAnimationFrame(() => setFeedback(next));
    window.setTimeout(() => setFeedback(null), 760);
  }

  function addCollectedWord(entry: WordEntry) {
    setCollectedWords((items) => (
      items.some((item) => normalizeWord(item.word) === normalizeWord(entry.word)) ? items : [...items, entry]
    ));
  }

  function startLevel(nextLevel: LevelData = level) {
    if (rewardTimerRef.current) {
      window.clearTimeout(rewardTimerRef.current);
      rewardTimerRef.current = null;
    }
    resetTimer();

    setLevelTransitionKey(k => k + 1);
    setLevel(nextLevel);
    setLetters(shuffle(nextLevel.letters));
    setSelected([]);
    setFound([]);
    setHiddenFound([]);
    setRevealedLetters({});
    setMeaning(null);
    setToast('');
    setRewardSummary({ base: 0, hidden: 0 });
    setStreak(0);
    setMaxStreak(0);
    setUsedHint(false);
    setEarnedObjectives([]);
    setSealOpen(false);
    setModal(null);
    setScreen('game');
  }

  function clearSelection() {
    setSelected([]);
    dragSelectionRef.current = [];
    draggingRef.current = false;
  }

  function findLetterAtPoint(clientX: number, clientY: number): number | null {
    const letters = Array.from(document.querySelectorAll<HTMLElement>('.wheelLetter'));
    let bestIndex: number | null = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let i = 0; i < letters.length; i++) {
      const node = letters[i];
      const rawIndex: string | undefined = node.dataset.letterIndex;
      if (!rawIndex) continue;
      const index: number = Number(rawIndex);
      if (Number.isNaN(index)) continue;

      const rect = node.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distance = Math.hypot(clientX - centerX, clientY - centerY);
      const radius = Math.max(rect.width, rect.height) * 0.82;

      if (distance <= radius && distance < bestDistance) {
        bestIndex = index;
        bestDistance = distance;
      }
    }

    return bestIndex;
  }

  function handlePointerDown(index: number) {
    draggingRef.current = true;
    dragSelectionRef.current = [index];
    setSelected([index]);
  }

  function handlePointerMove(clientX: number, clientY: number) {
    if (!draggingRef.current) return;
    const index = findLetterAtPoint(clientX, clientY);
    if (index === null) return;
    const previousIndex = dragSelectionRef.current[dragSelectionRef.current.length - 2];
    if (index === previousIndex) {
      dragSelectionRef.current = dragSelectionRef.current.slice(0, -1);
      setSelected(dragSelectionRef.current);
      return;
    }
    if (dragSelectionRef.current.includes(index)) return;
    play('letter');
    haptic(6);
    dragSelectionRef.current = [...dragSelectionRef.current, index];
    setSelected(dragSelectionRef.current);
  }

  function handlePointerUp(clientX?: number, clientY?: number) {
    if (!draggingRef.current) return;
    if (typeof clientX === 'number' && typeof clientY === 'number') {
      handlePointerMove(clientX, clientY);
    }
    draggingRef.current = false;
    const word = dragSelectionRef.current.map((i) => letters[i]).join('');
    if (word.length >= 2) {
      dragSelectionRef.current = [];
      submitWord(word);
    } else {
      clearSelection();
    }
  }

  function handlePointerCancel() {
    if (!draggingRef.current) return;
    clearSelection();
  }

  function submitCurrentWord() {
    const word = dragSelectionRef.current.length > 0
      ? dragSelectionRef.current.map((i) => letters[i]).join('')
      : selected.map((index) => letters[index]).join('');
    if (word) submitWord(word);
    clearSelection();
  }

  function submitWord(word: string) {
    if (!word) return;
    const normalized = normalizeWord(word);
    const isReplay = completedLevels.includes(level.levelId);
    const main = level.mainWords.find((entry) => normalizeWord(entry.word) === normalized);
    const hidden = level.hiddenWords.find((entry) => normalizeWord(entry.word) === normalized);

    if (main && !found.includes(main.word)) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setMaxStreak((value) => Math.max(value, nextStreak));
      setFound((items) => [...items, main.word]);
      addCollectedWord(main);
      setMeaning(main);
      if (!isReplay) {
        const modifier = theme.modifier;
        const streakBonus = modifier?.type === 'seljuk_courtyard' && nextStreak > 2 ? 2 : (nextStreak > 2 ? 1 : 0);
        const wordMultiplier = modifier?.type === 'anatolian_autumn' ? 1.5 : 1;
        const coinGain = Math.round((1 + streakBonus) * wordMultiplier * coinMultiplier);
        setCoins((value) => value + coinGain);
        pulseCoins();
      }
      triggerFeedback('correct', 'correct');
      clearSelection();
      window.setTimeout(() => setMeaning(null), 2200);
      return;
    }

    if (hidden && !hiddenFound.some((entry) => normalizeWord(entry.word) === normalized)) {
      setStreak((value) => {
        const next = value + 1;
        setMaxStreak((best) => Math.max(best, next));
        return next;
      });
      setHiddenFound((items) => [...items, hidden]);
      addCollectedWord(hidden);
      const modifier = theme.modifier;
      const hiddenMultiplier = modifier?.type === 'cappadocia' ? 2 : 1;
      const reward = (hidden.reward ?? 5) * hiddenMultiplier * coinMultiplier;
      setToast(`Gizli Kelime: ${hidden.word} +${reward} 💎`);
      if (!isReplay) {
        setCoins((value) => value + reward);
        pulseCoins();
      }
      triggerFeedback('hidden', 'hidden');
      clearSelection();
      window.setTimeout(() => setToast(''), 2200);
      return;
    }

    const modifier = theme.modifier;
    if (modifier?.type !== 'blacksea_highland') {
      setStreak(0);
    }
    setToast(main || hidden ? 'Zaten buldun' : 'Bu levelde yok');
    triggerFeedback('wrong', 'wrong');
    clearSelection();
    window.setTimeout(() => setToast(''), 1100);
  }

  function shuffleLetters() {
    setLetters(shuffle(letters));
    const modifier = theme.modifier;
    if (modifier?.type === 'ege_coast') {
      const bonus = 2 * coinMultiplier;
      setCoins((value) => value + bonus);
      setToast(`Rüzgar Gücü! +${bonus} 💎`);
      window.setTimeout(() => setToast(''), 1200);
    }
    triggerFeedback('shuffle', 'shuffle');
  }

  function isLevelUnlocked(candidate: LevelData) {
    if (candidate.levelId === 1) return true;
    if (completedLevels.includes(candidate.levelId)) return true;
    return completedLevels.includes(candidate.levelId - 1);
  }

  function goToNextLevel() {
    const currentIndex = levels.findIndex((item) => item.levelId === level.levelId);
    const nextLevel = levels[currentIndex + 1];
    if (!nextLevel) {
      setModal(null);
      setScreen('map');
      setToast('Tüm yayın seviyeleri tamamlandı');
      window.setTimeout(() => setToast(''), 1600);
      return;
    }
    startLevel(nextLevel);
  }

  function getNextUnfoundWord() {
    return level.mainWords.find((entry) => !found.includes(entry.word));
  }

  function getNextWordWithHiddenLetter() {
    return level.mainWords.find((entry) => {
      if (found.includes(entry.word)) return false;
      const revealed = revealedLetters[entry.word] ?? [];
      return revealed.length < entry.word.length;
    });
  }

  function getHintCost(): number {
    const modifier = theme.modifier;
    const discount = modifier?.type === 'ottoman_library' ? 0.7 : 1;
    return Math.round(HINT_COST_BASE * discount);
  }

  function spendHintCost() {
    const cost = getHintCost();
    if (hintsRemaining > 0) {
      setHintsRemaining((value) => value - 1);
      setUsedHint(true);
      return true;
    }
    if (coins < cost) {
      play('wrong');
      setToast(`Elmas yetersiz (${cost} 💎 gerekli)`);
      window.setTimeout(() => setToast(''), 1200);
      return false;
    }
    setCoins((value) => value - cost);
    setUsedHint(true);
    pulseCoins();
    return true;
  }

  function revealMeaningHint() {
    const next = getNextUnfoundWord();
    if (!next) {
      setToast('Açılacak kelime kalmadı');
      window.setTimeout(() => setToast(''), 1200);
      return;
    }
    if (!spendHintCost()) return;
    play('hint');
    setMeaning({ ...next, word: 'İPUCU', meaning: next.meaning });
    setModal(null);
    window.setTimeout(() => setMeaning(null), 2600);
  }

  function revealLetterHint() {
    const next = getNextWordWithHiddenLetter();
    if (!next) {
      setToast('Açılacak harf kalmadı');
      window.setTimeout(() => setToast(''), 1200);
      return;
    }

    const revealed = revealedLetters[next.word] ?? [];
    const nextIndex = next.word.split('').findIndex((_, index) => !revealed.includes(index));
    if (nextIndex === -1) {
      setToast('Bu kelimenin tüm harfleri açık');
      window.setTimeout(() => setToast(''), 1200);
      return;
    }

    if (!spendHintCost()) return;
    play('hint');
    setRevealedLetters((items) => ({
      ...items,
      [next.word]: [...revealed, nextIndex],
    }));
    setToast('Bir harf açıldı');
    setModal(null);
    window.setTimeout(() => setToast(''), 1100);
  }

  function buyShopItem(itemId: string) {
    const item = shopItems.find((i) => i.id === itemId);
    if (!item) {
      setToast('Ürün bulunamadı');
      setTimeout(() => setToast(''), 1500);
      return;
    }
    if (ownedShopItems.includes(itemId)) {
      setToast('Zaten sahipsin');
      setTimeout(() => setToast(''), 1500);
      return;
    }
    if (coins < item.price) {
      setToast(`Yetersiz elmas! ${item.price} 💎 gerekli`);
      play('wrong');
      setTimeout(() => setToast(''), 2000);
      return;
    }
    setCoins((value) => value - item.price);
    setOwnedShopItems((prev) => [...prev, itemId]);

    // Apply immediate effects
    if (itemId.startsWith('hint_')) {
      const count = itemId === 'hint_3' ? 3 : 5;
      setHintsRemaining((prev) => prev + count);
    }
    if (itemId === 'doubler') {
      setCoinMultiplier((prev) => prev * 2);
    }

    setToast(`${item.name} satın alındı!`);
    play('reward');
    setTimeout(() => setToast(''), 2000);
  }

  function isItemOwned(itemId: string): boolean {
    return ownedShopItems.includes(itemId);
  }

  function claimDailyReward() {
    if (!dailyChallenge || dailyChallenge.completed) return;
    const reward = dailyChallenge.reward;
    setCoins((value) => value + reward);
    const updated = claimDaily(dailyChallenge);
    setDailyChallenge(updated);
    setToast(`Günlük ödül: +${reward} 💎`);
    play('reward');
    setTimeout(() => setToast(''), 2000);
  }

  function toggleFavorite(word: string) {
    setFavoriteWords((prev) =>
      prev.includes(word) ? prev.filter((w) => w !== word) : [...prev, word]
    );
  }

  const value: GameState & GameActions = {
    screen, setScreen,
    level, setLevel,
    letters, selected,
    found, hiddenFound, collectedWords, favoriteWords, revealedLetters,
    meaning, toast, setToast,
    coins, completedLevels, awardedLevels,
    soundEnabled, setSoundEnabled,
    hapticsEnabled, setHapticsEnabled,
    levelMastery,
    modal, setModal,
    sealOpen, feedback, coinPulse, rewardSummary,
    streak, maxStreak, usedHint, earnedObjectives,
    theme,
    currentWord,
    complete,
    ownedShopItems, hintsRemaining, coinMultiplier,
    dailyChallenge, levelStats, elapsedTime,
    puzzleType, currentPuzzleType,
    levelTransitionKey,
    play, haptic,
    startLevel, goToNextLevel,
    submitWord, handlePointerDown, handlePointerMove, handlePointerUp, handlePointerCancel, findLetterAtPoint, clearSelection,
    shuffleLetters,
    revealMeaningHint, revealLetterHint,
    isLevelUnlocked,
    pulseCoins,
    buyShopItem, isItemOwned,
    claimDailyReward,
    submitCurrentWord,
    toggleFavorite,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
