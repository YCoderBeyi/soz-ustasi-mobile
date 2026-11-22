# Level Audit v1

## Kapsam

2026-06-05 düzeltme turunda 30 level, 8 tema, tema görselleri, harf havuzları, ana/gizli kelime üretilebilirliği ve içerik kalite kuralları kontrol edildi.

## Düzeltilenler

- Level 6 gizli kelime `İDE` yerine daha doğal `DİK` kullanıldı.
- Level 8 ana kelime `HALİ` yerine `HAL` yapıldı; gizli kelime `İLAH` olarak değiştirildi.
- Level 9 harf havuzuna `U` eklendi ve hatalı `RÜH` kelimesi `RUH` olarak düzeltildi.
- Level 9 gizli kelime `MÜR` yerine `RUM` olarak değiştirildi.
- Level 12 zayıf `USTASI / US` seti kaldırıldı.
- Level 12 Nemrut temasına daha uygun `TARİH / HARİTA / HATA / ARİ` setine taşındı.
- Level sayısı 12'den 30'a çıkarıldı.
- Yeni level seti Eski İstanbul, Kapadokya, Ege, Anadolu Sonbaharı, Osmanlı Kütüphanesi, Selçuklu Avlusu, Nemrut ve Karadeniz temalarına yayıldı.
- Level 13-30 arası her level için ana kelime, gizli kelime, ödül ve mühür id tanımı eklendi.
- Audit scripti bilinen geçersiz kelime, zayıf ana kelime, kısa/nadir kelime ve ortalama kelime uzunluğu risklerini yakalayacak şekilde sertleştirildi.

## Temiz Geçen Kontroller

- Level ID sıralaması ardışık.
- Tüm level themeId değerleri mevcut tema listesine bağlı.
- Tüm tema background dosyaları mevcut.
- Harf sayıları 3-6 aralığında.
- Her levelde en az 2 ana kelime var.
- Ana/gizli kelimelerde normalize çakışması yok.
- Tüm ana/gizli kelimeler mevcut harf havuzlarından üretilebilir.
- Bilinen geçersiz/problemli kelime kalmadı.
- İçerik kalite uyarısı kalmadı.

## Doğrulama

- `npm run audit:levels`: geçti, 30 level, 0 warning.
- `npm run lint`: geçti.
- `npm run build`: geçti.

## Karar

Level datası MVP/prototip APK için içerik-audit açısından hazır. Mağaza yayını öncesinde yine de TDK/argo/uygunsuz kelime onayı ve gerçek oyuncu zorluk testi yapılmalı.

---

# Level Audit v2 — Kapsamlı Düzeltme Turu (Phase 1-3-5)

Tarih: 2026-06-06
Kapsam: 45 level, 8 tema, harf havuzu, kelime tekrarları, coin progresyonu.

## Phase 1 — Harf Havuzu Düzeltmeleri (5 level)

Harf havuzlarında yanlış normalize edilmiş harfler (I/İ, Ü/U, Ğ/G, Ş/S, Ç/C) düzeltildi:

| Level | Sorun | Çözüm |
|-------|-------|-------|
| L16 (PİL→ALP) | Havuzda İ yok, PİL üretilemiyor | Kelime ALP olarak değişti, havuz düzenlendi |
| L32 (UZAR→ZAR) | Havuz gereksiz U içeriyor | Kelime ZAR, havuz temizlendi |
| L33 (GER→EĞ) | Havuzda Ğ yok | Kelime EĞ, havuzda harf düzeltildi |
| L36 | Havuzda S yok | Havuza S eklendi |
| L45 | Havuzda C yok | Havuza C eklendi |

## Phase 2 — Fisher-Yates Shuffle

`src/game/shuffle.ts`: biased `sort(() => Math.random() - 0.5)` → Fisher-Yates algoritması (kriptografik olmayan, düzgün dağılımlı). Tüm harf karıştırma işlemleri artık deterministic bias içermiyor.

## Phase 3 — Kelime Tekrarları + Arkaikler (18 değişiklik)

15+ kelime yenilendi:
- **Tekrarlar temizlendi**: ELMA→KEM (L10), LAY→YAL (L13), DALI→VİDA (L18), ZEYT→TEN (L19), TAHA→HASTA (L22), HATA→ATA (L22), İTA→AİT (L23), DİN→AD (L24), EL→BU (L25), BULU→BUL (L29), PATİ→AKİT (L31), KİTAP→PATİK (L34), ALAN→YON (L37), SARA→RAST (L38), TAL→ALT (L39), ELMA→İVME (L40), KAL→OL (L41), ARI→SAR (L42), AR→ASI (L42), NAM→NAZ (L44), SEN→EN (L45)
- **Arkaikler korundu**: TULU, RUM, AHİ — alternatif havuz-uyumlu kelime bulunamadığı için olduğu gibi bırakıldı
- **Yasaklı kelime filtresi** 26 desene genişletildi

