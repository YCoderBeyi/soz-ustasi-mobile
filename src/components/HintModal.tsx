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
  payWithAd: () => void;
}

export function HintModal() {
  const {
    coins, setModal, play,
    revealMeaningHint, revealLetterHint, revealMeaningHintViaAd, revealLetterHintViaAd,
  } = useGame();
  const adsLeft = useRewardedAdsLeftToday();
  const canAfford = coins >= HINT_COST;

  const options: HintOption[] = [
    {
      id: 'letter',
      title: 'Harf Aç',
      description: 'Bir kelimenin bir harfini tahtada göster.',
      pay: revealLetterHint,
      payWithAd: () => { void revealLetterHintViaAd(); },
    },
    {
      id: 'meaning',
      title: 'Anlam İpucu',
      description: 'Bulamadığın bir kelimenin anlamını oku.',
      pay: revealMeaningHint,
      payWithAd: () => { void revealMeaningHintViaAd(); },
    },
  ];

  return (
    <Modal title="İpucu Kullan" onClose={() => { play('tap'); setModal(null); }}>
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
                  onClick={() => { play('tap'); option.payWithAd(); }}
                  aria-label={`${option.title}, reklam izleyerek, bugün ${adsLeft} hak kaldı`}
                >
                  <span aria-hidden="true">▶</span>
                  <b>Reklam</b>
                  <small>{adsLeft}</small>
                </button>
              )}
            </div>
          </section>
        ))}
      </div>
      {!canAfford && adsLeft === 0 && <p className="modalWarning">Daha fazla altına ihtiyacın var.</p>}
    </Modal>
  );
}
