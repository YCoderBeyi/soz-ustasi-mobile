import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const game = vi.hoisted(() => ({
  play: vi.fn(), setModal: vi.fn(), setScreen: vi.fn(), startLevel: vi.fn(),
  level: { levelId: 3 },
  soundEnabled: true, setSoundEnabled: vi.fn(),
  hapticsEnabled: true, setHapticsEnabled: vi.fn(),
  reduceMotion: false, setReduceMotion: vi.fn(),
}));

vi.mock('../store/GameContext', () => ({ useGame: () => game }));
vi.mock('./Icon', () => ({ V2Icon: () => null }));

import { PauseModal } from './PauseModal';

describe('PauseModal', () => {
  afterEach(cleanup);
  beforeEach(() => { Object.values(game).forEach((v) => { if (typeof v === 'function' && 'mockClear' in v) v.mockClear(); }); });

  it('closes on Escape like the close button', () => {
    render(<PauseModal />);
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(game.setModal).toHaveBeenCalledWith(null);
  });

  it('exposes itself as a labelled dialog', () => {
    render(<PauseModal />);
    expect(screen.getByRole('dialog', { name: 'Oyun Duraklatıldı' })).toBeTruthy();
  });

  it('asks before restarting the level and restarts only on the second tap', () => {
    render(<PauseModal />);
    fireEvent.click(screen.getByText('Leveli Yeniden Başlat'));
    expect(game.startLevel).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Emin misin? Yeniden başlat'));
    expect(game.startLevel).toHaveBeenCalledOnce();
    expect(game.startLevel).toHaveBeenCalledWith(game.level);
  });
});
