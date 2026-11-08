# Söz Ustası Kabul Sonrası Ana TODO

Tarih: 21 Haziran 2026  
Başlangıç sürümü: `1.0.17` (`versionCode 20`)  
Mevcut kapsam: 75 özgün seviye  
Durum: Uygulama sırası onaylı

## Değişmez Ürün Kuralları

- Oyuncu ilerlemesi hiçbir güncellemede sessizce sıfırlanmaz.
- Oyuncu istemeden otomatik ipucu veya cevap verilmez.
- Ana yolculukta runtime seviye klonlama yapılmaz.
- AI içeriği insan onayı olmadan yayın kataloğuna girmez.
- Rekabet ödeme gücüne değil bilgi, doğruluk ve keşfe dayanır.
- Zorunlu reklam, yapay kıtlık ve cezalandırıcı seri dili kullanılmaz.
- Her sürümde test, lint, build, level audit ve release audit geçer.
- Yeni SDK, izin veya veri akışı eklenirse Play beyanları yayın öncesinde güncellenir.

## Faz 0 - Kapalı Test ve Stabilizasyon

Hedef: `1.0.17` sürümünün gerçek cihazlarda güvenilirliğini kanıtlamak.

### Test Organizasyonu

- [ ] Kapalı test bağlantısını hazırla ve doğrula.
- [ ] En az 12 test kullanıcısının katılımını tamamla.
- [ ] En az 14 gün kesintisiz kapalı test yürüt.
- [ ] Telefon modeli, Android sürümü ve ekran ölçüsü çeşitliliğini kaydet.
- [ ] Geri bildirimleri P0, P1, P2 ve P3 olarak sınıflandır.
- [ ] Her hata için tekrar üretme adımı, ekran görüntüsü ve sürüm kodu kaydet.

### Öncelikli Smoke Testler

- [ ] L31: `TAKI` seçimi ve noktalı/noktasız I davranışını doğrula.
- [ ] L46: 7 harfli çemberde sıkışma ve dokunma doğruluğunu kontrol et.
- [ ] L66: `BİLET` kelimesi ve ödül akışını doğrula.
- [ ] L70: `ETER` anlam kartının doğru görüntülendiğini doğrula.
- [ ] Mühür açılışı ve ödül penceresinin kısa ekranda taşmadığını doğrula.
- [ ] Harita yıldızlarının seviye sonuçlarıyla eşleştiğini doğrula.
- [ ] Tekrar oynanan seviyenin sınırsız altın üretmediğini doğrula.
- [ ] Uygulama güncellemesinin ilerleme, altın, yıldız ve ayarları koruduğunu doğrula.
- [ ] Ses, müzik ve efekt kontrollerini telefon hoparlörü ve kulaklıkla dene.
- [ ] Çevrimdışı açılış ve tam oynanış akışını doğrula.

### Teknik İzleme

- [ ] Play Console crash ve ANR raporlarını günlük kontrol et.
- [ ] Pre-launch report sonuçlarını incele.
- [ ] Android 8, 11, 13, 15 ve mümkünse 16 üzerinde davranışı kontrol et.
- [ ] Düşük RAM cihazda 30 dakikalık oturum testi yap.
- [ ] Kayıt kaybı ve ilerleme kilidi için regresyon testi çalıştır.

### Faz 0 Çıkış Kriteri

- [ ] P0 yayın engelleyici hata: `0`.
- [ ] P1 oyuncu ilerlemesini bozan hata: `0`.
- [ ] Crash/ANR kabul edilebilir Play kalite sınırlarında.
- [ ] 12 kullanıcı ve 14 gün koşulu tamamlandı.
- [ ] Üretim erişimi başvurusu gönderildi.

Karar: Kritik sorun çıkarsa yalnız düzeltme içeren `1.0.18`; aksi durumda Faz 1.

## Faz 1 - v1.1.0 Öğrenme ve Tutundurma

Hedef: Oyuncuya her gün geri dönmek için faydalı ve çevrimdışı bir sebep vermek.

### Kelime Öğrenme Sistemi

- [ ] Çevrimdışı Bugünün Kelimesi veri modelini tasarla.
- [ ] Günlük bulmaca seçiminde cihaz tarihi kötüye kullanımını sınırla.
- [ ] Usta Defteri ekranını ve kalıcı kelime koleksiyonunu geliştir.
- [ ] Zorlanılan kelimeleri otomatik fakat şeffaf biçimde işaretle.
- [ ] 1, 3, 7 ve 14 günlük aralıklı tekrar kuyruğu geliştir.
- [ ] Haftalık öğrenme özeti oluştur.
- [ ] Öğrenilen, tekrar edilen ve ipucusuz çözülen kelime sayılarını göster.

### Kelime Kabulü

