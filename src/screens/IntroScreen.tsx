import { useGame } from '../store/GameContext';
import '../styles/intro.css';
import '../styles/seal.css';
import { WaxSeal } from '../components/WaxSeal';
import { CornerOrnaments } from '../components/vectors/CornerOrnaments';
import { FiligreeDivider } from '../components/vectors/FiligreeDivider';

export function IntroScreen() {
  const { play, setScreen } = useGame();

  const handleClick = () => {
    play('tap');
    setScreen('map');
  };

  return (
    <main className="screen intro" onClick={handleClick}>
      <div className="introSkyline" aria-hidden="true" />
      <CornerOrnaments className="introCorners" />
      <div className="introContent">
        <WaxSeal className="sealMark" label="SU" />
        <FiligreeDivider className="introDivider" />
        <h1 className="introTitle">Söz Ustası</h1>
        <p className="introSubtitle">Kelimelerin mührünü aç</p>
        <FiligreeDivider className="introDivider" />
        <p className="introPrompt">BAŞLAMAK İÇİN DOKUN</p>
      </div>
    </main>
  );
}
