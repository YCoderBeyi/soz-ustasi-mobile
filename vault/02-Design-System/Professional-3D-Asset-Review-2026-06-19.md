# Professional 3D Asset Review - 2026-06-19

## Karar

Oyunun mevcut 3D varlıkları yayın engelleyici bir kalite problemi taşımıyor. Ana ikon, harita, mühür, çark ve ödül görselleri aynı premium kelime oyunu atmosferini destekliyor. Ancak üretim kalitesi için üç sorun kapatıldı:

1. UI SVG dosyalarında gömülü Türkçe metin vardı. Bu, lokalizasyonu zorlaştırıyor ve encoding bozulması riski yaratıyordu.
2. Ödül ekranında 3D asset akışını bozan düz emoji kupa kullanımı vardı.
3. Bazı üretim görselleri gereğinden büyüktü ve uygulama paketini şişiriyordu.

## Yapılan Düzeltmeler

- `public/assets/ui/v2/06-hint-action-button.svg`, `07-shuffle-action-button.svg`, `08-seal-action-button.svg` içindeki gömülü `<text>` katmanları kaldırıldı.
- Ödül ekranındaki bölge sandığı kupa emojisi `/assets/reward/v2/star.png` ile değiştirildi.
- `scripts/optimize-production-assets.mjs` eklendi. Script üretim assetlerini tarar, kaliteyi bozmadan yeniden sıkıştırır ve sadece daha küçük dosyayı kabul eder.
- Üretim asset optimizasyonunda 47 dosya tarandı, 9 dosya küçüldü, toplam 2.64 MB tasarruf sağlandı.
- UI asset audit sonucu `100/100`: kullanılan SVG oranı `%100`, kullanılmayan SVG `0`, gömülü metin `0`.

## Sonraki Kalite Çıtası

- Yeni görsel eklendiğinde `npm run audit:ui` ve `npm run optimize:assets` release öncesi çalıştırılmalı.
- UI yazıları asset içine gömülmemeli; metin React/CSS tarafında kalmalı.
- Emoji yalnızca bilinçli bir eğlence dili isteniyorsa kullanılmalı. Premium ana akışta 3D asset tercih edilmeli.
- Büyük görseller için format dönüşümü ayrı testle yapılmalı; hızlı release öncesinde mevcut dosya yolunu koruyan sıkıştırma tercih edilmeli.
