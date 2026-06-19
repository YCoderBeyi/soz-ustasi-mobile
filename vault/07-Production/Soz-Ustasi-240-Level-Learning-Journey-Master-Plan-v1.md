# Söz Ustası 240 Seviye Öğrenme ve Keşif Yolculuğu

Tarih: 19 Haziran 2026  
Durum: Onaylı ürün tasarımı  
Kapsam: Ana seviye yolculuğu, tarih/bilim içeriği, zorluk eğrisi, öğrenme sistemi, tekrar önleme, kalite denetimi ve sürüm planı

Bu belge, `docs/superpowers/specs/2026-06-14-120-level-progression-design.md` içindeki önceki 120-seviye tasarımını genişletir ve ana yolculuk mimarisi konusunda onun yerine geçer.

## 1. Yönetici Özeti

Söz Ustası'nın mevcut 46-120 seviye sistemi yeni içerik üretmiyor. İlk 45 seviyenin harf havuzlarını ve kelimelerini yeniden kullanıyor; yalnızca seviye numarasını, ödülü, zorluk etiketini ve jenerik hikaye metnini değiştiriyor. Oyuncunun yaşadığı déjà vu, tekrar ve zorluğun başa sarma hissinin temel nedeni budur.

Yeni ürün kararı:

- Ana yolculuktaki 240 seviyenin tamamı özgün ve editoryal olarak hazırlanmış olacak.
- Aynı harf torbası ve aynı ana kelime, ana yolculukta rastgele yeniden kullanılmayacak.
- Tekrar yalnızca ayrı bir "Ustalık Tekrarı" sisteminde, oyuncuya nedeni açıklanarak yapılacak.
- Her seviye bir kelime bulmacası ile bir insanlık bilgisi kartını birbirine bağlayacak.
- İslam medeniyeti, Anadolu, Türk-İslam alimleri, kadın bilim insanları ve küresel bilim tarihi dengeli biçimde anlatılacak.
- Oyuncunun mevcut ilerlemesi güncelleme sonrasında sıfırlanmayacak.

Oyunun yeni vaadi:

> Kelimeleri keşfet, insanlığın fikir yolculuğunu aç, öğrendiklerini ustalığa dönüştür.

## 2. Mevcut Sistemin Kök Neden Analizi

### 2.1 İçerik tekrarı

`src/data/masteryLevels.ts` içindeki mevcut üretici:

- 46. seviyeden başlayarak 75 seviye oluşturuyor.
- Kaynak olarak ilk 45 seviyeyi kullanıyor.
- Seçilen seviyenin `letters`, `mainWords`, `hiddenWords` ve temasını kopyalıyor.
- Yalnızca zorluk değerlerini yükseltiyor.
- Sonuç olarak oyuncu daha önce çözdüğü kelime ve harf havuzlarını yeniden görüyor.

### 2.2 Jenerik anlatı

`src/data/masteryLevelStories.ts`:

- Beş dönem adı arasında dönüyor.
- Beş yer adı arasında dönüyor.
- Başlıkları "Ustalık Adımı N" biçiminde üretiyor.
- Bilim insanı, olay, eser, buluş veya tarihsel bağlam üretmiyor.

Bu nedenle ödül ekranı keşif hissi yerine sistem tarafından üretilmiş dolgu metni hissi veriyor.

### 2.3 Zorluk yanılsaması

Mevcut sistem kelimeyi değiştirmeden yalnızca `difficulty` sayısını yükseltiyor. Bir oyuncu için "KARE" kelimesinin etiketi 2 yerine 4 olduğunda kelime gerçekten zorlaşmaz.

Gerçek zorluk aşağıdaki bileşenlerden oluşur:

- Harf havuzundaki karakter sayısı.
- Tekrarlanan harflerin miktarı.
- Ana kelime sayısı.
- Ortalama ve maksimum kelime uzunluğu.
- Kelimenin günlük kullanım sıklığı.
- Benzer olası kelime sayısı.
- Çengel bulmacadaki kesişim yoğunluğu.
- Gizli kelimelerin sayısı ve görünürlüğü.
- İpucu kullanmadan çözüm süresi.

### 2.4 Audit boşluğu

Mevcut level audit teknik geçerliliği kontrol ediyor ancak oyuncu deneyimini tam korumuyor. Güncel audit 120 seviyeyi geçirmesine rağmen 10 zorluk gerilemesi bildiriyor.

Yeni audit yalnızca "çalışıyor mu?" değil, "ilerleme hissi veriyor mu?" sorusunu da kontrol etmelidir.

## 3. Ürün Tasarım İlkeleri

### 3.1 Yetkinlik hissi

- İlk seviyelerde hızlı ve anlaşılır başarı.
- Orta seviyelerde yeni kalıp ve daha uzun kelime.
- Zor seviyelerde çözülmesi mümkün ama emek isteyen bulmaca.
- Zor seviyeyi takip eden kontrollü toparlanma seviyesi.
- Oyuncu başarısız olduğunda otomatik cevap verilmemesi.

### 3.2 Özerklik

- İpucunu yalnızca oyuncu isterse açar.
- Gizli kelimeleri aramaya devam edip etmeme kararını oyuncu verir.
- Mührü hemen basabilir veya üç yıldız için keşfe devam edebilir.
- Hikaye kartı okunabilir, sözlüğe kaydedilebilir veya geçilebilir.

### 3.3 Merak

- Haritada sonraki bölgenin teması görünür ama içeriği tamamen açıklanmaz.
- Her beşinci seviyede daha önemli bir keşif kartı bulunur.
- Her yirminci seviyede bölüm finali ve koleksiyon parçası açılır.
- Gizli kelimeler yalnızca altın değil, bilgi parçaları ve koleksiyon ilerlemesi verir.

### 3.4 Öğrenme

- Seviye sonunda en fazla bir ana bilgi vurgulanır.
- Metin kısa, açık ve yaşa uygun olur.
- Bilgi kartında "Ne değişti?", "Kim katkı verdi?", "Bugün nerede kullanılıyor?" sorularından en az ikisi yanıtlanır.
- Tartışmalı tarihsel sahiplik iddiaları kesin ifadelerle verilmez.
- Tek bir kişiyi tüm buluşun tek sahibi ilan etmek yerine katkı zinciri gösterilir.

### 3.5 Etik tutundurma

- Yapay kıtlık, zorunlu reklam ve kaybetme korkusu kullanılmaz.
- Günlük seri oyuncuyu suçlamaz.
- Ödüller açık ve öngörülebilir olur.
- Oyuncu tekrar oynamaktan kazanç sağlayabilir fakat aynı seviye sınırsız altın üretmez.

## 4. Ana Yolculuk: 12 Bölüm, 240 Seviye

Her bölüm 20 seviyeden oluşur. Her bölümün:

- Kendine ait görsel atmosferi.
- Kelime teması.
- Bilim/tarih anlatı ekseni.
- Yeni veya gelişen oyun mekaniği.
- Bölüm sonu koleksiyon ödülü bulunur.