- [ ] Çevrimdışı bonus sözlüğünü genişlet.
- [ ] Ana, gizli, bonus, geçersiz ve bilinmeyen kelime durumlarını kesin ayır.
- [ ] Geçerli bonus kelimede küçük ve tek seferlik ödül ver.
- [ ] Bilinmeyen üretilebilir dizide seriyi bozmayan nötr geri bildirim göster.
- [ ] Aynı kelimenin aynı seviyede tekrar ödül üretmesini engelle.
- [ ] Uygunsuz, özel ad, kısaltma ve çekimli biçim filtrelerini test et.

### Görsel, Ses ve Erişilebilirlik

- [ ] Ortak hareket tokenları ve 3D easing sistemi oluştur.
- [ ] Ana, gizli, bonus, yanlış ve bilinmeyen kelime efektlerini ayrıştır.
- [ ] Mühür, yıldız, seri ve altın animasyonlarını ortak kaliteye getir.
- [ ] Canlı Mürekkep harf bağlantısı prototipini performans testiyle değerlendir.
- [ ] Efekt, müzik ve ana ses için ayrı seviye kontrolleri sun.
- [ ] Hareket azaltma seçeneği ekle.
- [ ] Düşük performanslı cihazlar için sade efekt modu ekle.
- [ ] Orta sınıf Android cihazda hedef 60 FPS, alt kabul sınırı 45 FPS ölç.

### Faz 1 Çıkış Kriteri

- [ ] Günlük sistem internet olmadan çalışıyor.
- [ ] Aralıklı tekrar mevcut kaydı bozmuyor.
- [ ] Bonus kelime ödülleri ekonomi açığı oluşturmuyor.
- [ ] 30 dakikalık oturumda timer, DOM veya bellek birikimi yok.
- [ ] Store görselleri yeni öğrenme değerini doğru anlatıyor.

## Faz 2 - v1.2.0 Özgün İçerik ve Kişiselleştirme

Hedef: Ana yolculuğu 75 seviyeden 120 özgün seviyeye çıkarmak ve zorluğu oyuncuya göre düzenlemek.

### Seviye 76-120

- [ ] 45 yeni seviyenin bölüm, tema ve öğrenme haritasını kilitle.
- [ ] Her seviyeye özgün harf havuzu, ana kelime ve gizli kelime yaz.
- [ ] Önceki seviyelerle tekrar mesafesi kurallarını uygula.
- [ ] Her seviyeyi üretilebilirlik ve bulmaca bağlanabilirliği açısından doğrula.
- [ ] Bilim insanı, eser, buluş ve tarihsel gelişme kartlarını kaynaklandır.
- [ ] İslam medeniyeti, Anadolu, kadın bilim insanları ve küresel tarih dengesini denetle.
- [ ] Kelime havuzu ile bilgi kartı arasında semantik bağ kur.
- [ ] İnsan editör onayı ve içerik kaynak defteri olmadan seviyeyi yayınlama.

### Adaptif Zorluk

- [ ] Cihaz içi oyuncu beceri puanı modelini tasarla.
- [ ] Çözüm süresi, yanlış deneme, ipucu ve tekrar başarısını ölç.
- [ ] Hızlı başarı sonrası kontrollü meydan okuma sun.
- [ ] Art arda zorlanma sonrası isteğe bağlı toparlanma seviyesi sun.
- [ ] Yardımı anlam, uzunluk ve harf açma olarak kademelendir.
- [ ] Adaptif sistemin ana seviye çözülebilirliğini değiştirmesini engelle.
- [ ] Kişiselleştirmeyi ayarlardan kapatılabilir yap.

### Görev ve Ekonomi

- [ ] Günlük ve haftalık görev kataloglarını oluştur.
- [ ] Ustalık Mücadelesi için isteğe bağlı geri sayım modu geliştir.
- [ ] Süreli modun ana ilerlemeyi veya yıldızı cezalandırmasını engelle.
- [ ] Altının ipucu dışındaki kullanım alanlarını aç: kozmetik mühür, tema ve koleksiyon.
- [ ] Altın kaynak/gider simülasyonu ve kötüye kullanım testleri yap.
- [ ] Satın alınan her öğenin kullanım yerini mağazada açıkça göster.

### Faz 2 Çıkış Kriteri

- [ ] 120 seviyenin tamamı özgün ve audit sonucu hatasız.
- [ ] Zorluk eğrisi kontrollü yükseliyor; bölüm başlarında açıklanmış toparlanma var.
- [ ] Mevcut 75 seviye ilerlemesi güncelleme sonrası korunuyor.
- [ ] Tüm tarihsel içerik kaynak ve telif denetiminden geçmiş.

## Faz 3 - v1.3.0 Paylaşım ve Eşzamansız Rekabet

Hedef: Oyunun bilgisini ve keşif hissini bozmadan sosyal geri dönüş yaratmak.

