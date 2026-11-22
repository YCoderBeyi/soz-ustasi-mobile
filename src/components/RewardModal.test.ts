import { createElement, type ReactNode } from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { levels } from '../data/levels';
import { MAX_LEVEL_ID } from '../data/endlessLevels';
import { RewardModal, isFinalLevel } from './RewardModal';

const useGameMock = vi.fn();
afterEach(cleanup);

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
  Modal: ({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) => (
    createElement('section', null,
      createElement('h2', null, title),
      createElement('button', { type: 'button', onClick: onClose, 'aria-label': 'Kapat' }),
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

  it('does not mistake the currently generated catalog end for the game finale', () => {
    expect(isFinalLevel(78)).toBe(false);
    expect(isFinalLevel(MAX_LEVEL_ID)).toBe(true);
  });
});

describe('RewardModal', () => {
  it('closes to the map without skipping a level', () => {
    const goToNextLevel = vi.fn();
    const setModal = vi.fn();
    const setScreen = vi.fn();
    useGameMock.mockReturnValue({
      level: { levelId: 1, mainWords: ['SOZ'], hiddenWords: [] },
      rewardSummary: { base: 0, hidden: 0, region: 0 },
      scoreSummary: { score: 0, previousBest: 0, isRecord: false },
      levelMastery: {}, earnedObjectives: [], goToNextLevel, setModal, setScreen, play: vi.fn(),
    });
    render(createElement(RewardModal));

    fireEvent.click(screen.getByRole('button', { name: 'Kapat' }));

    expect(goToNextLevel).not.toHaveBeenCalled();
    expect(setModal).toHaveBeenCalledWith(null);
    expect(setScreen).toHaveBeenCalledWith('map');
  });

  it('advances only when the explicit next-level action is chosen', () => {
    const goToNextLevel = vi.fn();
    useGameMock.mockReturnValue({
      level: { levelId: 1, mainWords: ['SOZ'], hiddenWords: [] },
      rewardSummary: { base: 0, hidden: 0, region: 0 },
      scoreSummary: { score: 0, previousBest: 0, isRecord: false },
      levelMastery: {}, earnedObjectives: [], goToNextLevel, setModal: vi.fn(), setScreen: vi.fn(), play: vi.fn(),
    });
    render(createElement(RewardModal));

    fireEvent.click(screen.getByRole('button', { name: 'Sonraki Seviye' }));

    expect(goToNextLevel).toHaveBeenCalledOnce();
  });

  it('shows equal autonomy actions on non-final level', () => {
    useGameMock.mockReturnValue({
      level: { levelId: 1, mainWords: ['SOZ'], hiddenWords: [] },
      rewardSummary: { base: 0, hidden: 0, region: 0 },
      scoreSummary: { score: 0, previousBest: 0, isRecord: false },
      levelMastery: {}, earnedObjectives: [], goToNextLevel: vi.fn(), setModal: vi.fn(), setScreen: vi.fn(), play: vi.fn(),
    });
    render(createElement(RewardModal));

    expect(screen.getByRole('button', { name: 'Sonraki Seviye' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Haritaya Dön' })).toBeTruthy();
  });

  it('Haritaya Dön goes to map without advancing', () => {
    const goToNextLevel = vi.fn();
    const setModal = vi.fn();
    const setScreen = vi.fn();
    useGameMock.mockReturnValue({
      level: { levelId: 1, mainWords: ['SOZ'], hiddenWords: [] },
      rewardSummary: { base: 0, hidden: 0, region: 0 },
      scoreSummary: { score: 0, previousBest: 0, isRecord: false },
      levelMastery: {}, earnedObjectives: [], goToNextLevel, setModal, setScreen, play: vi.fn(),
    });
    render(createElement(RewardModal));

    fireEvent.click(screen.getByRole('button', { name: 'Haritaya Dön' }));

    expect(goToNextLevel).not.toHaveBeenCalled();
    expect(setModal).toHaveBeenCalledWith(null);
    expect(setScreen).toHaveBeenCalledWith('map');
  });

  it('final level shows only Haritaya Dön', () => {
    useGameMock.mockReturnValue({
      level: { levelId: MAX_LEVEL_ID, mainWords: ['SOZ'], hiddenWords: [] },
      rewardSummary: { base: 0, hidden: 0, region: 0 },
      scoreSummary: { score: 0, previousBest: 0, isRecord: false },
      levelMastery: {}, earnedObjectives: [], goToNextLevel: vi.fn(), setModal: vi.fn(), setScreen: vi.fn(), play: vi.fn(),
    });
    render(createElement(RewardModal));

    expect(screen.queryByRole('button', { name: 'Sonraki Seviye' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Haritaya Dön' })).toBeTruthy();
  });

  it('does not render zero-value reward rows', () => {
    useGameMock.mockReturnValue({
      level: {
        levelId: 1,
        mainWords: ['SOZ'],
        hiddenWords: [],
      },
      rewardSummary: { base: 0, hidden: 0, region: 0 },
      scoreSummary: { score: 120, previousBest: 0, isRecord: false },
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
      scoreSummary: { score: 120, previousBest: 0, isRecord: false },
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
      scoreSummary: { score: 120, previousBest: 0, isRecord: false },
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