| Bölüm | Seviyeler | Tema | Örnek kişiler ve gelişmeler | Mekanik hedef |
| --- | ---: | --- | --- | --- |
| 1. İlk İzler | 1-20 | Yazı, sayı, ölçü, tarım | Tekerlek, çivi yazısı, papirüs, takvim, pusula | Güvenli başlangıç |
| 2. Bilginin Yolları | 21-40 | Kağıt, kitap, harita, gözlem | Cai Lun, Brahmagupta, kütüphaneler, erken baskı | Gizli kelime alışkanlığı |
| 3. Bilgelik Evleri | 41-60 | Bağdat, çeviri, matematik | Harezmi, Kindi, Sabit bin Kurra, Benu Musa | Harf çeşitliliği |
| 4. Işık, Tıp ve Doğa | 61-80 | Optik, tıp, eczacılık | İbnü'l-Heysem, İbn Sina, Zehravi, Biruni, Razi | Anlamdan ipucu çıkarma |
| 5. Makineler ve Gökyüzü | 81-100 | Mekanik, astronomi, saatler | Cezeri, Meryem el-İcliyye, Uluğ Bey, Ali Kuşçu | Uzun kelimeler ve kesişimler |
| 6. Anadolu ve Osmanlı Bilimi | 101-120 | Haritacılık, rasathane, mimari | Piri Reis, Takiyüddin, Matrakçı Nasuh, Mimar Sinan, Katip Çelebi | İleri ana yol finali |
| 7. Matbaanın ve Deneyin Çağı | 121-140 | Baskı, anatomi, gözlem | Gutenberg, Vesalius, Kopernik, Galileo, Kepler | Yeni bulmaca varyasyonları |
| 8. Enerji ve Sanayi | 141-160 | Buhar, elektrik, ulaşım | Watt, Faraday, Volta, Tesla, Curie | Çok adımlı hedefler |
| 9. Görünmeyen Dünya | 161-180 | Mikrop, hücre, atom, genetik | Leeuwenhoek, Pasteur, Fleming, Mendel, Franklin | Uzman kelime katmanı |
| 10. Hesaplama ve İletişim | 181-200 | Telgraf, telefon, bilgisayar | Morse, Bell, Ada Lovelace, Turing, Hopper | Desen ve kategori bulmacası |
| 11. Uzay ve Modern Fizik | 201-220 | Görelilik, kuantum, roket, uydu | Einstein, Heisenberg, Korolyov, Katherine Johnson, Feza Gürsey | Zamanlı olmayan uzmanlık |
| 12. Yaşamın Geleceği | 221-240 | DNA, sağlık, internet, yapay zeka | Aziz Sancar, Özlem Türeci, Uğur Şahin, Tim Berners-Lee, modern ekip bilimi | Büyük final ve açık uçlu ustalık |

### 4.1 Tarihsel temsil standardı

İçerik dengesi hedefleri:

- En az 45 seviye İslam medeniyeti ve Türk-İslam bilim tarihi.
- En az 30 seviye Anadolu, Osmanlı ve Türkiye bilim/kültür tarihi.
- En az 35 seviye kadın bilim insanları veya kadınların bilimsel katkıları.
- En az 30 seviye Asya, Afrika ve Avrupa dışı bilgi gelenekleri.
- Kalan seviyeler küresel bilim, teknoloji ve kültür tarihi.

Bu sayılar kota gibi yüzeysel kullanılmamalı; her kişi ilgili katkısı ve doğru bağlamıyla anlatılmalıdır.

### 4.2 Bölüm içi 20 seviye ritmi

Her bölüm:

1. Seviye 1-3: temaya giriş, kolay ve tanıdık kelimeler.
2. Seviye 4: ilk kontrollü zorluk zirvesi.
3. Seviye 5: mini keşif ve yüksek görünürlüklü ödül.
4. Seviye 6-8: yeni kelime kalıbı.
5. Seviye 9: zorlayıcı bulmaca.
6. Seviye 10: bölüm ortası keşif kartı.
7. Seviye 11-14: transfer ve karışık beceri.
8. Seviye 15: koleksiyon parçası.
9. Seviye 16-18: bölümün en güçlü öğrenme içeriği.
10. Seviye 19: kontrollü final hazırlığı.
11. Seviye 20: bölüm finali, özel mühür ve bir sonraki bölge açılışı.

## 5. Seviye İçerik Sözleşmesi

Her ana yol seviyesi aşağıdaki alanlara sahip olmalıdır:

```ts
type JourneyLevel = {
  levelId: number;
  chapterId: string;
  themeId: string;
  sealId: string;
  puzzleType: PuzzleType;
  letters: string[];
  mainWords: WordEntry[];
  hiddenWords: WordEntry[];
  acceptedBonusWords: WordEntry[];
  difficulty: DifficultyProfile;
  discoveryId: string;
  objectives: LevelObjective[];
  reward: LevelReward;
};
```

Yeni `DifficultyProfile`:

```ts
type DifficultyProfile = {
  tier: 1 | 2 | 3 | 4 | 5;
  cognitiveLoad: number;
  vocabularyRarity: number;
  ambiguity: number;
  crossingComplexity: number;
  expectedSeconds: number;
};
```

Yeni keşif kartı:

```ts
type DiscoveryCard = {
  id: string;
  chapterId: string;
  era: string;
  place: string;
  title: string;
  summary: string;
  impact: string;
  today: string;
  people: PersonCredit[];
  sourceNotes: string[];
  contentReviewStatus: 'draft' | 'reviewed' | 'approved';
};
```

## 6. Kelime Editoryal Standardı

### 6.1 Ana kelimeler

Ana kelime:

- Güncel veya öğretici değeri açık Türkçe kelime olmalı.
- Tek başına anlam taşımalı.
- Sadece ek almış, bağlam dışı bir çekim olmamalı.
- Kaba, ayrımcı, yanlış anlaşılmaya çok açık veya yaş grubuna uygunsuz olmamalı.
- Anlamı kısa ve doğru biçimde açıklanabilmeli.
- Oyuncunun kullandığı harf havuzundan eksiksiz üretilebilmeli.

### 6.2 Gizli kelimeler

Gizli kelime:

- Oyuncunun gerçekten keşfedebileceği mantıklı bir kelime olmalı.
- Sırf sayıyı artırmak için aşırı nadir sözcük kullanılmamalı.
- Çok kısa iki harfli kelimeler yalnızca ilk bölümlerde ve sınırlı kullanılmalı.
- Gizli kelime sayısı seviye başlamadan oyuncuya gösterilmeli.
- Kelimenin kendisi oyuncuya açıklanmamalı.

### 6.3 Bonus sözlük kelimeleri

Seviye hedefinde olmayan fakat harflerden üretilebilen geçerli kelimeler:

- "Bonus kelime" olarak kabul edilir.
- İlk keşifte küçük ödül verir.
- Aynı kelime aynı hesapta tekrar tekrar altın üretmez.
- Ana kelime veya gizli kelime hedefi yerine geçmez.
- Güvenli çevrimdışı sözlükten doğrulanır.

### 6.4 Tekrar kuralları

- Aynı normalize edilmiş harf torbası ana yolculukta tekrar edemez.
- Aynı ana kelime en az 40 seviye geçmeden yeniden ana hedef olamaz.
- Aynı kelime ikinci kez ana hedef yapılacaksa farklı anlam/bağlam gerekçesi bulunmalıdır.
- Aynı ana kelime 240 seviyede en fazla iki kez kullanılabilir.
- Aynı gizli kelime en az 20 seviye arayla kullanılabilir.
- Aralıklı tekrar için kelime ana yolculuk yerine Ustalık Tekrarı kuyruğuna alınır.
- Ardışık iki seviyede ana kelime kökleri kesişmemelidir.
- Son beş seviyedeki baskın kelime uzunluğu ve harf paterni yeniden kullanılmamalıdır.

## 7. Gerçek Zorluk Eğrisi

### 7.1 Zorluk bantları

| Seviye | Harf sayısı | Ana kelime | Ortalama uzunluk | Hedef başarı |
| --- | ---: | ---: | ---: | ---: |
| 1-20 | 3-5 | 2-3 | 2.5-4.0 | %85-95 |
| 21-60 | 4-6 | 3-4 | 3.5-5.0 | %75-88 |
| 61-120 | 5-7 | 3-5 | 4.0-6.0 | %65-82 |
| 121-180 | 5-8 | 4-6 | 4.5-6.5 | %58-75 |
| 181-240 | 6-8 | 4-7 | 5.0-7.0 | %50-70 |

Başarı oranı hedefi ilk deneme içindir; ipucu kullanımı dahil değildir.

### 7.2 Dalgalı fakat yükselen eğri

Zorluk düz bir çizgi halinde artmayacaktır. Oyuncunun yorulmasını önlemek için:

