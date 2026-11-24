import { describe, expect, it } from 'vitest';
import { bonusWords, findBonusDictionaryWord } from './bonusDictionary';
import { normalizeWord } from './normalize';

describe('bonus dictionary', () => {
  it('keeps every project-authored entry canonical, unique and explainable', () => {
    const words = bonusWords.map(({ word }) => word);
    expect(new Set(words).size).toBe(words.length);
    for (const entry of bonusWords) {
      expect(normalizeWord(entry.word), entry.word).toBe(entry.word);
      expect(entry.word, entry.word).toMatch(/^[A-ZÇĞİÖŞÜÂÎÛ]+$/);
      expect(entry.meaning.length, entry.word).toBeGreaterThan(0);
      expect(entry.meaning.length, entry.word).toBeLessThanOrEqual(120);
      expect(findBonusDictionaryWord(entry.word)?.meaning, entry.word).toBe(entry.meaning);
    }
  });

  it('serves project-authored meanings and rejects unknown entries', () => {
    expect(findBonusDictionaryWord('kulak')?.meaning).toBeTruthy();
    expect(findBonusDictionaryWord('dene')?.meaning).toBe('Bir şeyi sınamak için kullanılan kısa komut.');
    expect(findBonusDictionaryWord('süz')?.meaning).toBe('Bir sıvıyı süzgeçten geçir.');
    expect(findBonusDictionaryWord('bol')?.meaning).toBe('Miktarı veya sayısı çok olan.');
    expect(findBonusDictionaryWord('KEL')).toBeUndefined();
    expect(findBonusDictionaryWord('QQQQ')).toBeUndefined();
  });
});
