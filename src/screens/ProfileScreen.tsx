import '../styles/profile.css';
import { useGame } from '../store/GameContext';
import { V2Icon } from '../components/Icon';
import { BottomNav } from '../components/ui/BottomNav';
import { WaxSeal } from '../components/WaxSeal';
import { ActionIconButton } from '../components/ActionIconButton';

export function ProfileScreen() {
  const { setScreen, play, coins, favoriteWords, completedLevels } = useGame();

  return (
    <main className="screen profileScreen">
      <div className="profileSurface" aria-hidden="true" />

      <header className="profileHeader">
        <ActionIconButton icon="back" onClick={() => { play('tap'); setScreen('map'); }} ariaLabel="Geri" size="lg" />
        <h1>Profil</h1>
        <div className="profileHeaderSpacer" />
      </header>

      <section className="profileContent">
        <div className="profileAvatar">
          <div className="profileSealHalo">
            <WaxSeal className="profileSeal" label="S" />
          </div>
          <h2>Oyuncu</h2>
          <p className="profileSubtitle">Kelimelerin ustası</p>
        </div>

        <div className="profileStats">
          <div className="profileStatItem"><strong>{coins}</strong><span>Altın</span></div>
          <div className="profileStatItem"><strong>{favoriteWords.length}</strong><span>Favori</span></div>
          <div className="profileStatItem"><strong>{completedLevels.length}</strong><span>Tamamlanan</span></div>
        </div>

        <div className="profileActions">
          <button className="profileAction" onClick={() => { play('tap'); setScreen('settings'); }}>
            <span className="profileActionIcon profileActionIcon--settings"><V2Icon name="settings" /></span>
            <span><strong>Ayarlar</strong><small>Ses ve oyun tercihleri</small></span>
            <b aria-hidden="true">›</b>
          </button>
        </div>

        <p className="profileInfo">İlerlemen bu cihazda güvenle saklanır.</p>
      </section>

      <BottomNav active="profile" />
    </main>
  );
}
