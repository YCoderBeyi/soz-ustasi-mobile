import '../styles/profile.css';
import { useGame } from '../store/GameContext';
import { V2Icon } from '../components/Icon';
import { BottomNavBar } from '../components/BottomNavBar';
import { WaxSeal } from '../components/WaxSeal';
import type { CSSProperties } from 'react';

export function ProfileScreen() {
  const {
    screen,
    setScreen,
    play,
    coins,
    soundEnabled,
    setSoundEnabled,
    favoriteWords,
    theme,
  } = useGame();

  return (
    <main
      className="screen profileScreen"
      style={{ '--accent': theme.primaryColor, '--theme-bg': `url(${theme.backgroundImage})` } as CSSProperties}
    >
      <div className="themeBackdrop" />

      <header className="profileHeader">
        <button className="svgBtn topIconBtn" onClick={() => { play('tap'); setScreen('map'); }} aria-label="Geri">
          <V2Icon name="back" />
        </button>
        <div className="levelBadge3d">
          <V2Icon name="levelBadge" className="levelBadge3dBg" />
          <span className="levelBadge3dLabel">Profil</span>
        </div>
        <div className="profileHeaderSpacer" />
      </header>

      <div className="profileAvatar">
        <WaxSeal className="profileSeal" label="S" />
        <h2>Oyuncu</h2>
        <p className="profileSubtitle">Kelimelerin ustası</p>
      </div>

      <div className="profileStats">
        <div className="profileStatItem">
          <strong>{coins}</strong>
          <span>Altın</span>
        </div>
        <div className="profileStatItem">
          <strong>{favoriteWords.length}</strong>
          <span>Favori Kelime</span>
        </div>
        <div className="profileStatItem">
          <strong>0</strong>
          <span>Tamamlanan</span>
        </div>
      </div>

      <div className="profileActions">
        <button className="profileActionBtn" onClick={() => { play('tap'); setScreen('settings'); }}>
          <V2Icon name="settings" />
          <span>Ayarlar</span>
        </button>
        <button className="profileActionBtn" onClick={() => { play('tap'); setScreen('dictionary'); }}>
          <V2Icon name="bottomDictionary" />
          <span>Sözlük</span>
        </button>
        <button className="profileActionBtn" onClick={() => { play('tap'); setScreen('shop'); }}>
          <V2Icon name="bottomShop" />
          <span>Mağaza</span>
        </button>
      </div>

      <div className="profileInfo">
        <p>
          Söz Ustası tamamen çevrimdışı çalışan bir kelime oyunudur.
          İlerlemen yerel olarak kaydedilir.
        </p>
      </div>

      <BottomNavBar />
    </main>
  );
}
