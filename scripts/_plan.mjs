// Plan check: honest difficulty values per level, verify guardrails.
const norm = (w) => w.trim().toLocaleUpperCase('tr-TR').normalize('NFD').replace(/[̀-ͯ]/g, '').replaceAll('İ', 'I');
// [letters, [ [word,diff], ... ]]
const L = {
  1:[3,[['ARI',1],['AR',1]]],
  2:[5,[['ELMA',1],['LAMA',2],['MALA',2]]],
  3:[4,[['KALE',2],['KAL',1],['EL',1]]],
  4:[4,[['SÖZ',1],['ÖZ',2],['SÜZ',2]]],
  5:[5,[['MERAK',2],['KARE',1],['KREM',1]]],
  6:[5,[['DİLEK',2],['DİL',1],['KEDİ',1]]],
  7:[5,[['ANLAM',2],['ALAN',2],['MANA',3]]],
  8:[5,[['SAHİL',2],['ASİL',3],['HAL',2]]],
  9:[7,[['MÜHÜR',3],['HÜR',3],['RUH',2]]],
  10:[5,[['KALEM',2],['KELAM',4],['MEAL',3],['ALEM',3]]],
  11:[6,[['KÜLTÜR',2],['TÜRK',2],['TÜR',2],['KÜR',3]]],
  12:[6,[['TARİH',2],['HARİTA',2],['HATA',2],['HAT',3]]],
  13:[5,[['YAYLA',2],['YAYA',2],['AYLA',3],['ALAY',3]]],
  14:[5,[['ENDER',3],['DERE',2],['EREN',3]]],
  15:[5,[['SARAY',2],['YARA',2],['ARSA',3],['AYAR',3]]],
  16:[5,[['KAP',2],['KAPI',1],['KALP',2],['PLAK',3]]],
  17:[5,[['BALON',2],['BALO',3],['BOL',2],['OLAN',2]]],
  18:[5,[['VADİ',3],['VALİ',3],['ADİL',3],['VİDA',3]]],
  19:[6,[['ZEYTİN',2],['YETİ',3],['TİZ',4],['YENİ',1]]],
  20:[5,[['DENİZ',2],['ZİNDE',3],['DİZ',2]]],
  21:[6,[['TOPRAK',2],['PARK',2],['KART',2],['ROTA',3]]],
  22:[5,[['HASAT',3],['ATA',2],['SAHA',2],['HASTA',2]]],
  23:[5,[['KİTAP',2],['TAKİP',3],['PATİK',3],['PATİ',2]]],
  24:[5,[['DİVAN',3],['NİDA',4],['ANİ',2]]],
  25:[6,[['KUBBE',3],['KUL',2],['BEL',2],['BUL',2]]],
  26:[6,[['AVLU',3],['ULUS',3],['USUL',3],['SULU',2]]],
  27:[5,[['ZİRVE',3],['VERİ',2],['VİZE',2],['VEZİR',4]]],
  28:[6,[['TAŞLAR',3],['TAŞRA',4],['TARLA',3],['ŞART',3]]],
  29:[5,[['BULUT',2],['BUT',3],['ULU',3]]],
  30:[5,[['MASAL',2],['SALMA',3],['ASMA',3],['ALMA',2]]],
  31:[6,[['PATİKA',3],['AKİT',4],['ATİK',4],['KAT',2]]],
  32:[6,[['RÜZGAR',3],['ZAR',3],['ARZ',4],['GAR',3]]],
  33:[5,[['DEĞER',2],['EDER',3],['EĞER',2],['DER',3]]],
  34:[6,[['KİTAP',2],['TALİP',4],['KATİP',4],['PİL',2]]],
  35:[5,[['DESEN',3],['DENE',2],['SENE',2],['ENSE',3]]],
  36:[6,[['IŞIK',2],['ASKI',2],['KISA',2]]],
  37:[6,[['OLAY',2],['ONAY',2],['YOL',1],['YONCA',3]]],
  38:[6,[['SAAT',2],['SERT',3],['RAST',4],['ART',3]]],
  39:[6,[['UMUT',2],['MUTLU',2],['TAM',2],['ALT',2]]],
  40:[6,[['MAVİ',2],['AİLE',2],['İVME',4],['VALE',3]]],
  41:[6,[['KOKU',2],['KOKLA',3],['OKUL',2],['KOL',2]]],
  42:[4,[['SIRA',2],['SAR',3],['SIR',3],['ASIR',4]]],
  43:[6,[['ADALET',2],['ALET',3],['TELA',4],['DAL',2]]],
  44:[5,[['ZAMAN',2],['AMAN',3],['NAZ',3],['ZAM',3]]],
  45:[6,[['SEVİNÇ',3],['SEVİN',3],['EVİN',4],['VİNÇ',3]]],
  46:[7,[['CEBİR',3],['İBRE',3],['BİLE',3],['BİR',1]]],
  47:[5,[['RAKAM',3],['MARKA',2],['KARA',2],['ARA',2]]],
  48:[7,[['DENKLEM',4],['DENK',3],['EMEK',2],['ELEK',3]]],
  49:[6,[['SAYMAK',3],['YASAK',2],['MASA',1],['KAYA',2]]],
  50:[6,[['YÖNTEM',3],['YÖN',2],['ÖNEM',2],['NET',2]]],
  51:[7,[['ŞİFRELİ',4],['ŞİFRE',2],['FİŞ',3],['İLE',1]]],
  52:[7,[['HARFLER',3],['HARF',2],['FARE',2],['HER',1]]],
  53:[6,[['SIKLIK',4],['KILIK',3],['SIK',2]]],
  54:[6,[['ÖRÜNTÜ',4],['ÖRTÜ',3],['TÜR',2]]],
  55:[7,[['ANAHTAR',3],['ANA',1],['HAT',3],['NAR',2]]],
  56:[7,[['TERCÜME',4],['CÜRET',4],['ÜRET',3],['TER',2]]],
  57:[8,[['KİTAPLIK',3],['KİTAP',2],['KAT',2],['KİL',3]]],
  58:[8,[['GEOMETRİ',4],['METRE',2],['EMİR',3],['GEMİ',2]]],
  59:[6,[['GÖZLEM',3],['ÖZLEM',3],['GÖZ',1],['GEL',1]]],
  60:[6,[['MAKİNE',2],['MEKAN',3],['KEMAN',3],['İNEK',2]]],
  61:[7,[['PARILTI',4],['ALTI',1],['ARTI',2],['TIR',2]]],
  62:[6,[['GÖRMEK',2],['ÖRMEK',3],['KÖR',2],['GÖR',2]]],
  63:[7,[['YANSIMA',4],['SAYI',2],['YASA',3],['MAYA',3]]],
  64:[8,[['KARANLIK',3],['KALIN',2],['ANLIK',4],['KIR',3]]],
  65:[6,[['MERCEK',3],['KEMER',2],['KREM',2]]],
  66:[7,[['BELİRTİ',3],['BİLET',2],['BEL',2]]],
  67:[8,[['HEKİMLİK',4],['HEKİM',3],['İKLİM',3],['KEMİK',2]]],
  68:[7,[['İLAÇLAR',3],['İLAÇ',2],['ARAÇ',2],['LAL',4]]],
  69:[8,[['AMELİYAT',5],['AMEL',4],['İMAL',3],['YAMA',3]]],
  70:[6,[['REÇETE',3],['TERE',3]]],
  71:[7,[['ALETLER',4],['LALE',3],['TEL',2]]],
  72:[5,[['BIÇAK',3],['AÇIK',3],['BAK',2],['KAÇ',2]]],
  73:[5,[['DİKİŞ',4],['DİŞ',3],['KİŞİ',3]]],
  74:[8,[['TEMİZLİK',4],['TEMİZ',3],['LİMİT',4],['ELİT',4]]],
  75:[6,[['TEDAVİ',4],['DAVET',4],['VEDA',3],['İADE',3]]],
};
function dscore(letters, words) {
  const ad = words.reduce((s, w) => s + w[1], 0) / words.length;
  const al = words.reduce((s, w) => s + norm(w[0]).length, 0) / words.length;
  return letters * 1.2 + words.length * 1.5 + al * 1.8 + ad * 2;
}
const ids = Object.keys(L).map(Number).sort((a,b)=>a-b);
const avgDiffRange = (from,to) => {
  let s=0,n=0;
  for(const id of ids) if(id>=from&&id<=to) for(const w of L[id][1]){s+=w[1];n++;}
  return s/n;
};
console.log('avg(L1-5)=', avgDiffRange(1,5).toFixed(3), '(<=2)');
console.log('avg(L71-75)=', avgDiffRange(71,75).toFixed(3), '(>=3)');
const chap=[];
for(let c=0;c<5;c++){
  let s=0;for(let i=0;i<15;i++){const id=c*15+i+1;s+=dscore(L[id][0],L[id][1]);}
  chap.push(s/15);
}
console.log('chapters dscore:', chap.map(c=>c.toFixed(2)).join(', '));
console.log('last>first:', chap.at(-1)>chap[0]);
for(let i=1;i<chap.length;i++)console.log(`  chap[${i}]+1>=chap[${i-1}]:`,(chap[i]+1>=chap[i-1]).toString(),`(${chap[i].toFixed(2)} vs ${chap[i-1].toFixed(2)})`);
for(let c=0;c<5;c++){let s=0,n=0;for(let i=0;i<15;i++){for(const w of L[c*15+i+1][1]){s+=w[1];n++;}}console.log(`chapter ${c+1} avgDiff=${(s/n).toFixed(3)}`);}
