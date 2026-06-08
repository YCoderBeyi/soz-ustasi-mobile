import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { Button3D } from './Button3D';

export function PauseModal() {
  const { play, setModal, setScreen, startLevel, level, soundEnabled, setSoundEnabled, hapticsEnabled, setHapticsEnabled } = useGame();

  return (
    <Modal title="Söz Ustası" onClose={() => { play('tap'); setModal(null); }}>
      <Button3D variant="green" onClick={() => { play('tap'); setModal(null); }}>Devam Et</Button3D>
      <Button3D variant="gold" onClick={() => { play('tap'); setSoundEnabled(!soundEnabled); }}>
        Ses {soundEnabled ? 'Açık' : 'Kapalı'}
      </Button3D>
      <Button3D variant="gold" onClick={() => { play('tap'); setHapticsEnabled(!hapticsEnabled); }}>
        Titreşim {hapticsEnabled ? 'Açık' : 'Kapalı'}
      </Button3D>
      <Button3D variant="blue" onClick={() => { play('tap'); startLevel(level); }}>Leveli Yeniden Başlat</Button3D>
      <Button3D variant="blue" onClick={() => { play('tap'); setScreen('map'); }}>Ana Haritaya Dön</Button3D>
      <Button3D variant="blue" onClick={() => { play('tap'); setModal('privacy'); }}>Gizlilik Politikası</Button3D>
    </Modal>
  );
}
