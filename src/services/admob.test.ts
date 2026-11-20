import { beforeEach, describe, expect, it, vi } from 'vitest';

const admob = vi.hoisted(() => ({
  initialize: vi.fn(async () => undefined),
  requestConsentInfo: vi.fn(),
  showConsentForm: vi.fn(),
  prepareRewardVideoAd: vi.fn<() => Promise<{ adUnitId: string }>>(async () => ({ adUnitId: 'test-rewarded-unit' })),
  showRewardVideoAd: vi.fn(),
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
}));
vi.mock('@capacitor/core', () => ({ Capacitor: { isNativePlatform: () => true } }));

async function freshAdmob() {
  vi.resetModules();
  return import('./admob');
}

describe('admob service', () => {
  beforeEach(() => {
    Object.values(admob).forEach((fn) => fn.mockClear());
    admob.requestConsentInfo.mockResolvedValue({ canRequestAds: true, isConsentFormAvailable: false });
    admob.prepareRewardVideoAd.mockResolvedValue({ adUnitId: 'test-rewarded-unit' });
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

  it('reserves the map banner slot only after consent allows and the banner is attached', async () => {
    const { showMapBanner, hideMapBanner, isMapBannerVisible } = await freshAdmob();
    await showMapBanner();

    expect(admob.showBanner).toHaveBeenCalledOnce();
    expect(isMapBannerVisible()).toBe(false);
    const loadedListener = admob.addListener.mock.calls.find(([event]) => event === 'bannerLoaded')?.[1];
    expect(loadedListener).toBeTypeOf('function');
    loadedListener?.();
    expect(isMapBannerVisible()).toBe(true);
    await hideMapBanner();
    expect(admob.hideBanner).toHaveBeenCalledOnce();
    expect(isMapBannerVisible()).toBe(false);
  });

  it('does not reserve a map banner slot when consent is declined', async () => {
    admob.requestConsentInfo.mockResolvedValue({ canRequestAds: false, isConsentFormAvailable: false });
    const { showMapBanner, isMapBannerVisible } = await freshAdmob();
    await showMapBanner();

    expect(admob.showBanner).not.toHaveBeenCalled();
    expect(isMapBannerVisible()).toBe(false);
  });
});
