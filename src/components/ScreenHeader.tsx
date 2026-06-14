import { useGame } from '../store/GameContext';
import { Icon, V2Icon } from './Icon';
import { ResourcePill } from './ResourcePill';

export function ScreenHeader({
  title,
  onBack,
  showShop,
  showHints,
  showSound = true,
}: {
  title: string;
  onBack: () => void;
  showShop?: boolean;
  showHints?: boolean;
  showSound?: boolean;
}) {
  const { play, coins, coinPulse, soundEnabled, setSoundEnabled, hintsRemaining, setScreen } = useGame();

  return (
    <header className="topBar">
      <button className="svgBtn topIconBtn" onClick={() => { play('tap'); onBack(); }} aria-label="Geri">
        <V2Icon name="back" />
      </button>
      <strong>{title}</strong>
      <div className="topTools">
        {showHints && hintsRemaining > 0 && (
          <span className="hintBadge3d" title="Kalan ipucu">
            <Icon name="hint" className="uiV1IconMd" />
            <span>{hintsRemaining}</span>
          </span>
        )}
        {showShop && (
          <button className="svgBtn topIconBtn" onClick={() => { play('tap'); setScreen('shop'); }} aria-label="Dükkan">
            <V2Icon name="bottomShop" />
          </button>
        )}
        <ResourcePill type="coin" value={coins} className={coinPulse ? 'coinPulse' : ''} />
        {showSound && (
          <button className="svgBtn topIconBtn" onClick={() => setSoundEnabled(!soundEnabled)} aria-label={soundEnabled ? 'Sesi kapat' : 'Sesi aç'}>
            <V2Icon name={soundEnabled ? 'soundButton' : 'soundOffButton'} />
          </button>
        )}
      </div>
    </header>
  );
}
