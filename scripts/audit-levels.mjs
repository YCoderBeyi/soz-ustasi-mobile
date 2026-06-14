import fs from 'node:fs';
import vm from 'node:vm';

/* global console, process */

const MOJIBAKE_PATTERN = /[\u00C3\u00C4\u00C5\uFFFD]/;
const WEAK_SHORT_WORDS = new Set(['IR', 'ÜS', 'MAİ', 'MÜR', 'İDE', 'US']);
const WEAK_OR_RARE_WORDS = new Set([
  'BUKE',
  'KUBE',
  'YOLCUK',
  'YOLAN',
  'MAVİL',
  'FAZ',
  'AZA',
  'ZAF',
  'TERA',
  'ULAM',
  'KULA',
  'OYUL',
  'VIA',
  'REVİ',
  'ALON',
  'AVLUS',
]);
const KNOWN_INVALID_WORDS = new Map([
  ['RÜH', 'Türkçede doğru yazım RUH; mevcut harf havuzunda U olmadığı için bu level yeniden tasarlanmalı.'],
]);
const REQUIRED_DISPLAY_WORDS = new Map([
  ['RUZGAR', 'RÜZGAR'],
  ['DEGER', 'DEĞER'],
  ['EGER', 'EĞER'],
  ['ISIK', 'IŞIK'],
  ['MAVI', 'MAVİ'],
  ['AILE', 'AİLE'],
  ['IM', 'İM'],
  ['SEVINC', 'SEVİNÇ'],
  ['SEVIN', 'SEVİN'],
  ['INCE', 'İNCE'],
  ['CINS', 'CİNS'],
]);
const INFLECTED_OR_WEAK_MAIN_WORDS = new Map([
  ['HALİ', 'Tek başına ana kelime olarak zayıf; HÂL/HAL veya daha doğal bir kök kelime tercih edilmeli.'],
  ['USTASI', 'İyelik eki taşıyor; ana kelime olarak kullanılacaksa level teması bunu bilinçli gerekçelendirmeli.'],
]);
const BANNED_CONTENT_PATTERNS = [
  { pattern: /faiz/iu, label: 'faiz' },
  { pattern: /yarat/iu, label: 'yaratmak kökü' },
  { pattern: /borç/iu, label: 'borç' },
  { pattern: /borc/iu, label: 'borc' },
  { pattern: /kumar/iu, label: 'kumar' },
  { pattern: /bahis/iu, label: 'bahis' },

  { pattern: /amk\b/iu, label: 'argo küfür' },
  { pattern: /orospu/iu, label: 'argo hakaret' },
  { pattern: /puşt/iu, label: 'argo hakaret' },
  { pattern: /pezevenk/iu, label: 'argo hakaret' },
  { pattern: /kahpe/iu, label: 'argo hakaret' },
  { pattern: /ibne/iu, label: 'argo hakaret' },
  { pattern: /siktir/iu, label: 'argo küfür' },
  { pattern: /amcık/iu, label: 'argo küfür' },

  { pattern: /cinayet/iu, label: 'şiddet içeriği' },
  { pattern: /intihar/iu, label: 'şiddet içeriği' },
  { pattern: /katliam/iu, label: 'şiddet içeriği' },
  { pattern: /işkence/iu, label: 'şiddet içeriği' },
  { pattern: /tecavüz/iu, label: 'cinsel saldırı' },

  { pattern: /uyuşturucu/iu, label: 'uyuşturucu' },
  { pattern: /esrar/iu, label: 'uyuşturucu' },
  { pattern: /kokain/iu, label: 'uyuşturucu' },
  { pattern: /eroin/iu, label: 'uyuşturucu' },

  { pattern: /ırkçı/iu, label: 'ayrımcılık' },
  { pattern: /terörist/iu, label: 'terör' },
  { pattern: /fahişe/iu, label: 'müstehcen' },
];

