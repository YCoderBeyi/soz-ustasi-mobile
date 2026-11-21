import type { LevelMastery } from '../../types';

/** Opt-in rivalry only; calm mode never feeds competitive boards. */
export function shouldSubmitToLeague(leagueOptIn: boolean, calmMode: boolean): boolean {
  return leagueOptIn && !calmMode;
}

export function totalMasteryStars(levelMastery: Record<number, LevelMastery | undefined>): number {
  return Object.values(levelMastery).reduce((sum, entry) => sum + (entry?.stars ?? 0), 0);
}
