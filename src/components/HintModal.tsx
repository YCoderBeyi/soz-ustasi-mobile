import { useState } from 'react';
import '../styles/hint.css';
import { useGame } from '../store/GameContext';
import { Modal } from './Modal';
import { useRewardedAdsLeftToday } from '../services/useRewardedAdsLeft';

const HINT_COST = 20;

interface HintOption {
  id: 'meaning' | 'letter';
  title: string;
  description: string;
  pay: () => void;
  payWithAd: () => Promise<void>;
}

export function HintModal() {
  const {
    coins, setModal, play,
    revealMeaningHint, revealLetterHint, revealMeaningHintViaAd, revealLetterHintViaAd,
  } = useGame();
  const adsLeft = useRewardedAdsLeftToday();
  const canAfford = coins >= HINT_COST;
  const [adPending, setAdPending] = useState<HintOption['id'] | null>(null);

  const useAd = async (option: HintOption) => {
    if (adPending) return;
    setAdPending(option.id);
    try {
      await option.payWithAd();
    } finally {
      setAdPending(null);
    }
  };

  const options: HintOption[] = [
    {
      id: 'letter',
      title: 'Harf Aç',
      description: 'Bir kelimenin bir harfini tahtada göster.',
      pay: revealLetterHint,
      payWithAd: revealLetterHintViaAd,
    },
    {
      id: 'meaning',
      title: 'Anlam İpucu',
      description: 'Bulamadığın bir kelimenin anlamını oku.',
      pay: revealMeaningHint,
      payWithAd: revealMeaningHintViaAd,
    },
  ];

  return (
    <Modal
      title="İpucu Kullan"
      closeLabel="İpucu penceresini kapat"
      onClose={() => { play('tap'); setModal(null); }}
    >
      <p className="hintAutonomyNote">
        İpucu isteğe bağlıdır. Reklam izlemek zorunda değilsin; kapatıp kendi başına devam edebilirsin.
      </p>
      <div className="hintOptions">
        {options.map((option) => (
          <section key={option.id} className={`hintCard hintCard--${option.id}`} aria-label={option.title}>
            <div className="hintCardText">
              <strong>{option.title}</strong>
              <span>{option.description}</span>
            </div>
            <div className="hintCardActions">
              <button
                type="button"
                className="hintPay hintPay--coin"
                disabled={!canAfford}
                onClick={() => { play('tap'); option.pay(); }}
                aria-label={`${option.title}, ${HINT_COST} altın`}
              >
                <img className="hintCoinIcon" src="/assets/map/topbar-3d/topbar-coin.png" alt="" />
                <b>{HINT_COST}</b>
              </button>
              {adsLeft > 0 && (
                <button
                  type="button"
                  className="hintPay hintPay--ad"
                  onClick={() => { play('tap'); void useAd(option); }}
                  disabled={adPending !== null}
                  aria-busy={adPending === option.id}
                  aria-label={`${option.title}, isteğe bağlı reklam, bugün ${adsLeft} hak kaldı`}
                >
                  <span aria-hidden="true">▶</span>
                  <b>{adPending === option.id ? 'Reklam açılıyor…' : 'Reklam izle'}</b>
                  <small>{adsLeft}</small>
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
      {!canAfford && adsLeft === 0 && (
        <p className="modalWarning">Daha fazla altına ihtiyacın var. Reklam hakkı da kalmadı.</p>
      )}
      {!canAfford && adsLeft > 0 && (
        <p className="modalWarning">Altının yetmiyor; istersen reklamla ipucu alabilirsin.</p>
      )}
    </Modal>
  );
}
