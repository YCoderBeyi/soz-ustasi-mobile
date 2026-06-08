import type { LevelData } from '../types';

export type ObjectiveKey = 'complete' | 'discovery' | 'noHint';

export const OBJECTIVE_KEYS: ObjectiveKey[] = ['complete', 'discovery', 'noHint'];

export function getObjectiveLabels(level: LevelData) {
  return {
    complete: 'Mührü aç',
    discovery: level.hiddenWords.length > 0 ? 'Tüm gizli kelimeleri bul' : 'Hata yapmadan tamamla',
    noHint: 'İpucu kullanmadan bitir',
  } satisfies Record<ObjectiveKey, string>;
}

export function getRunObjectives(
  level: LevelData,
  hiddenCount: number,
  usedHint: boolean,
  maxStreak: number,
): ObjectiveKey[] {
  const objectives: ObjectiveKey[] = ['complete'];
  const discoveryComplete = level.hiddenWords.length > 0
    ? hiddenCount === level.hiddenWords.length
    : maxStreak >= level.mainWords.length;
  if (discoveryComplete) objectives.push('discovery');
  if (!usedHint) objectives.push('noHint');
  return objectives;
}
