// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WordPuzzle } from './WordPuzzle';

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const words = [
  { word: 'ARI', meaning: 'bal', difficulty: 1 as const },
  { word: 'ARA', meaning: 'ara', difficulty: 1 as const },
];

describe('WordPuzzle seal-press stagger', () => {
  it('yeni bulunan kelimede harf sırasına göre delay verir', () => {
    const { rerender } = render(
      <WordPuzzle words={words} found={[]} revealedLetters={{}} />,
    );
    rerender(<WordPuzzle words={words} found={['ARI']} revealedLetters={{}} />);

    const delays = screen
      .getAllByText(/^[ARI]$/)
      .map((el) => el.parentElement?.getAttribute('data-press-delay') ?? '0')
      .map(Number)
      .sort((a, b) => a - b);

    expect(delays).toEqual([0, 48, 96]);
  });

  it('calm iken delay vermez', () => {
    const { rerender } = render(
      <WordPuzzle words={words} found={[]} revealedLetters={{}} calm />,
    );
    rerender(<WordPuzzle words={words} found={['ARI']} revealedLetters={{}} calm />);
    const delayed = screen
      .getAllByText(/^[ARI]$/)
      .some((el) => el.parentElement?.getAttribute('data-press-delay'));
    expect(delayed).toBe(false);
  });
});
