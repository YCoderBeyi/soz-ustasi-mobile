import type { WordEntry } from '../types';
import { WordTileCell } from './WordTileCell';

export function WordSlots({ entry, filled, revealed }: { entry: WordEntry; filled: boolean; revealed: number[] }) {
  return (
    <div className="slotRow">
      {entry.word.split('').map((letter, index) => {
        const show = filled || revealed.includes(index);
        return (
          <WordTileCell
            key={`${letter}-${index}`}
            letter={show ? letter : ''}
            filled={show}
          />
        );
      })}
    </div>
  );
}
