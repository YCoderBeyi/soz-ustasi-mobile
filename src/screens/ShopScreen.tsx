import { useState } from 'react';
import '../styles/shop.css';
import '../styles/topbar.css';
import { useGame } from '../store/GameContext';
import { shopItems as allShopItems } from '../data/shop';
import type { ShopItem } from '../types';
import { Icon } from '../components/Icon';
import { ScreenHeader } from '../components/ScreenHeader';
import { TabPill3D } from '../components/TabPill3D';
import { ShopBuyButton3D } from '../components/Button3D';

type ShopTab = 'theme' | 'seal' | 'hint_pack' | 'power_up';

const tabLabels: Record<ShopTab, string> = {
  theme: 'Temalar',
  seal: 'Mühür Stilleri',
  hint_pack: 'İpucu Paketleri',
  power_up: 'Güçlendiriciler',
};

export function ShopScreen() {
  const { play, setScreen, buyShopItem, isItemOwned, toast } = useGame();
  const [tab, setTab] = useState<ShopTab>('theme');

  const items = allShopItems.filter((item) => item.category === tab);

  function buy(item: ShopItem) {
    buyShopItem(item.id);
  }

  return (
    <main className="screen shopScreen">
      <ScreenHeader title="Dükkan" onBack={() => { play('tap'); setScreen('map'); }} />

      <div className="shopTabs tabs3d">
        {(Object.entries(tabLabels) as [ShopTab, string][]).map(([key, label]) => (
          <TabPill3D key={key} label={label} active={tab === key} onClick={() => { play('tap'); setTab(key); }} />
        ))}
      </div>

      <div className="shopList">
        {items.filter((item) => !isItemOwned(item.id)).length === 0 ? (
          <p className="shopEmpty">Bu kategoride tüm ürünler satın alındı!</p>
        ) : (
          items.map((item) => {
            const owned = isItemOwned(item.id);
            if (owned) return null;
            return (
              <article className="shopCard" key={item.id}>
                <span className="shopIcon">{item.icon}</span>
                <div className="shopInfo">
                  <strong>{item.name}</strong>
                  <p>{item.description}</p>
                </div>
                <ShopBuyButton3D onClick={() => buy(item)}>
                  {item.price} <Icon name="coin" size={16} />
                </ShopBuyButton3D>
              </article>
            );
          })
        )}
      </div>

      {toast && <div className="toast shopToast">{toast}</div>}
    </main>
  );
}
