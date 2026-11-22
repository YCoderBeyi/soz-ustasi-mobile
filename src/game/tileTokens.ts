// Pure bridge from tile data to CSS custom properties. Stylesheets never hold colors of their own:
// they only read the `--tile-*` tokens produced here (single source of truth for the board look).
import { EVOLUTION_GLOSS_ALPHA, TILE_SKIN_PALETTES, type TileSkinId } from './tileSkins';

/** Space between board cells in px. Used by both the CSS grid and the cell-fit math. */
export const BOARD_GAP = { x: 5, y: 6 } as const;

interface EvolutionLook {
  gloss: number;
  /** Replaces the skin's edge/rim when set (gold tier). */
  edge?: string;
  rim?: string;
  glow: string;
}

const EVOLUTIONS: Record<0 | 1 | 2, EvolutionLook> = {
  0: { gloss: 0.18, glow: '0 0 0 rgba(0,0,0,0)' },
  1: { gloss: EVOLUTION_GLOSS_ALPHA, glow: '0 0 0 rgba(0,0,0,0)' },
  2: { gloss: EVOLUTION_GLOSS_ALPHA, edge: '#b8801a', rim: '#ffd166', glow: '0 0 12px rgba(255,209,102,0.7)' },
};

export type TileTokens = Record<`--tile-${string}`, string>;

export function tileTokens(skin: TileSkinId, evolution: 0 | 1 | 2): TileTokens {
  const palette = TILE_SKIN_PALETTES[skin];
  const look = EVOLUTIONS[evolution];
  return {
    '--tile-from': palette.from,
    '--tile-to': palette.to,
    '--tile-edge': look.edge ?? palette.edge,
    '--tile-rim': look.rim ?? palette.rim,
    '--tile-ink': palette.ink,
    '--tile-num': palette.num,
    '--tile-num-x': palette.numAt.x,
    '--tile-num-y': palette.numAt.y,
    '--tile-radius': palette.radius,
    '--tile-depth-scale': String(palette.depth),
    '--tile-accent': palette.accent,
    '--tile-gloss': String(look.gloss),
    '--tile-glow': look.glow,
    '--tile-gap-x': `${BOARD_GAP.x}px`,
    '--tile-gap-y': `${BOARD_GAP.y}px`,
  };
}
