import {
  AdMob, BannerAdPluginEvents, BannerAdPosition, BannerAdSize, MaxAdContentRating,
  RewardAdPluginEvents, type RewardAdOptions,
  RewardInterstitialAdPluginEvents,
} from '@capacitor-community/admob';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import {
  canWatchRewardedAd,
  consumeRewardedAd,
  getRewardedAdsLeftToday as getBudgetLeft,
  subscribeAdBudget,
} from '../game/adBudget';

// Ödüllü reklam birimi ID'si. AdMob'da "Söz Ustası - Kelime Oyunu" (com.sozustasi.game, uygulama kimliği ~5793638649) uygulamasına aittir;
// strings.xml içindeki admob_app_id ile aynı AdMob uygulamasından olmalıdır (audit:release denetler).
const REWARDED_AD_ID = 'ca-app-pub-2784764635828379/5235235447';
// Separate AdMob unit for the rewarded-interstitial format. Never pass this to prepareRewardVideoAd.
const REWARDED_INTERSTITIAL_AD_ID = 'ca-app-pub-2784764635828379/3642213482';
// Create a separate Banner unit in AdMob and provide its ID at build time.
// The rewarded unit above must never be reused for banner requests.
const BANNER_AD_ID = import.meta.env.VITE_ADMOB_BANNER_ID ?? '';
const GOOGLE_TEST_BANNER_ID = 'ca-app-pub-3940256099942544/9214589741';

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
let lastAdFailureDetail = '';
let rewardedAdReady = false;
let rewardedLoadPromise: Promise<void> | null = null;
let rewardedInterstitialReady = false;
let rewardedInterstitialLoadPromise: Promise<void> | null = null;
let rewardedAdInFlight = false;
let bannerVisible = false;
let bannerAttached = false;
let bannerWanted = false;
let bannerRequest: Promise<void> | null = null;
let bannerEventHandles: PluginListenerHandle[] = [];
const bannerStateListeners = new Set<() => void>();

function setBannerVisible(visible: boolean): void {
  if (bannerVisible === visible) return;
  bannerVisible = visible;
  for (const listener of bannerStateListeners) listener();
}

function isNative(): boolean {
  return Capacitor.isNativePlatform();
}

function saveAdFailure(stage: string, error?: unknown): void {
  const detail = error instanceof Error ? error.message : error === undefined ? '' : String(error);
  lastAdFailureDetail = `${stage}${detail ? `: ${detail.replace(/\s+/g, ' ').slice(0, 120)}` : ''}`;
  console.error('AdMob teşhis:', lastAdFailureDetail);
}

export function getLastAdFailureDetail(): string {
  return lastAdFailureDetail;
}

async function refreshAdConsent(): Promise<boolean> {
  try {
    let consent = await AdMob.requestConsentInfo();
    if (!consent.canRequestAds && consent.isConsentFormAvailable) {
      consent = await AdMob.showConsentForm();
    }
    adsAllowed = consent.canRequestAds;
    if (adsAllowed) lastAdFailureDetail = '';
    if (!adsAllowed) saveAdFailure('Reklam izni yok veya tamamlanmadı');
    return adsAllowed;
  } catch (error) {
    adsAllowed = false;
    saveAdFailure('Reklam izin bilgisi alınamadı', error);
    return false;
  }
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
      await refreshAdConsent();
      await preloadRewardedAd();
      await preloadRewardedInterstitialAd();
    })().catch((error) => {
      console.error('AdMob başlatma hatası:', error);
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

async function preloadRewardedInterstitialAd(): Promise<void> {
  if (!isNative() || !adsAllowed || rewardedInterstitialReady) return;
  if (rewardedInterstitialLoadPromise) return rewardedInterstitialLoadPromise;
  rewardedInterstitialLoadPromise = (async () => {
    try {
      const ad = await AdMob.prepareRewardInterstitialAd({
        adId: REWARDED_INTERSTITIAL_AD_ID,
        isTesting: IS_TESTING,
        immersiveMode: true,
      });
      if (!ad?.adUnitId) throw new Error('Rewarded interstitial yükleme yanıtı boş.');
      rewardedInterstitialReady = true;
      console.info('Rewarded interstitial hazır.', { adUnitId: ad.adUnitId, isTesting: IS_TESTING });
    } catch (error) {
      rewardedInterstitialReady = false;
      saveAdFailure('Ödüllü geçiş reklamı yüklenemedi', error);
    } finally {
      rewardedInterstitialLoadPromise = null;
    }
  })();
  return rewardedInterstitialLoadPromise;
}

async function showRewardedInterstitialWithEvents(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    let dismissalTimer: ReturnType<typeof setTimeout> | null = null;
    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    const handles: PluginListenerHandle[] = [];
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      if (dismissalTimer) clearTimeout(dismissalTimer);
      if (showTimeout) clearTimeout(showTimeout);
      void Promise.all(handles.map((handle) => handle.remove()));
      resolve(value);
    };

    void Promise.all([
      AdMob.addListener(RewardInterstitialAdPluginEvents.Rewarded, (reward) => {
        finish(Number.isFinite(reward.amount) && reward.amount > 0);
      }),
      AdMob.addListener(RewardInterstitialAdPluginEvents.Dismissed, () => {
        saveAdFailure('Reklam ödül verilmeden kapatıldı');
        dismissalTimer = setTimeout(() => finish(false), 500);
      }),
      AdMob.addListener(RewardInterstitialAdPluginEvents.FailedToShow, (error) => {
        saveAdFailure('Ödüllü geçiş reklamı gösterilemedi', error);
        finish(false);
      }),
      AdMob.addListener(RewardInterstitialAdPluginEvents.FailedToLoad, (error) => {
        saveAdFailure('Ödüllü geçiş reklamı hazır değildi', error);
        finish(false);
      }),
      AdMob.addListener(RewardInterstitialAdPluginEvents.Showed, () => console.info('Rewarded interstitial gösterildi.')),
    ]).then((listeners) => {
      if (settled) {
        void Promise.all(listeners.map((listener) => listener.remove()));
        return;
      }
      handles.push(...listeners);
      showTimeout = setTimeout(() => {
        saveAdFailure('Reklam yanıtı zaman aşımına uğradı');
        finish(false);
      }, 120_000);
      void AdMob.showRewardInterstitialAd()
        .then((item) => finish(Number.isFinite(item?.amount) && item.amount > 0))
        .catch((error) => {
          saveAdFailure('Ödüllü geçiş reklamı isteği başarısız', error);
          finish(false);
        });
    }).catch((error) => {
      console.error('Rewarded interstitial olay dinleyicileri kurulamadı:', error);
      finish(false);
    });
  });
}

