import { describe, it, expect } from 'vitest';
import {
  DEFAULT_AD_POLICY,
  canShowInterstitial,
  canStartRewarded,
  type AdPolicyContext,
} from './adPolicy';

function ctx(partial: Partial<AdPolicyContext> = {}): AdPolicyContext {
  return {
    adsEnabled: true,
    killSwitch: false,
    consentAllowsRequest: true,
    isGameplayActive: false,
    isNaturalTransition: true,
    completedLevels: 10,
    levelsSinceInterstitial: 3,
    secondsSinceLastFullscreenAd: 300,
    interstitialsThisSession: 0,
    adReady: true,
    rewardedAdsLeftToday: 6,
    ...partial,
  };
}

describe('canShowInterstitial', () => {
  it('blocks the first three completed levels', () => {
    expect(canShowInterstitial(ctx({ completedLevels: 3 }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({ completedLevels: 4 }), DEFAULT_AD_POLICY)).toBe(true);
  });

  it('requires level gap, time gap, and session cap together', () => {
    expect(canShowInterstitial(ctx({ levelsSinceInterstitial: 2 }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({ secondsSinceLastFullscreenAd: 299 }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({ interstitialsThisSession: 3 }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({
      levelsSinceInterstitial: 3,
      secondsSinceLastFullscreenAd: 300,
      interstitialsThisSession: 2,
    }), DEFAULT_AD_POLICY)).toBe(true);
  });

  it('blocks gameplay, kill switch, missing consent, unreadiness, and non-transition', () => {
    expect(canShowInterstitial(ctx({ isGameplayActive: true }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({ killSwitch: true }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({ consentAllowsRequest: false }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({ adReady: false }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({ isNaturalTransition: false }), DEFAULT_AD_POLICY)).toBe(false);
    expect(canShowInterstitial(ctx({ adsEnabled: false }), DEFAULT_AD_POLICY)).toBe(false);
  });
});

describe('canStartRewarded', () => {
  it('allows start when budget and fullscreen cooldown allow', () => {
    expect(canStartRewarded(ctx({
      rewardedAdsLeftToday: 1,
      secondsSinceLastFullscreenAd: 300,
    }), DEFAULT_AD_POLICY)).toEqual({ allowed: true });
  });

  it('blocks start during shared cooldown but keeps offer visible via remainingSeconds', () => {
    expect(canStartRewarded(ctx({
      rewardedAdsLeftToday: 2,
      secondsSinceLastFullscreenAd: 100,
    }), DEFAULT_AD_POLICY)).toEqual({
      allowed: false,
      reason: 'fullscreen_cooldown',
      remainingSeconds: 200,
    });
  });

  it('blocks when daily budget is exhausted', () => {
    expect(canStartRewarded(ctx({ rewardedAdsLeftToday: 0 }), DEFAULT_AD_POLICY)).toEqual({
      allowed: false,
      reason: 'daily_cap',
      remainingSeconds: 0,
    });
  });

  it('blocks when ads disabled, kill switch, or consent missing', () => {
    expect(canStartRewarded(ctx({ killSwitch: true }), DEFAULT_AD_POLICY).allowed).toBe(false);
    expect(canStartRewarded(ctx({ adsEnabled: false }), DEFAULT_AD_POLICY).allowed).toBe(false);
    expect(canStartRewarded(ctx({ consentAllowsRequest: false }), DEFAULT_AD_POLICY).allowed).toBe(false);
  });
});
