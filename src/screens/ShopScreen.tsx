import { useState } from 'react';
import '../styles/shop.css';
import { useGame } from '../store/GameContext';
import { shopItems } from '../data/shop';
import type { ShopItem } from '../types';
import { ActionIconButton } from '../components/ActionIconButton';

type ShopTab = 'theme' | 'seal';

export function ShopScreen() {
  const { play, setScreen, buyShopItem, isItemOwned, toast, coins } = useGame();
  const [tab, setTab] = useState<ShopTab>('theme');
  const items = shopItems.filter((item) => item.category === tab && !isItemOwned(item.id));
  const buy = (item: ShopItem) => buyShopItem(item.id);

  return (
    <main className="screen shopScreen">
      <div className="shopSurface" aria-hidden="true" />
      <header className="shopHeader">
        <ActionIconButton icon="back" onClick={() => { play('tap'); setScreen('map'); }} ariaLabel="Geri" size="lg" />
        <h1>Mağaza</h1>
        <div className="shopWallet"><img src="/assets/map/topbar-3d/topbar-coin.png" alt="" /><strong>{coins}</strong></div>
      </header>
      <div className="shopTabs">
        <button className={tab === 'theme' ? 'active' : ''} onClick={() => setTab('theme')}>Temalar</button>
        <button className={tab === 'seal' ? 'active' : ''} onClick={() => setTab('seal')}>Mühürler</button>
      </div>
      <div className="shopList">
        {items.length === 0 ? <p className="shopEmpty">Bu koleksiyon tamamlandı.</p> : items.map((item) => (
          <article className="shopCard" key={item.id}>
            <div className={`shopItemIcon shopItemIcon--${tab}`}>
              {tab === 'seal' ? (
                <img
                  src={`/assets/ui/seals/${item.id}.png`}
                  alt={item.name}
                  className="shopItemSealImg"
                />
              ) : tab === 'theme' ? (
                <img
                  src={`/assets/ui/themes/${item.id}.png`}
                  alt={item.name}
                  className="shopItemThemeImg"
                />
              ) : (
                <span>{item.icon}</span>
              )}
            </div>
            <div className="shopInfo"><strong>{item.name}</strong><p>{item.description}</p></div>
            <button className="shopBuy" onClick={() => buy(item)} disabled={coins < item.price}>
              <img src="/assets/map/topbar-3d/topbar-coin.png" alt="" /><strong>{item.price}</strong>
            </button>
          </article>
        ))}
      </div>
      {toast && <div className="toast shopToast">{toast}</div>}
    </main>
  );
}
