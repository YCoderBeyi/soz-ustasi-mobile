import type { LevelData } from '../types';

export const levels56to60: LevelData[] = [
  {
    levelId: 56,
    themeId: 'ottoman_library',
    sealId: 'seal_wisdom_house_01',
    puzzleType: 'crossword',
    letters: ['T', 'E', 'R', 'C', 'Ü', 'M', 'E', 'L'],
    mainWords: [
      { word: 'TERCÜME', meaning: 'Bir metni anlamını koruyarak başka bir dile aktarma işi.', difficulty: 4 },
      { word: 'CÜMLE', meaning: 'Bir düşünceyi anlatan ve noktalama işaretiyle tamamlanan söz dizisi.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 142, hiddenWordBonus: 0 },
  },
  {
    levelId: 57,
    themeId: 'ottoman_library',
    sealId: 'seal_wisdom_house_02',
    puzzleType: 'crossword',
    letters: ['K', 'İ', 'T', 'A', 'P', 'L', 'I', 'K'],
    mainWords: [
      { word: 'KİTAPLIK', meaning: 'Kitapların düzenli biçimde saklandığı raf veya bölüm.', difficulty: 3 },
      { word: 'KİL', meaning: 'Su ile yoğrulabilen ince taneli toprak.', difficulty: 2 },
    ],
    hiddenWords: [
      { word: 'KATİP', meaning: 'Yazı işleriyle uğraşan görevli.', reward: 17 },
      { word: 'KİTAP', meaning: 'Okunacak veya bilgi aktaracak biçimde bir araya getirilmiş yazılı ya da basılı yapıt.', reward: 17 },
    ],
    reward: { baseCoin: 146, hiddenWordBonus: 20 },
  },
  {
    levelId: 58,
    themeId: 'ottoman_library',
    sealId: 'seal_wisdom_house_03',
    puzzleType: 'crossword',
    letters: ['G', 'E', 'O', 'M', 'E', 'T', 'R', 'İ'],
    mainWords: [
      { word: 'GEOMETRİ', meaning: 'Şekil, büyüklük ve uzay ilişkilerini inceleyen matematik dalı.', difficulty: 4 },
      { word: 'METRE', meaning: 'Uzunluğun temel ölçü birimi.', difficulty: 2 },
      { word: 'TEOREM', meaning: 'Matematiksel yöntemlerle kanıtlanabilen önerme.', difficulty: 4 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 150, hiddenWordBonus: 0 },
  },
  {
    levelId: 59,
    themeId: "ottoman_library",
    sealId: "seal_wisdom_house_04",
    puzzleType: "crossword",
    letters: ["G", "Ö", "K", "Ü", "N", "E", "Ş"],
    mainWords: [
      { word: "GÖK", meaning: "Yeryüzünü çevreleyen boşluk; gökyüzü.", difficulty: 2 },
      { word: "GÜNEŞ", meaning: "Dünya'ya ışık ve ısı veren yıldız.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 154, hiddenWordBonus: 0 },
  },
  {
    levelId: 60,
    themeId: 'ottoman_library',
    sealId: 'seal_wisdom_house_05',
    puzzleType: 'crossword',
    letters: ['M', 'A', 'K', 'İ', 'N', 'E', 'L'],
    mainWords: [
      { word: 'MAKİNE', meaning: 'Bir işi enerji kullanarak gerçekleştiren düzenek.', difficulty: 2 },
      { word: 'İMAL', meaning: 'Hammaddeyi işleyerek ürün üretme işi.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 168, hiddenWordBonus: 0 },
  },
];
