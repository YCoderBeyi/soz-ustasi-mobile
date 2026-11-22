# Seviye & Kelime Denetimi — Plan ve Yapı Uyumu

**Tarih:** 2026-06-20
**Kapsam:** Yayındaki 75 seviye (L1–L75) ve tüm ana/gizli kelimeler.
**Ölçüt:** `vault/07-Production/Soz-Ustasi-240-Level-Learning-Journey-Master-Plan-v1.md` + `src/data/chapters.ts` (12 bölüm × 20 = 240 hedef model).
**Araçlar:** `npm run audit:levels` (teknik), `npm run audit:plan` (plan uyumu) + elle içerik incelemesi.

---

## Özet Karne

| Eksen | Durum |
|---|---|
| Üretilebilirlik / normalize / yasaklı içerik | ✅ Geçer (`audit:levels` OK, 9 uyarı) |
| Katalog büyüklüğü | 🔴 75/240 (%31) |
| Zorluk eğrisi (§7.3) | 🔴 28 hareketli-ortalama gerilemesi, 5 ani >%18 düşüş, 3 bölüm finali zayıf |
| Zorluk bandı (§7.1) | 🟠 28 seviye bant dışında |
| Kelime tekrar mesafesi (§6.4) | 🔴 3 ana + 4 gizli erken tekrar |
| Tema/bölüm içerik uyumu | 🟠 L1–45 bölüm öğrenme temasına uymuyor; L46–75 uyumlu |
| Kelime geçerliliği (TDK) | 🟠 4 şüpheli kelime |
| Mekanik–etiket tutarlılığı | 🔴 11 "anagram" seviyesi crossword oynanıyor |
| Keşif kartı içeriği | 🟠 75/75 kart impact/today boş (editoryal borç) |

---

## 1. Plan Uyum İhlalleri (araçtan)

### 🔴 Katalog 75/240
Ana yolculuk 240 seviye hedefliyor; yayında 75 var (L1–45 base + L46–75 elle yazılmış). Eksik: 165 seviye. `createMasteryLevels` runtime'dan çıkarılmış (ölü kod).

### 🔴 Zorluk eğrisi (§7.3)
- **28 kez** 5-seviyelik hareketli ortalama geriliyor (hedef: 0).
- **5 ani düşüş** %18'i aşıyor: L24 (-%19), L29 (-%23), L35 (-%19), L65 (-%18), L70 (-%24).
- **3 bölüm finali** zirve değil: L20, L40, L60 < bölüm ort.+%12.

### 🟠 Zorluk bandı (§7.1) — 28 seviye dışında
L5–L20 aralığında ortalama uzunluk/ana kelime sayısı üst banttan taşıyor (giriş bölümü gereğinden zor); L46–L74 aralığında harf sayısı bant üstünde. Bantlar ile gerçek içerik tutarsız.

### 🔴 Kelime tekrarı (§6.4)
- **Ana kelime <40 mesafe:** KİTAP (L23→L34, mesafe 11), KİTAP (L34→L57, 23), KAT (L31→L57, 26).
- **Gizli kelime <20 mesafe:** AL (L3→L17), AS (L8→L22), ALP (L16→L34), ER (L33→L46).

---

## 2. Kelime/İçerik Kalitesi (elle inceleme)

### 🟠 Tema–bölüm içerik uyumsuzluğu (L1–45)
`chapters.ts` öğrenme temaları: ch01 (1–20) "yazı/sayı/ölçü/tarım", ch02 (21–40) "kağıt/kitap/harita/gözlem", ch03 (41–60) "Bağdat/çeviri/matematik".
- **L1–20:** ARI, ELMA, KALE, MERAK, DİLEK, SAHİL, BALON, ZEYTİN… → genel/manzara kelimeleri, "yazı/sayı/ölçü/tarım" eksenini taşımıyor.
- **L21–40:** Yalnız KİTAP, DİVAN, HARİTA bölüm temasına uyuyor; gerisi genel.
- **L41–45:** KOKU, SIRA, ADALET, ZAMAN, SEVİNÇ → soyut kavramlar, ch03 matematik temasıyla ilgisiz.
- **L46–75:** ✅ İyi hizalı — CEBİR, RAKAM, DENKLEM, GEOMETRİ, TERCÜME (matematik/çeviri) ve MERCEK, YANSIMA, BELİRTİ, İLAÇ, AMELİYAT, REÇETE, TEDAVİ (optik/tıp) bölüm eksenini doğru taşıyor.

**Sonuç:** Elle yazılan L46+ blok profesyonel; base L1–45 plan öncesi içerik ve öğrenme yolculuğunu desteklemiyor. Yeniden temalandırma gerekiyor.

