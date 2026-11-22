import fs from 'node:fs';

// Target difficulties keyed by levelId -> array of [word, difficulty] in mainWords order.
const TARGET = {
  1:[['ARI',1],['AR',1]],
  2:[['ELMA',1],['LAMA',2],['MALA',2]],
  3:[['KALE',2],['KAL',1],['EL',1]],
  4:[['SÖZ',1],['ÖZ',2],['SÜZ',2]],
  5:[['MERAK',2],['KARE',1],['KREM',1]],
  6:[['DİLEK',2],['DİL',1],['KEDİ',1]],
  7:[['ANLAM',2],['ALAN',2],['MANA',3]],
  8:[['SAHİL',2],['ASİL',3],['HAL',2]],
  9:[['MÜHÜR',3],['HÜR',3],['RUH',2]],
  10:[['KALEM',2],['KELAM',4],['MEAL',3],['ALEM',3]],
  11:[['KÜLTÜR',2],['TÜRK',2],['TÜR',2],['KÜR',3]],
  12:[['TARİH',2],['HARİTA',2],['HATA',2],['HAT',3]],
  13:[['YAYLA',2],['YAYA',2],['AYLA',3],['ALAY',3]],
  14:[['ENDER',3],['DERE',2],['EREN',3]],
  15:[['SARAY',2],['YARA',2],['ARSA',3],['AYAR',3]],
  16:[['KAP',2],['KAPI',1],['KALP',2],['PLAK',3]],
  17:[['BALON',2],['BALO',3],['BOL',2],['OLAN',2]],
  18:[['VADİ',3],['VALİ',3],['ADİL',3],['VİDA',3]],
  19:[['ZEYTİN',2],['YETİ',3],['TİZ',4],['YENİ',1]],
  20:[['DENİZ',2],['ZİNDE',3],['DİZ',2]],
  21:[['TOPRAK',2],['PARK',2],['KART',2],['ROTA',3]],
  22:[['HASAT',3],['ATA',2],['SAHA',2],['HASTA',2]],
  23:[['KİTAP',2],['TAKİP',3],['PATİK',3],['PATİ',2]],
  24:[['DİVAN',3],['NİDA',4],['ANİ',2]],
  25:[['KUBBE',3],['KUL',2],['BEL',2],['BUL',2]],
  26:[['AVLU',3],['ULUS',3],['USUL',3],['SULU',2]],
  27:[['ZİRVE',3],['VERİ',2],['VİZE',2],['VEZİR',4]],
  28:[['TAŞLAR',3],['TAŞRA',4],['TARLA',3],['ŞART',3]],
  29:[['BULUT',2],['BUT',3],['ULU',3]],
  30:[['MASAL',2],['SALMA',3],['ASMA',3],['ALMA',2]],
  31:[['PATİKA',3],['AKİT',4],['ATİK',4],['KAT',2]],
  32:[['RÜZGAR',3],['ZAR',3],['ARZ',4],['GAR',3]],
  33:[['DEĞER',2],['EDER',3],['EĞER',2],['DER',3]],
  34:[['KİTAP',2],['TALİP',4],['KATİP',4],['PİL',2]],
  35:[['DESEN',3],['DENE',2],['SENE',2],['ENSE',3]],
  36:[['IŞIK',2],['ASKI',2],['KISA',2]],
  37:[['OLAY',2],['ONAY',2],['YOL',1],['YONCA',3]],
  38:[['SAAT',2],['SERT',3],['RAST',4],['ART',3]],
  39:[['UMUT',2],['MUTLU',2],['TAM',2],['ALT',2]],
  40:[['MAVİ',2],['AİLE',2],['İVME',4],['VALE',3]],
  41:[['KOKU',2],['KOKLA',3],['OKUL',2],['KOL',2]],
  42:[['SIRA',2],['SAR',3],['SIR',3],['ASIR',4]],
  43:[['ADALET',2],['ALET',3],['TELA',4],['DAL',2]],
  44:[['ZAMAN',2],['AMAN',3],['NAZ',3],['ZAM',3]],
  45:[['SEVİNÇ',3],['SEVİN',3],['EVİN',4],['VİNÇ',3]],
  46:[['CEBİR',3],['İBRE',3],['BİLE',3],['BİR',1]],
  47:[['RAKAM',3],['MARKA',2],['KARA',2],['ARA',2]],
  48:[['DENKLEM',4],['DENK',3],['EMEK',2],['ELEK',3]],
  49:[['SAYMAK',3],['YASAK',2],['MASA',1],['KAYA',2]],
  50:[['YÖNTEM',3],['YÖN',2],['ÖNEM',2],['NET',2]],
  51:[['ŞİFRELİ',4],['ŞİFRE',2],['FİŞ',3],['İLE',1]],
  52:[['HARFLER',3],['HARF',2],['FARE',2],['HER',1]],
  53:[['SIKLIK',4],['KILIK',3],['SIK',2]],
  54:[['ÖRÜNTÜ',4],['ÖRTÜ',3],['TÜR',2]],
  55:[['ANAHTAR',3],['ANA',1],['HAT',3],['NAR',2]],
  56:[['TERCÜME',4],['CÜRET',4],['ÜRET',3],['TER',2]],
  57:[['KİTAPLIK',3],['KİTAP',2],['KAT',2],['KİL',3]],
  58:[['GEOMETRİ',4],['METRE',2],['EMİR',3],['GEMİ',2]],
  59:[['GÖZLEM',3],['ÖZLEM',3],['GÖZ',1],['GEL',1]],
  60:[['MAKİNE',2],['MEKAN',3],['KEMAN',3],['İNEK',2]],
  61:[['PARILTI',4],['ALTI',1],['ARTI',2],['TIR',2]],
  62:[['GÖRMEK',2],['ÖRMEK',3],['KÖR',2],['GÖR',2]],
  63:[['YANSIMA',4],['SAYI',2],['YASA',3],['MAYA',3]],
  64:[['KARANLIK',3],['KALIN',2],['ANLIK',4],['KIR',3]],
  65:[['MERCEK',3],['KEMER',2],['KREM',2]],
  66:[['BELİRTİ',3],['BİLET',2],['BEL',2]],
  67:[['HEKİMLİK',4],['HEKİM',3],['İKLİM',3],['KEMİK',2]],
  68:[['İLAÇLAR',3],['İLAÇ',2],['ARAÇ',2],['LAL',4]],
  69:[['AMELİYAT',5],['AMEL',4],['İMAL',3],['YAMA',3]],
  70:[['REÇETE',3],['TERE',3]],
  71:[['ALETLER',4],['LALE',3],['TEL',2]],
  72:[['BIÇAK',3],['AÇIK',3],['BAK',2],['KAÇ',2]],
  73:[['DİKİŞ',4],['DİŞ',3],['KİŞİ',3]],
  74:[['TEMİZLİK',4],['TEMİZ',3],['LİMİT',4],['ELİT',4]],
  75:[['TEDAVİ',4],['DAVET',4],['VEDA',3],['İADE',3]],
};

