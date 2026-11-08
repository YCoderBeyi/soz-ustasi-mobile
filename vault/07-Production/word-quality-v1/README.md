# word-quality-v1 - Zorunlu kelimeler adil olmali

**Kural (2026-11-08):** Bir seviyedeki ana kelime muhru acmayi, gizli kelime ucuncu yildizi belirler. Bu yuzden her ikisi de yetiskin bir oyuncunun kendi basina bulabilecegi, yaygin kelimeler olmali. Zorluk kelimenin nadirligiyle degil, harf sayisi ve kelime sayisiyla ayarlanir. Nadir kelimeler yalnizca serbest bonus olarak kabul edilir (bonus-lexicon-v1).

**Yontem:** Iki bagimsiz model (Opus ve Fable) her kelimeyi, ortaokul duzeyinde egitimli bir yetiskinin kendi basina yazabilecegi acisindan A (cok yaygin), B (cogu yetiskin bilir), C (nadir/eski/uzmanlik/ozel isim) veya X (sozluk kelimesi suphesi) olarak siniflandirdi. Bir kelime ancak iki modelde de A veya B ise onaylidir. Ilk turda 376 kelimenin 27 ana ve 16 gizli kelimesi elendi; yedekler ayni kuralla, kisitlari (10-12 level tekrar mesafesi, 46-70 arasinda tekrar yok, bulmaca kurulabilirligi) saglayan bir cozucuyle secildi ve ikinci turda tekrar iki modele sorulup onaylandi.

**Kapi:** `src/data/wordQuality.test.ts` her ana ve gizli kelimenin `approved-words.json` icinde oldugunu zorunlu kilar. Listede olmayan kelime testi dusurur. `values-exceptions.json` yalnizca bonus kara listesiyle (denied-by-values.json) cakisan ama gercek isim anlami olan kelimeleri gerekceyle kaydeder.

**Yeni kelime eklerken:** kelimeyi iki modele sorun, ikisi de A/B derse `approved-words.json` dosyasina ekleyin. Anlam her zaman ozgun yazilir (TDK kopyasi degil).
