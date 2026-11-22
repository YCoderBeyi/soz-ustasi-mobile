/**
 * Editorial allowlist for the endless route. Every target must also have a
 * reviewed meaning in bonusDictionary; the list itself never invents words.
 */
export const EASY_ENDLESS_WORDS = [
  'AÇI', 'ADA', 'ADET', 'AİLE', 'AKIL', 'AKIŞ', 'AKOR', 'ALAN', 'ALET', 'ALT', 'ALTI',
  'ANA', 'ANI', 'ARA', 'ARALIK', 'ARI', 'ARKA', 'ARMA', 'ASMA', 'AŞI', 'AŞIK', 'AŞK',
  'ATA', 'ATKI', 'AYA', 'AYAK', 'AYNI', 'BAL', 'BALIK', 'BEL', 'BİLE', 'BİR', 'BULUT',
  'DAL', 'DENİZ', 'DERE', 'DEV', 'DELİK', 'DİL', 'DOST', 'ELMA', 'EMEK', 'EMİN', 'ETKİ',
  'EVLİ', 'GERİ', 'GÖL', 'GÜL', 'GÜNEŞ', 'GÜZ', 'HAL', 'HAN', 'HEM', 'ISI', 'İKİ', 'İKİZ',
  'İKLİM', 'İLE', 'İLERİ', 'İLK', 'İLKE', 'İLİM', 'KALP', 'KAN', 'KANAL', 'KAP', 'KAPI',
  'KAR', 'KARA', 'KARIN', 'KARLI', 'KAS', 'KAT', 'KATI', 'KEDİ', 'KEK', 'KEZ', 'KIL',
  'KIRK', 'KIŞ', 'KİLİM', 'KİM', 'KİTAP', 'KÖPEK', 'KÖY', 'KULAK', 'KULE', 'KUM', 'KUZU',
  'KÜL', 'LAMA', 'LAV', 'LİMON', 'LİRA', 'LİSTE', 'LİTRE', 'MAKAS', 'MAL', 'MASA', 'MAVİ',
  'MAYA', 'MOR', 'NAR', 'NEHİR', 'NEM', 'NET', 'NİYE', 'ODA', 'OBA', 'OLUK', 'ORAK', 'ORMAN',
  'ORTA', 'ORTAK', 'OYUN', 'ÖTE', 'ÖZEL', 'ÖZLEM', 'PENCERE', 'RAF', 'RAHAT', 'RENK', 'SABAH',
  'SAL', 'SALAM', 'SERA', 'SES', 'SET', 'SIKI', 'SOKAK', 'SÜT', 'ŞAL', 'ŞIK', 'ŞİİR', 'TAKI',
  'TAKİP', 'TAM', 'TAN', 'TAŞ', 'TEK', 'TEL', 'TEZ', 'TIP', 'TİLKİ', 'TİP', 'TOKA', 'TOP',
  'TULUM', 'TÜM', 'TÜR', 'TÜRKÜ', 'ULU', 'ÜTÜ', 'VADE', 'VEDA', 'YAMA', 'YAN', 'YASA', 'YAĞMUR',
  'YAY', 'YAZ', 'YEL', 'YEM', 'YEN', 'YILDIZ', 'YİNE', 'YOL', 'YUMURTA', 'ZEYTİN', 'ZEKİ',
  'ARABA', 'BİLET', 'CEKET', 'DUVAR', 'FİDAN', 'GÖLGE', 'KAVUN', 'KİRAZ', 'KİTAP', 'KUTU',
  'MUTLU', 'PASTA', 'PİLAV', 'PLAJ', 'POŞET', 'ŞAPKA', 'TARLA', 'TABAK', 'TREN', 'YÜZÜK',
  // Familiar, meaning-reviewed terms widen the generated route without
  // allowing the generator to invent vocabulary or definitions.
  'KREMA', 'DELİK', 'İLKE', 'ANMA', 'ISLAH', 'UMUR', 'RENDE', 'ARYA', 'KALIP',
  'AKORT', 'KITA', 'SUAL', 'ARZU', 'NEŞE', 'LONCA', 'ATEŞ', 'ALEV', 'ADALET',
  'NAMAZ', 'İNCE', 'KAHVE', 'AĞAÇ', 'ÇİÇEK', 'AYVA', 'EKMEK', 'ÇANTA', 'ÇORAP',
  'GÖMLEK', 'AYNA', 'ÇOCUK', 'FİNCAN', 'FIRÇA', 'HEDİYE', 'KOLTUK', 'MAHALLE',
  'SANDALYE', 'YASTIK',
] as const;
