import type { LevelData, LevelMastery } from '../types';

export type ObjectiveKey = 'complete' | 'discovery' | 'noHint';

export const OBJECTIVE_KEYS: ObjectiveKey[] = ['complete', 'discovery', 'noHint'];

export function toRunMastery(objectives: ObjectiveKey[]): LevelMastery {
  const complete = objectives.includes('complete');
  const discovery = complete && objectives.includes('discovery');
  const noHint = discovery && objectives.includes('noHint');
  const normalized: ObjectiveKey[] = complete ? ['complete'] : [];
  if (discovery) normalized.push('discovery');
  if (noHint) normalized.push('noHint');
  return { stars: normalized.length, objectives: normalized };
}

export function chooseBestMastery(
  existing: LevelMastery | undefined,
  objectives: ObjectiveKey[],
): LevelMastery {
  const current = toRunMastery(objectives);
  return !existing || current.stars > existing.stars ? current : existing;
}

export function getObjectiveLabels(level: LevelData) {
  return {
    complete: 'Mührü aç',
    discovery: level.hiddenWords.length > 0 ? 'Tüm gizli kelimeleri bul' : 'Hata yapmadan tamamla',
    noHint: 'Tüm gizlileri ipucusuz bul',
  } satisfies Record<ObjectiveKey, string>;
}

export function getRunObjectives(
  level: LevelData,
  hiddenCount: number,
  usedHint: boolean,
  maxStreak: number,
  perfectRun = true,
): ObjectiveKey[] {
  void maxStreak;
  const objectives: ObjectiveKey[] = ['complete'];
  // Levels without hidden words label this star "Hata yapmadan tamamla", so it must really require a clean run.
  const discoveryComplete = level.hiddenWords.length === 0
    ? perfectRun
    : hiddenCount === level.hiddenWords.length;
  if (discoveryComplete) objectives.push('discovery');
  if (discoveryComplete && !usedHint) objectives.push('noHint');
  return objectives;
}
