import { useState, useEffect, useCallback } from "react";
import { useGame } from "../store/GameContext";
import { Button3D } from "../components/Button3D";
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
    <main className="start-screen start-screen--premium">
      <img className="bg" src="/assets/themes/old_istanbul/background.webp" alt="" />

      <div className="start-screen-content">
        <header className="logo-section">
          <div className="logo-group">
            <img className="logo-plaque" src="/assets/ui/start/logo-plaque.webp" alt="Söz Ustası" />
            <div className="logo-title">SÖZ<br />USTASI</div>
            <div className="logo-subtitle">Kelimelerin ustası ol!</div>
            <img className="wax-seal" src="/assets/ui/start/wax-seal-s.webp" alt="" />
          </div>
        </header>

        <section className="actions-section">
          <div className="welcome-plaque">
            <img src="/assets/ui/start/welcome-plaque.svg" alt="" />
            <span>HERKESE MERHABA,<br />KELİMELERE MERHABA!</span>
          </div>

          <div className="main-actions">
            {hasProgress ? (
              <Button3D variant="blue" onClick={goMap} loading={loading} className="main-start-btn">
                DEVAM ET
              </Button3D>
            ) : (
              <Button3D variant="gold" onClick={goMap} loading={loading} className="main-start-btn">
                BAŞLA
              </Button3D>
            )}
          </div>
        </section>

        <footer className="loading-section">
          {loading && (
            <>
              <div className="loading-progress">
                <img src="/assets/ui/start/progress-frame.svg" alt="" />
                <div className="loading-track">
                  <div className="loading-fill" style={{ width: `${progress}%` }} />
                </div>
                <span className="progress-value">{progress}%</span>
              </div>
              <div className="loading-text">
                SÖZLERİN GÜCÜYLE YOLCULUĞUN BAŞLIYOR...
              </div>
            </>
          )}
        </footer>
      </div>
    </main>
  );
}
