/* eslint-env node */
import fs from 'node:fs';
import vm from 'node:vm';

function loadExportedArray(file, exportName) {
  let source = fs.readFileSync(file, 'utf8');
  source = source
    .replace(/^import .*?;\s*/gm, '')
    .replace(/export const (\w+):\s*[\w<>\[\]|,\s]+\s*=/g, 'const $1 =')
    .replace(/const (\w+):\s*[\w<>\[\]|,\s]+\s*=/g, 'const $1 =')
    .replace(/export const initialLevel = .*?;\s*/s, '')
    .replace(/export function [\s\S]*$/, '')
    .replace(/export const (\w+) =/g, 'const $1 =');
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

const levels = loadExportedArray('src/data/levels.ts', 'levels');
const themes = loadExportedArray('src/data/themes.ts', 'themes');
const levelStories = loadExportedArray('src/data/levelStories.ts', 'levelStories');

const storyByLevelId = new Map(levelStories.map((s) => [s.levelId, s]));
const themeById = new Map(themes.map((t) => [t.themeId, t]));

const errors = [];
const warnings = [];

// ─── 1. HARF HAVUZU → HER KELIME ───
console.log('=== 1. HARF HAVUZU KONTROL (harf sayilari dahil) ===');
for (const level of levels) {
  const allWords = [...level.mainWords, ...level.hiddenWords];
  for (const entry of allWords) {
    if (!canBuildWord(entry.word, level.letters)) {
      errors.push(`Level ${level.levelId}: "${entry.word}" (${normalizeWord(entry.word)}) havuzdan [${level.letters.join(',')}] URETILEMIYOR`);
    }
  }
}

// ─── 2. SEVIYELER ARASI KELIME TEKRARI ───
console.log('\n=== 2. SEVIYELER ARASI TEKRAR ===');
const wordToLevel = {};
for (const level of levels) {
  for (const entry of [...level.mainWords, ...level.hiddenWords]) {
    const norm = normalizeWord(entry.word);
    if (!wordToLevel[norm]) wordToLevel[norm] = [];
    wordToLevel[norm].push({ id: level.levelId, word: entry.word, type: level.hiddenWords.includes(entry) ? 'gizli' : 'ana' });
  }
}
for (const [norm, occ] of Object.entries(wordToLevel)) {
  if (occ.length > 1) {
    const details = occ.map(o => `Lv${o.id} (${o.type}: ${o.word})`).join(', ');
    warnings.push(`"${occ[0].word}" birden cok levelde: ${details}`);
  }
}

// ─── 3. AYNI LEVEL ICINDE CIKISMA ───
console.log('\n=== 3. LEVEL ICINDE CIKISMA ===');
for (const level of levels) {
  const seen = new Set();
  for (const entry of [...level.mainWords, ...level.hiddenWords]) {
    const norm = normalizeWord(entry.word);
    if (seen.has(norm)) errors.push(`Level ${level.levelId}: "${entry.word}" ayni level icinde tekrar!`);
    seen.add(norm);
  }
}

// ─── 4. HIKAYE STRING KESME KONTROLÜ ───
console.log('\n=== 4. HIKAYE STRING KESME RISKI ===');
function checkStoryString(value, label) {
  if (!value) return;
  // Check for unescaped single quotes inside single-quoted JS strings
  const lines = fs.readFileSync('src/data/levelStories.ts', 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes("'") && line.includes("'")) {
      const matches = line.match(/'([^']*)'/g);
      if (matches) {
        for (const m of matches) {
          // Count single quotes in the value part
          const inner = m.slice(1, -1);
          if (inner.includes("'")) {
            const storyId = line.match(/levelId:\s*(\d+)/);
            const id = storyId ? storyId[1] : '?';
            errors.push(`Level ${id}: Hikaye metninde kesme isareti JS stringini kiriyor! Satir ${i+1}: ${line.trim().substring(0, 80)}`);
          }
        }
      }
    }
  }
}

