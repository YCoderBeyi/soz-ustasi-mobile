import { AdMob, MaxAdContentRating, RewardAdPluginEvents, type RewardAdOptions } from '@capacitor-community/admob';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import {
  canWatchRewardedAd,
  consumeRewardedAd,
  getRewardedAdsLeftToday as getBudgetLeft,
  subscribeAdBudget,
} from '../game/adBudget';

// Ödüllü reklam birimi ID'si (AdMob → Söz Ustası → Ad units → sozustasi_rewarded).
const REWARDED_AD_ID = 'ca-app-pub-2784764635828379/7996501862';

// Geliştirmede test reklamı gösterilir; üretim derlemesinde gerçek reklam.
const IS_TESTING = import.meta.env.DEV;

/**
 * Audience declaration sent to Google: a general audience aged 13+, not a child-directed app.
 * Must stay consistent with the Play Console target audience, the store listing and the privacy policy (section 6).
 * Ad content is capped at "parental guidance" so the ads match the game's family-safe tone.
 */
export const AD_AUDIENCE = {
  tagForChildDirectedTreatment: false,
  tagForUnderAgeOfConsent: false,
  maxAdContentRating: MaxAdContentRating.ParentalGuidance,
} as const;

let initPromise: Promise<void> | null = null;
/** Ads may only be requested once the consent flow says so (declined consent or a failed flow means no ads). */
let adsAllowed = false;

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

/**
 * AdMob'u bir kez başlatır: initialize → UMP izin kontrolü → gerekirse izin
 * formu → rewarded ön yükleme. StrictMode çift çağrıya karşı idempotenttir;
 * başarısızlıkta bir sonraki çağrı yeniden dener.
 */
export function initializeAdMob(): Promise<void> {
  if (!isNative()) return Promise.resolve();
  if (!initPromise) {
    initPromise = (async () => {
      await AdMob.initialize(AD_AUDIENCE);
      try {
        let consent = await AdMob.requestConsentInfo();
        if (!consent.canRequestAds && consent.isConsentFormAvailable) {
          consent = await AdMob.showConsentForm();
        }
        adsAllowed = consent.canRequestAds;
      } catch (error) {
        adsAllowed = false;
        console.error('AdMob izin hatası:', error);
      }
      await preloadRewardedAd();
    })().catch((error) => {
      console.error('AdMob başlatma hatası:', error);
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

async function preloadRewardedAd(): Promise<void> {
  if (!isNative() || !adsAllowed) return;
  try {
    const options: RewardAdOptions = {
      adId: REWARDED_AD_ID,
      isTesting: IS_TESTING,
      immersiveMode: true,
    };
    await AdMob.prepareRewardVideoAd(options);
  } catch (error) {
    console.error('Rewarded reklam hazırlanamadı:', error);
  }
}

/**
 * Rewarded reklamı gösterir ve sonucu reklam event'lerinden çözer. Eklenti
 * call'ı yalnızca ödül kazanıldığında resolve eder; reklam erken kapatılırsa
 * (Dismissed) veya gösterilemezse (FailedToShow) call asla çözülmez. Bu yüzden
 * promise, event'lere dayanarak kesin olarak sonlandırılır.
 */
async function showRewardedAdWithEvents(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    const handles: PluginListenerHandle[] = [];
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      if (handles.length > 0) {
        void Promise.all(handles.map((handle) => handle.remove()));
      }
      resolve(value);
    };

    void Promise.all([
      AdMob.addListener(RewardAdPluginEvents.Rewarded, () => finish(true)),
      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => finish(false)),
      AdMob.addListener(RewardAdPluginEvents.FailedToShow, () => finish(false)),
    ])
      .then((listeners) => {
        if (settled) {
          void Promise.all(listeners.map((listener) => listener.remove()));
          return;
        }
        handles.push(...listeners);
        void AdMob.showRewardVideoAd()
          .then((item) => finish(Boolean(item && item.amount > 0)))
          .catch(() => finish(false));
      })
      .catch(() => finish(false));
  });
}

/**
 * Rewarded reklamı gösterir. Ödül yalnızca AdMob "rewarded" event'i geldiğinde
 * verilir ve günlük limite sayılır. Web'de ve limit doluysa false döner.
 */
export async function showRewardedAd(): Promise<boolean> {
  if (!isNative()) return false;
  if (!canWatchRewardedAd()) return false;
  try {
    await initializeAdMob();
  } catch (error) {
    console.error('Rewarded ön koşul hatası:', error);
    void preloadRewardedAd();
    return false;
  }
  if (!adsAllowed) return false;
  const rewarded = await showRewardedAdWithEvents();
  if (rewarded) consumeRewardedAd();
  void preloadRewardedAd();
  return rewarded;
}

export async function showAdPrivacyOptions(): Promise<void> {
  if (!isNative()) return;
  try {
    await initializeAdMob();
    await AdMob.showPrivacyOptionsForm();
  } catch (error) {
    console.error('Reklam gizlilik tercihleri hatası:', error);
  }
}

export function getRewardedAdsLeftToday(): number {
  return getBudgetLeft();
}

export function subscribeRewardedAdsLeft(listener: () => void): () => void {
  return subscribeAdBudget(listener);
}
