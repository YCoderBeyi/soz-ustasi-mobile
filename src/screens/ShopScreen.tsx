import { useState } from 'react';
import '../styles/shop.css';
import { useGame } from '../store/GameContext';
import { shopItems } from '../data/shop';
import { ActionIconButton } from '../components/ActionIconButton';

type ShopTab = 'theme' | 'seal' | 'power_up';

export function ShopScreen() {
  const {
    play, setScreen, buyShopItem, selectShopItem, isItemOwned,
    selectedThemeId, selectedSealId, toast, coins, doublerRemaining,
  } = useGame();
  const [tab, setTab] = useState<ShopTab>('theme');
  const items = shopItems.filter((item) => item.category === tab);

  return (
    <main className="screen shopScreen">
      <div className="shopSurface" aria-hidden="true" />
      <header className="shopHeader">
        <ActionIconButton icon="back" onClick={() => { play('tap'); setScreen('map'); }} ariaLabel="Geri" size="lg" />
        <h1>Mağaza</h1>
        <div className="shopWallet"><img src="/assets/map/topbar-3d/topbar-coin.png" alt="" /><strong>{coins}</strong></div>
      </header>
      <div className="shopTabs">
        <button className={tab === 'theme' ? 'active' : ''} aria-pressed={tab === 'theme'} onClick={() => setTab('theme')}>Temalar</button>
        <button className={tab === 'seal' ? 'active' : ''} aria-pressed={tab === 'seal'} onClick={() => setTab('seal')}>Mühürler</button>
        <button className={tab === 'power_up' ? 'active' : ''} aria-pressed={tab === 'power_up'} onClick={() => setTab('power_up')}>Güç</button>
      </div>
      {tab === 'power_up' ? (
        <div className="shopList">
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
