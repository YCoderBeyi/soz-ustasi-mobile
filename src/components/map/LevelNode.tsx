import React from "react";
import "./LevelNode.css";

export type LevelNodeState = "active" | "completed" | "locked" | "future";

type Props = { level: number; state: LevelNodeState; label?: string; x: number; y: number; onClick?: () => void };

const assetMap: Record<LevelNodeState, string> = {
  active: "/assets/ui/map/08-level-node-active-blue.webp",
  completed: "/assets/ui/map/07-level-node-gold.webp",
  locked: "/assets/ui/map/09-level-node-locked-wax.webp",
  future: "/assets/ui/map/09-level-node-locked-wax.webp",
};

export function LevelNode({ level, state, label, x, y, onClick }: Props) {
  return (
    <button className={`level-node level-node--${state}`} style={{ left: `${x}%`, top: `${y}%` }} onClick={onClick} aria-label={`Level ${level} ${state}`}>
      <img className="level-node__asset" src={assetMap[state]} alt="" />
      <span className="level-node__number">{level}</span>
      {(state === "locked" || state === "future") && <img className="level-node__badge" src="/assets/map/icon-lock.svg" alt="" />}
      {state === "completed" && <img className="level-node__badge" src="/assets/map/icon-check.svg" alt="" />}
      {label && <span className="level-node__label">{label}</span>}
    </button>
  );
}
