# Söz Ustası — Reklam Geliri ve Oyuncu Tutundurma Mimarisi (C+) v1.0

Tarih: 2026-11-24 · Gap senkron: 2026-11-25  
Durum: Strateji onaylı (C+); **P0 kod uygulandı** · cihaz/AdMob QA ve Firebase P1 bekliyor  
İlgili: [[Ads-Readiness-v1]], [[Ad-Monetization-C-Plus-Implementation-Plan-v1]], [[Psychology-Screen-Checklist]], [[Data-Safety-v1]], [[Release-Manifest-v1]], [[UA-App-Campaign-Draft-v1]]

## Hedef

Premium kelime bulmaca deneyimini bozmadan günlük reklam geliri ve LTV artırmak. Sabit agresif frekans yerine oyuncu aşaması + ekran + önceki reklam deneyimi birlikte değerlendirilir.

## Nihai karar (özet)

| Yer | Reklam |
| --- | --- |
| Harf tahtası / çark / aktif bulmaca | Yok |
| Mühür animasyonu / mühür deneyimi | Yok |
| Sonuç ödülünü alma anı | Yok |
| Harita + seviye başlangıç (lobi) | Banner (kontrollü slot) |
| Doğal bölüm arası (devam CTA açılmadan önce) | Geçiş (frequency cap) |
| İpucu / altın / ikinci şans | Ödüllü (opt-in) |

**Mühür ekranına banner yok. Oyun tahtasına gömülü reklam yok.**

**Karar durumu:** C+ strateji + üst banner + geçiş A (A/B B Dengeli default) + ödüllü V1 + mağaza standart Rewarded kilitli. Kod P0: AdPolicyEngine, interstitial `…/3292115308`, mühür→CTA-öncesi gate, 300 sn cooldown + UI, RI kaldırıldı. Vault insan incelemesi ve cihaz/AdMob QA ayrı; birim test yeşili teknik QA PASS değildir.

## Banner

- **Konum kararı (2026-11-24): üstte kalır** (`TOP_CENTER` / mevcut yapı). Alt konum ileri A/B konusu; şu an UI taşıma yok.
- Yer: Yalnızca harita / lobi (LevelStart dahil seviye seçim akışı); oyun tahtası ve mühürde yok, gizlenir.
- Format: Anchored adaptive banner.
- Dört şart (zorunlu):
  1. Banner yalnızca harita/lobi ekranında.
  2. Ayrı ve yeterli üst boşluk ayrılır.
  3. Navigasyon veya oyun düğmeleriyle çakışmaz.
  4. Yüklenirken arayüz kaymaz; tahta/mühürde reklam yok.
- Teknik denetim şartları (2026-11-24 tasarım onayı):
  1. **Safe Area:** Çentik / sistem çubuklarında taşma yok.
  2. **Dinamik yükseklik:** Adaptive banner boyutuna göre slot; rastgele sabit px yok.
  3. **Fail-safe:** Yüklenmezse oyuncu beklemez; seviye geçişi etkilenmez.
- Tasarım onayı: üst banner. Vault dosyasının tam insan incelemesi ve cihaz/AdMob QA ayrı; bu onay teknik QA PASS değildir.

## Geçiş (interstitial) — kilitli başlangıç (2026-11-24)

Production default = A/B **B Dengeli** kolu (aşağıdaki sayılar). Bölüm + zaman + oturum **birlikte** sağlanmalı; tek koşul yetmez.

| Parametre | Nihai karar |
| --- | --- |
| İlk reklamsız tamamlanan bölüm | 3 |
| Minimum bölüm aralığı | 3 tamamlanan bölüm |
| Minimum zaman aralığı | 300 sn (5 dk) — tüm tam ekran reklamlar ortak |
| Oturum üst sınırı | ≤ 3 geçiş reklamı |
| Hazır değilse | Atla; oyuncuyu bekletme |
| Gameplay / mühür / ödül kaydı anı | Yasak |
| İlk açılış / arka plandan ani dönüş | Yasak |

### Tetik zinciri (Google uyumlu — accidental click azaltma)

“Haritaya Dön / Sonraki Bölüm”e basıldıktan **sonra** ani interstitial değil; devam düğmeleri henüz etkin değilken doğal bölüm arasında:

