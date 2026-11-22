// @vitest-environment jsdom
import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { TILE_HINT_PRESS_MS, TILE_PRESS_MS, WordTileCell } from './WordTileCell';

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe('WordTileCell seal-press', () => {
  it('filled rising edge ile mühür baskısı gösterir', () => {
    vi.useFakeTimers();
    const { rerender } = render(<WordTileCell letter="" filled={false} />);
    expect(screen.queryByTestId('tile-press')).toBeNull();

    rerender(<WordTileCell letter="A" filled pressTone="seal" />);
    expect(screen.getByText('A')).toBeTruthy();
    const press = screen.getByTestId('tile-press');
    expect(press.getAttribute('data-feedback-fx')).toBe('tile-seal-press');
    expect(press.getAttribute('data-tone')).toBe('seal');

    act(() => {
      vi.advanceTimersByTime(TILE_PRESS_MS);
    });
    expect(screen.queryByTestId('tile-press')).toBeNull();
  });

  it('mist tonu ipucu baskısı — daha kısa', () => {
    vi.useFakeTimers();
    const { rerender } = render(<WordTileCell letter="" filled={false} pressTone="mist" />);
    rerender(<WordTileCell letter="T" filled pressTone="mist" />);
    const press = screen.getByTestId('tile-press');
    expect(press.getAttribute('data-feedback-fx')).toBe('tile-mist-press');
    expect(press.getAttribute('data-tone')).toBe('mist');

    act(() => {
      vi.advanceTimersByTime(TILE_HINT_PRESS_MS - 1);
    });
    expect(screen.getByTestId('tile-press')).toBeTruthy();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(screen.queryByTestId('tile-press')).toBeNull();
  });

  it('pressDelayMs latch: re-render delay değişse baskı sürer', () => {
    vi.useFakeTimers();
    const { rerender } = render(<WordTileCell letter="" filled={false} pressDelayMs={96} />);
    rerender(<WordTileCell letter="R" filled pressDelayMs={96} />);
    expect(screen.getByTestId('tile-press')).toBeTruthy();

    rerender(<WordTileCell letter="R" filled pressDelayMs={0} />);
    expect(screen.getByTestId('tile-press')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(TILE_PRESS_MS + 96);
    });
    expect(screen.queryByTestId('tile-press')).toBeNull();
  });

  it('calm açıkken baskı göstermez; active sınıfı kalır', () => {
    const { rerender } = render(<WordTileCell letter="" filled={false} active calm />);
    rerender(<WordTileCell letter="B" filled active calm />);
    expect(screen.queryByTestId('tile-press')).toBeNull();
    expect(document.querySelector('.wordTileCellActive')).toBeTruthy();
  });

  it('zaten filled iken yeniden mount baskı tetiklemez', () => {
    render(<WordTileCell letter="C" filled />);
    expect(screen.queryByTestId('tile-press')).toBeNull();
  });
});
