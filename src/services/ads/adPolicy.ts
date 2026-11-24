/** Pure C+ ad eligibility decisions — no AdMob / no React. */

export type AdPolicy = {
  initialAdFreeLevels: number;
  interstitialMinLevels: number;
  interstitialMinSeconds: number;
  interstitialSessionCap: number;
  rewardedDailyCap: number;
};

/** Production default = A/B “B Dengeli” (locked C+ A). */
export const DEFAULT_AD_POLICY: AdPolicy = {
  initialAdFreeLevels: 3,
  interstitialMinLevels: 3,
  interstitialMinSeconds: 300,
  interstitialSessionCap: 3,
  rewardedDailyCap: 6,
};

export type AdPolicyContext = {
  adsEnabled: boolean;
  killSwitch: boolean;
  consentAllowsRequest: boolean;
  isGameplayActive: boolean;
  isNaturalTransition: boolean;
  completedLevels: number;
  levelsSinceInterstitial: number;
  secondsSinceLastFullscreenAd: number;
  interstitialsThisSession: number;
  adReady: boolean;
  rewardedAdsLeftToday: number;
};

export type RewardedStartDecision =
  | { allowed: true }
  | { allowed: false; reason: 'daily_cap' | 'fullscreen_cooldown' | 'ads_blocked'; remainingSeconds: number };

export function canShowInterstitial(ctx: AdPolicyContext, policy: AdPolicy): boolean {
  if (!ctx.adsEnabled || ctx.killSwitch) return false;
  if (!ctx.consentAllowsRequest) return false;
  if (ctx.isGameplayActive) return false;
  if (!ctx.isNaturalTransition) return false;
  if (!ctx.adReady) return false;
  if (ctx.completedLevels <= policy.initialAdFreeLevels) return false;
  if (ctx.levelsSinceInterstitial < policy.interstitialMinLevels) return false;
  if (ctx.secondsSinceLastFullscreenAd < policy.interstitialMinSeconds) return false;
  if (ctx.interstitialsThisSession >= policy.interstitialSessionCap) return false;
  return true;
}

export function canStartRewarded(ctx: AdPolicyContext, policy: AdPolicy): RewardedStartDecision {
  if (!ctx.adsEnabled || ctx.killSwitch || !ctx.consentAllowsRequest) {
    return { allowed: false, reason: 'ads_blocked', remainingSeconds: 0 };
  }
  if (ctx.rewardedAdsLeftToday <= 0) {
    return { allowed: false, reason: 'daily_cap', remainingSeconds: 0 };
  }
  const remaining = Math.max(0, policy.interstitialMinSeconds - ctx.secondsSinceLastFullscreenAd);
  if (remaining > 0) {
    return { allowed: false, reason: 'fullscreen_cooldown', remainingSeconds: remaining };
  }
  return { allowed: true };
}
