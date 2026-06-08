import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { Button3D } from './Button3D';

export function HintModal() {
  const { coins, setModal, revealMeaningHint, revealLetterHint } = useGame();

  return (
    <Modal title="İpucu Kullan" onClose={() => setModal(null)}>
      <Button3D variant="gold" onClick={revealMeaningHint}>Anlam İpucu · <Icon name="coin" size={18} /> 20</Button3D>
      <Button3D variant="green" onClick={revealLetterHint}>Harf Aç · <Icon name="coin" size={18} /> 20</Button3D>
      {coins < 20 && <p className="modalWarning">Bu ipucu için 20 elmas gerekir.</p>}
    </Modal>
  );
}