- Dört seviyelik yükseliş.
- Bir toparlanma seviyesi.
- Yeni mekanikten sonra bir öğretici seviye.
- Bölüm finalinden sonra bir nefes seviyesi.

Ancak toparlanma seviyesi önceki bölümün başlangıcından daha kolay olamaz. Uzun dönemli taban zorluk sürekli yükselir.

### 7.3 Zorluk puanı

Her seviye için hesaplanan puan:

```text
zorluk =
  harf_sayısı * 1.2
  + ana_kelime_sayısı * 1.5
  + ortalama_kelime_uzunluğu * 1.8
  + nadirlik_ortalaması * 2.0
  + kesişim_karmaşıklığı * 1.3
  + benzer_kelime_belirsizliği * 1.1
  + gizli_kelime_sayısı * 0.4
```

Audit kuralları:

- Beş seviyelik hareketli ortalama geriye gidemez.
- Tek seviye düşüşü önceki seviyeye göre en fazla `%18` olabilir.
- Bölüm finali bölüm ortalamasından en az `%12` zor olmalıdır.
- Yeni bölümün ilk seviyesi önceki finalden kolay olabilir fakat önceki bölüm başlangıcından kolay olamaz.

## 8. Bulmaca Çeşitliliği

Ana oyun kimliği çark ve çengel bulmaca olarak kalır. Çeşitlilik ana mekaniği bozmadan eklenir.

### 8.1 Çengel bulmaca

- Ana mod.
- Kelimeler gerçek kesişimlerle yerleşir.
- Yan yana oluşturulan geçerli kelimeler bonus sözlük kontrolüne gönderilir.
- Birden fazla geçerli yerleşim varsa oyuncunun kelimesi reddedilmez.

### 8.2 Anagram

- Harfleri doğru kelimeye sıralama.
- Çok sık kullanılmaz; bölüm başına 2-4 seviye.
- Kelimenin anlamı veya tarih kartı bağlamı yönlendirici olabilir.

### 8.3 Kategori bağı

- 121. seviyeden sonra açılır.
- Bulunan kelimeler ortak bir kavramla ilişkilidir.
- NYT Connections kopyası değildir; Söz Ustası çarkı ve keşif kartıyla bütünleşir.
- Örnek: ışık, mercek, gölge, görüntü -> optik.

### 8.4 Eksik harf

- Oyuncuya kelimenin anlamı ve bazı harfleri verilir.
- Çarktan eksik parçayı üretir.
- Kelime öğrenme tekrarlarında kullanılır.

### 8.5 Ustalık düellosu

- Zaman baskısı zorunlu değildir.
- Aynı harf havuzundan belirli sayıda kelime bulma hedefi.
- Ana yolculuktan ayrı, isteğe bağlı mod.

## 9. Keşif Kartları ve Bilim Tarihi

### 9.1 Kart yapısı

Her seviye sonundaki kart:

1. Dönem ve yer.
2. En fazla 60 karakterlik başlık.
3. 45-80 kelimelik ana anlatı.
4. "Neden önemli?" cümlesi.
5. "Bugün nerede?" cümlesi.
6. İlgili kişi veya ekip.
7. Sözlüğe/koleksiyona ekleme.

### 9.2 Büyük keşif kartı

Her beşinci seviyede:

- Özel 3D açılış.
- 90-140 kelimelik genişletilmiş anlatı.
- Bir görsel/alet/şema.
- İlgili üç kelimenin koleksiyonu.
- Bilginin doğrulanmış kaynak notu.

### 9.3 İslam alimleri ve bilim insanları için önerilen çekirdek liste

İçerik havuzu:

- Harezmi: cebir, algoritma, sayı sistemleri.
- El-Kindi: felsefe, matematik, kriptanaliz.
- Benu Musa kardeşler: mekanik düzenekler.
- Sabit bin Kurra: matematik ve astronomi.
- Razi: tıp, klinik gözlem ve kimya tarihi.
- İbn Sina: tıp, felsefe ve sınıflandırma.
- Zehravi: cerrahi aletler ve tıp.
- İbnü'l-Heysem: optik ve deneysel yöntem.
- Biruni: ölçüm, coğrafya, astronomi.
- İdrisi: coğrafya ve haritacılık.
- Cezeri: otomata, pompalar ve mekanik.
- Meryem el-İcliyye: usturlap yapımı.
- Uluğ Bey: gözlemevi ve yıldız katalogları.
- Ali Kuşçu: astronomi ve matematik.
- Piri Reis: haritacılık ve denizcilik.
- Matrakçı Nasuh: minyatür harita ve şehir tasviri.
- Takiyüddin: rasathane, saat ve astronomi.
- Katip Çelebi: bibliyografya ve coğrafya.
- Erzurumlu İbrahim Hakkı: astronomi ve ansiklopedik eserler.

Her içerik kartı için uzman/editoryal inceleme şarttır. Efsane, menkıbe ve tartışmalı anlatılar "kesin tarihsel gerçek" olarak sunulmaz.

### 9.4 Küresel bilim tarihi için temsil ilkesi

- Bir buluşun çok aşamalı gelişimi varsa ekip ve öncüller belirtilir.
- "X kişi icat etti" yerine "X kişi şu aşamayı geliştirdi" dili tercih edilir.
- Sömürgecilik, savaş veya etik sorun bağlamı gerekiyorsa yaşa uygun ve tarafsız anlatılır.
- Yaşayan kişiler için doğrulanabilir ve ölçülü ifadeler kullanılır.

## 10. Ustalık Tekrarı Sistemi

Ana yolculuk tekrar içermez. Öğretici tekrar ayrı ve açık bir sistemdir.

### 10.1 Oyuncuya sunum

Mod adı: `Ustalık Atölyesi`

Oyuncuya şu bilgi gösterilir:

- Neden bu kelimelerin geri geldiği.
- Kaç kelimenin tekrar edileceği.
- Tamamlayınca kazanacağı ustalık puanı.
- Bu tekrarın ana seviye ilerlemesini engellemediği.

### 10.2 Kelime ustalık kaydı

Her kelime için:

```ts
type WordMastery = {
  wordKey: string;
  seenCount: number;
  successCount: number;
  failedCount: number;
  hintCount: number;
  lastSeenAt: string;
  lastSuccessAt?: string;
  masteryScore: number;
  nextReviewAt?: string;
};
```

### 10.3 Tekrar aralıkları

- İlk başarılı buluş: 1 gün.
- İkinci başarılı buluş: 3 gün.
- Üçüncü başarılı buluş: 7 gün.
- Sonraki başarı: 14, 30 ve 60 gün.
- Hata veya yoğun ipucu: bir önceki kısa aralığa dönüş.
- Oyuncu çevrimdışıysa tarih geldiğinde yerel kuyrukta bekler.

### 10.4 Tekrar çeşitleme

Aynı kelime:

- Aynı harf havuzuyla tekrar edilmez.
- Bazen gizli kelime olur.
- Bazen anlamdan kelimeye sorulur.
- Bazen kategori bağı içinde kullanılır.
- Bazen eksik harf bulmacasında gösterilir.

Bu şekilde öğrenme tekrarı déjà vu yerine ustalık hissi verir.

## 11. Yardım ve İpucu Tasarımı

- Oyun oyuncu zorlandığında otomatik harf açmaz.
- İlk uzun beklemede yalnızca ipucu düğmesi hafifçe belirginleşebilir.
- Oyuncunun açık talebi olmadan çözüm gösterilmez.
- İpucu kademeleri:
  1. Kelime uzunluğu.
  2. Kısa anlam.
  3. Bir harf açma.
  4. Kesişim hücresi açma.
- Oyuncu hangi ipucunu satın aldığını görür.
- İpucu üç yıldız hedefini etkileyebilir fakat seviye geçişini engellemez.

## 12. Yıldız, Gizli Kelime ve Mühür Sistemi

### 12.1 Yıldızlar

