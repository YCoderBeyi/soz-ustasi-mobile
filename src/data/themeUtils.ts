import { themes } from './themes';
import { levels } from './levels';
import type { LevelData, ThemeData } from '../types';

export type ThemeGroup = {
  theme: ThemeData;
  levels: LevelData[];
  totalStars: number;
  earnedStars: number;
  isUnlocked: boolean;
  isCompleted: boolean;
};

export function getThemeGroups(completedLevels: number[], levelMastery: Record<number, { stars: number }>): ThemeGroup[] {
  return themes.map((theme) => {
    const themeLevels = levels
      .filter((item) => item.themeId === theme.themeId)
      .sort((a, b) => a.levelId - b.levelId);

    const totalStars = themeLevels.length * 3;
    const earnedStars = themeLevels.reduce(
      (sum, item) => sum + (levelMastery[item.levelId]?.stars ?? 0),
      0,
    );

    const highestCompleted = Math.max(0, ...completedLevels);
    const isUnlocked = highestCompleted >= theme.unlockAtLevel - 1 || theme.unlockAtLevel === 1;
    const isCompleted = themeLevels.every((item) => completedLevels.includes(item.levelId));

    return { theme, levels: themeLevels, totalStars, earnedStars, isUnlocked, isCompleted };
  });
}

export function getActiveThemeIndex(currentLevelId: number, completedLevels: number[]): number {
  const currentLevel = levels.find((item) => item.levelId === currentLevelId);
  if (!currentLevel) return 0;
  const idx = themes.findIndex((t) => t.themeId === currentLevel.themeId);
  return idx >= 0 ? idx : 0;
}
