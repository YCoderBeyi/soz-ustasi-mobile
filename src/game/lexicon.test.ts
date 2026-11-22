import { describe, expect, it } from 'vitest';
import { levels } from '../data/levels';
import { findCatalogWord, findWordEntry, rewardKey, rewardKeyPrefix } from './lexicon';
import { normalizeWord } from './normalize';

describe('lexicon', () => {
  it('keeps the persisted reward key format stable', () => {
    expect(rewardKey(5, 'hidden', 'erk')).toBe('5:hidden:ERK');
    expect(rewardKey(1, 'bonus', 'bol')).toBe('1:bonus:BOL');
    expect(rewardKeyPrefix(1, 'bonus')).toBe('1:bonus:');
  });

  it('normalizes with Turkish casing, never collapsing I and İ', () => {
    expect(rewardKey(1, 'bonus', 'ılık')).toBe('1:bonus:ILIK');
    expect(rewardKey(1, 'bonus', 'iğne')).toBe('1:bonus:İĞNE');
  });

  it('finds an entry inside a given list case-insensitively', () => {
    const level = levels[1];
    const first = level.mainWords[0];
    expect(findWordEntry(level.mainWords, first.word.toLocaleLowerCase('tr-TR'))).toBe(first);
    expect(findWordEntry(level.mainWords, 'ZZZZ')).toBeUndefined();
  });

  it('matches the previous linear scan for every authored word', () => {
    for (const level of levels) {
      for (const entry of [...level.mainWords, ...level.hiddenWords]) {
        const expected = levels
          .flatMap((item) => [...item.mainWords, ...item.hiddenWords])
          .find((candidate) => normalizeWord(candidate.word) === normalizeWord(entry.word));
        expect(findCatalogWord(entry.word)).toBe(expected);
      }
    }
  });

  it('falls back to the curated bonus dictionary and rejects unknown words', () => {
    expect(findCatalogWord('krema')?.word).toBe('KREMA');
    expect(findCatalogWord('QQQQ')).toBeUndefined();
  });
});
