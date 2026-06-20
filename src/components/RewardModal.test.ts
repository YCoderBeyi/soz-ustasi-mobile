import { createElement, type ReactNode } from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { levels } from '../data/levels';
import { RewardModal, isFinalLevel } from './RewardModal';

const useGameMock = vi.fn();

vi.mock('../store/GameContext', () => ({
  useGame: () => useGameMock(),
}));

vi.mock('../data/levelStories', () => ({
  getLevelStory: () => ({
    title: 'Deneme Hikayesi',
    era: 'Klasik Cag',
    place: 'Istanbul',
    body: 'Odul alani test ediliyor.',
  }),
}));

vi.mock('../game/objectives', async () => {
  const actual = await vi.importActual<typeof import('../game/objectives')>('../game/objectives');
  return {
    ...actual,
    getObjectiveLabels: () => ({
      noHints: 'Ipucu kullanma',
      hiddenWords: 'Gizli kelime bul',
      fastFinish: 'Hizli bitir',
    }),
    chooseBestMastery: () => ({
      stars: 0,
      objectives: [],
    }),
  };
});

vi.mock('./Modal', () => ({
  Modal: ({ title, children }: { title: string; children: ReactNode }) => (
    createElement('section', null,
      createElement('h2', null, title),
      children,
    )
  ),
}));

vi.mock('./Button3D', () => ({
  Button3D: ({ children, onClick }: { children: ReactNode; onClick?: () => void }) => (
    createElement('button', { type: 'button', onClick }, children)
  ),
}));

describe('isFinalLevel', () => {
  it('derives the final level from the catalog', () => {
    expect(isFinalLevel(45, levels)).toBe(false);
    expect(isFinalLevel(75, levels)).toBe(true);
  });
});

describe('RewardModal', () => {
  it('does not render zero-value reward rows', () => {
    useGameMock.mockReturnValue({
      level: {
        levelId: 1,
        mainWords: ['SOZ'],
        hiddenWords: [],
      },
      rewardSummary: { base: 0, hidden: 0, region: 0 },
      levelMastery: {},
      earnedObjectives: [],
      goToNextLevel: vi.fn(),
      play: vi.fn(),
    });

    render(createElement(RewardModal));

    expect(screen.queryByText('+0 ALTIN')).toBeNull();
    expect(screen.queryByText(/^0$/)).toBeNull();
    expect(screen.getByText('Bu mühür daha önce ödüllendirildi.')).toBeTruthy();
    expect(screen.queryByText('Keşif devam ediyor')).toBeNull();
    expect(screen.queryByText('Tekrar Keşfet')).toBeNull();
  });

  it('omits zero coin rows when a non-zero bonus exists', () => {
    useGameMock.mockReturnValue({
      level: {
        levelId: 1,
        mainWords: ['SOZ'],
        hiddenWords: [],
      },
      rewardSummary: { base: 0, hidden: 2, region: 3 },
      levelMastery: {},
      earnedObjectives: [],
      goToNextLevel: vi.fn(),
      play: vi.fn(),
    });

    render(createElement(RewardModal));

    expect(screen.queryByText('+0 ALTIN')).toBeNull();
    expect(screen.getByText('+2 GİZLİ BONUS')).toBeTruthy();
    expect(screen.getByText('+3 BÖLGE SANDIĞI')).toBeTruthy();
    expect(screen.queryByText('Keşif devam ediyor')).toBeNull();
    expect(screen.queryByText('Tekrar Keşfet')).toBeNull();
  });

  it('renders the flawless reward row when present', () => {
    useGameMock.mockReturnValue({
      level: {
        levelId: 1,
        mainWords: ['SOZ'],
        hiddenWords: [],
      },
      rewardSummary: { base: 10, hidden: 0, region: 0, flawless: true },
      levelMastery: {},
      earnedObjectives: [],
      goToNextLevel: vi.fn(),
      play: vi.fn(),
    });

    render(createElement(RewardModal));

    expect(screen.getByText('+10 ALTIN')).toBeTruthy();
    expect(screen.getByText('KUSURSUZ +%50')).toBeTruthy();
    expect(screen.queryByText('Keşif devam ediyor')).toBeNull();
    expect(screen.queryByText('Tekrar Keşfet')).toBeNull();
  });
});
