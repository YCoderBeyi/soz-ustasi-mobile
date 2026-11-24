# Söz Ustası — Özgün Prompt ve Brief Arşiv Dizini

Bu dizin çalışma alanında gerçekten bulunan, Söz Ustası için yazılmış tasarım promptlarını ve ilişkili kaynak kayıtlarını gösterir. Kaynak metinleri ikinci kez kopyalamaz; böylece özgün ifade ve sürüm tek yerde korunur. “Tasarım brief’i”, “reklam storyboard’u” ve “AI görsel üretim prompt’u” farklı kayıt türleridir.

## Bulunan özgün kaynaklar

| Tarih | Kayıt | Tür | Özgün kayıt |
| --- | --- | --- | --- |
| 2026-06-14 | 120 seviye ilerleme tasarımı | Oyun tasarımı / seviye brief’i | [`docs/superpowers/specs/2026-06-14-120-level-progression-design.md`](../../docs/superpowers/specs/2026-06-14-120-level-progression-design.md) |
| 2026-06-20 | Görsel-işitsel atmosfer tasarımı | Sanat yönetimi ve hareket/ses brief’i | [`docs/superpowers/specs/2026-06-20-audiovisual-atmosphere-design.md`](../../docs/superpowers/specs/2026-06-20-audiovisual-atmosphere-design.md) |
| 2026-06-20 | Atmosfer uygulama planı | Uygulama planı; görsel üretim prompt’u değil | [`docs/superpowers/plans/2026-06-20-audiovisual-atmosphere-plan.md`](../../docs/superpowers/plans/2026-06-20-audiovisual-atmosphere-plan.md) |
| 2026-11-21 | Modern Anadolu Final Production Prompt V2.0 | Onaylı üretim/tasarım prompt’u; dosyada tam metin | [`Modern-Anadolu-Production-Prompt-v2.md`](Modern-Anadolu-Production-Prompt-v2.md) |
| 2026-11-21 | Karşılama ekranı karar kaydı | Screen 01 tasarım kararı ve onay durumu; üretim prompt’u değil | [`Screen-01-Welcome-Current-vs-Target.md`](Screen-01-Welcome-Current-vs-Target.md) |
| 2026-11-25 | Google Ads kampanya taslağı | Kreatif metinleri ve 15 saniyelik storyboard; kare/yatay/dikey AI görsel prompt’u değil | [`vault/07-Production/UA-App-Campaign-Draft-v1.md`](../07-Production/UA-App-Campaign-Draft-v1.md) |

## Görsel üretim varlıkları hakkında bulgu

Depoda `artifacts/play-store/generated-sources/` altında `app-icon-3d-source.png` ve `feature-graphic-3d-source.png` bulunuyor; `scripts/process-generated-store-assets.mjs` bunları boyutlandırıp çıktı üretir. Üretim servisi, model/sürüm, tarih, birebir prompt, referans girdiler ve o tarihteki kullanım koşullarını içeren özgün AI generation log’u bu çalışma alanında bulunamadı. Kaynak görseller veya koddan bu ayrıntılar tahmin edilmez.

`scripts/generate-start-3d-assets.cjs` ise SVG geometri ve renkleri doğrudan kodla üretir; içindeki SVG çizim kodu görsel üretim prompt’u değildir. `scripts/generate_assets.cjs` mevcut bir favicon’dan Android ikon/splash türetir; AI prompt kaydı tutmaz.

## Arşivleme kuralları

- Kaynakta tam metin varsa aynen kaynak dosyada tutulur ve yukarıdan bağlanır; özet, özgün prompt diye sunulmaz.
- Git geçmişi, görsel dosya adı, üretim script’i veya görselin görünümü prompt metni/AI servis koşulu kanıtı değildir.
- Eksik prompt veya üretim geçmişi için yeni metin uydurulmaz. Eksik kayıt, ilgili varlığın provenance durumunu `BLOCKED` bırakır.
- ChatGPT arama URL’si bu yerel arşive sohbet içeriği aktarmadığından, bağlantının kendisi içerik kaydı olarak kullanılmaz.

## Kapsam sınırı

Bu arşiv yerel/Git kayıtlarını indeksler; ChatGPT sohbet geçmişini veya görsel üretim servislerinin hesap kayıtlarını okumaz. Burada bulunmayan birebir sohbet prompt’u, bu dizinde mevcutmuş gibi gösterilmez.
