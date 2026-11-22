import { useEffect } from 'react';
import { GameProvider } from './store/GameProvider';
import { useGame } from './store/GameContext';
import { StartScreen3D } from './screens/StartScreen3D';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MapScreen } from './screens/MapScreen';
import { GameScreen } from './screens/GameScreen';
import { DictionaryScreen } from './screens/DictionaryScreen';
import { ShopScreen } from './screens/ShopScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';
import { LevelStartScreen } from './components/level-start/LevelStartScreen';

function ScreenRouter() {
  const { screen, reduceMotion } = useGame();

  // In-app "Hareketi Azalt" toggle must also silence CSS animations/transitions,
  // not just the JS-rendered effects. The OS prefers-reduced-motion media query
  // covers the system setting; this class bridges the in-app preference to CSS.
  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  }, [reduceMotion]);

  switch (screen) {
    case 'splash':
      return <StartScreen3D />;
    case 'onboarding':
      return <OnboardingScreen />;
    case 'map':
      return <MapScreen />;
    case 'game':
      return <GameScreen />;
    case 'dictionary':
      return <DictionaryScreen />;
    case 'shop':
      return <ShopScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'level-start':
      return <LevelStartScreen />;
  }
}

export default function App() {
  return (
    <GameProvider>
      <ScreenRouter />
    </GameProvider>
  );
}
