import { useEffect, useState } from 'react';
import { useGame } from '../store/GameContext';
import '../styles/splash.css';

const ASSETS = {
  logo: '/assets/screens/logo-soz-ustasi.webp',
  basla: '/assets/screens/btn-basla.webp',
  guest: '/assets/screens/btn-guest.webp',
  continue: '/assets/screens/btn-continue.webp',
  welcome: '/assets/screens/welcome-card.webp',
} as const;

export function SplashScreen() {
  const { play, setScreen, completedLevels, collectedWords } = useGame();
  const [progress, setProgress] = useState(0);

  const hasProgress = completedLevels.length > 0 || collectedWords.length > 0;

  useEffect(() => {
    let value = 0;
    const timer = window.setInterval(() => {
      value = Math.min(85, value + Math.max(1, Math.round((85 - value) * 0.18)));
      setProgress(value);
      if (value >= 85) {
        window.clearInterval(timer);
      }
    }, 60);
    return () => window.clearInterval(timer);
  }, []);

  const goOnboarding = () => {
    play('tap');
    setScreen('onboarding');
  };

  const goMap = () => {
    play('tap');
    setScreen('map');
  };

  const handleContinue = () => {
    if (hasProgress) {
      goMap();
    } else {
      goOnboarding();
    }
  };

  return (
    <main className="screen splash">
      <div className="splashScene">
        <div className="splash-bg" aria-hidden="true" />
        <div className="splash-overlay" aria-hidden="true" />

        <img
          className="splashLogo"
          src={ASSETS.logo}
          alt="Söz Ustası"
          width={520}
          height={520}
          decoding="async"
        />

        <div className="splashActions">
          <button type="button" className="splashBtn splashBtn--basla" onClick={goOnboarding} aria-label="Başla">
            <img src={ASSETS.basla} alt="" width={520} height={120} decoding="async" />
          </button>

          <div className="splashSecondary">
            <button type="button" className="splashBtn splashBtn--guest" onClick={goMap} aria-label="Misafir giriş">
              <img src={ASSETS.guest} alt="" width={260} height={80} decoding="async" />
            </button>
            <button type="button" className="splashBtn splashBtn--continue" onClick={handleContinue} aria-label="Devam et">
              <img src={ASSETS.continue} alt="" width={260} height={80} decoding="async" />
            </button>
          </div>

          <img
            className="splashWelcome"
            src={ASSETS.welcome}
            alt="Herkese merhaba, kelimelere merhaba"
            width={420}
            height={120}
            decoding="async"
          />

          <div
            className="splashProgress"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="splashProgressTrack">
              <div className="splashProgressFill" style={{ width: `${progress}%` }} />
            </div>
            <span className="splashProgressLabel">{progress}%</span>
          </div>
        </div>

        <p className="splashFooter">
          <span className="splashLeaf" aria-hidden="true" />
          SÖZLERİN GÜCÜYLE YOLCULUĞUN BAŞLIYOR...
          <span className="splashLeaf splashLeaf--right" aria-hidden="true" />
        </p>
      </div>
    </main>
  );
}
