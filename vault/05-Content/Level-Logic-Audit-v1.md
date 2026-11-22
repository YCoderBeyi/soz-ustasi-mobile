# Level Logic Audit v1

## Kapsam

2026-06-05 düzeltme turunda 30 level verisi, harita akışı, tema ilerlemesi, ödül ekonomisi, replay davranışı, Söz Hazinesi ve reward modal mantığı birlikte incelendi.

## Düzeltilen Mantık Hataları

1. Level 9 ana kelime hatası düzeltildi
   - `RÜH` kaldırıldı.
   - Doğru `RUH` kelimesi için harf havuzuna `U` eklendi.

2. Level tamamlama ödülü cüzdana bağlandı
   - `level.reward.baseCoin` artık sadece ekranda gösterilmiyor, tamamlamada cüzdana ekleniyor.
   - Tekrar oynanan levelde ödül tekrar basılmıyor.

3. Gizli kelime bonusu tutarlı hale getirildi
   - Gizli kelime bulununca anlık `hidden.reward` veriliyor.
   - Level sonunda ayrıca `hiddenWordBonus` gerçek reward özetine ve cüzdana ekleniyor.

4. Harita kilidi eklendi
   - Level 1 açık.
   - Tamamlanan level ve bir sonraki level oynanabilir.
   - Daha ilerideki leveller kilitli görünüyor.

5. Son level sarma hatası kaldırıldı
   - Level 12 sonrası oyun Level 1'e otomatik dönmüyor.
   - Oyuncu haritaya yönlendiriliyor.

6. Söz Hazinesi cevap sızıntısı düzeltildi
   - Vault artık mevcut level cevaplarını göstermiyor.
   - Sadece oyuncunun gerçekten bulduğu kelimeler kalıcı koleksiyona ekleniyor.

7. Reward timer temizliği eklendi
   - Level restart/map geçişlerinde eski reward timer yanlış modal açamaz.

8. Replay elmas farm engellendi
   - Tamamlanmış level tekrar oynandığında ana/gizli kelimeler tekrar elmas basmıyor.

9. Level havuzu genişletildi
   - İlk içerik seti 12 levelden 30 levele çıkarıldı.
   - Yeni leveller kısa öğrenme döngüsü, tema keşfi ve artan ödül hissiyle sıralandı.

## Level 2 Kararı

Level 2 veri mantığı doğru:

- Harfler: `E, L, M, A, A`
- `ELMA`, `LAMA`, `MALA`, `MAL` üretilebilir.
- İki `A` ayrı node olarak kalmalı; UI tarafında duplicate harf algısı net tutulmalı.

## Doğrulama

- `npm run audit:levels`: geçti, 30 level, 0 warning.
- `npm run lint`: geçti.
- `npm run build`: geçti.

## Karar

Level mantığı MVP/prototip APK için hazır. Bir sonraki kalite adımı gerçek cihazda sürükle-bırak hitbox testi, küçük ekran görsel regresyon testi ve 10-15 kişilik erken oyuncu zorluk ölçümüdür.
