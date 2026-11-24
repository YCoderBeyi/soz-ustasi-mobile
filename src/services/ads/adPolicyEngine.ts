import {
  DEFAULT_AD_POLICY,
  canShowInterstitial,
  canStartRewarded,
  type AdPolicy,
  type AdPolicyContext,
  type RewardedStartDecision,
} from './adPolicy';

const STORAGE_KEY = 'soz-ad-policy-v1';

const policyListeners = new Set<() => void>();

/** UI hooks (cooldown remaining) subscribe here. */
export function subscribeAdFullscreenPolicy(listener: () => void): () => void {
  policyListeners.add(listener);
  return () => { policyListeners.delete(listener); };
}

function notifyAdFullscreenPolicy(): void {
  for (const listener of policyListeners) listener();
}

type PersistedAdPolicyState = {
  lastFullscreenClosedAtMs: number;
  levelsSinceInterstitial: number;
};

export type AdPolicyEngineDeps = {
  nowMs: () => number;
  getRewardedAdsLeftToday: () => number;
  getCompletedLevelCount: () => number;
  isConsentAllowed: () => boolean;
  isAdsEnabled: () => boolean;
  isKillSwitch: () => boolean;
  policy?: AdPolicy;
};

export type InterstitialAttemptFlags = {
  adReady: boolean;
  isGameplayActive: boolean;
  isNaturalTransition: boolean;
};

function readPersisted(): PersistedAdPolicyState {
  try {
    const raw = window.localStorage?.getItem(STORAGE_KEY);
    if (!raw) return { lastFullscreenClosedAtMs: 0, levelsSinceInterstitial: 0 };
    const parsed = JSON.parse(raw) as Partial<PersistedAdPolicyState>;
    return {
      lastFullscreenClosedAtMs: typeof parsed.lastFullscreenClosedAtMs === 'number' ? parsed.lastFullscreenClosedAtMs : 0,
      levelsSinceInterstitial: typeof parsed.levelsSinceInterstitial === 'number'
        ? Math.max(0, Math.floor(parsed.levelsSinceInterstitial))
        : 0,
    };
  } catch {
    return { lastFullscreenClosedAtMs: 0, levelsSinceInterstitial: 0 };
  }
}

function writePersisted(state: PersistedAdPolicyState): void {
  try {
    window.localStorage?.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / private mode */
  }
  notifyAdFullscreenPolicy();
}

export function createAdPolicyEngine(deps: AdPolicyEngineDeps) {
  const policy = deps.policy ?? DEFAULT_AD_POLICY;
  let persisted = readPersisted();
  let interstitialsThisSession = 0;

  const secondsSinceLastFullscreen = () => {
    if (!persisted.lastFullscreenClosedAtMs) return Number.POSITIVE_INFINITY;
    return Math.max(0, (deps.nowMs() - persisted.lastFullscreenClosedAtMs) / 1000);
  };

  const buildBaseContext = (): Omit<AdPolicyContext, 'adReady' | 'isGameplayActive' | 'isNaturalTransition'> => ({
    adsEnabled: deps.isAdsEnabled(),
    killSwitch: deps.isKillSwitch(),
    consentAllowsRequest: deps.isConsentAllowed(),
    completedLevels: deps.getCompletedLevelCount(),
    levelsSinceInterstitial: persisted.levelsSinceInterstitial,
    secondsSinceLastFullscreenAd: secondsSinceLastFullscreen(),
    interstitialsThisSession,
    rewardedAdsLeftToday: deps.getRewardedAdsLeftToday(),
  });

  return {
    canStartRewarded(): RewardedStartDecision {
      return canStartRewarded({
        ...buildBaseContext(),
        adReady: true,
        isGameplayActive: false,
        isNaturalTransition: true,
      }, policy);
    },

    canShowInterstitial(flags: InterstitialAttemptFlags): boolean {
      return canShowInterstitial({
        ...buildBaseContext(),
        ...flags,
      }, policy);
    },

    noteLevelCompleted(): void {
      persisted = {
        ...persisted,
        levelsSinceInterstitial: persisted.levelsSinceInterstitial + 1,
      };
      writePersisted(persisted);
    },

    recordFullscreenClosed(_kind: 'rewarded' | 'interstitial'): void {
      persisted = {
        ...persisted,
        lastFullscreenClosedAtMs: deps.nowMs(),
      };
      writePersisted(persisted);
    },

    recordInterstitialShown(): void {
      interstitialsThisSession += 1;
      persisted = {
        ...persisted,
        levelsSinceInterstitial: 0,
      };
      writePersisted(persisted);
    },

    /** Call on SDK Showed — survives promise-first finish races. */
    markFullscreenPresented(kind: 'rewarded' | 'interstitial'): void {
      if (kind === 'interstitial') {
        interstitialsThisSession += 1;
        persisted = {
          ...persisted,
          levelsSinceInterstitial: 0,
          lastFullscreenClosedAtMs: deps.nowMs(),
        };
      } else {
        persisted = {
          ...persisted,
          lastFullscreenClosedAtMs: deps.nowMs(),
        };
      }
      writePersisted(persisted);
    },

    getCooldownRemainingSeconds(): number {
      return Math.max(0, Math.ceil(policy.interstitialMinSeconds - secondsSinceLastFullscreen()));
    },
  };
}

export type AdPolicyEngine = ReturnType<typeof createAdPolicyEngine>;
