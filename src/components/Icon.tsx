export const ICON_MAP_V1 = {
  hint: '/assets/ui/svg/01-icon-hint.svg',
  shuffle: '/assets/ui/svg/02-icon-shuffle.svg',
  seal: '/assets/ui/svg/03-icon-seal.svg',
  dictionary: '/assets/ui/svg/04-icon-dictionary.svg',
  tasks: '/assets/ui/svg/05-icon-tasks.svg',
  shop: '/assets/ui/svg/06-icon-shop.svg',
  settings: '/assets/ui/svg/07-icon-settings.svg',
  sound: '/assets/ui/svg/08-icon-sound.svg',
  life: '/assets/ui/svg/09-icon-life.svg',
  daily: '/assets/ui/svg/10-icon-daily-reward.svg',
  home: '/assets/ui/svg/11-icon-home.svg',
  map: '/assets/ui/svg/12-icon-map.svg',
  play: '/assets/ui/svg/13-icon-play.svg',
  events: '/assets/ui/svg/14-icon-events.svg',
  crown: '/assets/ui/svg/15-icon-crown.svg',
  back: '/assets/ui/svg/16-icon-back.svg',
  close: '/assets/ui/svg/17-icon-close.svg',
  coin: '/assets/ui/svg/18-icon-coin.svg',
  gem: '/assets/ui/svg/19-icon-gem.svg',
  energy: '/assets/ui/svg/20-icon-energy.svg',
} as const;

export const ICON_MAP_V2 = {
  back: '/assets/ui/v2/01-back-button.svg',
  settings: '/assets/ui/v2/02-settings-button.svg',
  coinPill: '/assets/ui/v2/03-coin-pill.svg',
  timerPill: '/assets/ui/v2/04-timer-pill.svg',
  waxSeal: '/assets/ui/v2/05-wax-seal-button.svg',
  hintButton: '/assets/ui/v2/06-hint-action-button.svg',
  shuffleButton: '/assets/ui/v2/07-shuffle-action-button.svg',
  sealButton: '/assets/ui/v2/08-seal-action-button.svg',
  bottomTasks: '/assets/ui/v2/09-bottom-tasks.svg',
  bottomDictionary: '/assets/ui/v2/10-bottom-dictionary.svg',
  bottomMap: '/assets/ui/v2/11-bottom-map.svg',
  bottomMapActive: '/assets/ui/v2/11-bottom-map-active.svg',
  bottomShop: '/assets/ui/v2/12-bottom-shop.svg',
  bottomProfile: '/assets/ui/v2/13-bottom-profile.svg',
  wordTileEmpty: '/assets/ui/v2/14-word-tile-empty.svg',
  letterNode: '/assets/ui/v2/15-letter-node.svg',
  letterNodeSelected: '/assets/ui/v2/16-letter-node-selected.svg',
  soundButton: '/assets/ui/v2/17-sound-button.svg',
  soundOffButton: '/assets/ui/v2/18-sound-off-button.svg',
  closeButton: '/assets/ui/v2/19-close-button.svg',
  buttonGold: '/assets/ui/v2/20-button-gold.svg',
  buttonGreen: '/assets/ui/v2/21-button-green.svg',
  buttonBlue: '/assets/ui/v2/22-button-blue.svg',
  wordTileFilled: '/assets/ui/v2/23-word-tile-filled.svg',
  tabActive: '/assets/ui/v2/24-tab-active.svg',
  tabInactive: '/assets/ui/v2/25-tab-inactive.svg',
  shopBuy: '/assets/ui/v2/26-shop-buy.svg',
  meaningCard: '/assets/ui/v2/27-meaning-card.svg',
  mapHeroPanel: '/assets/ui/v2/28-map-hero-panel.svg',
  mapFeaturedPanel: '/assets/ui/v2/29-map-featured-panel.svg',
  mapStatChip: '/assets/ui/v2/30-map-stat-chip.svg',
  mapWidgetPanel: '/assets/ui/v2/31-map-widget-panel.svg',
  levelBadge: '/assets/ui/v2/32-level-badge.svg',
  wheelRing: '/assets/ui/v2/33-wheel-ring.svg',
  gridPanel: '/assets/ui/v2/34-grid-panel.svg',
  wordPill: '/assets/ui/v2/35-word-pill.svg',
  statChip: '/assets/ui/v2/36-stat-chip.svg',
} as const;

export type IconName = keyof typeof ICON_MAP_V1;
export type V2IconName = keyof typeof ICON_MAP_V2;

export function Icon({ name, size, className = '', alt = '' }: { name: IconName; size?: number; className?: string; alt?: string }) {
  return (
    <img
      src={ICON_MAP_V1[name]}
      alt={alt}
      className={className}
      style={size ? {
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'inline-block',
        flexShrink: 0,
        verticalAlign: 'middle',
      } : undefined}
    />
  );
}

export function V2Icon({ name, size, className = '', alt = '' }: { name: V2IconName; size?: number; className?: string; alt?: string }) {
  return (
    <img
      src={ICON_MAP_V2[name]}
      alt={alt}
      className={className}
      style={size ? {
        width: size,
        height: size,
        objectFit: 'contain',
        display: 'block',
      } : { display: 'block', width: '100%', height: 'auto' }}
    />
  );
}