- 1 yıldız: bütün ana kelimeleri tamamla.
- 2 yıldız: hedef süre/deneme veya düşük ipucu kullanımı.
- 3 yıldız: tüm gizli kelimeleri bul ve bölümün ustalık koşulunu tamamla.

Yıldız koşulları seviye başlamadan görülebilir.

### 12.2 Gizli kelime görünürlüğü

- Oyuncu toplam gizli kelime sayısını bilir.
- İstenirse sadece uzunluk bilgisi açılabilir.
- Bulunmayan kelimeler seviye bitiminde doğrudan açıklanmaz.
- Oyuncu "Tekrar Keşfet" ile geri dönebilir.

### 12.3 Mühür

- Ana hedefler bitince mühür aktif olur.
- Gizli kelimeler eksikse "2 gizli kelime kaldı; şimdi mühürleyebilir veya aramaya devam edebilirsin" mesajı gösterilir.
- Mühür basmak oyuncunun bilinçli seçimidir.
- Seviye tekrarında ana ödül tekrar verilmez.
- Önceden alınmamış gizli veya bonus kelime ödülleri verilebilir.

## 13. Ödül Ekonomisi

### 13.1 Tek seferlik ödül anahtarı

Her ödül:

```text
level:{levelId}:completion
level:{levelId}:hidden:{wordKey}
level:{levelId}:bonus:{wordKey}
chapter:{chapterId}:final
discovery:{discoveryId}
```

anahtarıyla bir kez verilir.

### 13.2 Ödül oranı

- Seviye tamamlama: ana ödül.
- Gizli kelime: kelime zorluğuna göre küçük ödül.
- Bonus kelime: daha küçük ve yalnızca ilk keşifte.
- Bölüm finali: sabit, açıkça belirtilmiş ödül.
- Ustalık tekrarı: altın yerine ustalık puanı veya sınırlı günlük ödül.

### 13.3 Enflasyon kontrolü

- Tekrar oynanan seviye ana ödül vermez.
- Günlük görev ödülü günlük sınırla kontrol edilir.
- İpucu fiyatı zorlukla artabilir ancak oyuncuyu kilitlemez.
- Para ekonomisi testlerde toplam kazanım/harcama simülasyonuyla denetlenir.

## 14. Teknik Mimari

### 14.1 Otomatik kopyalama kaldırılacak

- `createMasteryLevels` ana seviye katalog üretiminden çıkarılacak.
- 46-240 seviyeleri editoryal veri dosyalarında açıkça tanımlanacak.
- Otomatik üretici yalnızca isteğe bağlı Ustalık Atölyesi oturumları için kullanılabilecek.

### 14.2 Veri dosyaları

Önerilen yapı:

```text
src/data/journey/
  chapters.ts
  levels-001-020.ts
  levels-021-040.ts
  ...
  levels-221-240.ts
  discoveries/
    chapter-01.ts
    ...
    chapter-12.ts
  people.ts
  sources.ts
```

Tek bir dev `levels.ts` dosyası yerine bölüm sınırları kullanılır.

### 14.3 İçerik derleme hattı

```text
Editoryal JSON/TS
  -> şema doğrulama
  -> kelime normalizasyonu
  -> harf üretilebilirlik denetimi
  -> tekrar ve zorluk audit
  -> crossword yerleşim testi
  -> keşif kartı tamlık denetimi
  -> uygulama kataloğu
```

### 14.4 Çevrimdışı çalışma

- Bütün ana yol içerikleri uygulama paketinde bulunur.
- Canlı AI, ana seviye doğruluğunu belirlemez.
- Gelecekte AI öneri üretebilir fakat editoryal onay olmadan oyuncuya içerik sunamaz.
- Bonus sözlük çevrimdışı, sürümlenmiş ve geri alınabilir olmalıdır.

## 15. Veri Migrasyonu ve Oyuncu İlerlemesinin Korunması

### 15.1 Değişmez kurallar

- Güncelleme hiçbir oyuncuyu 1. seviyeye döndürmez.
- Tamamlanan seviye ve yıldızlar kaybolmaz.
- Altın, satın alınmış temalar, mühürler ve kelime koleksiyonu korunur.
- Eski otomatik seviyelerde kazanılmış ödüller geri alınmaz.

### 15.2 Seviye eşleme

Mevcut 46-120 seviyeleri değiştiğinde:

- Oyuncunun `completedLevels` bilgisi aynı seviye numarasıyla korunur.
- Yeni içeriği görmek isteyen oyuncu tamamlanmış seviyeyi tekrar oynayabilir.
- Ana tamamlama ödülü tekrar verilmez.
- Yeni gizli kelimeler ve keşif kartları ilk kez açılabilir.
- Eski yıldız ile yeni hedefler uyuşmuyorsa önceki yıldız korunur; daha yüksek derece kazanılabilir.

### 15.3 Save sürümü

- `PlayerSave.version` artırılır.
- Migrasyon saf fonksiyon olarak uygulanır.
- Eski save örnekleri fixture olarak saklanır.
- Migrasyon testleri en az v1, v2 ve yeni sürüm arasında çalışır.
- Bozuk kayıt durumunda güvenli kurtarma yapılır; geçerli alanlar kaybedilmez.

## 16. Kalite Denetimleri

### 16.1 Seviye audit

Her seviye için:

- Harf üretilebilirliği.
- En az iki ana kelime.
- Ana/gizli/bonus kelime çakışması.
- Normalize edilmiş tekrar.
- Kaba ve yasaklı kelime taraması.
- Kelime anlamı varlığı.
- Crossword yerleşebilirliği.
- Pozitif ve tutarlı ödül.
- Keşif kartı referansı.
- Bölüm/tema/seal referansı.

### 16.2 İlerleme audit

- Beş seviyelik zorluk ortalaması.
- Aynı harf torbası tekrarı.
- Ana kelime tekrar mesafesi.
- Tema dağılımı.
- Bulmaca tipi dağılımı.
- Gizli kelime yoğunluğu.
- Ana kelime uzunluğu dağılımı.
- Bölüm finali zorluk kontrolü.

### 16.3 İçerik audit

- Her keşif kartında başlık, dönem, yer, özet, etki ve bugün alanı.
- Kişi adı yazım birliği.
- Tartışmalı iddialar için editör notu.
- Tek kişi merkezli yanlış buluş anlatımına karşı kredi kontrolü.
- İslam alimleri, kadın bilim insanları ve küresel temsil dağılımı.
- Aynı keşif veya anlatının tekrar edilmemesi.

### 16.4 UX testleri

Fiziksel cihazlarda:

- Kısa ekran.
- Uzun ekran.
- Düşük performanslı Android.
- Çevrimdışı açılış.
- Güncelleme üstüne kurulum.
- 1., 45., 46., 120., 121., 200. ve 240. seviye geçişleri.
- Mühür modalı, gizli kelime seçimi ve harita yıldızları.
- Ses seviyeleri ve dokunsal geri bildirim.

## 17. Analitik Olmadan İlk Test Ölçümü

İlk sürüm kullanıcı takibi yapmadığı için kapalı test verileri:

- Testçi geri bildirim formu.
- Seviye numarası ile hata raporu.
- Oyuncunun paylaşacağı yerel tanı ekranı.
- Save içinden kişisel veri içermeyen opsiyonel hata özeti.

Ölçülecek sorular:

- Hangi seviyede tekrar hissi başladı?
- Hangi seviyede kelimeler adaletsiz hissettirdi?
- Keşif kartları okundu mu?
- Oyuncu hangi bilgiyi hatırladı?
- Gizli kelime sayısı net miydi?
- İpucu sistemi kontrolü oyuncuda mı bıraktı?

Analytics ileride eklenirse açık rıza, gizlilik politikası ve Data Safety güncellemesi gerekir.

## 18. Başarı Metrikleri

### 18.1 İçerik kalitesi

- 240 özgün ana seviye.
- Ana yolculukta otomatik kopyalanmış seviye: `0`.
- Aynı harf torbası tekrarı: `0`.
- Eksik keşif kartı: `0`.
- Kaynaksız/taslak büyük keşif kartı: `0`.
- Audit hatası: `0`.

