/* ts-check */
import { levels } from '../src/data/levels.js';
import { buildCrosswordLayout } from '../src/game/crossword.js';
import { getLevelStory } from '../src/data/levelStories.js';
import { getTheme } from '../src/data/themes.js';
import { normalizeWord } from '../src/game/normalize.js';
import { shuffleArray } from '../src/game/shuffle.js';
import { loadPlayerSave } from '../src/game/playerSave.js';

let pass = 0, fail = 0;
function check(label, cond, detail) {
  if (cond) { pass++; }
  else { fail++; console.log('FAIL: ' + label + (detail ? ' — ' + detail : '')); }
}

// 1. Crossword layout all 45 levels
for (const l of levels) {
  const all = [...l.mainWords, ...l.hiddenWords];
  const layout = buildCrosswordLayout(all, l.letterPool);
  check('L' + l.levelId + ' layout', layout !== null, 'null layout');
  if (layout) {
    const filled = layout.grid.flat().filter(c => c !== null).length;
    check('L' + l.levelId + ' grid', filled > 0, 'empty grid');
  }
  check('L' + l.levelId + ' story', !!(getLevelStory(l.levelId)), 'missing story');
  check('L' + l.levelId + ' theme', !!(getTheme(l.themeId)), 'missing themeId=' + l.themeId);
}

// 2. normalizeWord edge cases
const normCases = ['', 'İ', 'I', 'Ğ', 'Ü', 'Ç', 'Ş', 'Ö', 'i', 'ğ', 'ü', 'ç', 'ş', 'ö'];
for (const t of normCases) {
  const r = normalizeWord(t);
  check('normalizeWord("' + t + '")', r !== '', 'empty result');
}
check('normalizeWord("İ")', normalizeWord('İ') === 'I', 'İ→I');
check('normalizeWord("Ş")', normalizeWord('Ş') === 'S', 'Ş→S');
check('normalizeWord("Ç")', normalizeWord('Ç') === 'C', 'Ç→C');
check('normalizeWord("Ü")', normalizeWord('Ü') === 'U', 'Ü→U');
check('normalizeWord("Ö")', normalizeWord('Ö') === 'O', 'Ö→O');
check('normalizeWord("Ğ")', normalizeWord('Ğ') === 'G', 'Ğ→G');

// 3. shuffleArray
shuffleArray([]);
check('shuffleArray([]) OK', true);
shuffleArray([1]);
check('shuffleArray([1]) OK', true);
const b = [1,2,3,4,5]; const orig = [...b]; shuffleArray(b);
b.sort();
check('shuffleArray preserves elements', JSON.stringify(b) === JSON.stringify(orig));

// 4. crossword empty
const r = buildCrosswordLayout([], []);
check('crossword([],[]) null', r === null);

// 5. playerSave
localStorage.clear();
const save = loadPlayerSave();
check('save not null', !!save);
const required = ['version','currentLevelId','coins','completedLevels','awardedLevels','collectedWords','favoriteWords','soundEnabled','hapticsEnabled','levelMastery','ownedShopItems','hintsRemaining','coinMultiplier'];
for (const f of required) check('save.' + f, f in save, 'missing');
check('save.favoriteWords is array', Array.isArray(save.favoriteWords));
check('save.default coins', save.coins === 120, 'got ' + save.coins);

// 6. Coins monotonic
let prev = -1;
for (const l of levels) {
  check('L' + l.levelId + ' coin=' + l.reward.baseCoin, l.reward.baseCoin > prev, '<= ' + prev);
  prev = l.reward.baseCoin;
}

// 7. hiddenWordBonus monotonic
prev = -1;
for (const l of levels) {
  check('L' + l.levelId + ' bonus=' + l.reward.hiddenWordBonus, l.reward.hiddenWordBonus >= prev, '< ' + prev);
  prev = l.reward.hiddenWordBonus;
}

// 8. All level IDs sequential
for (let i = 0; i < levels.length; i++) {
  check('L' + (i+1) + ' id=' + levels[i].levelId, levels[i].levelId === i + 1, 'expected L' + (i+1));
}

// 9. All mainWords have unique normalize forms per level
for (const l of levels) {
  const normals = l.mainWords.map(w => normalizeWord(w.word));
  check('L' + l.levelId + ' unique main words', new Set(normals).size === normals.length);
}

// 10. No hidden word duplicates main words per level
for (const l of levels) {
  const mainNorms = new Set(l.mainWords.map(w => normalizeWord(w.word)));
  for (const h of l.hiddenWords) {
    check('L' + l.levelId + ' hidden "' + h.word + '" not in main', !mainNorms.has(normalizeWord(h.word)));
  }
}

// 11. Each level has at least 2 main words
for (const l of levels) {
  check('L' + l.levelId + ' >=2 main', l.mainWords.length >= 2, 'has ' + l.mainWords.length);
}

// 12. Each level has at least 3 letters in pool
for (const l of levels) {
  check('L' + l.levelId + ' pool >=3', l.letterPool.length >= 3, 'has ' + l.letterPool.length);
}

// 13. Story text exists for levels 31-45 (inline stories)
// Check the level data itself for story field

console.log('\n');
console.log('Pass: ' + pass + ' / Fail: ' + fail);
if (fail > 0) process.exit(1);
else console.log('ALL CHECKS PASSED');
