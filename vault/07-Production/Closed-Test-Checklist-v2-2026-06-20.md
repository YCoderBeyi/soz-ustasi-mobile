# Closed Test Checklist v2 — 2026-06-20

`Closed-Test-Checklist-v1.md`'nin yerini alır (v1 bayattı: 1.0.0 / 120 seviye).
Bu sürüm gerçek mevcut duruma göre yazıldı. `[x]` = doğrulandı, `[ ]` = eksik.

## Paket

- [x] Package id: `com.sozustasi.game`
- [x] Version name: `1.0.15` · Version code: `17`
- [x] İmza yapılandırması mevcut (`android/app/build.gradle`)
- [ ] **Güncel imzalı AAB** — mevcut `SozUstasi-1.0.15-release.aab` 14:06'da üretildi
      ANCAK o tarihten sonra ~135 dosya değişti (bugünkü düzeltmeler + canlı veri/doubler
      işi). **BAYAT** → temiz ağaçta yeniden üretilmeli.
- [ ] **ProGuard mapping** — `1.0.15-mapping.txt` YOK (son mapping 1.0.14). Yeni build'de
      üretilip Play'e yüklenmeli (crash deobfuscation).
- [ ] APK/AAB imzası yeni build sonrası doğrulanmalı

## Uygulama (kod kalitesi — bugün doğrulandı)

- [x] `npm run audit:levels`: OK, **75 seviye** (NOT 120 — içerik eksik), 8 tema, 10 uyarı
- [x] `npm run audit:release`: OK, 1.0.15 / code 17
- [x] `npx tsc -b` geçti · `npx eslint` geçti · `npx vitest run` **896 test** geçti
- [x] Ses kontrolü · Titreşim kontrolü çalışıyor
- [x] **Hareketi Azalt** ayarı eklendi (reduced motion) — *cihazda doğrulanmalı*
- [x] Çark erişilebilirliği (aria-live + klavye seçimi) eklendi — *TalkBack ile doğrulanmalı*
- [x] Uygulama içi gizlilik metni var
- [x] İlerleme local save ile korunuyor (save v2)
- [ ] `npm run audit:plan`: **5 kritik, 4 önemli, 2 ikincil** — plan uyumu sağlanmadı
- [ ] Fiziksel cihazda smoke test (1., 45., 75. seviye geçişleri)
- [ ] Düşük RAM cihaz testi
- [ ] Android 10-11 cihaz testi
- [ ] Android 13-15 cihaz testi
- [ ] Bugünkü değişikliklerin (KUSURSUZ ödülü, çark, a11y, S3) cihazda doğrulanması

## Çalışma ağacı / sürüm kontrolü

- [ ] Branch `codex/professional-game-rebuild` — ~135 commit edilmemiş dosya
- [ ] Devam eden canlı düzenleme (`src/data`, `src/store/contexts`) bitirilmeli
- [ ] Değişiklikler commit edilmeli; release temiz ağaçtan alınmalı

## Play Console (hiçbiri tamamlanmadı)

- [ ] Geliştirici hesabı ve ödeme profili
- [ ] Uygulama kaydı
- [ ] Privacy policy HTTPS URL
- [ ] Data Safety formu
- [ ] İçerik derecelendirme formu
- [ ] Hedef kitle beyanı
- [ ] Reklam içeriyor mu: Hayır beyanı
- [ ] Uygulama erişimi: Giriş gerekmiyor beyanı
- [ ] Store listing metinleri
- [ ] 512×512 ikon
- [ ] 1024×500 feature graphic
- [ ] ≥2 gerçek uygulama ekran görüntüsü
- [ ] Kapalı test kullanıcıları

## Yayın Kararı

**Kapalı teste HAZIR DEĞİL.** Önce: (1) canlı düzenleme bitir + commit, (2) temiz
ağaçta güncel imzalı AAB + mapping üret, (3) en az 1 fiziksel cihazda smoke test,
(4) Play Console beyanları + store listing + grafikler. Production için ayrıca
`audit:plan` 5 kritik kapatılmalı ve içerik (75→hedef seviye, kart impact/today)
tamamlanmalı (bkz. plan §21 Definition of Done).