### 18.2 Oyuncu deneyimi

Kapalı test hedefleri:

- İlk 10 seviyeyi tamamlama: en az `%80`.
- 20. seviyeye ulaşma: en az `%55`.
- Seviye "haksız" şikayeti: testçilerin `%10` altında.
- "Kendini tekrar ediyor" şikayeti: `%5` altında.
- Keşif kartlarından en az bir bilgiyi hatırlayan testçi: `%60` üzeri.
- Ortalama ipucu talebi, zorluk bandına uygun artmalı; ani sıçrama olmamalı.

### 18.3 Teknik kalite

- Lint, type-check, test, build, level audit ve release audit başarılı.
- Save migrasyon testleri başarılı.
- Kritik akışlarda sıfır bilinen çökme.
- Seviye/harita yıldız uyuşmazlığı yok.
- Ödül çift yazımı veya sınırsız altın üretimi yok.

## 19. Sürümleme Planı

### v1.0.x - Kapalı test stabilizasyonu

- Mevcut kritik bug düzeltmeleri.
- İlerleme kaybı koruması.
- Çift ödül engeli.
- Bonus kelime kabulü.
- Mühür/harita/yıldız uyumu.

### v1.1 - Bilgelik Çağı

- 46-120 arasındaki kopya seviyeleri kaldır.
- 75 özgün seviye.
- Bilgelik Evleri, optik, tıp, mekanik, astronomi ve Osmanlı bilimi kartları.
- Yeni zorluk profili ve audit.
- Save migrasyonu.

### v1.2 - Keşif ve Sanayi

- 121-180 özgün seviye.
- Kategori bağı ve eksik harf varyasyonları.
- Gelişmiş keşif koleksiyonu.
- Ustalık Atölyesi ilk sürümü.

### v1.3 - Modern Bilim ve Gelecek

- 181-240 özgün seviye.
- Bilgisayar, iletişim, uzay, genetik ve modern bilim.
- Büyük final.
- Kelime ustalık defteri.

### v1.4 - Günlük ritüel ve kontrollü rekabet

- Günlük Bilgelik Mührü.
- Haftalık Alim Rotası.
- Paylaşılabilir sonuç kartı.
- Asenkron ve hız dışı puanlanan lig.

## 20. Uygulama İş Paketleri

### Paket A - Temel altyapı

- Journey veri tipleri.
- Bölümlü veri dosyaları.
- Yeni audit kuralları.
- Save migrasyon iskeleti.
- Eski mastery üreticisini ana katalogdan ayırma.

### Paket B - 46-80

- Bilgelik Evleri ve tıp/optik içerikleri.
- 35 özgün seviye.
- 35 keşif kartı.
- İçerik ve kelime incelemesi.

### Paket C - 81-120

- Mekanik, astronomi, Anadolu ve Osmanlı bilimi.
- 40 özgün seviye.
- 40 keşif kartı.
- Bölüm final mühürleri.

### Paket D - Ustalık sistemi

- WordMastery kaydı.
- Tekrar kuyruğu.
- Çeşitlendirilmiş tekrar bulmacaları.
- Yerel bildirim olmadan oyun içi hatırlatma.

### Paket E - 121-240

- Altı yeni bölüm.
- 120 özgün seviye.
- Yeni bulmaca varyasyonları.
- Modern bilim finali.

## 21. Definition of Done

Bir içerik paketi ancak şu koşullarda tamamlanmış sayılır:

1. Bütün seviyeler editoryal veri olarak açıkça tanımlanmış.
2. Otomatik kopyalanmış ana yol seviyesi yok.
3. Kelime ve harf tekrar auditleri geçiyor.
4. Zorluk hareketli ortalaması hedef eğriye uyuyor.
5. Her seviyenin onaylı keşif kartı bulunuyor.
6. Tarihsel kişi ve buluş anlatıları içerik incelemesinden geçmiş.
7. Save migrasyonu eski ilerlemeyi koruyor.
8. Test, lint, build ve Android release başarılı.
9. En az iki fiziksel Android cihazda bölüm başı ve sonu oynanmış.
10. Kapalı test geri bildirimi kritik tekrar veya adaletsizlik sorunu göstermiyor.

## 22. Kesin Ürün Kararları

- Ana yolculukta procedural tekrar kullanılmayacak.
- AI tarafından doğrulanmamış kelime veya tarih içeriği doğrudan oyuncuya sunulmayacak.
- Otomatik ipucu verilmeyecek.
- Oyuncu ilerlemesi güncellemede sıfırlanmayacak.
- Ana ödül aynı seviyeden tekrar tekrar alınamayacak.
- Gizli kelime sayısı oyuncuya gösterilecek.
- Mühür basma kararı gizli kelimeler eksikken oyuncuya bırakılacak.
- Tarih ve bilim içeriği oyunun dekoru değil, ilerlemenin temel ödülü olacak.
- Yeni özellikler mevcut ana oyunu gölgelemeyecek; çark ve kelime keşfi ürünün merkezi kalacak.

## 23. Riskler ve Önlemler

| Risk | Etki | Önlem |
| --- | --- | --- |
| 240 seviyenin editoryal maliyeti | Gecikme | 20 seviyelik paketler ve bölüm bazlı yayın |
| Tarihsel hata | Güven kaybı | Kaynak notu ve içerik inceleme durumu |
| Zor kelime şişkinliği | Oyuncu kaybı | Kullanım sıklığı puanı ve kapalı test |
| Yeni seviyelerde save bozulması | Kritik | Saf migrasyon, fixture ve rollback testi |
| Asset boyutunun büyümesi | Büyük AAB | Bölüm başına ortak görsel, WebP ve asset audit |
| Fazla metin | Atlanma | Katmanlı kart: kısa özet + isteğe bağlı detay |
| Mekanik çeşitliliğin kimliği bozması | Dağınıklık | Çark merkezli varyasyonlar, ayrı mod sınırı |
| Temsilin yüzeysel kalması | İçerik kalitesi | Katkı bağlamı, uzman kontrolü ve dağılım audit |

## 24. İlk Uygulama Sırası

1. Mevcut 1-45 seviyeyi yeni zorluk metriğiyle yeniden ölç.
2. `createMasteryLevels` kullanımını ana katalogdan kaldıracak mimariyi hazırla.
3. Save migrasyon testlerini uygulama değişikliğinden önce yaz.
4. 46-60 için 15 özgün pilot seviye ve keşif kartı üret.
5. Pilot seviyeleri fiziksel cihazda ve kapalı test grubunda dene.
6. Sonuçlara göre 61-120 içeriğini tamamla.
7. 46-120 tamamlanmadan 121-240 üretimine geçme.
8. Ustalık Atölyesi'ni özgün ana yolculuktan sonra devreye al.

Bu sıra içerik miktarı uğruna kaliteyi kaybetmemeyi ve oyuncu ilerlemesini güvence altına almayı amaçlar.

## 25. 3D Sanat Yönü ve Görsel Kimlik

### 25.1 Ana sanat kararı

Söz Ustası'nın görsel dili:

- Koleksiyon değeri taşıyan 3D mühürler.
- Tarihsel keşif hissi veren harita ve diorama.
- Koyu lacivert, petrol yeşili, balmumu kırmızısı ve sıcak altın paleti.
- Metal, taş, ahşap, parşömen, cam ve balmumu gibi okunabilir malzemeler.
- Mobil ekranda küçük boyutta dahi tanınan güçlü siluetler.

Oyunun görsel kimliği gerçekçi tarih simülasyonu değildir. "Tarihten ilham alan, stilize premium bilgi macerası" olarak korunacaktır.

### 25.2 Görsel tutarlılık yasaları

