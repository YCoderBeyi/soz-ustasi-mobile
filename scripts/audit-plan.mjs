/**
 * audit-plan.mjs — Plan Uyum Denetimi
 *
 * `audit:levels` teknik geçerliliği kontrol eder (üretilebilirlik, normalize, yasaklı içerik).
 * Bu araç ise ana yolculuğu PLAN sözleşmesine göre ölçer:
 *   vault/07-Production/Soz-Ustasi-240-Level-Learning-Journey-Master-Plan-v1.md
 *
 * Kontrol edilen kurallar:
 *   Runtime zorluk eğrisi: her 5 seviyede en az bir nefes seviyesi; ani yükseliş <= 4
 *   §6.4  Ana kelime tekrar mesafesi >= 40; gizli kelime tekrar mesafesi >= 20
 *   §6.2  Gizli kelime alışkanlığı (gizli kelimesiz seviye taraması)
 *   §5/§9 Keşif kartı sözleşmesi (impact / today / sourceNotes / contentReviewStatus)
 *   §18.1 Katalog büyüklüğü hedefi
 * Zorluk puanı doğrudan src/game/difficulty.ts içindeki oyun motorundan alınır.
 *
 * Çıkış: varsayılan 0 (bilgilendirme). `--strict` ile ihlal varsa 1 döner.
 */
import fs from 'node:fs';
import vm from 'node:vm';

/* global console, process */

const TARGET_CATALOG = 240; // ana yolculuk hedefi (yakın hedef 46-120)

