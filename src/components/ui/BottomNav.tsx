import { useGame } from '../../store/GameContext';
import type { ScreenName } from '../../types';
import './BottomNav.css';

type NavItem = {
  key: string;
  label: string;
  icon: string;
  screen?: ScreenName;
};

const items: NavItem[] = [
  { key: 'missions', label: 'Görevler', icon: '/assets/map/nav-3d/nav-missions.png' },
  { key: 'dictionary', label: 'Sözlük', icon: '/assets/map/nav-3d/nav-dictionary.png', screen: 'dictionary' as const },
  { key: 'map', label: 'Harita', icon: '/assets/map/nav-3d/nav-map.png', screen: 'map' as const },
  { key: 'shop', label: 'Mağaza', icon: '/assets/map/nav-3d/nav-shop.png', screen: 'shop' as const },
  { key: 'profile', label: 'Profil', icon: '/assets/map/nav-3d/nav-profile.png', screen: 'profile' as const },
];

export function BottomNav({ active = 'map' }: { active?: string }) {
  const { setScreen, setToast, play } = useGame();

  const handleNav = (item: NavItem) => {
    play('tap');
    if (!item.screen) {
      setToast('Görevler yakında açılacak');
      window.setTimeout(() => setToast(''), 1400);
      return;
    }
    setScreen(item.screen);
  };

  return (
    <nav className="bottom-nav">
      <img className="bottom-nav__bg" src="/assets/map/bottom-nav-panel.svg" alt="" />
      {items.map((item) => (
        <button
          key={item.key}
          className={active === item.key ? 'active' : ''}
          onClick={() => handleNav(item)}
          aria-label={item.label}
          aria-current={active === item.key ? 'page' : undefined}
        >
          <span className="bottom-nav__icon-shell">
            <img src={item.icon} alt="" />
          </span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
