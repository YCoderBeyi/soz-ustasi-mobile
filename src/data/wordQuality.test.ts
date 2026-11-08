import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { normalizeWord } from '../game/normalize';
import { levels } from './levels';

// Single source of truth for "is this word fair to require?": vault/07-Production/word-quality-v1.
// A word is approved only when two independent reviews both rated it A (everyday) or B (known by most adults).
const dir = 'vault/07-Production/word-quality-v1';
const approved = new Set(
  (JSON.parse(readFileSync(`${dir}/approved-words.json`, 'utf8')) as { words: string[] }).words.map(normalizeWord),
);
const tiers = (JSON.parse(readFileSync(`${dir}/word-tiers.json`, 'utf8')) as { tiers: Record<string, string> }).tiers;
// Levels allowed to require more than one B-rated word. Each needs a reason; the test insists the list stays honest.
const MORE_THAN_ONE_B_ALLOWED: Record<number, string> = {
  10: 'Pool KALEM has no other safe word, and easing it would flatten the 6-10 block below the breather rule.',
};
const valuesExceptions = JSON.parse(readFileSync(`${dir}/values-exceptions.json`, 'utf8')) as Record<string, string>;
const denied = new Set(
  Object.values(
    JSON.parse(readFileSync('vault/07-Production/bonus-lexicon-v1/denied-by-values.json', 'utf8')) as Record<string, string[]>,
  ).flat().map(normalizeWord),
);

const authored = levels.flatMap((level) => [
  ...level.mainWords.map((entry) => ({ level: level.levelId, role: 'ana', word: entry.word })),
  ...level.hiddenWords.map((entry) => ({ level: level.levelId, role: 'gizli', word: entry.word })),
]);

describe('word quality gate', () => {
  it('only uses words that two independent reviews found common enough', () => {
    const rejected = authored
      .filter((item) => !approved.has(normalizeWord(item.word)))
      .map((item) => `L${item.level} ${item.role}: ${item.word}`);
    // Main words block the seal and hidden words block the third star, so neither may be obscure.
    expect(rejected, 'onaylanmamis kelimeler (vault/07-Production/word-quality-v1/README.md)').toEqual([]);
  });

  it('keeps the values blocklist out of the levels unless the exception is documented', () => {
    const hits = authored
      .filter((item) => denied.has(normalizeWord(item.word)))
      .filter((item) => !valuesExceptions[normalizeWord(item.word)])
      .map((item) => `L${item.level} ${item.role}: ${item.word}`);
    expect(hits, 'kara listedeki kelime icin values-exceptions.json gerekcesi yok').toEqual([]);
  });

  it('keeps every documented exception tied to a word that is still in use', () => {
    const used = new Set(authored.map((item) => normalizeWord(item.word)));
    for (const word of Object.keys(valuesExceptions)) {
      expect(used.has(normalizeWord(word)), `${word} artik kullanilmiyor, istisnayi sil`).toBe(true);
    }
  });

  it('requires at most one only-B-rated word per level, so a player is never blocked by two fuzzy words', () => {
    const stuckRisk = levels
      .map((level) => ({
        id: level.levelId,
        fuzzy: level.mainWords.map((entry) => entry.word).filter((word) => /B/.test(tiers[normalizeWord(word)] ?? 'BB')),
      }))
      .filter((row) => row.fuzzy.length >= 2 && !MORE_THAN_ONE_B_ALLOWED[row.id])
      .map((row) => `L${row.id}: ${row.fuzzy.join(', ')}`);
    expect(stuckRisk, 'ikiden fazla B-sinifi zorunlu kelime').toEqual([]);
  });

  it('keeps the exception list honest', () => {
    for (const id of Object.keys(MORE_THAN_ONE_B_ALLOWED).map(Number)) {
      const level = levels.find((item) => item.levelId === id);
      const fuzzy = (level?.mainWords ?? []).filter((entry) => /B/.test(tiers[normalizeWord(entry.word)] ?? 'BB'));
      expect(fuzzy.length, `L${id} artik istisna gerektirmiyor, listeden cikar`).toBeGreaterThanOrEqual(2);
    }
  });
});
