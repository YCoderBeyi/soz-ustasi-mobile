import type { ShopItem } from '../types';

const shopItems: ShopItem[] = [
  { id: 'theme_cappadocia', name: 'Kapadokya', description: 'Kapadokya temasını tüm levellerde kullan.', price: 80, icon: '🌄', category: 'theme', owned: false },
  { id: 'theme_ege', name: 'Ege', description: 'Ege temasını tüm levellerde kullan.', price: 80, icon: '🏖️', category: 'theme', owned: false },
  { id: 'theme_anatolia', name: 'Anadolu', description: 'Anadolu temasını tüm levellerde kullan.', price: 80, icon: '🍂', category: 'theme', owned: false },
  { id: 'theme_ottoman', name: 'Osmanlı', description: 'Osmanlı temasını tüm levellerde kullan.', price: 100, icon: '📚', category: 'theme', owned: false },
  { id: 'theme_seljuk', name: 'Selçuklu', description: 'Selçuklu temasını tüm levellerde kullan.', price: 100, icon: '🏛️', category: 'theme', owned: false },
  { id: 'theme_nemrut', name: 'Nemrut', description: 'Nemrut temasını tüm levellerde kullan.', price: 120, icon: '🌅', category: 'theme', owned: false },
  { id: 'theme_blacksea', name: 'Karadeniz', description: 'Karadeniz temasını tüm levellerde kullan.', price: 150, icon: '🌲', category: 'theme', owned: false },
  { id: 'seal_gold', name: 'Altın Mühür', description: 'Mühürlerine altın bir yüzey kazandırır.', price: 50, icon: '✦', category: 'seal', owned: false },
  { id: 'seal_ruby', name: 'Yakut Mühür', description: 'Mühürlerine yakut kırmızısı kazandırır.', price: 60, icon: '◆', category: 'seal', owned: false },
  { id: 'seal_emerald', name: 'Zümrüt Mühür', description: 'Mühürlerine zümrüt yeşili kazandırır.', price: 70, icon: '●', category: 'seal', owned: false },
  { id: 'seal_sapphire', name: 'Safir Mühür', description: 'Mühürlerine safir mavisi kazandırır.', price: 80, icon: '●', category: 'seal', owned: false },
  { id: 'doubler', name: 'Altın Katlayıcı', description: 'Sonraki 3 bölümde kazandığın bölüm altınını 2 katına çıkarır.', price: 60, icon: '⚡', category: 'power_up', owned: false },
];

export { shopItems };

const themeItemMap: Record<string, string> = {
  theme_cappadocia: 'cappadocia',
  theme_ege: 'ege_coast',
  theme_anatolia: 'anatolian_autumn',
  theme_ottoman: 'ottoman_library',
  theme_seljuk: 'seljuk_courtyard',
  theme_nemrut: 'nemrut_dawn',
  theme_blacksea: 'blacksea_highland',
};

export function getThemeIdForShopItem(itemId: string | null): string | null {
  return itemId ? themeItemMap[itemId] ?? null : null;
}
