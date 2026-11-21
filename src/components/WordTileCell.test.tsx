// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TILE_PRESS_MS, WordTileCell } from './WordTileCell';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('WordTileCell seal-press', () => {
  it('filled rising edge ile mühür baskısı gösterir', () => {
    vi.useFakeTimers();
    const { rerender } = render(<WordTileCell letter="" filled={false} />);
    expect(screen.queryByTestId('tile-press')).toBeNull();

    rerender(<WordTileCell letter="A" filled />);
    expect(screen.getByText('A')).toBeTruthy();
    expect(screen.getByTestId('tile-press').getAttribute('data-feedback-fx')).toBe('tile-seal-press');
    expect(screen.getByTestId('tile-press').getAttribute('aria-hidden')).toBe('true');

    act(() => {
      vi.advanceTimersByTime(TILE_PRESS_MS);
    });
    expect(screen.queryByTestId('tile-press')).toBeNull();
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('pressDelayMs latch: re-render delay değişse baskı sürer', () => {
    vi.useFakeTimers();
    const { rerender } = render(<WordTileCell letter="" filled={false} pressDelayMs={96} />);
    rerender(<WordTileCell letter="R" filled pressDelayMs={96} />);
    expect(screen.getByTestId('tile-press')).toBeTruthy();
    expect(screen.getByText('R')).toBeTruthy();

    // Parent staggerWord null olunca delay 0 gelir — eski crack yarışı
    rerender(<WordTileCell letter="R" filled pressDelayMs={0} />);
    expect(screen.getByTestId('tile-press')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(TILE_PRESS_MS + 96);
    });
    expect(screen.queryByTestId('tile-press')).toBeNull();
  });

  it('calm açıkken baskı göstermez', () => {
    const { rerender } = render(<WordTileCell letter="" filled={false} calm />);
    rerender(<WordTileCell letter="B" filled calm />);
    expect(screen.queryByTestId('tile-press')).toBeNull();
    expect(screen.getByText('B')).toBeTruthy();
  });

  it('zaten filled iken yeniden mount baskı tetiklemez', () => {
    render(<WordTileCell letter="C" filled />);
    expect(screen.queryByTestId('tile-press')).toBeNull();
  });
});
