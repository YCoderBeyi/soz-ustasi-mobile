# Söz Ustası Profesyonel Geliştirme Kararları

Tarih: 18 Haziran 2026

Bu not, oyunu daha faydalı, daha oynanabilir, daha heyecanlı ve uzun süre tutulacak bir kelime oyununa dönüştürmek için alınan ürün kararlarını içerir.

## Ana Ürün Kararı

Söz Ustası'nın farkı yalnızca kelime buldurmak değil; oyuncuya Türkçe kelime hazinesi kazandırmak, keşif hissi vermek ve ustalaştığını göstermektir.

Ana duygu hedefleri:

- Oyuncu "bunu ben buldum" hissini yaşamalı.
- Oyuncu her bölümden sonra yeni bir kelime veya anlam öğrenmeli.
- Oyuncu bir sonraki seviyeyi açmak için net bir sebep görmeli.

## v1.0 / Kapalı Test Kararı

İlk yayın ve kapalı test için hedef stabilite ve güvenilirliktir.

Dahil:

- Reklamsız, kullanıcı takipsiz, çevrimdışı temel oyun.
- Ana, gizli ve denetlenmiş bonus kelime kabulü.
- Hatasız seviye geçişi, mühür açma ve ödül akışı.
- Google Play politika formlarıyla uyumlu sade veri davranışı.

Dahil edilmeyecek:

- Reklam SDK'sı.
- Reklam kimliği.
- Sunucu, hesap ve analytics.
- Canlı rekabet veya liderlik tablosu.
- AI servisiyle canlı kelime üretimi.

Gerekçe: İlk amaç inceleme sürecini sade tutmak, kapalı testi başlatmak ve gerçek oyuncu geri bildirimi toplamaktır.

## Akıllı Kelime Kabulü

Oyuncu anlamlı bir kelime bulduğunda oyun bunu yok saymamalıdır.

Karar:

- Ana kelime bulunduysa doğrudan hedefe yerleşir.
- Gizli kelime bulunduysa gizli keşif olarak ödül verir.
- Seviye dışı ama geçerli ve güvenli kelime bulunduysa küçük bonus verir.
- Sözlükte olmayan ama harflerden üretilebilir kelimede seri bozulmaz; nazik geri bildirim verilir.

Bu sistem oyuncu memnuniyetini en hızlı artıracak geliştirme olarak önceliklidir.

## Zorluk ve Öğrenme Akışı

Zorluk artışı oyuncuyu cezalandırmadan ilerlemelidir.

Karar:

- 1-10: kolay başlangıç ve hızlı başarı.
- 10-40: gizli kelime alışkanlığı ve temel öğrenme.
- 40-80: daha uzun kelimeler, kontrollü meydan okuma.
- 80 sonrası: ustalık, tekrar ve özel ödüller.

Oyuncu zorlandığında otomatik ipucu verilmez. Sistem yalnızca ipucu alabileceğini hatırlatır; ipucunu oyuncu isterse kullanır.

## Tutundurma ve Heyecan Döngüsü

Her oturumda oyuncuya küçük ama anlamlı bir geri dönüş sebebi verilmelidir.

Önerilen sistemler:

- Günlük seri ödülü.
- Haftalık kelime meydan okuması.
- Bölge sandıkları.
- Mühür koleksiyonu.
- Nadir gizli kelimeler.
- Bugünün kelimesi.
- 3 yıldızla geçilen seviyeler için özel rozet veya parıltı.

## Öğretici Değer

Oyun eğlendirirken Türkçe kelime bilgisini artırmalıdır.

Önerilen sistemler:

- Bulunan kelimeye kısa anlam kartı.
- Zor kelimelerde örnek cümle.
- Seviye sonunda "Bugün öğrendiklerin" özeti.
- Favori kelime defteri.
- Oyuncunun zorlandığı kelimeler için aralıklı tekrar.

Bu özellikler v1.1 ve v1.2 planlarına bölünmelidir.

## Rekabet Tasarımı

Rekabet ilk sürüme eklenmeyecek. Önce tek oyunculu deneyim sağlamlaştırılacaktır.

Gelecek sürüm sırası:

- v1.1: kelime kabulü ve öğrenme sistemleri.
- v1.2: günlük/haftalık görevler ve seri ödülleri.
- v1.3: haftalık liderlik tablosu ve arkadaş skorları.
- v1.4: kelime ustalığı ligleri.

Rekabet puanı yalnızca hızdan gelmemelidir. Puanlama şunları birlikte değerlendirmelidir:

- Ana kelime tamamlama.
- Gizli kelime bulma.
- İpucu kullanmama.
- Seri sürdürme.
- Zor kelime keşfi.

## Animasyon ve Ses Kararı

Animasyon ve ses oyuncuya başarı hissi vermeli, oyunu yavaşlatmamalıdır.

Öncelikler:

- Doğru kelime: kısa ve net parıltı.
- Gizli kelime: daha özel mühür/keşif efekti.
- Mühür açma: oyunun imza animasyonu ve imza sesi.
- Nadir kelime: özel renkli tepki.
- Yanlış kelime: cezalandırıcı olmayan hafif geri bildirim.

Ses seviyesi mobil hoparlörde yeterince duyulur olmalıdır. Harf, doğru kelime, gizli kelime, mühür ve ödül sesleri birbirinden ayırt edilebilir hale getirilmelidir.

## Para Kazanma Kararı

İlk sürümde reklam eklenmeyecek.

Gelecek reklam modeli:

- Zorunlu reklam yok.
- Yalnızca oyuncunun isteğiyle çalışan ödüllü reklam.
- Örnekler: +1 ipucu, günlük ödülü ikiye katlama, ek sandık açma.

Reklam en erken v1.2 veya v1.3 sonrasında, kapalı test geri bildirimleri ve Play onayı alındıktan sonra değerlendirilmelidir.

## Sürüm Yol Haritası

### v1.0

- Stabil kapalı test.
- Reklamsız ve çevrimdışı oyun.
- Hatasız seviye, mühür ve ödül akışı.

### v1.1

- Akıllı bonus kelime kabulünün genişletilmesi.
- Kelime defterinin güçlendirilmesi.
- Zorlanılan kelimeler için tekrar sistemi.
- Seviye zorluk dengesinin iyileştirilmesi.

### v1.2

- Günlük ve haftalık görevler.
- Seri ödülleri.
- Bölge sandıkları.
- Daha güçlü mühür animasyonları ve ses tasarımı.

### v1.3

- Haftalık liderlik tablosu.
- Arkadaş skorları.
- Asenkron rekabet.

### v1.4

- Ödüllü reklam.
- Kozmetik mühürler.
- Tema koleksiyonları.
- Özel etkinlik seviyeleri.

## Yayın Öncesi Kalite Kapıları

Her sürümden önce:

- Test, lint, build ve level audit geçmeli.
- Fiziksel cihazda seviye geçişi, mühür açma, ses ve ödül akışı kontrol edilmeli.
- Play Console beyanları gerçek uygulama davranışıyla uyumlu olmalı.
- Yeni SDK, izin veya reklam davranışı varsa Data Safety ve gizlilik politikası güncellenmeli.
- Sürüm kodu artırılmalı ve imzalı AAB üretilmeli.
