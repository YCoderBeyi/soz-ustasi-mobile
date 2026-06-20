# Söz Ustası Ürün Yol Haritası

## Ürün İlkesi

Söz Ustası, oyuncunun geçerli kelime keşfini mümkün olduğunca reddetmeyen,
öğrenmeyi cezaya dönüştürmeyen ve rekabeti ödeme gücü yerine kelime bilgisi,
hatırlama ve keşif üzerinden kuran bir Türkçe kelime oyunu olacaktır.

Yapay zekâ çevrimdışı oyunun yerine geçmeyecek. Oyun internet ve AI servisi
olmadan çalışmaya devam edecek; AI yalnız doğrulama, kişiselleştirme ve içerik
üretim desteği sağlayacaktır.

## v1.0.0 - İlk Google Play Sürümü

Amaç: Çevrimdışı, güvenilir ve kapsamı kontrol edilmiş temel oyunu yayınlamak.

### Dahil

- 120 seviyelik harita ve kademeli zorluk
- Ana, gizli ve denetlenmiş bonus kelimeler
- Çarktan üretilebilen bilinmeyen kelimelerde seriyi koruyan nötr geri bildirim
- Üç ardışık başarısızlık sonrası ücretsiz anlam desteği
- Günlük görev
- Seviye ustalığı, yıldızlar, seri ve ödüller
- Yerel sözlük ve öğrenme kartları
- Cihaz içinde saklanan ilerleme
- Reklam, hesap, sunucu, analytics ve kişisel veri toplama olmadan çevrimdışı kullanım

### Yayın Dışında

- Yapay zekâ servisi
- Oyuncular arası canlı veya eşzamansız rekabet
- Kullanıcı hesabı ve bulut kayıt
- Push notification
- Reklam ve uygulama içi satın alma
- Kullanıcı tarafından gönderilen kelime veya içerik

## v1.1.0 - Kelime Kapsamı ve Öğrenme

- Daha geniş denetlenmiş çevrimdışı Türkçe sözlük
- Hedef dışında bulunan geçerli kelimelere anlık bonus
- Seçilmiş güvenli kelime zincirlerinde nadir, aile dostu emoji tepkileri
- Ana, gizli ve bonus kelime keşifleri için ortak 3D geri bildirim dili
- Mühür, yıldız, seri, altın ve kelime keşfi animasyonlarının profesyonel 3D kaliteye yükseltilmesi
- Hareket azaltma tercihi ve düşük performanslı cihazlar için sade efekt modu
- Kelime bazında doğru, yanlış ve ipucu kullanım sayacı
- 1, 3, 7 ve 14 günlük aralıklı tekrar kuyruğu
- Zor kelimeler için kişisel tekrar bölümü
- Haftalık cihaz içi öğrenme özeti

Bu sürüm sunucu gerektirmez ve mevcut Data Safety beyanını değiştirmez.

## v1.2.0 - Kişiselleştirilmiş Görevler

- Oyuncu başarı oranına göre günlük görev seçimi
- Kolay başlangıç, kontrollü meydan okuma ve toparlanma seviyeleri
- Zorlanma sonrası anlam, uzunluk ve harf şeklinde kademeli yardım
- Kelime çeşitliliği, hatırlama ve ipucusuz bitirme hedefleri
- Oyuncunun öğrenme hızına göre tekrar zamanı

Kişiselleştirme cihaz üzerinde yapılır; kişisel veri sunucuya gönderilmez.

## v1.3.0 - Eşzamansız Rekabet

- Her oyuncuya aynı günlük harf çarkı
- Haftalık keşif, doğruluk ve seri ligleri
- Anonim rakip performansına karşı Gölge Düello
- Hız, kelime çeşitliliği ve öğrenme için ayrı sıralamalar
- Pay-to-win sağlamayan sabit kurallar

Bu sürümden önce hesap modeli, sunucu güvenliği, gizlilik politikası ve Play Data
Safety formu yeniden hazırlanmalıdır.

## v1.4.0 - AI Kelime İnceleme

- Sözlükte bulunmayan, harflerden üretilebilen kelimeleri inceleme kuyruğuna alma
- Sunucu tarafında AI sınıflandırması:
  - yaygın kelime
  - nadir kelime
  - çekimli biçim
  - özel ad
  - kısaltma
  - argo veya uygunsuz içerik
  - yazım hatası
  - anlamsız dizi
- AI sonucunu Zemberek veya güvenilir sözlükle doğrulama
- İnsan moderasyonu sonrası sözlük güncellemesi
- Onaylanan katkılar için oyun içi rozet

AI anahtarı uygulamada bulunmayacak. Tüm istekler kontrollü sunucu üzerinden
gidecek. Çocuk güvenliği filtresi ve kötüye kullanım sınırlaması zorunludur.

## v1.5.0 - Arkadaş Düelloları

- Davet bağlantısıyla eşzamansız arkadaş düellosu
- Aynı harflerle süreli kelime avı
- Uzunluk, nadirlik ve doğruluk puanı
- Tekrarlanan kelimelerde puan engeli
- Hile ve rastgele deneme örüntüsü tespiti

## v2.0.0 - AI Destekli Yaşayan Oyun

- Oyuncuya özel kontrollü seviye üretimi
- Yaşa ve kelime düzeyine uygun anlam açıklaması
- Örnek cümle ve eş anlam önerileri
- AI destekli haftalık öğrenme özeti
- Moderasyonlu topluluk kelime keşifleri
- Sezonluk görevler ve tematik turnuvalar

AI tarafından üretilen hiçbir kelime, anlam veya seviye doğrulanmadan yayın
kataloğuna giremez.

## Sürüm Geçiş Kapıları

Her sürüm aşağıdaki koşulları sağlamadan yayınlanmaz:

- Tüm testler, lint, build ve level audit başarılı
- Fiziksel Android cihaz smoke testi tamamlanmış
- Gizlilik politikası gerçek davranışla uyumlu
- Data Safety formu kullanılan servisleri eksiksiz açıklıyor
- Yeni izin, SDK ve ağ trafiği güvenlik incelemesinden geçmiş
- Store listing ve ekran görüntüleri güncel
- Sürüm kodu artırılmış ve imzalı AAB üretilmiş

## v1 Yayın Kararı

İlk sürümde çevrimdışı temel oyun yayınlanacaktır. AI, hesap, sunucu ve rekabet
özellikleri v1 yayınını geciktirmeyecek; yukarıdaki sürümlerde kontrollü biçimde
eklenecektir.
