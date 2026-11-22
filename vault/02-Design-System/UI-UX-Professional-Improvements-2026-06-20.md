# UI/UX Profesyonel Geliştirme ve Kararlar — 2026-06-20

Bu belge, ana planın (`Soz-Ustasi-240-Level-Learning-Journey-Master-Plan-v1.md`)
§27 Ekran Tasarım Sözleşmeleri ve §29 Animasyon Sistemi maddelerinin **alt
sözleşmesidir**. Kaynak: 6 profesyonel mercekli panel denetimi
(`vault/05-Content/Game-Mechanics-Panel-Audit-2026-06-20.md`).

Temel ilke: **MEVCUT UI KORUNUR.** Ekran iskeleti, yerleşim ve görsel dil
değiştirilmez; yalnızca (a) ölü/yanıltıcı öğeler dürüstleştirilir, (b) küçük ve
geri-uyumlu eklemeler yapılır, (c) erişilebilirlik görünmez katmanda güçlendirilir.

---

## A. Alınan kararlar (Decisions)

| # | Karar | Gerekçe (oyuncu psikolojisi) | Plan | Durum |
| --- | --- | --- | --- | --- |
| D1 | UI iskeleti korunacak; değişiklikler dürüstleştirme + geri-uyumlu ekleme ile sınırlı | Tanıdıklık/öğrenilmişlik; regresyon riski yok | §27 | Sürekli ilke |
| D2 | "KUSURSUZ +%50" satırı gerçek ödülle çalıştırıldı | En güçlü pozitif geri-bildirim anını boşa harcamamak | §12.1, §13.2 | ✅ Uygulandı |
| D3 | İpucu maliyeti butonda görünür kalacak (zaten var); onay adımı ürün kararına bırakıldı | Şeffaflık var; onay akışı değiştirir, aceleci karar verilmez | §27.7 | ✅ Korundu / ⏳ karar |
| D4 | Mühür yalnızca ana hedefler bitince aktif kalacak (mevcut davranış doğru) | Kontrol hissi; oyuncunun bilinçli kapanış kararı | §27.6, §12.3 | ✅ Korunuyor |
| D5 | Çark erişilebilirliği görünmez katmanda eklenecek (görsel UI değişmez) | Kapsayıcılık; Play erişilebilirlik beklentisi | §29 | ⏳ Öneri S1 |
| D6 | Animasyonlar girdiyi engellemeyecek (mevcut durum uygun) | Akış; <100ms tepki | §27.6, §29 | ✅ Korunuyor |

## B. Bu turda uygulanan geliştirmeler (mevcut UI korunarak)

- **KUSURSUZ ödülü** (`SessionContext.tsx`): hatasız + ipuçsuz tamamlamada base +%50.
  RewardModal'daki mevcut satır artık çalışıyor. Korunan `perfectRun` bayrağı ile
  doğru ölçülüyor (erken hatayı da yakalar). 3 yeni test.
- **2-harfli kelime adaleti**: geçerli 2-harfli kelime artık seriyi bozmuyor.
- **İpucu maliyet görünürlüğü**: zaten butonda gösteriliyor — doğrulandı, korundu.

## C. Öneri ve geliştirmeler (Suggestions — ayrı liste)

Her biri mevcut UI korunarak uygulanabilir. Öncelik = etki/risk.

| # | Ekran | Öneri | Psikoloji gerekçesi | Plan | UI-koruma notu | Öncelik |
| --- | --- | --- | --- | --- | --- | --- |
| S1 | Oyun (çark) | Çark için `aria-live` bölge + bulunan kelimeyi duyurma; harfler için erişilebilir alternatif | Kapsayıcılık; ekran-okuyucu kullanıcı tamamen dışlanmış | §29 | Görünmez katman; görsel UI değişmez | Yüksek |
| S2 | Oyun | Gizli kelime için uzunluk ipucu ("_ _ _") mevcut "2/4" sayacının yanında | Merak boşluğu; yönlendirilmiş keşif | §27.6 | Mevcut sayaç korunur, ek satır | Orta |
| S3 | Ayar/Duraklat | "Hareketi Azalt" + "Düşük Kalite" toggle (mevcut ses/titreşim yanına); confetti/burst'ü bağla | Bilişsel yük/duyusal hassasiyet; düşük cihaz | §29 | PauseModal'a ek toggle | Orta |
| S4 | Oyun | Üst bar ikon butonlarının tıklama alanı padding ile ≥44px | Hatalı dokunma; erişilebilirlik | §27.6 | Görsel ikon 28px kalır, hitbox büyür | Orta |
| S5 | Oyun (çark) | Küçük ekranda harf görsel hedefini 44-48px'e çıkar (hitbox mantığı korunur) | Hatalı komşu-harf seçimi (cihazda doğrulanmalı) | §27.6 | `media.css` değeri; düzen değişmez | Orta |
| S6 | Sonuç | Mührü tek bileşene indir (merkez/alt iki kod yolu yerine) | Yarışan sinyal/bilişsel yük | §27.8 | Davranış korunur, kod sadeleşir | Düşük |
| S7 | İpucu | İki-aşamalı onay veya "geri al" (yalnız onaylanırsa) | Kayıp-kaçınma; istemsiz harcama | §27.7 | Mevcut modal korunur, ara adım | Ürün kararı |
| S8 | Onboarding | Adım göstergesine "1/3" etiketi; atla seçeneği; son slayt doğrudan ilk seviyeye | İlk "zafer anı"; kontrol hissi | §27.3, §3.1 | Mevcut slayt yapısı korunur | Düşük |
| S9 | Sözlük/Keşif | Kelimeyi ilk bulunduğu seviye + keşif kartına linkle | İçerik dekor değil ödül; transfer | §27.10, §22 | Mevcut kart korunur, link eklenir | Orta |
| S10 | Sonuç | Yıldız etiketi "noHint" → "Tüm gizlileri ipucusuz bul" (gerçek ön koşul) | Beklenti netliği; adalet | §12.1 | Yalnız metin | Düşük |