- Bir ekranda en fazla üç baskın malzeme kullanılır.
- Altın yalnızca değer, başarı veya etkileşim önceliği gösterir.
- Kırmızı balmumu mühür, final ve onay eylemleri için ayrılır.
- Yeşil başarıyı, mavi bilgi/yardımı, kırmızı risk veya kilidi ifade eder.
- Ana metinler dokunun içine gömülmez; React/HTML katmanında kalır.
- Emoji, ana ürün arayüzünde 3D asset yerine kullanılmaz.
- Aynı işlev bütün ekranlarda aynı ikon ve renk ailesini kullanır.
- Dekorasyon okunabilirliğin önüne geçmez.

### 25.3 Asset aileleri

Her asset aşağıdaki ailelerden birine ait olmalıdır:

1. `Brand`: uygulama ikonu, logo, splash, mağaza grafikleri.
2. `Navigation`: harita düğümü, üst bar, alt navigasyon, bölüm geçidi.
3. `Gameplay`: çark, harf taşı, bulmaca hücresi, ipucu ve mühür.
4. `Reward`: altın, yıldız, sandık, keşif kartı, koleksiyon parçası.
5. `Chapter`: bölüm arka planı, simge yapısı, atmosfer dekoru.
6. `Character/Person`: bilim insanı portresi veya sembolik kişi kartı.
7. `Utility`: ayar, geri, kapat, ses, titreşim ve erişilebilirlik ikonları.

Bir asset iki farklı ailede farklı anlamlarla kullanılmamalıdır.

## 26. On İki Bölümün 3D Sanat Tasarımı

Her 20 seviyelik bölüm yeni bir dünya hissi verir ancak ortak UI kabuğunu korur.

| Bölüm | Ana palet | Malzemeler | Kahraman obje | Atmosfer |
| --- | --- | --- | --- | --- |
| İlk İzler | Kil, bakır, lacivert | Kil tablet, taş, erken metal | Tekerlek/tablet | Şafak ve ilk yerleşim |
| Bilginin Yolları | Fildişi, yeşim, altın | Kağıt, mürekkep, bambu | Rulo ve pusula | Yolculuk ve kütüphane |
| Bilgelik Evleri | Turkuaz, koyu mavi, pirinç | Çini, kitap, pirinç alet | Bilgelik Evi kubbesi | Bağdat gece göğü |
| Işık, Tıp ve Doğa | Zümrüt, cam mavisi | Cam, deri kitap, bitki | Mercek ve şifa kitabı | Laboratuvar/bahçe |
| Makineler ve Gökyüzü | Pirinç, gece moru | Dişli, su, yıldız haritası | Usturlap ve su saati | Gözlemevi |
| Anadolu ve Osmanlı Bilimi | İznik mavisi, kırmızı, altın | Çini, ahşap, parşömen | Harita ve rasathane | İstanbul/Anadolu |
| Matbaa ve Deney | Mürekkep siyahı, bordo | Baskı harfi, kağıt, cam | Matbaa presi | Atölye |
| Enerji ve Sanayi | Çelik, bakır, turuncu | Metal, buhar, bobin | Dinamo/buhar makinesi | Fabrika ve kıvılcım |
| Görünmeyen Dünya | Mor, biyolojik yeşil | Cam, sıvı, hücre dokusu | Mikroskop | Laboratuvar |
| Hesaplama ve İletişim | Teal, elektrik mavisi | Tel, delikli kart, ekran | Şifre makinesi | Veri akışı |
| Uzay ve Modern Fizik | Siyah, yıldız mavisi, beyaz | Cam, ışık, uzay metali | Uydu/roket | Yörünge |
| Yaşamın Geleceği | Beyaz, turkuaz, sıcak altın | DNA camı, ışık, biyotek doku | Çift sarmal/ağ | Umut ve açık gelecek |

### 26.1 Bölüm paketleri

Her bölüm için üretilecek minimum görsel paket:

- 1 dikey harita/diorama arka planı.
- 1 bölüm başlık plakası.
- 1 bölüm geçidi veya kapısı.
- 1 final mührü.
- 4 seviye düğümü varyasyonu: kilitli, aktif, tamamlandı, ustalık.
- 1 büyük keşif kahraman objesi.
- 3 koleksiyon objesi.
- 1 keşif kartı çerçevesi.
- 1 bölüm sandığı.
- 1 mağaza/tema küçük resmi.
- 1 düşük hareket modu için statik alternatif.

## 27. Ekran Tasarım Sözleşmeleri

### 27.1 Splash ekranı

Amaç: Uygulamanın açıldığını net göstermek ve marka hafızası oluşturmak.

- Ortada ana mühür ikonu.
- Arka planda düşük kontrastlı lacivert doku.
- En fazla 1.2 saniyelik kontrollü ışık geçişi.
- Splash asset ile uygulama ikonu aynı marka dilinde olmalı.
- Yükleme uzarsa statik ilerleme göstergesi görünmeli.
- Animasyon tamamlanmadan uygulama hazırsa gereksiz bekleme yapılmamalı.

Kabul:

- 360x640 ile 1440x3200 aralığında kırpılma yok.
- Sistem çubuklarıyla çakışma yok.
- Düşük hareket modunda yalnız opacity geçişi.

### 27.2 Başlangıç ekranı

Amaç: Tek bakışta marka, ilerleme ve ana eylem.

Hiyerarşi:

1. Logo plakası.
2. Oyuncunun son kaldığı bölge/ünvan.
3. `Devam Et` ana düğmesi.
4. Günlük görev ve ikincil ekranlar.

Kurallar:

- Logo ekran yüksekliğinin `%28` değerini geçmez.
- Ana CTA başparmak erişim bölgesinde bulunur.
- Birincil ve ikincil düğmeler aynı ağırlıkta görünmez.
- İlk oyuncuya "Başla", geri dönen oyuncuya "Devam Et - Seviye N" gösterilir.

### 27.3 Onboarding

- En fazla üç kısa ekran.
- Her ekran tek kavram öğretir: harfleri birleştir, kelime keşfet, mühürle.
- Metin yerine etkileşimli kısa gösterim tercih edilir.
- Atla seçeneği görünürdür.
- Erişilebilirlik ve ses tercihi ilk oturumda açılabilir.

### 27.4 Harita ekranı

Amaç: ilerleme, merak ve bölüm kimliği.

- Dikey kaydırılan diorama.
- Aktif seviye görsel olarak tek baskın odaktır.
- Tamamlanan düğümlerde gerçek kazanılan yıldız sayısı gösterilir.
- Kilitli düğüm erişilemez görünür ama bir sonraki hedefi anlatır.
- Her 5 seviyede mini anıt, her 20 seviyede bölüm kapısı bulunur.
- Bölüm başlığı sticky olabilir ancak içeriği ezmez.
- Günlük görev/para alanı üst barda sınırlı yer kaplar.

Kabul:

- Harita yıldızları `levelMastery` tek kaynağından gelir.
- Seviye düğümleri ekran kenarında kırpılmaz.
- Son aktif seviye açılışta görünür alana kaydırılır.
- 120 Hz cihazda gereksiz scroll jank bulunmaz.

### 27.5 Seviye başlangıç ekranı

Amaç: oyuncuyu bilgilendirmek, korkutmadan hedef vermek.

Gösterilecekler:

- Seviye numarası ve bölüm adı.
- Ana görev sayısı.
- Gizli kelime sayısı.
- Üç yıldız koşulları.
- Ödül.
- Bölümün kısa atmosfer cümlesi.

Gösterilmeyecekler:

- Çözülecek kelimeler.
- Gereksiz uzun tarih metni.
- Birbiriyle yarışan çok sayıda CTA.

Ana düğme: `Bulmacayı Aç`.

### 27.6 Oyun ekranı

Öncelik sırası:

1. Bulmaca tahtası.
2. Aktif kelime geri bildirimi.
3. Harf çarkı.
4. İpucu, karıştır ve mühür kontrolleri.
5. Altın ve seviye bilgisi.

Kurallar:

