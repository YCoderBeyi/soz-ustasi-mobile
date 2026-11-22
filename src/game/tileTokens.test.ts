import { describe, expect, it } from 'vitest';
import { BOARD_GAP, tileTokens } from './tileTokens';
import { TILE_SKIN_PALETTES, type TileSkinId } from './tileSkins';

const SKINS = Object.keys(TILE_SKIN_PALETTES) as TileSkinId[];

describe('tileTokens', () => {
  it('emits every token the stylesheet reads, for every skin and evolution', () => {
    for (const skin of SKINS) {
      for (const evolution of [0, 1, 2] as const) {
        const tokens = tileTokens(skin, evolution);
        for (const key of ['from', 'to', 'edge', 'rim', 'ink', 'num', 'num-x', 'num-y', 'radius', 'depth-scale', 'accent', 'gloss', 'glow', 'gap-x', 'gap-y']) {
          expect(tokens[`--tile-${key}`], `${skin}/${evolution}/${key}`).toBeTruthy();
        }
      }
    }
  });

  it('keeps the skin identity and only the gold tier recolors the thickness', () => {
    expect(tileTokens('candy', 0)['--tile-from']).toBe(TILE_SKIN_PALETTES.candy.from);
    expect(tileTokens('candy', 1)['--tile-edge']).toBe(TILE_SKIN_PALETTES.candy.edge);
    expect(tileTokens('candy', 2)['--tile-edge']).not.toBe(TILE_SKIN_PALETTES.candy.edge);
    expect(tileTokens('candy', 2)['--tile-from']).toBe(TILE_SKIN_PALETTES.candy.from);
  });

  it('gets gloss monotonically from evolution 0 to 2', () => {
    const gloss = ([0, 1, 2] as const).map((e) => Number(tileTokens('block', e)['--tile-gloss']));
    expect(gloss[0]).toBeLessThan(gloss[1]);
    expect(gloss[2]).toBeGreaterThanOrEqual(gloss[1]);
  });

  it('exposes the board gap used by CSS and the fit math', () => {
    expect(tileTokens('classic', 0)['--tile-gap-y']).toBe(`${BOARD_GAP.y}px`);
  });
});
