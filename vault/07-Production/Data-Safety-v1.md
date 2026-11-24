# Google Play Data Safety v1

İlgili: [[Ads-Readiness-v1]], [[Release-Manifest-v1]], [[Ad-Monetization-C-Plus-Architecture-v1]]

## Mevcut Sürüm Kararı

Paket: `com.sozustasi.game`

Bu belge önceki `1.2.9` (versionCode `34`) sürümünü esas alan bir taslaktı. `1.2.10` (versionCode `35`) sürümünde isteğe bağlı Google Play Games oturumu ve leaderboard skor gönderimi de vardır; eski Console cevap taslağı bu sürüm için geçerli kabul edilmemelidir.

Söz Ustası kendi sunucusunda kullanıcı hesabı veya oyun profili tutmaz ve kullanıcı verisini satmaz. Oyun ilerlemesi ve ayarlar cihazdaki local storage'da tutulur. İsteğe bağlı Play Games ligine katılan kullanıcı Android'de Google Play Games hesabıyla oturum açar. Katılım açıkken ve Sakin Mod kapalıyken seviye tamamlandığında o seviyenin puanı haftalık leaderboard'a, toplam yıldız puanı all-time leaderboard'a gönderilir. Lig görüntüleme çağrıları public leaderboard koleksiyonunu kullanır; oyuncu adı/profil görünürlüğü Google Play Games hesap ayarlarına bağlı olabilir. Google AdMob SDK'sı ve UMP de kullanılır; ilgili veriler Google hizmetleri kapsamında işlenebilir.

## Play Console Cevap Taslağı

- Bu bölüm, 2026-11-08 tarihli eski AdMob beyan notlarını korur; `1.2.10` için güncel Play Console seçimi değildir. Hangi veri türü/kategori/amaç/isteğe bağlılık cevabının seçileceği, Google Play Console ve güncel Google Mobile Ads ile Play Games Services veri açıklamaları incelenerek belirlenmelidir. Burada PGS için Console cevabı uydurulmamıştır.
- Açık kalem: Google'ın "Google Mobile Ads SDK Data safety disclosure" tablosunda listelenen Çökme günlükleri ve Tanılamalar türleri Play formunda seçilmedi; tabloyla karşılaştırılıp gerekirse eklenmeli.
- Veriler üçüncü taraflarla paylaşılıyor mu?: Eski taslakta yalnızca AdMob kaydedilmişti. 1.2.10 için Console beyanı AdMob ve Play Games Services davranışıyla yeniden karşılaştırılmalıdır.
- Veriler aktarım sırasında şifreleniyor mu?: Eski taslakta HTTPS olarak kaydedilmişti; güncel hizmet davranışı ve Console beyanı ayrıca doğrulanmalıdır.
- Kullanıcı veri silme talebinde bulunabilir mi?: Uygulamada PGS skorlarını silen bir akış yoktur. Katılımı kapatmak yeni gönderimleri durdurur, geçmiş skorları silmez; Play Games verilerinin yönetimi Google hesabı/hizmeti üzerinden ayrıca incelenmelidir.
- Uygulama bağımsız güvenlik incelemesine sahip mi?: Hayır
- Çocuklar için özel veri toplama var mı?: Hayır. Uygulama 13+ genel kitledir, çocuklara yönelik değildir; reklamlar `tagForChildDirectedTreatment: false`, içerik sınırı ParentalGuidance ile işaretlenir ve UMP izin formu kullanılır (`src/services/admob.ts`, `AD_AUDIENCE`)

## Teknik Kanıt

- Android manifestinde kamera, mikrofon, konum veya kişi listesi izni yok.
- `INTERNET` izni AdMob ile Play Games Services bağlantıları için kullanılır.
- Üçüncü taraf entegrasyonları: `@capacitor-community/admob` (AdMob) ve `@modbender/capacitor-play-games` (Play Games Services).
- Söz Ustası hesabı yok; Android'de lig katılımı için isteğe bağlı Google Play Games oturumu vardır. Uygulama içi satın alma yok.
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
- Play Games Services leaderboard veya hesap akışında değişiklik

## Yayın Öncesi Gereken

- `public/privacy.html` dosyası HTTPS üzerinden herkese açık, düzenlenemez ve coğrafi olarak engellenmemiş bir URL'de yayınlanmalıdır.
- AdMob panelinde GDPR mesajı (UMP) oluşturulmalıdır.
- `app-ads.txt` dosyası geliştirici web sitesinin kök dizinine yayınlanmalıdır.
- Play Console "Ads" ve "Data safety" bölümleri 1.2.10 binary'si, AdMob/UMP ve Play Games Services'in güncel veri açıklamaları incelenerek doldurulmalı ve gönderilmiş beyan yeniden doğrulanmalıdır. Bu taslak, Console'da seçilecek cevapları kesinleştirmez.

## Üçüncü Taraf Veri ve Lisans

- 2026-11-25 itibarıyla MPL 2.0 Hunspell-Tr'den türetilmiş bonus kelime katmanı, üretim kodu, üretim betiği ve türetilmiş veri dosyaları kaldırıldı. Çalışan bonus sözlüğü `src/game/bonusDictionary.ts` içinde tutulur.
- Uygulama yine AdMob ve Google Play Games Services gibi üçüncü taraf SDK'ları kullanır. Bu not içerik/veri kökeni notudur; SDK lisanslarının veya tüm görsel, ses ve font varlıklarının hak denetiminin tamamlandığı anlamına gelmez.
