import { memo, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { WordEntry } from '../types';
import { buildCrosswordLayout } from '../game/crossword';
import { WordSlots } from './WordSlots';
import { WordTileCell } from './WordTileCell';
import type { TileSkinId } from '../game/tileSkins';
import { BOARD_GAP, tileTokens } from '../game/tileTokens';

function WordPuzzleView({
  words,
  found,
  revealedLetters,
  currentWord,
  skin = 'classic',
  evolution = 0,
  calm = false,
}: {
  words: WordEntry[];
  found: string[];
  revealedLetters: Record<string, number[]>;
  currentWord?: string;
  skin?: TileSkinId;
  evolution?: 0 | 1 | 2;
  calm?: boolean;
}) {
  const layout = useMemo(() => buildCrosswordLayout(words), [words]);
  const gridRef = useRef<HTMLDivElement>(null);
  // Space the board may use, read from the panel's own limits so the grid never overflows (or gets cut) on short phones.
  const [room, setRoom] = useState<{ w: number; h: number }>({ w: 344, h: 210 });
  useLayoutEffect(() => {
    const content = gridRef.current?.parentElement;
    const panel = content?.parentElement;
    if (!content || !panel) return undefined;
    const measure = () => {
      const panelStyle = getComputedStyle(panel);
      const max = parseFloat(panelStyle.maxHeight);
      const chrome = parseFloat(panelStyle.paddingTop) + parseFloat(panelStyle.paddingBottom) + 12;
      const h = Number.isFinite(max) ? max - chrome : 210;
      const w = content.clientWidth - 12;
      setRoom((prev) => (prev.w === w && prev.h === h ? prev : { w, h }));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [layout]);
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
  // The board uses the full panel width; the height budget grows with the extra room on tall phones.
  const fittedCellSize = Math.max(
    16,
    Math.min(
      60,
      Math.floor((room.w - (layout.colCount - 1) * BOARD_GAP.x) / layout.colCount),
      Math.floor((room.h - (layout.rowCount - 1) * BOARD_GAP.y) / layout.rowCount),
    ),
  );

  return (
    <div
      ref={gridRef}
      className="crosswordGrid"
      data-skin={skin}
      data-calm={calm}
      style={{
        ...tileTokens(skin, evolution),
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

export const WordPuzzle = memo(WordPuzzleView);
