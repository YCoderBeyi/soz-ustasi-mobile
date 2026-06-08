import '../styles/settings.css';
import { useGame } from '../store/GameContext';
import { V2Icon } from '../components/Icon';
import type { CSSProperties } from 'react';

export function SettingsScreen() {
  const {
    setScreen,
    play,
    soundEnabled,
    setSoundEnabled,
    theme,
  } = useGame();

  return (
    <main
      className="screen settingsScreen"
      style={{ '--accent': theme.primaryColor, '--theme-bg': `url(${theme.backgroundImage})` } as CSSProperties}
    >
      <div className="themeBackdrop" />

      <header className="settingsHeader">
        <button className="svgBtn topIconBtn" onClick={() => { play('tap'); setScreen('profile'); }} aria-label="Geri">
          <V2Icon name="back" />
        </button>
        <div className="levelBadge3d">
          <V2Icon name="levelBadge" className="levelBadge3dBg" />
          <span className="levelBadge3dLabel">Ayarlar</span>
        </div>
        <div className="settingsHeaderSpacer" />
      </header>

      <div className="settingsList">
        <div className="settingsItem">
          <div className="settingsItemInfo">
            <strong>Ses Efektleri</strong>
            <span>Oyun içi sesleri aç/kapa</span>
          </div>
          <button
            className={`settingsToggle ${soundEnabled ? 'active' : ''}`}
            onClick={() => { play('tap'); setSoundEnabled(!soundEnabled); }}
            aria-label="Ses efektleri"
          >
            <div className="settingsToggleKnob" />
          </button>
        </div>

        <div className="settingsItem">
          <div className="settingsItemInfo">
            <strong>Hakkında</strong>
            <span>Söz Ustası v1.0</span>
          </div>
        </div>
      </div>

      <div className="settingsFooter">
        <p>Tüm hakları saklıdır.</p>
      </div>
    </main>
  );
}
