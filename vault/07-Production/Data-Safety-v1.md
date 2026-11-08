# Google Play Data Safety v1

## Mevcut Sürüm Kararı

Paket: `com.sozustasi.game`

Sürüm: `1.1.0`

Söz Ustası kendi sunucusu üzerinden kişisel veya hassas kullanıcı verisi toplamaz ve satmaz. Oyun ilerlemesi ve ayarlar yalnızca cihazdaki local storage'da tutulur. Reklam gösterimi için Google AdMob SDK'sı (ve UMP/GDPR izin modülü) kullanılır; reklam kimliği ve cihaz bilgisi Google'ın kendi politikalarına göre işlenebilir.

## Play Console Cevap Taslağı

- Uygulama gerekli kullanıcı veri türlerinden herhangi birini topluyor veya paylaşıyor mu?: Evet (reklam gösterimi için üçüncü taraf SDK)
- Toplanan veri türleri (Play Console'da gönderilen, 2026-11-08): Cihaz veya diğer kimlikler, Yaklaşık konum, Uygulama işlemleri, Uygulama performansıyla ilgili diğer veriler. Hepsi **hem toplanan hem paylaşılan** (Google Mobile Ads SDK), kısa süreli işlenmiyor, zorunlu toplama. Amaçlar: Reklam veya pazarlama, Analiz, Dolandırıcılığı önleme. Uygulama işlevselliği/Geliştirici iletişimi/Kişiselleştirme/Hesap yönetimi işaretlenmedi. Hesap oluşturma ve dış hesapla giriş: yok.
- Açık kalem: Google'ın "Google Mobile Ads SDK Data safety disclosure" tablosunda listelenen Çökme günlükleri ve Tanılamalar türleri Play formunda seçilmedi; tabloyla karşılaştırılıp gerekirse eklenmeli.
- Veriler üçüncü taraflarla paylaşılıyor mu?: Evet — Google Mobile Ads SDK (AdMob) kendi gizlilik politikasına tabidir
- Veriler aktarım sırasında şifreleniyor mu?: Evet (HTTPS)
- Kullanıcı veri silme talebinde bulunabilir mi?: Sunucuda hesap veya kişisel veri tutulmuyor; Google reklam gizlilik tercihleri uygulama içinden (Ayarlar → Reklam Gizlilik Tercihleri) yönetilebilir
- Uygulama bağımsız güvenlik incelemesine sahip mi?: Hayır
- Çocuklar için özel veri toplama var mı?: Hayır. Uygulama 13+ genel kitledir, çocuklara yönelik değildir; reklamlar `tagForChildDirectedTreatment: false`, içerik sınırı ParentalGuidance ile işaretlenir ve UMP izin formu kullanılır (`src/services/admob.ts`, `AD_AUDIENCE`)

## Teknik Kanıt

- Android manifestinde kamera, mikrofon, konum veya kişi listesi izni yok.
- `INTERNET` izni yalnızca AdMob reklam gösterimi için bildirildi.
- Tek üçüncü taraf SDK: `@capacitor-community/admob` → `com.google.android.gms:play-services-ads`.
- Kullanıcı hesabı veya giriş sistemi yok; uygulama içi satın alma yok.
- Altın, seviye ilerlemesi, Söz Hazinesi ve ses/titreşim tercihleri yalnızca cihazdaki local storage alanında tutuluyor.
- Android sistem yedeklemesi manifest üzerinden kapatıldı.

## Değişiklik Kuralı

Aşağıdaki özelliklerden biri eklenirse Data Safety formu ve gizlilik politikası yayın öncesinde yeniden değerlendirilmelidir:

- Firebase Analytics veya Crashlytics
- AdMob dışında yeni reklam SDK'sı veya mediation ağı
- Uygulama içi satın alma
- Cloud save veya kullanıcı hesabı
- Push notification
- Remote Config
- Harici destek/iletişim formu

## Yayın Öncesi Gereken

- `public/privacy.html` dosyası HTTPS üzerinden herkese açık, düzenlenemez ve coğrafi olarak engellenmemiş bir URL'de yayınlanmalıdır.
- AdMob panelinde GDPR mesajı (UMP) oluşturulmalıdır.
- `app-ads.txt` dosyası geliştirici web sitesinin kök dizinine yayınlanmalıdır.
- Play Console "Ads" ve "Data safety" bölümleri bu belgeyle tutarlı doldurulmalıdır.

## Üçüncü Taraf Veri ve Lisans

- Bonus kelime listesi `tdd-ai/hunspell-tr` (MPL 2.0) kaynaklı adaylardan elle denetlenerek derlenmiştir; lisans metni ve yöntem `vault/07-Production/bonus-lexicon-v1/` altındadır. Ayarlar ekranında atıf vardır.
- Bonus kelime anlamları bu projede özgün yazılmıştır (`meanings.json`); TDK veya başka sözlükten kopyalanmaz. Kullanıcı verisi toplanmaz, bu bölüm yalnızca lisans yükümlülüğünü kayıt altına alır.
