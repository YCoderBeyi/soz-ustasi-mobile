import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { Modal } from './Modal';

export function PauseModal() {
  const { play, setModal, setScreen, startLevel, level, soundEnabled, setSoundEnabled, hapticsEnabled, setHapticsEnabled, reduceMotion, setReduceMotion } = useGame();
  const [confirmRestart, setConfirmRestart] = useState(false);
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
          <button className={soundEnabled ? 'active' : ''} aria-pressed={soundEnabled} onClick={() => { play('tap'); setSoundEnabled(!soundEnabled); }}>
            <span>Ses</span><strong>{soundEnabled ? 'Açık' : 'Kapalı'}</strong>
          </button>
          <button className={hapticsEnabled ? 'active' : ''} aria-pressed={hapticsEnabled} onClick={() => { play('tap'); setHapticsEnabled(!hapticsEnabled); }}>
            <span>Titreşim</span><strong>{hapticsEnabled ? 'Açık' : 'Kapalı'}</strong>
          </button>
          <button className={reduceMotion ? 'active' : ''} aria-pressed={reduceMotion} onClick={() => { play('tap'); setReduceMotion(!reduceMotion); }}>
            <span>Hareket</span><strong>{reduceMotion ? 'Az' : 'Normal'}</strong>
          </button>
        </div>
        {confirmRestart
          ? action('Emin misin? Yeniden başlat', 'Bu levelde bulduğun kelimeler sıfırlanır', 'danger', () => { play('tap'); startLevel(level); })
          : action('Leveli Yeniden Başlat', 'Bu leveldeki ilerleme sıfırlanır', 'secondary', () => { play('tap'); setConfirmRestart(true); })}
        {action('Ana Haritaya Dön', 'İlerlemen korunur', 'secondary', () => { play('tap'); setScreen('map'); })}
        <button className="pausePrivacy" onClick={() => { play('tap'); setModal('privacy'); }}>Gizlilik Politikası</button>
      </div>
    </Modal>
  );
}
