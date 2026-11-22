# Plan Uyum Denetimi — 2026-06-20

Değerlendiren bakış açısı: oyun mekaniği mimarisi
Referans plan: `vault/07-Production/Soz-Ustasi-240-Level-Learning-Journey-Master-Plan-v1.md`
Yardımcı referans: `vault/07-Production/Levels-46-120-Professional-Rebuild-TODO.md`
Ölçülen kapsam: kataloğdaki 75 seviye (1-45 base + 46-75 elle yazılmış)
Tekrar üretim: `npm run audit:plan` (kritik ihlalde build kırmak için `npm run audit:plan -- --strict`)

## Yönetici özeti

`npm run audit:levels` "OK, 0 error" diyor; fakat bu yalnızca teknik geçerliliktir
(üretilebilirlik, normalize, yasaklı içerik). Mevcut release-gate audit'i, planın
mimari kurallarından belirgin biçimde daha gevşektir. Planın gerçek sözleşmesine göre
ölçüldüğünde bloklayıcı düzeyde uyumsuzluklar mevcuttur.

Özet: teknik olarak çalışan bir oyun var; planın "profesyonel oyun" sözleşmesi henüz
karşılanmıyor.

Audit gevşekliğinin somut kanıtı:
- Ana kelime tekrar mesafesi audit'te `< 10` seviye (`scripts/audit-levels.mjs:399`),
  plan ise `>= 40` istiyor (§6.4).
- Zorluk regresyon kontrolü yalnızca ilk 45 seviyede ve sadece "toplam harf yükü"
  üzerinden warning üretiyor; planın §7.3 hareketli-ortalama + %18 kuralı yok.
- `scripts/audit-levels.mjs:383` katalog boyutunu 75'e sabitliyor; hata mesajı ise
  "120 level olmalı" diyor (iç çelişki).

## 🔴 Kritik bulgular

### K1 — Katalog 75 seviye; plan 240 (yakın hedef 46-120) istiyor
Seviye 76-120 hiç yok. Rebuild TODO bunu doğruluyor: Paket 2 (71-95) 5/25,
Paket 3 (96-120) 0/25. `createMasteryLevels` runtime'dan çıkarılmış (✅ plan §14.1),
fakat `src/data/masteryLevels.ts` dosyası hâlâ duruyor ve audit loader tarafından
parse ediliyor — ölü kod.

### K2 — Zorluk eğrisi planın çekirdek vaadini ihlal ediyor (§7.3)
- 5 seviyelik hareketli ortalama 28 kez geriliyor (hedef: 0).
- 5 adet tek-adım düşüş %18'i aşıyor: L24 (-%19), L29 (-%23), L35 (-%19),
  L65 (-%18), L70 (-%24).
- Bu, planın §2.3'te "zorluk yanılsaması / testere dişi" olarak tanımladığı kök
  sorunun hâlâ canlı olduğunu gösterir.

