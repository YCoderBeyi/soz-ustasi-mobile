import {
  AdMob, BannerAdPluginEvents, BannerAdPosition, BannerAdSize, MaxAdContentRating,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents, type RewardAdOptions,
} from '@capacitor-community/admob';
import { Capacitor, type PluginListenerHandle } from '@capacitor/core';
import {
  canWatchRewardedAd,
  consumeRewardedAd,
  getRewardedAdsLeftToday as getBudgetLeft,
  subscribeAdBudget,
} from '../game/adBudget';
import { fullscreenCooldownMessage } from './ads/cooldownCopy';
import { getSharedAdPolicyEngine, setSharedAdsConsentAllowed } from './ads/sharedAdPolicyEngine';

// Ödüllü reklam birimi ID'si. AdMob'da "Söz Ustası - Kelime Oyunu" (com.sozustasi.game, uygulama kimliği ~5793638649) uygulamasına aittir;
// strings.xml içindeki admob_app_id ile aynı AdMob uygulamasından olmalıdır (audit:release denetler).
const REWARDED_AD_ID = 'ca-app-pub-2784764635828379/5235235447';
// Create a separate Banner unit in AdMob and provide its ID at build time.
// The rewarded unit above must never be reused for banner requests.
const BANNER_AD_ID = import.meta.env.VITE_ADMOB_BANNER_ID ?? '';
const GOOGLE_TEST_BANNER_ID = 'ca-app-pub-3940256099942544/9214589741';
const INTERSTITIAL_AD_ID = import.meta.env.VITE_ADMOB_INTERSTITIAL_ID ?? '';
const GOOGLE_TEST_INTERSTITIAL_ID = 'ca-app-pub-3940256099942544/1033173712';

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
let interstitialReady = false;
let interstitialLoadPromise: Promise<void> | null = null;
let rewardedAdInFlight = false;
export type BannerOwner = 'map' | 'level-start';

let bannerSlotReserved = false;
let bannerAttached = false;
let bannerWanted = false;
let bannerOwner: BannerOwner | null = null;
let bannerRequest: Promise<void> | null = null;
let bannerEventHandles: PluginListenerHandle[] = [];
const bannerStateListeners = new Set<() => void>();

function setBannerSlotReserved(reserved: boolean): void {
  if (bannerSlotReserved === reserved) return;
  bannerSlotReserved = reserved;
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
    setSharedAdsConsentAllowed(adsAllowed);
    if (adsAllowed) lastAdFailureDetail = '';
    if (!adsAllowed) saveAdFailure('Reklam izni yok veya tamamlanmadı');
    return adsAllowed;
  } catch (error) {
    adsAllowed = false;
    setSharedAdsConsentAllowed(false);
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
      await preloadInterstitialAd();
    })().catch((error) => {
      console.error('AdMob başlatma hatası:', error);
      initPromise = null;
      throw error;
    });
  }
  return initPromise;
}

/** Shared anchored banner slot for navigation and level briefing screens only. */
export function hasBannerSlot(): boolean {
  return isNative() && (import.meta.env.DEV || Boolean(BANNER_AD_ID));
}

export function isBannerSlotReserved(): boolean {
  return bannerSlotReserved;
}

export function subscribeBannerSlotState(listener: () => void): () => void {
  bannerStateListeners.add(listener);
  return () => bannerStateListeners.delete(listener);
}

function waitForLayoutCommit(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame === 'function') requestAnimationFrame(() => resolve());
    else window.setTimeout(resolve, 0);
  });
}

