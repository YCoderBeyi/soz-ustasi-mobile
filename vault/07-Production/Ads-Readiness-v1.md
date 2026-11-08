# Reklam yayın hazırlığı v1 (2026-11-08)

Yayıncı kimliği: `pub-2784764635828379`. Reklam türü: yalnızca ödüllü reklam (oyuncu isteğiyle).

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
- Yeni bir release paketi üret ve kur. Mevcut `artifacts/SozUstasi-1.1.0-release.apk` **29 Ekim** tarihli, bugünkü reklam kodunu (rıza koruması, kitle beyanı) içermiyor.
- Rıza formu çıkıyor mu, reddedince hiç reklam istenmiyor mu?
- Ödüllü reklam: izle (ödül verilir), erken kapat (ödül yok), reklam yok/hata (oyun devam eder, bilgi mesajı).
- Günlük 6 reklam sınırı ve ertesi gün sıfırlanması.

## Bilinen sınırlar
- Günlük sınır cihaz saatine bağlı, saati değiştiren oyuncu aşabilir (politika ihlali değil).
- Web sürümünde reklam ve rıza akışı sessizce atlanır; yalnızca Android'de çalışır.
