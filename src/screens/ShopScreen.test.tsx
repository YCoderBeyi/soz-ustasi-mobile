// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { REWARDED_COIN_AMOUNT } from '../data/shop';
import { ShopScreen } from './ShopScreen';

const state = vi.hoisted(() => ({
  addCoins: vi.fn(),
  setToast: vi.fn(),
  showRewardedAd: vi.fn(),
  adsLeft: 6,
}));

vi.mock('../store/GameContext', () => ({ useGame: () => ({
  play: vi.fn(), setScreen: vi.fn(), buyShopItem: vi.fn(), selectShopItem: vi.fn(),
  isItemOwned: () => false, selectedThemeId: null, selectedSealId: null, toast: '',
  coins: 120, doublerRemaining: 0, addCoins: state.addCoins, setToast: state.setToast,
}) }));
vi.mock('../services/admob', () => ({
  showRewardedAd: state.showRewardedAd,
  getLastAdFailureDetail: () => 'Reklam yüklenemedi: test',
}));
vi.mock('../services/useRewardedAdsLeft', () => ({ useRewardedAdsLeftToday: () => state.adsLeft }));
vi.mock('../services/useFullscreenCooldown', () => ({ useFullscreenCooldownRemaining: () => 0 }));

afterEach(cleanup);
beforeEach(() => {
  state.addCoins.mockReset();
  state.setToast.mockReset();
  state.showRewardedAd.mockReset();
  state.adsLeft = 6;
});

describe('ShopScreen rewarded coin offer', () => {
  it('grants the disclosed coin amount only after the rewarded callback succeeds', async () => {
    state.showRewardedAd.mockResolvedValue(true);
    render(<ShopScreen />);
    fireEvent.click(screen.getByRole('button', { name: 'Altın' }));
    expect(screen.getByText(`İzle, ${REWARDED_COIN_AMOUNT} altın kazan`)).toBeTruthy();

    fireEvent.click(screen.getByRole('button', { name: 'Reklam izle' }));

    await waitFor(() => expect(state.addCoins).toHaveBeenCalledWith(REWARDED_COIN_AMOUNT));
    expect(state.showRewardedAd).toHaveBeenCalledOnce();
  });

  it('does not grant coins when the ad is unavailable or the daily cap is exhausted', async () => {
    state.showRewardedAd.mockResolvedValue(false);
    render(<ShopScreen />);
    fireEvent.click(screen.getByRole('button', { name: 'Altın' }));
    fireEvent.click(screen.getByRole('button', { name: 'Reklam izle' }));

    await waitFor(() => expect(state.setToast).toHaveBeenCalled());
    expect(state.addCoins).not.toHaveBeenCalled();

    cleanup();
    state.adsLeft = 0;
    render(<ShopScreen />);
    fireEvent.click(screen.getByRole('button', { name: 'Altın' }));
    expect((screen.getByRole('button', { name: 'Hak bitti' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
