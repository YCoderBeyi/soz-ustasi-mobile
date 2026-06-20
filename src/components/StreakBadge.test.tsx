import { act, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { StreakBadge } from './StreakBadge';

afterEach(() => {
  vi.useRealTimers();
});

describe('StreakBadge', () => {
  it('removes itself after the celebration duration', () => {
    vi.useFakeTimers();
    render(<StreakBadge streak={3} />);

    expect(screen.getByText('Çırak Serisi · 3x')).toBeTruthy();

    act(() => {
      vi.advanceTimersByTime(1800);
    });

    expect(screen.queryByText('Çırak Serisi · 3x')).toBeNull();
  });

  it('restarts the visibility duration when the streak increases', () => {
    vi.useFakeTimers();
    const { rerender } = render(<StreakBadge streak={3} />);

    act(() => {
      vi.advanceTimersByTime(1500);
    });
    rerender(<StreakBadge streak={4} />);
    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(screen.getByText('Çırak Serisi · 4x')).toBeTruthy();
  });
});
