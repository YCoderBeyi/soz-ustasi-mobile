import { useRef, useState } from 'react';
import '../styles/shop.css';
import { useGame } from '../store/GameContext';
import { REWARDED_COIN_AMOUNT, shopItems } from '../data/shop';
import { ActionIconButton } from '../components/ActionIconButton';
import { ResourcePill } from '../components/ResourcePill';
import { getLastAdFailureDetail, showRewardedInterstitialAd } from '../services/admob';
import { useRewardedAdsLeftToday } from '../services/useRewardedAdsLeft';
import { DAILY_REWARDED_AD_LIMIT } from '../game/adBudget';

type ShopTab = 'theme' | 'seal' | 'power_up' | 'coins';

export function ShopScreen() {
  const {
    play, setScreen, buyShopItem, selectShopItem, isItemOwned, addCoins, setToast,
    selectedThemeId, selectedSealId, toast, coins, doublerRemaining,
  } = useGame();
  const [tab, setTab] = useState<ShopTab>('theme');
  const [adPending, setAdPending] = useState(false);
  const adPendingRef = useRef(false);
  const adsLeft = useRewardedAdsLeftToday();
  const items = tab === 'coins' ? [] : shopItems.filter((item) => item.category === tab);
  const affordableAfterAdItem = items
    .filter((item) => item.price > coins
      && item.price <= coins + REWARDED_COIN_AMOUNT
      && (item.category === 'power_up' || !isItemOwned(item.id)))
    .sort((left, right) => left.price - right.price)[0];

  const earnCoinsWithAd = async () => {
    if (adPendingRef.current || adsLeft < 1) return;
    adPendingRef.current = true;
    setAdPending(true);
    try {
      const earned = await showRewardedInterstitialAd();
      if (!earned) {
        const detail = getLastAdFailureDetail();
        setToast(`Reklam açılamadı. Altınların korunuyor.${detail ? ` Tanı: ${detail}` : ''}`);
        return;
      }
      addCoins(REWARDED_COIN_AMOUNT);
      play('reward');
      setToast(`+${REWARDED_COIN_AMOUNT} altın kazandın.`);
    } finally {
      adPendingRef.current = false;
      setAdPending(false);
    }
  };

  const contextualCoinOffer = affordableAfterAdItem && adsLeft > 0 ? (
    <article className="shopCard shopRewardCard shopContextRewardCard">
      <div className="shopItemIcon shopRewardIcon" aria-hidden="true">🪙</div>
      <div className="shopInfo">
        <strong>{affordableAfterAdItem.name} için {affordableAfterAdItem.price - coins} altın eksik</strong>
        <p>İstersen reklamı tamamlayıp {REWARDED_COIN_AMOUNT} altın kazanabilir, sonra ürünü kendin satın alabilirsin.</p>
      </div>
      <button
        className="shopBuy shopRewardAction"
        type="button"
        disabled={adPending}
        aria-busy={adPending}
        onClick={() => { play('tap'); void earnCoinsWithAd(); }}
      >
        <strong>{adPending ? 'Açılıyor…' : 'Reklam izle'}</strong>
        <small>+{REWARDED_COIN_AMOUNT} altın</small>
      </button>
    </article>
  ) : null;

  return (
    <main className="screen shopScreen">
      <div className="shopSurface" aria-hidden="true" />
      <header className="shopHeader">
        <ActionIconButton icon="back" onClick={() => { play('tap'); setScreen('map'); }} ariaLabel="Geri" size="lg" />
        <h1>Mağaza</h1>
        <ResourcePill type="coin" value={coins} />
      </header>
      <div className="shopTabs">
        <button className={tab === 'theme' ? 'active' : ''} aria-pressed={tab === 'theme'} onClick={() => setTab('theme')}>Temalar</button>
        <button className={`shopCoinsTab ${tab === 'coins' ? 'active' : ''}`} aria-pressed={tab === 'coins'} onClick={() => setTab('coins')}>Altın</button>
        <button className={tab === 'seal' ? 'active' : ''} aria-pressed={tab === 'seal'} onClick={() => setTab('seal')}>Mühürler</button>
        <button className={tab === 'power_up' ? 'active' : ''} aria-pressed={tab === 'power_up'} onClick={() => setTab('power_up')}>Güç</button>
      </div>
      {tab === 'coins' ? (
        <div className="shopList">
          <article className="shopCard shopRewardCard">
            <div className="shopItemIcon shopRewardIcon" aria-hidden="true">🪙</div>
            <div className="shopInfo">
              <strong>İzle, {REWARDED_COIN_AMOUNT} altın kazan</strong>
              <p>Reklamı isteyerek aç. Ödül, reklam tamamlanırsa eklenir. İstemiyorsan bu ekranı kapatıp oyuna devam edebilirsin.</p>
              <small>Bugün {adsLeft}/{DAILY_REWARDED_AD_LIMIT} reklam hakkın kaldı.</small>
            </div>
            <button
              className="shopBuy shopRewardAction"
              type="button"
              disabled={adPending || adsLeft < 1}
              aria-busy={adPending}
              onClick={() => { play('tap'); void earnCoinsWithAd(); }}
            >
              <strong>{adPending ? 'Açılıyor…' : adsLeft > 0 ? 'Reklam izle' : 'Hak bitti'}</strong>
            </button>
          </article>
        </div>
      ) : tab === 'power_up' ? (
        <div className="shopList">
          {contextualCoinOffer}
          {items.map((item) => {
            const active = item.id === 'doubler' && doublerRemaining > 0;
            return (
              <article className={`shopCard ${active ? 'selected' : ''}`} key={item.id}>
                <div className="shopItemIcon shopItemIcon--power"><span className="shopPowerEmoji">{item.icon}</span></div>
                <div className="shopInfo">
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                  {active && <small className="shopPowerActive">Aktif: {doublerRemaining} bölüm</small>}
                </div>
                <button
                  className="shopBuy"
                  aria-label={`${item.name}: ${item.price} altın karşılığında satın al${coins < item.price ? ', yetersiz altın' : ''}`}
                  onClick={() => buyShopItem(item.id)}
                  disabled={coins < item.price}
                >
                  <img src="/assets/map/topbar-3d/topbar-coin.png" alt="" /><strong>{item.price}</strong>
                </button>
              </article>
            );
          })}
        </div>
      ) : (
      <div className="shopList">
        {contextualCoinOffer}
        {items.map((item) => {
          const owned = isItemOwned(item.id);
          const selected = tab === 'theme' ? selectedThemeId === item.id : selectedSealId === item.id;
          return (
            <article className={`shopCard ${selected ? 'selected' : ''}`} key={item.id}>
              <div className={`shopItemIcon shopItemIcon--${tab}`}>
                <img
                  src={`/assets/ui/${tab === 'seal' ? 'seals' : 'themes'}/${item.id}.png`}
                  alt={item.name}
                  className={tab === 'seal' ? 'shopItemSealImg' : 'shopItemThemeImg'}
                />
              </div>
              <div className="shopInfo"><strong>{item.name}</strong><p>{item.description}</p></div>
              <button
                className={`shopBuy ${owned ? 'shopUse' : ''}`}
                aria-label={owned ? `${item.name}: ${selected ? 'seçili' : 'kullan'}` : `${item.name}: ${item.price} altın karşılığında satın al${coins < item.price ? ', yetersiz altın' : ''}`}
                onClick={() => owned ? selectShopItem(item.id) : buyShopItem(item.id)}
                disabled={selected || (!owned && coins < item.price)}
              >
                {owned ? <strong>{selected ? 'SEÇİLİ' : 'KULLAN'}</strong> : (
                  <><img src="/assets/map/topbar-3d/topbar-coin.png" alt="" /><strong>{item.price}</strong></>
                )}
              </button>
            </article>
          );
        })}
      </div>
      )}
      {toast && <div className="toast shopToast" role="status">{toast}</div>}
    </main>
  );
}
