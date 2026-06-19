# Söz Ustası Audiovisual Atmosphere Design

Tarih: 20 Haziran 2026

## Amaç

Söz Ustası'nın görsel, ses ve animasyon dilini tek bir profesyonel atmosfer altında birleştirmek.
Ana hedef, oyunu sadece "güzel görünen" bir ürün değil; keşif hissi veren, premium duran ve
oyuncuyu yormadan elde tutan bir deneyim haline getirmektir.

Bu tasarım, mevcut 3D katmanları ve ekran sistemlerini değiştirmekten çok, onların ortak
stil kurallarını sabitler.

## Ürün Kararı

Ana deneyim şu kombinasyona dayanır:

- Ana his: merak ve keşif
- Görsel ton: sıcak ve davetkar
- 3D yoğunluk: zarif ve premium
- Baskın malzeme: altın / bronz
- Arka plan atmosferi: gece-kütüphane
- Mekansal kimlik: bilgelik evi
- Stil: yarı gerçekçi
- Işık: altın akşam ışığı

Bu kararların amacı oyunu soğuk, teknik veya aşırı gösterişli bir yüzeyden uzak tutmaktır.
Vurgu anlarında sinematik yoğunluk artar; normal oynanışta sahne sakin kalır.

## Görsel Dil

### Genel kurallar

- UI açık okunur kalır; 3D efekt UI'yi yutmaz.
- Sıcak tonlar ana paleti taşır, koyu arka plan kontrast sağlar.
- Altın, bronz ve koyu taş yüzeyler birlikte kullanılır.
- Doku hissi yüksek, ama detaylar metni ve kelime tahtasını boğmaz.
- Dekoratif yoğunluk yalnızca ana ekran, keşif anı ve bölüm sonlarında yükselir.

### Katman yapısı

Her önemli sahne en fazla şu katmanları kullanır:

1. Arka plan atmosferi
2. Ana odak objesi veya mimari form
3. Işık halkası, parıltı veya kontrollü partikül
4. Bilgi katmanı: başlık, skor, ödül, kelime

Bu yapı hem hafif cihazlarda performansı korur hem de görsel hiyerarşiyi net tutar.

### Ekran kimliği

- Splash: tek güçlü mühür simgesi, koyu arka plan, kısa ışık geçişi
- Başlangıç: markayı hissettiren ama fazla kalabalık olmayan giriş
- Harita: bilgelik evi silueti ve bölüm geçitleri
- Oyun ekranı: odağını kelime tahtasında tutan yarı gerçekçi çark dili
- Sonuç ekranı: mühür, ödül ve keşif kartı vurgusu

## Animasyon Dili

### Hareket ilkeleri

- Hızlı giriş: 180-260 ms
- Vurgu/bekleme: 300-500 ms
- Çıkış: 180-300 ms
- Toplam kelime tepkisi: 800-1200 ms
- Mühür finali: en fazla 1600 ms

### Öncelik sırası

P0:

- Doğru kelime
- Gizli kelime
- Yanlış kelime
- Mühür açılışı

P1:

- Altın artışı
- Yıldız kazanımı
- Seri rozeti
- Bölüm kapısı

P2:

- Nadir emoji sürprizleri
- Atmosfer partikülleri
- Arka plan dekor hareketleri

### Davranış kuralları

- Animasyonlar ağırlık hissi vermeli, zıplama hissi vermemeli.
- Aynı ekranda aynı anda en fazla iki yüksek dikkatli animasyon görünür.
- Kelime girişi sırasında giriş kilitlenmez.
- Yanlış kelime ceza gibi davranmaz; lokal geri tepme yeterlidir.
- Otomatik ipucu yoktur; ipucu sadece oyuncu talep ederse çalışır.

## Ses Dili

### Karar

Sesler düşük seviyede "arka plan süsü" olarak kalmamalı, fakat oyunu da gürültüye çevirmemelidir.
Her sesin ayrı bir işlevi olmalıdır.

### Ses sınıfları

- Harf seçimi: kısa, hafif, yönlendirici
- Doğru kelime: net, tatmin edici, kısa vurgu
- Gizli kelime: daha parlak ve daha derin keşif tonu
- Bonus kelime: küçük ödül tonu
- Altın / yıldız: tekil ve ayırt edilebilir ödül sesi
- Mühür: imza sesi, en güçlü ama kısa etki
- Hata: cezalandırıcı olmayan hafif geri bildirim

### Ses dengesi

- Ses seviyesi oyuncu tarafından ayarlanabilir.
- Varsayılan seviye mobil hoparlörde duyulur olmalıdır.
- Efekt sesleri birbirini ezmemelidir.
- Kritik geri bildirimler sadece sesle değil, görsel olarak da anlaşılmalıdır.

## Ekran Sahne Akışı

### 1. Splash

- Tek güçlü marka simgesi
- Koyu ve sıcak arka plan
- Kısa, premium giriş

### 2. Başlangıç

- Oyuncuyu doğrudan devam etmeye çağıran sade kurgu
- Gereksiz metin kalabalığı yok
- Ana CTA en baskın öğe

### 3. Harita

- Gece-kütüphane hissi
- Bilgelik evi merkezli dünya
- Bölüm geçitleri merak üretir, bilgi yükü bindirmez

### 4. Oyun

- Odak kelime tahtasında
- Çark, sahneye hizmet eder; sahne çarka hizmet etmez
- Tepki anlarında kısa ama zengin görsel karşılık

### 5. Sonuç

- Mühür açılışı
- Yıldızlar ve ödül özeti
- Keşif kartı
- Sonraki adım için tek net CTA

## Erişilebilirlik ve Performans

- `prefers-reduced-motion` desteklenir.
- Düşük kalite modunda parçacık ve blur azaltılır.
- Dokunma hedefleri minimum 48x48 CSS px olur.
- Dekoratif öğeler erişilebilirlik ağacını kirletmez.
- 4 GB RAM sınıfı Android cihazlarda akış korunur.
- Animasyonlar layout yerine transform ve opacity ağırlıklı çalışır.

## Kalite Kapıları

Bu tasarım ancak aşağıdaki koşullarda tamamlanmış sayılır:

- Görsel ton ekranlar arasında tutarlıdır.
- Mühür, yıldız ve altın animasyonları birbirini taklit etmez.
- Sesler ayırt edilebilir ve seviye ayarıyla uyumludur.
- Kısa ve uzun cihazlarda taşma olmaz.
- Kelime giriş akışı animasyonlardan etkilenmez.
- Mağaza ekran görüntüsü olarak kullanılabilecek kaliteye ulaşılır.

## Uygulama Sırası

1. Görsel token seti ve sahne renk sistemi.
2. Başlangıç, harita, oyun ve sonuç ekranlarının atmosfer uyumu.
3. Mühür ve ödül animasyonlarının yeniden dengelenmesi.
4. Ses katmanlarının yeniden seviyelendirilmesi.
5. Düşük kalite ve hareket azaltma modlarının doğrulanması.
6. Mağaza için ekran görüntüsü ve tanıtım sahnelerinin hazırlanması.

