import { useGame } from "../store/GameContext";
import { Button3D } from "../components/Button3D";
import "./StartScreen3D.css";

export function StartScreen3D() {
  const { play, setScreen, completedLevels, collectedWords } = useGame();
  const hasProgress = completedLevels.length > 0 || collectedWords.length > 0;
  const goMap = () => {
    play("tap");
    setScreen(hasProgress ? "map" : "onboarding");
  };

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
              <Button3D variant="blue" onClick={goMap} className="main-start-btn">
                DEVAM ET
              </Button3D>
            ) : (
              <Button3D variant="gold" onClick={goMap} className="main-start-btn">
                BAŞLA
              </Button3D>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
