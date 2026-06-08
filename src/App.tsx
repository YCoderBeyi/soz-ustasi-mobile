import { GameProvider, useGame } from './store/GameContext';
import { StartScreen3D } from './screens/StartScreen3D';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { MapScreen } from './screens/MapScreen';
import { GameScreen } from './screens/GameScreen';
import { DictionaryScreen } from './screens/DictionaryScreen';
import { ShopScreen } from './screens/ShopScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { SettingsScreen } from './screens/SettingsScreen';

function ScreenRouter() {
  const { screen } = useGame();

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
  }
}

export default function App() {
  return (
    <GameProvider>
      <ScreenRouter />
    </GameProvider>
  );
}
