import type { LevelData } from '../types';
import { levels46to50 } from './levels46to50';
import { levels51to55 } from './levels51to55';
import { levels56to60 } from './levels56to60';
import { levels61to65 } from './levels61to65';
import { levels66to70 } from './levels66to70';
import { levels71to75 } from './levels71to75';

const baseLevels: LevelData[] = [
  {
    levelId: 1,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_01',
    puzzleType: 'crossword',
    letters: ["A","R","I"],
    mainWords: [
      { word: 'ARI', meaning: 'Bal yapan, kanatlı küçük böcek.', difficulty: 1 },
      { word: 'AR', meaning: 'Utanma duygusu.', difficulty: 1 }
    ],
    hiddenWords: [
    ],
    reward: { baseCoin: 24, hiddenWordBonus: 0 },
  },
  {
    levelId: 2,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_02',
    puzzleType: 'crossword',
    letters: ["E","L","M","A","A"],
    mainWords: [
      { word: 'ELMA', meaning: 'Tatlı ve sulu bir meyve.', difficulty: 1 },
      { word: 'LAMA', meaning: 'Güney Amerika kökenli yük hayvanı.', difficulty: 2 },
      { word: 'MALA', meaning: 'İnşaat veya sıva işlerinde kullanılan el aleti.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'ALA', meaning: 'Karışık renkli veya çok iyi nitelikte olan.', reward: 8 }
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
      { word: 'KAL', meaning: 'Bulunduğu yerde durmak.', difficulty: 1 },
      { word: 'EL', meaning: 'Kolun bilekten parmak uçlarına kadar olan bölümü.', difficulty: 1 }
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
      { word: 'SÖZ', meaning: 'Anlam taşıyan ses veya kelime dizisi.', difficulty: 1 },
      { word: 'ÖZ', meaning: 'Bir şeyin temel niteliği.', difficulty: 2 },
      { word: 'SÜZ', meaning: 'Bir sıvıyı süzgeçten geçirmek.', difficulty: 2 }
    ],
    hiddenWords: [
    ],
    reward: { baseCoin: 32, hiddenWordBonus: 0 },
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
    reward: { baseCoin: 34, hiddenWordBonus: 7 },
  },
  {
    levelId: 6,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_02',
    puzzleType: 'crossword',
    letters: ["D","İ","L","E","K"],
    mainWords: [
      { word: 'DİLEK', meaning: 'Gerçekleşmesi istenen şey.', difficulty: 2 },
      { word: 'DİL', meaning: 'İnsanların anlaşmasını sağlayan sözlü sistem.', difficulty: 1 },
      { word: 'KEDİ', meaning: 'Evcil, çevik ve küçük bir memeli hayvan.', difficulty: 1 }
    ],
    hiddenWords: [
      { word: 'İLK', meaning: 'Sırada en önde gelen veya başlangıçta olan.', reward: 9 }
    ],
    reward: { baseCoin: 36, hiddenWordBonus: 9 },
  },
  {
    levelId: 7,
    themeId: 'ege_coast',
    sealId: 'seal_ege_01',
    puzzleType: 'crossword',
    letters: ["A","N","L","A","M"],
    mainWords: [
      { word: 'ANLAM', meaning: 'Bir sözün veya işaretin anlattığı şey.', difficulty: 2 },
      { word: 'ALAN', meaning: 'Açık yer veya belirli bir çalışma bölgesi.', difficulty: 2 },
      { word: 'MANA', meaning: 'Anlam, içerik veya ifade ettiği değer.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'NAM', meaning: 'Ün, şöhret veya ad.', reward: 9 }
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
      { word: 'SAHİL', meaning: 'Deniz, göl veya akarsu kıyısı.', difficulty: 2 },
      { word: 'ASİL', meaning: 'Soylu, değerli ve ağırbaşlı.', difficulty: 3 },
      { word: 'HAL', meaning: 'Durum, vaziyet veya görünüş.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AS', meaning: 'Bir konuda üstün veya usta kişi.', reward: 10 }
    ],
    reward: { baseCoin: 41, hiddenWordBonus: 10 },
  },
  {
    levelId: 9,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_01',
    puzzleType: 'anagram',
    // İkinci 'U', gizli kelime UMUR için gerekli (UMUR iki U içerir). Türkçe
    // harfler ayrı eşleştiği için Ü artık U yerine geçmiyor.
    letters: ["M","Ü","H","Ü","R","U","U"],
    mainWords: [
      { word: 'MÜHÜR', meaning: 'Bir belgeye iz bırakmak için kullanılan damga.', difficulty: 3 },
      { word: 'HÜR', meaning: 'Özgür, bağımsız.', difficulty: 3 },
      { word: 'RUH', meaning: 'Canlılık verdiğine inanılan manevi varlık.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'UMUR', meaning: 'Önem verme ve ilgilenme durumu.', reward: 13 }
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
      { word: 'KELAM', meaning: 'Söz, konuşma veya ifade.', difficulty: 4 },
      { word: 'MEAL', meaning: 'Bir sözün veya yazının kısaltılmış anlamı.', difficulty: 3 },
      { word: 'ALEM', meaning: 'Dünya, evren veya belirli bir topluluk.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'ELA', meaning: 'Yeşile çalan açık kahverengi göz rengi.', reward: 12 }
    ],
    reward: { baseCoin: 46, hiddenWordBonus: 8 },
  },
  {
    levelId: 11,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_01',
    puzzleType: 'crossword',
    letters: ["K","Ü","L","T","Ü","R"],
    mainWords: [
      { word: 'KÜLTÜR', meaning: 'Bir toplumun maddi ve manevi değerleri bütünü.', difficulty: 2 },
      { word: 'TÜRK', meaning: 'Türk milletinden olan kimse.', difficulty: 2 },
      { word: 'TÜR', meaning: 'Ortak özellikleri olan varlıkların bölümü.', difficulty: 2 },
      { word: 'KÜR', meaning: 'Tedavi veya bakım amacıyla uygulanan yöntem.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'ÜLKÜ', meaning: 'Ulaşılmak istenen yüce amaç.', reward: 13 }
    ],
    reward: { baseCoin: 47, hiddenWordBonus: 10 },
  },
  {
    levelId: 12,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_01',
    puzzleType: 'crossword',
    letters: ["T","A","R","İ","H","A"],
    mainWords: [
      { word: 'TARİH', meaning: 'Geçmişte yaşanan olayları inceleyen bilgi alanı.', difficulty: 2 },
      { word: 'HARİTA', meaning: 'Bir yerin kuş bakışı çizimle gösterilmiş biçimi.', difficulty: 2 },
      { word: 'HATA', meaning: 'Yanlışlık veya kusurlu davranış.', difficulty: 2 },
      { word: 'HAT', meaning: 'Çizgi, yol veya yazı biçimi.', difficulty: 3 }
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
    puzzleType: 'crossword',
    letters: ["Y","A","Y","L","A"],
    mainWords: [
      { word: 'YAYLA', meaning: 'Yazın çıkılan yüksek ve serin yer.', difficulty: 2 },
      { word: 'YAYA', meaning: 'Yürüyerek giden kimse.', difficulty: 2 },
      { word: 'AYLA', meaning: 'Ayın çevresinde görülen ışıklı halka.', difficulty: 3 },
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
      { word: 'ENDER', meaning: 'Çok az bulunan, nadir, seyrek.', difficulty: 3 },
      { word: 'DERE', meaning: 'Küçük akarsu.', difficulty: 2 },
      { word: 'EREN', meaning: 'Olgunluğa ve erdeme ulaşmış kimse.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'RENDE', meaning: 'Tahta yüzeyini düzlemek veya sebzeleri rendelemek için kullanılan araç.', reward: 10 }
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
      { word: 'SARAY', meaning: 'Hükümdarların yaşadığı büyük yapı.', difficulty: 2 },
      { word: 'YARA', meaning: 'Deride veya dokuda oluşan zedelenme.', difficulty: 2 },
      { word: 'ARSA', meaning: 'Üzerine yapı yapılabilecek toprak parçası.', difficulty: 3 },
      { word: 'AYAR', meaning: 'Bir şeyin ölçüsü veya düzeni.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'YASA', meaning: 'Kanun, kural veya yasak.', reward: 8 },
      { word: 'YAR', meaning: 'Derin ve dik yamaç; uçurum.', reward: 9 },
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
      { word: 'KAPI', meaning: 'Bir yere girip çıkmaya yarayan açıklık.', difficulty: 1 },
      { word: 'KALP', meaning: 'Kan dolaşımını sağlayan organ.', difficulty: 2 },
      { word: 'PLAK', meaning: 'Ses kaydetmeye yarayan eski disk.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'ALP', meaning: 'Yiğit, kahraman, cesur kimse.', reward: 9 },
      { word: 'PAK', meaning: 'Temiz, arı ve lekesiz.', reward: 10 },
    ],
    reward: { baseCoin: 55, hiddenWordBonus: 9 },
  },
  {
    levelId: 17,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_03',
    puzzleType: 'crossword',
    letters: ["B","A","L","O","N"],
    mainWords: [
      { word: 'BALON', meaning: 'Hava veya gazla şişirilen esnek nesne.', difficulty: 2 },
      { word: 'BALO', meaning: 'Danslı ve eğlenceli toplantı.', difficulty: 3 },
      { word: 'BOL', meaning: 'Miktarı çok olan.', difficulty: 2 },
      { word: 'OLAN', meaning: 'Var olan veya gerçekleşen şey.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'OBA', meaning: 'Göçebe çadır topluluğu veya geçici yerleşim birimi.', reward: 10 }
    ],
    reward: { baseCoin: 57, hiddenWordBonus: 10 },
  },
  {
    levelId: 18,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_04',
    puzzleType: 'crossword',
    letters: ["V","A","D","İ","L"],
    mainWords: [
      { word: 'VADİ', meaning: 'İki dağ arasında uzanan çukur arazi.', difficulty: 3 },
      { word: 'VALİ', meaning: 'Bir ili yöneten en üst kamu görevlisi.', difficulty: 3 },
      { word: 'ADİL', meaning: 'Hakkı gözeten, adaletli.', difficulty: 3 },
      { word: 'VİDA', meaning: 'Bir nesneyi sabitlemek için kullanılan dişli bağlantı elemanı.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'DAL', meaning: 'Ağacın veya bitkinin gövdesinden çıkan kol.', reward: 11 },
      { word: 'İL', meaning: 'Ülke yönetimindeki temel bölgesel birim.', reward: 5 }
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
      { word: 'ZEYTİN', meaning: 'Yağı çıkarılan, Akdeniz ikliminde yetişen meyve.', difficulty: 2 },
      { word: 'YETİ', meaning: 'Bir işi yapabilme gücü veya kabiliyet.', difficulty: 3 },
      { word: 'TİZ', meaning: 'İnce ve keskin ses.', difficulty: 4 },
      { word: 'YENİ', meaning: 'Kullanılmamış veya yakın zamanda ortaya çıkmış.', difficulty: 1 }
    ],
    hiddenWords: [
      { word: 'TEN', meaning: 'İnsan vücudu, beden.', reward: 11 },
      { word: 'NİYET', meaning: 'Bir şeyi yapmaya önceden karar verme.', reward: 11 },
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
      { word: 'DENİZ', meaning: 'Yeryüzünün büyük tuzlu su kütlesi.', difficulty: 2 },
      { word: 'ZİNDE', meaning: 'Güçlü, canlı ve dinç durumda olan.', difficulty: 3 },
      { word: 'DİZ', meaning: 'Bacağın ortasındaki eklem bölgesi.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'İZ', meaning: 'Bir şeyin bıraktığı belirti.', reward: 10 },
      { word: 'DİZE', meaning: 'Şiirde bir satır, mısra.', reward: 8 }
    ],
    reward: { baseCoin: 66, hiddenWordBonus: 10 },
  },
  {
    levelId: 21,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_02',
    puzzleType: 'crossword',
    letters: ["T","O","P","R","A","K"],
    mainWords: [
      { word: 'TOPRAK', meaning: 'Bitkilerin yetiştiği, yeryüzünü örten doğal katman.', difficulty: 2 },
      { word: 'PARK', meaning: 'Dinlenmek veya gezmek için düzenlenmiş yeşil alan.', difficulty: 2 },
      { word: 'KART', meaning: 'Sert kâğıt parçası veya elektronik ödeme aracı.', difficulty: 2 },
      { word: 'ROTA', meaning: 'İzlenecek yol veya yön.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'KOR', meaning: 'İyice yanmış ateş parçası.', reward: 11 },
      { word: 'TOP', meaning: 'Oyunlarda kullanılan yuvarlak nesne.', reward: 12 },
    ],
    reward: { baseCoin: 68, hiddenWordBonus: 11 },
  },
  {
    levelId: 22,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_03',
    puzzleType: 'crossword',
    letters: ["H","A","R","M","A","N"],
    mainWords: [
      { word: 'HARMAN', meaning: 'Tahılın dövülüp savrulduğu alan; hasat mevsimini simgeleyen işleme yeri.', difficulty: 3 },
      { word: 'NAR', meaning: 'İçi kırmızı taneli, ekşi-tatlı meyvesi olan ağaç ve bu ağacın meyvesi.', difficulty: 2 },
      { word: 'AMAN', meaning: 'Acıma veya şaşkınlık bildiren söz; merhamet çağrısı.', difficulty: 2 },
      { word: 'ARMAN', meaning: 'Gerçekleşmemiş dilek veya ulaşılamamış özlem.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'HAM', meaning: 'Olgunlaşmamış veya işlenmemiş.', reward: 11 }
    ],
    reward: { baseCoin: 70, hiddenWordBonus: 11 },
  },
  {
    levelId: 23,
    themeId: 'ottoman_library',
    sealId: 'seal_library_02',
    puzzleType: 'crossword',
    letters: ["K","İ","T","A","P"],
    mainWords: [
      { word: 'KİTAP', meaning: 'Yazılı veya basılı yapıt.', difficulty: 2 },
      { word: 'TAKİP', meaning: 'Ardından gitme veya izleme işi.', difficulty: 3 },
      { word: 'PATİK', meaning: 'Bebekler için örülen sıcak tutan ayakkabı.', difficulty: 3 },
      { word: 'PATİ', meaning: 'Hayvan ayağı.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AİT', meaning: 'İlgili, ilişkin, dair.', reward: 12 },
      { word: 'TİP', meaning: 'Ortak özellikleri olan örnek veya çeşit.', reward: 12 },
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
      { word: 'DİVAN', meaning: 'Şiirlerin toplandığı eser veya kurul.', difficulty: 3 },
      { word: 'NİDA', meaning: 'Seslenme veya yüksek sesle çağırma.', difficulty: 4 },
      { word: 'ANİ', meaning: 'Birdenbire olan, ansızın gelişen.', difficulty: 2 }
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
    reward: { baseCoin: 78, hiddenWordBonus: 10 },
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
      { word: 'SULU', meaning: 'İçinde bol miktarda su barındıran.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'LAV', meaning: 'Yanardağdan çıkan erimiş madde.', reward: 11 },
      { word: 'USLU', meaning: 'Sakin ve söz dinler davranan.', reward: 12 },
    ],
    reward: { baseCoin: 80, hiddenWordBonus: 12 },
  },
  {
    levelId: 27,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_02',
    puzzleType: 'anagram',
    letters: ["Z","İ","R","V","E"],
    mainWords: [
      { word: 'ZİRVE', meaning: 'Dağın en yüksek noktası veya en üst başarı düzeyi.', difficulty: 3 },
      { word: 'VERİ', meaning: 'Bilgi veya ölçüm sonucu elde edilen değer.', difficulty: 2 },
      { word: 'VİZE', meaning: 'Bir ülkeye giriş izni veya ara sınav.', difficulty: 2 },
      { word: 'VEZİR', meaning: 'Tarihsel yönetimde yüksek görevli devlet adamı.', difficulty: 4 }
    ],
    hiddenWords: [
      { word: 'VER', meaning: 'Bir şeyi başkasına geçirmek veya teslim etmek.', reward: 12 },
      { word: 'EV', meaning: 'İnsanların yaşadığı yapı veya konut.', reward: 8 }
    ],
    reward: { baseCoin: 82, hiddenWordBonus: 13 },
  },
  {
    levelId: 28,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_03',
    puzzleType: 'crossword',
    letters: ["T","A","Ş","L","A","R"],
    mainWords: [
      { word: 'TAŞ', meaning: 'Sert ve katı mineral parçası.', difficulty: 2 },
      { word: 'TAŞRA', meaning: 'Merkez dışındaki yerler.', difficulty: 4 },
      { word: 'TARLA', meaning: 'Tarım yapılan geniş toprak parçası.', difficulty: 3 },
      { word: 'ŞART', meaning: 'Bir işin gerçekleşmesi için gereken koşul.', difficulty: 3 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 85, hiddenWordBonus: 0 },
  },
  {
    levelId: 29,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_03',
    puzzleType: 'crossword',
    letters: ["B","U","L","U","T","A"],
    mainWords: [
      { word: 'BULUT', meaning: 'Gökyüzünde su buharının oluşturduğu kütle.', difficulty: 2 },
      { word: 'TABU', meaning: 'Toplumsal ya da kültürel açıdan dokunulmaz ve yasak sayılan.', difficulty: 3 },
      { word: 'ULU', meaning: 'Yüce, büyük ve saygın.', difficulty: 3 },
    ],
    hiddenWords: [
      { word: 'UT', meaning: 'Mızrapla çalınan, armut biçimli gövdeli telli çalgı; ud olarak da bilinir.', reward: 12 },
      { word: 'BAL', meaning: 'Arıların çiçeklerden ürettiği tatlı ve besleyici madde.', reward: 12 }
    ],
    reward: { baseCoin: 86, hiddenWordBonus: 15 },
  },
  {
    levelId: 30,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_07',
    puzzleType: 'crossword',
    letters: ["M","A","S","A","L"],
    mainWords: [
      { word: 'MASAL', meaning: 'Olağanüstü olaylarla örülü anlatı.', difficulty: 2 },
      { word: 'SALMA', meaning: 'Bırakma veya serbest bırakma işi.', difficulty: 3 },
      { word: 'ASMA', meaning: 'Üzüm veren bitki veya bir şeyi yukarı tutturma.', difficulty: 3 },
      { word: 'ALMA', meaning: 'Almak işi.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'SAL', meaning: 'Su üzerinde kullanılan ilkel taşıt.', reward: 11 },
      { word: 'ASAL', meaning: 'Yalnızca kendine ve bire bölünebilen; temel.', reward: 13 },
    ],
    reward: { baseCoin: 88, hiddenWordBonus: 12 },
  },
  {
    levelId: 31,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_05',
    story: 'Bir rehber, Kapadokya patikalarında yolculara vadiler arasında kaybolmadan ilerlemenin yolunu gösterir.',
    puzzleType: 'crossword',
    letters: ["P","A","T","İ","K","A"],
    mainWords: [
      { word: 'PATİKA', meaning: 'Dağlarda yürüyüş için kullanılan dar yol.', difficulty: 3 },
      { word: 'AKİT', meaning: 'Sözleşme, anlaşma, bağıt.', difficulty: 4 },
      { word: 'ATİK', meaning: 'Hızlı hareket eden, çevik.', difficulty: 4 },
      { word: 'KAT', meaning: 'Bir şeyin üzerine koyma işi.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'TAK', meaning: 'Bir şeyi bir yere iliştirmek.', reward: 12 }
    ],
    reward: { baseCoin: 89, hiddenWordBonus: 12 },
  },
  {
    levelId: 32,
    themeId: 'ege_coast',
    sealId: 'seal_ege_05',
    story: 'Bir denizci, rüzgarın yönünü okuyarak doğu limanları ile batı pazarlarını birbirine bağlar.',
    puzzleType: 'anagram',
    letters: ["R","Ü","Z","G","A","R"],
    mainWords: [
      { word: 'RÜZGAR', meaning: 'Havanın yer değiştirmesiyle oluşan esinti.', difficulty: 3 },
      { word: 'ZAR', meaning: 'Şans oyunlarında atılan küp biçimli araç; olumsuz durumda kayıp.', difficulty: 3 },
      { word: 'ARZ', meaning: 'Sunma veya istek anlamındaki söz.', difficulty: 4 },
      { word: 'GAR', meaning: 'Tren istasyonu.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'GAZ', meaning: 'Belirli hacmi olmayan akışkan madde.', reward: 15 },
      { word: 'AR', meaning: 'Utanma duygusu veya temizlik.', reward: 5 }
    ],
    reward: { baseCoin: 91, hiddenWordBonus: 13 },
  },
  {
    levelId: 33,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_04',
    story: 'Bir pazar bilgesi, değeri sadece parada değil emekte ve güvende arayan bir takas düzeni kurar.',
    puzzleType: 'crossword',
    letters: ["D","E","Ğ","E","R"],
    mainWords: [
      { word: 'DEĞER', meaning: 'Bir şeyin önemi veya karşılığı.', difficulty: 2 },
      { word: 'EDER', meaning: 'Bir şeyin karşılığı olan değer, fiyat.', difficulty: 3 },
      { word: 'EĞER', meaning: 'Koşul bildiren söz.', difficulty: 2 },
      { word: 'DER', meaning: 'Bir şeyi söylemek veya adlandırmak.', difficulty: 3 }
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
    puzzleType: 'crossword',
    letters: ["K","İ","T","A","P","L"],
    mainWords: [
      { word: 'TALİK', meaning: 'Osmanlı hat sanatında kullanılan eğik ve bağlantılı yazı üslubu; kütüphane yazıcıları bu stili metinleri hızlı kopyalamak için kullanırdı.', difficulty: 4 },
      { word: 'TALİP', meaning: 'İsteyen, talep eden, istekli kimse.', difficulty: 4 },
      { word: 'KATİP', meaning: 'Yazı işleriyle uğraşan görevli.', difficulty: 4 },
      { word: 'PİL', meaning: 'Elektrik enerjisi sağlayan küçük araç.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AT', meaning: 'Binek hayvanı.', reward: 14 },
      { word: 'KİL', meaning: 'Su ile yoğrulabilen ince taneli toprak; ilk yazı tabletleri kilden yapılırdı.', reward: 8 },
      { word: 'KİP', meaning: 'Dilbilgisinde eylemin zaman ve kişiye göre aldığı biçim; Osmanlı yazıcıları kiplik örneklerini el yazmalarına not ederdi.', reward: 10 }
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
      { word: 'DESEN', meaning: 'Süsleme veya düzenli çizgi örüntüsü.', difficulty: 3 },
      { word: 'DENE', meaning: 'Bir şeyi sınamak veya yoklamak.', difficulty: 2 },
      { word: 'SENE', meaning: 'Yıl anlamında kullanılan söz.', difficulty: 2 },
      { word: 'ENSE', meaning: 'Boynun arka bölümü.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'SEN', meaning: 'Karşıdaki kişiyi gösteren söz.', reward: 12 }
    ],
    reward: { baseCoin: 98, hiddenWordBonus: 12 },
  },
  {
    levelId: 36,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_04',
    story: 'Bir gözlemci, ışığın taşlara düşüşünü takip ederek saati güneşle okumayı öğrenir.',
    puzzleType: 'crossword',
    letters: ["I","Ş","I","K","A","S"],
    mainWords: [
      { word: 'IŞIK', meaning: 'Görmeyi sağlayan aydınlık.', difficulty: 2 },
      { word: 'ASKI', meaning: 'Bir şeyi asmaya yarayan araç veya destek.', difficulty: 2 },
      { word: 'KISA', meaning: 'Boyu veya süresi az olan.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'ISI', meaning: 'Sıcaklık enerjisi.', reward: 12 }
    ],
    reward: { baseCoin: 100, hiddenWordBonus: 12 },
  },
  {
    levelId: 37,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_04',
    story: 'Bir yolcu, dağ yollarını işaretleyerek kendinden sonra gelenlerin korkusunu azaltır.',
    puzzleType: 'crossword',
    letters: ["O","L","A","Y","N","C"],
    mainWords: [
      { word: 'OLAY', meaning: 'Ortaya çıkan durum veya gerçekleşen iş.', difficulty: 2 },
      { word: 'ONAY', meaning: 'Bir olguyu doğrulama, tasdik etme.', difficulty: 2 },
      { word: 'YOL', meaning: 'Ulaşım için kullanılan güzergah.', difficulty: 1 },
      { word: 'YONCA', meaning: 'Yonca bitkisi, dört yapraklı şans sembolü.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'OYA', meaning: 'İnce işçilikle yapılan süsleme.', reward: 12 },
      { word: 'LONCA', meaning: 'Aynı mesleği yapan esnafın oluşturduğu dayanışma ve düzenleme birliği.', reward: 10 },
      { word: 'OYNA', meaning: 'Eğlenmek veya vakit geçirmek amacıyla bir şeyle uğraşmak.', reward: 10 },
      { word: 'CAN', meaning: 'Yaşamı sağlayan güç, hayat.', reward: 10 }
    ],
    reward: { baseCoin: 101, hiddenWordBonus: 13 },
  },
  {
    levelId: 38,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_08',
    story: 'Bir saatçi, zamanın ölçülmesinin insanlara sözlerinde durma gücü verdiğini fark eder.',
    puzzleType: 'anagram',
    letters: ["S","A","A","T","E","R"],
    mainWords: [
      { word: 'SAAT', meaning: 'Zamanı gösteren araç.', difficulty: 2 },
      { word: 'SERT', meaning: 'Kolay bükülmeyen veya katı olan.', difficulty: 3 },
      { word: 'RAST', meaning: 'Tesadüf, rastlantı, denk gelme.', difficulty: 4 },
      { word: 'ART', meaning: 'Arka veya sonra gelen bölüm.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'TERS', meaning: 'Düz olmayan veya karşıt yönde olan.', reward: 13 },
      { word: 'TERAS', meaning: 'Binanın önünde veya üstünde yer alan açık oturma alanı.', reward: 5 }
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
      { word: 'UMUT', meaning: 'İyi bir sonuca inanma duygusu.', difficulty: 2 },
      { word: 'MUTLU', meaning: 'Sevinçli ve huzurlu olan.', difficulty: 2 },
      { word: 'TAM', meaning: 'Eksiksiz ve bütün olan.', difficulty: 2 },
      { word: 'ALT', meaning: 'Bir şeyin alt kısmı, aşağısı.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AL', meaning: 'Almak eyleminin emir biçimi veya kırmızı renk.', reward: 10 },
      { word: 'MAT', meaning: 'Satrançta yenilgi; parlak olmayan donuk yüzey.', reward: 12 },
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
      { word: 'MAVİ', meaning: 'Gökyüzü ve denizle anılan renk.', difficulty: 2 },
      { word: 'AİLE', meaning: 'Birbirine akrabalıkla bağlı kişiler topluluğu.', difficulty: 2 },
      { word: 'İVME', meaning: 'Hızlanma, bir hareketin hızının artması.', difficulty: 4 },
      { word: 'VALE', meaning: 'Araç park etmeye yardımcı görevli.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'İM', meaning: 'İşaret veya belirti.', reward: 11 },
      { word: 'VELİ', meaning: 'Bir çocuğun bakımından sorumlu kişi.', reward: 13 },
    ],
    reward: { baseCoin: 108, hiddenWordBonus: 12 },
  },
  {
    levelId: 41,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_05',
    story: 'Bir aktar, kokuların hafızayı uyandırdığını görüp insanlara bitkileri kokusuyla tanıtır.',
    puzzleType: 'crossword',
    letters: ["K","O","K","U","L","A"],
    mainWords: [
      { word: 'KOKU', meaning: 'Burunla algılanan duyum.', difficulty: 2 },
      { word: 'KOKLA', meaning: 'Kokusunu almak için burna yaklaştırmak.', difficulty: 3 },
      { word: 'OKUL', meaning: 'Eğitim ve öğretim yeri.', difficulty: 2 },
      { word: 'KOL', meaning: 'Omuzdan ele kadar uzanan bölüm.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'KOK', meaning: 'Bir kokuyu burnunla algıla.', reward: 13 },
      { word: 'KOLA', meaning: 'Gazlı bir içecek; kumaş sertleştirici.', reward: 13 },
    ],
    reward: { baseCoin: 110, hiddenWordBonus: 14 },
  },
  {
    levelId: 42,
    themeId: 'ottoman_library',
    sealId: 'seal_library_05',
    story: 'Bir şifreci, sır saklamanın bazen topluluğu koruduğunu bazen de merakı büyüttüğünü keşfeder.',
    puzzleType: 'anagram',
    letters: ["S","I","R","A"],
    mainWords: [
      { word: 'SIRA', meaning: 'Diziliş veya bekleme düzeni.', difficulty: 2 },
      { word: 'SAR', meaning: 'Bir şeyi bir başkasının çevresine dolamak veya sarmak; sırrı örtmek için kullanılan eylem.', difficulty: 2 },
      { word: 'SIR', meaning: 'Gizli tutulan bilgi.', difficulty: 3 },
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
      { word: 'ADALET', meaning: 'Hakkı gözetme ve doğruluk ilkesi.', difficulty: 2 },
      { word: 'ALET', meaning: 'Bir işte kullanılan araç.', difficulty: 3 },
      { word: 'TELA', meaning: 'Kumaşı sertleştirmek için kullanılan malzeme.', difficulty: 4 },
      { word: 'DAL', meaning: 'Ağacın kolu veya alan bölümü.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'ADET', meaning: 'Görenek; bir şeyin sayıca tutarı.', reward: 13 },
      { word: 'DELTA', meaning: 'Akarsuyun denize döküldüğü yerde oluşan üçgen ova.', reward: 14 },
    ],
    reward: { baseCoin: 114, hiddenWordBonus: 15 },
  },
  {
    levelId: 44,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_05',
    story: 'Bir gökbilimci, zamanı ölçmek için gölgeleri izler ve takvim fikrine bir adım daha yaklaşır.',
    puzzleType: 'crossword',
    letters: ["Z","A","M","A","N"],
    mainWords: [
      { word: 'ZAMAN', meaning: 'Olayların geçtiği süre.', difficulty: 2 },
      { word: 'AMAN', meaning: 'Yardım veya dikkat çağrısı.', difficulty: 3 },
      { word: 'NAZ', meaning: 'Cilve, işve, kırıtma.', difficulty: 3 },
      { word: 'ZAM', meaning: 'Fiyata yapılan artış.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'ANA', meaning: 'Anne veya temel kaynak.', reward: 14 },
      { word: 'MANA', meaning: 'Bir söz veya olayın anlattığı şey, anlam.', reward: 8 }
    ],
    reward: { baseCoin: 115, hiddenWordBonus: 15 },
  },
  {
    levelId: 45,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_05',
    story: 'Yaylada aniden kopan fırtına, çobanları obalarına çekilmek zorunda bırakır.',
    puzzleType: 'crossword',
    letters: ["B","O","R","A","N"],
    mainWords: [
      { word: 'BORAN', meaning: 'Karadeniz ve yayla bölgelerinde görülen şiddetli kar ve rüzgâr fırtınası.', difficulty: 4 },
      { word: 'BORA', meaning: 'Ani ve güçlü soğuk rüzgâr; kısa süreli şiddetli fırtına.', difficulty: 3 },
      { word: 'OBA', meaning: 'Göçebe çadır topluluğu veya yaylada kurulan geçici yerleşim birimi.', difficulty: 3 },
      { word: 'NAR', meaning: 'İçi kırmızı taneli, ekşi-tatlı meyvesi olan ağaç ve bu ağacın meyvesi.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'BAR', meaning: 'Basınç birimi; ağır yük; toplantı veya eğlence mekânı.', reward: 12 },
      { word: 'AN', meaning: 'Çok kısa zaman dilimi; şu an.', reward: 10 }
    ],
    reward: { baseCoin: 117, hiddenWordBonus: 14 },
  }
];

const authoredMasteryLevels = [
  ...levels46to50,
  ...levels51to55,
  ...levels56to60,
  ...levels61to65,
  ...levels66to70,
  ...levels71to75,
];
export const levels: LevelData[] = [...baseLevels, ...authoredMasteryLevels];
export const initialLevel = levels[0];
