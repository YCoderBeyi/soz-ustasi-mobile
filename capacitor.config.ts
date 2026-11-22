import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sozustasi.game',
  appName: 'Söz Ustası',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#061326',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
