import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { createCleanupRegistry } from './cleanup';

beforeAll(() => {
  vi.stubGlobal('requestAnimationFrame', (fn: () => void) => setTimeout(fn, 1));
  vi.stubGlobal('cancelAnimationFrame', (id: number) => clearTimeout(id));
});

afterAll(() => {
  vi.unstubAllGlobals();
});

describe('createCleanupRegistry', () => {
  it('safeTimeout runs callback after delay', async () => {
    const r = createCleanupRegistry();
    const fn = vi.fn();
    r.safeTimeout(fn, 10);
    await new Promise(r => setTimeout(r, 20));
    expect(fn).toHaveBeenCalledOnce();
    r.flushAll();
  });

  it('flushAll cancels pending timeouts', async () => {
    const r = createCleanupRegistry();
    const fn = vi.fn();
    r.safeTimeout(fn, 100);
    r.flushAll();
    await new Promise(r => setTimeout(r, 150));
    expect(fn).not.toHaveBeenCalled();
  });

  it('safeRaf runs callback', async () => {
    const r = createCleanupRegistry();
    const fn = vi.fn();
    r.safeRaf(fn);
    await new Promise(r => setTimeout(r, 50));
    expect(fn).toHaveBeenCalledOnce();
    r.flushAll();
  });

  it('flushAll cancels pending rAF', async () => {
    const r = createCleanupRegistry();
    const fn = vi.fn();
    r.safeRaf(fn);
    r.flushAll();
    await new Promise(r => setTimeout(r, 50));
    expect(fn).not.toHaveBeenCalled();
  });
});