function loadLevels() {
  const modules = [
    ['src/data/levels46to50.ts', 'levels46to50'],
    ['src/data/levels51to55.ts', 'levels51to55'],
    ['src/data/levels56to60.ts', 'levels56to60'],
    ['src/data/levels61to65.ts', 'levels61to65'],
    ['src/data/levels66to70.ts', 'levels66to70'],
    ['src/data/levels71to75.ts', 'levels71to75'],
  ];
  const authored = modules.map(([file, name]) => (
    fs.readFileSync(file, 'utf8')
      .replace(/^import .*?;\s*/gm, '')
      .replace(new RegExp(`export const ${name}: LevelData\\[\\] =`), `const ${name} =`)
  )).join('\n');
  const base = fs.readFileSync('src/data/levels.ts', 'utf8')
    .replace(/^import .*?;\s*/gm, '')
    .replace(/const baseLevels: LevelData\[\] =/, 'const baseLevels =')
    .replace(/export const levels: LevelData\[\] =[\s\S]*$/, '');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${authored}\n${base}\nresult = [...baseLevels, ...authoredMasteryLevels];`, ctx);
  return ctx.result;
}

function loadStories() {
  const baseSrc = fs.readFileSync('src/data/levelStories.ts', 'utf8')
    .replace(/^import .*?;\s*/gm, '')
    .replace(/const baseLevelStories: LevelStory\[\] =/, 'const baseLevelStories =')
    .replace(/export const levelStories:[\s\S]*$/, '');
  const ctx = {};
  vm.createContext(ctx);
  vm.runInContext(`${baseSrc}\nresult = baseLevelStories;`, ctx);
  const base = ctx.result;
  const authored = [
    ['src/data/levelStories46to50.ts', 'levelStories46to50'],
    ['src/data/levelStories51to55.ts', 'levelStories51to55'],
    ['src/data/levelStories56to60.ts', 'levelStories56to60'],
    ['src/data/levelStories61to65.ts', 'levelStories61to65'],
    ['src/data/levelStories66to70.ts', 'levelStories66to70'],
    ['src/data/levelStories71to75.ts', 'levelStories71to75'],
  ].flatMap(([file, name]) => {
    const src = fs.readFileSync(file, 'utf8')
      .replace(/^import .*?;\s*/gm, '')
      .replace(new RegExp(`export const ${name}: LevelStory\\[\\] =`), `const ${name} =`);
    const c = {};
    vm.createContext(c);
    vm.runInContext(`${src}\nresult = ${name};`, c);
    return c.result;
  });
  return [...base, ...authored];
}

// Keep Turkish letters distinct, matching src/game/normalize.ts.
const norm = (w) => w.trim().normalize('NFC').toLocaleUpperCase('tr-TR').normalize('NFC');

// Load the runtime score directly so this report cannot drift from gameplay.
function loadRuntimeDifficulty() {
  const source = fs.readFileSync('src/game/difficulty.ts', 'utf8')
    .replace(/^import .*?;\s*/gm, '')
    .replace(/: Pick<LevelData, [^>]+>/, '')
    .replace(/\): number/, ')')
    .replace(/export function /g, 'function ');
  const context = {};
  vm.createContext(context);
  vm.runInContext(`${source}\nresult = levelDifficulty;`, context);
  return context.result;
}

const score = loadRuntimeDifficulty();

const levels = loadLevels().slice().sort((a, b) => a.levelId - b.levelId);
const stories = loadStories();
const storyById = new Map(stories.map((s) => [s.levelId, s]));
const scored = levels.map((l) => ({ id: l.levelId, s: score(l), l }));

const findings = { critical: [], major: [], minor: [] };

const breathMisses = [];
for (let start = 0; start + 5 <= scored.length; start += 5) {
  const block = scored.slice(start, start + 5).map((item) => item.s);
  const average = block.reduce((sum, value) => sum + value, 0) / block.length;
  const lowest = Math.min(...block);
  if (average - lowest < 1) breathMisses.push(`L${start + 1}-${start + 5}`);
}
if (breathMisses.length) findings.critical.push(`Runtime zorlukta nefes aralığı eksik: ${breathMisses.join(', ')}`);

const upwardWalls = [];
for (let index = 1; index < scored.length; index += 1) {
  const step = scored[index].s - scored[index - 1].s;
  if (step > 4) upwardWalls.push(`L${scored[index].id} (+${step.toFixed(1)})`);
}
if (upwardWalls.length) findings.critical.push(`Runtime zorlukta ani yükseliş (>4): ${upwardWalls.join(', ')}`);

const mainLast = new Map(); const mainRep = [];
const hidLast = new Map(); const hidRep = [];
for (const { id, l } of scored) {
  for (const w of l.mainWords) { const n = norm(w.word); if (mainLast.has(n) && id - mainLast.get(n) < 40) mainRep.push(`${w.word} (L${mainLast.get(n)}→L${id}, mesafe ${id - mainLast.get(n)})`); mainLast.set(n, id); }
  for (const w of l.hiddenWords) { const n = norm(w.word); if (hidLast.has(n) && id - hidLast.get(n) < 20) hidRep.push(`${w.word} (L${hidLast.get(n)}→L${id}, mesafe ${id - hidLast.get(n)})`); hidLast.set(n, id); }
}
if (mainRep.length) findings.critical.push(`§6.4 ana kelime <40 seviye tekrarı (${mainRep.length}): ${mainRep.join(', ')}`);
if (hidRep.length) findings.critical.push(`§6.4 gizli kelime <20 seviye tekrarı (${hidRep.length}): ${hidRep.join(', ')}`);

// §5/§9 keşif kartı sözleşmesi (tip artık impact/today/sourceNotes/contentReviewStatus destekliyor)
const cardGaps = [];
let missingImpactToday = 0;
let unapproved = 0;
for (const { id } of scored) {
  const st = storyById.get(id);
  if (!st) { cardGaps.push(`L${id}`); continue; }
  if (!st.impact || !st.today) missingImpactToday++;
  if (st.contentReviewStatus !== 'approved') unapproved++;
}
if (cardGaps.length) findings.critical.push(`§5 Eksik keşif kartı: ${cardGaps.join(', ')}`);
if (missingImpactToday) findings.major.push(`§9.1 ${missingImpactToday}/${scored.length} kartta "impact" (Neden önemli?) ve/veya "today" (Bugün nerede?) içeriği yok — yapısal alanlar hazır, editoryal içerik borcu.`);
if (unapproved) findings.minor.push(`§16.3 ${unapproved}/${scored.length} kart contentReviewStatus='approved' değil — içerik onay izlenmiyor.`);

// §6.2 gizli kelimesiz
const noHidden = scored.filter(({ l }) => l.hiddenWords.length === 0).map((x) => x.id);
if (noHidden.length) findings.minor.push(`§6.2 gizli kelimesi olmayan seviyeler: ${noHidden.join(', ')} (L1 girişte kabul)`);

// §18.1 katalog büyüklüğü
if (levels.length < TARGET_CATALOG) findings.major.push(`§18.1 Katalog ${levels.length}/${TARGET_CATALOG} seviye. Eksik ana yol içeriği: ${TARGET_CATALOG - levels.length}.`);

// tema dağılımı (bilgi)
const themeCount = {};
for (const { l } of scored) themeCount[l.themeId] = (themeCount[l.themeId] ?? 0) + 1;

// ---- Rapor ----
const line = '─'.repeat(60);
console.log(`${line}\nPLAN UYUM DENETİMİ — ${levels.length} seviye\n${line}`);
console.log(`Tema dağılımı: ${JSON.stringify(themeCount)}\n`);
for (const [sev, label] of [['critical', '🔴 KRİTİK'], ['major', '🟠 ÖNEMLİ'], ['minor', '🟡 İKİNCİL']]) {
  console.log(`${label} (${findings[sev].length})`);
  if (!findings[sev].length) console.log('  (yok)');
  else findings[sev].forEach((f) => console.log(`  - ${f}`));
  console.log('');
}
const total = findings.critical.length + findings.major.length + findings.minor.length;
console.log(`${line}\nÖZET: ${findings.critical.length} kritik, ${findings.major.length} önemli, ${findings.minor.length} ikincil\n${line}`);

if (process.argv.includes('--strict') && findings.critical.length) process.exit(1);
