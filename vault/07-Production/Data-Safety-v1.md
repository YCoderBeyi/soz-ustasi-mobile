# Google Play Data Safety v1

## Mevcut Sürüm Kararı

Paket: `com.sozustasi.game`

Sürüm: `1.0.0`

Kod ve Android manifest taramasına göre bu sürüm kişisel veya hassas kullanıcı verisi toplamıyor ve üçüncü taraflarla paylaşmıyor.

## Play Console Cevap Taslağı

- Uygulama gerekli kullanıcı veri türlerinden herhangi birini topluyor veya paylaşıyor mu?: Hayır
- Veriler aktarım sırasında şifreleniyor mu?: Uygulanamaz; sunucuya veri aktarımı yok
- Kullanıcı veri silme talebinde bulunabilir mi?: Sunucuda hesap veya kişisel veri tutulmuyor
- Uygulama bağımsız güvenlik incelemesine sahip mi?: Hayır
- Çocuklar için özel veri toplama var mı?: Hayır

## Teknik Kanıt

- Android manifestinde kamera, mikrofon, konum, kişi listesi veya depolama izni yok.
- Gereksiz `INTERNET` izni kaldırıldı.
- Paket analizinde yalnızca AndroidX tarafından eklenen uygulama-içi dinamik receiver koruma izni görüldü; hassas sistem izni yok.
- Firebase, Analytics, reklam, ödeme veya crash reporting SDK'sı yok.
- Kaynak kodda ağ isteği yapan `fetch`, Axios veya benzeri istemci yok.
- Kullanıcı hesabı veya giriş sistemi yok.
- Elmas, level ilerlemesi, Söz Hazinesi ve ses/titreşim tercihleri yalnızca cihazdaki local storage alanında tutuluyor.
- Android sistem yedeklemesi manifest üzerinden kapatıldı.

## Değişiklik Kuralı

Aşağıdaki özelliklerden biri eklenirse Data Safety formu ve gizlilik politikası yayın öncesinde yeniden değerlendirilmelidir:

- Firebase Analytics veya Crashlytics
- AdMob veya başka reklam SDK'sı
- Uygulama içi satın alma
- Cloud save veya kullanıcı hesabı
- Push notification
- Remote Config
- Harici destek/iletişim formu

## Yayın Öncesi Gereken

`public/privacy.html` dosyası HTTPS üzerinden herkese açık, düzenlenemez ve coğrafi olarak engellenmemiş bir URL'de yayınlanmalıdır. Play Console ve uygulama içindeki politika aynı veri uygulamalarını anlatmalıdır.
