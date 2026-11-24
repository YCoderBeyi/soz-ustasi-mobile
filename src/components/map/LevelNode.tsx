import React, { type CSSProperties } from "react";
import "./LevelNode.css";
import { WaxSeal } from "../WaxSeal";

export type LevelNodeState = "active" | "completed" | "locked" | "future";

type Props = { level: number; state: LevelNodeState; label?: string; x: number; y: number; k?: number; chestSealId?: string | null; chestClaimed?: boolean; onClick?: () => void };

const assetMap: Record<LevelNodeState, string> = {
  active: "/assets/ui/map/08-level-node-active-blue.webp",
  completed: "/assets/ui/map/07-level-node-gold.webp",
  locked: "/assets/ui/map/09-level-node-locked-wax.webp",
  future: "/assets/ui/map/09-level-node-locked-wax.webp",
};
const stateLabels: Record<LevelNodeState, string> = {
  active: 'oynanabilir', completed: 'tamamlandı', locked: 'kilitli', future: 'kilitli',
};

export function LevelNode({ level, state, label, x, y, k, chestSealId, chestClaimed = false, onClick }: Props) {
  const hasChest = chestSealId !== undefined || chestClaimed;
  return (
    <button
      className={`level-node level-node--${state}`}
      style={{ left: `${x}%`, top: `${y}%`, '--node-y': `${y}%`, ...(k ? { '--k': k } : {}) } as CSSProperties}
      onClick={onClick}
      aria-label={`Seviye ${level}, ${stateLabels[state]}${hasChest ? chestClaimed ? ', bölge sandığı alındı' : ', mühürlü bölge sandığı' : ''}`}
    >
      <img className="level-node__asset" src={assetMap[state]} alt="" />
      <span className="level-node__number">{level}</span>
      {hasChest && (
        <span className="level-node__chest-seal">
          {chestClaimed
            ? <span className="level-node__chest-claimed" aria-hidden="true">✓</span>
            : <WaxSeal className="levelNodeChestWaxSeal" label="" ariaLabel="Mühürlü sandık" variant={chestSealId} />}
        </span>
      )}
      {(state === "locked" || state === "future") && (
        <img className="level-node__badge" src="/assets/map/icon-lock.svg" alt="" />
      )}
      {state === "completed" && (
        <img className="level-node__badge" src="/assets/map/icon-check.svg" alt="" />
      )}
      {label && <span className="level-node__label">{label}</span>}
    </button>
  );
}
