import type { WordEntry } from '../types';
import { normalizeWord } from './normalize';
import { GENERATED_BONUS_MEANINGS, GENERATED_BONUS_WORDS } from '../data/bonusWords.generated';

// Common, unambiguous words curated for the letter pools used by the game.
// Lexical candidates were cross-checked against Zemberek's Turkish lexicon.
const bonusWords: WordEntry[] = [
  { word: 'AMA', meaning: 'Karşıt iki düşünceyi birbirine bağlayan söz.' },
  { word: 'SU', meaning: 'Canlıların yaşamı için gerekli saydam sıvı.' },
  { word: 'ŞU', meaning: 'Yakındaki veya gösterilen varlığı belirten söz.' },
  { word: 'ARK', meaning: 'Su taşımak için açılmış küçük kanal.' },
  { word: 'KREMA', meaning: 'Yemek ve tatlılarda kullanılan yoğun kıvamlı karışım.' },
  { word: 'DELİK', meaning: 'Bir yüzeyde bulunan açıklık veya oyuk.' },
  { word: 'İLKE', meaning: 'Davranışa yön veren temel düşünce veya kural.' },
  { word: 'ANMA', meaning: 'Birini veya bir olayı hatırlama işi.' },
  { word: 'ISLAH', meaning: 'Daha iyi duruma getirme, düzeltme işi.' },
  { word: 'UMUR', meaning: 'Önem verme ve ilgilenme durumu.' },
  { word: 'YAY', meaning: 'Ok atmaya yarayan eğri araç.' },
  { word: 'RENDE', meaning: 'Yiyecekleri küçük parçalara ayıran dişli araç.' },
  { word: 'ARYA', meaning: 'Operada tek kişinin söylediği ezgili bölüm.' },
  { word: 'KALIP', meaning: 'Bir şeye biçim vermek için kullanılan araç.' },
  { word: 'ALO', meaning: 'Telefon konuşmasına başlarken kullanılan seslenme sözü.' },
  { word: 'DİVA', meaning: 'Ün kazanmış kadın opera sanatçısı.' },
  { word: 'NİYET', meaning: 'Bir şeyi yapmayı önceden isteme ve düşünme.' },
  { word: 'ZİNDE', meaning: 'Güçlü, canlı ve dinç durumda olan.' },
  { word: 'AKORT', meaning: 'Bir çalgının seslerini doğru perdeye getirme işi.' },
  { word: 'ŞAH', meaning: 'Satrançtaki en önemli taş.' },
  { word: 'KITA', meaning: 'Yeryüzündeki büyük kara parçalarından her biri.' },
  { word: 'KİL', meaning: 'Islanınca kolayca biçimlenen ince taneli toprak.' },
  { word: 'NİDA', meaning: 'Seslenme veya yüksek sesle çağırma.' },
  { word: 'TİP', meaning: 'Ortak özellikleri olan kişi veya şey türü.' },
  { word: 'İP', meaning: 'Bükülmüş liflerden yapılan ince bağ.' },
  { word: 'KULE', meaning: 'Yüksek ve dar biçimde yapılmış yapı.' },
  { word: 'SUAL', meaning: 'Soru anlamına gelen söz.' },
  { word: 'ARZU', meaning: 'Bir şeyi elde etme veya yapma isteği.' },
  { word: 'NEŞE', meaning: 'Sevinçli ve canlı olma durumu.' },
  { word: 'AŞIK', meaning: 'Birine sevgiyle bağlı olan kimse.' },
  { word: 'LONCA', meaning: 'Aynı mesleği yapanların oluşturduğu eski birlik.' },
  { word: 'ATEŞ', meaning: 'Yanıcı maddelerin ışık ve ısı çıkararak yanması.' },
  { word: 'TULUM', meaning: 'Tek parçadan oluşan giysi veya deri kap.' },
  { word: 'ALEV', meaning: 'Yanan maddeden yükselen ışıklı bölüm.' },
  { word: 'KULAK', meaning: 'İşitmeye yarayan duyu organı.' },
  { word: 'ŞAİR', meaning: 'Şiir yazan kimse.' },
  { word: 'ADALET', meaning: 'Hak ve hukuka uygunluk, doğruluk.' },
  { word: 'NAMAZ', meaning: 'İslam dininde belirli hareket ve sözlerle yapılan ibadet.' },
  { word: 'İÇ', meaning: 'Bir şeyin sınırları arasında kalan bölüm.' },
  { word: 'İNCE', meaning: 'Kalınlığı az olan.' },
];

// Hand-written meanings win; the generated tier (double-reviewed, values-filtered) carries original short meanings where authored.
const dictionary = new Map<string, WordEntry>();
for (const word of GENERATED_BONUS_WORDS) {
  dictionary.set(normalizeWord(word), { word, meaning: GENERATED_BONUS_MEANINGS[word] ?? '' });
}
for (const entry of bonusWords) {
  dictionary.set(normalizeWord(entry.word), entry);
}

export function findBonusDictionaryWord(word: string): WordEntry | undefined {
  return dictionary.get(normalizeWord(word));
}
