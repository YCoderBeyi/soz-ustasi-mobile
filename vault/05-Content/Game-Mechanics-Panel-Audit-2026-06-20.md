# Oyun Mekaniği Profesyonel Panel Denetimi — 2026-06-20

Yöntem: 6 profesyonel mercek paralel denetim yaptı (ekonomi/ilerleme, zorluk/akış,
davranışsal psikoloji & etik, UX/erişilebilirlik, çekirdek mekanik/bulmaca,
anlatı/öğrenme). Tüm yüksek-etkili iddialar koddan bizzat çapraz-doğrulandı; iki
uzman arasındaki çelişki (günlük ödül) doğrudan kod okunarak çözüldü.

Doğrulama etiketleri: `[DOĞRULANDI]` koddan teyit · `[ÇELİŞKİ ÇÖZÜLDÜ]` ·
`[CİHAZDA]` fiziksel cihaz gerekir · `[TASARIM KARARI]` ürün sahibinin kararı.

Tamamlayıcı belgeler: `Plan-Compliance-Audit-2026-06-20.md` (seviye/plan uyumu),
`scripts/audit-plan.mjs`.

---

## Genel değerlendirme

Etik tasarım açısından yapım güçlü: zorunlu reklam, yapay kıtlık, suçlayıcı seri,
FOMO geri sayımı YOK; başarısızlık nazik ("seri bozulmadı"), tekrar oynama ana altını
tekrar üretmez. Bu, planın §3.5 etik tutundurma sözleşmesine sadıktır.

Asıl açıklar üç başlıkta toplanıyor: (1) **vaat edilip uygulanmayan mekanikler**
(anagram, flawless, doubler), (2) **adalet/erişilebilirlik hissi** (geçerli kelime
reddi, ipucu tek-dokunuş, çark ekran-okuyucuya kapalı), (3) **öğrenme/eğri**
(kartlarda impact/today boş, zorluk regresyonları, bölüm-içerik çakışması).

## Kesişen temalar (kök desenler)

1. **"Etiket var, mekanik yok" deseni.** Birden çok özellik UI/veride duruyor ama
   çalışmıyor: anagram (11 seviye), "KUSURSUZ +%50", doubler/coinMultiplier.
   Oyuncuya sözü verilen ama verilmeyen ödül/mod güveni en çok zedeleyen şey.
