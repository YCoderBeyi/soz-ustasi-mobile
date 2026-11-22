/**
 * Ana yolculuk bölüm modeli — Plan §4 (12 bölüm × 20 seviye = 240).
 * Her bölüm levelId aralığına, temaya ve bilim/tarih eksenine sahiptir.
 * Seviye verisi `chapterId` taşımıyorsa `chapterForLevel` ile türetilir.
 *
 * ⚠️ UYARI: Bu HEDEF modeldir. Yayındaki 75 seviyenin içeriği henüz plan §4
 * aralıklarına uymuyor (örn. L41-45 modern bilim içeriği taşırken bu model onları
 * "Bilgelik Evleri/Bağdat" bölümüne koyar). İçerik plan §4'e göre yeniden kurulana
 * dek `chapterForLevel` yayın seviyeleri için OTORİTATİF kabul edilmemelidir.
 * Ayrıntı: vault/05-Content/Game-Mechanics-Panel-Audit-2026-06-20.md (Öz-düzeltme).
 */
export type Chapter = {
  chapterId: string;
  index: number; // 1..12
  title: string;
  range: [number, number]; // dahil
  theme: string; // kelime/bilim teması
  axis: string; // anlatı ekseni
};

export const chapters: Chapter[] = [
  { chapterId: 'ch01-ilk-izler', index: 1, title: 'İlk İzler', range: [1, 20], theme: 'Yazı, sayı, ölçü, tarım', axis: 'Güvenli başlangıç' },
  { chapterId: 'ch02-bilginin-yollari', index: 2, title: 'Bilginin Yolları', range: [21, 40], theme: 'Kağıt, kitap, harita, gözlem', axis: 'Gizli kelime alışkanlığı' },
  { chapterId: 'ch03-bilgelik-evleri', index: 3, title: 'Bilgelik Evleri', range: [41, 60], theme: 'Bağdat, çeviri, matematik', axis: 'Harf çeşitliliği' },
  { chapterId: 'ch04-isik-tip-doga', index: 4, title: 'Işık, Tıp ve Doğa', range: [61, 80], theme: 'Optik, tıp, eczacılık', axis: 'Anlamdan ipucu çıkarma' },
  { chapterId: 'ch05-makineler-gokyuzu', index: 5, title: 'Makineler ve Gökyüzü', range: [81, 100], theme: 'Mekanik, astronomi, saatler', axis: 'Uzun kelimeler ve kesişimler' },
  { chapterId: 'ch06-anadolu-osmanli', index: 6, title: 'Anadolu ve Osmanlı Bilimi', range: [101, 120], theme: 'Haritacılık, rasathane, mimari', axis: 'İleri ana yol finali' },
  { chapterId: 'ch07-matbaa-deney', index: 7, title: 'Matbaanın ve Deneyin Çağı', range: [121, 140], theme: 'Baskı, anatomi, gözlem', axis: 'Yeni bulmaca varyasyonları' },
  { chapterId: 'ch08-enerji-sanayi', index: 8, title: 'Enerji ve Sanayi', range: [141, 160], theme: 'Buhar, elektrik, ulaşım', axis: 'Çok adımlı hedefler' },
  { chapterId: 'ch09-gorunmeyen-dunya', index: 9, title: 'Görünmeyen Dünya', range: [161, 180], theme: 'Mikrop, hücre, atom, genetik', axis: 'Uzman kelime katmanı' },
  { chapterId: 'ch10-hesaplama-iletisim', index: 10, title: 'Hesaplama ve İletişim', range: [181, 200], theme: 'Telgraf, telefon, bilgisayar', axis: 'Desen ve kategori bulmacası' },
  { chapterId: 'ch11-uzay-modern-fizik', index: 11, title: 'Uzay ve Modern Fizik', range: [201, 220], theme: 'Görelilik, kuantum, roket, uydu', axis: 'Zamanlı olmayan uzmanlık' },
  { chapterId: 'ch12-yasamin-gelecegi', index: 12, title: 'Yaşamın Geleceği', range: [221, 240], theme: 'DNA, sağlık, internet, yapay zeka', axis: 'Büyük final ve açık uçlu ustalık' },
];

const byId = new Map(chapters.map((c) => [c.chapterId, c]));

/** levelId'nin ait olduğu bölümü döndürür (240 dışındaki id'ler için son bölüm). */
export function chapterForLevel(levelId: number): Chapter {
  return chapters.find((c) => levelId >= c.range[0] && levelId <= c.range[1]) ?? chapters[chapters.length - 1];
}

/** Seviye verisi açık chapterId taşıyorsa onu, yoksa türetilmişi döndürür. */
export function resolveChapter(levelId: number, chapterId?: string): Chapter {
  if (chapterId && byId.has(chapterId)) return byId.get(chapterId)!;
  return chapterForLevel(levelId);
}

/** Bölüm finali mi? (her 20. seviye) */
export function isChapterFinale(levelId: number): boolean {
  return chapterForLevel(levelId).range[1] === levelId;
}

/** Büyük keşif kartı mı? (Plan §9.2: her 5. seviye) */
export function isBigDiscovery(levelId: number): boolean {
  return levelId % 5 === 0;
}