## D. Açık ürün/UX kararları

1. **Erişilebilirlik kapsamı** (S1): çarkın ekran-okuyucu ile oynanabilirliği yayın
   gereksinimi mi, bilinçli kapsam-dışı mı?
2. **İpucu onayı** (S7): tek-dokunuş harcama korunsun mu, onay eklensin mi?
3. **Animasyon ayarları** (S3): OS reduced-motion yeterli mi, oyun-içi toggle gerekli mi?

## E. Plan §27 ekran sözleşmesi uyum durumu

| Ekran | Sözleşme | Durum |
| --- | --- | --- |
| §27.6 Oyun | <100ms tepki, mühür hak edilince, gizli "x/y" | ✅ büyük ölçüde; ⚠️ a11y (S1), dokunma hedefi (S4/S5) |
| §27.7 İpucu | Fiyat butonda açık | ✅ fiyat var; ⏳ onay (S7) |
| §27.8 Sonuç/Mühür | Kutlama + ödül + sonraki hedef | ✅; ⚠️ çift CTA (S6), KUSURSUZ ✅ artık çalışıyor |
| §27.3 Onboarding | ≤3 ekran, atla, tek kavram | ⚠️ atla yok, etiketsiz nokta (S8) |
| §27.10 Sözlük | İlk seviye + ustalık bilgisi | ⚠️ keşif linki yok (S9) |
| §29 Animasyon/a11y | Reduced motion, girdi engellenmez | ✅ girdi; ⚠️ oyun-içi toggle (S3), a11y (S1) |

## Uygulama durumu (2026-06-20)

Uygulandı (mevcut UI korunarak, doğrulandı — tsc/lint temiz, 893 test):
- **S10** etiket düzeltmesi (objectives.ts) ✅
- **S4** üst bar dokunma alanı ≥44px (game.css) ✅
- **S2** gizli kelime uzunluk ipucu (GameScreen + game.css) ✅
- **S6** mühür tek kod yolu (GameScreen) ✅
- **S1** çark erişilebilirliği ✅ — `.visually-hidden` (animations.css) + aria-live canlı
  bölgeler (seçilen harf + doğru/gizli/yanlış geri bildirim) + klavye-erişilebilir
  görünmez harf seçim listesi (GameScreen). Görsel UI değişmedi.
  ⚠️ CİHAZDA: TalkBack ile harf okuma, çift-okuma olmaması ve onay akışı doğrulanmalı.

- **S3** (Hareketi Azalt toggle) ✅ uygulandı — canlı bölge sakinleştikten sonra:
  `playerSave.ts` (reduceMotion: tip+default+sanitize `=== true`, v2, migration yok),
  `PersistenceContext.tsx` (state+persist+`setReduceMotion`), `PauseModal.tsx` (3. toggle,
  `aria-pressed`), `GameScreen.tsx` (Confetti + burst'ler + shake `!reduceMotion`'a bağlandı;
  bilgilendirici `sealReveal role="status"` korundu). `useGame` `...persistence` ile otomatik
  yayıyor. Test fixture güncellendi. 897 test geçiyor.
  ⚠️ CİHAZDA: toggle kalıcılığı (yeniden açılışta) ve efektlerin gerçekten kısıldığı doğrulanmalı.

Ertelendi:
- **S7** (ipucu onayı): ürün kararı.

İlk B maddeleri (KUSURSUZ ödülü vb.) önceki turda uygulanmıştı.

### S11 — Çark kalabalıklaşması (harf sayısı arttıkça) ✅ uygulandı
Tespit: ring ve taş boyutu sabit; üstelik `wheelRadius` harf çoğaldıkça KÜÇÜLÜYORDU
(36→34→30) — bu sıkışmayı artırıyor. Geometri (komşu merkez uzaklığı vs hitbox çapı,
ring %'si): 5-6 harfte taşlar görsel biniyor; 7 harf sınırda; **8 harfte hitbox'lar
çakışıyor** (komşu %23 < hitbox %25.5) → yanlış harf seçimi. L9 yeni 7 harf, plan
121+'da 8 harf hedefliyor → aktif sorun.
Çözüm (`src/game/wheelDrag.ts`): yarıçap harf çoğaldıkça AÇILIYOR (≤5→36, 6→37,
≥7→38; taş yarı-genişliği +%10 ile %50 ring kenarını aşmıyor). 8 harfte komşu %29 >
%25.5 → çakışma çözüldü; taşlar görsel binmiyor. `wheelDrag.test.ts` niyet-temelli
testlerle güncellendi (her harf sayısında hitbox çakışmaz + taş ring içinde kalır).
Ek olarak (ekip isteği "harf tahtası daha çok yer kaplasın"): 7-8 harfte ring de modest
büyütüldü (`game.css`, `data-letters` attribute kuralı: 68→74cqw / 248→268px·scale;
`min()` + `max-height:100%` dikey taşmayı sınırlar). Daha fazla mutlak aralık + daha
büyük taşlar. GameScreen ring'e `data-letters={letters.length}` işliyor.
⚠️ CİHAZDA: 7-8 harfli seviyede gerçek parmakla seçim isabeti ve kısa ekranda dikey
taşma olmadığı doğrulanmalı.
