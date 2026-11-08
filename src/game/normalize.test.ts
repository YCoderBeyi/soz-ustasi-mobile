import { describe, it, expect } from 'vitest';
import { normalizeWord } from './normalize';

describe('normalizeWord', () => {
  it('composes decomposed letters (s + cedilla, o + diaeresis) into the Turkish capitals', () => {
    expect(normalizeWord('şar')).toBe('ŞAR');
    expect(normalizeWord('göz')).toBe('GÖZ');
  });

  it('trims whitespace', () => {
    expect(normalizeWord('  MERHABA  ')).toBe('MERHABA');
  });

  it('uppercases Turkish lowercase', () => {
    expect(normalizeWord('merhaba')).toBe('MERHABA');
  });

  it('uppercases the Turkish i/ı pair to their distinct capitals', () => {
    expect(normalizeWord('i')).toBe('İ');
    expect(normalizeWord('İ')).toBe('İ');
    expect(normalizeWord('ı')).toBe('I');
    expect(normalizeWord('I')).toBe('I');
  });

  it('preserves Turkish letters as distinct (does not fold ş/ç/ğ/ö/ü)', () => {
    expect(normalizeWord('şal')).toBe('ŞAL');
    expect(normalizeWord('çok')).toBe('ÇOK');
    expect(normalizeWord('gün')).toBe('GÜN');
    expect(normalizeWord('öz')).toBe('ÖZ');
    expect(normalizeWord('üç')).toBe('ÜÇ');
    expect(normalizeWord('ılık')).toBe('ILIK');
    expect(normalizeWord('ağ')).toBe('AĞ');
  });

  it('keeps genuinely different Turkish words distinct', () => {
    // The core regression: these used to collapse together.
    expect(normalizeWord('aş')).not.toBe(normalizeWord('as'));
    expect(normalizeWord('saç')).not.toBe(normalizeWord('sac'));
    expect(normalizeWord('su')).not.toBe(normalizeWord('şu'));
  });

  it('handles mixed case', () => {
    expect(normalizeWord('İstanbul')).toBe('İSTANBUL');
    expect(normalizeWord('Şımarık')).toBe('ŞIMARIK');
  });

  it('leaves plain ASCII uppercased letters unchanged', () => {
    expect(normalizeWord('ABC')).toBe('ABC');
  });

  it('handles empty string', () => {
    expect(normalizeWord('')).toBe('');
  });
});