/** Optional shop reward: the shop card is the required reward disclosure/skip surface. */
export async function showRewardedInterstitialAd(): Promise<boolean> {
  lastAdFailureDetail = '';
  if (!isNative()) { saveAdFailure('Reklamlar yalnızca Android/iOS uygulamasında çalışır'); return false; }
  if (rewardedAdInFlight) { saveAdFailure('Başka bir reklam isteği sürüyor'); return false; }
  if (!canWatchRewardedAd()) { saveAdFailure('Günlük reklam hakkı doldu'); return false; }
  rewardedAdInFlight = true;
  try {
    try {
      await initializeAdMob();
    } catch (error) {
      console.error('Rewarded interstitial ön koşulu başarısız:', error);
      return false;
    }
    if (!adsAllowed && !(await refreshAdConsent())) return false;
    if (!rewardedInterstitialReady) await preloadRewardedInterstitialAd();
    if (!rewardedInterstitialReady) {
      if (!lastAdFailureDetail) saveAdFailure('Reklam hazır değil');
      return false;
    }
    rewardedInterstitialReady = false;
    const earned = await showRewardedInterstitialWithEvents();
    if (earned) consumeRewardedAd();
    else if (!lastAdFailureDetail) saveAdFailure('Reklam ödül callback’i vermedi');
    void preloadRewardedInterstitialAd();
    return earned;
  } finally {
    rewardedAdInFlight = false;
  }
}

/** Show a banner only on the map, away from the high-touch puzzle surface. */
export function hasMapBannerSlot(): boolean {
  return isNative() && (import.meta.env.DEV || Boolean(BANNER_AD_ID));
}

export function isMapBannerVisible(): boolean {
  return bannerVisible;
}

export function subscribeMapBannerState(listener: () => void): () => void {
  bannerStateListeners.add(listener);
  return () => bannerStateListeners.delete(listener);
}

export async function showMapBanner(): Promise<void> {
  if (!hasMapBannerSlot()) return;
  bannerWanted = true;
  if (bannerVisible || bannerRequest) return;
  bannerRequest = (async () => {
    try {
      await initializeAdMob();
      if ((!adsAllowed && !(await refreshAdConsent())) || !bannerWanted) return;
      bannerEventHandles = await Promise.all([
        AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          setBannerVisible(true);
          console.info('Harita banner reklamı yüklendi.');
        }),
        AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
          setBannerVisible(false);
          console.error(`Harita banner reklamı yüklenemedi (${error.code}):`, error.message);
        }),
      ]);
      await AdMob.showBanner({
        adId: import.meta.env.DEV ? GOOGLE_TEST_BANNER_ID : BANNER_AD_ID,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.TOP_CENTER,
        margin: 0,
        isTesting: import.meta.env.DEV,
      });
      bannerAttached = true;
    } catch (error) {
      console.error('Harita banner reklamı yüklenemedi:', error);
    } finally {
      bannerRequest = null;
    }
  })();
  await bannerRequest;
}

export async function hideMapBanner(): Promise<void> {
  if (!isNative()) return;
  bannerWanted = false;
  try {
    if (bannerRequest) await bannerRequest;
    if (bannerAttached && !bannerWanted) {
      await AdMob.hideBanner();
      bannerAttached = false;
    }
    await Promise.all(bannerEventHandles.map((handle) => handle.remove()));
    bannerEventHandles = [];
  } catch (error) {
    console.error('Harita banner reklamı kapatılamadı:', error);
  } finally {
    if (!bannerWanted) setBannerVisible(false);
  }
}