## Phase 5 — Coin Progresyonu Düzeltmesi

4 plateau kaldırıldı (öncesi → sonrası):

| Level | Eski | Yeni |
|-------|------|------|
| L3 | 30 | 32 |
| L5 | 35 | 36 |
| L7 | 40 | 42 |
| L8 | 40 | 44 |

## Audit Scripti (scripts/audit-full.mjs)

12 kategori, 45 level, otomatik doğrulama:
1. Harf havuzu (harf sayıları dahil)
2. Seviyeler arası tekrar
3. Level içinde çakışma
4. Hikaye string kesme riski
5. Hikaye-kelime tutarlılığı
6. Tema tutarlılığı
7. Hikaye varlığı
8. Ödül kontrol
9. Politika taraması (yasaklı kelime)
10. Geçersiz karakter taraması
11. Ödül progresyonu

**Sonuç: 0 hata, 10 uyarı (önceden 22). Yayınlanabilir.**

Kalan 10 uyarının tamamı normalize artefaktı (ARI/ARİ, ASİL/ASIL, AS/AŞ) veya ortak kelime tekrarları (AL×3, KALE×2, DİL×2, DERE×2, KAP×2, BUL×2) — yayına engel değil, düşük öncelikli.

---

# Level Design Review v1 -- Kıdemli Oyun Tasarımcısı Denetimi

Tarih: 2026-06-08
Kapsam: 45 level, 168 ana kelime, zorluk eğrisi, ödül ekonomisi, gizli kelime dengesi.

## Bulgular

### Kritik: Zorluk Eğrisi Düzdü
- Eski sistemde tüm kelimeler difficulty 1 veya 2'ydi. Oyuncuya artan meydan okuma hissi yoktu.
- max kelime uzunluğu 6 harf, ileri level'larda da aynı.
- Harf havuzu L1-45 arası 4-6 arası, genişleme yok.

### Düzeltme: Sawtooth Zorluk Eğrisi

Yeni algoritma (may-2026):
- `difficulty = lengthBase + levelProgress + sawtoothAdjust + wordVariety + typeAdj`
- `DifficultyLevel` tipi `src/types.ts`: 1 | 2 | 3 | 4 | 5
- **lengthBase**: 3 harf = 1.0, 4 harf = 1.5, 5 harf = 2.0, 6 harf = 2.5
- **levelProgress**: levelId / 15 (her 5 level'da +0.33)
- **sawtoothAdjust**: periyot=5, pozisyon 2-3'te +0.2, pozisyon 4'te -0.2
- **wordVariety**: alfabe çeşitliliği × 1.5
- **typeAdj**: anagram +0.3

### Dağılım (168 kelime)
| Zorluk | Adet | Yüzde |
|--------|------|-------|
| 1 | 6 | %3.6 |
| 2 | 48 | %28.6 |
| 3 | 60 | %35.7 |
| 4 | 48 | %28.6 |
| 5 | 6 | %3.6 |

### Progresyon (5'li grup ortalamaları)
| Level | øZorluk | Maks Zorluk |
|-------|---------|-------------|
| 1-5 | 1.63 | 2 |
| 6-10 | 2.15 | 3 |
| 11-15 | 2.40 | 3 |
| 16-20 | 2.47 | 3 |
| 21-25 | 3.00 | 4 |
| 26-30 | 3.40 | 4 |
| 31-35 | 3.60 | 5 |
| 36-40 | 3.62 | 5 |
| 41-45 | 4.15 | 5 |

### Düzeltme: Gizli Kelime Ödülleri
- Eski: 3-4 coin (keşif hissi zayıf)
- Yeni: 5-15 coin (level ilerledikçe artar)
- +17 yeni gizli kelime eklendi (toplam 43→60)
- Yeni hidden word'ler anagram/wordsearch tiplerine eklendi (crossword düzeni bozulmaz)

### Düzeltme: Ödül Formülü
- Eski: sabit artış, plateau sorunu (L1:20→L45:135)
- Yeni: `baseCoin = 15 + levelId×1.8 + avgDiff×5` — zorlukla ölçeklenir
- hiddenWordBonus: tüm gizli ödüllerin toplamı / 5

### Düzeltme: Harf Havuzu
- Max 6→7 harf (Level 45: SEVİNÇ = 7 benzersiz harf)
- Daha uzun kelimeler crossword kısıtı nedeniyle sınırlı; anagram/wordsearch tiplerine 7+ harfli kelimeler eklenebilir

## Etkilenen Dosyalar
- `src/types.ts`: DifficultyLevel tipi eklendi
- `src/data/levels.ts`: Tüm kelimeler yeniden zorluk skalasına dağıtıldı, ödüller yeniden hesaplandı, 17 yeni gizli kelime
- `_generate_levels.cjs`: Generator script (silindi)

## Doğrulama
- TypeScript: temiz
- Test: 496/496 geçti
- Tüm level'larda gizli kelime sayısı arttı, hiçbir main word çakışması yok
