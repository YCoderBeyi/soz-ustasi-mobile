import { beforeEach, describe, expect, it, vi } from 'vitest';

const admob = vi.hoisted(() => ({
  initialize: vi.fn(async () => undefined),
  requestConsentInfo: vi.fn(),
  showConsentForm: vi.fn(),
  prepareRewardVideoAd: vi.fn<() => Promise<{ adUnitId: string }>>(async () => ({ adUnitId: 'test-rewarded-unit' })),
  showRewardVideoAd: vi.fn(),
  prepareInterstitial: vi.fn<() => Promise<{ adUnitId: string }>>(async () => ({ adUnitId: 'test-interstitial-unit' })),
  showInterstitial: vi.fn(async () => undefined),
  showBanner: vi.fn(async () => undefined),
  hideBanner: vi.fn(async () => undefined),
  addListener: vi.fn(),
  showPrivacyOptionsForm: vi.fn(),
}));

vi.mock('@capacitor-community/admob', () => ({
  AdMob: admob,
  BannerAdPluginEvents: { Loaded: 'bannerLoaded', FailedToLoad: 'bannerFailedToLoad' },
  BannerAdPosition: { TOP_CENTER: 'TOP_CENTER' },
  BannerAdSize: { ADAPTIVE_BANNER: 'ADAPTIVE_BANNER' },
  MaxAdContentRating: { General: 'General', ParentalGuidance: 'ParentalGuidance', Teen: 'Teen', MatureAudience: 'MatureAudience' },
  RewardAdPluginEvents: {
    Rewarded: 'rewarded', Dismissed: 'dismissed', FailedToShow: 'failedToShow',
    FailedToLoad: 'failedToLoad', Showed: 'showed',
  },
  InterstitialAdPluginEvents: {
    Loaded: 'interstitialAdLoaded', FailedToLoad: 'interstitialAdFailedToLoad',
    Showed: 'interstitialAdShowed', FailedToShow: 'interstitialAdFailedToShow', Dismissed: 'interstitialAdDismissed',
  },
}));
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));

async function freshAdmob() {
  vi.resetModules();
  window.localStorage.clear();
  const { resetSharedAdPolicyEngine } = await import('./ads/sharedAdPolicyEngine');
  resetSharedAdPolicyEngine();
  return import('./admob');
}

