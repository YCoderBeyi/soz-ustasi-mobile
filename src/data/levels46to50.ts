import type { LevelData } from '../types';

export const levels46to50: LevelData[] = [
  {
    levelId: 46,
    themeId: 'ottoman_library',
    sealId: 'seal_wisdom_01',
    puzzleType: 'crossword',
    letters: ['C', 'E', 'B', 'İ', 'R', 'L', 'İ', 'M'],
    mainWords: [
      { word: 'CEBİR', meaning: 'Sayılar ve bilinmeyenler arasındaki ilişkileri inceleyen matematik alanı.', difficulty: 3 },
      { word: 'BİLİM', meaning: 'Sistemli inceleme ve bilgi üretme alanı; cebir bunun matematikteki bir dalıdır.', difficulty: 2 },
    ],
    hiddenWords: [
      { word: 'İBRE', meaning: 'Bir ölçü aletinde değeri gösteren ince hareketli parça.', reward: 16 },
      { word: 'EL', meaning: 'Kolun bilekten parmak uçlarına kadar olan bölümü.', reward: 13 },
      { word: 'ER', meaning: 'Yiğit veya asker; erkek anlamına gelen sözcük.', reward: 13 },
    ],
    reward: { baseCoin: 122, hiddenWordBonus: 16 },
  },
  {
    levelId: 47,
    themeId: "ottoman_library",
    sealId: "seal_wisdom_02",
    puzzleType: "crossword",
    letters: ["R", "A", "K", "A", "M", "B", "A", "S"],
    mainWords: [
      { word: "RAKAM", meaning: "Sayıları yazmak için kullanılan işaretlerden her biri.", difficulty: 3 },
      { word: "BASAMAK", meaning: "Sayıda bir rakamın bulunduğu ve değerini belirleyen konum.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 124, hiddenWordBonus: 0 },
  },
  {
    levelId: 48,
    themeId: 'ottoman_library',
    sealId: 'seal_wisdom_03',
    puzzleType: 'crossword',
    letters: ['D', 'E', 'N', 'K', 'L', 'E', 'M'],
    mainWords: [
      { word: 'DENKLEM', meaning: 'İki matematiksel ifadenin eşitliğini gösteren bağıntı.', difficulty: 4 },
      { word: 'DENK', meaning: 'Değer, güç veya nitelik bakımından eşit olan.', difficulty: 3 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 128, hiddenWordBonus: 0 },
  },
  {
    levelId: 49,
    themeId: 'ottoman_library',
    sealId: 'seal_wisdom_04',
    puzzleType: 'crossword',
    letters: ['H', 'E', 'S', 'A', 'P', 'Y', 'I'],
    mainWords: [
      { word: 'HESAP', meaning: 'Sayılarla yapılan işlem veya bir sonuca ulaşma işi.', difficulty: 2 },
      { word: 'SAYI', meaning: 'Bir çokluğu veya sırayı belirten matematiksel değer.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 132, hiddenWordBonus: 0 },
  },
  {
    levelId: 50,
    themeId: 'ottoman_library',
    sealId: 'seal_wisdom_05',
    puzzleType: 'crossword',
    letters: ['Y', 'Ö', 'N', 'T', 'E', 'M', 'O', 'L'],
    mainWords: [
      { word: 'YÖNTEM', meaning: 'Bir amaca ulaşmak için izlenen düzenli yol.', difficulty: 3 },
      { word: 'YOL', meaning: 'Bir işi sonuca ulaştırmak için izlenen yol.', difficulty: 2 },
    ],
    hiddenWords: [
      { word: 'TEN', meaning: 'İnsan bedenini örten deri.', reward: 16 },
      { word: 'ÖN', meaning: 'Bir şeyin temel bakış yönündeki bölümü.', reward: 16 },
      { word: 'NET', meaning: 'Açık, kesin ve kolay anlaşılır olan.', reward: 10 },
    ],
    reward: { baseCoin: 145, hiddenWordBonus: 20 },
  },
];

