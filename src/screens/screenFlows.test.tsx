// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SettingsScreen } from './SettingsScreen';
import { StartScreen3D } from './StartScreen3D';
import { ShopScreen } from './ShopScreen';
import { DictionaryScreen } from './DictionaryScreen';
import { PrivacyModal } from '../components/PrivacyModal';
import { MapScreen } from './MapScreen';
import { levels } from '../data/levels';
import { OnboardingScreen } from './OnboardingScreen';

const { state } = vi.hoisted(() => ({ state: {} as Record<string, unknown> }));
vi.mock('../store/GameContext', () => ({ useGame: () => state }));
vi.mock('../services/admob', () => ({ showAdPrivacyOptions: vi.fn() }));

afterEach(cleanup);
beforeEach(() => {
  Object.assign(state, {
    screen: 'settings', setScreen: vi.fn(), play: vi.fn(), modal: null, setModal: vi.fn(),
    soundEnabled: true, soundVolume: 80, hapticsEnabled: false, calmMode: false, reduceMotion: false,
    setSoundEnabled: vi.fn(), setSoundVolume: vi.fn(), setHapticsEnabled: vi.fn(),
    setCalmMode: vi.fn(), setReduceMotion: vi.fn(),
    completedLevels: [], collectedWords: [], favoriteWords: [], theme: { primaryColor: '#f1c96a' },
    coins: 0, isItemOwned: () => false, doublerRemaining: 0, toast: '', toggleFavorite: vi.fn(),
    level: levels[0], levelMastery: {}, isLevelUnlocked: () => true, dailyChallenge: null,
    setToast: vi.fn(), setLevel: vi.fn(),
  });
});

describe('screen flows', () => {
  it('opens privacy from settings and closes back to settings', () => {
    const { rerender } = render(<SettingsScreen />);
    fireEvent.click(screen.getByRole('button', { name: /Gizlilik Politikası/ }));
    expect(state.setModal).toHaveBeenCalledWith('privacy');
    state.modal = 'privacy';
    rerender(<SettingsScreen />);
    expect(screen.getByRole('dialog', { name: 'Gizlilik Politikası' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Tamam' }));
    expect(state.setModal).toHaveBeenLastCalledWith(null);
  });

  it('returns privacy to the pause menu during a game', () => {
    state.screen = 'game';
    render(<PrivacyModal />);
    fireEvent.click(screen.getByRole('button', { name: 'Kapat' }));
    expect(state.setModal).toHaveBeenCalledWith('pause');
  });

  it('exposes preference states and the shared reduced-motion preference', () => {
    render(<SettingsScreen />);
    expect(screen.getByRole('switch', { name: /Ses Efektleri/ }).getAttribute('aria-checked')).toBe('true');
    expect(screen.getByRole('switch', { name: /Sakin Mod/ }).getAttribute('aria-checked')).toBe('false');
    fireEvent.click(screen.getByRole('switch', { name: /Hareketi Azalt/ }));
    expect(state.setReduceMotion).toHaveBeenCalledWith(true);
  });

  it('starts the first visit immediately with onboarding', () => {
    render(<StartScreen3D />);
    fireEvent.click(screen.getByRole('button', { name: 'BAŞLA' }));
    expect(state.setScreen).toHaveBeenCalledWith('onboarding');
  });

  it('continues an existing collection immediately on the map', () => {
    state.collectedWords = [{ word: 'ARI', meaning: 'Bir böcek.' }];
    render(<StartScreen3D />);
    fireEvent.click(screen.getByRole('button', { name: 'DEVAM ET' }));
    expect(state.setScreen).toHaveBeenCalledWith('map');
  });

  it('names shop purchase controls with their item and cost', () => {
    render(<ShopScreen />);
    const buttons = screen.getAllByRole('button', { name: /altın.*satın al/i });
    expect(buttons.length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: 'Temalar' }).getAttribute('aria-pressed')).toBe('true');
  });

  it('explains how to fill favorites instead of suggesting words were lost', () => {
    render(<DictionaryScreen />);
    fireEvent.click(screen.getByRole('button', { name: 'Favoriler' }));
    expect(screen.getByText(/kalp düğmesi/)).toBeTruthy();
  });

  it('gives every region a unique name and exposes the selected region', () => {
    render(<MapScreen />);
    const regions = screen.getAllByRole('button', { name: /Bölge \d+:/ });
    expect(regions.length).toBeGreaterThan(1);
    expect(new Set(regions.map((button) => button.getAttribute('aria-label'))).size).toBe(regions.length);
    expect(regions[0].getAttribute('aria-current')).toBe('true');
    fireEvent.click(regions[1]);
    expect(regions[1].getAttribute('aria-current')).toBe('true');
    expect(regions[0].getAttribute('aria-current')).toBeNull();
  });

  it('does not treat a mainly vertical swipe as a region change', () => {
    render(<MapScreen />);
    const journey = screen.getByRole('region', { name: /seviyeleri/ });
    fireEvent.touchStart(journey, { touches: [{ clientX: 160, clientY: 200 }] });
    fireEvent.touchMove(journey, { touches: [{ clientX: 80, clientY: 400 }] });
    fireEvent.touchEnd(journey);
    expect(screen.getAllByRole('button', { name: /Bölge \d+:/ })[0].getAttribute('aria-current')).toBe('true');
  });

  it('allows going back or skipping onboarding and announces progress', () => {
    render(<OnboardingScreen />);
    expect(screen.getByRole('status').textContent).toContain('1 / 3');
    fireEvent.click(screen.getByRole('button', { name: 'Devam Et' }));
    fireEvent.click(screen.getByRole('button', { name: 'Önceki' }));
    expect(screen.getByRole('heading', { name: 'Harfleri Birleştir' })).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Tanıtımı Atla' }));
    expect(state.setScreen).toHaveBeenCalledWith('map');
  });

  it('marks the unavailable missions destination before a player activates it', () => {
    render(<DictionaryScreen />);
    expect((screen.getByRole('button', { name: 'Görevler (yakında)' }) as HTMLButtonElement).disabled).toBe(true);
  });
});
