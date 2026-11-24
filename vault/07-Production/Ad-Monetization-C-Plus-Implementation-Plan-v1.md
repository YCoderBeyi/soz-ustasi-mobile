# C+ Monetization Implementation Plan v1

> **For agentic workers:** Steps use TDD (RED → GREEN → REFACTOR). Checkbox each step.

**Goal:** AdPolicyEngine merkezi politika; mağaza RI→standart Rewarded; sonra interstitial + 300sn cooldown.  
**Architecture:** [[Ad-Monetization-C-Plus-Architecture-v1]]  
**İlgili:** [[Ads-Readiness-v1]], [[Release-Manifest-v1]], [[Data-Safety-v1]]  
**Status:** Spec kilitli · **P0 kod tamam** (2026-11-25) · cihaz QA + Firebase P1 sırada

## File map

| Dosya | Sorumluluk |
| --- | --- |
| `src/services/ads/adPolicy.ts` | Saf politika kararları (test edilebilir) |
| `src/services/ads/adPolicyEngine.ts` | Durum + cooldown + kota + show orkestrasyonu |
| `src/services/ads/adPolicy.test.ts` | Unit testler |
| `src/services/admob.ts` | Düşük seviye AdMob SDK (banner/rewarded/interstitial load-show) |
| `src/screens/ShopScreen.tsx` | RI → `showRewardedAd` / engine |
| `src/store/contexts/SessionContext.tsx` | İpucu/2. şans → engine |
| `src/components/RewardModal.tsx` (+ session) | CTA-öncesi interstitial gate |
| `src/game/adBudget.ts` | Günlük 6 (Istanbul reset P1) |

## Task 1: AdPolicyEngine (saf politika)

1. [x] RED: `canShowInterstitial` — ilk 3 bölüm false
2. [x] GREEN: minimal policy
3. [x] RED: min 3 bölüm + 300sn + session cap birlikte AND
4. [x] GREEN
5. [x] RED: gameplay / killSwitch / !consent / !ready → false
6. [x] GREEN
7. [x] RED: `canStartRewarded` — daily cap + ortak cooldown; teklif UI’ye izin, start’a engel
8. [x] GREEN
9. [x] RED: fullscreen dismiss → cooldown başlar (rewarded veya interstitial) — engine state katmanı
10. [x] GREEN (`adPolicyEngine` + admob wire)

## Task 2: Mağaza RI → Rewarded

1. [x] RED: ShopScreen testleri `showRewardedAd` bekler (RI mock kaldır)
2. [x] GREEN: ShopScreen migrasyonu; ekonomi 30 altın aynı
3. [x] RI preload/API kaldırıldı (C+ karar a)
4. [x] admob testleri RI’siz; Showed’da `markFullscreenPresented`; replay spacing guard; cooldown UI

## Task 3: Interstitial + CTA gate

1. [x] post-seal: `attemptLevelBreakInterstitial` → sonra `setModal('reward')`
2. [x] SessionContext entegrasyonu + fail-safe skip
3. [x] Production AdMob interstitial unit ID: `…/3292115308` (`VITE_ADMOB_INTERSTITIAL_ID`) — cihaz QA bekliyor

## Task 4: P1 (sonra)

Remote Config, A/B 001, `ad_*` events, adaptive banner height, Europe/Istanbul reset.

## Acceptance (P0)

| Test | Beklenen |
| --- | --- |
| Mağaza reddi | Satın alma devam |
| Rewarded başarı | Ödül 1× |
| Load fail | Kota düşmez |
| Art arda | 300sn |
| İlk 3 bölüm | Interstitial yok |
| Gameplay | Zorunlu reklam yok |
| Offline | Navigasyon çalışır |

Ödül mantığı **Dismissed’a değil Rewarded callback’e** bağlı kalır.
