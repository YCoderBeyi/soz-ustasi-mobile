// Pure score engine: points and a combo multiplier that never touches coins.
export type ScoreKind = 'main' | 'hidden' | 'bonus';

export interface ScoreState {
  /** Consecutive approved words. */
  combo: number;
  score: number;
}

export const INITIAL_SCORE_STATE: ScoreState = { combo: 0, score: 0 };

/** Combo needed to enter each multiplier tier; index = tier. */
const TIER_FLOORS: readonly number[] = [0, 3, 6, 10];
const TIER_MULTIPLIERS: readonly number[] = [1, 1.5, 2, 3];

const KIND_BONUS: Record<ScoreKind, number> = { main: 0, hidden: 5, bonus: 3 };
const POINTS_PER_LETTER = 10;

export function multiplierTier(combo: number): number {
  let tier = 0;
  for (let i = 1; i < TIER_FLOORS.length; i += 1) if (combo >= TIER_FLOORS[i]) tier = i;
  return tier;
}

/** Progress toward the next multiplier tier, 0..1; 1 at the top tier. */
export function comboProgress(combo: number): number {
  const tier = multiplierTier(combo);
  if (tier >= TIER_FLOORS.length - 1) return 1;
  const floor = TIER_FLOORS[tier];
  return (combo - floor) / (TIER_FLOORS[tier + 1] - floor);
}

export function multiplierFor(combo: number, calm = false): number {
  return calm ? 1 : TIER_MULTIPLIERS[multiplierTier(combo)];
}

export function wordPoints(word: string, kind: ScoreKind, combo: number, calm = false): number {
  const base = [...word].length * POINTS_PER_LETTER + KIND_BONUS[kind];
  return Math.round(base * multiplierFor(combo, calm));
}

/** An approved word: multiplier is read before the combo grows, so the first word of a tier is not yet boosted. */
export function applyApprovedWord(state: ScoreState, word: string, kind: ScoreKind, calm = false): ScoreState {
  return {
    combo: state.combo + 1,
    score: state.score + wordPoints(word, kind, state.combo, calm),
  };
}

/** A wrong word drops exactly one tier (to the previous tier floor); score is never reduced. */
export function applyWrongWord(state: ScoreState): ScoreState {
  const tier = multiplierTier(state.combo);
  return { ...state, combo: tier === 0 ? 0 : TIER_FLOORS[tier - 1] };
}
