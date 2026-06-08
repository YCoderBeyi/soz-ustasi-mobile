import type { WordEntry } from '../types';

export type CrosswordDirection = 'across' | 'down';

export type CrosswordPlacement = {
  word: string;
  row: number;
  col: number;
  direction: CrosswordDirection;
};

export type CrosswordCell = {
  row: number;
  col: number;
  letter: string;
  words: string[];
  isEmpty?: boolean;
};

export type CrosswordLayout = {
  cells: CrosswordCell[];
  placements: CrosswordPlacement[];
  rowCount: number;
  colCount: number;
};

export function buildCrosswordLayout(words: WordEntry[]): CrosswordLayout | null {
  if (words.length < 2) return null;

  const sortedWords = [...words].sort((a, b) => b.word.length - a.word.length);
  const placements: CrosswordPlacement[] = [];
  const occupied = new Map<string, CrosswordCell>();

  function key(row: number, col: number) {
    return `${row}:${col}`;
  }

  function getPosition(placement: CrosswordPlacement, index: number) {
    return placement.direction === 'across'
      ? { row: placement.row, col: placement.col + index }
      : { row: placement.row + index, col: placement.col };
  }

  function addPlacement(placement: CrosswordPlacement) {
    [...placement.word].forEach((letter, index) => {
      const position = getPosition(placement, index);
      const cellKey = key(position.row, position.col);
      const existing = occupied.get(cellKey);
      if (existing) {
        existing.words.push(placement.word);
      } else {
        occupied.set(cellKey, { ...position, letter, words: [placement.word] });
      }
    });
    placements.push(placement);
  }

  addPlacement({ word: sortedWords[0].word, row: 0, col: 0, direction: 'across' });

  for (const entry of sortedWords.slice(1)) {
    let placed = false;
    const letters = [...entry.word];

    for (let wordIndex = 0; wordIndex < letters.length && !placed; wordIndex++) {
      for (const base of placements) {
        const baseLetters = [...base.word];
        const crossIndex = baseLetters.findIndex((letter) => letter === letters[wordIndex]);
        if (crossIndex === -1) continue;

        const crossPosition = getPosition(base, crossIndex);
        const direction: CrosswordDirection = base.direction === 'across' ? 'down' : 'across';
        const candidate: CrosswordPlacement = direction === 'down'
          ? { word: entry.word, row: crossPosition.row - wordIndex, col: crossPosition.col, direction }
          : { word: entry.word, row: crossPosition.row, col: crossPosition.col - wordIndex, direction };

        const fits = letters.every((letter, index) => {
          const position = getPosition(candidate, index);
          const existing = occupied.get(key(position.row, position.col));
          if (!existing) return true;
          if (existing.letter !== letter) return false;
          return existing.words.every((word) => {
            const existingPlacement = placements.find((placement) => placement.word === word);
            return existingPlacement?.direction !== candidate.direction;
          });
        });

        if (fits) {
          addPlacement(candidate);
          placed = true;
          break;
        }
      }
    }

    if (!placed) return null;
  }

  const cells = [...occupied.values()];
  const minRow = Math.min(...cells.map((cell) => cell.row));
  const minCol = Math.min(...cells.map((cell) => cell.col));
  const maxRow = Math.max(...cells.map((cell) => cell.row));
  const maxCol = Math.max(...cells.map((cell) => cell.col));

  // Fill in empty cells within the bounding box
  const cellMap = new Map(cells.map((cell) => [key(cell.row - minRow, cell.col - minCol), true]));
  const allCells: CrosswordCell[] = [];
  for (let r = 0; r <= maxRow - minRow; r++) {
    for (let c = 0; c <= maxCol - minCol; c++) {
      const cellKey = key(r, c);
      if (cellMap.has(cellKey)) {
        const cell = cells.find((cel) => cel.row - minRow === r && cel.col - minCol === c)!;
        allCells.push({ ...cell, row: r, col: c });
      } else {
        allCells.push({ row: r, col: c, letter: '', words: [], isEmpty: true });
      }
    }
  }

  const normalizedPlacements = placements.map((placement) => ({
    ...placement,
    row: placement.row - minRow,
    col: placement.col - minCol,
  }));

  return {
    cells: allCells,
    placements: normalizedPlacements,
    rowCount: maxRow - minRow + 1,
    colCount: maxCol - minCol + 1,
  };
}