// Read stories source to find unescaped quotes
const storiesSource = fs.readFileSync('src/data/levelStories.ts', 'utf8');
const storyLines = storiesSource.split('\n');
for (let i = 0; i < storyLines.length; i++) {
  const line = storyLines[i];
  // Find lines with body/title that have single quotes inside
  if ((line.includes('body:') || line.includes('title:') || line.includes('person:') || line.includes('personInfo:')) && line.includes("'")) {
    // Extract the levelId from nearby lines
    let levelId = '?';
    for (let j = Math.max(0, i-5); j < i; j++) {
      const m = storyLines[j].match(/levelId:\s*(\d+)/);
      if (m) levelId = m[1];
    }
    // Check if there's an unescaped single quote
    const strMatch = line.match(/'([^']*?)'/);
    if (strMatch) {
      const after = line.slice(line.indexOf(strMatch[0]) + strMatch[0].length);
      // If there's content after the closing quote before comma, there's an unescaped quote
      if (!after.trimStart().startsWith(',') && !after.trimStart().startsWith('}') && !after.trimStart().startsWith(')') && after.trim().length > 0) {
        errors.push(`Level ${levelId}: Hikaye satirinda kesme isareti sorunu! Satir ${i+1}: ${line.trim().substring(0, 100)}`);
      }
    }
  }
}

// ─── 5. HIKAYE-KELIME ESLEMESI ───
console.log('\n=== 5. HIKAYE-KELIME TUTARLILIGI ===');
// Level 31: PATIKA seti, hikaye balon icermemeli
const lvl31 = levels.find(l => l.levelId === 31);
if (lvl31) {
  const s31 = storyByLevelId.get(31);
  if (s31) {
    const body = s31.body.toLowerCase();
    if (body.includes('balon') || body.includes('hava') || body.includes('gökyüz')) {
      errors.push(`Level 31: Hikaye hala balon/hava/gokyuzu iceriyor ama kelimeler PATIKA seti!`);
    }
  }
}



// ─── 7. THEME INTEGRITY ───
console.log('\n=== 7. TEMA TUTARLILIGI ===');
for (const level of levels) {
  const theme = themeById.get(level.themeId);
  if (!theme) errors.push(`Level ${level.levelId}: "${level.themeId}" diye bir tema yok`);
}

// ─── 8. STORY INTEGRITY ───
console.log('\n=== 8. HIKAYE VARLIGI ===');
for (const level of levels) {
  const story = storyByLevelId.get(level.levelId);
  if (!story) errors.push(`Level ${level.levelId}: Hikaye kaydi eksik`);
}

// ─── 9. REWARD SANITY ───
console.log('\n=== 9. ODUL KONTROL ===');
for (const level of levels) {
  if (level.reward.baseCoin < 20) errors.push(`Level ${level.levelId}: baseCoin cok dusuk (${level.reward.baseCoin})`);
  if (level.hiddenWords.length === 0 && level.reward.hiddenWordBonus !== 0) {
    errors.push(`Level ${level.levelId}: gizli kelime yokken hiddenWordBonus 0 olmali (${level.reward.hiddenWordBonus})`);
  }
  if (level.hiddenWords.length > 0 && level.reward.hiddenWordBonus < 3) {
    errors.push(`Level ${level.levelId}: hiddenWordBonus cok dusuk (${level.reward.hiddenWordBonus})`);
  }
  for (const hw of level.hiddenWords) {
    if (!hw.reward || hw.reward <= 0) errors.push(`Level ${level.levelId}: "${hw.word}" gizli kelime odulu tanimsiz`);
  }
}

