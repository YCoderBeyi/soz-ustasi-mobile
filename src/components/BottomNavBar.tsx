import { useGame } from '../store/GameContext';
import type { ScreenName } from '../types';
import { V2Icon, type V2IconName } from './Icon';

const tabs: { id: ScreenName; label: string; icon: V2IconName; activeIcon?: V2IconName; center?: boolean }[] = [
  { id: 'map', label: 'Görevler', icon: 'bottomTasks' },
  { id: 'dictionary', label: 'Sözlük', icon: 'bottomDictionary' },
  { id: 'map', label: 'Harita', icon: 'bottomMap', activeIcon: 'bottomMapActive', center: true },
  { id: 'shop', label: 'Mağaza', icon: 'bottomShop' },
  { id: 'profile', label: 'Profil', icon: 'bottomProfile' },
];

export function BottomNavBar() {
  const { screen, setScreen, play } = useGame();

  const isActive = (tabId: ScreenName, center?: boolean) => {
    if (center) return screen === 'map' || screen === 'game';
    if (tabId === 'map') return screen === 'map' || screen === 'game';
    return screen === tabId;
  };

  const handleNav = (tabId: ScreenName) => {
    play('tap');
    setScreen(tabId);
  };

  return (
    <nav className="bottomNavBar">
      {tabs.map((tab, i) => {
        const active = isActive(tab.id, tab.center);
        const iconName = active && tab.activeIcon ? tab.activeIcon : tab.icon;
        const isCenter = tab.center === true;
        return (
          <button
            key={`${tab.id}-${i}`}
            className={`bottomNavItem ${active ? 'bottomNavActive' : ''} ${isCenter ? 'bottomNavCenter' : ''}`}
            onClick={() => handleNav(tab.id)}
            aria-label={tab.label}
            aria-current={active ? 'page' : undefined}
          >
            {isCenter ? (
              <span className="bottomNavCenterIcon">
                <V2Icon name={iconName} className="bottomNavSvg" />
              </span>
            ) : (
              <>
                <V2Icon name={iconName} className={`bottomNavSvg ${active ? '' : 'bottomNavSvgInactive'}`} />
                <span className="bottomNavLabel">{tab.label}</span>
              </>
            )}
          </button>
        );
      })}
    </nav>
  );
}
