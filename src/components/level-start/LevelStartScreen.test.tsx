// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { levels } from '../../data/levels';

const game = vi.hoisted(() => ({
  level: null as unknown,
  levelMastery: {} as Record<number, { stars: number; objectives: string[] }>,
  awardedLevels: [] as number[],
  rewardedWordKeys: [] as string[],
  doublerRemaining: 0,
  selectedSealId: null as string | null,
  reduceMotion: false,
  calmMode: false,
  startLevel: vi.fn(),
  setScreen: vi.fn(),
  play: vi.fn(),
}));

vi.mock('../../store/GameContext', () => ({ useGame: () => game }));
vi.mock('../../data/themes', () => ({
  getTheme: () => ({ themeId: 'test', title: 'Test Rotası', backgroundImage: '/test.webp' }),
}));
vi.mock('../../data/levelStories', () => ({
  getLevelStory: () => ({ levelId: 4, title: 'Test hikâyesi', era: 'Test', place: 'Test' }),
}));
vi.mock('../../game/objectives', () => ({
  OBJECTIVE_KEYS: ['complete', 'discovery', 'noHint'],
  getObjectiveLabels: () => ({ complete: 'Mührü aç', discovery: 'Kusursuz tamamla', noHint: 'Kusursuz ve ipucusuz ustalık' }),
}));

import { LevelStartScreen } from './LevelStartScreen';

afterEach(cleanup);

describe('LevelStartScreen objective and reward truth', () => {
  it('does not advertise a hidden-word count or bonus when the level has no hidden target', () => {
    game.level = levels.find((level) => level.levelId === 4)!;
    game.levelMastery = {};
    game.awardedLevels = [];
    game.rewardedWordKeys = [];
    render(<LevelStartScreen />);

    expect(screen.getByText('Ek Hedef')).toBeTruthy();
    expect(screen.getByText('Kusursuz tur')).toBeTruthy();
    expect(screen.queryByText('+ Gizli Bonus')).toBeNull();
  });

  it('shows the secret count and bonus only when both are configured', () => {
    game.level = {
      ...levels[0],
      hiddenWords: [{ word: 'KELİME', meaning: 'Anlam taşıyan söz.', reward: 10 }],
      reward: { ...levels[0].reward, hiddenWordBonus: 10 },
    };
    game.levelMastery = {};
    game.awardedLevels = [];
    game.rewardedWordKeys = [];
    render(<LevelStartScreen />);

    expect(screen.getByText('Gizli Kelimeler')).toBeTruthy();
    expect(screen.getByText('1 Adet')).toBeTruthy();
    expect(screen.getByText('+ Gizli Bonus')).toBeTruthy();
  });

  it('describes the actual main-target count on the first generated level', () => {
    game.level = {
      ...levels[0],
      levelId: 76,
      mainWords: levels[0].mainWords.slice(0, 2),
      hiddenWords: [],
    };
    game.levelMastery = {};
    game.awardedLevels = [];
    game.rewardedWordKeys = [];
    render(<LevelStartScreen />);

    expect(screen.getByRole('note').textContent).toContain('2 ana kelimeyi');
    expect(screen.getByRole('note').textContent).not.toContain('kısa');
  });
});