export async function showTopBanner(owner: BannerOwner): Promise<void> {
  if (!hasBannerSlot()) return;
  bannerOwner = owner;
  bannerWanted = true;
  if (bannerAttached) {
    setBannerSlotReserved(true);
    return;
  }
  if (bannerRequest) return bannerRequest;

  bannerRequest = (async () => {
    try {
      await initializeAdMob();
      if ((!adsAllowed && !(await refreshAdConsent())) || !bannerWanted) return;
      bannerEventHandles = await Promise.all([
        AdMob.addListener(BannerAdPluginEvents.Loaded, () => {
          setBannerSlotReserved(true);
          console.info('Üst banner reklamı yüklendi.');
        }),
        AdMob.addListener(BannerAdPluginEvents.FailedToLoad, (error) => {
          setBannerSlotReserved(false);
          console.error(`Üst banner reklamı yüklenemedi (${error.code}):`, error.message);
        }),
      ]);
      // Reserve the layout before the native view can appear, preventing content from jumping under it.
      setBannerSlotReserved(true);
      await waitForLayoutCommit();
      if (!bannerWanted) {
        setBannerSlotReserved(false);
        return;
      }
      await AdMob.showBanner({
        adId: import.meta.env.DEV ? GOOGLE_TEST_BANNER_ID : BANNER_AD_ID,
        adSize: BannerAdSize.ADAPTIVE_BANNER,
        position: BannerAdPosition.TOP_CENTER,
        margin: 0,
        isTesting: import.meta.env.DEV,
      });
      bannerAttached = true;
    } catch (error) {
      setBannerSlotReserved(false);
      console.error('Üst banner reklamı yüklenemedi:', error);
    } finally {
      if (!bannerAttached && !bannerWanted) setBannerSlotReserved(false);
      bannerRequest = null;
    }
  })();
  await bannerRequest;
}

