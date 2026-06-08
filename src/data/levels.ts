import type { LevelData } from '../types';

export const levels: LevelData[] = [
  {
    levelId: 1,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_01',
    puzzleType: 'crossword',
    letters: ["A","R","I"],
    mainWords: [
      { word: 'ARI', meaning: 'Bal yapan, kanatlı küçük böcek.', difficulty: 1 },
      { word: 'AR', meaning: 'Utanma duygusu.', difficulty: 2 }
    ],
    hiddenWords: [
    ],
    reward: { baseCoin: 24, hiddenWordBonus: 8 },
  },
  {
    levelId: 2,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_02',
    puzzleType: 'crossword',
    letters: ["E","L","M","A","A"],
    mainWords: [
      { word: 'ELMA', meaning: 'Tatlı ve sulu bir meyve.', difficulty: 1 },
      { word: 'LAMA', meaning: 'Güney Amerika kökenli yük hayvanı.', difficulty: 1 },
      { word: 'MALA', meaning: 'İnşaat veya sıva işlerinde kullanılan el aleti.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'MAL', meaning: 'Alınıp satılabilen eşya veya ürün.', reward: 8 }
    ],
    reward: { baseCoin: 25, hiddenWordBonus: 7 },
  },
  {
    levelId: 3,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_03',
    puzzleType: 'crossword',
    letters: ["K","A","L","E"],
    mainWords: [
      { word: 'KALE', meaning: 'Savunma amacıyla yapılmış güçlü yapı.', difficulty: 2 },
      { word: 'KAL', meaning: 'Bulunduğu yerde durmak.', difficulty: 2 },
      { word: 'EL', meaning: 'Kolun bilekten parmak uçlarına kadar olan bölümü.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AL', meaning: 'Almak eyleminin emir biçimi.', reward: 9 }
    ],
    reward: { baseCoin: 30, hiddenWordBonus: 9 },
  },
  {
    levelId: 4,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_04',
    puzzleType: 'anagram',
    letters: ["S","Ö","Z","Ü"],
    mainWords: [
      { word: 'SÖZ', meaning: 'Anlam taşıyan ses veya kelime dizisi.', difficulty: 2 },
      { word: 'ÖZ', meaning: 'Bir şeyin temel niteliği.', difficulty: 2 },
      { word: 'SÜZ', meaning: 'Bir sıvıyı süzgeçten geçirmek.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'ÖZÜ', meaning: 'Özünü, kendini veya bir şeyin aslını.', reward: 8 }
    ],
    reward: { baseCoin: 32, hiddenWordBonus: 9 },
  },
  {
    levelId: 5,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_01',
    puzzleType: 'crossword',
    letters: ["M","E","R","A","K"],
    mainWords: [
      { word: 'MERAK', meaning: 'Bir şeyi öğrenme veya anlama isteği.', difficulty: 2 },
      { word: 'KARE', meaning: 'Dört kenarı ve dört açısı eşit olan şekil.', difficulty: 1 },
      { word: 'KREM', meaning: 'Yumuşak kıvamlı bakım veya tatlı karışımı.', difficulty: 1 }
    ],
    hiddenWords: [
      { word: 'ERK', meaning: 'Güç, yetki veya iktidar.', reward: 8 }
    ],
    reward: { baseCoin: 31, hiddenWordBonus: 7 },
  },
  {
    levelId: 6,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_02',
    puzzleType: 'crossword',
    letters: ["D","İ","L","E","K"],
    mainWords: [
      { word: 'DİLEK', meaning: 'Gerçekleşmesi istenen şey.', difficulty: 2 },
      { word: 'DİL', meaning: 'İnsanların anlaşmasını sağlayan sözlü sistem.', difficulty: 2 },
      { word: 'KEDİ', meaning: 'Evcil, çevik ve küçük bir memeli hayvan.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'DİK', meaning: 'Eğik olmayan, yukarı doğru duran.', reward: 9 }
    ],
    reward: { baseCoin: 36, hiddenWordBonus: 9 },
  },
  {
    levelId: 7,
    themeId: 'ege_coast',
    sealId: 'seal_ege_01',
    puzzleType: 'wordsearch',
    letters: ["A","N","L","A","M"],
    mainWords: [
      { word: 'ANLAM', meaning: 'Bir sözün veya işaretin anlattığı şey.', difficulty: 2 },
      { word: 'ALAN', meaning: 'Açık yer veya belirli bir çalışma bölgesi.', difficulty: 2 },
      { word: 'MANA', meaning: 'Anlam, içerik veya ifade ettiği değer.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'NAM', meaning: 'Ün, şöhret veya ad.', reward: 9 },
      { word: 'AL', meaning: 'Kırmızı renk veya almak emir biçimi.', reward: 5 }
    ],
    reward: { baseCoin: 38, hiddenWordBonus: 9 },
  },
  {
    levelId: 8,
    themeId: 'ege_coast',
    sealId: 'seal_ege_02',
    puzzleType: 'crossword',
    letters: ["S","A","H","İ","L"],
    mainWords: [
      { word: 'SAHİL', meaning: 'Deniz, göl veya akarsu kıyısı.', difficulty: 3 },
      { word: 'ASİL', meaning: 'Soylu, değerli ve ağırbaşlı.', difficulty: 2 },
      { word: 'HAL', meaning: 'Durum, vaziyet veya görünüş.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'İLAH', meaning: 'Tanrı veya kutsal varlık anlamında kullanılan söz.', reward: 10 }
    ],
    reward: { baseCoin: 41, hiddenWordBonus: 10 },
  },
  {
    levelId: 9,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_01',
    puzzleType: 'anagram',
    letters: ["M","Ü","H","Ü","R","U"],
    mainWords: [
      { word: 'MÜHÜR', meaning: 'Bir belgeye iz bırakmak için kullanılan damga.', difficulty: 3 },
      { word: 'HÜR', meaning: 'Özgür, bağımsız.', difficulty: 2 },
      { word: 'RUH', meaning: 'Canlılık verdiğine inanılan manevi varlık.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'RUM', meaning: 'Anadolu ve çevresindeki tarihsel topluluk adlarından biri.', reward: 13 }
    ],
    reward: { baseCoin: 45, hiddenWordBonus: 11 },
  },
  {
    levelId: 10,
    themeId: 'ottoman_library',
    sealId: 'seal_library_01',
    puzzleType: 'crossword',
    letters: ["K","A","L","E","M"],
    mainWords: [
      { word: 'KALEM', meaning: 'Yazı yazmaya yarayan araç.', difficulty: 2 },
      { word: 'KELAM', meaning: 'Söz, konuşma veya ifade.', difficulty: 2 },
      { word: 'KALE', meaning: 'Savunma amacıyla yapılmış güçlü yapı.', difficulty: 1 },
      { word: 'KEM', meaning: 'Kötü, fena, yetersiz.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'ALEM', meaning: 'Dünya, evren veya topluluk.', reward: 12 }
    ],
    reward: { baseCoin: 42, hiddenWordBonus: 8 },
  },
  {
    levelId: 11,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_01',
    puzzleType: 'crossword',
    letters: ["K","Ü","L","T","Ü","R"],
    mainWords: [
      { word: 'KÜLTÜR', meaning: 'Bir toplumun maddi ve manevi değerleri bütünü.', difficulty: 3 },
      { word: 'TÜRK', meaning: 'Türk milletinden olan kimse.', difficulty: 2 },
      { word: 'TÜR', meaning: 'Ortak özellikleri olan varlıkların bölümü.', difficulty: 2 },
      { word: 'KÜR', meaning: 'Tedavi veya bakım amacıyla uygulanan yöntem.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'ÜLKÜ', meaning: 'Ulaşılmak istenen yüce amaç.', reward: 13 }
    ],
    reward: { baseCoin: 46, hiddenWordBonus: 10 },
  },
  {
    levelId: 12,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_01',
    puzzleType: 'crossword',
    letters: ["T","A","R","İ","H","A"],
    mainWords: [
      { word: 'TARİH', meaning: 'Geçmişte yaşanan olayları inceleyen bilgi alanı.', difficulty: 3 },
      { word: 'HARİTA', meaning: 'Bir yerin kuş bakışı çizimle gösterilmiş biçimi.', difficulty: 3 },
      { word: 'HATA', meaning: 'Yanlışlık veya kusurlu davranış.', difficulty: 2 },
      { word: 'ARİ', meaning: 'Katışıksız, saf veya temiz olan.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AHİ', meaning: 'Anadolu esnaf geleneğinde kardeşlik ve dayanışma üyesi.', reward: 13 }
    ],
    reward: { baseCoin: 49, hiddenWordBonus: 10 },
  },
  {
    levelId: 13,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_01',
    puzzleType: 'wordsearch',
    letters: ["Y","A","Y","L","A"],
    mainWords: [
      { word: 'YAYLA', meaning: 'Yazın çıkılan yüksek ve serin yer.', difficulty: 3 },
      { word: 'YAYA', meaning: 'Yürüyerek giden kimse.', difficulty: 2 },
      { word: 'AYLA', meaning: 'Ayın çevresinde görülen ışıklı halka.', difficulty: 2 },
      { word: 'ALAY', meaning: 'Bir topluluk veya şaka yoluyla küçümseme.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'YAL', meaning: 'Deniz veya göl kıyısındaki konak, köşk.', reward: 10 },
      { word: 'AY', meaning: 'Güneş sisteminde Dünya\'nın uydusu.', reward: 5 }
    ],
    reward: { baseCoin: 51, hiddenWordBonus: 10 },
  },
  {
    levelId: 14,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_02',
    puzzleType: 'crossword',
    letters: ["D","E","R","E","N"],
    mainWords: [
      { word: 'DEREN', meaning: 'Toplayan, bir araya getiren kimse.', difficulty: 3 },
      { word: 'DERE', meaning: 'Küçük akarsu.', difficulty: 2 },
      { word: 'EREN', meaning: 'Olgunluğa ve erdeme ulaşmış kimse.', difficulty: 2 },
      { word: 'NERE', meaning: 'Hangi yer anlamında kullanılan soru sözü.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'REN', meaning: 'Geyikgillerden, soğuk bölgelerde yaşayan hayvan.', reward: 10 }
    ],
    reward: { baseCoin: 53, hiddenWordBonus: 10 },
  },
  {
    levelId: 15,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_05',
    puzzleType: 'anagram',
    letters: ["S","A","R","A","Y"],
    mainWords: [
      { word: 'SARAY', meaning: 'Hükümdarların yaşadığı büyük yapı.', difficulty: 3 },
      { word: 'YARA', meaning: 'Deride veya dokuda oluşan zedelenme.', difficulty: 2 },
      { word: 'SARA', meaning: 'Bayılma nöbetleriyle bilinen bir hastalık.', difficulty: 2 },
      { word: 'ARSA', meaning: 'Üzerine yapı yapılabilecek toprak parçası.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AYAR', meaning: 'Bir şeyin ölçüsü veya düzeni.', reward: 10 },
      { word: 'YASA', meaning: 'Kanun, kural veya yasak.', reward: 8 }
    ],
    reward: { baseCoin: 53, hiddenWordBonus: 10 },
  },
  {
    levelId: 16,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_06',
    puzzleType: 'crossword',
    letters: ["K","A","P","I","L"],
    mainWords: [
      { word: 'KAP', meaning: 'İçine bir şey konulan nesne.', difficulty: 2 },
      { word: 'KAPI', meaning: 'Bir yere girip çıkmaya yarayan açıklık.', difficulty: 2 },
      { word: 'KALP', meaning: 'Kan dolaşımını sağlayan organ.', difficulty: 2 },
      { word: 'PLAK', meaning: 'Ses kaydetmeye yarayan eski disk.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'ALP', meaning: 'Yiğit, kahraman, cesur kimse.', reward: 9 }
    ],
    reward: { baseCoin: 54, hiddenWordBonus: 9 },
  },
  {
    levelId: 17,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_03',
    puzzleType: 'crossword',
    letters: ["B","A","L","O","N"],
    mainWords: [
      { word: 'BALON', meaning: 'Hava veya gazla şişirilen esnek nesne.', difficulty: 3 },
      { word: 'BALO', meaning: 'Danslı ve eğlenceli toplantı.', difficulty: 2 },
      { word: 'BOL', meaning: 'Miktarı çok olan.', difficulty: 2 },
      { word: 'OLAN', meaning: 'Var olan veya gerçekleşen şey.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AL', meaning: 'Almak eyleminin emir biçimi.', reward: 10 }
    ],
    reward: { baseCoin: 57, hiddenWordBonus: 10 },
  },
  {
    levelId: 18,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_04',
    puzzleType: 'wordsearch',
    letters: ["V","A","D","İ","L"],
    mainWords: [
      { word: 'VADİ', meaning: 'İki dağ arasında uzanan çukur arazi.', difficulty: 2 },
      { word: 'DİL', meaning: 'İnsanların anlaşmasını sağlayan sözlü sistem.', difficulty: 3 },
      { word: 'ADİL', meaning: 'Hakkı gözeten, adaletli.', difficulty: 3 },
      { word: 'VİDA', meaning: 'Bir nesneyi sabitlemek için kullanılan dişli bağlantı elemanı.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'VALİ', meaning: 'Bir ili yöneten en üst kamu görevlisi.', reward: 11 },
      { word: 'DAV', meaning: 'Bir şeyi istemek için yapılan başvuru.', reward: 5 }
    ],
    reward: { baseCoin: 61, hiddenWordBonus: 11 },
  },
  {
    levelId: 19,
    themeId: 'ege_coast',
    sealId: 'seal_ege_03',
    puzzleType: 'crossword',
    letters: ["Z","E","Y","T","İ","N"],
    mainWords: [
      { word: 'ZEYTİN', meaning: 'Yağı çıkarılan, Akdeniz ikliminde yetişen meyve.', difficulty: 3 },
      { word: 'YETİ', meaning: 'Bir işi yapabilme gücü veya kabiliyet.', difficulty: 3 },
      { word: 'TİZ', meaning: 'İnce ve keskin ses.', difficulty: 3 },
      { word: 'YENİ', meaning: 'Kullanılmamış veya yakın zamanda ortaya çıkmış.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'TEN', meaning: 'İnsan vücudu, beden.', reward: 11 }
    ],
    reward: { baseCoin: 64, hiddenWordBonus: 12 },
  },
  {
    levelId: 20,
    themeId: 'ege_coast',
    sealId: 'seal_ege_04',
    puzzleType: 'anagram',
    letters: ["D","E","N","İ","Z"],
    mainWords: [
      { word: 'DENİZ', meaning: 'Yeryüzünün büyük tuzlu su kütlesi.', difficulty: 3 },
      { word: 'DİZ', meaning: 'Bacağın ortasındaki eklem bölgesi.', difficulty: 2 },
      { word: 'DİN', meaning: 'İnanç ve ibadet düzeni.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'İZ', meaning: 'Bir şeyin bıraktığı belirti.', reward: 10 },
      { word: 'NEDİ', meaning: 'Ne idi sorusunun kısaltılmış hali.', reward: 8 }
    ],
    reward: { baseCoin: 63, hiddenWordBonus: 10 },
  },
  {
    levelId: 21,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_02',
    puzzleType: 'crossword',
    letters: ["T","O","P","R","A","K"],
    mainWords: [
      { word: 'TOPRAK', meaning: 'Bitkilerin yetiştiği, yeryüzünü örten doğal katman.', difficulty: 3 },
      { word: 'PARK', meaning: 'Dinlenmek veya gezmek için düzenlenmiş yeşil alan.', difficulty: 2 },
      { word: 'KART', meaning: 'Sert kâğıt parçası veya elektronik ödeme aracı.', difficulty: 3 },
      { word: 'ROTA', meaning: 'İzlenecek yol veya yön.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'KOR', meaning: 'İyice yanmış ateş parçası.', reward: 11 }
    ],
    reward: { baseCoin: 67, hiddenWordBonus: 11 },
  },
  {
    levelId: 22,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_03',
    puzzleType: 'wordsearch',
    letters: ["H","A","S","A","T"],
    mainWords: [
      { word: 'HASAT', meaning: 'Olgunlaşan ürünü toplama işi.', difficulty: 3 },
      { word: 'ATA', meaning: 'Baba, cet, ecdat.', difficulty: 2 },
      { word: 'SAHA', meaning: 'Alan, meydan veya çalışma yeri.', difficulty: 3 },
      { word: 'HASTA', meaning: 'Sağlığı bozuk olan, rahatsız.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'AS', meaning: 'Bir konuda üstün veya usta kişi.', reward: 11 },
      { word: 'SAT', meaning: 'Bir malı para karşılığı vermek.', reward: 5 }
    ],
    reward: { baseCoin: 70, hiddenWordBonus: 12 },
  },
  {
    levelId: 23,
    themeId: 'ottoman_library',
    sealId: 'seal_library_02',
    puzzleType: 'crossword',
    letters: ["K","İ","T","A","P"],
    mainWords: [
      { word: 'KİTAP', meaning: 'Yazılı veya basılı yapıt.', difficulty: 4 },
      { word: 'TAKİP', meaning: 'Ardından gitme veya izleme işi.', difficulty: 4 },
      { word: 'PATİ', meaning: 'Hayvan ayağı.', difficulty: 3 },
      { word: 'KATİ', meaning: 'Kesin, son ve değişmez nitelikte olan.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'AİT', meaning: 'İlgili, ilişkin, dair.', reward: 12 }
    ],
    reward: { baseCoin: 74, hiddenWordBonus: 13 },
  },
  {
    levelId: 24,
    themeId: 'ottoman_library',
    sealId: 'seal_library_03',
    puzzleType: 'anagram',
    letters: ["D","İ","V","A","N"],
    mainWords: [
      { word: 'DİVAN', meaning: 'Şiirlerin toplandığı eser veya kurul.', difficulty: 4 },
      { word: 'DAN', meaning: 'Sabahın erken aydınlığı.', difficulty: 3 },
      { word: 'VAN', meaning: 'Türkiye\'de bir il adı.', difficulty: 3 },
      { word: 'ADİ', meaning: 'Sıradan veya değersiz.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'AD', meaning: 'İsim, nam, şöhret.', reward: 12 }
    ],
    reward: { baseCoin: 76, hiddenWordBonus: 13 },
  },
  {
    levelId: 25,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_02',
    puzzleType: 'crossword',
    letters: ["K","U","B","B","E","L"],
    mainWords: [
      { word: 'KUBBE', meaning: 'Yarım küre biçiminde yapı örtüsü.', difficulty: 3 },
      { word: 'KUL', meaning: 'İnsan veya bağlı kimse anlamında kullanılan söz.', difficulty: 2 },
      { word: 'BEL', meaning: 'Gövdenin orta bölümü.', difficulty: 2 },
      { word: 'BUL', meaning: 'Aramakta olduğu şeyi elde etmek.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'BU', meaning: 'En yakındaki şeyi işaret eden söz.', reward: 10 }
    ],
    reward: { baseCoin: 71, hiddenWordBonus: 10 },
  },
  {
    levelId: 26,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_03',
    puzzleType: 'crossword',
    letters: ["A","V","L","U","S","U"],
    mainWords: [
      { word: 'AVLU', meaning: 'Yapıların ortasında veya yanında kalan açık alan.', difficulty: 3 },
      { word: 'ULUS', meaning: 'Aynı kültür ve tarih etrafında birleşen toplum.', difficulty: 3 },
      { word: 'USUL', meaning: 'Yöntem, yol veya davranış biçimi.', difficulty: 3 },
      { word: 'SUAL', meaning: 'Soru veya karşılık bekleyen söz.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'LAV', meaning: 'Yanardağdan çıkan erimiş madde.', reward: 11 }
    ],
    reward: { baseCoin: 77, hiddenWordBonus: 12 },
  },
  {
    levelId: 27,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_02',
    puzzleType: 'anagram',
    letters: ["Z","İ","R","V","E"],
    mainWords: [
      { word: 'ZİRVE', meaning: 'Dağın en yüksek noktası veya en üst başarı düzeyi.', difficulty: 4 },
      { word: 'VERİ', meaning: 'Bilgi veya ölçüm sonucu elde edilen değer.', difficulty: 3 },
      { word: 'VİZE', meaning: 'Bir ülkeye giriş izni veya ara sınav.', difficulty: 3 },
      { word: 'VEZİR', meaning: 'Tarihsel yönetimde yüksek görevli devlet adamı.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'VER', meaning: 'Bir şeyi başkasına geçirmek veya teslim etmek.', reward: 12 },
      { word: 'EZ', meaning: 'Bir işte çok usta, maharetli.', reward: 8 }
    ],
    reward: { baseCoin: 81, hiddenWordBonus: 13 },
  },
  {
    levelId: 28,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_03',
    puzzleType: 'crossword',
    letters: ["T","A","Ş","L","A","R"],
    mainWords: [
      { word: 'TAŞLAR', meaning: 'Birden çok taş.', difficulty: 4 },
      { word: 'TAŞRA', meaning: 'Merkez dışındaki yerler.', difficulty: 4 },
      { word: 'TARLA', meaning: 'Tarım yapılan geniş toprak parçası.', difficulty: 4 },
      { word: 'ŞART', meaning: 'Bir işin gerçekleşmesi için gereken koşul.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'AŞ', meaning: 'Yemek, yiyecek.', reward: 13 }
    ],
    reward: { baseCoin: 85, hiddenWordBonus: 14 },
  },
  {
    levelId: 29,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_03',
    puzzleType: 'wordsearch',
    letters: ["B","U","L","U","T"],
    mainWords: [
      { word: 'BULUT', meaning: 'Gökyüzünde su buharının oluşturduğu kütle.', difficulty: 4 },
      { word: 'BUL', meaning: 'Aramakta olduğu şeyi elde etmek eyleminin emir biçimi.', difficulty: 3 },
      { word: 'TULU', meaning: 'Tüyleri uzun veya kabarık olan.', difficulty: 3 },
      { word: 'ULU', meaning: 'Yüce, büyük ve saygın.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'BUT', meaning: 'Bacağın kalça ile diz arasındaki bölümü.', reward: 12 },
      { word: 'TU', meaning: 'Kükreyen ses veya uyarı.', reward: 5 }
    ],
    reward: { baseCoin: 85, hiddenWordBonus: 13 },
  },
  {
    levelId: 30,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_07',
    puzzleType: 'crossword',
    letters: ["M","A","S","A","L"],
    mainWords: [
      { word: 'MASAL', meaning: 'Olağanüstü olaylarla örülü anlatı.', difficulty: 3 },
      { word: 'SALMA', meaning: 'Bırakma veya serbest bırakma işi.', difficulty: 3 },
      { word: 'ASMA', meaning: 'Üzüm veren bitki veya bir şeyi yukarı tutturma.', difficulty: 3 },
      { word: 'ALMA', meaning: 'Almak işi.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'SAL', meaning: 'Su üzerinde kullanılan ilkel taşıt.', reward: 11 }
    ],
    reward: { baseCoin: 84, hiddenWordBonus: 12 },
  },
  {
    levelId: 31,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_05',
    story: 'Bir rehber, Kapadokya patikalarında yolculara vadiler arasında kaybolmadan ilerlemenin yolunu gösterir.',
    puzzleType: 'crossword',
    letters: ["P","A","T","İ","K","A"],
    mainWords: [
      { word: 'PATİKA', meaning: 'Dağlarda yürüyüş için kullanılan dar yol.', difficulty: 4 },
      { word: 'AKİT', meaning: 'Sözleşme, anlaşma, bağıt.', difficulty: 3 },
      { word: 'KAP', meaning: 'İçine bir şey konulan nesne.', difficulty: 3 },
      { word: 'KAT', meaning: 'Bir şeyin üzerine koyma işi.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'TAK', meaning: 'Bir şeyi bir yere iliştirmek.', reward: 12 }
    ],
    reward: { baseCoin: 87, hiddenWordBonus: 12 },
  },
  {
    levelId: 32,
    themeId: 'ege_coast',
    sealId: 'seal_ege_05',
    story: 'Bir denizci, rüzgarın yönünü okuyarak doğu limanları ile batı pazarlarını birbirine bağlar.',
    puzzleType: 'anagram',
    letters: ["R","Ü","Z","G","A","R"],
    mainWords: [
      { word: 'RÜZGAR', meaning: 'Havanın yer değiştirmesiyle oluşan esinti.', difficulty: 4 },
      { word: 'ZAR', meaning: 'Şans oyunlarında atılan küp biçimli araç; olumsuz durumda kayıp.', difficulty: 3 },
      { word: 'GAZ', meaning: 'Belirli hacmi olmayan akışkan madde.', difficulty: 3 },
      { word: 'GAR', meaning: 'Tren istasyonu.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'ARZ', meaning: 'Sunma veya istek anlamındaki söz.', reward: 15 },
      { word: 'AR', meaning: 'Utanma duygusu veya temizlik.', reward: 5 }
    ],
    reward: { baseCoin: 90, hiddenWordBonus: 13 },
  },
  {
    levelId: 33,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_04',
    story: 'Bir pazar bilgesi, değeri sadece parada değil emekte ve güvende arayan bir takas düzeni kurar.',
    puzzleType: 'crossword',
    letters: ["D","E","Ğ","E","R"],
    mainWords: [
      { word: 'DEĞER', meaning: 'Bir şeyin önemi veya karşılığı.', difficulty: 4 },
      { word: 'DERE', meaning: 'Küçük akarsu.', difficulty: 3 },
      { word: 'EĞER', meaning: 'Koşul bildiren söz.', difficulty: 4 },
      { word: 'EĞ', meaning: 'Eğri olan yan, bükük yer.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'ER', meaning: 'Asker veya yetişkin erkek.', reward: 13 }
    ],
    reward: { baseCoin: 93, hiddenWordBonus: 13 },
  },
  {
    levelId: 34,
    themeId: 'ottoman_library',
    sealId: 'seal_library_04',
    story: 'Bir kütüphane görevlisi, hafızayı güçlendirmek için bilgiyi raflara ve sembollere ayırır.',
    puzzleType: 'wordsearch',
    letters: ["K","İ","T","A","P","L"],
    mainWords: [
      { word: 'PATİK', meaning: 'Evde giyilen hafif, yumuşak ayakkabı.', difficulty: 4 },
      { word: 'KALİP', meaning: 'Bir şeye biçim vermekte kullanılan örnek veya kap.', difficulty: 4 },
      { word: 'KATİP', meaning: 'Yazı işleriyle uğraşan görevli.', difficulty: 5 },
      { word: 'PİL', meaning: 'Elektrik enerjisi sağlayan küçük araç.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'AT', meaning: 'Binek hayvanı.', reward: 14 },
      { word: 'ALP', meaning: 'Yiğit, kahraman, cesur kimse.', reward: 5 }
    ],
    reward: { baseCoin: 97, hiddenWordBonus: 15 },
  },
  {
    levelId: 35,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_04',
    story: 'Bir çini ustası, emeğin izini desene işleyerek sabrın görünür hale gelebileceğini gösterir.',
    puzzleType: 'anagram',
    letters: ["D","E","S","E","N"],
    mainWords: [
      { word: 'DESEN', meaning: 'Süsleme veya düzenli çizgi örüntüsü.', difficulty: 4 },
      { word: 'DENE', meaning: 'Bir şeyi sınamak veya yoklamak.', difficulty: 3 },
      { word: 'SENE', meaning: 'Yıl anlamında kullanılan söz.', difficulty: 3 },
      { word: 'ENSE', meaning: 'Boynun arka bölümü.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'SEN', meaning: 'Karşıdaki kişiyi gösteren söz.', reward: 12 }
    ],
    reward: { baseCoin: 94, hiddenWordBonus: 12 },
  },
  {
    levelId: 36,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_04',
    story: 'Bir gözlemci, ışığın taşlara düşüşünü takip ederek saati güneşle okumayı öğrenir.',
    puzzleType: 'crossword',
    letters: ["I","Ş","I","K","A","S"],
    mainWords: [
      { word: 'IŞIK', meaning: 'Görmeyi sağlayan aydınlık.', difficulty: 3 },
      { word: 'ASKI', meaning: 'Bir şeyi asmaya yarayan araç veya destek.', difficulty: 3 },
      { word: 'KISA', meaning: 'Boyu veya süresi az olan.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'ISI', meaning: 'Sıcaklık enerjisi.', reward: 12 }
    ],
    reward: { baseCoin: 96, hiddenWordBonus: 12 },
  },
  {
    levelId: 37,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_04',
    story: 'Bir yolcu, dağ yollarını işaretleyerek kendinden sonra gelenlerin korkusunu azaltır.',
    puzzleType: 'wordsearch',
    letters: ["O","L","A","Y","N","A","C"],
    mainWords: [
      { word: 'OLAY', meaning: 'Ortaya çıkan durum veya gerçekleşen iş.', difficulty: 3 },
      { word: 'YALAN', meaning: 'Doğru olmayan söz.', difficulty: 4 },
      { word: 'YOL', meaning: 'Ulaşım için kullanılan güzergah.', difficulty: 3 },
      { word: 'YON', meaning: 'Yön, taraf, istikamet.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'OYA', meaning: 'İnce işçilikle yapılan süsleme.', reward: 12 },
      { word: 'YONCA', meaning: 'Yonca bitkisi, dört yapraklı şans sembolü.', reward: 10 }
    ],
    reward: { baseCoin: 99, hiddenWordBonus: 13 },
  },
  {
    levelId: 38,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_08',
    story: 'Bir saatçi, zamanın ölçülmesinin insanlara sözlerinde durma gücü verdiğini fark eder.',
    puzzleType: 'anagram',
    letters: ["S","A","A","T","E","R"],
    mainWords: [
      { word: 'SAAT', meaning: 'Zamanı gösteren araç.', difficulty: 4 },
      { word: 'SERT', meaning: 'Kolay bükülmeyen veya katı olan.', difficulty: 4 },
      { word: 'RAST', meaning: 'Tesadüf, rastlantı, denk gelme.', difficulty: 4 },
      { word: 'ART', meaning: 'Arka veya sonra gelen bölüm.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'TERS', meaning: 'Düz olmayan veya karşıt yönde olan.', reward: 13 },
      { word: 'TER', meaning: 'Deri gözeneklerinden sıvı atılımı.', reward: 5 }
    ],
    reward: { baseCoin: 103, hiddenWordBonus: 14 },
  },
  {
    levelId: 39,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_06',
    story: 'Bir şifa arayıcısı, umudun insanları yeniden denemeye çağıran en güçlü duygu olduğunu anlatır.',
    puzzleType: 'crossword',
    letters: ["U","M","U","T","L","A"],
    mainWords: [
      { word: 'UMUT', meaning: 'İyi bir sonuca inanma duygusu.', difficulty: 4 },
      { word: 'MUTLU', meaning: 'Sevinçli ve huzurlu olan.', difficulty: 5 },
      { word: 'TAM', meaning: 'Eksiksiz ve bütün olan.', difficulty: 4 },
      { word: 'ALT', meaning: 'Bir şeyin alt kısmı, aşağısı.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'MAL', meaning: 'Alınıp satılabilen eşya veya ürün.', reward: 14 }
    ],
    reward: { baseCoin: 106, hiddenWordBonus: 15 },
  },
  {
    levelId: 40,
    themeId: 'ege_coast',
    sealId: 'seal_ege_06',
    story: 'Bir boya ustası, maviyi denizden ve gökten alarak uzak yolculukların hayalini canlandırır.',
    puzzleType: 'crossword',
    letters: ["M","A","V","İ","L","E"],
    mainWords: [
      { word: 'MAVİ', meaning: 'Gökyüzü ve denizle anılan renk.', difficulty: 3 },
      { word: 'AİLE', meaning: 'Birbirine akrabalıkla bağlı kişiler topluluğu.', difficulty: 3 },
      { word: 'İVME', meaning: 'Hızlanma, bir hareketin hızının artması.', difficulty: 3 },
      { word: 'VALE', meaning: 'Araç park etmeye yardımcı görevli.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'İM', meaning: 'İşaret veya belirti.', reward: 11 }
    ],
    reward: { baseCoin: 102, hiddenWordBonus: 12 },
  },
  {
    levelId: 41,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_05',
    story: 'Bir aktar, kokuların hafızayı uyandırdığını görüp insanlara bitkileri kokusuyla tanıtır.',
    puzzleType: 'wordsearch',
    letters: ["K","O","K","U","L","A"],
    mainWords: [
      { word: 'KOKU', meaning: 'Burunla algılanan duyum.', difficulty: 3 },
      { word: 'KOKLA', meaning: 'Kokusunu almak için burna yaklaştırmak.', difficulty: 5 },
      { word: 'OKUL', meaning: 'Eğitim ve öğretim yeri.', difficulty: 4 },
      { word: 'OL', meaning: 'Var olmak, bulunmak eyleminin emir biçimi.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'KOL', meaning: 'Omuzdan ele kadar uzanan bölüm.', reward: 13 }
    ],
    reward: { baseCoin: 109, hiddenWordBonus: 14 },
  },
  {
    levelId: 42,
    themeId: 'ottoman_library',
    sealId: 'seal_library_05',
    story: 'Bir şifreci, sır saklamanın bazen topluluğu koruduğunu bazen de merakı büyüttüğünü keşfeder.',
    puzzleType: 'anagram',
    letters: ["S","I","R","A"],
    mainWords: [
      { word: 'SIRA', meaning: 'Diziliş veya bekleme düzeni.', difficulty: 4 },
      { word: 'SAR', meaning: 'Sarmak eylemi veya bir şeyi çevreleme.', difficulty: 4 },
      { word: 'SIR', meaning: 'Gizli tutulan bilgi.', difficulty: 4 },
      { word: 'ASIR', meaning: 'Yüzyıl anlamına gelen zaman dilimi.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'ASI', meaning: 'Başkaldıran, isyankar, itaat etmez.', reward: 13 },
      { word: 'SARI', meaning: 'Bir renk veya solgun yüz.', reward: 8 }
    ],
    reward: { baseCoin: 111, hiddenWordBonus: 14 },
  },
  {
    levelId: 43,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_05',
    story: 'Bir kadının adalet kararı, güçlünün değil haklının korunması gerektiğini tüm şehre duyurur.',
    puzzleType: 'crossword',
    letters: ["A","D","A","L","E","T"],
    mainWords: [
      { word: 'ADALET', meaning: 'Hakkı gözetme ve doğruluk ilkesi.', difficulty: 5 },
      { word: 'ALET', meaning: 'Bir işte kullanılan araç.', difficulty: 4 },
      { word: 'TELA', meaning: 'Kumaşı sertleştirmek için kullanılan malzeme.', difficulty: 4 },
      { word: 'DAL', meaning: 'Ağacın kolu veya alan bölümü.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'AL', meaning: 'Kırmızı renk veya almak emir biçimi.', reward: 14 }
    ],
    reward: { baseCoin: 114, hiddenWordBonus: 15 },
  },
  {
    levelId: 44,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_05',
    story: 'Bir gökbilimci, zamanı ölçmek için gölgeleri izler ve takvim fikrine bir adım daha yaklaşır.',
    puzzleType: 'wordsearch',
    letters: ["Z","A","M","A","N"],
    mainWords: [
      { word: 'ZAMAN', meaning: 'Olayların geçtiği süre.', difficulty: 5 },
      { word: 'AMAN', meaning: 'Yardım veya dikkat çağrısı.', difficulty: 4 },
      { word: 'NAZ', meaning: 'Cilve, işve, kırıtma.', difficulty: 4 },
      { word: 'ZAM', meaning: 'Fiyata yapılan artış.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'ANA', meaning: 'Anne veya temel kaynak.', reward: 14 },
      { word: 'MAZA', meaning: 'Bir zevk veya eğlence işi.', reward: 8 }
    ],
    reward: { baseCoin: 115, hiddenWordBonus: 15 },
  },
  {
    levelId: 45,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_05',
    story: 'Bir öğretmen, sevincin öğrenmeyi hızlandırdığını fark edip dersi oyuna çevirir.',
    puzzleType: 'anagram',
    letters: ["S","E","V","İ","N","Ç"],
    mainWords: [
      { word: 'SEVİNÇ', meaning: 'Mutluluk veren duygu.', difficulty: 4 },
      { word: 'SEVİN', meaning: 'Mutlu olmak eyleminin emir biçimi.', difficulty: 5 },
      { word: 'EVİN', meaning: 'Ev sözcüğünün tamlayan eki almış biçimi.', difficulty: 4 },
      { word: 'ÇİN', meaning: 'Doğu Asya’da yer alan ülke adı.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'EN', meaning: 'Genişlik, boyut veya bir sıfatın en üstünlük derecesi.', reward: 14 },
      { word: 'SEVİ', meaning: 'Sevgi veya sevme eylemi.', reward: 10 }
    ],
    reward: { baseCoin: 117, hiddenWordBonus: 15 },
  }
];

export const initialLevel = levels[0];
