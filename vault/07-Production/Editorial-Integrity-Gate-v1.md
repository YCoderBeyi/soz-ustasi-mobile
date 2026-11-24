# Editoryal Bütünlük ve Akış Kapısı v1

**Kapsam:** Yayınlanan her seviye, seviye başlangıcı, oyun, ipucu, ödül, başarı, harita, profil/sıralama, mağaza, ayarlar ve tanıtım akışı. Bu kural; mevcut 75 seviyeyi, yeni içerikleri ve sonsuz seviye üreticisinin tüm desteklenen çıktısını kapsar.

## Temel kural

Bir içerik parçası tek başına iyi yazılmış diye onaylanmaz. Oyuncunun gördüğü vaat, hedef, oynanış, geri bildirim, ödül, hikâye ve bir sonraki adıma geçiş aynı gerçeği anlatmalıdır. Bir adımın dayandığı kelime, veri veya ödül başka bir kaynaktan farklılaşamaz. Belirsizlik, yanlış vaat veya çözümsüz akış bağı varsa içerik `BLOCKED` kalır.

## Her seviye için editoryal sözleşme

- Ana/gizli kelime; harf havuzundan doğru Türkçe karakterleriyle kurulabilir, anlamı doğal ve tek hedefli, yaş/kültür açısından uygun olmalıdır. Zorunlu hedeflerin yaygınlığı ve fiil biçimi `word-quality-v1` kapısından geçmelidir.
- İpucu, hedef cevabı veya cevabı tekilleştiren bilgiyi erken ifşa etmemeli; oyuncuyu yanlış yöne de göndermemelidir. İpuçları kademeli, isteğe bağlı ve aynı kelime anlamıyla tutarlı olmalıdır.
- Seviye başlığı, dönem/yer/kişi, hikâye, hedef kelime, bilgi kartı ve günümüz bağlantısı arasında açık bağ bulunmalıdır. Tarihsel/olgusal anlatıdaki iddialar birincil veya güvenilir kaynaklarla desteklenmeli; kaynağın sözü kopyalanmamalı, yorum olgu gibi yazılmamalıdır.
- Puan, altın, yıldız, mühür, sandık ve reklam vaatleri tek ekonomi/ödül kaynağıyla aynı miktar ve koşulu göstermelidir. Başarısız, yarım bırakılmış, yeniden açılmış ve tekrar tıklanmış akışta ödül iki kez verilmemelidir.
- CTA ve durum metni, oyuncunun mevcut durumunu ve basınca ne olacağını açıkça söylemelidir. Kilitli, boş, yükleniyor, çevrimdışı, hata, tamamlandı ve yeniden deneme durumları için sonraki güvenli eylem görünür olmalıdır.

## Uçtan uca senaryo matrisi

Her ekran/özellik için uygulanabilir olan senaryolar gerçek etkileşimle veya açıkça adlandırılmış otomasyonla doğrulanır; yalnız kaynak okuması kullanıcı akışı testi sayılmaz:

1. İlk açılış, onboarding'i geçme/tekrar açma, kayıtlı oyuncu ve temiz kayıt.
2. Haritada açık/kapalı/seçili/tamamlanmış seviye; geri dönüş ve devam.
3. Seviye başlangıcından oyun tahtasına; hedefi anlama ve başlatma.
4. Doğru, yanlış, tekrar, bonus, Türkçe harf, ipucu, karıştırma, duraklatma, uygulamayı arka plana alma ve geri dönme.
5. Son hedef, mühür, ödül/ödül verilmemesi, tamamlanma ekranı ve sonraki seviyeye geçiş.
6. Reklamın hazır, yüklenemedi, erken kapandı ve tamamlandı durumları; yalnız vaat edilen durumda tek ödül.
7. Günlük görev, mağaza yetersiz/yeterli bakiye, satın alma/ödül başarısı ve vazgeçme.
8. Profil, opt-in/opt-out, sıralama boş/yüklü/hata ve kullanıcının kendi satırını bulması.
9. Ayar değişikliğinin anında ve yeniden açılış sonrası etkisi; geri/kapama ve klavye odağı.
10. En küçük desteklenen ve standart mobil görünüm, metin ölçekleme, taşma/kesilme, azaltılmış hareket, sessiz mod ve erişilebilir adlar.

İlgisiz senaryo “uygulanamaz” diye gerekçelendirilir. Görsel/oyuncu etkisi için ekran görüntüsü, test kaydı veya yeniden üretim adımı tutulur. Simülasyon sonucu gerçek cihaz ya da oyuncu testi gibi sunulmaz.

## Kabul ölçütü

- Her içerik ID'sinin kelime-hedef-hikâye-bilgi-ödül-geçiş bağı izlenebilir ve tutarlıdır.
- Her görünen vaat, başarılı ve başarısız durumlarda doğru sonuç verir; aynı ödül/ilerleme iki ayrı yerde bağımsızca tanımlanmaz.
- Türkçe yazım, anlam, noktalama, ton ve terimler editoryal kontrolden geçer; mekanik test, anlamsal doğruluğun yerine geçmez.
- Tüm yüksek/orta bulgular kapatılır veya gerekçeli biçimde ertelenir; yayın engelleyici bulgu kalmaz. Kapsam dışı/denenmemiş alan açıkça raporlanır.
- AI ile üretilen içerik ve medya için kaynak/üretici, tarih, model veya servis, prompt özeti, referans girdiler ve hakları, insan düzenlemesi ve benzerlik kontrolü kaydedilir. Bu bilgiler eksikse `BLOCKED`.

## Grilling soruları

- Oyuncu her adımda nerede olduğunu, ne bulacağını ve geri dönüş yolunu anlayabiliyor mu?
- Hikâyenin adı, dönemi ve hedef kelime neden aynı seviyede? Oyuncunun keşfi gerçek bir bağ kuruyor mu?
- Bir metin ödül, süre, sıralama veya reklam hakkında gerçekte olmayan bir sonuç mu vaat ediyor?
- Hata, çevrimdışı durum, tekrar giriş veya ekranı daraltma içerik bağını koparıyor mu?
- Otomasyon yalnızca yapıyı mı doğruluyor; anlam, kültürel uygunluk ve editoryal kalite için insan incelemesi var mı?

“Bütün akış tamam” ifadesi ancak kapsam, senaryo matrisi ve kanıtlar raporlanmışsa kullanılabilir. Yapay zekâ değerlendirmesi bağımsız insan editör incelemesi diye gösterilemez.
