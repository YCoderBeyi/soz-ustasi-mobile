# Release Readiness Report — 2026-06-20

Kapsam: Google Play yayın (kapalı test / production) hazırlık değerlendirmesi.
Yöntem: tam doğrulama zinciri + artifact/sürüm/git denetimi. Ağır `android:aab:release`
(gradle) build'i **çalıştırılmadı** — çalışma ağacı karışık (~135 commit edilmemiş
dosya, canlı düzenleme); o adım temiz ağaçta koşulmalı (aşağıda komutlar).

## Verdict: YAYINA HAZIR DEĞİL

Teknik kod kapıları yeşil, ama yayınlanabilir bir **paket** ve **Play Console kurulumu**
yok; içerik/plan borcu ve cihaz testi açık.

## Yeşil kapılar (2026-06-20 doğrulandı)

| Kapı | Sonuç |
| --- | --- |
| `npx tsc -b` | ✅ temiz |
| `npx eslint` | ✅ temiz |
| `npx vitest run` | ✅ 896 test |
| `npm run audit:levels` | ✅ OK (75 seviye, 8 tema, 10 uyarı) |
| `npm run audit:release` | ✅ OK (1.0.15, code 17) |
| İmza yapılandırması | ✅ mevcut (`android/app/build.gradle`) |

## Engelleyenler

1. **Bayat AAB**: `SozUstasi-1.0.15-release.aab` 14:06'da; sonrasında ~135 dosya değişti
   → bugünkü düzeltmeleri ve canlı veri/doubler işini içermiyor. Yeniden build şart.
2. **Mapping eksik**: `1.0.15-mapping.txt` yok (son: 1.0.14).
3. **Temiz olmayan ağaç**: ~135 commit edilmemiş dosya; `src/data`/`contexts` canlı düzenleniyor.
4. **Plan uyumu**: `audit:plan` 5 kritik / 4 önemli / 2 ikincil (eğri regresyonları, kelime
   tekrarları, kart impact/today 75/75 boş, anagram uygulanmamış, doubler yarım).
5. **İçerik eksik**: katalog 75 seviye (hedef 120/240).
6. **Play Console**: tüm beyanlar/listing/grafikler/test kullanıcıları eksik (bkz.
   `Closed-Test-Checklist-v2-2026-06-20.md`).
7. **Cihaz testi yok**: smoke / düşük RAM / Android 10-11 / 13-15 + bugünkü a11y/çark/efekt
   değişikliklerinin fiziksel doğrulaması.

## Temiz ağaçta çalıştırılacak release zinciri (B adımı)

Canlı düzenleme bitip değişiklikler commit edildikten SONRA:

```
git status                      # temiz olmalı
npm run audit:levels            # OK (0 error)
npm run audit:release           # OK
npm run audit:plan              # kritik sayısı hedeflenen seviyede mi?
npx tsc -b && npx eslint && npx vitest run
npm run android:aab:release     # imzalı AAB üretir
# → yeni AAB'yi artifacts'e + mapping.txt'yi sakla (1.0.15/1.0.16-mapping.txt)
```

Ardından: fiziksel cihaz smoke testi → Play Console beyanları + store listing →
internal/closed test track'e yükleme.

## Production ek koşulları (plan §21 Definition of Done)

- `audit:plan` kritikleri kapalı; içerik kartları (impact/today) dolu ve onaylı.
- Save migrasyon testleri; en az 2 fiziksel cihazda bölüm başı/sonu oynanmış.
- Kapalı test geri bildiriminde kritik tekrar/adaletsizlik yok.

## Not
Bu rapor bir anlık görüntüdür; çalışma ağacı canlı değiştiği için sayılar (test adedi vb.)
oynak olabilir. Build adımı bilinçli olarak ertelendi (karışık ağaç).