- Çark dokunma hedefleri en az 48x48 CSS px.
- Seçim çizgisi parmağın altında görünür kalmalı.
- Harf seçimi 100 ms altında tepki vermeli.
- Kelime kabul animasyonu yeni girişleri engellememeli.
- İpucu düğmesi otomatik çözüm başlatmamalı.
- Mühür yalnızca ana hedefler tamamlandığında etkinleşmeli.
- Gizli kelime ilerlemesi `2/4` biçiminde görünmeli.
- Uzun cihaz ve kısa cihaz düzenleri ayrı breakpoint ile ele alınmalı.

### 27.7 İpucu modalı

- Hangi yardımın ne kadar altın harcadığı açıkça görünür.
- Butonlar: anlam, uzunluk, harf, kesişim.
- Satın alma tek dokunuşla yanlışlıkla çalışmamalı; fiyat ve sonuç aynı butonda açık olmalı.
- Yetersiz altında mağaza yönlendirmesi oyuncuyu oyun akışından koparmamalı.

### 27.8 Mühür ve seviye sonuç ekranı

Amaç: başarıyı kutlamak, öğretmek ve sonraki hedefi vermek.

Katmanlar:

1. Kısa mühür açılış animasyonu.
2. Kazanılan yıldızlar.
3. Ödül özeti.
4. Keşif kartı özeti.
5. Gizli kelime durumu.
6. Tekrar Keşfet / Sonraki Seviye.

Kurallar:

- Sonraki seviye düğmesi kaydırma gerektirmeden erişilebilir olmalı.
- İçerik kısa ekranlarda sıkıştırılır; ana CTA sticky kalır.
- Ödül `0` ise görsel olarak basılmaz.
- Daha önce alınan ana ödül ikinci kez gösterilmez.
- Büyük keşif metni açılır detay katmanında okunabilir.

### 27.9 Keşif kasası

Amaç: öğrenmeyi koleksiyona dönüştürmek.

Sekmeler:

- Kelimeler.
- Bilim insanları.
- Buluşlar.
- Mühürler.
- Bölümler.

Kartlar:

- Kilitli kart yalnız siluet ve açılma koşulu gösterir.
- Açık kart kişi/buluş adı, kısa bilgi ve ilgili seviyeyi gösterir.
- Favoriye ekleme ve tekrar oynama bulunur.
- Arama ve dönem filtresi uygulanır.

### 27.10 Sözlük

- Türkçe karakter duyarlı arama.
- Ana, gizli ve bonus kelime ayrımı.
- Kelime anlamı, zorluk, ilk bulunduğu seviye.
- Öğrenme ustalığı ve sonraki tekrar bilgisi.
- Metin ağırlıklı ekran olduğu için dekor düşük tutulur.

### 27.11 Mağaza

- Satın alınan öğenin kullanım alanı açıkça yazılır.
- Tema önizlemesi harita/oyun küçük maketiyle gösterilir.
- Mühür önizlemesi gerçek sonuç ekranı üzerinde görünür.
- Satın alma sonrası otomatik seçim veya `Kullan` düğmesi.
- Sahip olunan, seçili ve satın alınabilir durumları görsel olarak ayrıdır.
- İlk sürümde gerçek para yoksa mağaza bunun oyun içi altın olduğunu açıkça belirtir.

### 27.12 Profil

- Seviye, toplam yıldız, kelime koleksiyonu ve bölüm ilerlemesi.
- Hız yerine öğrenme/keşif başarısı öne çıkar.
- Rozetler gerçek davranışa bağlıdır.
- İstatistikler oyuncuyu utandırmaz.

### 27.13 Ayarlar

- Efekt sesi aç/kapat.
- Efekt ses seviyesi.
- Dokunsal geri bildirim.
- Hareket azaltma.
- Düşük görsel kalite modu.
- Gizlilik politikası.
- Sürüm bilgisi.

Slider ve toggle durumları yüksek kontrastlı ve ekran okuyucu etiketli olmalıdır.

## 28. 3D Asset Teknik Standardı

### 28.1 Dosya formatı

- Fotoğrafik/karmaşık arka plan: WebP veya AVIF; Android cihaz desteği test edilir.
- Şeffaf küçük UI asset: optimize PNG veya WebP alpha.
- Basit ikon ve çerçeve: SVG.
- Gerçek zamanlı model gerekiyorsa glTF/GLB ve sıkıştırılmış texture.
- UI metni görsele gömülmez.

### 28.2 Çözünürlük

- Uygulama ikonu kaynak: en az 1024x1024; Play çıktısı 512x512.
- Seviye düğümü: maksimum 512x512.
- Küçük mühür: maksimum 512x512.
- Ana ekran mühürü: maksimum 768x768.
- Dikey bölüm arka planı: hedef 1080x1920 veya cihazda yeterli eşdeğer.
- Tam ekran PNG ancak alpha gerçekten gerekliyse kullanılır.
- Görsel, ekranda gösterilen boyutun 2 katından gereksiz büyük tutulmaz.

### 28.3 Boyut bütçesi

| Asset | Hedef | Sert sınır |
| --- | ---: | ---: |
| Küçük ikon | 20 KB | 60 KB |
| Seviye düğümü | 120 KB | 300 KB |
| Mühür | 180 KB | 400 KB |
| Kart/çerçeve | 180 KB | 450 KB |
| Dikey arka plan | 700 KB | 1.5 MB |
| Bölüm kahraman objesi | 350 KB | 800 KB |
| GLB model | 1 MB | 3 MB |

Toplam kurulu asset bütçesi:

- v1.1 hedefi: 45 MB altında AAB.
- v1.3 hedefi: Play Asset Delivery olmadan 70 MB altında.
- Bu sınır aşılırsa bölüm paketleri isteğe bağlı asset delivery ile ayrılır.

### 28.4 İsimlendirme

```text
chapter-{nn}-{purpose}-{state}-v{n}.{ext}
gameplay-{component}-{state}-v{n}.{ext}
reward-{type}-{tier}-v{n}.{ext}
```

Örnek:

```text
chapter-04-astrolabe-hero-v1.webp
gameplay-letter-node-selected-v2.svg
reward-seal-astronomy-gold-v1.webp
```

`01-asset.png` gibi anlam taşımayan isimler yeni üretimde kullanılmaz.

### 28.5 Kaynak ve lisans

Her asset için metadata:

- Üreten kişi/araç.
- Üretim tarihi.
- Kaynak prompt veya brief.
- Lisans/telif durumu.
- Kullanıldığı ekranlar.
- Sürüm.
- Son optimizasyon tarihi.

Lisansı belirsiz asset release paketine alınmaz.

## 29. Animasyon Sistemi

Mevcut `Animation-3D-Upgrade-Plan-v1.md` bu ana planın alt sözleşmesidir.

### 29.1 Hareket tokenları

```text
motion-fast: 140 ms
motion-standard: 220 ms
motion-emphasis: 420 ms
motion-reward: 800-1200 ms
motion-seal-final: maksimum 1600 ms
```

Easing:

- Dokunma: hızlı çıkış.
- 3D nesne yerleşimi: ağırlıklı spring benzeri hareket.
- Modal: scale + opacity, aşırı zıplama yok.
- Harita açılışı: yavaş kamera panı değil, kontrollü scroll yerleşimi.

### 29.2 Animasyon önceliği

- P0: dokunma, doğru/yanlış kelime, gizli kelime, mühür.
- P1: yıldız, altın, koleksiyon, bölüm kapısı.
- P2: atmosfer parçacıkları ve nadir eğlenceli tepkiler.

P2 animasyonları P0/P1 performansını etkiliyorsa kapatılır.

### 29.3 Ses eşlemesi

Her yüksek değerli animasyonun ayırt edilebilir sesi olmalıdır:

- Harf seçimi.
- Doğru kelime.
- Gizli kelime.
- Bonus kelime.
- Yıldız.
- Altın.
- Mühür.
- Bölüm kapısı.

Sesler aynı anda üst üste bindirilerek gürültü oluşturmamalı; merkezi ses yöneticisi önceliklendirme yapmalıdır.