export async function hideTopBanner(): Promise<void> {
  if (!isNative()) return;
  bannerOwner = null;
  bannerWanted = false;
  try {
    if (bannerRequest) await bannerRequest;
    // A different screen may have claimed the same native banner while this cleanup awaited.
    if (bannerOwner === null && bannerAttached) {
      await AdMob.hideBanner();
      bannerAttached = false;
      const oldHandles = bannerEventHandles;
      bannerEventHandles = [];
      await Promise.all(oldHandles.map((handle) => handle.remove()));
      if (bannerOwner !== null) {
        // A navigation screen reclaimed the slot while the native hide was in flight.
        await showTopBanner(bannerOwner);
        return;
      }
    }
    if (bannerOwner === null) {
      await Promise.all(bannerEventHandles.map((handle) => handle.remove()));
      bannerEventHandles = [];
      setBannerSlotReserved(false);
    }
  } catch (error) {
    console.error('Üst banner reklamı kapatılamadı:', error);
  } finally {
    if (bannerOwner === null) setBannerSlotReserved(false);
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
    let wasShown = false;
    let policyMarked = false;
    let dismissalTimer: ReturnType<typeof setTimeout> | null = null;
    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    const handles: PluginListenerHandle[] = [];
    const markPresented = () => {
      if (policyMarked) return;
      policyMarked = true;
      getSharedAdPolicyEngine().markFullscreenPresented('rewarded');
    };
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      if (dismissalTimer) clearTimeout(dismissalTimer);
      if (showTimeout) clearTimeout(showTimeout);
      // Reward/show success without Showed event must still start shared cooldown.
      if (value || wasShown) markPresented();
      if (handles.length > 0) {
        void Promise.all(handles.map((handle) => handle.remove()));
      }
      resolve(value);
    };

    void Promise.all([
      AdMob.addListener(RewardAdPluginEvents.Rewarded, (reward) => {
        wasShown = true;
        markPresented();
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
      AdMob.addListener(RewardAdPluginEvents.Showed, () => {
        wasShown = true;
        markPresented();
        console.info('Rewarded reklam gösterildi.');
      }),
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
            if (earned) wasShown = true;
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
    const rewardedGate = getSharedAdPolicyEngine().canStartRewarded();
    if (!rewardedGate.allowed) {
      if (rewardedGate.reason === 'fullscreen_cooldown') {
        saveAdFailure(fullscreenCooldownMessage(rewardedGate.remainingSeconds));
      } else {
        saveAdFailure('Ödüllü reklam şu an açılamaz');
      }
      return false;
    }
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

function hasInterstitialUnit(): boolean {
  return import.meta.env.DEV || Boolean(INTERSTITIAL_AD_ID);
}

async function preloadInterstitialAd(): Promise<void> {
  if (!isNative() || !adsAllowed || !hasInterstitialUnit() || interstitialReady) return;
  if (interstitialLoadPromise) return interstitialLoadPromise;
  interstitialLoadPromise = (async () => {
    try {
      const ad = await AdMob.prepareInterstitial({
        adId: import.meta.env.DEV ? GOOGLE_TEST_INTERSTITIAL_ID : INTERSTITIAL_AD_ID,
        isTesting: IS_TESTING,
        immersiveMode: true,
      });
      if (!ad?.adUnitId) throw new Error('Interstitial yükleme yanıtı boş.');
      interstitialReady = true;
      console.info('Interstitial hazır.', { adUnitId: ad.adUnitId, isTesting: IS_TESTING });
    } catch (error) {
      interstitialReady = false;
      saveAdFailure('Geçiş reklamı yüklenemedi', error);
    } finally {
      interstitialLoadPromise = null;
    }
  })();
  return interstitialLoadPromise;
}

async function showInterstitialWithEvents(): Promise<boolean> {
  return new Promise<boolean>((resolve) => {
    let settled = false;
    let wasShown = false;
    let showFailed = false;
    let policyMarked = false;
    let showTimeout: ReturnType<typeof setTimeout> | null = null;
    const handles: PluginListenerHandle[] = [];
    const markPresented = () => {
      if (policyMarked) return;
      policyMarked = true;
      getSharedAdPolicyEngine().markFullscreenPresented('interstitial');
    };
    const finish = (value: boolean) => {
      if (settled) return;
      settled = true;
      if (showTimeout) clearTimeout(showTimeout);
      if (value || wasShown) markPresented();
      void Promise.all(handles.map((handle) => handle.remove()));
      resolve(value);
    };

    void Promise.all([
      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        // Some SDKs omit Showed but still dismiss after a visible impression.
        if (!showFailed) {
          wasShown = true;
          markPresented();
        }
        finish(wasShown);
      }),
      AdMob.addListener(InterstitialAdPluginEvents.FailedToShow, (error) => {
        showFailed = true;
        saveAdFailure('Geçiş reklamı gösterilemedi', error);
        finish(false);
      }),
      AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, (error) => {
        showFailed = true;
        saveAdFailure('Geçiş reklamı hazır değildi', error);
        finish(false);
      }),
      AdMob.addListener(InterstitialAdPluginEvents.Showed, () => {
        wasShown = true;
        markPresented();
        console.info('Interstitial gösterildi.');
      }),
    ]).then((listeners) => {
      if (settled) {
        void Promise.all(listeners.map((listener) => listener.remove()));
        return;
      }
      handles.push(...listeners);
      showTimeout = setTimeout(() => {
        saveAdFailure('Geçiş reklamı yanıtı zaman aşımına uğradı');
        finish(false);
      }, 120_000);
      void AdMob.showInterstitial()
        // Capacitor often resolves show() on dismiss; treat as impression unless FailedToShow.
        .then(() => {
          if (!showFailed) {
            wasShown = true;
            markPresented();
          }
          finish(wasShown);
        })
        .catch((error) => {
          showFailed = true;
          saveAdFailure('Geçiş reklamı isteği başarısız', error);
          finish(false);
        });
    }).catch((error) => {
      saveAdFailure('Geçiş reklamı dinleyicileri kurulamadı', error);
      finish(false);
    });
  });
}

/**
 * C+ natural break: call after seal/reward persistence and before continue CTAs.
 * Never blocks navigation — skips when policy or inventory says no.
 */
export async function attemptLevelBreakInterstitial(): Promise<'shown' | 'skipped'> {
  lastAdFailureDetail = '';
  if (!isNative() || !hasInterstitialUnit()) return 'skipped';
  if (rewardedAdInFlight) return 'skipped';
  rewardedAdInFlight = true;
  try {
    try {
      await initializeAdMob();
    } catch {
      return 'skipped';
    }
    if (!adsAllowed && !(await refreshAdConsent())) return 'skipped';
    if (!interstitialReady) await preloadInterstitialAd();
    const engine = getSharedAdPolicyEngine();
    if (!engine.canShowInterstitial({
      adReady: interstitialReady,
      isGameplayActive: false,
      isNaturalTransition: true,
    })) {
      return 'skipped';
    }
    interstitialReady = false;
    const shown = await showInterstitialWithEvents();
    void preloadInterstitialAd();
    return shown ? 'shown' : 'skipped';
  } finally {
    rewardedAdInFlight = false;
  }
}

/** Call only for first-time level completions so replay does not inflate spacing. */
export function noteLevelCompletedForAds(options?: { alreadyCompleted?: boolean }): void {
  if (options?.alreadyCompleted) return;
  getSharedAdPolicyEngine().noteLevelCompleted();
}

export function getFullscreenCooldownRemainingSeconds(): number {
  return getSharedAdPolicyEngine().getCooldownRemainingSeconds();
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
