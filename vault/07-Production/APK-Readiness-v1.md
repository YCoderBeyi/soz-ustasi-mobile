# APK Readiness v1.0.0

## Karar

Android SDK D: sürücüsüne kuruldu. İmzalı release APK ve Google Play AAB paketi başarıyla üretildi. Teknik paketleme zinciri çalışıyor; mağaza yayını öncesinde gerçek cihaz testi, privacy/data safety ve mağaza içeriği tamamlanmalı.

## Yapılan 6 Phase Özeti

| Phase | Değişiklik | Durum |
|-------|-----------|-------|
| 1 | 5 harf havuzu düzeltmesi (L16, L32, L33, L36, L45) | ✅ |
| 2 | Fisher-Yates shuffle (biased sort düzeltildi) | ✅ |
| 3 | 18 kelime tekrarı + 12 arkaik kelime yenileme | ✅ |
| 4 | StoryBanner (inline story) + Favoriler (favoriteWords toggle) | ✅ |
| 5 | Coin progresyonu düzeltmesi (L3, L5, L7, L8 plateaus) | ✅ |
| 6 | Test + audit doğrulama | ✅ |
| 7 | Level Design Review: zorluk skalası 1-5, sawtooth eğrisi, ödül dengesi | ✅ |

## Audit Sonucu

- **Phase öncesi**: 22 uyarı
- **Phase sonrası**: 10 uyarı (sadece normalize artefaktları + ortak kelime tekrarları)
- **Level Design Review v1 sonrası**: 0 hata, 10 uyarı (değişmedi)
- **Karar**: Hata yok, yayınlanabilir.

## Hazır Olanlar

- React/Vite build + lint + TypeScript temiz geçiyor.
- 496 test, 7 test dosyası, tamamı geçiyor.
- Oynanabilir kelime seçimi var (Fisher-Yates shuffle).
- Harita, level kilidi, ödül ve Söz Hazinesi akışı var.
- StoryBanner: level inline story'si oyun ekranında kapatılabilir banner.
- Favoriler: anlam kartında yıldız toggle, VaultScreen'de filtreleme.
- Tema arka plan asset sistemi var.
- Ses Web Audio API ile üretiliyor (dosya bağımlılığı yok).
- Level audit scripti: 12 kategori, 45 level.
- 45 level yayın adayı içerik (tüm Phase 1-3-5 + Level Design Review v1 düzeltmeleri uygulandı).
- Coin progresyonu zorlukla ölçekleniyor: baseCoin = 15 + levelId×1.8 + avgDiff×5 (L1: ~20, L45: ~115).
- Gizli kelime ödülleri artırıldı (3-4 → 5-15 coin), 17 yeni gizli kelime eklendi (43→60).
- Yasaklı içerik filtresi: 26 desen (faiz, borç, yarat*, kumar, bahis, vb.).
- Level sonrası hikaye/bilgi kartları 45 levelle eşleşiyor.
- Capacitor Android projesi oluşturuldu.
- `npm run android:sync` çalışıyor ve web çıktısını Android projesine kopyalıyor.
- Modern app icon ve splash kaynakları eklendi.
- Debug ve release APK/AAB scriptleri eklendi.
- Release signing şablonu eklendi: `android/keystore.properties.example`.
- Android SDK preflight scripti eklendi: `npm run android:doctor`.
- Android SDK yolu tanımlandı: `D:/Android/Sdk`.
- Release keystore oluşturuldu ve repo dışında `D:/Android/keys/sozustasi-release.jks` altında tutuluyor.
- Play Console hesabı açıldı.
- Gizlilik politikası Vercel'de yayında: `https://sozustasi-privacy.vercel.app/privacy.html`
- Feature graphic + 5 ekran görüntüsü HTML şablonu: `public/play-store-assets.html`
- Store listing metinleri hazır: `vault/07-Production/Google-Play-Listing-v1.md`
- Data safety dokümantasyonu hazır: `vault/07-Production/Data-Safety-v1.md`
- Kıdemli oyun mimarı denetimi tamamlandı — 30+ bulgu, yayına engel yok.
- İmzalı release APK üretildi: `artifacts/SozUstasi-1.0.0-release.apk`.
- İmzalı AAB üretildi: `artifacts/SozUstasi-1.0.0-release.aab`.
- APK package id doğrulandı: `com.sozustasi.game`.
- APK sürümü doğrulandı: `versionCode=2`, `versionName=1.0.0`.
- Uygulama etiketi doğrulandı: `Söz Ustası`.
- APK v2 imzası ve AAB JAR imzası doğrulandı.

## Eksikler

- [ ] Store listing'e feature graphic + 5 ekran görüntüsü yükleme
- [ ] Content rating formu doldurma
- [ ] Data safety formu doldurma
- [ ] 20 test hesabı ekleme ve kapalı test başlatma
- [ ] 14 gün kapalı test bekleme süresi (Play Console yeni politika)
- [ ] Gerçek cihaz test matrisi (5 cihaz profili)
- [ ] Production yayını

## APK Üretim Adımları

1. Ortamı kontrol et: `npm run android:doctor`.
2. Release APK üret: `npm run android:apk:release`.
3. Google Play AAB üret: `npm run android:aab:release`.
4. USB debugging açık bağlı cihaza kur: `npm run android:install:release`.
5. Çıkan dosyaları gerçek cihaz test matrisinde doğrula.

## Artifact Hashleri

- APK SHA-256: (v1.0.0 — rebuild sonrası yeni hash)
- AAB SHA-256: (v1.0.0 — rebuild sonrası yeni hash)

## Cihaz Test Matrisi

- Küçük ekran Android telefon.
- Büyük ekran Android telefon.
- Düşük RAM cihaz.
- Android 10-11 aralığı.
- Android 13-15 aralığı.

## Sürüm Kararı

İç test ve kapalı test için release APK/AAB paketleri hazır. Google Play production yayını için gerçek cihaz testleri, store assetleri, privacy/data safety beyanları ve reklam/IAP kararları tamamlanmalı.
