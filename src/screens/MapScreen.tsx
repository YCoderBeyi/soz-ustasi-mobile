import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useGame } from '../store/GameContext';
import { getThemeGroups, getActiveThemeIndex } from '../data/themeUtils';
import { levels } from '../data/levels';
import { LevelModal } from '../components/LevelModal';
import { BottomNavBar } from '../components/BottomNavBar';
import './MapScreen.css';

const NODE_POSITIONS = [
  { left: 17, top: 84 },
  { left: 61, top: 75 },
  { left: 29, top: 63 },
  { left: 69, top: 52 },
  { left: 36, top: 40 },
  { left: 72, top: 29 },
  { left: 42, top: 18 },
  { left: 76, top: 8 },
];

function getNodePosition(index: number, total: number) {
  if (total <= NODE_POSITIONS.length) {
    return NODE_POSITIONS[index] ?? NODE_POSITIONS[NODE_POSITIONS.length - 1];
  }
  const leftBase = 20;
  const leftSpread = 55;
  const topBase = 85;
  const topDrop = 10;
  const step = total > 1 ? 1 / (total - 1) : 0;
  const progress = step * index;
  const left = leftBase + leftSpread * progress + Math.sin(progress * Math.PI * 2.5) * 8;
  const top = topBase - (topBase - topDrop) * progress;
  return { left: Math.round(left), top: Math.round(top) };
}

export function MapScreen() {
  const {
    play, level, setLevel, setModal, startLevel, completedLevels,
    collectedWords, levelMastery, modal, toast, setToast,
    isLevelUnlocked, dailyChallenge, levelStats,
  } = useGame();

  const themeGroups = useMemo(
    () => getThemeGroups(completedLevels, levelMastery),
    [completedLevels, levelMastery],
  );

  const initialIndex = useMemo(
    () => getActiveThemeIndex(level.levelId, completedLevels),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchDeltaRef = useRef(0);

  const activeThemeGroup = themeGroups[activeIndex] ?? themeGroups[0];
  const activeTheme = activeThemeGroup.theme;

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      setActiveIndex((prev) => {
        const next = direction === 'left' ? prev + 1 : prev - 1;
        return Math.max(0, Math.min(themeGroups.length - 1, next));
      });
    },
    [themeGroups.length],
  );

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    touchDeltaRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current.x;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = touchDeltaRef.current;
    if (Math.abs(delta) > 50) {
      handleSwipe(delta < 0 ? 'left' : 'right');
    }
    touchStartRef.current = null;
    touchDeltaRef.current = 0;
  }, [handleSwipe]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handleSwipe('left');
      else if (e.key === 'ArrowRight') handleSwipe('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  const themeLevels = activeThemeGroup.levels;
  const themeStars = activeThemeGroup.earnedStars;
  const themeStarCapacity = activeThemeGroup.totalStars;
  const totalAttempts = Object.values(levelStats).reduce((sum, stats) => sum + stats.attempts, 0);

  return (
    <main
      className="map-screen"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <img className="map-bg" src="/assets/ui/map/map-diorama-v2.png" alt="" />
      <div className="map-atmosphere" />

      <header className="map-topbar">
        <div className="map-brand">
          <span className="map-brand-kicker">SÖZ USTASI</span>
          <strong>{activeTheme.title}</strong>
          <small>{activeTheme.modifier?.label ?? activeTheme.title}</small>
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
          const position = getNodePosition(index, themeLevels.length);

          return (
            <button
              key={item.levelId}
              className={`map-route-node ${completed ? 'completed' : ''} ${active ? 'active' : ''} ${locked ? 'locked' : ''}`}
              style={{
                left: `${position.left}%`,
                top: `${position.top}%`,
                borderColor: active ? activeTheme.primaryColor : undefined,
              }}
              disabled={locked}
              aria-label={`Level ${item.levelId}: ${item.mainWords[0]?.word ?? ''}`}
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

      <nav className="map-theme-dots" aria-label="Tema gezinmesi">
        {themeGroups.map((group, i) => (
          <button
            key={group.theme.themeId}
            className={`map-theme-dot ${i === activeIndex ? 'active' : ''} ${group.isCompleted ? 'completed' : ''} ${!group.isUnlocked ? 'locked' : ''}`}
            style={i === activeIndex ? { background: group.theme.primaryColor } : undefined}
            aria-label={group.theme.title}
            disabled={!group.isUnlocked}
            onClick={() => {
              play('tap');
              setActiveIndex(i);
            }}
          />
        ))}
      </nav>

      {toast && <div className="toast map-toast">{toast}</div>}
      <BottomNavBar />
      {modal === 'level' && <LevelModal />}
    </main>
  );
}