1. Bölüm tamamlanır.
2. Kazanılan ödül güvenli kaydedilir; mühür ve kazanım animasyonları biter.
3. Devam CTA’ları henüz etkin değilken `canShowInterstitial` kontrol edilir.
4. Koşullar uygun ve reklam hazırsa geçiş reklamı gösterilir.
5. Reklam kapanınca veya gösterilemezse sonuç / devam akışı açılır (CTA etkinleşir).

### Ortak tam ekran cooldown

Ödüllü (rewarded / rewarded interstitial) gösterimi de aynı 300 sn penceresini başlatır: hemen ardından geçiş yok; geçişten hemen sonra yeni ödüllü teklif yok. Kazanılmış ödüller ve reklamsız oyun yolları bozulmaz.

Bu sayılar Google zorunlu limiti değil; C+ ürün + A/B başlangıç kararıdır.

## Ödüllü — kilitli V1 (2026-11-24)

| Parametre | Nihai karar |
| --- | --- |
| Günlük limit | 6 başarılı ödüllü gösterim (ortak bütçe) |
| Format (V1) | **Yalnız** Standart Rewarded Ad (RI yok; mağaza dahil) |
| Onay | Her gösterimde açık opt-in |
| Ödüller | İpucu · altın · ikinci şans |
| Ortak fullscreen cooldown | 300 sn (interstitial ile paylaşılır) |
| Sıfırlanma | Her gün 00:00 Europe/Istanbul |
| Ödül teslimi | Reward callback sonrası, işlem başına bir kez |
| Yüklenemez / erken çıkış | Hak düşmez; oyun devam |
| Reddetme | Ceza yok; reklamsız yollar açık |

Teklif metinleri: «Bir ödüllü reklam izle, 1 ipucu kazan.» · «Ödüllü reklam izleyerek ek altın kazan.» (miktar ekonomi doğrulanınca) · «Bir ödüllü reklam izle, 1 ek deneme hakkı kazan.»

Cooldown UI: süre dolmadan ödüllü isterse kalan süre gösterilir; reklamsız ipucu/altın/oyun kapanmaz; tam ekran otomatik sıraya alınmaz.

Ödül güvenliği: callback yoksa ödül yok; transaction id ile tekilleştirme; SSV imkân varsa; yoksa yerel idempotency (SSV eşdeğeri değil). Günlük limit mümkünse güvenilir zaman + kalıcı kayıt.

## Remote Config V1 (hedef)

| Anahtar | Varsayılan |
| --- | --- |
| `ads_enabled` | true |
| `banner_map_enabled` | true |
| `interstitial_enabled` | true |
| `interstitial_min_levels` | 3 |
| `interstitial_min_seconds` | 300 |
| `interstitial_session_cap` | 3 |
| `initial_ad_free_levels` | 3 |
| `rewarded_daily_cap` | 6 |
| `ads_kill_switch` | false |

Güvenli yerel varsayılanlar zorunlu; kill switch anlık garantili acil stop değildir (ağ bağımlı).

**Not:** Projede henüz Firebase/Remote Config yok — net-new altyapı.

## A/B 001 — yalnızca geçiş sıklığı

| Kol | Min bölüm | Min süre | Oturum cap | Rol |
| --- | --- | --- | --- | --- |
| A Koruyucu | 5 | 8 dk | 2 | Deney |
| B Dengeli | 3 | 5 dk | 3 | **Production default (kilitli A)** |
| C Kontrollü yoğun | 2 | 5 dk | 3 | Deney |

Banner + ödüllü kurallar + tetik zinciri sabit. ≥14 gün; D7 ve örneklem yeterliliği olmadan kazanan yok. Kazanan: gelir ↑ ve D1/D7/crash kabul edilemez düşüş yok; belirsizse daha az müdahaleci kol.

## Merkezi AdPolicyEngine

Tek karar noktası: oyun olayları → policy (RC + durum + zaman + sıklık + rıza) → Banner / Interstitial / Rewarded. Ekranlar bağımsız rastgele tetiklemez.

## Analytics olay sözleşmesi

`level_start`, `level_complete`, `ad_eligible`, `ad_blocked`, `ad_impression`, `ad_dismissed`, `reward_offer_shown`, `reward_opt_in`, `reward_granted`, `ad_failed`.

ARPDAU = günlük gelir / DAU; LTV ≠ tek günlük ARPDAU.

## Release Gate V1

