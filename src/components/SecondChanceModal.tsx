import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { Button3D } from './Button3D';
import { useRewardedAdsLeftToday } from '../services/useRewardedAdsLeft';

export function SecondChanceModal() {
  const { play, acceptSecondChance, declineSecondChance } = useGame();
  const adsLeft = useRewardedAdsLeftToday();
  const [adPending, setAdPending] = useState(false);

  const watchAd = async () => {
    if (adPending) return;
    setAdPending(true);
    try {
      await acceptSecondChance();
    } finally {
      setAdPending(false);
    }
  };

  return (
    <Modal title="Bir kelime daha deneyebilirsin" closeLabel="Kapat ve devam et" onClose={() => { play('tap'); declineSecondChance(); }}>
      <p className="modalWarning" style={{ textAlign: 'center' }}>
        Bu deneme olmadı; oyun devam ediyor.
        <br />
        Bulduğun kelimeler korunuyor. Devam etmek için reklam gerekmez.
        {adsLeft > 0 && ' İstersen isteğe bağlı reklamla bu turdaki serini ve kusursuz bonusunu koru.'}
      </p>
      {adsLeft > 0 && (
        <Button3D variant="blue" disabled={adPending} onClick={() => { play('tap'); void watchAd(); }}>
          {adPending ? 'Reklam açılıyor…' : `Serimi Reklamla Koru (${adsLeft})`}
        </Button3D>
      )}
      <Button3D variant="green" disabled={adPending} onClick={() => { play('tap'); declineSecondChance(); }}>
        Reklamsız Devam Et
      </Button3D>
    </Modal>
  );
}
