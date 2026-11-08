import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { GENERATED_BONUS_MEANINGS, GENERATED_BONUS_WORDS } from '../data/bonusWords.generated';
import { findBonusDictionaryWord } from './bonusDictionary';
import { normalizeWord } from './normalize';

const deniedByValues = new Set(
  Object.values(
    JSON.parse(
      readFileSync('vault/07-Production/bonus-lexicon-v1/denied-by-values.json', 'utf8'),
    ) as Record<string, string[]>,
  ).flat(),
);

describe('bonus dictionary', () => {
  it('never contains a word the values review removed', () => {
    for (const word of deniedByValues) {
      expect(findBonusDictionaryWord(word), word).toBeUndefined();
    }
  });

  it('keeps the generated tier canonical, unique and at least three letters', () => {
    expect(new Set(GENERATED_BONUS_WORDS).size).toBe(GENERATED_BONUS_WORDS.length);
    for (const word of GENERATED_BONUS_WORDS) {
      expect(normalizeWord(word), word).toBe(word);
      expect([...word].length, word).toBeGreaterThanOrEqual(3);
      expect(word, word).toMatch(/^[A-ZÇĞİÖŞÜÂÎÛ]+$/);
    }
  });

  it('serves authored meanings for generated words, short and sentence-shaped', () => {
    const withMeaning = Object.entries(GENERATED_BONUS_MEANINGS);
    expect(withMeaning.length).toBeGreaterThan(200);
    for (const [word, meaning] of withMeaning) {
      expect(GENERATED_BONUS_WORDS, word).toContain(word);
      expect(findBonusDictionaryWord(word)?.meaning, word).toBeTruthy();
      expect(meaning.length, word).toBeLessThanOrEqual(90);
      expect(meaning, word).toMatch(/[.]$/);
    }
  });

  it('keeps hand-written meanings ahead of the generated tier', () => {
    expect(findBonusDictionaryWord('kulak')?.meaning).toBeTruthy();
    expect(findBonusDictionaryWord('KEL')).toBeUndefined();
    expect(findBonusDictionaryWord('QQQQ')).toBeUndefined();
  });
});
