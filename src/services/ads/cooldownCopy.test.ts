import { describe, expect, it } from 'vitest';
import { fullscreenCooldownButtonLabel, fullscreenCooldownMessage } from './cooldownCopy';

describe('fullscreenCooldownMessage', () => {
  it('formats remaining wait in Turkish seconds', () => {
    expect(fullscreenCooldownMessage(200)).toBe('Tam ekran reklam için 200 sn bekle. Reklamsız oynayabilirsin.');
  });

  it('uses a short form for tiny remainders', () => {
    expect(fullscreenCooldownMessage(1)).toBe('Tam ekran reklam için 1 sn bekle. Reklamsız oynayabilirsin.');
  });

  it('keeps CTA button label aligned with the warning seconds', () => {
    expect(fullscreenCooldownButtonLabel(45.2)).toBe('46 sn bekle');
  });
});
