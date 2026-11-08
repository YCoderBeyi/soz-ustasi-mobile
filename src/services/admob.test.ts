import { beforeEach, describe, expect, it, vi } from 'vitest';

const admob = vi.hoisted(() => ({
  initialize: vi.fn(async () => undefined),
  requestConsentInfo: vi.fn(),
  showConsentForm: vi.fn(),
  prepareRewardVideoAd: vi.fn(async () => undefined),
  showRewardVideoAd: vi.fn(),
  addListener: vi.fn(),
  showPrivacyOptionsForm: vi.fn(),
}));

vi.mock('@capacitor-community/admob', () => ({
  AdMob: admob,
  MaxAdContentRating: { General: 'General', ParentalGuidance: 'ParentalGuidance', Teen: 'Teen', MatureAudience: 'MatureAudience' },
  RewardAdPluginEvents: { Rewarded: 'rewarded', Dismissed: 'dismissed', FailedToShow: 'failedToShow' },
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
});
