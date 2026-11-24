import { useState } from 'react';
import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { PremiumPrimaryButton } from './PremiumPrimaryButton';
import { fullscreenCooldownMessage } from '../services/ads/cooldownCopy';
import { useFullscreenCooldownRemaining } from '../services/useFullscreenCooldown';
import { useRewardedAdsLeftToday } from '../services/useRewardedAdsLeft';

export function SecondChanceModal() {
  const { play, acceptSecondChance, declineSecondChance } = useGame();
  const adsLeft = useRewardedAdsLeftToday();
  const cooldownLeft = useFullscreenCooldownRemaining();
  const [adPending, setAdPending] = useState(false);
  const canStartAd = adsLeft > 0 && cooldownLeft <= 0;

  const watchAd = async () => {
    if (adPending || !canStartAd) return;
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
        {canStartAd && ' İstersen isteğe bağlı reklamla bu turdaki serini ve kusursuz bonusunu koru.'}
        {adsLeft > 0 && cooldownLeft > 0 && ` ${fullscreenCooldownMessage(cooldownLeft)}`}
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
            disabled={adPending || cooldownLeft > 0}
            onClick={() => { play('tap'); void watchAd(); }}
          >
            {adPending
              ? 'Reklam açılıyor…'
              : cooldownLeft > 0
                ? `${cooldownLeft} sn bekle`
                : `Serimi Reklamla Koru (${adsLeft})`}
          </PremiumPrimaryButton>
        )}
      </div>
    </Modal>
  );
}
