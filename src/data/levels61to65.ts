import type { LevelData } from '../types';

export const levels61to65: LevelData[] = [
  {
    levelId: 61,
    themeId: "seljuk_courtyard",
    sealId: "seal_optics_01",
    puzzleType: "crossword",
    letters: ["C", "A", "M", "G", "Ö", "R", "E", "K"],
    mainWords: [
      { word: "CAM", meaning: "Işığın geçmesine izin veren saydam malzeme.", difficulty: 2 },
      { word: "GÖRMEK", meaning: "Göz aracılığıyla varlıkları ve görüntüleri algılamak.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 152, hiddenWordBonus: 0 },
  },
  {
    levelId: 62,
    themeId: "seljuk_courtyard",
    sealId: "seal_optics_02",
    puzzleType: "anagram",
    letters: ["G", "Ö", "Z", "N", "E", "S", "N", "E"],
    mainWords: [
      { word: "GÖZ", meaning: "Görmeyi sağlayan duyu organı.", difficulty: 1 },
      { word: "NESNE", meaning: "Duyu organlarıyla algılanabilen varlık ya da şey.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 160, hiddenWordBonus: 0 },
  },
  {
    levelId: 63,
    themeId: 'seljuk_courtyard',
    sealId: 'seal_optics_03',
    puzzleType: 'crossword',
    letters: ['Y', 'A', 'N', 'S', 'I', 'M', 'A'],
    mainWords: [
      { word: 'YANSIMA', meaning: 'Işığın bir yüzeye çarpıp geldiği ortama geri dönmesi.', difficulty: 4 },
      { word: 'AYNA', meaning: 'Işığı yansıtarak görüntü oluşturan parlak yüzey.', difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 160, hiddenWordBonus: 0 },
  },
  {
    levelId: 64,
    themeId: "seljuk_courtyard",
    sealId: "seal_optics_04",
    puzzleType: "anagram",
    letters: ["O", "D", "A", "T", "E", "R", "S"],
    mainWords: [
      { word: "ODA", meaning: "Bir yapının içinde, çevresi duvarlarla ayrılmış bölüm.", difficulty: 1 },
      { word: "TERS", meaning: "Normal yönünün veya konumunun karşıtı olan.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 165, hiddenWordBonus: 0 },
  },
  {
    levelId: 65,
    themeId: "seljuk_courtyard",
    sealId: "seal_optics_05",
    puzzleType: "crossword",
    letters: ["M", "E", "R", "C", "E", "K", "A", "N"],
    mainWords: [
      { word: "MERCEK", meaning: "Işığı kırarak görüntü oluşturan saydam optik parça.", difficulty: 3 },
      { word: "RENK", meaning: "Işığın niteliğine göre nesnelerin gözde bıraktığı algı.", difficulty: 2 },
    ],
    hiddenWords: [],
    reward: { baseCoin: 178, hiddenWordBonus: 0 },
  },
];