### K3 — Tekrar mesafesi kuralları ihlal ediliyor (§6.4)
- Ana kelime (>= 40): KİTAP L23→L34 (mesafe 11), KİTAP L34→L57 (23) — KİTAP 3 kez
  ana hedef (plan: 240'ta en çok 2). KAT L31→L57 (26).
- Gizli kelime (>= 20): AL (14), AS (14), ALP (18), ER (13).

### K4 — Keşif kartı sözleşmesi (§5, §9) — YAPISAL OLARAK ÇÖZÜLDÜ (2026-06-20)
İlk denetimde `LevelStory` planın zorunlu alanlarını taşımıyordu. Bu turda tip
sözleşmesi kuruldu:
- `LevelStory`'ye `impact`, `today`, `sourceNotes`, `contentReviewStatus` eklendi
  (`src/types.ts`); RewardModal ve VaultScreen bunları koşullu render ediyor.
- `LevelData`'ya `chapterId` eklendi; 12-bölüm modeli `src/data/chapters.ts`
  (`chapterForLevel`, `isChapterFinale`, `isBigDiscovery`) + testleri eklendi.

Kalan: bu alanlar 75/75 kartta henüz boş → **editoryal içerik borcu** (Ö-yeni).
İçerik, plan §22 gereği doğrulanmadan doldurulmamalıdır; bu nedenle yapı kuruldu,
metin üretimi editoryal onaya bırakıldı. `discoveryId`/`objectives`/`DifficultyProfile`
ileri paketlerde eklenecek.

## 🟠 Önemli bulgular

### Ö1 — Zorluk bandı uyumsuzluğu: 28 ihlal (§7.1)
- Erken seviyeler fazla yüklü: L10-L19 çoğu 4 ana kelimeli (bant 2-3), ortalama
  uzunluk 4.3-4.5 (bant 2.5-4.0) → "güvenli başlangıç" ilkesine (§3.1) aykırı.
- 46-74 sık sık 7-8 harf (46-60 bandı 4-6; 61-120 bandı 5-7).
- L70 yalnızca 2 ana kelime (bant 3-5) ve en sert düşüşün olduğu seviye.

### Ö2 — Bölüm (chapter) mimarisi yok
Plan 12 bölüm × 20 seviye; her 20'de final mührü + bölüm geçidi; her 5'te büyük
keşif kartı. Kodda `chapterId`, bölüm finali zorluk kontrolü (>= %12 bölüm ortalaması
üstü), büyük-kart ayrımı yok.

### Ö3 — Görsel/tema kimliği 46-75 için çökmüş (§26)
46-75'in tamamı 2 temaya sıkışmış: `ottoman_library` (15) ve `seljuk_courtyard` (15).
3-6. bölümlerin atmosferi (Bilgelik Evleri turkuaz, optik zümrüt, astronomi gece
moru, Anadolu/Osmanlı İznik mavisi) uygulanmamış.

### Ö4 — Temsil dengesi karşılanamıyor (§4.1)
75 seviyede kadın bilim insanı içeriği ~0 (Meryem el-İcliyye/Uluğ Bey 81-100'e
planlanmış, o bölüm yok). 46-48 üç ardışık kart aynı kişi (Harezmi); mikro-macera
kurgusuyla kasıtlı olsa da §16.3 "aynı anlatının tekrarı" sınırına yakın — izlenmeli.

## 🟡 İkincil bulgular

- Gizli kelimesiz seviyeler: 1, 28, 43, 73. L1 giriş olarak kabul; 28/43/73
  "gizli kelime alışkanlığı" (Bölüm 2 mekanik hedefi) ile çelişiyor.
- Bulmaca dağılımı sağlıklı: 64 crossword / 11 anagram (~%15), planın "anagram seyrek"
  kuralına uygun (✅).

## Mimari öncelik sırası

| # | İş | Plan | Durum |
| --- | --- | --- | --- |
| 1 | Plan-audit aracı (`audit:plan`): 40/20 mesafe, hareketli ortalama, %18, bant | §16 | ✅ eklendi |
| 2 | Tip sözleşmesi: LevelStory impact/today/sourceNotes/contentReviewStatus + chapterId + chapters.ts | §5, §9 | ✅ yapı kuruldu (içerik borcu kaldı) |
| 3 | 1-75 zorluk eğrisini yeniden dengele (28 gerileme + 5 ani düşüş) | §7 | ⏳ sırada |
| 4 | KİTAP/KAT/AL/AS/ALP/ER tekrarlarını ayıkla | §6.4 | ⏳ |
| 5 | 46-120'yi bölüm temaları + chapter yapısıyla tamamla | §4, §26 | ⏳ |
| 6 | Keşif kartlarına editoryal impact/today + kaynak/onay doldur (75/75 boş) | §9.1 | ⏳ |

Bu sıra, planın §24 "İlk Uygulama Sırası" maddesiyle birebir örtüşür: önce ölç ve
audit'i sertleştir, sonra dengele, sonra içerik üret.

## Doğrulama
İlk denetim (tip sözleşmesi öncesi): 5 kritik, 2 önemli, 1 ikincil.
Tip sözleşmesi sonrası (2026-06-20):
- `npm run audit:plan`: 4 kritik, 3 önemli, 2 ikincil (K4 yapısal olarak çözüldü;
  içerik borcu önemli/ikincile düştü).
- `npm run audit:levels`: OK, 75 level, 9 warning (release-gate değişmedi).
- `npx tsc -b`: temiz. `npx vitest run`: 883/883 geçti (chapters testleri dahil).
- `npx eslint`: temiz.