// ─── 10. PLAY STORE POLICY ───
console.log('\n=== 10. POLITIKA TARAMASI ===');
const policyPatterns = [
  { pattern: /\bamk\b/i, label: 'agir kufur' },
  { pattern: /\borosp/i, label: 'agir hakaret' },
  { pattern: /\bpust\b/i, label: 'hakaret' },
  { pattern: /\bpezevenk\b/i, label: 'hakaret' },
  { pattern: /\bkahpe\b/i, label: 'hakaret' },
  { pattern: /\bibne\b/i, label: 'hakaret' },
  { pattern: /\bsiktir\b/i, label: 'agir kufur' },
  { pattern: /\bamcik\b/i, label: 'agir kufur' },
  { pattern: /\bcinayet\b/i, label: 'siddet' },
  { pattern: /\bintihar\b/i, label: 'siddet' },
  { pattern: /\bkatliam\b/i, label: 'siddet' },
  { pattern: /\biskence\b/i, label: 'siddet' },
  { pattern: /\btecavuz\b/i, label: 'cinsel siddet' },
  { pattern: /\buyusturucu\b/i, label: 'uyusturucu' },
  { pattern: /\besrar\b/i, label: 'uyusturucu' },
  { pattern: /\bkokain\b/i, label: 'uyusturucu' },
  { pattern: /\beroin\b/i, label: 'uyusturucu' },
  { pattern: /\birkci\b/i, label: 'ayrimcilik' },
  { pattern: /\bterorist\b/i, label: 'teror' },
  { pattern: /\bfahise\b/i, label: 'mustehcen' },
  { pattern: /\bfaiz\b/i, label: 'hassas' },
  { pattern: /\bborc\b/i, label: 'hassas' },
  { pattern: /\bkumar\b/i, label: 'kumar' },
  { pattern: /\bbahis\b/i, label: 'bahis' },
];

for (const level of levels) {
  const story = storyByLevelId.get(level.levelId);
  if (story) {
    for (const field of ['title', 'body', 'person', 'personInfo']) {
      const val = story[field];
      if (val) {
        const match = policyPatterns.find(p => p.pattern.test(val));
        if (match) errors.push(`Level ${level.levelId}: Hikaye "${field}" alaninda "${match.label}" icerigi: "${val.substring(0, 60)}"`);
      }
    }
  }
  for (const entry of [...level.mainWords, ...level.hiddenWords]) {
    const match = policyPatterns.find(p => p.pattern.test(entry.word) || p.pattern.test(entry.meaning));
    if (match) {
      // Exclude medical context
      if (['kan', 'yara', 'sara', 'hastalik', 'savas'].some(w => entry.meaning?.toLowerCase().includes(w))) continue;
      errors.push(`Level ${level.levelId}: "${entry.word}" anlaminda "${match.label}" eslesmesi`);
    }
  }
}

// ─── 11. LETTER É / ODD CHARS ───
console.log('\n=== 11. GECERSIZ KARAKTER TARAMASI ===');
const validTurkish = /^[A-ZĞİŞÖÜÇI]$/;
for (const level of levels) {
  for (const l of level.letters) {
    if (!validTurkish.test(l.toLocaleUpperCase('tr-TR'))) {
      errors.push(`Level ${level.levelId}: Gecersiz harf '${l}' (U+${l.charCodeAt(0).toString(16)})`);
    }
  }
  for (const entry of [...level.mainWords, ...level.hiddenWords]) {
    for (const ch of entry.word) {
      const upper = ch.toLocaleUpperCase('tr-TR');
      if (!validTurkish.test(upper)) {
        errors.push(`Level ${level.levelId}: "${entry.word}" gecersiz karakter '${ch}' (U+${ch.charCodeAt(0).toString(16)})`);
      }
    }
  }
}

// ─── 12. REWARD PROGRESSION ───
console.log('\n=== 12. ODUL PROGRESYONU ===');
for (let i = 1; i < levels.length; i++) {
  const prev = levels[i - 1];
  const curr = levels[i];
  if (curr.reward.baseCoin <= prev.reward.baseCoin && i > 5) {
    warnings.push(`Level ${curr.levelId}: baseCoin (${curr.reward.baseCoin}) bir oncekinden (${prev.reward.baseCoin}) yuksek degil`);
  }
}

// ─── REPORT ───
console.log(`\n${'='.repeat(50)}`);
if (errors.length > 0) {
  console.log(`\n${errors.length} HATA (yayinlanamaz):`);
  for (const e of errors) console.log(`  ❌ ${e}`);
}
if (warnings.length > 0) {
  console.log(`\n${warnings.length} UYARI (incelenmeli):`);
  for (const w of warnings) console.log(`  ⚠️  ${w}`);
}
if (errors.length === 0) console.log('\n✅ Hata yok, yayinlanabilir.');
console.log(`\n${'='.repeat(50)}`);

process.exit(errors.length > 0 ? 1 : 0);
