# word-quality-v1 - Zorunlu kelimeler adil olmali

**Kural (2026-11-08):** Bir seviyedeki ana kelime muhru acmayi, gizli kelime ucuncu yildizi belirler. Bu yuzden her ikisi de yetiskin bir oyuncunun kendi basina bulabilecegi, yaygin kelimeler olmali. Zorluk kelimenin nadirligiyle degil, harf sayisi ve kelime sayisiyla ayarlanir. Bonus kelimeler, `src/game/bonusDictionary.ts` içindeki proje tarafından yazılmış açık listeyle sınırlıdır.

**Yontem:** Iki bagimsiz model (Opus ve Fable) her kelimeyi, ortaokul duzeyinde egitimli bir yetiskinin kendi basina yazabilecegi acisindan A (cok yaygin), B (cogu yetiskin bilir), C (nadir/eski/uzmanlik/ozel isim) veya X (sozluk kelimesi suphesi) olarak siniflandirdi. Bir kelime ancak iki modelde de A veya B ise onaylidir. Ilk turda 376 kelimenin 27 ana ve 16 gizli kelimesi elendi; yedekler ayni kuralla, kisitlari (10-12 level tekrar mesafesi, 46-70 arasinda tekrar yok, bulmaca kurulabilirligi) saglayan bir cozucuyle secildi ve ikinci turda tekrar iki modele sorulup onaylandi.

**Kapi:** `src/data/wordQuality.test.ts` her ana ve gizli kelimenin `approved-words.json` icinde oldugunu zorunlu kilar. Listede olmayan kelime testi dusurur.

**Akış ve senaryo bağı:** Sözcük tanınırlığı tek başına editoryal onay değildir. Seviye, hikâye, ipucu, hedef, ödül ve sonraki ekranın uçtan uca kabul şartları `vault/07-Production/Editorial-Integrity-Gate-v1.md` içindedir.

**Yeni kelime eklerken:** kelimeyi iki modele sorun, ikisi de A/B derse `approved-words.json` dosyasina ekleyin. Anlam her zaman ozgun yazilir (TDK kopyasi degil).

**Biçim kapısı:** A/B yaygınlık notu tek başına hedef biçimini onaylamaz. Mühür veya gizli yıldız hedefinde çıplak emir biçimi kullanmayın. `required-target-exclusions.json` tek istisna listesidir; `src/data/wordQuality.test.ts` ve üretim seviyesi oluşturucu aynı listeye uyar. Bir sözcük başka bir yaygın isim/sıfat anlamıyla kullanılacaksa o anlam açıkça yazılmalı ve ayrı editoryal incelemeden geçmelidir.


## Incremental review — 2026-11-22

Two independent reviewers rated the following candidates under the same unaided-recall standard. Both rated each A or B; accepted tiers are recorded in `word-tiers.json` (AKIŞ: BA; KIRIK: AB; IŞIN: BB; DOZ: AB; remaining additions: AA): AKIŞ, CAM, AŞI, HAVA, TREN, RAY, HESAP, KOD, İŞLEM, BİLGİ, ŞİFA, AĞ, KIRIK, IŞIN, RENK, DOZ. The new target meanings remain contextual and are authored separately from the popularity rating.


Incremental review — 2026-11-22: Two independent reviewers rated DNA (AA), GEN (BB), ODA (AA), RADYO (AA), SES (AA), MİKTAR (AB), MİKROP (AA), SU (AA), NESNE (BB), KANUN (AA), and GÜNEŞ (AA), BASKI (AA), YAZI (AA). The targets use authored meanings in levels 30, 37, and 64; ratings document familiarity, not clue wording.

Incremental review — 2026-11-22: Two independent reviewers rated KAN (AA), SAYFA (AA), BAĞ (BB), EKRAN (AA), KAMERA (AA), CÜMLE (AA), SİMGE (BB), SAYIM (BA), and METAL (AA). BAĞ and SİMGE require contextual clues; these ratings document familiarity, not clue wording. The terms are used in levels 41, 43–44, 51, 53, 56, and 71.

Incremental review — 2026-11-22: Two independent reviewers rated BİLİM (AA), BASAMAK (AA), and SIFIR (AA) as familiar, natural targets. Their meanings are contextualized in levels 36, 46, and 47; ratings document familiarity, not clue wording.