- [ ] Spoiler içermeyen paylaşılabilir Mühür Kartı tasarla.
- [ ] Kartta başarı, süre ve görsel mühür bulunmasını; cevap bulunmamasını sağla.
- [ ] Aynı günlük harf havuzuyla eşzamansız mücadele geliştir.
- [ ] Arkadaş davet bağlantısı ve güvenli deep-link akışı ekle.
- [ ] Puanı doğruluk, gizli kelime, ipucusuz çözüm ve çeşitlilikten üret.
- [ ] Rastgele deneme ve tekrar puanı istismarını engelle.
- [ ] Haftalık lig ve Gölge Düello prototipini kapalı grupta test et.
- [ ] Hesap silme, veri dışa aktarma ve güvenlik süreçlerini hazırla.
- [ ] Gizlilik politikası ve Data Safety formunu sunucu davranışıyla güncelle.

### Faz 3 Çıkış Kriteri

- [ ] Pay-to-win avantajı yok.
- [ ] Sunucu tarafında skor doğrulaması ve hız sınırlaması var.
- [ ] Hesap ve sosyal özellikler çocuk güvenliği incelemesinden geçmiş.
- [ ] Rekabet tek oyunculu öğrenme akışını bozmuyor.

## Faz 4 - v1.4.0 Kontrollü AI Kelime İncelemesi

Hedef: Oyuncunun anlamlı kelime keşiflerini güvenli ve editoryal bir süreçle kataloğa kazandırmak.

- [ ] Sözlük dışı kelimeler için kullanıcı onaylı inceleme kuyruğu geliştir.
- [ ] AI anahtarlarını yalnız sunucuda tut.
- [ ] Yaygın, nadir, çekimli, özel ad, kısaltma, argo, hatalı ve anlamsız sınıflarını tanımla.
- [ ] AI sonucunu güvenilir sözlük veya Türkçe dil aracıyla doğrula.
- [ ] İnsan editör onay ekranı ve değişiklik geçmişi oluştur.
- [ ] Uygunsuz içerik filtresi, hız sınırı ve kötüye kullanım denetimi ekle.
- [ ] Onaylanmamış AI kelimesinin ödül, seviye veya sözlükte görünmesini engelle.
- [ ] Katkı veren oyuncuya ödeme avantajı sağlamayan rozet sistemi ekle.
- [ ] AI maliyeti, hata oranı ve editör yükü için pilot rapor hazırla.

### Faz 4 Çıkış Kriteri

- [ ] AI tarafından doğrudan yayınlanan içerik sayısı `0`.
- [ ] Her kabul edilen kelimenin kaynak ve editör kaydı var.
- [ ] Kişisel veri, güvenlik ve çocuk güvenliği incelemeleri tamamlandı.

## Faz 5 - v1.5.0 ile v2.0.0 Yaşayan Oyun

Hedef: 240 özgün seviyeli, etik biçimde sürdürülebilir öğrenme platformu oluşturmak.

### 240 Seviyelik Yolculuk

- [ ] 12 bölüm x 20 seviyelik ana yolculuğu tamamla.
- [ ] Her bölüm için farklı sanat yönü, kelime teması ve bilgi ekseni oluştur.
- [ ] Tekrarları yalnız açıkça belirtilen Ustalık Atölyesi içinde kullan.
- [ ] Her 5 seviyede keşif kartı, her 20 seviyede bölüm finali sun.
- [ ] Tartışmalı tarihsel iddiaları kaynak ve editör denetiminden geçir.

### Canlı İçerik

- [ ] Sezonluk görev ve tematik turnuva altyapısı kur.
- [ ] Moderasyonlu topluluk kelime katkısı geliştir.
- [ ] Oyuncuya özel fakat denetlenmiş öğrenme rotaları oluştur.
- [ ] Usta Defteri, Kök Ağacı ve koleksiyon sistemlerini birleştir.

### Etik Para Kazanma

- [ ] Önce retention, memnuniyet ve ekonomi verilerini değerlendir.
- [ ] Zorunlu reklamsız model ilkesini koru.
- [ ] Yalnız isteğe bağlı ödüllü reklamı kontrollü deney olarak değerlendir.
- [ ] Tek seferlik Usta Paketi fiyat ve içerik testini yap.
- [ ] Satın alma geri yükleme ve ebeveyn korumasını uygula.
- [ ] Para ödeyen oyuncuya rekabet avantajı verme.

## Her Sürüm İçin Zorunlu Kalite Kapısı

