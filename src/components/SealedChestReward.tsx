import '../styles/sealed-chest-reward.css';
import { WaxSeal } from './WaxSeal';

type SealedChestRewardProps = {
  coins: number;
  doubledCoins?: number;
  reduceMotion: boolean;
  sealId?: string | null;
  state: 'sealed' | 'open' | 'claimed';
};

/** Region milestone display. Eligibility and amount come from the shared reward rule. */
export function SealedChestReward({ coins, doubledCoins, reduceMotion, sealId, state }: SealedChestRewardProps) {
  const opened = state === 'open' || state === 'claimed';
  const claimed = state === 'claimed';
  return (
    <section
      className="sealedChestReward"
      data-state={state}
      data-reduce-motion={reduceMotion || undefined}
      role={opened ? 'status' : 'group'}
      aria-label={state === 'open'
        ? `Bölge sandığı açıldı. ${coins} altın kazandın.`
        : claimed
          ? 'Bölge sandığı daha önce açıldı. Bu seviyede tekrar sandık ödülü yok.'
          : `Mühürlü bölge sandığı. Kazanılacak ödül ${coins} altın.`}
    >
      <div className="sealedChestReward__illustration" aria-hidden="true">
        <svg className="sealedChestReward__art" viewBox="0 0 180 136">
          <defs>
            <linearGradient id="chestWood" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#dba553" />
              <stop offset=".48" stopColor="#ad6d31" />
              <stop offset="1" stopColor="#65391d" />
            </linearGradient>
            <linearGradient id="chestLid" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#f9d987" />
              <stop offset=".5" stopColor="#c4863d" />
              <stop offset="1" stopColor="#77431f" />
            </linearGradient>
            <linearGradient id="chestIron" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0" stopColor="#fff0bd" />
              <stop offset=".42" stopColor="#b88b49" />
              <stop offset="1" stopColor="#704d2b" />
            </linearGradient>
            <linearGradient id="chestSide" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#583018" />
              <stop offset="1" stopColor="#9a5b29" />
            </linearGradient>
            <linearGradient id="chestFront" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="#e3ad5c" />
              <stop offset=".18" stopColor="#c17c3b" />
              <stop offset="1" stopColor="#75401f" />
            </linearGradient>
            <radialGradient id="chestRevealGlow">
              <stop offset="0" stopColor="#fff0b3" stopOpacity=".9" />
              <stop offset="1" stopColor="#ffca55" stopOpacity="0" />
            </radialGradient>
          </defs>
          <ellipse cx="90" cy="123" rx="75" ry="11" fill="#050d16" opacity=".55" />
          <ellipse className="sealedChestReward__revealGlow" cx="90" cy="70" rx="68" ry="34" fill="url(#chestRevealGlow)" />
          <g className="sealedChestReward__lid">
            <path d="M18 68V49Q18 19 48 15h84q30 4 30 34v19l-15 9H33z" fill="url(#chestLid)" stroke="#ffe29a" strokeWidth="5" />
            <path d="M26 58h128M42 21l-5 49m106-49 5 49" fill="none" stroke="url(#chestIron)" strokeWidth="8" />
            <path d="M31 41h118M34 68h112" fill="none" stroke="#77451f" strokeWidth="3" opacity=".72" />
            <path d="m89 39-7 15 10 5-7 13" fill="none" stroke="#fff3c5" strokeWidth="3" strokeLinecap="round" className="sealedChestReward__crack" />
            <circle cx="29" cy="60" r="3" fill="#fff0bd" /><circle cx="151" cy="60" r="3" fill="#fff0bd" />
          </g>
          <path d="M23 69h134v47q0 9-10 9H33q-10 0-10-9z" fill="url(#chestFront)" stroke="#f4d17a" strokeWidth="5" />
          <path d="m23 69 13 7v45l-13 4zm134 0-13 7v45l13 4z" fill="url(#chestSide)" stroke="#70431f" strokeWidth="2" />
          <path d="M39 72v50m102-50v50M24 84h132" fill="none" stroke="url(#chestIron)" strokeWidth="8" />
          <path d="M48 78v39m84-39v39" fill="none" stroke="#60371c" strokeWidth="3" opacity=".82" />
          <path d="M51 91h78v24H51z" fill="#9c5a2c" opacity=".42" stroke="#f4ca75" strokeWidth="2" />
          <path d="M76 67h28v43H76z" fill="url(#chestIron)" stroke="#71461f" strokeWidth="4" />
          <path d="M83 68h14v16H83z" fill="#7b4622" stroke="#f8d987" strokeWidth="2" />
          <circle cx="31" cy="76" r="2.5" fill="#fff0bd" /><circle cx="149" cy="76" r="2.5" fill="#fff0bd" />
          <circle cx="48" cy="87" r="2" fill="#fff0bd" /><circle cx="132" cy="87" r="2" fill="#fff0bd" />
          <path d="M30 116h120" stroke="#ffe3a1" strokeWidth="3" opacity=".75" />
          <g className="sealedChestReward__sparkles" fill="#fff0bd">
            <path d="m27 42 3 7 7 3-7 3-3 7-3-7-7-3 7-3z" />
            <path d="m153 32 2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
            <path d="m42 17 2 4 4 2-4 2-2 4-2-4-4-2 4-2z" />
          </g>
        </svg>
        <WaxSeal
          className="sealedChestReward__waxSeal"
          label=""
          ariaLabel={sealId ? 'Mağazadan seçilen mühür' : 'Kırmızı balmumu mühür'}
          variant={sealId}
        />
      </div>
      <div className="sealedChestReward__copy">
          <span>{claimed ? 'SANDIK DAHA ÖNCE AÇILDI' : opened ? 'BÖLGE SANDIĞI AÇILDI' : 'MÜHÜRLÜ BÖLGE SANDIĞI'}</span>
          <strong>{claimed ? '✓' : opened ? `+${coins}` : coins}</strong>
          <b>{claimed ? 'TEKRAR ÖDÜL YOK' : opened ? 'ALTIN KAZANDIN' : 'ALTIN ÖDÜLÜ'}</b>
          {!opened && doubledCoins !== undefined && (
            <small>Katlayıcıyla {doubledCoins} altın</small>
          )}
      </div>
    </section>
  );
}