describe('admob service', () => {
  beforeEach(() => {
    window.localStorage.clear();
    Object.values(admob).forEach((fn) => fn.mockClear());
    admob.showBanner.mockReset().mockResolvedValue(undefined);
    admob.requestConsentInfo.mockResolvedValue({ canRequestAds: true, isConsentFormAvailable: false });
    admob.prepareRewardVideoAd.mockResolvedValue({ adUnitId: 'test-rewarded-unit' });
    admob.prepareInterstitial.mockResolvedValue({ adUnitId: 'test-interstitial-unit' });
    admob.showInterstitial.mockResolvedValue(undefined);
    admob.addListener.mockResolvedValue({ remove: vi.fn() });
  });

  it('declares a general 13+ audience, matching the store listing and the privacy policy', async () => {
    const { initializeAdMob, AD_AUDIENCE } = await freshAdmob();
    await initializeAdMob();

    expect(AD_AUDIENCE.tagForChildDirectedTreatment).toBe(false);
    expect(AD_AUDIENCE.maxAdContentRating).toBe('ParentalGuidance');
    expect(admob.initialize).toHaveBeenCalledWith(AD_AUDIENCE);
  });

  it('preloads the rewarded ad once consent allows it', async () => {
    const { initializeAdMob } = await freshAdmob();
    await initializeAdMob();
    expect(admob.prepareRewardVideoAd).toHaveBeenCalledOnce();
  });

  it('preloads a standard interstitial after consent', async () => {
    const { initializeAdMob } = await freshAdmob();
    await initializeAdMob();
    expect(admob.prepareInterstitial).toHaveBeenCalledOnce();
  });

  it('skips level-break interstitial when policy spacing is not met', async () => {
    const { initializeAdMob, attemptLevelBreakInterstitial } = await freshAdmob();
    await initializeAdMob();
    await expect(attemptLevelBreakInterstitial()).resolves.toBe('skipped');
    expect(admob.showInterstitial).not.toHaveBeenCalled();
  });

  it('retries consent on an ad tap after a temporary consent request failure', async () => {
    admob.requestConsentInfo
      .mockRejectedValueOnce(new Error('temporary network error'))
      .mockResolvedValue({ canRequestAds: true, isConsentFormAvailable: false });
    admob.showRewardVideoAd.mockResolvedValue({ type: 'coin', amount: 1 });
    const { initializeAdMob, showRewardedAd } = await freshAdmob();

    await initializeAdMob();
    await expect(showRewardedAd()).resolves.toBe(true);
    expect(admob.requestConsentInfo).toHaveBeenCalledTimes(2);
    expect(admob.prepareRewardVideoAd).toHaveBeenCalledTimes(2);
  });

  it('never requests an ad when consent was declined', async () => {
    admob.requestConsentInfo.mockResolvedValue({ canRequestAds: false, isConsentFormAvailable: true });
    admob.showConsentForm.mockResolvedValue({ canRequestAds: false, isConsentFormAvailable: true });
    const { initializeAdMob, showRewardedAd } = await freshAdmob();

    await initializeAdMob();
    expect(admob.prepareRewardVideoAd).not.toHaveBeenCalled();
    await expect(showRewardedAd()).resolves.toBe(false);
    expect(admob.showRewardVideoAd).not.toHaveBeenCalled();
  });

  it('never requests an ad when the consent flow itself fails', async () => {
    admob.requestConsentInfo.mockRejectedValue(new Error('network'));
    const { initializeAdMob, showRewardedAd } = await freshAdmob();

    await initializeAdMob();
    expect(admob.prepareRewardVideoAd).not.toHaveBeenCalled();
    await expect(showRewardedAd()).resolves.toBe(false);
  });

  it('starts shared cooldown when rewarded resolves with a reward and no Showed event', async () => {
    admob.showRewardVideoAd.mockResolvedValue({ type: 'coin', amount: 1 });
    const { initializeAdMob, showRewardedAd, getFullscreenCooldownRemainingSeconds } = await freshAdmob();
    await initializeAdMob();
    await expect(showRewardedAd()).resolves.toBe(true);
    expect(getFullscreenCooldownRemainingSeconds()).toBeGreaterThan(0);
  });

  it('grants a rewarded ad result once and ignores a concurrent second request', async () => {
    admob.showRewardVideoAd.mockReturnValue(new Promise(() => undefined));
    const { initializeAdMob, showRewardedAd } = await freshAdmob();
    await initializeAdMob();

    const firstRequest = showRewardedAd();
    await vi.waitFor(() => expect(admob.showRewardVideoAd).toHaveBeenCalledOnce());
    await expect(showRewardedAd()).resolves.toBe(false);

    const rewardListener = admob.addListener.mock.calls.find(([event]) => event === 'rewarded')?.[1];
    expect(rewardListener).toBeTypeOf('function');
    rewardListener?.({ type: 'coin', amount: 1 });
    await expect(firstRequest).resolves.toBe(true);
    expect(admob.showRewardVideoAd).toHaveBeenCalledOnce();
  });

  it('does not grant a reward when the player closes the ad early', async () => {
    admob.showRewardVideoAd.mockReturnValue(new Promise(() => undefined));
    const { initializeAdMob, showRewardedAd } = await freshAdmob();
    await initializeAdMob();

    const request = showRewardedAd();
    await vi.waitFor(() => expect(admob.showRewardVideoAd).toHaveBeenCalledOnce());
    const dismissedListener = admob.addListener.mock.calls.find(([event]) => event === 'dismissed')?.[1];
    expect(dismissedListener).toBeTypeOf('function');
    dismissedListener?.();

    await expect(request).resolves.toBe(false);
  });

  it('accepts a reward event that arrives just after the dismiss event', async () => {
    admob.showRewardVideoAd.mockReturnValue(new Promise(() => undefined));
    const { initializeAdMob, showRewardedAd } = await freshAdmob();
    await initializeAdMob();

    const request = showRewardedAd();
    await vi.waitFor(() => expect(admob.showRewardVideoAd).toHaveBeenCalledOnce());
    const eventListener = (event: string) => admob.addListener.mock.calls.find(([name]) => name === event)?.[1];
    eventListener('dismissed')?.();
    eventListener('rewarded')?.({ type: 'coin', amount: 1 });

    await expect(request).resolves.toBe(true);
  });

  it('reserves a screen banner slot before the native banner appears and releases it on exit', async () => {
    const { showTopBanner, hideTopBanner, isBannerSlotReserved } = await freshAdmob();
    admob.showBanner.mockImplementation(async () => {
      expect(isBannerSlotReserved()).toBe(true);
    });
    await showTopBanner('map');

    expect(admob.showBanner).toHaveBeenCalledOnce();
    expect(isBannerSlotReserved()).toBe(true);
    const loadedListener = admob.addListener.mock.calls.find(([event]) => event === 'bannerLoaded')?.[1];
    expect(loadedListener).toBeTypeOf('function');
    loadedListener?.();
    expect(isBannerSlotReserved()).toBe(true);
    await hideTopBanner();
    expect(admob.hideBanner).toHaveBeenCalledOnce();
    expect(isBannerSlotReserved()).toBe(false);
  });

  it('does not reserve a screen banner slot when consent is declined', async () => {
    admob.requestConsentInfo.mockResolvedValue({ canRequestAds: false, isConsentFormAvailable: false });
    const { showTopBanner, isBannerSlotReserved } = await freshAdmob();
    await showTopBanner('level-start');

    expect(admob.showBanner).not.toHaveBeenCalled();
    expect(isBannerSlotReserved()).toBe(false);
  });

  it('keeps the shared banner attached when ownership moves from map to level briefing', async () => {
    const { showTopBanner, hideTopBanner } = await freshAdmob();
    await showTopBanner('map');
    await showTopBanner('level-start');

    expect(admob.hideBanner).not.toHaveBeenCalled();
    await hideTopBanner();
    expect(admob.hideBanner).toHaveBeenCalledOnce();
  });
});
