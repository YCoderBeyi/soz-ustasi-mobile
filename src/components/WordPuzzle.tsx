import type { CSSProperties } from 'react';
import type { WordEntry } from '../types';
import { buildCrosswordLayout } from '../game/crossword';
import { WordSlots } from './WordSlots';
import { WordTileCell } from './WordTileCell';

export function WordPuzzle({
  words,
  found,
  revealedLetters,
  currentWord,
}: {
  words: WordEntry[];
  found: string[];
  revealedLetters: Record<string, number[]>;
  currentWord?: string;
}) {
  const layout = buildCrosswordLayout(words);
  if (!layout) {
    return (
      <>
        {words.map((entry) => (
          <WordSlots
            key={entry.word}
            entry={entry}
            filled={found.includes(entry.word)}
            revealed={revealedLetters[entry.word] ?? []}
          />
        ))}
      </>
    );
  }

  const startNumbers = new Map<string, number>();
  layout.placements.forEach((placement, index) => {
    const key = `${placement.row}-${placement.col}`;
    if (!startNumbers.has(key)) startNumbers.set(key, index + 1);
  });
  const fittedCellSize = Math.max(
    24,
    Math.min(48, Math.floor(320 / layout.colCount), Math.floor(130 / layout.rowCount)),
  );

  return (
    <div
      className="crosswordGrid"
      style={{
        '--crossword-cols': layout.colCount,
        '--crossword-rows': layout.rowCount,
        '--crossword-cell-fit': `${fittedCellSize}px`,
        gridTemplateColumns: `repeat(${layout.colCount}, var(--crossword-cell-fit))`,
        gridTemplateRows: `repeat(${layout.rowCount}, var(--crossword-cell-fit))`,
      } as CSSProperties}
    >
      {layout.cells.map((cell) => {
        const visibleWord = cell.words.find((word) => found.includes(word));
        const revealedWord = cell.words.find((word) => {
          const placement = layout.placements.find((item) => item.word === word);
          if (!placement) return false;
          const index = placement.direction === 'across' ? cell.col - placement.col : cell.row - placement.row;
          return (revealedLetters[word] ?? []).includes(index);
        });
        const isVisible = Boolean(visibleWord || revealedWord);
        const isCrossing = cell.words.length > 1;
        const active = !cell.isEmpty && !isVisible && currentWord
          ? cell.words.some((word) => word.startsWith(currentWord) || currentWord.startsWith(word))
          : false;

        if (cell.isEmpty) {
          return (
            <WordTileCell
              key={`${cell.row}-${cell.col}`}
              empty
              className="crosswordCellEmpty"
              style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 } as CSSProperties}
            />
          );
        }

        return (
          <WordTileCell
            key={`${cell.row}-${cell.col}`}
            letter={isVisible ? cell.letter : ''}
            filled={isVisible}
            active={active}
            number={startNumbers.get(`${cell.row}-${cell.col}`)}
            className={`crosswordCell ${isCrossing ? 'crossingCell' : ''}`}
            style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 } as CSSProperties}
          />
        );
      })}
    </div>
  );
}
