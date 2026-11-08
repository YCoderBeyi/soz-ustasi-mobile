// @vitest-environment jsdom
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

vi.mock('./audio', () => ({ playSfx: vi.fn() }));
vi.mock('./services/admob', () => ({
  initializeAdMob: vi.fn(), showRewardedAd: vi.fn(), showAdPrivacyOptions: vi.fn(),
  getRewardedAdsLeftToday: () => 0, subscribeRewardedAdsLeft: () => () => {},
}));

beforeEach(() => {
  localStorage.clear();
  // jsdom has no layout engine; geometry assertions belong in the device walkthrough.
  vi.stubGlobal('ResizeObserver', class { observe() {} disconnect() {} unobserve() {} });
  vi.useFakeTimers();
});
afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

describe('routed screen walkthrough (DOM, not a visual browser test)', () => {
  it('navigates all nine routed screens and settings privacy using the real providers', () => {
    const { container } = render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'BAŞLA' }));
    expect(screen.getByRole('heading', { name: 'Harfleri Birleştir' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Devam Et' }));
    fireEvent.click(screen.getByRole('button', { name: 'Devam Et' }));
    fireEvent.click(screen.getByRole('button', { name: 'Haritaya Geç' }));
    fireEvent.click(screen.getByRole('button', { name: 'Seviye 1, oynanabilir' }));
    fireEvent.click(screen.getByRole('button', { name: 'OYNA' }));
    act(() => { vi.advanceTimersByTime(300); });
    expect(screen.getByRole('region', { name: 'Bulmaca alanı' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Ayarlar' }));
    expect(screen.getByRole('dialog', { name: 'Oyun Duraklatıldı' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Ana Haritaya Dön/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Sözlük' }));
    expect(screen.getByText('Henüz kelime yok')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Mağaza' }));
    expect(screen.getByRole('heading', { name: 'Mağaza' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Geri' }));
    // Map has both the avatar and navigation button for Profile.
    fireEvent.click(screen.getAllByRole('button', { name: 'Profil' })[0]);
    expect(screen.getByRole('heading', { name: 'Profil' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Ayarlar.*Ses ve oyun tercihleri/ }));
    expect(screen.getByRole('heading', { name: 'Ayarlar' })).toBeTruthy();
    fireEvent.click(screen.getByRole('switch', { name: /Hareketi Azalt/ }));
    expect(document.documentElement.classList.contains('reduce-motion')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: /Gizlilik Politikası/ }));
    expect(screen.getByRole('dialog', { name: 'Gizlilik Politikası' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Tamam' }));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(container.querySelector('.settingsScreen')).toBeTruthy();
  });
});
