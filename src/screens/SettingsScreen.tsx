import '../styles/settings.css';
import { useGame } from '../store/GameContext';
import { ActionIconButton } from '../components/ActionIconButton';

export function SettingsScreen() {
  const { setScreen, play, soundEnabled, setSoundEnabled, hapticsEnabled, setHapticsEnabled, setModal } = useGame();
  return (
    <main className="screen settingsScreen">
      <div className="settingsSurface" aria-hidden="true" />
      <header className="settingsHeader">
        <ActionIconButton icon="back" onClick={() => { play('tap'); setScreen('profile'); }} ariaLabel="Geri" size="lg" />
        <h1>Ayarlar</h1><div className="settingsHeaderSpacer" />
      </header>
      <section className="settingsList">
        <button className="settingsItem" onClick={() => { play('tap'); setSoundEnabled(!soundEnabled); }}>
          <span><strong>Ses Efektleri</strong><small>Oyun seslerini yönet</small></span>
          <i className={soundEnabled ? 'active' : ''}><b /></i>
        </button>
        <button className="settingsItem" onClick={() => { play('tap'); setHapticsEnabled(!hapticsEnabled); }}>
          <span><strong>Dokunsal Geri Bildirim</strong><small>Dokunuşlarda titreşim kullan</small></span>
          <i className={hapticsEnabled ? 'active' : ''}><b /></i>
        </button>
        <div className="settingsAbout"><span>Sürüm</span><strong>Söz Ustası 1.0</strong></div>
      </section>
      <footer className="settingsFooter">
        <button onClick={() => { play('tap'); setModal('privacy'); }}>Gizlilik Politikası <b>›</b></button>
        <p>İlerlemen yalnızca bu cihazda saklanır.</p>
      </footer>
    </main>
  );
}
