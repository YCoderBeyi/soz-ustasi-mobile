import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useGame } from '../store/GameContext';
import { levels } from '../data/levels';
import { themes } from '../data/themes';
import { LevelNode } from '../components/map/LevelNode';
import { BottomNav } from '../components/ui/BottomNav';
import './MapScreen.css';
import '../styles/map.css';

// Level nodes live in the coordinate space of map-diorama-v2 (941x1672), not of the screen: x/y are percentages of the
// image and k is the platform width as a fraction of the image width. The map stage reproduces the background's
// "cover" crop, so a node stays on its platform at every screen shape. The image has seven platforms; the lowest one
// sits behind the bottom navigation, so levels 1-6 use platforms 2-7 (measured from the image).
const PLATFORMS = [
  { x: 49.0, y: 69.6, k: 0.148 },
  { x: 59.6, y: 56.8, k: 0.117 },
  { x: 51.1, y: 46.8, k: 0.117 },
  { x: 66.2, y: 38.7, k: 0.09 },
  { x: 52.0, y: 32.4, k: 0.083 },
  { x: 64.4, y: 26.7, k: 0.072 },
];
const LEVELS_PER_REGION = PLATFORMS.length;

function getNodePositions(count: number) {
  return PLATFORMS.slice(0, count);
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
  const touchVerticalRef = useRef(0);
  const regionsRef = useRef<HTMLDivElement>(null);

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
    touchVerticalRef.current = 0;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    touchDeltaRef.current = e.touches[0].clientX - touchStartRef.current.x;
    touchVerticalRef.current = e.touches[0].clientY - touchStartRef.current.y;
  }, []);

  const handleTouchEnd = useCallback(() => {
    const delta = touchDeltaRef.current;
    if (Math.abs(delta) > 50 && Math.abs(delta) > Math.abs(touchVerticalRef.current)) {
      handleSwipe(delta < 0 ? 'left' : 'right');
    }
    touchStartRef.current = null;
    touchDeltaRef.current = 0;
    touchVerticalRef.current = 0;
  }, [handleSwipe]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof Element && e.target.closest('input, textarea, select, [contenteditable="true"], [role="dialog"]')) return;
      if (e.key === 'ArrowLeft') handleSwipe('left');
      else if (e.key === 'ArrowRight') handleSwipe('right');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleSwipe]);

  useEffect(() => {
    regionsRef.current?.querySelector<HTMLElement>('[aria-current="true"]')?.scrollIntoView?.({ block: 'nearest', inline: 'center' });
  }, [activeIndex]);

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
      <img className="map-bg" src="/assets/ui/map/map-diorama-v2.webp" alt="" />
      <div className="map-screen__veil" aria-hidden="true" />

      {toast && <div className="map-toast" role="status">{toast}</div>}

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
        onTouchCancel={() => { touchStartRef.current = null; touchDeltaRef.current = 0; touchVerticalRef.current = 0; }}
      >
        <div className="map-stage">
        {themeLevels.map((item, index) => {
          const state = getNodeState(
            item.levelId, completedLevels, level.levelId, isLevelUnlocked(item),
          );
          const pos = nodePositions[index] ?? PLATFORMS[PLATFORMS.length - 1];
          const isFirstUncompleted = !completedLevels.includes(item.levelId) && item.levelId === level.levelId;

          return (
            <LevelNode
              key={item.levelId}
              level={item.levelId}
              state={state}
              x={pos.x}
              y={pos.y}
              k={pos.k}
              label={isFirstUncompleted ? 'Sıradaki' : undefined}
              onClick={() => handleNodeClick(item)}
            />
          );
        })}
        </div>
      </section>

      <div ref={regionsRef} className="map-theme-dots" role="group" aria-label="Bölge seçimi">
        {regionGroups.map((group, i) => (
          <button
            key={`${group.theme.themeId}-${i}`}
            className={`map-dot ${i === activeIndex ? 'map-dot--active' : ''} ${group.isCompleted ? 'map-dot--completed' : ''} ${!group.isUnlocked ? 'map-dot--locked' : ''}`}
            aria-label={`Bölge ${i + 1}: ${group.theme.title}, seviyeler ${group.levels[0].levelId}–${group.levels[group.levels.length - 1].levelId}`}
            aria-current={i === activeIndex ? 'true' : undefined}
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
