import { getRewardedAdsLeftToday } from '../../game/adBudget';
import { loadPlayerSave } from '../../game/playerSave';
import { createAdPolicyEngine, type AdPolicyEngine } from './adPolicyEngine';

let shared: AdPolicyEngine | null = null;
let consentAllowed = false;

export function setSharedAdsConsentAllowed(allowed: boolean): void {
  consentAllowed = allowed;
}

/** App-wide engine. Tests: prefer `createAdPolicyEngine` or `resetSharedAdPolicyEngine`. */
export function getSharedAdPolicyEngine(): AdPolicyEngine {
  if (!shared) {
    shared = createAdPolicyEngine({
      nowMs: () => Date.now(),
      getRewardedAdsLeftToday,
      getCompletedLevelCount: () => loadPlayerSave().completedLevels.length,
      isConsentAllowed: () => consentAllowed,
      isAdsEnabled: () => true,
      isKillSwitch: () => false,
    });
  }
  return shared;
}

export function resetSharedAdPolicyEngine(): void {
  shared = null;
  consentAllowed = false;
}
