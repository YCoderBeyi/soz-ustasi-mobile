<div align="center">
  <h1>Söz Ustası</h1>
  <p>
    <strong>Harfleri birleştir, Türkçe kelimeleri keşfet ve söz mühürlerini aç.</strong>
  </p>
  <p>
    <img src="https://img.shields.io/badge/sürüm-1.0.0-gold" alt="Version 1.0.0" />
    <img src="https://img.shields.io/badge/platform-Android-brightgreen" alt="Platform Android" />
    <img src="https://img.shields.io/badge/license-All%20Rights%20Reserved-red" alt="All Rights Reserved" />
  </p>
</div>

---

## Oyun Hakkında

**Söz Ustası**, harfleri sürükleyerek kelimeler oluşturduğun Türkçe bir kelime bulmaca oyunudur.

Her bölümde harfleri doğru sırayla birleştir, çengel bulmaca düzenindeki kelimeleri tamamla ve Söz Mührü'nü aç. Bulduğun kelimelerin kısa anlamlarını incele, gizli kelimeleri Söz Hazinesi'ne ekle ve Türkiye'nin farklı kültürel atmosferlerinden esinlenen temalarda ilerle.

## Özellikler

- **Tek elle oynanabilen sürükle-bırak harf mekaniği**
- **Çengel bulmaca düzeninde dinamik kelime alanları**
- **45 seviye, 8 özgün tema** (Eski İstanbul, Kapadokya, Ege, Anadolu, Karadeniz, Nemrut, Osmanlı, Selçuklu)
- **Kelime anlamları ve kısa öğrenme kartları**
- **Gizli kelimeler ve Söz Hazinesi koleksiyon sistemi**
- **İnternet bağlantısı gerektirmeyen oynanış**
- **Zorunlu reklam veya kullanıcı takibi içermeyen ilk sürüm**
- **Gerçek cihazda çalışan imzalı Android APK/AAB**

## Ekran Görüntüleri

> *Yakında eklenecek.*

## Kullanılan Teknolojiler

| Katman | Teknoloji |
|--------|-----------|
| UI | React 19, TypeScript |
| Derleme | Vite 7 |
| Mobil | Capacitor 8 (Android) |
| Test | Vitest 4 |
| Kalite | ESLint 9, TypeScript strict |
| State | React Context (sıfır bağımlılık) |

## Başlarken

```bash
# Bağımlılıkları yükle
npm install

# Geliştirme sunucusunu başlat
npm run dev

# Build al
npm run build

# Testleri çalıştır
npm test

# Lint kontrolü
npm run lint
```

## Proje Yapısı

```
soz-ustasi-mobile/
├── src/
│   ├── components/     # 10 yeniden kullanılabilir UI bileşeni
│   ├── screens/        # 5 ekran (Splash, Onboarding, Map, Game, Vault)
│   ├── store/          # GameContext (React Context state yönetimi)
│   ├── game/           # 5 saf mantık modülü + testleri
│   ├── styles/         # 12 modüler CSS dosyası
│   └── data/           # 45 seviye, 8 tema, hikaye kartları
├── scripts/            # Audit ve yardımcı scriptler
├── vault/              # Ürün/mimari dokümantasyon
├── android/            # Capacitor Android projesi
├── artifacts/          # İmzalı release APK ve AAB
└── public/             # Statik assetler, ikonlar, splash
```

## Android Yayın

Proje Google Play yayınına hazırdır. İmzalı release paketleri `artifacts/` dizininde bulunur.

```bash
# Android SDK kontrolü
npm run android:doctor

# Release AAB oluştur
npm run android:aab:release

# Release APK oluştur
npm run android:apk:release

# USB bağlı cihaza kur
npm run android:install:release

# Release audit
npm run audit:release
```

İmzalama için `android/keystore.properties` dosyasına ihtiyaç vardır. Örnek yapılandırma `android/keystore.properties.example` dosyasında bulunabilir.

## İçerik

| Metrik | Değer |
|--------|-------|
| Seviye sayısı | 45 |
| Tema sayısı | 8 |
| Toplam harf havuzu | 45 benzersiz set |
| Yasaklı kelime filtresi | 27 desen (küfür, hakaret, şiddet, uyuşturucu, ayrımcılık, dini hassasiyet) |
| Test sayısı | 41 (5 test dosyası) |

## Test

```bash
# Tüm testleri çalıştır
npm test

# Seviye içerik audit
npm run audit:levels

# Release audit
npm run audit:release
```

## Lisans

© 2026 Yaşar DEREBAŞI. Tüm hakları saklıdır.

Bu projenin kaynak kodları görüntülenebilir ancak izinsiz kullanılamaz, kopyalanamaz, değiştirilemez veya yeniden dağıtılamaz.

## İletişim

**Yaşar DEREBAŞI** — [GitHub](https://github.com/YCoderBeyi)
