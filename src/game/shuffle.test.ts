import { describe, it, expect } from 'vitest';
import { shuffle } from './shuffle';

describe('shuffle', () => {
  it('returns an array of the same length', () => {
    expect(shuffle([1, 2, 3])).toHaveLength(3);
  });

  it('contains all original elements', () => {
    const input = [1, 2, 3, 4, 5];
    expect(shuffle(input).sort()).toEqual(input);
  });

  it('does not mutate the original array', () => {
    const input = [1, 2, 3];
    const copy = [...input];
    shuffle(input);
    expect(input).toEqual(copy);
  });

  it('works with strings', () => {
    const result = shuffle(['a', 'b', 'c']);
    expect(result.sort()).toEqual(['a', 'b', 'c']);
  });

  it('works with an empty array', () => {
    expect(shuffle([])).toEqual([]);
  });

  it('works with a single element array', () => {
    expect(shuffle([42])).toEqual([42]);
  });
});