### 🔴 "anagram" etiketi ama mekanik yok (11 seviye)
L4, L9, L15, L20, L24, L27, L32, L35, L38, L42, L45 `puzzleType: 'anagram'` taşıyor ama gameplay'de anagram modu uygulanmamış — hepsi crossword oynanıyor (bkz. [[mekanik-panel-bulgulari]]). Etiket–mekanik yalanı: ya mod uygulanmalı ya etiket düşürülmeli.

### 🟠 Zorluk etiketleri keyfi/şişirilmiş
`difficulty: 5` (en zor) etiketli yaygın kelimeler: **MUTLU** (L39), **ZAMAN** (L44), **ADALET** (L43), SEVİN (L45), KOKLA (L41). Bunlar günlük dilde çok yaygın; 5 etiketi yanlış. Bu etiket zorluk-proxy hesabına girdiği için §7.3 eğri regresyonlarını da yapay olarak bozuyor. Etiketlerin nadirlik/sıklık tabanlı yeniden kalibrasyonu gerekiyor.

### 🟠 Şüpheli/sözlük-dışı kelimeler (TDK doğrulaması gerek)
- **NEDER** (L14, ana, "bir davranışın nedenini soran söz") — TDK başlık kelimesi değil, türetilmiş.
- **NEDİ** (L20, gizli, "ne idi'nin kısaltması") — ağız/konuşma dili, sözlük maddesi değil.
- **TULU** (L29, ana, "tüyleri uzun/kabarık") — standart değil ("tülü" keçi ırkı ile karışıyor).
- **NERE** (L14) — TDK'de "halk ağzında" işaretli; sınırda.
Eğitsel kelime oyununun otoritesini zedeler; plan §22 (içerik doğrulama) gereği temizlenmeli.

### 🟡 Diakritik normalizasyon sonucu (tasarım notu)
`normalizeWord` Ç→C, Ü→U, İ→I, Ö→O, Ş→S, Ğ→G siliyor (`src/game/normalize.ts`). Dolayısıyla taşlar diakritiksiz eşleşiyor: KIL=KİL, SOZ=SÖZ aynı kabul. Üretilebilirlik bu sayede geçiyor (örn. SEVİNÇ→İNCE) ama dotted/dotless i ayrımının kaybı yanlış yazımları geçerli sayma riski taşıyor. Türkçe kelime oyunu için adalet/doğruluk kararı gerektirir.

### 🟡 Yüksek frekanslı kısa kelime tekrarları
AL, EL, ER, TÜR, TER, ALP, KİTAP ≥3 kez geçiyor. 2-harfli bağlayıcılar için kaçınılmaz olsa da plan mesafe istiyor; havuz çeşitlendirilmeli.

### 🟡 Yapısal ufak bulgular
- **Gizli kelimesiz** seviyeler: L28, L43, L73 (L1 girişte kabul) — §6.2 gizli kelime alışkanlığı kırılıyor.
- **2-harfli ana kelime:** L1 (AR), L3 (EL), L4 (ÖZ).
- **Ödül eğrisi:** baseCoin alt-blok sınırlarında testere dişi düşüyor (L51, L56, L61, L66, L71 ≈ -%9), zorluk düşüşleriyle çakışıyor.

---

## 3. Öncelikli Aksiyon Sırası

1. **(Karar)** anagram: mod uygula **veya** 11 seviyenin `puzzleType`'ını crossword yap.
2. **(İçerik)** NEDER/NEDİ/TULU/NERE'yi TDK-doğrulanmış kelimelerle değiştir.
3. **(Kalibrasyon)** `difficulty` etiketlerini sıklık tabanlı yeniden ata (MUTLU/ZAMAN/ADALET ≠ 5) → §7.3 eğrisini düzeltir.
4. **(Eğri)** L20/L40/L60 finalleri ile ani >%18 düşüşleri (L24/29/35/65/70) dengele.
5. **(Tema)** L1–45'i bölüm öğrenme temalarına göre yeniden kur (L46+ örnek alınmalı).
6. **(Tekrar)** KİTAP/KAT ana ve AL/AS/ALP/ER gizli tekrarlarını ayıkla.
7. **(Katalog)** L76–120'yi bölüm temalarıyla üret.
8. **(Editoryal)** 75 keşif kartına impact/today doldur (plan §22 doğrulamasıyla).

> İlgili: [[plan-vs-shipped-audit-gap]], [[mekanik-panel-bulgulari]].
> Tam araç çıktısı: `npm run audit:plan`, `npm run audit:levels`.
