import { useGame } from '../store/GameContext';
import { PrivacyModal } from '../components/PrivacyModal';
import './StartScreen3D.css';

const KIT = '/assets/ui/start/kit';

export function StartScreen3D() {
  const {
    play, setScreen, setModal, setToast, toast, modal,
    completedLevels, collectedWords,
  } = useGame();
  const hasProgress = completedLevels.length > 0 || collectedWords.length > 0;

  const startGame = () => {
    play('tap');
    setScreen(hasProgress ? 'map' : 'onboarding');
  };

  const keepProgress = () => {
    play('tap');
    setToast('İlerlemen bu cihazda saklanır.');
    window.setTimeout(() => setToast(''), 2200);
    if (hasProgress) setScreen('map');
  };

  return (
    <main className="start-screen start-screen--anadolu">
      <img className="bg" src={`${KIT}/bg-cappadocia.webp`} alt="" />
      <div className="start-veil" aria-hidden="true" />
      <img className="start-corner start-corner--tl" src={`${KIT}/corner.webp`} alt="" aria-hidden="true" />
      <img className="start-corner start-corner--tr" src={`${KIT}/corner.webp`} alt="" aria-hidden="true" />

      <div className="start-screen-content">
        <header className="start-brand">
          <img className="start-seal" src={`${KIT}/seal-s.webp`} alt="" />
          <div className="start-title-card">
            <img className="start-title-plaque" src={`${KIT}/title-banner.webp`} alt="" />
            <h1 className="start-title">Söz Ustası</h1>
          </div>
          <img className="start-divider" src={`${KIT}/divider.webp`} alt="" aria-hidden="true" />
          <p className="start-tagline">Oyna. Keşfet. Öğren.</p>
        </header>

        <section className="start-actions">
          <button type="button" className="start-cta start-cta--primary" onClick={startGame}>
            <img src={`${KIT}/btn-primary.webp`} alt="" aria-hidden="true" />
            <span>{hasProgress ? 'Devam Et' : 'Oyuna Başla'}</span>
          </button>
          <button type="button" className="start-cta start-cta--secondary" onClick={keepProgress}>
            <img src={`${KIT}/btn-secondary.webp`} alt="" aria-hidden="true" />
            <span>İlerlemeyi Koru</span>
          </button>

          <div className="start-utilities" role="group" aria-label="Hızlı erişim">
            <button
              type="button"
              className="start-util"
              aria-label="Ayarlar"
              onClick={() => { play('tap'); setScreen('settings'); }}
            >
              <img src={`${KIT}/icon-settings.webp`} alt="" />
            </button>
            <button
              type="button"
              className="start-util"
              aria-label="Profil"
              onClick={() => { play('tap'); setScreen('profile'); }}
            >
              <img src={`${KIT}/icon-stats.webp`} alt="" />
            </button>
            <button
              type="button"
              className="start-util"
              aria-label="Gizlilik bilgisi"
              onClick={() => { play('tap'); setModal('privacy'); }}
            >
              <img src={`${KIT}/icon-info.webp`} alt="" />
            </button>
          </div>
        </section>
      </div>

      {toast ? <div className="start-toast" role="status">{toast}</div> : null}
      {modal === 'privacy' && <PrivacyModal />}
    </main>
  );
}
