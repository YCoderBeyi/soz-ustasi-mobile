import { useMemo } from 'react';
import { useGame } from '../store/GameContext';
import { levels } from '../data/levels';
import { getLevelStory } from '../data/levelStories';
import { getTheme } from '../data/themes';
import { LevelModal } from '../components/LevelModal';
import { BottomNavBar } from '../components/BottomNavBar';
import './MapScreen.css';

const nodePositions = [
  { left: 17, top: 84 },
  { left: 61, top: 75 },
  { left: 29, top: 63 },
  { left: 69, top: 52 },
  { left: 36, top: 40 },
  { left: 72, top: 29 },
  { left: 42, top: 18 },
  { left: 76, top: 8 },
];

export function MapScreen() {
  const {
    play, level, setLevel, setModal, startLevel, completedLevels,
    collectedWords, levelMastery, modal, toast, setToast,
    isLevelUnlocked, dailyChallenge, levelStats,
  } = useGame();

  const activeTheme = getTheme(level.themeId);
  const activeStory = getLevelStory(level.levelId);
  const themeLevels = useMemo(
    () => levels.filter((item) => item.themeId === activeTheme.themeId),
    [activeTheme.themeId],
  );
  const themeStars = themeLevels.reduce((total, item) => total + (levelMastery[item.levelId]?.stars ?? 0), 0);
  const themeStarCapacity = themeLevels.length * 3;
  const totalAttempts = Object.values(levelStats).reduce((sum, stats) => sum + stats.attempts, 0);

  return (
    <main className="map-screen">
      <img className="map-bg" src="/assets/ui/map/map-diorama-v2.png" alt="" />
      <div className="map-atmosphere" />

      <header className="map-topbar">
        <div className="map-brand">
          <span className="map-brand-kicker">SÖZ USTASI</span>
          <strong>{activeTheme.title}</strong>
          <small>{activeStory.era} · {activeStory.place}</small>
        </div>
        <div className="map-resources">
          <span><b>{collectedWords.length}</b> söz</span>
          <span><b>{totalAttempts}</b> deneme</span>
        </div>
      </header>

      <section className="map-progress-card">
        <div>
          <span>BÖLGE USTALIĞI</span>
          <strong>{themeStars}/{themeStarCapacity} yıldız</strong>
        </div>
        <div className="map-progress-track">
          <i style={{ width: `${themeStarCapacity ? (themeStars / themeStarCapacity) * 100 : 0}%` }} />
        </div>
      </section>

      <section className="map-route" aria-label={`${activeTheme.title} seviyeleri`}>
        <svg className="map-route-line" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <path d="M20 84 C48 77 76 74 62 63 S22 58 33 48 S78 42 69 31 S31 25 39 15" />
        </svg>

        {themeLevels.map((item, index) => {
          const completed = completedLevels.includes(item.levelId);
          const active = item.levelId === level.levelId;
          const locked = !isLevelUnlocked(item);
          const position = nodePositions[index] ?? nodePositions[nodePositions.length - 1];

          return (
            <button
              key={item.levelId}
              className={`map-route-node ${completed ? 'completed' : ''} ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
              style={{ left: `${position.left}%`, top: `${position.top}%` }}
              disabled={locked}
              aria-label={`Level ${item.levelId}: ${getLevelStory(item.levelId).title}`}
              onClick={() => {
                play('tap');
                setLevel(item);
                setModal('level');
              }}
            >
              <span className="map-node-crown">{completed ? '★' : locked ? '◆' : '✦'}</span>
              <strong>{item.levelId}</strong>
              <small>{completed ? 'Tamamlandı' : active ? 'Sıradaki' : locked ? 'Kilitli' : 'Açık'}</small>
            </button>
          );
        })}

      </section>

      {dailyChallenge && (
        <button
          className={`map-daily-card ${dailyChallenge.completed ? 'completed' : ''}`}
          disabled={dailyChallenge.completed}
          onClick={() => {
            play('tap');
            const target = levels.find((item) => item.levelId === dailyChallenge.levelId);
            if (target) startLevel(target);
            else setToast('Level bulunamadı');
          }}
        >
          <span className="map-daily-icon">✦</span>
          <span>
            <small>GÜNLÜK MÜCADELE</small>
            <strong>{dailyChallenge.completed ? 'Ödül alındı' : `Level ${dailyChallenge.levelId}`}</strong>
          </span>
          <b>{dailyChallenge.completed ? '✓' : `+${dailyChallenge.reward}`}</b>
        </button>
      )}

      {toast && <div className="toast map-toast">{toast}</div>}
      <BottomNavBar />
      {modal === 'level' && <LevelModal />}
    </main>
  );
}
