export type PuzzleType = 'crossword' | 'anagram' | 'wordsearch';

export type ThemeModifier = {
  type: string;
  label: string;
  description: string;
  icon: string;
};

export type DifficultyLevel = 1 | 2 | 3 | 4 | 5;

export type WordEntry = {
  word: string;
  meaning: string;
  difficulty?: DifficultyLevel;
  reward?: number;
};

export type LevelData = {
  levelId: number;
  themeId: string;
  sealId: string;
  story?: string;
  letters: string[];
  mainWords: WordEntry[];
  hiddenWords: WordEntry[];
  reward: {
    baseCoin: number;
    hiddenWordBonus: number;
  };
  puzzleType?: PuzzleType;
};

export type LevelStory = {
  levelId: number;
  title: string;
  body: string;
  era: string;
  place: string;
  person?: string;
  personInfo?: string;
};

export type LevelMastery = { stars: number; objectives: string[] };

export type ThemeData = {
  themeId: string;
  title: string;
  backgroundImage: string;
  primaryColor: string;
  secondaryColor: string;
  unlockAtLevel: number;
  modifier?: ThemeModifier;
};

export type ShopItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: string;
  category: 'theme' | 'seal' | 'hint_pack' | 'power_up';
  owned: boolean;
};

export type LevelStats = {
  bestTime: number;
  bestStreak: number;
  attempts: number;
  completions: number;
};

export type DailyChallenge = {
  date: string;
  levelId: number;
  completed: boolean;
  reward: number;
};

export type ScreenName = 'splash' | 'onboarding' | 'map' | 'game' | 'dictionary' | 'shop' | 'profile' | 'settings';