function loadExportedArray(file, exportName) {
  let source = fs.readFileSync(file, 'utf8');
  source = source
    .replace(/^import .*?;\s*/gm, '')
    .replace(new RegExp(`export const ${exportName}: [^=]+ =`), `const ${exportName} =`)
    .replace(/export const initialLevel = .*?;\s*/s, '')
    .replace(/export function [\s\S]*$/, '')
    .replace(/export const themes: [^=]+ =/, 'const themes =');

  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}\nresult = ${exportName};`, context);
  return context.result;
}

function normalizeWord(word) {
  return word
    .trim()
    .toLocaleUpperCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function letterBag(value) {
  return [...normalizeWord(value)].reduce((bag, char) => {
    bag[char] = (bag[char] ?? 0) + 1;
    return bag;
  }, {});
}

function canBuildWord(word, letters) {
  const source = letterBag(letters.join(''));
  const target = letterBag(word);
  return Object.entries(target).every(([char, count]) => (source[char] ?? 0) >= count);
}

function hasMojibake(value) {
  return typeof value === 'string' && MOJIBAKE_PATTERN.test(value);
}

function findBannedContent(value) {
  if (typeof value !== 'string') return null;
  return BANNED_CONTENT_PATTERNS.find(({ pattern }) => pattern.test(value))?.label ?? null;
}

const levels = loadExportedArray('src/data/levels.ts', 'levels');
const themes = loadExportedArray('src/data/themes.ts', 'themes');
const levelStories = loadExportedArray('src/data/levelStories.ts', 'levelStories');
const themeIds = new Set(themes.map((theme) => theme.themeId));
const storyByLevelId = new Map(levelStories.map((story) => [story.levelId, story]));
const errors = [];
const warnings = [];

for (const theme of themes) {
  if (hasMojibake(theme.title)) errors.push(`Theme ${theme.themeId}: title mojibake içeriyor.`);
  if (!fs.existsSync(`public${theme.backgroundImage}`)) {
    errors.push(`Theme ${theme.themeId}: background bulunamadı (${theme.backgroundImage}).`);
  }
}

levels.forEach((level, index) => {
  if (level.levelId !== index + 1) errors.push(`Level ${level.levelId}: sıra ${index + 1} olmalı.`);
  if (!themeIds.has(level.themeId)) errors.push(`Level ${level.levelId}: bilinmeyen themeId ${level.themeId}.`);
  if (level.letters.length < 3 || level.letters.length > 6) {
    errors.push(`Level ${level.levelId}: harf sayısı 3-6 aralığında olmalı.`);
  }
  if (level.mainWords.length < 2) errors.push(`Level ${level.levelId}: en az 2 ana kelime olmalı.`);
  if (level.reward.baseCoin < 20) warnings.push(`Level ${level.levelId}: baseCoin düşük görünüyor.`);
  if (hasMojibake(level.sealId)) errors.push(`Level ${level.levelId}: sealId mojibake içeriyor.`);
  if (level.letters.some(hasMojibake)) errors.push(`Level ${level.levelId}: harf havuzunda mojibake var.`);

  const story = storyByLevelId.get(level.levelId);
  if (!story) {
    errors.push(`Level ${level.levelId}: level sonrası hikaye kartı eksik.`);
  } else {
    const storyBanned = [story.title, story.body, story.person, story.personInfo].map(findBannedContent).find(Boolean);
    if (storyBanned) errors.push(`Level ${level.levelId}: hikaye kartında yasaklı içerik var (${storyBanned}).`);
    if (!story.title || story.title.length < 6) errors.push(`Level ${level.levelId}: hikaye başlığı çok kısa.`);
    if (!story.body || story.body.length < 40) errors.push(`Level ${level.levelId}: hikaye metni çok kısa.`);
    if (story.person && (!story.personInfo || story.personInfo.length < 40)) {
      errors.push(`Level ${level.levelId}: kişi bilgisi eksik veya çok kısa.`);
    }
  }

  const seen = new Set();
  const words = [...level.mainWords, ...level.hiddenWords];
  const levelBanned = [level.story, level.sealId, level.themeId].map(findBannedContent).find(Boolean);
  if (levelBanned) errors.push(`Level ${level.levelId}: level metasında yasaklı içerik var (${levelBanned}).`);

  words.forEach((entry) => {
    const normalized = normalizeWord(entry.word);
    const displayWord = entry.word.toLocaleUpperCase('tr-TR');
    const isMainWord = level.mainWords.includes(entry);

    if (seen.has(normalized)) errors.push(`Level ${level.levelId}: normalize çakışması ${entry.word}.`);
    seen.add(normalized);

    if (hasMojibake(entry.word) || hasMojibake(entry.meaning)) {
      errors.push(`Level ${level.levelId}: ${entry.word} mojibake içeriyor.`);
    }
    const banned = [entry.word, entry.meaning].map(findBannedContent).find(Boolean);
    if (banned) errors.push(`Level ${level.levelId}: ${entry.word} yasaklı içerik içeriyor (${banned}).`);
    if (KNOWN_INVALID_WORDS.has(displayWord)) {
      errors.push(`Level ${level.levelId}: ${displayWord} geçersiz/problemli kelime. ${KNOWN_INVALID_WORDS.get(displayWord)}`);
    }
    if (REQUIRED_DISPLAY_WORDS.has(displayWord) && entry.word !== REQUIRED_DISPLAY_WORDS.get(displayWord)) {
      errors.push(`Level ${level.levelId}: ${entry.word} görünen yazımı hatalı; ${REQUIRED_DISPLAY_WORDS.get(displayWord)} olmalı.`);
    }
    if (!canBuildWord(entry.word, level.letters)) {
      errors.push(`Level ${level.levelId}: ${entry.word} harf havuzundan üretilemiyor.`);
    }
    if (!entry.meaning || entry.meaning.length < 10) {
      errors.push(`Level ${level.levelId}: ${entry.word} anlamı eksik veya çok kısa.`);
    }
    if (entry.word.length <= 2 && isMainWord && index > 3) {
      warnings.push(`Level ${level.levelId}: ${entry.word} iki harfli ana kelime; erken level dışında akışı zayıflatabilir.`);
    }
    if (WEAK_SHORT_WORDS.has(displayWord)) {
      warnings.push(`Level ${level.levelId}: ${displayWord} kısa/zayıf/nadir kelime; içerik onayı gerekir.`);
    }
    if (WEAK_OR_RARE_WORDS.has(displayWord)) {
      errors.push(`Level ${level.levelId}: ${displayWord} yayın kalitesi için zayıf/nadir kelime; daha doğal kelime kullanılmalı.`);
    }
    if (isMainWord && INFLECTED_OR_WEAK_MAIN_WORDS.has(displayWord)) {
      warnings.push(`Level ${level.levelId}: ${displayWord} ana kelime kalitesi zayıf. ${INFLECTED_OR_WEAK_MAIN_WORDS.get(displayWord)}`);
    }
  });

  const mainAverageLength =
    level.mainWords.reduce((sum, entry) => sum + entry.word.length, 0) / level.mainWords.length;
  if (index > 5 && mainAverageLength < 3.5) {
    warnings.push(`Level ${level.levelId}: ilerleyen seviye için ortalama kelime uzunluğu düşük.`);
  }
});

/* ── Crossword buildability ── */

function canBuildCrossword(words) {
  if (words.length < 2) return false;

  const sorted = [...words].sort((a, b) => b.length - a.length);
  const occupied = new Map();
  const placements = [];

  function key(r, c) { return `${r}:${c}`; }
  function pos(p, i) {
    return p.dir === 'across' ? { r: p.r, c: p.c + i } : { r: p.r + i, c: p.c };
  }

  function place(word, r, c, dir) {
    [...word].forEach((ch, i) => {
      const { r: cr, c: cc } = pos({ r, c, dir }, i);
      const k = key(cr, cc);
      if (occupied.has(k)) occupied.get(k).words.push(word);
      else occupied.set(k, { r: cr, c: cc, ch, words: [word] });
    });
    placements.push({ word, r, c, dir });
  }

  place(sorted[0], 0, 0, 'across');

  for (const word of sorted.slice(1)) {
    let placed = false;
    for (let wi = 0; wi < word.length && !placed; wi++) {
      for (const base of placements) {
        const ci = [...base.word].indexOf(word[wi]);
        if (ci === -1) continue;
        const cross = pos(base, ci);
        const dir = base.dir === 'across' ? 'down' : 'across';
        const cand = dir === 'down'
          ? { word, r: cross.r - wi, c: cross.c, dir }
          : { word, r: cross.r, c: cross.c - wi, dir };

        const fits = [...word].every((ch, i) => {
          const { r, c } = pos(cand, i);
          const cell = occupied.get(key(r, c));
          if (!cell) return true;
          if (cell.ch !== ch) return false;
          return cell.words.every((w) => placements.find((p) => p.word === w)?.dir !== cand.dir);
        });

        if (fits) { place(word, cand.r, cand.c, cand.dir); placed = true; break; }
      }
    }
    if (!placed) return false;
  }
  return true;
}

/* ── Additional checks ── */

const poolIndex = {};
levels.forEach((level) => {
  const pool = [...level.letters].sort().join('');
  if (!poolIndex[pool]) poolIndex[pool] = [];
  poolIndex[pool].push(level.levelId);
});

const duplicatePools = Object.entries(poolIndex).filter(([, ids]) => ids.length > 1);
for (const [pool, ids] of duplicatePools) {
  warnings.push(`Seviye ${ids.join(', ')} aynı harf havuzuna sahip (${pool}).`);
}

levels.forEach((level) => {
  if (!canBuildCrossword(level.mainWords.map((w) => w.word))) {
    warnings.push(`Level ${level.levelId}: ana kelimeler bulmaca oluşturamıyor.`);
  }
});

levels.forEach((level, index) => {
  if (index > 0) {
    const prev = levels[index - 1];
    const prevTot = prev.mainWords.reduce((s, w) => s + w.word.length, 0);
    const curTot = level.mainWords.reduce((s, w) => s + w.word.length, 0);
    if (curTot < prevTot - 1 && index > 3) {
      warnings.push(`Level ${level.levelId}: toplam harf yükü bir önceki seviyeden düşük (${curTot} < ${prevTot}).`);
    }
  }
});

if (warnings.length) {
  console.warn(`Level audit warnings (${warnings.length}):`);
  console.warn(warnings.map((warning) => `- ${warning}`).join('\n'));
}

if (errors.length) {
  console.error(`Level audit failed (${errors.length}):`);
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Level audit OK: ${levels.length} level, ${themes.length} theme, ${warnings.length} warning.`);
