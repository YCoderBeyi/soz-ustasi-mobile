// Turkish-aware canonical form for word matching. Letters \u015f/\u00e7/\u011f/\u00f6/\u00fc/\u0131/\u0130 are
// DISTINCT letters in Turkish, not accented variants \u2014 so we only upper-case
// (locale-aware) and compose to NFC. We must NOT strip diacritics, otherwise
// genuinely different words collapse together (\u015eAL=SAL, \u00c7OK=COK, A\u015e=AS) and the
// player can be credited for the wrong word.
export function normalizeWord(word: string) {
  return word
    .trim()
    .normalize('NFC')
    .toLocaleUpperCase('tr-TR')
    .normalize('NFC');
}
