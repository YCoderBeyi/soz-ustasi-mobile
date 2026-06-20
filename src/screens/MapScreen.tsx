import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useGame } from '../store/GameContext';
import { levels } from '../data/levels';
import { themes } from '../data/themes';
import { LevelNode } from '../components/map/LevelNode';
import { BottomNav } from '../components/ui/BottomNav';
import './MapScreen.css';
import '../styles/map.css';

const PATH_POSITIONS = [
  { x: 31, y: 84 },
  { x: 66, y: 71 },
  { x: 37, y: 57 },
  { x: 68, y: 43 },
  { x: 38, y: 29 },
  { x: 63, y: 15 },
];
const LEVELS_PER_REGION = PATH_POSITIONS.length;

function getNodePositions(count: number) {
  if (count <= PATH_POSITIONS.length) return PATH_POSITIONS.slice(0, count);
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const t = count > 1 ? i / (count - 1) : 0;
    const x = 33 + 35 * t + Math.sin(t * Math.PI * 2) * 12;
    const y = 88 - 70 * t;
    positions.push({ x: Math.round(x), y: Math.round(y) });
  }
  return positions;
}

function getNodeState(
  levelId: number,
  completedLevels: number[],
  currentLevelId: number,
  isUnlocked: boolean,
): 'active' | 'completed' | 'locked' | 'future' {
  if (completedLevels.includes(levelId)) return 'completed';
  if (levelId === currentLevelId) return 'active';
  if (isUnlocked) return 'active';
  return 'locked';
}

export function MapScreen() {
  const {
    play, level, setLevel, completedLevels,
    levelMastery, toast, setToast, coins,
    isLevelUnlocked, setScreen, dailyChallenge,
  } = useGame();

  const regionGroups = useMemo(() => {
    const sorted = [...levels].sort((a, b) => a.levelId - b.levelId);
    return Array.from({ length: Math.ceil(sorted.length / LEVELS_PER_REGION) }, (_, index) => {
      const regionLevels = sorted.slice(index * LEVELS_PER_REGION, (index + 1) * LEVELS_PER_REGION);
      const theme = themes.find((item) => item.themeId === regionLevels[0]?.themeId) ?? themes[0];
      return {
        theme,
        levels: regionLevels,
        totalStars: regionLevels.length * 3,
        earnedStars: regionLevels.reduce(
          (sum, item) => sum + (levelMastery[item.levelId]?.stars ?? 0),
          0,
        ),
        isUnlocked: Boolean(regionLevels[0] && isLevelUnlocked(regionLevels[0])),
        isCompleted: regionLevels.every((item) => completedLevels.includes(item.levelId)),
      };
    });
  }, [completedLevels, isLevelUnlocked, levelMastery]);

  const initialIndex = Math.floor((level.levelId - 1) / LEVELS_PER_REGION);

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchDeltaRef = useRef(0);

  const activeGroup = regionGroups[activeIndex] ?? regionGroups[0];
  const activeTheme = activeGroup.theme;

  const handleSwipe = useCallback(
    (direction: 'left' | 'right') => {
      setActiveIndex((prev) => {
        const next = direction === 'left' ? prev + 1 : prev - 1;
        return Math.max(0, Math.min(regionGroups.length - 1, next));
      });
    },
    [regionGroups.length],
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

  const themeLevels = activeGroup.levels;
  const themeStars = activeGroup.earnedStars;
  const themeStarCapacity = activeGroup.totalStars;
  const nodePositions = useMemo(() => getNodePositions(themeLevels.length), [themeLevels.length]);

  const handleNodeClick = (item: (typeof themeLevels)[number]) => {
    play('tap');
    if (!isLevelUnlocked(item)) {
      setToast('Bu bölüm henüz kilitli');
      window.setTimeout(() => setToast(''), 1400);
      return;
    }
    setLevel(item);
    setScreen('level-start');
  };

  const handleDailyChallenge = () => {
    if (!dailyChallenge || dailyChallenge.completed) return;
    const dailyLevel = levels.find((item) => item.levelId === dailyChallenge.levelId);
    if (!dailyLevel) return;
    play('tap');
    setLevel(dailyLevel);
    setScreen('level-start');
  };

  return (
    <main className="map-screen map-screen--premium">
      <img className="map-bg" src="/assets/ui/map/map-diorama-v2.png" alt="" />
      <div className="map-screen__veil" aria-hidden="true" />

      {toast && <div className="map-toast">{toast}</div>}

      <header className="map-topbar">
        <button
          className="map-topbar-avatar"
          onClick={() => { play('tap'); setScreen('profile'); }}
          aria-label="Profil"
        >
          <img src="/assets/map/topbar-3d/topbar-profile.png" alt="" />
        </button>

        <div className="map-topbar-main">
          <div className="map-topbar-title-row">
            <span className="map-topbar-title">{activeTheme.title}</span>
          </div>
          <span className="map-topbar-subtitle">Tarihi Rehber</span>
        </div>

        <div className="map-topbar-resources">
          <div className="map-resource-pill map-resource-coin" aria-label={`${coins} altın`}>
            <img className="map-resource-icon" src="/assets/map/topbar-3d/topbar-coin.png" alt="" />
            <span className="map-resource-value">{coins}</span>
          </div>
        </div>
      </header>

      {dailyChallenge && (
        <button
          type="button"
          className={`map-daily-card ${dailyChallenge.completed ? 'map-daily-card--done' : ''}`}
          onClick={handleDailyChallenge}
          disabled={dailyChallenge.completed}
          aria-label={dailyChallenge.completed ? 'Günün görevi tamamlandı' : `Günün görevi: Level ${dailyChallenge.levelId}`}
        >
          <span>GÜNÜN GÖREVİ</span>
          <strong>
            {dailyChallenge.completed
              ? 'Tamamlandı'
              : `Level ${dailyChallenge.levelId} · +${dailyChallenge.reward} altın`}
          </strong>
        </button>
      )}

      <section
        className="map-journey"
        aria-label={`${activeTheme.title} seviyeleri`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img className="map-path-glow" src="/assets/map/path-glow-line.svg" alt="" />

        {themeLevels.map((item, index) => {
          const state = getNodeState(
            item.levelId, completedLevels, level.levelId, isLevelUnlocked(item),
          );
          const pos = nodePositions[index] ?? { x: 50, y: 50 };
          const isFirstUncompleted = !completedLevels.includes(item.levelId) && item.levelId === level.levelId;

          return (
            <LevelNode
              key={item.levelId}
              level={item.levelId}
              state={state}
              x={pos.x}
              y={pos.y}
              label={isFirstUncompleted ? 'Sıradaki' : undefined}
              onClick={() => handleNodeClick(item)}
            />
          );
        })}
      </section>

      <div className="map-theme-dots">
        {regionGroups.map((group, i) => (
          <button
            key={`${group.theme.themeId}-${i}`}
            className={`map-dot ${i === activeIndex ? 'map-dot--active' : ''} ${group.isCompleted ? 'map-dot--completed' : ''} ${!group.isUnlocked ? 'map-dot--locked' : ''}`}
            aria-label={group.theme.title}
            disabled={!group.isUnlocked}
            onClick={() => { play('tap'); setActiveIndex(i); }}
          />
        ))}
      </div>

      <div className="map-mastery">
        <span className="map-mastery-label">Bölge Ustalığı</span>
        <span className="map-mastery-value">{themeStars}/{themeStarCapacity} yıldız</span>
      </div>

      <BottomNav active="map" />
    </main>
  );
}
