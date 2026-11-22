import { useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useGame } from '../store/GameContext';
import { PrivacyModal } from '../components/PrivacyModal';
import { PremiumPrimaryButton } from '../components/PremiumPrimaryButton';
import { SettingsAsset } from '../components/SettingsAsset';
import { ensurePlayGamesSignedIn } from '../services/playGames';
import './StartScreen3D.css';

const KIT = '/assets/ui/start/kit';

export function StartScreen3D() {
  const {
    play, setScreen, setModal, modal,
    completedLevels, collectedWords, leagueOptIn, setLeagueOptIn,
  } = useGame();
  const [leagueBusy, setLeagueBusy] = useState(false);
  const [leagueNotice, setLeagueNotice] = useState('');
  const hasProgress = completedLevels.length > 0 || collectedWords.length > 0;

  const startGame = () => {
    play('tap');
    setScreen(hasProgress ? 'map' : 'onboarding');
  };

  const openLeague = async () => {
    play('tap');
    if (Capacitor.getPlatform() !== 'android') {
      setLeagueNotice('Play Games girişi Android uygulamasında kullanılabilir.');
      return;
    }
    setLeagueBusy(true);
    setLeagueNotice('');
    try {
      const signedIn = await ensurePlayGamesSignedIn(true);
      if (!signedIn) {
        setLeagueNotice('Giriş tamamlanmadı. Oyuna giriş yapmadan devam edebilirsin.');
        return;
      }
      setLeagueOptIn(true);
      setScreen('profile');
    } catch {
      setLeagueNotice('Şu an giriş yapılamadı. Daha sonra tekrar deneyebilirsin.');
    } finally {
      setLeagueBusy(false);
    }
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
          <PremiumPrimaryButton className="start-cta start-cta--primary" onClick={startGame}>
            {hasProgress ? 'Devam Et' : 'Oyuna Başla'}
          </PremiumPrimaryButton>
          <PremiumPrimaryButton
            variant="secondary"
            className="start-cta start-cta--secondary"
            onClick={() => void openLeague()}
            disabled={leagueBusy}
            aria-busy={leagueBusy}
          >
            {leagueBusy ? 'Bağlanıyor…' : leagueOptIn ? 'Lig skorlarını gör' : 'Play Games ile giriş yap'}
          </PremiumPrimaryButton>
          {!leagueNotice && !leagueOptIn && (
            <p className="start-league-hint">İsteğe bağlı: haftalık puan ve yıldız sıralamasına katıl.</p>
          )}
          {leagueNotice && <p className="start-league-notice" role="status">{leagueNotice}</p>}

          <div className="start-utilities" role="group" aria-label="Hızlı erişim">
            <button
              type="button"
              className="start-util"
              aria-label="Ayarlar"
              onClick={() => { play('tap'); setScreen('settings'); }}
            >
              <SettingsAsset />
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

      {modal === 'privacy' && <PrivacyModal />}
    </main>
  );
}
