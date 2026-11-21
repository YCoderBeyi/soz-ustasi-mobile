import type { WordEntry } from '../types';
import { TILE_PRESS_STAGGER_CAP_MS, TILE_PRESS_STAGGER_MS, WordTileCell } from './WordTileCell';

export function WordSlots({
  entry,
  filled,
  revealed,
  calm = false,
}: {
  entry: WordEntry;
  filled: boolean;
  revealed: number[];
  calm?: boolean;
}) {
  return (
    <div className="slotRow">
      {entry.word.split('').map((letter, index) => {
        const show = filled || revealed.includes(index);
        const pressDelayMs = filled && !calm && !revealed.includes(index)
          ? Math.min(index * TILE_PRESS_STAGGER_MS, TILE_PRESS_STAGGER_CAP_MS)
          : 0;
        return (
          <WordTileCell
            key={`${letter}-${index}`}
            letter={show ? letter : ''}
            filled={show}
            calm={calm}
            pressDelayMs={pressDelayMs}
          />
        );
      })}
    </div>
  );
}
