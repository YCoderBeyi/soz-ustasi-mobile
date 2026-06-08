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

  return (
    <div
      className="crosswordGrid"
      style={{
        gridTemplateColumns: `repeat(${layout.colCount}, var(--crossword-cell))`,
        gridTemplateRows: `repeat(${layout.rowCount}, var(--crossword-cell))`,
      }}
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
            className={`crosswordCell ${isCrossing ? 'crossingCell' : ''}`}
            style={{ gridRow: cell.row + 1, gridColumn: cell.col + 1 } as CSSProperties}
          />
        );
      })}
    </div>
  );
}
