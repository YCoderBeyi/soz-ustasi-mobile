// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { HintModal } from './HintModal';

const state = vi.hoisted(() => ({
  revealLetterHintViaAd: vi.fn(async () => undefined),
  revealMeaningHintViaAd: vi.fn(async () => undefined),
  adsLeft: 6,
  cooldownLeft: 0,
  coins: 100,
}));

vi.mock('../store/GameContext', () => ({
  useGame: () => ({
    coins: state.coins,
    setModal: vi.fn(),
    play: vi.fn(),
    revealMeaningHint: vi.fn(),
    revealLetterHint: vi.fn(),
    revealMeaningHintViaAd: state.revealMeaningHintViaAd,
    revealLetterHintViaAd: state.revealLetterHintViaAd,
  }),
}));
vi.mock('../services/useRewardedAdsLeft', () => ({
  useRewardedAdsLeftToday: () => state.adsLeft,
}));
vi.mock('../services/useFullscreenCooldown', () => ({
  useFullscreenCooldownRemaining: () => state.cooldownLeft,
}));

afterEach(cleanup);
beforeEach(() => {
  state.revealLetterHintViaAd.mockClear();
  state.revealMeaningHintViaAd.mockClear();
  state.adsLeft = 6;
  state.cooldownLeft = 0;
  state.coins = 100;
});

describe('HintModal rewarded hint CTA', () => {
  it('offers Reklam izle for letter and meaning hints', async () => {
    render(<HintModal />);
    const adButtons = screen.getAllByRole('button', { name: /isteğe bağlı reklam/i });
    expect(adButtons).toHaveLength(2);

    fireEvent.click(adButtons[0]!);
    await waitFor(() => expect(state.revealLetterHintViaAd).toHaveBeenCalledOnce());
  });

  it('blocks ad CTA and shows shared cooldown copy while waiting', () => {
    state.cooldownLeft = 42;
    render(<HintModal />);

    expect(screen.getByText('Tam ekran reklam için 42 sn bekle. Reklamsız oynayabilirsin.')).toBeTruthy();
    const adButtons = screen.getAllByRole('button', { name: /isteğe bağlı reklam/i });
    expect(adButtons.every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
    expect(screen.getAllByText('42 sn bekle').length).toBeGreaterThan(0);
  });
});
