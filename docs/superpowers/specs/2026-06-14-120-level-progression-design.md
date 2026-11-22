# Söz Ustası 120 Seviye İlerleme Tasarımı

## Amaç

Oyunu 45 seviyeden 120 seviyeye çıkarırken yalnızca içerik miktarını değil,
oyuncunun yetkinlik hissini, kelime öğrenmesini ve uzun dönemli devam isteğini
artırmak.

## Temel İlkeler

- İlk oturumlarda yüksek başarı olasılığı, ilerleyen bölümlerde kontrollü meydan okuma.
- Yan yana seviyelerde aynı harf havuzu, ana kelime veya baskın kelime kalıbı tekrarlanmaz.
- Zor bir seviyeyi daha rahat, tanıdık kelimeli bir toparlanma seviyesi izler.
- Her beş seviyelik bölümde dört ilerleme seviyesi ve bir ustalık seviyesi bulunur.
- Başarısızlık cezaya değil kademeli desteğe dönüşür.
- Zorlanılan kelimeler daha sonraki seviyelerde farklı harf havuzları içinde yeniden görülür.
- Kumar benzeri yakın kayıp ve yanıltıcı ödül mekanikleri kullanılmaz.

## Kapsam

- Mevcut 45 seviye korunur ve kalite denetiminden geçirilir.
- 75 yeni seviye eklenerek toplam 120 seviyeye ulaşılır.
- Sekiz mevcut tema dönüşümlü ve dengeli kullanılır.
- Her yeni seviyede 3-5 ana kelime, 2-5 gizli kelime bulunur.
- Her kelimede anlam, zorluk ve uygun ödül değeri bulunur.
- Her seviyeye benzersiz kısa anlatı ve tarih/öğrenme kartı eklenir.

## Zorluk Eğrisi

| Seviye | Hedef deneyim | Ana kelime zorluğu |
| --- | --- | --- |
| 1-15 | Güven ve temel kurallar | 1-2 |
| 16-45 | Akıcılık ve keşif | 2-4 |
| 46-75 | Çeşitlilik ve kontrollü güçlük | 3-4 |
| 76-100 | Ustalık ve transfer | 3-5 |
| 101-120 | İleri ustalık ve final | 4-5 |

Beş seviyelik her döngü:

1. Tanıdık kelimelerle giriş.
2. Yeni harf veya kalıp.
3. Karışık tekrar.
4. Döngünün en zor seviyesi.
5. Daha yüksek ödüllü ustalık ve toparlanma seviyesi.

## Harf ve Kelime Üretimi

- Harf havuzu 3-6 harf arasında kalır.
- Her kelime havuzdaki harf adetleriyle eksiksiz üretilebilir olmalıdır.
- Ardışık seviyelerin normalize edilmiş harf torbaları aynı olamaz.
- Ardışık iki seviyedeki ana kelimeler kesişemez.
- Aynı ana kelime en az 12 seviye geçmeden yeniden ana hedef olamaz.
- Öğretici tekrar için zor kelime 8-20 seviye sonra gizli kelime veya farklı anlam
  bağlamında yeniden sunulabilir.
- Özel adlar, tartışmalı kısaltmalar, kaba içerik ve tek başına anlamsız çekimler
  ana hedef yapılmaz.

## Uyarlanabilir Destek

- İlk iki başarısız deneme yalnızca nötr geri bildirim verir.
- Üçüncü ardışık başarısızlıkta ücretsiz anlam desteği gösterilir.
- Sonraki başarısızlık döngüsünde kelime uzunluğu, ardından bir harf açılır.
- Otomatik destek “ipucusuz tamamlama” başarısını bozmaz.
- Çarktan üretilebilen fakat sözlükte bulunmayan makul denemeler seriyi bozmaz.

## Öğrenme ve Tekrar

Kelime bazında şu alanlar tutulacaktır:

- doğru ve yanlış deneme sayısı
- son görülme zamanı
- son doğru cevap zamanı
- yardım kullanımı
- ustalık düzeyi
- sonraki tekrar zamanı

Tekrar aralıkları başlangıçta 1, 3, 7 ve 14 gün olacaktır. Yanlış cevap veya
yoğun yardım kullanımı kelimeyi daha erken tekrar kuyruğuna alır.

## Ödül ve Motivasyon

- Ana hedef ilerlemesi her zaman görünür olur.
- Gizli kelimeler küçük ama anlık ödül verir.
- Beşinci seviyelerde ustalık sandığı yerine açıkça belirtilmiş sabit bonus verilir.
- Yeni rekor, ipucusuz bitirme ve zor kelimeyi hatırlama ayrı biçimde kutlanır.
- Oyuncuya kaybetme korkusu veya yapay kıtlık uygulanmaz.

## Teknik Değişiklikler

- `levels.ts` ve `levelStories.ts` 120 kayıtla genişletilir.
- İçerik üretimi için veri doğrulayan bir üretim betiği kullanılır.
- Son seviye kontrolü sabit `45` yerine `levels.at(-1)` üzerinden belirlenir.
- Testlerde son zorluk aralığı 116-120 olarak güncellenir.
- Ardışık havuz, kelime tekrar aralığı, hikâye varlığı ve üretilebilirlik testleri eklenir.
- Harita ve tema grupları artan seviyelerde dinamik kalır.

## Başarı Ölçütleri

- 120 seviyenin tamamı audit ve testlerden geçer.
- Hiçbir kelime harf havuzu dışında kalmaz.
- Hiçbir seviyede eksik anlam, hikâye veya ödül bulunmaz.
- Ardışık seviye havuzları aynı olmaz.
- İlk 15 seviyenin zorluk ortalaması en fazla 2, son 20 seviyenin en az 4 olur.
- Üretim derlemesi, lint ve tüm testler başarılı olur.

## Araştırma Dayanağı

- Personalized Dynamic Difficulty Adjustment, 2024:
  https://arxiv.org/abs/2408.06818
- Hades Again and Again: Frustration Tolerance and Player Experience, 2024:
  https://arxiv.org/abs/2401.14878
- From Frustration to Fun: Adaptive Puzzle Game, 2025:
  https://arxiv.org/abs/2509.23796
- Spacing and retrieval practice review:
  https://doi.org/10.1007/s10648-020-09572-8

