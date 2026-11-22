// Tile skins are data. The engine only asks which skin a level uses and how evolved it looks.
export type TileSkinId = 'classic' | 'candy' | 'fruit' | 'block';

/** Original generic styles only; no third-party game branding or trade dress. */
export const TILE_SKIN_CYCLE: readonly TileSkinId[] = ['candy', 'fruit', 'block'];

/** Levels per skin before the cycle moves on. Level 1..SKIN_BAND stays classic so the first minutes are calm. */
const SKIN_BAND = 10;

/** Fixed for the whole level; never changes mid-level. */
export function skinForLevel(levelId: number): TileSkinId {
  if (levelId <= SKIN_BAND) return 'classic';
  const band = Math.floor((levelId - SKIN_BAND - 1) / SKIN_BAND);
  return TILE_SKIN_CYCLE[band % TILE_SKIN_CYCLE.length];
}

export interface TileSkinPalette {
  /** Face gradient, top-left to bottom-right. */
  from: string;
  to: string;
  /** Visible side of the tile (the 2.5D thickness). */
  edge: string;
  /** Bevel/border highlight color. */
  rim: string;
  /** Letter color; must hold 4.5:1 on every face stop, glossy included. */
  ink: string;
  /** Small clue-number color. */
  num: string;
  /** Where the clue number sits inside the face (CSS offsets); round skins pull it inward so it never leaves the shape. */
  numAt: { x: string; y: string };
  /** CSS border-radius of the face. */
  radius: string;
  /** Thickness multiplier of the 2.5D lower face (block is chunky, jelly is soft). */
  depth: number;
  /** Skin detail color: leaf (fruit), lit top face (block), highlight (candy, classic). Never carries text. */
  accent: string;
}

/** Filled-tile look per skin. The single source for colors; CSS only reads the derived tokens. */
export const TILE_SKIN_PALETTES: Record<TileSkinId, TileSkinPalette> = {
  classic: { from: '#fff3d0', to: '#e8bd62', edge: '#a9741c', rim: '#f6dc8e', ink: '#3a2508', num: '#6b4a12', numAt: { x: '4px', y: '2px' }, radius: '9px', depth: 1, accent: '#fff8e1' },
  candy: { from: '#ffd9ea', to: '#ff9cc7', edge: '#d9608f', rim: '#ffe9f3', ink: '#3d0a25', num: '#7a2350', numAt: { x: '13%', y: '9%' }, radius: '36%', depth: 1.15, accent: '#ffffff' },
  fruit: { from: '#e3f9b8', to: '#a7e064', edge: '#6aa532', rim: '#f1fcd6', ink: '#1a3306', num: '#3c6a14', numAt: { x: '22%', y: '17%' }, radius: '50% 50% 44% 44%', depth: 1, accent: '#4f9d2d' },
  block: { from: '#e6d2b0', to: '#c79a63', edge: '#8a5f2e', rim: '#f2e3c6', ink: '#241505', num: '#5a3a14', numAt: { x: '4px', y: '2px' }, radius: '3px', depth: 1.5, accent: '#f7ead0' },
};

/** Highest white overlay the gloss layer may add; contrast is checked against it. */
export const EVOLUTION_GLOSS_ALPHA = 0.4;

/** Evolution follows the multiplier tier: 0 plain, 1 glossy, 2 golden. Higher tiers stay golden. */
export function skinEvolution(multiplierTier: number): 0 | 1 | 2 {
  if (multiplierTier >= 2) return 2;
  return multiplierTier >= 1 ? 1 : 0;
}