1. AdMob politika (beklenmedik geçiş, accidental click, yanıltıcı ödül yok)
2. Oynanış QA (mühür, tahta, sonuç, geri navigasyon)
3. Frekans QA (ilk bölüm, süre, bölüm, oturum)
4. Ödül QA (çift/eksik/başarısız)
5. Gizlilik (UMP, test cihaz, data safety)
6. Firebase deney QA (varyant, olay, kill switch, defaults)

Kanıtsız PASS yok.

## Uygulama sırası

1. Mevcut AdMob envanteri + gap analizi
2. AdPolicyEngine (yeni yerleşimden önce)
3. Remote Config + güvenli defaults
4. Ödül + analytics doğrulama
5. Test cihaz + kontrollü yayın
6. A/B 001

## Gap analizi — mevcut kod vs C+ (senkron 2026-11-25)

Kaynak: `admob.ts`, `ads/adPolicy.ts`, `ads/adPolicyEngine.ts`, `useTopBanner`, `useFullscreenCooldown`, `SessionContext` (seal gate), `ShopScreen` / Hint / SecondChance. Birim test ads yeşil; `audit:release` OK (APK uyarısı). Firebase yok.

### Uyumlu (P0 kod)

| Madde | Kod gerçeği |
| --- | --- |
| Üst banner Map + LevelStart | `App.tsx` owner; oyunda hide |
| Standart rewarded (ipucu / 2. şans / mağaza) | Hepsi `showRewardedAd`; **RI yok** |
| Günlük 6 + opt-in + callback ödül | `adBudget` + event; erken kapatmada hak düşmez |
| AdPolicyEngine | `canShowInterstitial` / `canStartRewarded` + kalıcı `soz-ad-policy-v1` |
| Interstitial birimi | `VITE_ADMOB_INTERSTITIAL_ID` = `…/3292115308` |
| CTA-öncesi gate | Mühür → `attemptLevelBreakInterstitial` → `RewardModal` |
| Ortak 300 sn cooldown | `markFullscreenPresented` (Showed / ödül / Dismissed yolları) |
| Cooldown UI | Shop / İpucu / İkinci şans + `subscribeAdFullscreenPolicy` |
| Replay spacing | `noteLevelCompletedForAds({ alreadyCompleted })` |
| UMP / fail-safe | Consent yoksa request yok; skip’te bekletme yok |

### Kısmen / cihaz QA

| Madde | Not |
| --- | --- |
| Banner slot yüksekliği | LevelStart ~76px / Map ~58px sabit offset; adaptive ölçüm yok |
| Banner margin 0 + safe area | UI padding var; native taşma cihaz QA |
| 1200 ms mühür bekleme | Skip’te de sabit; kısaltma ertelendi |
| Shop doğrudan `showRewardedAd` | Show anında engine gate var; C+ “yalnız facade” saf değil |

### Eksik (P1+)

| Öncelik | Eksik |
| --- | --- |
| P1 | Firebase Remote Config + kill switch + güvenli defaults |
| P1 | A/B 001 (koruyucu / dengeli / yoğun) |
| P1 | Analytics `ad_*` / `reward_*` sözleşmesi |
| P1 | Cihaz + AdMob fill/event smoke (Release Gate) |
| P2 | Cooldown/spacing → PlayerSave SSOT (şimdi ayrı LS key) |
| P2 | `alreadyCompleted` React ∪ disk |
| P2 | Transaction-id + SSV |
| P2 | Europe/Istanbul günlük reset (şimdi cihaz yerel) |
| P2 | Cold start / background dönüş interstitial yasağı (state) |

### Politika kararları (kilitli)

1. **RI:** Kaldırıldı (karar a). Mağaza/ipucu/ikinci şans = standart Rewarded.
2. **Banner:** Üstte; alt A/B sonra.
3. **Ödül modal:** CTA, interstitial denemesinden sonra açılır (kodda).

### Sıradaki

`Cihaz smoke → (isteğe) AAB → Analytics/RC → Release QA`

- Ana dal / canlı: testler + Release Gate + ayrı onay.
- Plan checklist: [[Ad-Monetization-C-Plus-Implementation-Plan-v1]]

## Değişmez ürün kuralları

- Aktif kelime çözme ve mühür deneyimine zorunlu reklam girmez.
- Gelir için frekans değiştirmeden önce D1/D7 + gelir birlikte ölçülür.
- Zorunlu reklam / yapay kıtlık dili yok (Post-Launch Master TODO ile uyumlu).
