import type { LevelData } from '../types';

// Single formula for "how hard does this level feel", used by the curve guard in difficultyCurve.test.ts.
// Weights follow what actually blocks a player: letters to juggle, the longest word the seal requires,
// how many words the seal requires, and (lightly) how many optional words gate the third star.
const LETTER_WEIGHT = 1.0;
const LONGEST_WORD_WEIGHT = 0.8;
const MAIN_WORD_WEIGHT = 0.7;
const HIDDEN_WORD_WEIGHT = 0.3;

export function levelDifficulty(level: Pick<LevelData, 'letters' | 'mainWords' | 'hiddenWords'>): number {
  const longest = Math.max(0, ...level.mainWords.map((entry) => [...entry.word].length));
  return (
    level.letters.length * LETTER_WEIGHT
    + longest * LONGEST_WORD_WEIGHT
    + level.mainWords.length * MAIN_WORD_WEIGHT
    + level.hiddenWords.length * HIDDEN_WORD_WEIGHT
  );
}
