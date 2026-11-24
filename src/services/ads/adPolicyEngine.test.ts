import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createAdPolicyEngine,
  type AdPolicyEngineDeps,
} from './adPolicyEngine';
import { DEFAULT_AD_POLICY } from './adPolicy';

const store = new Map<string, string>();

beforeEach(() => {
  store.clear();
  vi.stubGlobal('window', {
    localStorage: {
      getItem: (key: string) => store.get(key) ?? null,
      setItem: (key: string, value: string) => { store.set(key, value); },
      removeItem: (key: string) => { store.delete(key); },
      clear: () => store.clear(),
    },
  });
});

function makeEngine(partial: Partial<AdPolicyEngineDeps> = {}) {
  let now = 1_700_000_000_000;
  const deps: AdPolicyEngineDeps = {
    nowMs: () => now,
    getRewardedAdsLeftToday: () => 6,
    getCompletedLevelCount: () => 10,
    isConsentAllowed: () => true,
    isAdsEnabled: () => true,
    isKillSwitch: () => false,
    policy: DEFAULT_AD_POLICY,
    ...partial,
  };
  const engine = createAdPolicyEngine(deps);
  return {
    engine,
    advance(ms: number) { now += ms; },
    setNow(ms: number) { now = ms; },
  };
}

describe('adPolicyEngine fullscreen cooldown', () => {
  it('blocks rewarded start until 300s after any fullscreen close', () => {
    const { engine, advance } = makeEngine();
    engine.recordFullscreenClosed('rewarded');
    expect(engine.canStartRewarded()).toEqual({
      allowed: false,
      reason: 'fullscreen_cooldown',
      remainingSeconds: 300,
    });
    advance(299_000);
    expect(engine.canStartRewarded().allowed).toBe(false);
    advance(1_000);
    expect(engine.canStartRewarded()).toEqual({ allowed: true });
  });

  it('persists cooldown across engine recreations', () => {
    const first = makeEngine();
    first.engine.recordFullscreenClosed('interstitial');
    const second = makeEngine({ nowMs: () => 1_700_000_000_000 + 60_000 });
    expect(second.engine.canStartRewarded()).toEqual({
      allowed: false,
      reason: 'fullscreen_cooldown',
      remainingSeconds: 240,
    });
  });
});

describe('adPolicyEngine interstitial', () => {
  it('requires natural transition and increments session / level counters', () => {
    const { engine } = makeEngine({ getCompletedLevelCount: () => 5 });
    engine.noteLevelCompleted();
    engine.noteLevelCompleted();
    engine.noteLevelCompleted();
    expect(engine.canShowInterstitial({ adReady: true, isGameplayActive: false, isNaturalTransition: true })).toBe(true);
    engine.recordInterstitialShown();
    engine.recordFullscreenClosed('interstitial');
    expect(engine.canShowInterstitial({ adReady: true, isGameplayActive: false, isNaturalTransition: true })).toBe(false);
  });

  it('never shows during gameplay or before initial ad-free levels', () => {
    const { engine } = makeEngine({ getCompletedLevelCount: () => 3 });
    engine.noteLevelCompleted();
    engine.noteLevelCompleted();
    engine.noteLevelCompleted();
    expect(engine.canShowInterstitial({ adReady: true, isGameplayActive: true, isNaturalTransition: true })).toBe(false);
    expect(engine.canShowInterstitial({ adReady: true, isGameplayActive: false, isNaturalTransition: true })).toBe(false);
  });

  it('records interstitial policy from Showed even after an early finish(false)', () => {
    const { engine } = makeEngine({ getCompletedLevelCount: () => 5 });
    engine.noteLevelCompleted();
    engine.noteLevelCompleted();
    engine.noteLevelCompleted();
    engine.markFullscreenPresented('interstitial');
    expect(engine.canStartRewarded().allowed).toBe(false);
    expect(engine.canShowInterstitial({ adReady: true, isGameplayActive: false, isNaturalTransition: true })).toBe(false);
  });
});

describe('subscribeAdFullscreenPolicy', () => {
  it('notifies listeners when fullscreen policy is marked', async () => {
    const { subscribeAdFullscreenPolicy } = await import('./adPolicyEngine');
    const { engine } = makeEngine();
    const seen: number[] = [];
    const unsub = subscribeAdFullscreenPolicy(() => seen.push(1));
    engine.markFullscreenPresented('rewarded');
    expect(seen.length).toBeGreaterThan(0);
    unsub();
  });
});
