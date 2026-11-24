# Reklam yayın hazırlığı v1 (2026-11-08)

Yayıncı kimliği: `pub-2784764635828379`. Reklam türleri (C+): oyuncu isteğiyle **standart ödüllü**; harita/LevelStart **üst banner**; bölüm sonrası frekanslı **geçiş (interstitial)**. Rewarded Interstitial kullanılmaz.

İlgili: [[Ad-Monetization-C-Plus-Architecture-v1]], [[Ad-Monetization-C-Plus-Implementation-Plan-v1]], [[Data-Safety-v1]], [[Release-Manifest-v1]], [[UA-App-Campaign-Draft-v1]]

## Kodda doğrulananlar (otomatik: `npm run audit:release`)
| Konu | Durum | Nasıl doğrulandı |
|---|---|---|
| `app-ads.txt` içeriği | Hazır | Kök ve `public/` kopyaları birebir `google.com, pub-2784764635828379, DIRECT, f08c47fec0942fa0`. Denetim bozulursa düşer. |
| Reklam kimlikleri | Üretim kimliği | Kaynakta Google örnek kimliği yok, tüm kimlikler bu yayıncıya ait. Bozma denemesiyle denetimin yakaladığı görüldü. |
| Üretim derlemesi test modunda mı | Hayır | `npm run build` çıktısında `isTesting:false`, örnek kimlik yok. |
| Kitle beyanı | 13+ genel kitle | `tagForChildDirectedTreatment: false`, içerik sınırı ParentalGuidance; paketin içinde görüldü. Mağaza kaydı ve gizlilik politikası aynı şeyi söylüyor. |
| Rıza reddedilirse | Reklam istenmez | `adsAllowed` koruması, 4 birim testi. |
| `AD_ID` izni | Var | 1.1.0 APK'nın birleşik manifestinde `com.google.android.gms.permission.AD_ID` (reklam SDK'sı getiriyor). |

## Senin yapman gerekenler (kod dışı, hiçbirini yapmadım)
1. **`app-ads.txt` yayını (engelleyici).** Play Console'daki geliştirici web sitesi alan adının kökünde `https://<alan-adı>/app-ads.txt` olarak yayınla. Alan adı belgelenmemiş; hangisini kullanacağını ben bilemem. AdMob > Uygulamalar > app-ads.txt durumunu kontrol et.
2. **Play Console: Reklam kimliği beyanı = Evet.** `AD_ID` izni pakette var, beyan tutarlı olmalı.
3. **Play Console: Hedef kitle = 13+**, "çocuklara yönelik" değil. Aksi hâlde kod ve gizlilik metni yanlış beyan olur.
4. **Play Console: Data safety.** Reklam kimliği, etkileşim ve tanılama verisi, veri paylaşımı "Evet" (`Data-Safety-v1.md` ile aynı).
5. **AdMob panelinde UMP (GDPR) mesajı** oluştur ve yayınla; ayrıca gizlilik seçenekleri mesajı. Oluşmadan Ayarlar > Reklam Gizlilik Tercihleri bir şey göstermez.
6. **AdMob'da uygulamayı mağaza girişine bağla** (uygulama yayınlandıktan sonra).
7. **Gizlilik politikasını herkese açık HTTPS adreste yayınla** (`public/privacy.html`) ve Play Console'a gir. Yayınlandığı belgelenmemiş.
8. **IARC içerik derecelendirme anketi.**

## Gerçek cihazda denenmesi gerekenler
- Banner birimi: `ca-app-pub-2784764635828379/3651252114` (Söz Ustası Android AdMob kaydı). Üretim derlemesi bu kimliği `.env.production.local` içindeki `VITE_ADMOB_BANNER_ID` değerinden alır.
- Geçiş (interstitial) birimi: `ca-app-pub-2784764635828379/3292115308`. Üretim: `VITE_ADMOB_INTERSTITIAL_ID`. Uygulama kimliği (zaten `strings.xml`): `ca-app-pub-2784764635828379~5793638649`.
- Banner harita ve seviye başlangıç (tanıtım) ekranlarında üstte gösterilir; oyun ekranına geçişte gizlenir. Her iki ekranda da banner için etkileşimsiz üst boşluk ayrılır. Banner yeni oluşturulduğu için canlı envanterin etkinleşmesi bir saate kadar sürebilir.
- Yeni bir release paketi üret ve kur. Mevcut `artifacts/SozUstasi-1.1.0-release.apk` **29 Ekim** tarihli, bugünkü reklam kodunu (rıza koruması, kitle beyanı) içermiyor.
- Rıza formu çıkıyor mu, reddedince hiç reklam istenmiyor mu?
- Ödüllü reklam: izle (ödül verilir), erken kapat (ödül yok), reklam yok/hata (oyun devam eder, bilgi mesajı).
- Günlük 6 reklam sınırı ve ertesi gün sıfırlanması.

## Bilinen sınırlar
- Günlük sınır cihaz saatine bağlı, saati değiştiren oyuncu aşabilir (politika ihlali değil).
- Web sürümünde reklam ve rıza akışı sessizce atlanır; yalnızca Android'de çalışır.

## Ödüllü Reklam Düzeltmeleri ve Test Düzeni (20 Kasım 2026)

