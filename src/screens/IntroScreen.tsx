import { useGame } from '../store/GameContext';
import { Button3D } from '../components/Button3D';
import '../styles/intro.css';
import '../styles/seal.css';
import { WaxSeal } from '../components/WaxSeal';
import { CornerOrnaments } from '../components/vectors/CornerOrnaments';
import { FiligreeDivider } from '../components/vectors/FiligreeDivider';

export function IntroScreen() {
  const { play, setScreen } = useGame();

  return (
    <main className="screen intro">
      <div className="introSkyline" aria-hidden="true" />
      <CornerOrnaments className="introCorners" />
      <div className="introContent">
        <WaxSeal className="sealMark" label="SU" />
        <FiligreeDivider className="introDivider" />
        <h1 className="introTitle">Söz Ustası</h1>
        <p className="introSubtitle">Kelimelerin mührünü aç</p>
        <FiligreeDivider className="introDivider" />
        <div className="introActionArea">
          <Button3D variant="gold" onClick={() => { play('tap'); setScreen('map'); }}>
            MACERAYA BAŞLA
          </Button3D>
        </div>
      </div>
    </main>
  );
}
