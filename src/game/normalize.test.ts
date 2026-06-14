import { describe, it, expect } from 'vitest';
import { normalizeWord } from './normalize';

describe('normalizeWord', () => {
  it('trims whitespace', () => {
    expect(normalizeWord('  MERHABA  ')).toBe('MERHABA');
  });

  it('uppercases Turkish lowercase', () => {
    expect(normalizeWord('merhaba')).toBe('MERHABA');
  });

  it('removes Turkish dotted i (i → I)', () => {
    expect(normalizeWord('i')).toBe('I');
    expect(normalizeWord('İ')).toBe('I');
  });

  it('strips diacritics from accented characters', () => {
    expect(normalizeWord('şal')).toBe('SAL');
    expect(normalizeWord('çok')).toBe('COK');
    expect(normalizeWord('gün')).toBe('GUN');
    expect(normalizeWord('öz')).toBe('OZ');
    expect(normalizeWord('üç')).toBe('UC');
    expect(normalizeWord('ılık')).toBe('ILIK');
  });

  it('handles mixed case and diacritics', () => {
    expect(normalizeWord('İstanbul')).toBe('ISTANBUL');
    expect(normalizeWord('Şımarık')).toBe('SIMARIK');
  });

  it('leaves plain ASCII uppercased letters unchanged', () => {
    expect(normalizeWord('ABC')).toBe('ABC');
  });

  it('handles empty string', () => {
    expect(normalizeWord('')).toBe('');
  });
});
