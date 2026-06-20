import { useGame } from '../store/GameContext';
import { Modal } from './Modal';

export function PauseModal() {
  const { play, setModal, setScreen, startLevel, level, soundEnabled, setSoundEnabled, hapticsEnabled, setHapticsEnabled, reduceMotion, setReduceMotion } = useGame();
  const action = (label: string, detail: string, kind: string, onClick: () => void) => (
    <button className={`pauseAction pauseAction--${kind}`} onClick={onClick}>
      <span><strong>{label}</strong><small>{detail}</small></span><b aria-hidden="true">›</b>
    </button>
  );

  return (
    <Modal title="Oyun Duraklatıldı" onClose={() => { play('tap'); setModal(null); }}>
      <div className="pauseMenu">
        {action('Devam Et', 'Bulmacaya geri dön', 'primary', () => { play('tap'); setModal(null); })}
        <div className="pauseToggles">
          <button className={soundEnabled ? 'active' : ''} onClick={() => { play('tap'); setSoundEnabled(!soundEnabled); }}>
            <span>Ses</span><strong>{soundEnabled ? 'Açık' : 'Kapalı'}</strong>
          </button>
          <button className={hapticsEnabled ? 'active' : ''} onClick={() => { play('tap'); setHapticsEnabled(!hapticsEnabled); }}>
            <span>Titreşim</span><strong>{hapticsEnabled ? 'Açık' : 'Kapalı'}</strong>
          </button>
          <button className={reduceMotion ? 'active' : ''} aria-pressed={reduceMotion} onClick={() => { play('tap'); setReduceMotion(!reduceMotion); }}>
            <span>Hareketi Azalt</span><strong>{reduceMotion ? 'Açık' : 'Kapalı'}</strong>
          </button>
        </div>
        {action('Leveli Yeniden Başlat', 'Mevcut ilerleme sıfırlanır', 'secondary', () => { play('tap'); startLevel(level); })}
        {action('Ana Haritaya Dön', 'İlerlemen korunur', 'secondary', () => { play('tap'); setScreen('map'); })}
        <button className="pausePrivacy" onClick={() => { play('tap'); setModal('privacy'); }}>Gizlilik Politikası</button>
      </div>
    </Modal>
  );
}