- [ ] Önceki sürümden güncelleme testi ilerlemeyi koruyor.
- [ ] Birim, bileşen ve kritik E2E testleri geçiyor.
- [ ] `npm run lint` geçiyor.
- [ ] `npm run build` geçiyor.
- [ ] `npm run audit:levels` sıfır hatayla geçiyor.
- [ ] `npm run audit:release` sıfır hatayla geçiyor.
- [ ] En az iki fiziksel Android cihazda smoke test tamamlanıyor.
- [ ] Kritik erişilebilirlik ve küçük ekran kontrolleri geçiyor.
- [ ] Yeni assetlerin lisansı ve kaynağı kayıtlı.
- [ ] Gizlilik politikası ve Play beyanları gerçek binary davranışıyla aynı.
- [ ] Version code artırılmış, imzalı AAB/APK ve R8 mapping üretilmiş.
- [ ] Artifact SHA-256 değerleri release manifestine yazılmış.
- [ ] Kademeli dağıtım ve geri alma kararı belgelenmiş.

## Uygulama Sırası

1. Faz 0 kapalı test ve stabilizasyon.
2. Faz 1 çevrimdışı öğrenme ve temel tutundurma.
3. Faz 2 özgün 120 seviye, adaptif zorluk ve ekonomi.
4. Faz 3 güvenli paylaşım ve eşzamansız rekabet.
5. Faz 4 insan onaylı AI kelime incelemesi.
6. Faz 5 240 seviye, sezonlar ve etik gelir modeli.

Sonraki faz, önceki fazın çıkış kriterleri tamamlanmadan başlamaz. Kritik güvenlik,
kayıt kaybı, ilerleme kilidi veya içerik doğruluğu sorunu varsa yeni özellik çalışması
durdurulur ve stabilizasyon önceliklendirilir.

## Taslak Öneri - Haz Sistemi (onay bekliyor, sıra henüz belirlenmedi)

Kaynak: 2026-11-07 tasarım istişaresi. Bu bölüm onaylı uygulama sırasının parçası değildir.

### H1 - Bonus Kelime Sözlüğü (kapalı izin listesi)
- [ ] hunspell-tr (MPL 2.0) yalnızca aday üretici olarak kullanılır; kabul listesi level başına kapalı ve çift geçişle onaylıdır.
- [ ] MPL 2.0 lisans metni ve atıf Ayarlar > Hakkında ve Data-Safety belgesine eklenir.
- [ ] Bonus kelime anlamı TDK'dan kopyalanmaz.

### H2 - Puan ve Çarpan
- [ ] Bonus coin azalan getiri (3, 2, 1, 1, 0), 5 kelime sınırı kalkar.
- [ ] `score.ts`: çarpan 1 / 1.5 / 2 / 3, yanlışta bir kademe düşer, sıfırlanmaz; çarpan coin vermez.
- [ ] Sakin mod: zaman erimesi varsayılan kapalı.
- [ ] Level sonu skor ekranı ve kişisel rekor.

### H3 - Dinamik Kutucuk Görünümü (yeni, 2026-11-07)
Fikir: kelime kutucukları level ve puan/çarpan kademesine göre görünüm değiştirir (şeker, meyve, blok vb.). Akıcı geçiş, ön planda haz ve kazanma hissi.
- [ ] Tasarım kuralları: harf okunabilirliği her skin'de korunur; kutucuk boyutu/çözünürlüğü sabit kalır.
- [ ] Marka kuralı: Minecraft, Candy Crush vb. marka veya trade dress kullanılmaz; özgün "blok" ve "şeker" stili çizilir.
- [ ] Skin = veri (tema paketi), motor kodu skin'den bağımsız.
- [ ] Performans: three.js sahnesinde ortak materyal/atlas, yeni büyük görsel varlık yok; düşük cihaz testi.
- [ ] Çarpan kademesi atlayınca kutucuk "evrimleşir" (düz > parlak > altın); level ortasında tema değişimi yok.
- [ ] Erişilebilirlik: yüksek kontrast ve hareketi azalt seçeneği.

#### H3 karar kaydı (2026-11-07, grilling sonucu)
- Karar: **level'a bağlı otomatik skin** (1-10 klasik, sonra şeker > meyve > blok, her 10 level). Level içinde asla değişmez. Kademe atlayınca yalnızca **evrim** (düz > parlak > altın) olur.
- Reddedilen: kilitli koleksiyon (kilit/eksiklik hissi "yapay kıtlık yok" kuralına ters, ek seçim ekranı kapsamı). İleride yalnızca **görülmüş** skinler arasından oyuncu seçimi eklenebilir; kilitli slot gösterilmez.
- Kural: harf kontrastı her skin'de ≥ 4.5:1; hareketi azalt ve sakin modda evrim animasyonsuz; skin = CSS/SVG veri paketi, yeni büyük görsel yok.
- Kod: `src/game/tileSkins.ts` (saf, testli). Bekleyen: `WordPuzzle.tsx` hücrelerine sınıf bağlama + 3 skin CSS'i + kontrast testi.
