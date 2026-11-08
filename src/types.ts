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
  chapterId?: string; // Plan §4: ana yolculuk 12 bölümü. Boşsa levelId'den türetilir.
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

export type ContentReviewStatus = 'draft' | 'reviewed' | 'approved';

export type LevelStory = {
  levelId: number;
  title: string;
  body: string;
  era: string;
  place: string;
  person?: string;
  personInfo?: string;
  // Plan §5/§9 keşif kartı sözleşmesi. İçerik editoryal onaydan sonra doldurulur.
  impact?: string; // "Neden önemli?"
  today?: string; // "Bugün nerede?"
  sourceNotes?: string[];
  contentReviewStatus?: ContentReviewStatus;
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
  /** Best run score; absent on saves from before the score engine. */
  bestScore?: number;
};

export type DailyChallenge = {
  date: string;
  levelId: number;
  completed: boolean;
  reward: number;
};

export type ScreenName = 'splash' | 'onboarding' | 'map' | 'game' | 'dictionary' | 'shop' | 'profile' | 'settings' | 'level-start';
