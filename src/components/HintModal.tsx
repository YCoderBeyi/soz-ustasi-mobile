import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { V2Icon } from './Icon';
import { Button3D } from './Button3D';

export function HintModal() {
  const { coins, setModal, revealMeaningHint, revealLetterHint, play } = useGame();

  return (
    <Modal title="İpucu Kullan" onClose={() => { play('tap'); setModal(null); }}>
      <Button3D variant="gold" onClick={revealMeaningHint} className="hintBtn3d">
        Anlam İpucu · <V2Icon name="coinPill" size={18} className="inline-coin-v2" /> 20
      </Button3D>
      <Button3D variant="green" onClick={revealLetterHint} className="hintBtn3d">
        Harf Aç · <V2Icon name="coinPill" size={18} className="inline-coin-v2" /> 20
      </Button3D>
      {coins < 20 && <p className="modalWarning">Daha fazla altına ihtiyacın var!</p>}
    </Modal>
  );
}