- Ödüllü reklam için tekil istek kilidi eklendi; aynı anda gelen ikinci istek reklamı/ödülü çoğaltamaz.
- Yükleme, hazır olma, gösterim, erken kapatma, gösterim hatası ve ödül olayları tanılama kayıtlarına yazılır. Erken kapatma ödül vermez; reklam tamamlandığında ödül yalnızca bir kez işlenir.
- Reklam hazır değilse yeniden yükleme denenir. Başarısızlıkta ipucu ve ikinci şans akışları oyuncuya açıklama gösterir; reklam izlemeden devam yolu korunur.
- İpucu ekranında ve ikinci şansta reklam başlatılırken çift dokunma engellenir. Mağazaya isteğe bağlı “Reklam izle, 30 altın kazan” seçeneği eklendi; 30 altın sadece ödül callback'i geldikten sonra verilir.
- Tüm reklam yerleşimleri ortak günlük 6 izleme bütçesini kullanır. Ödüllü altın miktarı `src/data/shop.ts` içindeki `REWARDED_COIN_AMOUNT` sabitinden yönetilir.
- `npm run test:gameplay` oyunun DOM tabanlı etkileşim, reklam servisinin izin/ödül, mağaza ödülü ve modal senaryolarını tekrar çalıştırır. Gerçek reklam kreatifi veya görünsel tarayıcı denetimi yerine geçmez.
- Android debug derlemesinde eklentinin test modu Google'ın örnek rewarded reklam kimliğine yönlendirir; gerçek reklam kimliğine debug tıklaması gönderilmemelidir.
- Kullanıcının 15 Kasım ekran görüntüsünde Play Console sürümü `27 (1.2.2)`, yerel proje ise `versionCode 28 / 1.2.3` idi. Yayın öncesi Play Console'daki en güncel track/sürüm yeniden kontrol edilmeli; bu ekran görüntüsü bugünkü canlı durumu kanıtlamaz.

### Cihazda ödüllü reklam kabul kontrolü

1. `npm run test:gameplay` çalıştır; tüm senaryolar yeşil olmalı.
2. `npm run android:apk:debug` ile debug APK üret ve Android test cihazına kur. İlk açılışta rıza formu varsa seçim yap.
3. İpucu ekranından reklamı aç: test reklamı görünmeli; tamamlanınca yalnızca seçilen ipucu uygulanmalı.
4. Reklamı erken kapat: hiçbir ipucu/altın verilmemeli; normal oyun devamı çalışmalı.
5. Mağaza → Altın: “30 altın” açıklamasını gör; tamamlanan test reklamı +30 eklemeli, kapatılan/başarısız reklam eklememeli.
6. İkinci şansı iki hızlı dokunuşla tetikle: tek reklam açılmalı; reklamsız devam düğmesi reklam sırasında devre dışı olmalı.
7. Rızayı reddet veya reklamı yükleyemeyecek duruma getir: uygulama çökmemeli, ödül oluşmamalı, oyuncu normal akışa devam edebilmeli.
8. Günlük altı hak bitince tüm reklam seçenekleri kullanılamaz olmalı; yeni takvim gününde cihaz saatini değiştirerek değil, ertesi gün gerçek cihazda yeniden kontrol et.

Bu cihaz kabul kontrolü bu oturumda çalıştırılmadı. Google Play'e yükleme/yayınlama ve canlı Ad Inspector doğrulaması ayrıca yapılmalıdır.

### Play Store için sürüm notu taslağı

Söz Ustası'nda isteğe bağlı ödüllü reklam seçenekleri eklendi ve iyileştirildi. Reklamı tamamladığında ipucunu kullanabilir veya mağazada 30 altın kazanabilirsin. Reklam açılamaz ya da erken kapanırsa ödül verilmez; oyuna kaldığın yerden devam edebilirsin. Günlük reklam hakları tüm seçenekler arasında ortaktır.

## app-ads.txt doğrulaması ve yayın adresleri (2026-11-08, ölçüldü)
- **Dosya kusursuz:** `https://ycoderbeyi.github.io/app-ads.txt` -> `200 OK`, `text/plain; charset=utf-8`, yönlendirme yok, BOM yok, CR yok, 59 bayt, içerik birebir `google.com, pub-2784764635828379, DIRECT, f08c47fec0942fa0`. `http://` adresi `https://`'e 301 ile gidiyor.
- **Kök site artık Söz Ustası'nın (2026-11-08).** `https://ycoderbeyi.github.io` kökü: ana sayfa, `/privacy.html` (13+ beyanı), `/app-ads.txt`, `/favicon.png`; hepsi `npm run build:site` ile `public/` tek kaynaklarından üretilir. Kök daha önce TırıVırı Puantaj'ındı; o içerik silinmedi, `YCoderBeyi.github.io` deposunda `tirivirri-puantaj-site-backup` etiketinde (commit `9a37613`) ve yerelde `D:\ydTeknik\_relbuild	irivirri-site` içinde duruyor. TırıVırı yayına çıkmadan önce kendi adresine (ör. yeni bir `tirivirri-puantaj` deposu) taşınmalı. `app-ads.txt` yayıncı düzeyindedir, iki uygulamaya da yeter.
- **Söz Ustası adresleri:** Web sitesi `https://ycoderbeyi.github.io`, gizlilik politikası `https://ycoderbeyi.github.io/privacy.html` (eski `…/soz-ustasi-mobile/privacy.html` de güncel). Play Console'a bunları gir.
- AdMob "bilgileriniz eşleşmiyor" derse neden dosya değil, şunlardan biridir: (1) Play mağaza girişindeki **Web sitesi** alanı `https://ycoderbeyi.github.io` ile aynı alan adı değil ya da boş, (2) uygulamanın herkese açık mağaza girişi henüz yok (kapalı testte AdMob web sitesini okuyamaz), (3) tarama gecikmesi (24 saate kadar).