2. **Adalet hissi açığı.** Geçerli Türkçe kelimenin reddi (50'lik sözlük) +
   2-harfli geçerli kelimenin seriyi bozması + ipucuda tek-dokunuş harcama →
   oyuncunun "agency/adalet" algısına dokunuyor.
3. **Eğri ölçümü kendini doğruluyor.** Zorluk büyük oranda "etiket"; audit proxy
   skoru bu etikete dayanıyor → gerçek zorluk profili (kelime sıklığı) olmadan
   ölçüm güvenilirliği sınırlı.

---

## 🔴 Kritik bulgular (doğrulanmış)

### KP1 — Anagram modu hiç uygulanmamış; 11 seviye yanlış mod sözü veriyor `[DOĞRULANDI]`
`puzzleType`, gameplay'de hiç kullanılmıyor: `WordPuzzle.tsx`, `GameScreen.tsx`,
`SessionContext.tsx` içinde 0 eşleşme; yalnız `LevelModal`/`LevelStartScreen` rozet
olarak okuyor. 11 "anagram" seviyesi (L4,9,15,20,24,27,32,35,38,42,45) tıpatıp
crossword oynanıyor. Psikoloji: vaat-gerçek kopukluğu, beklenti ihlali. Plan §8.2.
Öneri: ya gerçek anagram akışı ekle, ya rozeti kaldırıp `crossword`'e çevir.

### KP2 — "KUSURSUZ +%50" ödülü hiç tetiklenmiyor (ölü vaat) `[DOĞRULANDI]`
`RewardModal.tsx:48` `rewardSummary.flawless` true ise "+%50" kartı render ediyor;
fakat `SessionContext.tsx`'te `setRewardSummary` çağrıları (`:437`, `:439`)
`flawless`'ı hiç true yapmıyor ve +%50 altın hesabı yok. En güçlü pozitif
geri-bildirim anı boşa gidiyor. Plan §12.1, §13.2. Öneri: `wrongAttempts===0 &&
!usedHint` ile hesapla, ya da kaldır.

### KP3 — Geçerli kelime reddi: bonus sözlük ~46 kelime `[DOĞRULANDI]`
`bonusDictionary.ts` ~46 kelime; `submitWord` bu listede ve seviye hedeflerinde
olmayan geçerli Türkçe kelimeyi "Bu kelime henüz sözlüğümüzde yok" ile geçiştiriyor.
Plan §8.1/§6.3 "geçerli kelime reddedilmez" diyor. Psikoloji: adalet/agency açığı.
Öneri: çevrimdışı geniş Türkçe sözlük (Zemberek/TDK tabanlı).

### KP4 — Çark ekran okuyucu/klavye ile oynanamaz `[DOĞRULANDI/CİHAZDA]`
`GameScreen.tsx:296` tüm `.wheelLetter` `aria-hidden="true"`; çarkta klavye
erişimi/alternatifi ve `aria-live` yok → TalkBack ile oyun tamamen oynanamaz.
Plan §29. Öneri: klavye-erişilebilir harf seçimi veya en az bulunan kelime için
`aria-live`. Cihazda TalkBack ile doğrulanmalı.

### KP5 — İpucu tek dokunuşla istemsiz harcama `[DOĞRULANDI — KISMEN DÜZELTİLDİ İDDİA]`
ÖZ-DÜZELTME: UX ajanının "maliyet tıklamadan görünmüyor" iddiası YANLIŞTI —
`HintModal.tsx:12,15` butonlarda maliyeti zaten gösteriyor ("Anlam İpucu · 🪙 20").
Plan §27.7'nin "fiyat butonda açık" maddesi KARŞILANIYOR. Geriye kalan geçerli
nokta: onay adımı yok (tek dokunuş harcar). Mühürde onay var, ipucuda yok. Bu bir
UX kararıdır (onay diyaloğu eklemek akışı değiştirir) — ürün sahibine bırakıldı.

### KP6 — Bölüm finalleri zirve değil; eğride 28 regresyon + 5 ani düşüş `[DOĞRULANDI]`
`audit-plan.mjs` teyit: L20 finali ortalamanın +%9'u, L40 ortalamanın -%5'i (plan
§7.3 ≥+%12 ister). 5 ani düşüş: L24/29/35/65/70 (L70 -%24, 2 ana kelimeye düşüyor).
Psikoloji: flow'da kapanış/doruk anı oluşmuyor; %18+ düşüşler apati bölgesi.
Öneri: finalleri ≥+%12'ye çıkar; toparlanma düşüşlerini %12-15 ile sınırla.

### KP7 — Keşif kartlarında impact/today 75/75 boş `[DOĞRULANDI]`
Tip alanları hazır (bu turda eklendi) ama hiçbir kartta içerik yok → kart yalnız
"Ne oldu"yu yanıtlıyor, "Neden önemli/Bugün nerede" yok. Plan §9.1, §18.1
("eksik kart: 0"). İçerik §22 gereği doğrulanmadan doldurulmamalı (editoryal borç).

---

## 🟠 Önemli bulgular (doğrulanmış)

- **Ö1 — doubler/coinMultiplier ödüle uygulanmıyor** `[DOĞRULANDI]`: kayıtta
  (`playerSave.ts:29-30`) ve mağaza akışında geçiyor ama `manualOpenSeal` ödül
  hesabı (`SessionContext.tsx:428-435`) yalnız tema modifier'ını kullanıyor;
  `doubler` ürünü `shop.ts`'te yok. Yarım/yanıltıcı özellik. Öneri: bağla veya kaldır.
- **Ö2 — günlük ödül `awardedLevels`'ten bağımsız** `[ÇELİŞKİ ÇÖZÜLDÜ]`:
  gün içinde tek sefer (kilitli, retention ajanı haklı), ama daha önce bitirilmiş
  kolay seviye her gün günün görevi olup 2x ödeyebilir (günde-bir musluk; "sınırsız
  farm" DEĞİL). Plan §13.3'e teknik uyumlu; günün görevini "ilerleme sağlayan"
  seviyelerle sınırlamak öneri.
- **Ö3 — bölge bonusu `levelId % 6` hardcoded** `[DOĞRULANDI]`
  (`SessionContext.tsx:431`): planın 20'lik bölüm finaliyle (§4.2) uyuşmuyor.
  `isChapterFinale` (chapters.ts) üzerinden ver.
- **Ö4 — ilk 10 seviyede erken aşırı yük** `[DOĞRULANDI]`: L9 6 harf, L10-19 sürekli
  4 ana kelime (bant L1-20: 2-3). "Hızlı başarı" (§3.1) ihlali; erken churn riski.
- **Ö5 — 46-58 erken bant ihlali** `[DOĞRULANDI]`: 7-8 harfli kelimeler 21-60
  bandında (harf 4-6). 8-harfliler 61+ bandına taşınmalı.
- **Ö6 — çark dokunma hedefi küçük ekranda 40px** `[DOĞRULANDI/CİHAZDA]`
  (`media.css:60-63`, `@media max-height:760px`). Hitbox HIT_SCALE ile telafi var
  ama görsel hedef <48px. Üst bar ikonları 28px. Plan §27.6.
- **Ö7 — reduced-motion var, oyun-içi "hareketi azalt" ayarı yok** `[DOĞRULANDI]`:
  OS reduced-motion'a güveniliyor; confetti/burst DOM koşulsuz. PauseModal'da
  yalnız ses/titreşim. Plan §29.
- **Ö8 — ardışık aynı-kişi kümelenmesi** `[DOĞRULANDI]`: 46-48+50 Harezmi, 61-65
  İbnü'l-Heysem, 71-75 Zehravi → déjà vu (§3.3, §2.2).
- **Ö9 — kadın bilim insanı temsili ~0** `[DOĞRULANDI]`: 75 seviyede öne çıkan
  kadın yok (yalnız Franklin ekip içi). Plan §4.1 ≥35 hedefi yapısal ertelenmiş.
- **Ö10 — spaced repetition/Ustalık Atölyesi yok** `[DOĞRULANDI]`: `masteryLevelStories.ts`
  planın §2.2'de eleştirdiği jenerik üreticinin kendisi ("Ustalık Adımı N"). Öğrenme
  tek seferlik. Plan §10 (v1.2'ye ertelenebilir).

## 🟡 İkincil bulgular

- 2-harfli geçerli kelime daima `wrong` sayılıp seriyi bozuyor (`SessionContext.tsx:301`
  `>=3` eşiği) `[DOĞRULANDI]`.
- Çengel üretici geri-izlemesiz (greedy); yeni seviyede sessiz `WordSlots` fallback
  riski (`crossword.ts`) `[DOĞRULANDI]`.
- Türkçe normalize tutarsızlığı `[DOĞRULANDI — DÜZELTİLDİ 2026-06-20]`:
  ÖZ-DÜZELTME: çekirdek-mekanik ajanı "oyun normalize'ı Ü/U'yu birleştiriyor" dedi —
  YANLIŞ. `src/game/normalize.ts` NFC kullanır, diacritic STRIP YAPMAZ (Ü/U/Ş/S/Ç/C
  bilinçli olarak AYRI harf). Asıl tutarsızlık `audit-levels.mjs` idi: buildability'de
  diacritic STRIP ediyordu (Ü=U sayıp oyunda kurulamayan kelimeyi geçiriyordu, örn.
  M,Ü,H,Ü,R,U havuzunda UMUR). Düzeltme: audit'e `gameNormalize` (NFC, no-strip)
  eklendi; buildability artık oyunun gerçek kuralıyla kontrol ediliyor. Sentetik test:
  UMUR eski 6-harf havuzda `false`, düzeltilmiş 7-harf havuzda `true`. (L9 verisi ekip
  tarafından canlı düzeltildi; audit artık bunu kalıcı zorunlu kılıyor.)
- İpucu sabit 20 altın; plan §11 4-kademeli + zorlukla artan fiyat istiyor.
- "noHint" yıldız etiketi yanıltıcı (ön koşulu tüm gizliler) (`objectives.ts:30`).
- `isBigDiscovery` tanımlı ama hiç çağrılmıyor; büyük kart ayrımı yok (§9.2).
- Onboarding ilerleme noktaları etiketsiz; son slayt ilk seviyeye değil haritaya gider.
- Gizli kelimesiz seviyeler: 1, 28, 43, 73.

---

## ⚠️ Öz-düzeltme: chapters.ts mevcut içerikle çakışıyor `[DOĞRULANDI]`

Bu turda eklenen `src/data/chapters.ts` planın §4 hedef yapısını (12 bölüm) kodluyor;
ANCAK yayındaki 75 seviye bu yapıya uymuyor. Örnek: ch03 [41-60] "Bağdat/çeviri/
matematik" diyor ama `levelStories.ts` L41-45 = MRI, GPS, World Wide Web, akıllı
telefon, mRNA aşısı (modern bilim). Yani `chapterForLevel(43)` "Bilgelik Evleri"
döndürür — yanlış. Mevcut içerik aslında "1-45 insanlık tarihinin hızlı turu +
46-75 derin İslam bilimi" düzeninde; plan §4 aralıklarına göre değil.

Sonuç: chapters.ts **hedef modeldir**, yayındaki seviyelerin ground-truth bölümü
DEĞİLDİR. İçerik plan §4'e göre yeniden kurulana dek `chapterForLevel` yayın
seviyeleri için otoritatif kabul edilmemeli (kod yorumuna not eklendi).

---

## Ürün sahibine açık sorular `[TASARIM KARARI]`

1. Anagram, "KUSURSUZ +%50" ve doubler: tamamlanacak mı, kaldırılacak mı?
2. Erişilebilirlik (çark ekran-okuyucu) yayın gereksinimi mi, bilinçli kapsam-dışı mı?
3. Geçerli kelime kabulü için geniş Türkçe sözlük bu sürümde mi?
4. Kadın temsili (§4.1) bu sürümde 46-75'e eklenecek mi, 81+'a mı ertelenecek?
5. impact/today içeriği yayın öncesi mi doldurulacak?

## Öncelik sırası (etki/risk)

1. Adalet & beklenti: KP1 (anagram), KP2 (flawless), KP3 (sözlük), KP5 (ipucu onay).
2. Erişilebilirlik: KP4 (çark a11y) + Ö6/Ö7.
3. Eğri: KP6 + Ö3/Ö4/Ö5 (audit'e final ≥+%12 ve bant kuralı ekle).
4. Öğrenme: KP7 (impact/today) + Ö8/Ö9 + chapters/içerik hizalama.
5. Temizlik: Ö1/Ö10 ölü kod, ikincil maddeler.

## Bu turda uygulanan düzeltmeler (mevcut UI korunarak) `[DOĞRULANDI]`

1. **KP2 flawless gerçek yapıldı** — `SessionContext.tsx`: hatasız+ipuçsuz tamamlamada
   base + %50 ödül; RewardModal'ın zaten var olan "KUSURSUZ +%50" satırı artık
   çalışıyor. ÖZ-DÜZELTME: ilk deneme `wrongAttempts===0` kullandı ama o değer doğru
   kelimede sıfırlanıyordu (ipucu mantığı); ayrı korunan `perfectRun` bayrağına geçildi.
2. **2-harfli adaletsizlik** — `submitWord` eşiği `>=3` → `>=2`; 2-harfli geçerli
   kelime artık seriyi bozmuyor (3-harfli ile tutarlı).
3. **Audit sertleştirildi** — `audit-plan.mjs`'e plandaki denetlenmeyen §7.3 maddeleri
   eklendi: bölüm finali ≥ ortalama+%12 (Bölüm 1/2/3 ihlali yakalandı) ve yeni bölüm
   başlangıcı ≥ önceki bölüm başlangıcı.
4. **chapters.ts** hedef-model uyarısı eklendi (yayın seviyeleri için otoritatif değil).

Doğrulama: `npx tsc -b` temiz; `npx vitest run` 885/885 (3 yeni test); `audit:levels`
release-gate değişmedi.

## Doğrulama (genel)
- 6 paralel uzman denetimi + en kritik 12 iddianın koddan çapraz doğrulanması.
- Günlük-ödül çelişkisi ve KP5 maliyet-görünürlüğü kod okunarak çözüldü/düzeltildi.
- Üretim mantığı yalnız yukarıdaki 4 güvenli, UI-koruyan düzeltmeyle değişti.
