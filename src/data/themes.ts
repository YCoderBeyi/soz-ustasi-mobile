import type { ThemeData } from '../types';

export const themes: ThemeData[] = [
  {
    themeId: 'old_istanbul',
    title: 'Eski İstanbul',
    backgroundImage: '/assets/themes/old_istanbul/background.webp',
    primaryColor: '#2F9CC8',
    secondaryColor: '#0D2742',
    unlockAtLevel: 1,
    modifier: {
      type: 'old_istanbul',
      label: 'Tarihî Rehber',
      description: 'Her level\'da bir harf önceden açılır',
      icon: '🏛️',
    },
  },
  {
    themeId: 'cappadocia',
    title: 'Kapadokya Gün Doğumu',
    backgroundImage: '/assets/themes/cappadocia/background.webp',
    primaryColor: '#F1A35C',
    secondaryColor: '#183047',
    unlockAtLevel: 5,
    modifier: {
      type: 'cappadocia',
      label: 'Peri Bacası',
      description: 'Gizli kelimeler 2× daha değerli',
      icon: '🎈',
    },
  },
  {
    themeId: 'ege_coast',
    title: 'Ege Sahili',
    backgroundImage: '/assets/themes/ege_coast/background.webp',
    primaryColor: '#2F9CC8',
    secondaryColor: '#103045',
    unlockAtLevel: 7,
    modifier: {
      type: 'ege_coast',
      label: 'Rüzgar Gücü',
      description: 'Karıştırma işlemi bonus verir',
      icon: '🌊',
    },
  },
  {
    themeId: 'anatolian_autumn',
    title: 'Anadolu Sonbaharı',
    backgroundImage: '/assets/themes/anatolian_autumn/background.webp',
    primaryColor: '#D98232',
    secondaryColor: '#20140E',
    unlockAtLevel: 9,
    modifier: {
      type: 'anatolian_autumn',
      label: 'Bereketli Toprak',
      description: 'Doğru kelimeler %50 fazla elmas',
      icon: '🍂',
    },
  },
  {
    themeId: 'ottoman_library',
    title: 'Osmanlı Kütüphanesi',
    backgroundImage: '/assets/themes/ottoman_library/background.webp',
    primaryColor: '#B98242',
    secondaryColor: '#1D1520',
    unlockAtLevel: 10,
    modifier: {
      type: 'ottoman_library',
      label: 'Bilgelik Hazinesi',
      description: 'İpuçları %30 daha ucuz',
      icon: '📚',
    },
  },
  {
    themeId: 'seljuk_courtyard',
    title: 'Selçuklu Avlusu',
    backgroundImage: '/assets/themes/seljuk_courtyard/background.webp',
    primaryColor: '#C8914B',
    secondaryColor: '#151B24',
    unlockAtLevel: 11,
    modifier: {
      type: 'seljuk_courtyard',
      label: 'Zanaatkâr Ruhu',
      description: 'Streak bonusu 2 katı',
      icon: '🏛️',
    },
  },
  {
    themeId: 'nemrut_dawn',
    title: 'Nemrut Şafağı',
    backgroundImage: '/assets/themes/nemrut_dawn/background.webp',
    primaryColor: '#D69A3B',
    secondaryColor: '#17110E',
    unlockAtLevel: 12,
    modifier: {
      type: 'nemrut_dawn',
      label: 'Gün Işığı',
      description: 'Son 3 kelime için ekstra süre',
      icon: '🌅',
    },
  },
  {
    themeId: 'blacksea_highland',
    title: 'Karadeniz Yaylası',
    backgroundImage: '/assets/themes/blacksea_highland/background.webp',
    primaryColor: '#89B96E',
    secondaryColor: '#17251C',
    unlockAtLevel: 13,
    modifier: {
      type: 'blacksea_highland',
      label: 'Yayla Huzuru',
      description: 'Yanlış kelime ceza vermez',
      icon: '🌲',
    },
  },
];

export function getTheme(themeId: string): ThemeData {
  return themes.find((theme) => theme.themeId === themeId) ?? themes[0];
}