async function preloadRewardedAd(): Promise<void> {
  if (!isNative() || !adsAllowed) return;
  if (rewardedAdReady) return;
  if (rewardedLoadPromise) return rewardedLoadPromise;
  rewardedLoadPromise = (async () => {
    try {
      const options: RewardAdOptions = {
        adId: REWARDED_AD_ID,
        isTesting: IS_TESTING,
        immersiveMode: true,
      };
      const ad = await AdMob.prepareRewardVideoAd(options);
      if (!ad?.adUnitId) throw new Error('Rewarded reklam yükleme yanıtı boş.');
      rewardedAdReady = true;
      console.info('Rewarded reklam hazır.', { adUnitId: ad.adUnitId, isTesting: IS_TESTING });
    } catch (error) {
      rewardedAdReady = false;
      saveAdFailure('Ödüllü reklam yüklenemedi', error);
    } finally {
      rewardedLoadPromise = null;
    }
  })();
  return rewardedLoadPromise;
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
    let dismissalTimer: ReturnType<typeof setTimeout> | null = null;
    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    const handles: PluginListenerHandle[] = [];
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      if (dismissalTimer) clearTimeout(dismissalTimer);
      if (showTimeout) clearTimeout(showTimeout);
      if (handles.length > 0) {
        void Promise.all(handles.map((handle) => handle.remove()));
      }
      resolve(value);
    };

    void Promise.all([
      AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
        const earned = Number.isFinite(reward.amount) && reward.amount > 0;
        console.info('Rewarded reklam ödül olayı.', { type: reward.type, amount: reward.amount, earned });
        finish(earned);
      }),
      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        console.info('Rewarded reklam kapatıldı.');
        saveAdFailure('Reklam ödül verilmeden kapatıldı');
        // Mediation callbacks can arrive in a different order; allow a late reward event to win.
        dismissalTimer = setTimeout(() => finish(false), 500);
      }),
      AdMob.addListener(RewardAdPluginEvents.FailedToShow, (error) => {
        saveAdFailure('Ödüllü reklam gösterilemedi', error);
        finish(false);
      }),
      AdMob.addListener(RewardAdPluginEvents.FailedToLoad, (error) => {
        saveAdFailure('Ödüllü reklam gösterim sırasında hazır değildi', error);
        finish(false);
      }),
      AdMob.addListener(RewardAdPluginEvents.Showed, () => console.info('Rewarded reklam gösterildi.')),
    ])
      .then((listeners) => {
        if (settled) {
          void Promise.all(listeners.map((listener) => listener.remove()));
          return;
        }
        handles.push(...listeners);
        showTimeout = setTimeout(() => {
          saveAdFailure('Reklam yanıtı zaman aşımına uğradı');
          finish(false);
        }, 120_000);
        void AdMob.showRewardVideoAd()
          .then((item) => {
            const earned = Number.isFinite(item?.amount) && item.amount > 0;
            console.info('Rewarded reklam çağrısı tamamlandı.', { type: item?.type, amount: item?.amount, earned });
            finish(earned);
          })
          .catch((error) => {
            saveAdFailure('Ödüllü reklam isteği başarısız', error);
            finish(false);
          });
      })
      .catch((error) => {
          saveAdFailure('Reklam olay dinleyicileri kurulamadı', error);
        finish(false);
      });
  });
}

/**
 * Rewarded reklamı gösterir. Ödül yalnızca AdMob "rewarded" event'i geldiğinde
 * verilir ve günlük limite sayılır. Web'de ve limit doluysa false döner.
 */
export async function showRewardedAd(): Promise<boolean> {
  lastAdFailureDetail = '';
  if (!isNative()) { saveAdFailure('Reklamlar yalnızca Android/iOS uygulamasında çalışır'); return false; }
  if (rewardedAdInFlight) {
    saveAdFailure('Başka bir reklam isteği sürüyor');
    return false;
  }
  rewardedAdInFlight = true;
  try {
    if (!canWatchRewardedAd()) {
      saveAdFailure('Günlük reklam hakkı doldu');
      return false;
    }
    try {
      await initializeAdMob();
    } catch (error) {
      console.error('Rewarded reklam ön koşulu başarısız:', error);
      return false;
    }
    if (!adsAllowed && !(await refreshAdConsent())) return false;
    if (!rewardedAdReady) await preloadRewardedAd();
    if (!rewardedAdReady) {
      if (!lastAdFailureDetail) saveAdFailure('Reklam hazır değil');
      return false;
    }
    rewardedAdReady = false;
    const rewarded = await showRewardedAdWithEvents();
    if (rewarded) consumeRewardedAd();
    else if (!lastAdFailureDetail) saveAdFailure('Reklam ödül callback’i vermedi');
    void preloadRewardedAd();
    return rewarded;
  } finally {
    rewardedAdInFlight = false;
  }
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
