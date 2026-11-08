import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { Button3D } from './Button3D';
import { useRewardedAdsLeftToday } from '../services/useRewardedAdsLeft';

export function SecondChanceModal() {
  const { play, acceptSecondChance, declineSecondChance } = useGame();
  const adsLeft = useRewardedAdsLeftToday();

  return (
    <Modal title="İkinci Şans" onClose={() => { play('tap'); declineSecondChance(); }}>
      <p className="modalWarning" style={{ textAlign: 'center' }}>
        Bu yanlışı affettirmek ister misin?
        <br />
        Reklam izle, kusursuz bonus ve serin korunsun.
      </p>
      {adsLeft > 0 && (
        <Button3D variant="gold" onClick={() => { play('tap'); void acceptSecondChance(); }}>
          Reklam İzle (Kalan: {adsLeft})
        </Button3D>
      )}
      <Button3D variant="blue" onClick={() => { play('tap'); declineSecondChance(); }}>
        Vazgeç
      </Button3D>
    </Modal>
  );
}
