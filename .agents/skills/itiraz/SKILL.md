---
name: itiraz
description: Söz Ustası oyununda kullanıcı istediğinde tasarım ve oyun akışı önerilerini kaynaklı danışman değerlendirmesiyle sorgula ve doğrulanan iyileştirmeleri uygula.
---

# İtiraz: oyun danışmanlığı

Kıdemli oyun tasarımı, erişilebilirlik ve motor performansı perspektiflerini kullan. Yapay zekâ rol değerlendirmesini insan danışman görüşü gibi sunma. Kullanıcı danışman ajanlar istediyse bağımsız salt okunur değerlendirme al; aksi halde roller aynı ajan tarafından yürütülebilir.

Önce [diagnose](../diagnose/SKILL.md) ile kanıt topla. Her öneriyi şu sorularla sorgula: Hangi oyuncu sorunu çözülüyor? Kaynak ve gözlem nedir? En basit çözüm nedir? Stresi veya bilişsel yükü artırır mı? Hangi karşı örnekte başarısız olur? Nasıl doğrulanır?

Güncel birincil kaynakları araştır, erişim tarihini ve bağlantıları raporla. Kaynak bilgisini, kod bulgusunu ve tasarım varsayımını ayır. Zevk, rahatlama veya FPS artışını oyuncu testi/ölçüm olmadan kanıtlanmış sayma.

Rahatlatıcı oyunlarda zaman baskısı, cezalandırıcı geri bildirim, zorunlu reklam, yoğun efekt, kaybolan ilerleme ve zor motor hareketlerine özellikle itiraz et. Keşif, geri alınabilir giriş, görünür alternatif kontroller, hareket/ses seçenekleri ve kesintisiz devamı değerlendir. Oyuncunun tercihi olmadan ekonomi ve zorluk dengesini değiştirme.

Motor önerisini aktif render yolundan çıkar; kullanılmayan 3D bileşenleri optimize ederek aktif ekran hızlandı deme. Önce tekrar hesaplama, giriş işleme, yaşam döngüsü ve varlık yükünü incele. SSOT: kayıt/tercih PersistenceContext, kelime gönderimi SessionContext, geometri wheelDrag, kelime verisi mevcut data modüllerinde kalır. SOLID: ortak sorunu ortak bileşende çöz, ekranlara kopyalama.

Kabul/ertele/ret kararını gerekçesi ve kabul ölçütüyle raporla. Yetkilendirilmiş, geri alınabilir düzeltmeleri uygula. Kullanıcı açıkça istemedikçe test paketi ekleme veya çalıştırma; çalıştırılmayan doğrulamayı yapılmış gibi bildirme. Görsel kullanım testini kaynak incelemesiyle eşitleme.

## SSOT, SOLID ve UI uygulama kapısı

Değişiklikten önce ilgili ekran akışını, mevcut bileşenleri, varlıkları ve durumun sahibi olan context/modülü incele. SSOT kararını uygulamadan önce açıkça doğrula: kayıt ve tercihler `PersistenceContext`, kelime/oturum akışı `SessionContext`, çark geometrisi `wheelDrag`, kelime içeriği mevcut data modüllerinde kalır. Aynı gerçeği ikinci bir state, sabit, storage anahtarı veya ekrana özel kopya olarak üretme.

Grilling olumlu ve yapıcı olsun: kişiyi veya emeği değil, varsayımı ve tasarım kararını sorgula. Kanıtlanmış işlev/erişilebilirlik kusurunu öznel görsel tercihten ayır; eleştiriyi önem ve oyuncu etkisine göre sırala; her önemli itirazla birlikte uygulanabilir çözüm veya doğrulama ölçütü ver. Kanıt yoksa kesin hüküm verme, küçük tercihleri yüksek öncelikli sorun gibi büyütme ve çözülen kapsamın dışına taşma.

SOLID uygula: sorumluluğu doğru sahibi olan modülde tut; gerçekten ortak davranışta ortak bileşen kullan; yalnızca görünüş benziyor diye farklı anlamdaki eylemleri zorla tek bileşene birleştirme. Değişiklikleri istenen akışla sınırla ve kullanıcının mevcut çalışma ağacındaki ilgisiz düzenlemeleri koru.

UI/UX düzeltmesinde ölçülebilir sorunu ve yeniden üretim adımını belirle. Etkileşimli alanın tamamı görünür ve tıklanabilir olmalı; arka plan artwork'ü hit-area ile hizalanmalı. Uçtan uca yaymada artwork oranını bozma: doğal oranı koru veya kontrollü `object-fit: fill` değişikliğini gerçek küçük ve normal ekran görüntülerinde karşılaştır. Güvenli kenar paylarını, çentik/safe-area, metin ölçeklemesini ve 44 px asgari dokunma alanını koru.

Animasyon eylem yanıtını geciktirmesin, metin ya da kontrolü örtmesin, yanıp sönme veya sürekli dikkat çekme yaratmasın. Mevcut `reduceMotion` tercihi ve `prefers-reduced-motion` desteğini gözet; kısa giriş/basış geri bildirimi ile sürekli parıltıyı aynı şey sayma. Mümkünse tarayıcıda en küçük desteklenen ve standart viewport'ta gerçek ekran görüntüsü al; yoksa görsel doğrulama sınırını raporla.

Asset hygiene: Before adding or retaining assets, search runtime references and inspect production bundle contents. Remove confirmed-unused, superseded, intermediate, and generated preview files; do not move them into archives merely to avoid deletion. Keep only assets with a verified runtime or documented source/provenance purpose. Recheck APK/AAB size after asset changes.

## Editoryal bütünlük ve senaryo bağı

Her seviyeyi ve ekran akışını tek metin olarak değil, oyuncunun uçtan uca gördüğü bağlı sözleşme olarak denetle: kelime/hedef → harf havuzu → ipucu → hikâye/bilgi kartı → mühür/yıldız → gerçek ödül → sonraki ekran. Profil/sıralama, mağaza, reklam, ayarlar ve onboarding için de vaat → gerçek durum → başarı/iptal/hata dönüşünü eşleştir. Kelime, anlam, fiyat, ödül, ilerleme veya tercih verisini ikinci bir sabit kaynağa kopyalama.

Her akışta uygulanabilir boş, kilitli, seçili, yükleniyor, tamamlandı, hata, çevrimdışı, tekrar giriş/çift dokunma, küçük ekran/büyük yazı, klavye odağı ve azaltılmış hareket senaryolarını kontrol et. Her içerik için Türkçe yazım/anlam/doğallık, hedefin harflerle kurulabilirliği, ipucunun adil oluşu, anlatı ile olgu uyumu ve kaynakların iddiayı desteklemesi ayrı değerlendirilir. AI veya test sonucu bağımsız insan editoryal incelemesi değildir.

Her bulguyu ID/ekran/seviye, yeniden üretim, beklenen-gerçek sonuç, kök neden, düzeltme ve yeniden doğrulama kanıtıyla kaydet. Otomasyon yapısal tutarlılığı destekler; anlamı, oyuncu anlaşılırlığını veya gerçek cihaz görünümünü tek başına kanıtlamaz. Denenmemiş alanı açıkça belirt; çelişki, yanlış vaat veya kopuk geçiş varsa yayın onayı verme. Kapsamın tümü ve senaryo kanıtları raporlanmadan “uçtan uca tamam” deme.
