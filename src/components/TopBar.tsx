import '../styles/topbar.css';
import { useGame } from '../store/GameContext';
import { V2Icon } from './Icon';
import { ResourcePill } from './ResourcePill';

export function TopBar({ showBackToVault = false }: { showBackToVault?: boolean }) {
  const { play, setScreen, coins, coinPulse, soundEnabled, setSoundEnabled } = useGame();

  return (
    <header className="topBar">
      <button className="svgBtn topIconBtn" onClick={() => { play('tap'); setScreen(showBackToVault ? 'dictionary' : 'map'); }} aria-label="Geri"><V2Icon name="back" /></button>
      <strong>{showBackToVault ? 'Söz Hazinesi' : 'Söz Ustası'}</strong>
      <div className="topTools">
        <ResourcePill type="coin" value={coins} className={coinPulse ? 'coinPulse' : ''} />
        <button className="svgBtn topIconBtn" onClick={() => setSoundEnabled(!soundEnabled)} aria-label={soundEnabled ? 'Sesi kapat' : 'Sesi aç'}>
          <V2Icon name={soundEnabled ? 'soundButton' : 'soundOffButton'} />
        </button>
      </div>
    </header>
  );
}