const FILES = [
  'src/data/levels.ts',
  'src/data/levels46to50.ts',
  'src/data/levels51to55.ts',
  'src/data/levels56to60.ts',
  'src/data/levels61to65.ts',
  'src/data/levels66to70.ts',
  'src/data/levels71to75.ts',
];

// Match a single word entry line:  { word: 'X', meaning: '...', difficulty: N }
const entryRe = /\{\s*word:\s*'((?:[^'\\]|\\.)*)',\s*meaning:\s*'((?:[^'\\]|\\.)*)',\s*difficulty:\s*(\d+)\s*\}/g;

let totalChanged = 0;
const changes = [];

for (const file of FILES) {
  let src = fs.readFileSync(file, 'utf8');
  // Split into level blocks by "levelId: N"
  const levelIdRe = /levelId:\s*(\d+)/g;
  // We process by finding each levelId and the next, applying entry rewrites within mainWords only.
  // Strategy: iterate matches of levelId, capture the slice up to next levelId, but only the mainWords:[...]
  const matches = [...src.matchAll(levelIdRe)];
  // Build new source by reconstructing per block.
  let out = '';
  let cursor = 0;
  for (let m = 0; m < matches.length; m++) {
    const id = Number(matches[m][1]);
    const blockStart = matches[m].index;
    const blockEnd = m + 1 < matches.length ? matches[m + 1].index : src.length;
    // append text before this block start (from cursor)
    out += src.slice(cursor, blockStart);
    let block = src.slice(blockStart, blockEnd);
    cursor = blockEnd;
    const targets = TARGET[id];
    if (!targets) { out += block; continue; }
    // Operate only within mainWords array of this block.
    const mwStart = block.indexOf('mainWords:');
    const hwStart = block.indexOf('hiddenWords:');
    if (mwStart === -1) { out += block; continue; }
    const sliceEnd = hwStart !== -1 ? hwStart : block.length;
    const before = block.slice(0, mwStart);
    const mwSection = block.slice(mwStart, sliceEnd);
    const after = block.slice(sliceEnd);
    let idx = 0;
    const newMw = mwSection.replace(entryRe, (full, word, meaning, diff) => {
      const t = targets[idx++];
      if (!t) return full;
      const norm = (w) => w.trim().toLocaleUpperCase('tr-TR');
      if (norm(word) !== norm(t[0])) {
        throw new Error(`Level ${id} mainWords order mismatch at index ${idx-1}: file='${word}' target='${t[0]}'`);
      }
      const newDiff = t[1];
      if (Number(diff) !== newDiff) {
        changes.push(`L${id} ${word}: ${diff}→${newDiff}`);
        totalChanged++;
      }
      return full.replace(/difficulty:\s*\d+/, `difficulty: ${newDiff}`);
    });
    if (idx !== targets.length) {
      throw new Error(`Level ${id}: expected ${targets.length} mainWords, matched ${idx}`);
    }
    out += before + newMw + after;
  }
  out += src.slice(cursor);
  fs.writeFileSync(file, out, 'utf8');
}

console.log(`Changed ${totalChanged} difficulty values:`);
for (const c of changes) console.log('  ' + c);
