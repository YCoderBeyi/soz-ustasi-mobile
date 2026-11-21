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
    letters: ["A","R","I","A"],
    mainWords: [
      { word: 'ARI', meaning: 'Bal yapan, kanatlı küçük böcek.', difficulty: 1 },
      { word: 'ARA', meaning: 'Bir şeyi bulmak için bakınmak veya aramak.', difficulty: 1 }
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
    letters: ["K","İ","L","Z"],
    mainWords: [
      { word: 'KİL', meaning: 'Islanınca yumuşayıp biçim verilebilen ince taneli toprak.', difficulty: 2 },
      { word: 'İZ', meaning: 'Bir yüzeyde kalan işaret veya belirti.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 25, hiddenWordBonus: 0 },
  },
  {
    levelId: 3,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_03',
    puzzleType: 'crossword',
    letters: ["K","İ","T","A","P","L"],
    mainWords: [
      { word: 'KİTAP', meaning: 'Yazılı veya basılı yapıt.', difficulty: 2 },
      { word: 'İLK', meaning: 'Ötekilerden önce gelen; başlangıçtaki.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AK', meaning: 'Beyaz; temiz ve lekesiz.', reward: 9 }
    ],
    reward: { baseCoin: 30, hiddenWordBonus: 9 },
  },
  {
    levelId: 4,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_04',
    puzzleType: 'anagram',
    letters: ["A","L","E","T","K","İ","İ"],
    mainWords: [
      { word: 'ALET', meaning: 'Bir işi yapmaya yarayan araç.', difficulty: 2 },
      { word: 'KİLİT', meaning: 'Bir yeri kapalı tutmaya yarayan düzenek.', difficulty: 2 }
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
    letters: ["K","A","A","Y","T","Ş","R"],
    mainWords: [
      { word: 'TAŞ', meaning: 'Sert ve katı mineral parçası.', difficulty: 2 },
      { word: 'KAYA', meaning: 'Yerkabuğunda bulunan sert ve büyük taş kütlesi.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'KAR', meaning: 'Donmuş su kristallerinden oluşan yağış.', reward: 8 }
    ],
    reward: { baseCoin: 34, hiddenWordBonus: 7 },
  },
  {
    levelId: 6,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_02',
    puzzleType: 'crossword',
    letters: ["K","A","L","E","M","I","P"],
    mainWords: [
      { word: 'KALEM', meaning: 'Yazı yazmaya yarayan araç.', difficulty: 2 },
      { word: 'KALIP', meaning: 'Bir şeye biçim vermek için kullanılan araç.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'KAP', meaning: 'İçine bir şey konulan nesne.', reward: 9 }
    ],
    reward: { baseCoin: 36, hiddenWordBonus: 9 },
  },
  {
    levelId: 7,
    themeId: 'ege_coast',
    sealId: 'seal_ege_01',
    puzzleType: 'crossword',
    letters: ["O","R","A","N","K","A","M"],
    mainWords: [
      { word: 'ORAN', meaning: 'İki çokluğun birbirine göre ölçüsü.', difficulty: 2 },
      { word: 'RAKAM', meaning: 'Sayıları yazmak için kullanılan işaretlerden her biri.', difficulty: 2 }
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
    letters: ["S","A","Y","I","Ö","N"],
    mainWords: [
      { word: 'SAYI', meaning: 'Bir çokluğu veya sırayı belirten matematiksel değer.', difficulty: 2 },
      { word: 'YÖN', meaning: 'Bir yerin başka bir yere göre bulunduğu taraf.', difficulty: 2 },
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
    puzzleType: 'crossword',
    letters: ["H","E","S","A","P","U","U","L"],
    mainWords: [
      { word: 'HESAP', meaning: 'Sayılarla yapılan işlem veya bir sonuca ulaşma işi.', difficulty: 2 },
      { word: 'USUL', meaning: 'Bir işi yaparken izlenen yol veya yöntem.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 45, hiddenWordBonus: 0 },
  },
  {
    levelId: 10,
    themeId: 'ottoman_library',
    sealId: 'seal_library_01',
    puzzleType: 'crossword',
    letters: ["G","Ö","Z","R","M","E","K"],
    mainWords: [
      { word: 'GÖZ', meaning: 'Görmeyi sağlayan duyu organı.', difficulty: 1 },
      { word: 'GÖRMEK', meaning: 'Gözle algılamak.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'EK', meaning: 'Bir bütüne sonradan katılan parça.', reward: 12 }
    ],
    reward: { baseCoin: 46, hiddenWordBonus: 8 },
  },
  {
    levelId: 11,
    themeId: "seljuk_courtyard",
    sealId: "seal_seljuk_01",
    puzzleType: "crossword",
    letters: ["H", "A", "R", "F", "Y", "Z", "I"],
    mainWords: [
      { word: "HARF", meaning: "Alfabede bir sesi yazıda gösteren işaret.", difficulty: 2 },
      { word: "YAZI", meaning: "Harflerle oluşturulup düşünce veya bilgiyi aktaran metin.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 47, hiddenWordBonus: 0 },
  },
  {
    levelId: 12,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_01',
    puzzleType: 'crossword',
    letters: ["T","E","D","A","V","İ","L","Ç"],
    mainWords: [
      { word: 'TEDAVİ', meaning: 'Bir hastalığı iyileştirmek veya etkisini azaltmak için yapılan uygulama.', difficulty: 2 },
      { word: 'DEVA', meaning: 'Bir derde çare olan çözüm.', difficulty: 2 },
    ],
    hiddenWords: [
      { word: 'İLAÇ', meaning: 'Hastalığı iyileştirmek veya etkisini azaltmak için kullanılan madde.', reward: 13 }
    ],
    reward: { baseCoin: 49, hiddenWordBonus: 10 },
  },
  {
    levelId: 13,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_01',
    puzzleType: 'crossword',
    letters: ["M","A","K","İ","N","E","L","Y"],
    mainWords: [
      { word: 'MAKİNE', meaning: 'Bir işi enerji kullanarak yapan düzenek.', difficulty: 2 },
      { word: 'MİL', meaning: 'Makinede dönme hareketini parçalara aktaran eksen biçimli parça.', difficulty: 3 },
    ],
    hiddenWords: [
      { word: 'EMİN', meaning: 'Güvenilir veya kuşkusu olmayan.', reward: 12 }
    ],
    reward: { baseCoin: 51, hiddenWordBonus: 10 },
  },
  {
    levelId: 14,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_02',
    puzzleType: 'crossword',
    letters: ["M","E","R","C","E","K","A"],
    mainWords: [
      { word: 'MERCEK', meaning: 'Işığı kırarak görüntüyü büyüten veya odaklayan saydam araç.', difficulty: 3 },
      { word: 'CAM', meaning: 'Silisli maddelerden yapılan, saydam ve kırılgan katı madde.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 53, hiddenWordBonus: 0 },
  },
  {
    levelId: 15,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_05',
    puzzleType: 'anagram',
    letters: ["B","A","S","K","I","S","Ö","Z"],
    mainWords: [
      { word: 'BASKI', meaning: 'Harf kalıplarına mürekkep sürüp yazıyı kâğıda aktarma işi.', difficulty: 2 },
      { word: 'SÖZ', meaning: 'Bir düşünceyi anlatan kelime veya kelime grubu.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 54, hiddenWordBonus: 0 },
  },
  {
    levelId: 16,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_06',
    puzzleType: 'crossword',
    letters: ["G","E","M","İ","D","N","Z","L"],
    mainWords: [
      { word: 'GEMİ', meaning: 'Su üzerinde yük veya yolcu taşıyan büyük araç.', difficulty: 2 },
      { word: 'DENİZ', meaning: 'Yeryüzünün büyük tuzlu su kütlesi.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'İL', meaning: 'Ülkenin yönetimindeki temel bölgesel birim.', reward: 10 }
    ],
    reward: { baseCoin: 55, hiddenWordBonus: 9 },
  },
  {
    levelId: 17,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_03',
    puzzleType: 'crossword',
    letters: ["G","Ö","K","Z","L","E","M"],
    mainWords: [
      { word: 'GÖK', meaning: 'Yeryüzünü çevreleyen boşluk; gökyüzü.', difficulty: 2 },
      { word: 'GÖZLEM', meaning: 'Bir olayı bilgi edinmek için dikkatle inceleme.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'ÖZ', meaning: 'Bir şeyin temel niteliği veya iç bölümü.', reward: 10 }
    ],
    reward: { baseCoin: 57, hiddenWordBonus: 10 },
  },
  {
    levelId: 18,
    themeId: "cappadocia",
    sealId: "seal_cappadocia_04",
    puzzleType: "anagram",
    letters: ["M", "İ", "K", "R", "O", "P", "S", "U"],
    mainWords: [
      { word: "MİKROP", meaning: "Mikroskopla görülebilen çok küçük canlı; bazı türleri hastalık yapar, bazıları yapmaz.", difficulty: 2 },
      { word: "SU", meaning: "Canlıların yaşamı için gerekli, içilen renksiz sıvı.", difficulty: 1 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 61, hiddenWordBonus: 0 },
  },
  {
    levelId: 19,
    themeId: 'ege_coast',
    sealId: 'seal_ege_03',
    puzzleType: 'crossword',
    letters: ["H","A","V","A","B","A","R"],
    mainWords: [
      { word: 'HAVA', meaning: 'Dünya yüzeyini saran gaz karışımı.', difficulty: 2 },
      { word: 'BAR', meaning: 'Basınç ölçümünde kullanılan birim.', difficulty: 3 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 64, hiddenWordBonus: 0 },
  },
  {
    levelId: 20,
    themeId: 'ege_coast',
    sealId: 'seal_ege_04',
    puzzleType: 'anagram',
    letters: ["İ","M","A","L","E","E","K"],
    mainWords: [
      { word: 'İMAL', meaning: 'Bir ürünü üretme veya yapma işi.', difficulty: 3 },
      { word: 'EMEK', meaning: 'Bir iş için harcanan beden veya zihin gücü.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'EL', meaning: 'Kolun bilekten parmak uçlarına kadar olan bölümü.', reward: 10 }
    ],
    reward: { baseCoin: 66, hiddenWordBonus: 10 },
  },
  {
    levelId: 21,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_02',
    puzzleType: 'crossword',
    letters: ["A","Ş","I","K","İ","İ"],
    mainWords: [
      { word: 'AŞI', meaning: 'Bağışıklık yanıtı oluşturmak için uygulanan biyolojik ürün.', difficulty: 3 },
      { word: 'KİŞİ', meaning: 'İnsan; birey.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 68, hiddenWordBonus: 0 },
  },
  {
    levelId: 22,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_03',
    puzzleType: 'crossword',
    letters: ["H","A","R","M","A","N","T","L"],
    mainWords: [
      { word: 'HARMAN', meaning: 'Tahılın dövülüp savrulduğu alan; hasat mevsimini simgeleyen işleme yeri.', difficulty: 3 },
      { word: 'TARLA', meaning: 'Tarım ürünleri yetiştirilen toprak parçası.', difficulty: 2 }
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
    letters: ["T","R","E","N","A","Y"],
    mainWords: [
      { word: 'TREN', meaning: 'Raylar üzerinde vagonları çeken lokomotif ve vagonlardan oluşan taşıt.', difficulty: 2 },
      { word: 'RAY', meaning: 'Tren tekerleklerinin üzerinde ilerlediği metal hat.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 74, hiddenWordBonus: 0 },
  },
  {
    levelId: 24,
    themeId: 'ottoman_library',
    sealId: 'seal_library_03',
    puzzleType: 'anagram',
    letters: ["D","T","E","L","İ","İ","A"],
    mainWords: [
      { word: 'DİL', meaning: 'İnsanların anlaşmasını sağlayan sözlü veya yazılı iletişim sistemi.', difficulty: 2 },
      { word: 'İLETİ', meaning: 'Bir yerden başka bir yere aktarılan bilgi veya mesaj.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'AD', meaning: 'İsim, nam, şöhret.', reward: 13 }
    ],
    reward: { baseCoin: 76, hiddenWordBonus: 13 },
  },
  {
    levelId: 25,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_02',
    puzzleType: 'crossword',
    letters: ["K","A","R","E","N"],
    mainWords: [
      { word: 'KARE', meaning: 'Fotoğrafta tek bir görüntü alanı veya çerçeve.', difficulty: 2 },
      { word: 'RENK', meaning: 'Işığın niteliğine göre nesnelerin gözde bıraktığı algı.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AN', meaning: 'Çok kısa zaman dilimi; içinde bulunulan zaman.', reward: 10 }
    ],
    reward: { baseCoin: 78, hiddenWordBonus: 10 },
  },
  {
    levelId: 26,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_03',
    puzzleType: 'crossword',
    letters: ["H","E","K","İ","M","L","A","Ç"],
    mainWords: [
      { word: 'HEKİM', meaning: 'Hastalıkları teşhis ve tedavi eden sağlık uzmanı.', difficulty: 2 },
      { word: 'İLAÇ', meaning: 'Hastalığı iyileştirmek veya etkisini azaltmak için kullanılan madde.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'AİLE', meaning: 'Aralarında yakınlık ve dayanışma bulunan kişiler topluluğu.', reward: 12 },
    ],
    reward: { baseCoin: 80, hiddenWordBonus: 12 },
  },
  {
    levelId: 27,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_02',
    puzzleType: 'anagram',
    letters: ["T","İ","Z","L"],
    mainWords: [
      { word: 'TİZ', meaning: 'İnce ve yüksek frekanslı ses.', difficulty: 3 },
      { word: 'ZİL', meaning: 'Çalındığında ses çıkaran küçük metal araç.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'İZ', meaning: 'Bir şeyin geçtiğini veya bulunduğunu gösteren belirti.', reward: 8 }
    ],
    reward: { baseCoin: 82, hiddenWordBonus: 13 },
  },
  {
    levelId: 28,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_03',
    puzzleType: 'anagram',
    letters: ["A","K","I","Ş","T","E","L"],
    mainWords: [
      { word: 'AKIŞ', meaning: 'Bir akımın iletken boyunca ilerleyişi.', difficulty: 3 },
      { word: 'TEL', meaning: 'Akkor lambada akım geçince ışık veren ince filaman.', difficulty: 3 }
    ],
    // Bu harf havuzunda approved listede konuya doğrudan uyan ek bir gizli hedef yok.
    hiddenWords: [],
    reward: { baseCoin: 85, hiddenWordBonus: 0 },
  },
  {
    levelId: 29,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_03',
    puzzleType: 'crossword',
    letters: ["B","U","L","U","T","A","S"],
    mainWords: [
      { word: 'BULUT', meaning: 'Gökyüzünde su buharının oluşturduğu kütle.', difficulty: 2 },
      { word: 'SULU', meaning: 'İçinde bol miktarda su barındıran.', difficulty: 2 },
    ],
    hiddenWords: [
      { word: 'ULU', meaning: 'Yüce, büyük ve saygın.', reward: 15 },
      { word: 'ALT', meaning: 'Bir şeyin alt kısmı, aşağısı.', reward: 12 },
      { word: 'BAL', meaning: 'Arıların çiçek özlerinden yaptığı tatlı besin.', reward: 12 },
    ],
    reward: { baseCoin: 86, hiddenWordBonus: 15 },
  },
  {
    levelId: 30,
    themeId: "old_istanbul",
    sealId: "seal_istanbul_07",
    puzzleType: "anagram",
    letters: ["R", "A", "D", "Y", "O", "S", "E", "S"],
    mainWords: [
      { word: "RADYO", meaning: "Radyo dalgalarıyla yayınlanan ses programlarını alan cihaz.", difficulty: 2 },
      { word: "SES", meaning: "Bir kaynağın titreşimiyle oluşup işitme yoluyla algılanan şey.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 88, hiddenWordBonus: 0 },
  },
  {
    levelId: 31,
    themeId: 'cappadocia',
    sealId: 'seal_cappadocia_05',
    puzzleType: 'crossword',
    letters: ["K","I","R","I","K","T","P","E"],
    mainWords: [
      { word: 'KIRIK', meaning: 'Darbe sonrası kemik bütünlüğünün bozulması.', difficulty: 2 },
      { word: 'TIP', meaning: 'Hastalıkları önleme, tanıma ve tedavi etme bilgisi.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 89, hiddenWordBonus: 0 },
  },
  {
    levelId: 32,
    themeId: 'ege_coast',
    sealId: 'seal_ege_05',
    puzzleType: 'anagram',
    letters: ["R","Ü","Z","G","A","R"],
    mainWords: [
      { word: 'RÜZGAR', meaning: 'Havanın yer değiştirmesiyle oluşan esinti.', difficulty: 3 },
      { word: 'GAZ', meaning: 'Belirli hacmi olmayan akışkan madde.', difficulty: 3 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 91, hiddenWordBonus: 0 },
  },
  {
    levelId: 33,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_04',
    puzzleType: 'anagram',
    letters: ["Ş","İ","F","A","Y","A","R"],
    mainWords: [
      { word: 'ŞİFA', meaning: 'Hastalık veya yaranın iyileşmesi, sağlık bulma.', difficulty: 2 },
      { word: 'YARA', meaning: 'Deri veya vücut dokusunda oluşan hasarlı bölge.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 93, hiddenWordBonus: 0 },
  },
  {
    levelId: 34,
    themeId: 'ottoman_library',
    sealId: 'seal_library_04',
    puzzleType: 'anagram',
    letters: ["B","İ","L","G","İ","K","O","D"],
    mainWords: [
      { word: 'BİLGİ', meaning: 'Öğrenme, araştırma veya gözlem yoluyla edinilen veri ve anlayış.', difficulty: 2 },
      { word: 'KOD', meaning: 'Bilgiyi belirli kurallara göre gösteren simge veya işaret dizisi.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 97, hiddenWordBonus: 0 },
  },
  {
    levelId: 35,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_04',
    puzzleType: 'anagram',
    letters: ["İ","Ş","L","E","M","P"],
    mainWords: [
      { word: 'İŞLEM', meaning: 'Bir sonuca ulaşmak için yapılan uygulama veya hesap.', difficulty: 3 },
      { word: 'PİL', meaning: 'Kimyasal enerjiyi elektrik enerjisine dönüştüren güç kaynağı.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 98, hiddenWordBonus: 0 },
  },
  {
    levelId: 36,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_04',
    puzzleType: 'anagram',
    letters: ["B","İ","T","S","I","F","I","R"],
    mainWords: [
      { word: 'BİT', meaning: 'Bilgisayarda 0 ya da 1 değerini alabilen ikili veri basamağı.', difficulty: 3 },
      { word: 'SIFIR', meaning: 'İkili sayı sisteminde 1 ile birlikte kullanılan iki değerden biri.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 100, hiddenWordBonus: 0 },
  },
  {
    levelId: 37,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_04',
    puzzleType: 'crossword',
    letters: ["D","N","A","G","E","N"],
    mainWords: [
      { word: 'DNA', meaning: 'Canlıların kalıtsal bilgisini taşıyan molekülün kısa adı.', difficulty: 2 },
      { word: 'GEN', meaning: 'Kalıtsal bilgi taşıyan DNA bölümü; özelliklerin oluşmasına katkı sağlar.', difficulty: 3 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 101, hiddenWordBonus: 0 },
  },
  {
    levelId: 38,
    themeId: 'old_istanbul',
    sealId: 'seal_istanbul_08',
    puzzleType: 'anagram',
    letters: ["S","A","A","T","E","R","Y"],
    mainWords: [
      { word: 'SAAT', meaning: 'Zamanı gösteren araç veya zaman ölçüsü.', difficulty: 2 },
      { word: 'AY', meaning: 'Dünya’nın çevresinde dolanan doğal uydu.', difficulty: 1 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 103, hiddenWordBonus: 0 },
  },
  {
    levelId: 39,
    themeId: "cappadocia",
    sealId: "seal_cappadocia_06",
    puzzleType: "crossword",
    letters: ["I", "Ş", "I", "K", "N"],
    mainWords: [
      { word: "IŞIK", meaning: "Görmeyi sağlayan aydınlık; lazer bu enerjiyi yoğun bir demette toplar.", difficulty: 2 },
      { word: "IŞIN", meaning: "Işığın ilerlediği doğrultu veya ışık demeti.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 106, hiddenWordBonus: 0 },
  },
  {
    levelId: 40,
    themeId: 'ege_coast',
    sealId: 'seal_ege_06',
    puzzleType: 'anagram',
    letters: ["V","E","R","İ","A","Ğ"],
    mainWords: [
      { word: 'VERİ', meaning: 'Bilgi veya ölçüm sonucu elde edilen değer.', difficulty: 2 },
      { word: 'AĞ', meaning: 'Birbirine bağlı bilgisayarların veri iletişimi kurduğu sistem.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 108, hiddenWordBonus: 0 },
  },
  {
    levelId: 41,
    themeId: 'anatolian_autumn',
    sealId: 'seal_anatolia_05',
    puzzleType: 'crossword',
    letters: ["K","A","L","P","A","N"],
    mainWords: [
      { word: 'KALP', meaning: 'Kanı vücuda pompalayan organ.', difficulty: 2 },
      { word: 'ALAN', meaning: 'Manyetik kuvvetin etkisinin bulunduğu bölge.', difficulty: 3 }
    ],
    hiddenWords: [
      { word: 'KAN', meaning: 'Damarlar içinde dolaşıp vücuda oksijen taşıyan kırmızı sıvı.', reward: 12 }
    ],
    reward: { baseCoin: 110, hiddenWordBonus: 12 },
  },
  {
    levelId: 42,
    themeId: 'ottoman_library',
    sealId: 'seal_library_05',
    puzzleType: 'crossword',
    letters: ["H","A","R","İ","T","A","Y","Y"],
    mainWords: [
      { word: 'HARİTA', meaning: 'Yerleri ve konumları gösteren çizimli gösterim.', difficulty: 2 },
      { word: 'YAYA', meaning: 'Yürüyerek giden kişi.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 111, hiddenWordBonus: 0 },
  },
  {
    levelId: 43,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_seljuk_05',
    puzzleType: 'crossword',
    letters: ["S","A","Y","F","A","B","Ğ"],
    mainWords: [
      { word: 'SAYFA', meaning: 'Web’de metin ve bağlantıların yer aldığı içerik bölümü.', difficulty: 2 },
      { word: 'BAĞ', meaning: 'Web’de bir sayfadan başka birine geçiş sağlayan bağlantı.', difficulty: 3 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 114, hiddenWordBonus: 0 },
  },
  {
    levelId: 44,
    themeId: 'nemrut_dawn',
    sealId: 'seal_nemrut_05',
    puzzleType: 'crossword',
    letters: ["E","K","R","A","N","M","A"],
    mainWords: [
      { word: 'EKRAN', meaning: 'Telefonun görüntü ve bilgileri gösteren yüzeyi.', difficulty: 2 },
      { word: 'KAMERA', meaning: 'Fotoğraf veya video çekmeye yarayan aygıt.', difficulty: 2 }
    ],
    hiddenWords: [],
    reward: { baseCoin: 115, hiddenWordBonus: 0 },
  },
  {
    levelId: 45,
    themeId: 'blacksea_highland',
    sealId: 'seal_blacksea_05',
    puzzleType: 'crossword',
    letters: ["B","O","R","A","Y","Y","L","A"],
    mainWords: [
      { word: 'BORA', meaning: 'Ani ve güçlü soğuk rüzgâr; kısa süreli şiddetli fırtına.', difficulty: 3 },
      { word: 'YAYLA', meaning: 'Dağlık bölgelerdeki yüksek, serin ve geniş düzlük.', difficulty: 2 }
    ],
    hiddenWords: [
      { word: 'OBA', meaning: 'Göçebe çadır topluluğu veya geçici yerleşim birimi.', reward: 14 }
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
