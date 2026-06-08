import { useState, useEffect, useCallback } from "react";
import { useGame } from "../store/GameContext";
import "./StartScreen3D.css";

export function StartScreen3D() {
  const { play, setScreen, completedLevels, collectedWords } = useGame();
  const hasProgress = completedLevels.length > 0 || collectedWords.length > 0;
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!loading) return;
    if (progress >= 100) {
      setScreen("map");
      return;
    }
    const id = setTimeout(() => setProgress(p => Math.min(p + 1, 100)), 20);
    return () => clearTimeout(id);
  }, [loading, progress, setScreen]);

  const goMap = useCallback(() => {
    play("tap");
    setLoading(true);
  }, [play]);

  return (
    <main className="start-screen">
      <img className="bg" src="/assets/themes/old_istanbul/background.webp" />

      <div className="logo-group">
        <img className="logo-plaque" src="/assets/ui/start/logo-plaque.png" />
        <div className="logo-title">SÖZ<br />USTASI</div>
        <div className="logo-subtitle">Kelimelerin ustası ol!</div>
        <img className="wax-seal" src="/assets/ui/start/wax-seal-s.png" />
      </div>

      {hasProgress ? (
        <button className="blue-button" onClick={goMap} disabled={loading}>
          <img src="/assets/ui/start/button-blue-frame.svg" />
          <span>DEVAM ET</span>
        </button>
      ) : (
        <button className="main-start-button" onClick={goMap} disabled={loading}>
          <img src="/assets/ui/start/button-gold-frame.svg" />
          <span>BAŞLA</span>
        </button>
      )}

      <div className="welcome-plaque">
        <img src="/assets/ui/start/welcome-plaque.svg" />
        <span>HERKESE MERHABA,<br />KELİMELERE MERHABA!</span>
      </div>

      <div className="loading-progress">
        <img src="/assets/ui/start/progress-frame.svg" />
        <div className="loading-track">
          <div className="loading-fill" style={{ width: `${progress}%` }} />
        </div>
        <span>{progress}%</span>
      </div>

      <div className="loading-text">
        SÖZLERİN GÜCÜYLE YOLCULUĞUN BAŞLIYOR...
      </div>
    </main>
  );
}
