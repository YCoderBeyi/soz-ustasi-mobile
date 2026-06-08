import type { ShopItem } from '../types';

export const shopItems: ShopItem[] = [
  // Theme unlocks
  { id: 'theme_cappadocia', name: 'Kapadokya Kalıcı Açılış', description: 'Kapadokya temasını tüm level\'larda kullan', price: 80, icon: '🌄', category: 'theme', owned: false },
  { id: 'theme_ege', name: 'Ege Kalıcı Açılış', description: 'Ege temasını tüm level\'larda kullan', price: 80, icon: '🏖️', category: 'theme', owned: false },
  { id: 'theme_anatolia', name: 'Anadolu Kalıcı Açılış', description: 'Anadolu temasını tüm level\'larda kullan', price: 80, icon: '🍂', category: 'theme', owned: false },
  { id: 'theme_ottoman', name: 'Osmanlı Kalıcı Açılış', description: 'Osmanlı temasını tüm level\'larda kullan', price: 100, icon: '📚', category: 'theme', owned: false },
  { id: 'theme_seljuk', name: 'Selçuklu Kalıcı Açılış', description: 'Selçuklu temasını tüm level\'larda kullan', price: 100, icon: '🏛️', category: 'theme', owned: false },
  { id: 'theme_nemrut', name: 'Nemrut Kalıcı Açılış', description: 'Nemrut temasını tüm level\'larda kullan', price: 120, icon: '🌅', category: 'theme', owned: false },
  { id: 'theme_blacksea', name: 'Karadeniz Kalıcı Açılış', description: 'Karadeniz temasını tüm level\'larda kullan', price: 150, icon: '🌲', category: 'theme', owned: false },

  // Seal styles (cosmetic only)
  { id: 'seal_gold', name: 'Altın Mühür', description: 'Mühürlerin altın renkli olsun', price: 50, icon: '✨', category: 'seal', owned: false },
  { id: 'seal_ruby', name: 'Yakut Mühür', description: 'Mühürlerin yakut kırmızısı olsun', price: 60, icon: '💎', category: 'seal', owned: false },
  { id: 'seal_emerald', name: 'Zümrüt Mühür', description: 'Mühürlerin zümrüt yeşili olsun', price: 70, icon: '🟢', category: 'seal', owned: false },
  { id: 'seal_sapphire', name: 'Safir Mühür', description: 'Mühürlerin safir mavisi olsun', price: 80, icon: '🔵', category: 'seal', owned: false },

  // Hint packs
  { id: 'hint_3', name: '3 İpucu Paketi', description: '3 ipucu (normalde 60 elmas, sadece 35)', price: 35, icon: '💡', category: 'hint_pack', owned: false },
  { id: 'hint_5', name: '5 İpucu Paketi', description: '5 ipucu (normalde 100 elmas, sadece 50)', price: 50, icon: '💡', category: 'hint_pack', owned: false },

  // Power-ups
  { id: 'doubler', name: 'Elmas Çarpanı', description: 'Sonraki 3 level\'da kazancın 2 katı', price: 60, icon: '⚡', category: 'power_up', owned: false },
  { id: 'free_hint', name: 'Ücretsiz İpucu Hakkı', description: 'Bir sonraki ipucun ücretsiz', price: 40, icon: '🎯', category: 'power_up', owned: false },
];
