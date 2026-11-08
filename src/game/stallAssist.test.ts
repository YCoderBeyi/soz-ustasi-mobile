import { describe, expect, it } from 'vitest';
import { nextIdleSeconds, shouldOfferStallAssist, STALL_ASSIST_SECONDS } from './stallAssist';

describe('stall assist rules', () => {
  const base = { idleSeconds: 0, alreadyOffered: false, finished: false };

  it('offers only after the idle threshold', () => {
    expect(shouldOfferStallAssist({ ...base, idleSeconds: STALL_ASSIST_SECONDS - 1 })).toBe(false);
    expect(shouldOfferStallAssist({ ...base, idleSeconds: STALL_ASSIST_SECONDS })).toBe(true);
  });

  it('offers at most once per level', () => {
    expect(shouldOfferStallAssist({ ...base, idleSeconds: 999, alreadyOffered: true })).toBe(false);
  });

  it('never offers on a finished level', () => {
    expect(shouldOfferStallAssist({ ...base, idleSeconds: 999, finished: true })).toBe(false);
  });

  it('counts idle time only while playing and resets on progress', () => {
    expect(nextIdleSeconds(10, { playing: true, progressed: false })).toBe(11);
    expect(nextIdleSeconds(10, { playing: false, progressed: false })).toBe(10);
    expect(nextIdleSeconds(30, { playing: true, progressed: true })).toBe(0);
    expect(nextIdleSeconds(30, { playing: false, progressed: true })).toBe(0);
  });
});
