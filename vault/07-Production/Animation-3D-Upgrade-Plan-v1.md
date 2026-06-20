# Söz Ustası 3D Animasyon Geliştirme Planı

## Amaç

Mevcut geri bildirimleri daha fazla hareket ekleyerek değil; tutarlı derinlik,
malzeme, ışık, zamanlama ve ses ilişkisi kurarak profesyonel mobil oyun
kalitesine yükseltmek.

## Ürün Kararı

- Emoji tepkileri ödül değil, nadir sürpriz geri bildirimi olacak.
- Yıldız, altın, seri veya seviye ilerlemesi emoji sistemine bağlanmayacak.
- Kelime girişi animasyon sırasında engellenmeyecek.
- Aşağılayıcı, yetişkin, sağlık, din, milliyet veya kimlik çağrışımlı kelimeler
  eğlenceli tepki tetiklemeyecek.
- İlk katalog yalnızca elle denetlenmiş güvenli kelime zincirlerinden oluşacak.

## Güvenli İlk Kelime Zincirleri

- LAMA / MALA
- KAP / KAPI / KALP
- YAYLA / YAYA / AYLA / ALAY
- NEDER / NERE
- BALON / BALO / BOL
- VADİ / VALİ / VİDA
- KOKU / KOKLA / KOK
- MASAL / SALMA / ASMA / ALMA
- OLAY / ONAY / OYA / OYNA
- PATİKA / PATİK / PATİ

## Yasaklı Eğlenceli Tepki Kategorileri

- Hakaret veya argo çağrışımı: MAL, ADİ
- Yetişkin çağrışımı: DİK
- Sağlık hassasiyeti: SARA
- Din ve kimlik: DİN, İLAH, RUM, TÜRK, ÇİN
- Bedensel mizah riski: GAZ, BUT

Bu kelimeler sözlükte kalabilir; özel emoji veya mizah metni üretmez.

## 3D Hareket Sistemi

### Katmanlar

Her önemli efekt en fazla dört görsel katmandan oluşur:

1. Gölge ve temas katmanı
2. Ana 3D nesne veya sembol
3. Işık halkası, parıltı veya parçacık
4. Kısa metin ve emoji

### Hareket İlkeleri

- Giriş: 180-260 ms, hızlı ve okunaklı
- Vurgu/bekleme: 300-500 ms
- Çıkış: 180-300 ms
- Toplam kelime tepkisi: 800-1200 ms
- Mühür finali: en fazla 1600 ms
- Sıçrama yerine ağırlık hissi veren scale, rotateX/rotateY ve gölge değişimi
- Tek ekranda aynı anda en fazla iki yüksek dikkatli animasyon
- Sonsuz parlamalar yalnızca aktif eylem çağrısında kullanılacak

## Animasyon Öncelikleri

### P0 - Oynanış Geri Bildirimi

- Doğru ana kelime: taş/harf yüzeyinde kabartma, ışık geçişi ve kısa derinlik darbesi
- Gizli kelime: altın keşif halkası, katmanlı parçacık ve kontrollü kamera-olmayan zoom
- Bonus kelime: küçük sandık/jeton derinlik efekti
- Yanlış kelime: ekran sallamak yerine çarkta yerel elastik geri tepme
- Bilinmeyen kelime: nötr mavi dalga; hata veya ceza hissi vermemeli

### P1 - İlerleme ve Ödül

- Altın artışı: sayaç yönüne hareket eden 3-5 jeton, tek seferlik sayaç darbesi
- Seri rozeti: 3x, 5x ve 8x için farklı malzeme ve yoğunluk
- Yıldız kazanımı: sırayla yerleşen 3D yıldızlar; kazanılmayan yıldızlar mat kalır
- Mühür: yüzeye çarpma, kısa deformasyon, ışık halkası ve parçacık sonlanması
- Harita yıldızı: seviye sonucu ile aynı veriden beslenen kısa yerleşme animasyonu

### P2 - Emoji Sürprizleri

- Bölüm başına en fazla iki tepki
- Tepkiler arasında en az 30 saniye veya dört başarılı kelime
- Aynı emoji art arda gösterilmez
- Aynı kelime aynı oturumda tekrar tepki üretmez
- Büyük tepki yaklaşık 15-20 uygun keşifte bir
- Başlangıç metinleri:
  - Yaratıcı keşif!
  - Bunu beklemiyorduk!
  - Günün gülümseten kelimesi
  - Harflerden harika dönüşüm!

## Teknik Mimari

- `SessionContext` içinde ödül mantığından bağımsız `WordCelebration` olayı
- Olay alanları: benzersiz id, tür, kelime, tepki seviyesi ve emoji
- Yeni saf sunum bileşeni: `WordCelebration3D`
- Animasyon seçimleri merkezi bir katalogdan yapılacak
- CSS değişkenleriyle ortak süre, easing, derinlik ve parlama tokenları
- Aynı olay kimliği tekrar kullanılamaz; art arda gelen olaylar animasyonu yeniler
- Oyun kaydı ve ekonomi bu olaydan etkilenmez

## Performans ve Erişilebilirlik

- `prefers-reduced-motion` durumunda parçacıklar ve dönüşler kaldırılır
- Düşük kalite modunda blur, büyük gölge ve parçacık sayısı azaltılır
- Animasyonlar transform ve opacity ağırlıklı hazırlanır
- Oyun girişlerini örten katmanlar `pointer-events: none` kullanır
- Dekoratif emojiler `aria-hidden` olur; gerekli bilgi metin/toast ile iletilir
- Orta sınıf Android cihazda oynanış sırasında hedef 60 FPS, kabul sınırı 45 FPS
- Tek animasyon için sürekli layout ölçümü veya React render döngüsü kullanılmaz

## Test ve Kabul Ölçütleri

- Ana, gizli, bonus, yanlış ve bilinmeyen kelime olayları ayrı test edilir
- Art arda iki keşifte olay kimliği ve animasyon yenilenir
- Seviye başlangıcında geçici animasyon durumu temizlenir
- Emoji sistemi altın, yıldız, seri ve kayıt verisini değiştirmez
- Hareket azaltma modu görsel bilgi kaybına yol açmaz
- Küçük ve büyük telefonlarda taşma/ezilme görülmez
- 30 dakikalık oynanışta birikmiş timer veya DOM düğümü kalmaz
- Fiziksel düşük RAM cihazında kare hızı ve dokunma gecikmesi ölçülür

## Uygulama Sırası

- [ ] Hareket tokenları ve ortak 3D easing sistemi
- [ ] Doğru/gizli/bonus/bilinmeyen/yanlış kelime efektleri
- [ ] Altın, seri ve yıldız animasyonları
- [ ] Mühür açılışının katmanlı 3D yeniden tasarımı
- [ ] Denetlenmiş emoji kelime kataloğu
- [ ] `WordCelebration` olay modeli ve `WordCelebration3D`
- [ ] Hareket azaltma ve düşük kalite modu
- [ ] Birim, bileşen ve fiziksel cihaz performans testleri
- [ ] Mağaza ekran görüntüsü ve tanıtım videosunun yenilenmesi

## Sürümleme

- v1.0.x: yalnız yayın engelleyici animasyon hataları
- v1.1.0: P0, P1 ve güvenli ilk emoji kataloğu
- v1.1.1: cihaz geri bildirimlerine göre süre ve yoğunluk ayarı
- v1.2.0: oyuncu tercihine göre eğlenceli tepkiler ve efekt kalitesi ayarı
