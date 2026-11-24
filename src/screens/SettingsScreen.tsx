import '../styles/settings.css';
import { useGame } from '../store/GameContext';
import { ActionIconButton } from '../components/ActionIconButton';
import { PrivacyModal } from '../components/PrivacyModal';
import { showAdPrivacyOptions } from '../services/admob';

export function SettingsScreen() {
  const {
    setScreen, play, soundEnabled, setSoundEnabled, soundVolume, setSoundVolume,
    hapticsEnabled, setHapticsEnabled, calmMode, setCalmMode, setModal,
    reduceMotion, setReduceMotion, leagueOptIn, setLeagueOptIn, setLeagueConsentAnswered, modal,
  } = useGame();
  const soundActive = soundEnabled && soundVolume > 0;

  return (
    <main className="screen settingsScreen">
      <div className="settingsSurface" aria-hidden="true" />
      <header className="settingsHeader">
        <ActionIconButton icon="back" onClick={() => { play('tap'); setScreen('profile'); }} ariaLabel="Geri" size="lg" />
        <h1>Ayarlar</h1><div className="settingsHeaderSpacer" />
      </header>
      <section className="settingsList">
        <p className="settingsGroupLabel">Rahat oyun</p>
        <button className="settingsItem" role="switch" aria-checked={calmMode} aria-labelledby="calm-mode-label" aria-describedby="calm-mode-description" onClick={() => { play('tap'); setCalmMode(!calmMode); }}>
          <span><strong id="calm-mode-label">Sakin Mod</strong><small id="calm-mode-description">Yanlış denemeler serini ve kusursuz hedefini bozmaz</small></span>
          <i className={calmMode ? 'active' : ''}><b /></i>
        </button>
        <button className="settingsItem" role="switch" aria-checked={reduceMotion} onClick={() => setReduceMotion(!reduceMotion)}>
          <span><strong>Hareketi Azalt</strong><small>Animasyonları ve hareketli efektleri azalt</small></span>
          <i className={reduceMotion ? 'active' : ''} aria-hidden="true"><b /></i>
        </button>

        <p className="settingsGroupLabel">Lig (isteğe bağlı)</p>
        <p className="settingsGroupDescription">Açıkken ve Play Games oturumun varken seviye puanın ile toplam yıldızların herkese açık sıralamalara gönderilir. Bu tercih ilk açılışta sorulur; istediğin zaman buradan değiştirebilirsin. Daha önce gönderilen skorlar kapanınca silinmez.</p>
        <button
          className="settingsItem"
          role="switch"
          aria-checked={leagueOptIn}
          aria-labelledby="league-opt-in-label"
          aria-describedby="league-opt-in-description"
          onClick={() => {
            play('tap');
            setLeagueOptIn(!leagueOptIn);
            setLeagueConsentAnswered(true);
          }}
        >
          <span>
            <strong id="league-opt-in-label">Play Games Ligine Katıl</strong>
            <small id="league-opt-in-description">Haftalık puan ve toplam yıldız sıralaması; Sakin Mod’da skor gönderilmez</small>
          </span>
          <i className={leagueOptIn ? 'active' : ''} aria-hidden="true"><b /></i>
        </button>

        <p className="settingsGroupLabel">Ses ve dokunuş</p>
        <button
          className="settingsItem"
          role="switch"
          aria-checked={soundActive}
          onClick={() => {
            if (soundActive) {
              setSoundEnabled(false);
              return;
            }
            if (soundVolume === 0) {
              setSoundVolume(80);
            }
            setSoundEnabled(true);
          }}
        >
          <span><strong>Ses Efektleri</strong><small>Tüm dokunuş, harf, ödül ve mühür seslerini yönet</small></span>
          <i className={soundActive ? 'active' : ''}><b /></i>
        </button>
        <div className="settingsVolume">
          <div className="settingsVolumeHeader">
            <span><strong>Efekt Ses Seviyesi</strong><small>Tüm efekt sesleri için tek denetim</small></span>
            <output>{soundVolume}%</output>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={soundVolume}
            aria-label="Efekt ses seviyesi"
            onChange={(event) => {
              const value = Number(event.target.value);
              setSoundVolume(value);
              if (value > 0 && !soundEnabled) setSoundEnabled(true);
            }}
            onPointerUp={(event) => {
              const value = Number((event.currentTarget as HTMLInputElement).value);
              if ((soundEnabled || value > 0) && value > 0) play('correct');
            }}
            onKeyUp={(event) => {
              const value = Number((event.currentTarget as HTMLInputElement).value);
              if (value > 0 && !soundEnabled) setSoundEnabled(true);
              if ((soundEnabled || value > 0) && value > 0) play('correct');
            }}
          />
          <div className="settingsVolumeScale"><span>Sessiz</span><span>Güçlü</span></div>
        </div>
        <button className="settingsItem" role="switch" aria-checked={hapticsEnabled} onClick={() => { play('tap'); setHapticsEnabled(!hapticsEnabled); }}>
          <span><strong>Dokunsal Geri Bildirim</strong><small>Dokunuşlarda titreşim kullan</small></span>
          <i className={hapticsEnabled ? 'active' : ''}><b /></i>
        </button>

        <p className="settingsGroupLabel">Gizlilik</p>
        <button className="settingsItem" onClick={() => { play('tap'); void showAdPrivacyOptions(); }}>
          <span><strong>Reklam Gizlilik Tercihleri</strong><small>İsteğe bağlıdır; Google seçeneklerini yönet</small></span>
          <b aria-hidden="true">›</b>
        </button>
        <div className="settingsAbout"><span>Sürüm</span><strong>Söz Ustası {__APP_VERSION__}</strong></div>
      </section>
      <footer className="settingsFooter">
        <button onClick={() => { play('tap'); setModal('privacy'); }}>Gizlilik Politikası <b>&gt;</b></button>
        <p>İlerlemen yalnızca bu cihazda saklanır.</p>
        <p>Bonus kelime adayları hunspell-tr sözlüğünden (MPL 2.0, github.com/tdd-ai/hunspell-tr) derlenip elle denetlenmiştir.</p>
      </footer>
      {modal === 'privacy' && <PrivacyModal />}
    </main>
  );
}
