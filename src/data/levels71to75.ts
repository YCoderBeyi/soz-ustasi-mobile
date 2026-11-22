import type { LevelData } from '../types';

export const levels71to75: LevelData[] = [
  {
    levelId: 71,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_surgery_01',
    puzzleType: 'crossword',
    letters: ['A', 'L', 'E', 'T', 'L', 'E', 'R', 'M'],
    mainWords: [
      { word: 'METAL', meaning: 'Isı ve elektriği ileten, şekil verilebilen dayanıklı madde.', difficulty: 2 },
      { word: 'TEL', meaning: 'İnce ve uzun metal iplik.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 174, hiddenWordBonus: 0 },
  },
  {
    levelId: 72,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_surgery_02',
    puzzleType: 'crossword',
    letters: ['B', 'I', 'Ç', 'A', 'K'],
    mainWords: [
      { word: 'BIÇAK', meaning: 'Kesici metal ağız ve saptan oluşan araç.', difficulty: 3 },
      { word: 'ÇAKI', meaning: 'Katlanabilir küçük cep bıçağı.', difficulty: 3 },
    ],
    hiddenWords: [
      { word: 'AK', meaning: 'Beyaz veya temiz.', reward: 20 },
    ],
    reward: { baseCoin: 178, hiddenWordBonus: 20 },
  },
  {
    levelId: 73,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_surgery_03',
    puzzleType: 'crossword',
    letters: ['D', 'İ', 'K', 'İ', 'Ş'],
    mainWords: [
      { word: 'DİKİŞ', meaning: 'İğne ve iplikle yapılan birleştirme işi veya bunun izi.', difficulty: 4 },
      { word: 'KİŞİ', meaning: 'Bir insanı veya bireyi anlatan söz.', difficulty: 3 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 182, hiddenWordBonus: 0 },
  },
  {
    levelId: 74,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_surgery_04',
    puzzleType: 'crossword',
    letters: ['S', 'A', 'Ğ', 'L', 'I', 'K'],
    mainWords: [
      { word: 'SAĞLIK', meaning: 'Bedenin ve zihnin iyi, hastalıksız durumda olması.', difficulty: 3 },
      { word: 'SAĞ', meaning: 'Yaşayan, canlı; ayrıca sol karşıtı yön.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 188, hiddenWordBonus: 0 },
  },
  {
    levelId: 75,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_surgery_05',
    puzzleType: 'crossword',
    letters: ['T', 'E', 'D', 'A', 'V', 'İ'],
    mainWords: [
      { word: 'TEDAVİ', meaning: 'Bir hastalığı iyileştirmek veya etkisini azaltmak için yapılan uygulama.', difficulty: 4 },
      { word: 'DEVA', meaning: 'Bir derde çare olan ilaç veya çözüm.', difficulty: 4 },
      { word: 'VİDA', meaning: 'Parçaları sabitlemeye yarayan, helis biçiminde dişleri olan metal araç.', difficulty: 3 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 202, hiddenWordBonus: 0 },
  },
];