## 30. Responsive ve Güvenli Alan Tasarımı

Destek matrisleri:

- 360x640 kısa Android.
- 360x800 standart.
- 412x915 uzun.
- 480x1040 büyük telefon.
- 600-800 dp tablet.

Kurallar:

- `100dvh` ve safe-area değişkenleri kullanılır.
- Ana CTA alt navigasyon ve sistem hareket alanının üstünde kalır.
- Modal maksimum yüksekliği ekranı aşmaz.
- Metin büyütmede buton yazıları kesilmez.
- Yatay mod desteklenmiyorsa manifest ve ekran davranışı açıkça dikeyle sınırlandırılır.
- Tablet düzeninde içerik gereksiz büyütülmez; merkez sütun maksimum genişlik kullanır.

## 31. Erişilebilirlik

- Metin kontrastı WCAG AA hedefler.
- Dokunma hedefi minimum 48x48 CSS px.
- Renk tek başına durum anlatmaz; ikon/metin desteği bulunur.
- Bütün butonlarda erişilebilir ad.
- Dekoratif görseller boş `alt` veya `aria-hidden`.
- Hareket azaltma seçeneği uygulama içinde de bulunur.
- Ses kapalıyken bütün geri bildirimler görsel olarak anlaşılır.
- Titreşim kapalıyken bilgi kaybı olmaz.
- Türkçe karakterler bütün fontlarda eksiksiz görünür.
- Dinamik yazı boyutunda kritik CTA kaybolmaz.

## 32. Görsel Performans Bütçesi

Hedef cihaz: orta sınıf Android, 4 GB RAM.

- Oyun sırasında hedef: 60 FPS.
- Kabul alt sınırı: kısa süreli 45 FPS.
- Dokunma geri bildirimi: 100 ms altında.
- Harita ilk görünür içerik: 2 saniye altında.
- Ekran başına aynı anda maksimum 2 yüksek maliyetli blur.
- Sürekli çalışan parçacık sayısı kalite moduna göre sınırlandırılır.
- Off-screen animasyonlar durdurulur.
- Büyük arka planlar decode boyutuna uygun yüklenir.
- React render döngüsünde sürekli ölçüm yapılmaz.
- WebGL yalnız gerçek değer üreten ekranlarda kullanılır; basit UI için CSS/2D asset tercih edilir.

### 32.1 Kalite modları

`Yüksek`:

- Tam parçacık.
- Gelişmiş gölge ve parlama.
- Bölüm atmosfer efektleri.

`Dengeli`:

- Varsayılan.
- Azaltılmış parçacık ve blur.
- 3D hissi korunur.

`Düşük`:

- Statik arka plan.
- Parçacık yok.
- Basit gölge.
- Transform/opacity animasyonu.

## 33. Asset ve Ekran QA Süreci

### 33.1 Otomatik denetim

- Kullanılmayan asset.
- Gömülü `<text>` içeren SVG.
- Boyut bütçesini aşan dosya.
- Yanlış çözünürlük.
- Eksik metadata/lisans.
- Kırık asset yolu.
- Aynı assetin gereksiz kopyaları.
- Türkçe karakter içermeyen/yetersiz font.

### 33.2 Görsel regresyon

Referans ekran görüntüleri:

- Splash.
- Başlangıç.
- Harita: kilitli/aktif/tamamlandı.
- Seviye başlangıcı.
- Oyun: kısa ve uzun cihaz.
- İpucu.
- Mühür sonucu.
- Kasa.
- Sözlük.
- Mağaza.
- Profil.
- Ayarlar.

Her ana değişiklikte Playwright ile ekran görüntüsü farkı incelenir.

### 33.3 Fiziksel cihaz kontrolü

Her release:

- En az iki farklı üretici cihaz.
- Biri kısa/düşük çözünürlük.
- Biri uzun/yüksek çözünürlük.
- Ses, titreşim, dokunma, safe-area, geri tuşu, uygulamayı arka plana alma.
- 30 dakikalık oynanışta bellek ve sıcaklık gözlemi.

## 34. 3D Asset ve Ekran Uygulama İş Paketleri

### Görsel Paket 0 - Temizlik ve envanter

- Tüm assetleri aile, ekran, boyut, lisans ve kullanım durumuna göre katalogla.
- Kullanılmayan ve eski sürüm assetlerini release paketinden çıkar.
- Gömülü metin ve emoji placeholderlarını temizle.
- Asset audit ve optimizasyon scriptlerini release kapısına bağla.

### Görsel Paket 1 - Tasarım sistemi

- Renk, malzeme, ışık, gölge, radius ve motion tokenları.
- Button3D, Panel3D, Modal, ResourcePill, StarRating ve WaxSeal bileşenlerini tek sözleşmeye çek.
- İkon durumlarını normal/pressed/disabled/selected olarak standardize et.
- Türkçe tipografi ve dinamik metin testi.

### Görsel Paket 2 - Ana akış

- Splash.
- Başlangıç.
- Onboarding.
- Harita.
- Seviye başlangıcı.
- Oyun ekranı.
- İpucu.
- Mühür ve sonuç.

Bu paket v1.1 içerik yenilemesinden önce tamamlanmalıdır.

### Görsel Paket 3 - Öğrenme ve koleksiyon

- Keşif kartları.
- Bilim insanı kartları.
- Kasa.
- Sözlük.
- Ustalık Atölyesi.
- Bölüm final ekranları.

### Görsel Paket 4 - Ekonomi ve profil

- Mağaza önizlemeleri.
- Tema/mühür kullanım göstergesi.
- Profil ve istatistik ekranı.
- Günlük/haftalık görev ekranları.

### Görsel Paket 5 - On iki bölüm

- Her bölüm için minimum görsel paket.
- Bölüm başı sanat incelemesi.
- Paket boyutu ve performans denetimi.
- Mağaza ekran görüntüleri için temiz sahneler.

## 35. Görsel Definition of Done

Bir ekran veya asset paketi ancak şu koşullarda tamamlanmış sayılır:

1. Tasarım sistemi tokenlarını kullanıyor.
2. Geçici emoji veya placeholder asset yok.
3. Türkçe metin görsele gömülü değil.
4. Kısa ve uzun telefonda taşma/kırpılma yok.
5. Safe-area ve alt hareket alanı korunuyor.
6. Dokunma hedefleri minimum boyutta.
7. Hareket azaltma ve düşük kalite modu çalışıyor.
8. Asset boyut bütçesi geçiliyor.
9. UI asset audit ve kırık yol denetimi temiz.
10. Görsel regresyon onayı var.
11. En az iki fiziksel cihazda kontrol edildi.
12. Ekran okuyucu adı ve kontrast kontrolü tamamlandı.
13. Animasyon oyuncu girişini engellemiyor.
14. İlgili ses efekti açık/kapalı ve seviye ayarıyla doğru davranıyor.
15. Mağaza ekran görüntüsünde kullanılabilecek görsel kaliteye ulaşıyor.

## 36. Birleşik Uygulama Sırası

İçerik ve görsel geliştirme birbirinden kopuk yürütülmeyecektir:

1. Save migrasyonu ve journey veri altyapısı.
2. Görsel Paket 0: asset envanteri ve temizlik.
3. Görsel Paket 1: tasarım sistemi.
4. 46-60 pilot seviye içerikleri.
5. Görsel Paket 2: ana akış ekranları.
6. 46-60 pilotun fiziksel cihaz testi.
7. 61-120 özgün içerik ve Bölüm 3-6 görsel paketleri.
8. Keşif kasası ve bilim insanı kartları.
9. Ustalık Atölyesi.
10. 121-180 içerik ve görseller.
11. 181-240 içerik ve görseller.
12. Görsel regresyon, performans, release ve mağaza materyali yenilemesi.

Bu sıra, güzel görünen fakat tekrarlı bir oyun veya içerik açısından zengin fakat tutarsız bir arayüz üretme riskini engeller.
