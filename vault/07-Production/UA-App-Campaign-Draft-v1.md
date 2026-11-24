# UA — Google Ads Uygulama Kampanyası Taslağı (Söz Ustası)

İlgili: [[Ads-Readiness-v1]], [[Release-Manifest-v1]], [[Data-Safety-v1]], [[Google-Play-Listing-v1]]

Paket: `com.sozustasi.game`  
Yayıncı (AdMob): `pub-2784764635828379`  
Mağaza: `https://play.google.com/store/apps/details?id=com.sozustasi.game`  
Web / gizlilik: `https://ycoderbeyi.github.io` · `https://ycoderbeyi.github.io/privacy.html`

## 1) Production geçiş (Play Console)

Closed test’te 1.2.10 (35) canlıysa:

1. Play Console → **Söz Ustası** → **Yayınla** → **Üretim**
2. **Yeni sürüm oluştur** → closed test’teki **1.2.10** AAB’yi seç (veya aynı artifact’ı yükle)
3. Sürüm notları (tr-TR kısa):

```
• İçerik denetimi 1–25 / 26–50 / 51–75 ajan aralıkları
• Yeni kelime adayları bağımsız incelemeden geçti
• Mühür baskısı ve sakin tahta geri bildirimi
• İsteğe bağlı Play Games ligi
```

4. Gönder → inceleme. İlk production’da ek formlar (içerik derecelendirme, reklam beyanı, data safety) eksikse tamamla.
5. Onay sonrası: **Üretim → Kullanılabilir** olmalı; Ads kampanyası bundan sonra başlar.

Kapılar ([[Ads-Readiness-v1]] ile aynı):
- [ ] Hedef kitle 13+, çocuklara yönelik değil
- [ ] Reklam kimliği beyanı = Evet
- [ ] Data safety güncel
- [ ] Store listing: kısa/uzun açıklama + ekran görüntüleri (en az 2 telefon)
- [ ] `app-ads.txt` ve gizlilik URL’leri Console’da dolu

## 2) Google Ads — Uygulama kampanyası taslağı

Açık: [ads.google.com](https://ads.google.com) → **+ Yeni kampanya**

| Alan | Değer |
| --- | --- |
| Hedef | Uygulama tanıtımı |
| Kampanya alt türü | Uygulama yüklemeleri |
| Uygulama | Android · `com.sozustasi.game` |
| Teklif odağı | Optimizasyon: **Kurulum sayısı** (ilk 7 gün) |
| Teklif | Hedef CPI: **TRY 4–8** (yoksa otomatik, günlük bütçeyi düşük tut) |
| Konum | Türkiye |
| Dil | Türkçe |
| Günlük bütçe (test) | **150–300 TRY** |
| Başlangıç | Production “kullanılabilir” olduktan sonra |
| Süre | 7 gün öğrenme; kreatif öldür/çoğalt |

Kreatif varlıklar (App kampanya havuzu):
- Yatay/dikey/kare ekran görüntüleri (Play listing’den)
- **1× 15 sn dikey video** (9:16) — aşağıdaki storyboard
- Logo / ikon (Play icon)
- Metin başlıkları (≤30 karakter):
  - `Kelimeleri yerleştir`
  - `Modern Anadolu bulmaca`
  - `Söz Ustası’na başla`
- Açıklamalar (≤90):
  - `Haritada ilerle, kelimeleri mühürle, sakin modda oyna.`
  - `Kapadokya atmosferinde Türkçe kelime bulmaca.`

Hariç tutma / not:
- İlk hafta hedef: kurulum; olay optimizasyonuna geçiş için Firebase/Play dönüşüm bağlama sonra.
- AdMob ödüllü birimler UA değil; UA = Google Ads App kampanyası.

## 3) 15 sn dikey tanıtım — storyboard (9:16)

Ses: hafif ney/bağlama ped + kısa “mühür” tık. Metin Türkçe, büyük, tek satır.

| sn | Görüntü | Ekran metni |
| --- | --- | --- |
| 0–3 | Kapadokya/balon atmosferi, logo mühür | **SÖZ USTASI** |
| 3–7 | Tahta: harf kutusu sürüklenip yuvaya oturur + mühür baskısı | **Kelimeleri yerleştir** |
| 7–11 | Harita taş ped / seviye ilerleme | **Anadolu’da ilerle** |
| 11–15 | Oyuna Başla CTA + Play rozeti | **Ücretsiz oyna** |

Çekim kaynağı: cihaz kaydı (scrcpy/ADB) veya Play listing görselleri + CapCut kesmesi.  
Export: **1080×1920**, H.264, ≤15 sn, ses açık/kapalı iki varyant.

### CapCut / kısa video montaj sırası

1. Intro still veya start screen kaydı (3 sn) + logo fade
2. Oyun içi drag+seal klip (4 sn), hız %110
3. Harita pan (4 sn)
4. End card: logo + “Google Play’de” (3 sn)

Dosya önerisi: `artifacts/marketing/SozUstasi-UA-15s-v1.mp4`
