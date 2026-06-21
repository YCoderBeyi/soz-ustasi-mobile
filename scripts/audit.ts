/* eslint-disable */
// @ts-nocheck
import { levels } from '../src/data/levels';

function normalizeWord(word: string): string {
  return word
    .trim()
    .toLocaleUpperCase('tr-TR')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function letterBag(value: string): Record<string, number> {
  return [...normalizeWord(value)].reduce((bag: Record<string, number>, char) => {
    bag[char] = (bag[char] ?? 0) + 1;
    return bag;
  }, {});
}

function canBuildWord(word: string, letters: string[]): boolean {
  const source = letterBag(letters.join(''));
  const target = letterBag(word);
  return Object.entries(target).every(([char, count]) => (source[char] ?? 0) >= count);
}

const errors: string[] = [];
const warnings: string[] = [];

// ─── 1. HARF HAVUZU → HER KELIME ───
for (const level of levels) {
  const allWords = [...level.mainWords, ...level.hiddenWords];
  for (const entry of allWords) {
    if (!canBuildWord(entry.word, level.letters)) {
      errors.push(`L${level.levelId}: "${entry.word}" havuzdan [${level.letters.join(',')}] ÜRETİLEMİYOR`);
    }
  }
}

// ─── 2. SEVIYELER ARASI TEKRAR ───
const wordToLevel: Record<string, { id: number; word: string; type: string }[]> = {};
for (const level of levels) {
  for (const entry of [...level.mainWords, ...level.hiddenWords]) {
    const norm = normalizeWord(entry.word);
    if (!wordToLevel[norm]) wordToLevel[norm] = [];
    const type = level.hiddenWords.includes(entry) ? 'gizli' : 'ana';
    wordToLevel[norm].push({ id: level.levelId, word: entry.word, type });
  }
}
for (const [, occ] of Object.entries(wordToLevel)) {
  if (occ.length > 1) {
    const details = occ.map(o => `L${o.id}(${o.type})`).join(', ');
    warnings.push(`"${occ[0].word}" birden çok seviyede: ${details}`);
  }
}

// ─── 3. AYNI SEVİYE İÇİNDE TEKRAR ───
for (const level of levels) {
  const seen = new Set<string>();
  for (const entry of [...level.mainWords, ...level.hiddenWords]) {
    const norm = normalizeWord(entry.word);
    if (seen.has(norm)) errors.push(`L${level.levelId}: "${entry.word}" aynı seviyede tekrar`);
    seen.add(norm);
  }
}

// ─── 4. ÖDÜL TUTARLILIĞI ───
for (const level of levels) {
  if (level.reward.baseCoin < 20) errors.push(`L${level.levelId}: baseCoin çok düşük (${level.reward.baseCoin})`);
  if (level.hiddenWords.length === 0 && level.reward.hiddenWordBonus !== 0) {
    errors.push(`L${level.levelId}: gizli kelime yok ama hiddenWordBonus=${level.reward.hiddenWordBonus} (0 olmalı)`);
  }
  if (level.hiddenWords.length > 0 && level.reward.hiddenWordBonus < 3) {
    errors.push(`L${level.levelId}: hiddenWordBonus çok düşük (${level.reward.hiddenWordBonus})`);
  }
  for (const hw of level.hiddenWords) {
    if (!hw.reward || hw.reward <= 0)
      errors.push(`L${level.levelId}: "${hw.word}" gizli kelime ödülü tanımsız`);
  }
}

// ─── 5. GEÇERSİZ KARAKTER ───
const validTurkish = /^[A-ZĞİŞÖÜÇI]$/;
for (const level of levels) {
  for (const l of level.letters) {
    if (!validTurkish.test(l.toLocaleUpperCase('tr-TR'))) {
      errors.push(`L${level.levelId}: geçersiz harf '${l}'`);
    }
  }
  for (const entry of [...level.mainWords, ...level.hiddenWords]) {
    for (const ch of entry.word) {
      if (!validTurkish.test(ch.toLocaleUpperCase('tr-TR'))) {
        errors.push(`L${level.levelId}: "${entry.word}" geçersiz karakter '${ch}'`);
      }
    }
  }
}

// ─── 6. ÖDÜL PROGRESYONU ───
for (let i = 1; i < levels.length; i++) {
  const prev = levels[i - 1];
  const curr = levels[i];
  if (curr.reward.baseCoin <= prev.reward.baseCoin && i > 5) {
    warnings.push(`L${curr.levelId}: baseCoin(${curr.reward.baseCoin}) ≤ önceki(${prev.reward.baseCoin})`);
  }
}

// ─── RAPOR ───
const sep = '='.repeat(60);
console.log(sep);
console.log(`Toplam seviye: ${levels.length}`);
console.log(sep);

if (errors.length > 0) {
  console.log(`\n❌ ${errors.length} HATA:`);
  for (const e of errors) console.log(`  • ${e}`);
}
if (warnings.length > 0) {
  console.log(`\n⚠️  ${warnings.length} UYARI:`);
  for (const w of warnings) console.log(`  • ${w}`);
}
if (errors.length === 0 && warnings.length === 0) {
  console.log('\n✅ Temiz — hata ve uyarı yok.');
} else if (errors.length === 0) {
  console.log('\n✅ Kritik hata yok.');
}
console.log(sep);

process.exit(errors.length > 0 ? 1 : 0);
