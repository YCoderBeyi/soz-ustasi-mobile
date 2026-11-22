import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { PremiumPrimaryButton } from './PremiumPrimaryButton';
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

  const continueWithoutAd = () => {
    play('tap');
    declineSecondChance();
  };

  return (
    <Modal
      title="Bir kelime daha deneyebilirsin"
      closeLabel="Reklamsız devam et"
      onClose={continueWithoutAd}
    >
      <p className="modalWarning" style={{ textAlign: 'center' }}>
        Bu deneme olmadı; oyun devam ediyor.
        <br />
        Bulduğun kelimeler korunuyor. Devam etmek için reklam gerekmez.
        {adsLeft > 0 && ' İstersen isteğe bağlı reklamla bu turdaki serini ve kusursuz bonusunu koru.'}
      </p>
      <div className="modalCtaStack">
        <PremiumPrimaryButton
          size="compact"
          className="modalCta modalCta--primary"
          disabled={adPending}
          onClick={continueWithoutAd}
        >
          Reklamsız Devam Et
        </PremiumPrimaryButton>
        {adsLeft > 0 && (
          <PremiumPrimaryButton
            size="compact"
            variant="secondary"
            className="modalCta modalCta--secondary"
            disabled={adPending}
            onClick={() => { play('tap'); void watchAd(); }}
          >
            {adPending ? 'Reklam açılıyor…' : `Serimi Reklamla Koru (${adsLeft})`}
          </PremiumPrimaryButton>
        )}
      </div>
    </Modal>
  );
}
