export const gameAssets = {
  start: {
    background: '/assets/themes/old_istanbul/background.webp',
    logoPlaque: '/assets/ui/start/logo-plaque.png',
    waxSeal: '/assets/ui/start/wax-seal-s.png',
    goldButton: '/assets/ui/start/button-gold-frame.svg',
    blueButton: '/assets/ui/start/button-blue-frame.svg',
    welcomePlaque: '/assets/ui/start/welcome-plaque.svg',
    progressFrame: '/assets/ui/start/progress-frame.svg',
  },
  map: {
    background: '/assets/screens/map/map-background.webp',
    topHeader: '/assets/ui/map/top-header-bar.png',
    chapterTitle: '/assets/ui/map/chapter-title-plaque.svg',
    dailyReward: '/assets/ui/map/daily-reward-widget.png',
    regionCard: '/assets/ui/map/region-card-frame.png',
    levelGold: '/assets/ui/map/level-node-gold.png',
    levelActive: '/assets/ui/map/level-node-active-blue.png',
    levelLocked: '/assets/ui/map/level-node-locked-wax.png',
    bottomNav: '/assets/ui/map/bottom-nav-bar.png',
  },
  gameplay: {
    board: '/assets/ui/gameplay/crossword-board-bg.svg',
    tileEmpty: '/assets/ui/gameplay/crossword-tile-empty.svg',
    tileFilled: '/assets/ui/gameplay/crossword-tile-filled.svg',
    tileHint: '/assets/ui/gameplay/crossword-tile-hint.svg',
    wheel: '/assets/ui/gameplay/letter-wheel-bg.svg',
    letterNormal: '/assets/ui/gameplay/letter-node-normal.svg',
    letterSelected: '/assets/ui/gameplay/letter-node-selected.svg',
    meaningCard: '/assets/ui/gameplay/meaning-card.svg',
  },
} as const;

export function assetPath(path: string): string {
  return path;
}
