import { useState, useCallback, useRef, useEffect, type CSSProperties } from 'react';
import { useGame } from '../../store/GameContext';
import { getTheme } from '../../data/themes';
import { getLevelStory } from '../../data/levelStories';
import { OBJECTIVE_KEYS, getObjectiveLabels } from '../../game/objectives';
import './LevelStartScreen.css';

const ASSETS = '/assets/level-start';
const ASSETS_V2 = `${ASSETS}/v2`;

// puzzleType veride korunur; oyuncuya ayrı bir oyun tipi gibi sunulmaz.
const PUZZLE_BADGE_LABEL = 'Kelime Bulmaca';

function BriefingStatIcon({ kind }: { kind: 'main' | 'secret' | 'reward' }) {
  const sources = {
    main: '/assets/map/nav-3d/nav-dictionary.png',
    secret: `${ASSETS_V2}/briefing-secret-v2.png`,
    reward: `${ASSETS_V2}/briefing-reward.png`,
  };
  return <img className={`ls-stat-icon ls-stat-icon--${kind}`} src={sources[kind]} alt="" />;
}

export function LevelStartScreen() {
  const { level, levelMastery, startLevel, setScreen, play } = useGame();
  const theme = getTheme(level.themeId);
  const story = getLevelStory(level.levelId);
  const objectiveLabels = getObjectiveLabels(level);
  const mastery = levelMastery[level.levelId];
  const puzzleLabel = PUZZLE_BADGE_LABEL;
  const [launching, setLaunching] = useState(false);
  const launchTimerRef = useRef<number | null>(null);

  const handlePlay = useCallback(() => {
    if (launching) return;
    play('seal');
    setLaunching(true);
    launchTimerRef.current = window.setTimeout(() => {
      startLevel(level);
    }, 300);
  }, [launching, level, play, startLevel]);

  const handleClose = useCallback(() => {
    if (launching) return;
    play('tap');
    setScreen('map');
  }, [launching, play, setScreen]);

  useEffect(() => () => {
    if (launchTimerRef.current !== null) {
      window.clearTimeout(launchTimerRef.current);
    }
  }, []);

  return (
    <main
      className={`ls-screen${launching ? ' ls-screen--launching' : ''}`}
      style={{ '--ls-bg': `url(${theme.backgroundImage})` } as CSSProperties}
    >
      <button type="button" className="ls-close" onClick={handleClose} aria-label="Kapat" disabled={launching}>
        <span aria-hidden="true">×</span>
      </button>

      <div className="ls-scroll">
        <div className="ls-hero-card">
          <div className="ls-hero-content">
            <div className="ls-hero-left">
              <span className="ls-level-badge">SEVİYE {level.levelId}</span>
              <span className="ls-puzzle-type">{puzzleLabel}</span>
              <h2 className="ls-theme-title">{theme.title}</h2>
            </div>
            <div className="ls-hero-seal">
              <img src="/assets/ui/start/wax-seal-s.webp" alt="" />
            </div>
          </div>
        </div>

        {level.levelId === 76 && !mastery && (
          <p className="ls-route-note" role="note">
            Yeni rota başladı: {level.mainWords.length} ana kelimeyi tamamla;
            {level.hiddenWords.length > 0 ? ' gizli kelimeler isteğe bağlı keşif ve bonus sağlar.' : ' ek gizli hedef yok.'}
          </p>
        )}

        <div className="ls-stats">
          <div className="ls-stat ls-stat-card">
            <BriefingStatIcon kind="main" />
            <div className="ls-stat-inner">
              <strong>Ana Kelimeler</strong>
              <span className="ls-stat-value">{level.mainWords.length} Kelime</span>
            </div>
          </div>
          <div className="ls-stat ls-stat-card ls-stat-card-secret">
            <BriefingStatIcon kind="secret" />
            <div className="ls-stat-inner">
              <strong>{level.hiddenWords.length > 0 ? 'Gizli Kelimeler' : 'Ek Hedef'}</strong>
              <span className="ls-stat-value">{level.hiddenWords.length > 0 ? `${level.hiddenWords.length} Adet` : 'Kusursuz tur'}</span>
            </div>
          </div>
          <div className="ls-stat ls-stat-reward">
            <BriefingStatIcon kind="reward" />
            <div className="ls-stat-inner">
              <strong>Ödül</strong>
              <span className="ls-stat-value">{level.reward.baseCoin} Altın</span>
              {level.hiddenWords.length > 0 && level.reward.hiddenWordBonus > 0 && (
                <span className="ls-stat-bonus">+ Gizli Bonus</span>
              )}
            </div>
          </div>
        </div>

        {theme.modifier && (
          <div className="ls-modifier">
            <span className="ls-modifier-icon">{theme.modifier.icon}</span>
            <div className="ls-modifier-text">
              <strong>{theme.modifier.label}</strong>
              <p>{theme.modifier.description}</p>
            </div>
          </div>
        )}

        <div className="ls-story">
          <span className="ls-story-mark" aria-hidden="true">✦</span>
          <div className="ls-story-content">
            <div className="ls-story-meta">
              <span>{story.era}</span>
              <span>{story.place.toLocaleUpperCase('tr-TR')}</span>
            </div>
            <strong className="ls-story-title">{story.title}</strong>
          </div>
        </div>

        <div className="ls-objectives">
          {OBJECTIVE_KEYS.map((key) => (
            <div
              className={`ls-objective-row ${mastery?.objectives.includes(key) ? 'earned' : ''}`}
              key={key}
            >
              <span className="ls-objective-star">
                {mastery?.objectives.includes(key) ? '★' : '☆'}
              </span>
              <span className="ls-objective-label">{objectiveLabels[key]}</span>
              <div className="ls-objective-badge">
                <img
                  src={`${ASSETS_V2}/${mastery?.objectives.includes(key) ? 'objective-complete' : 'objective-open'}.png`}
                  alt=""
                />
              </div>
            </div>
          ))}
        </div>

        <button type="button" className="ls-play" onClick={handlePlay} disabled={launching} aria-busy={launching}>
          <span className="ls-play-label">
            {launching ? 'HAZIRLANIYOR…' : mastery ? (mastery.stars < 3 ? 'EKSİK YILDIZLARI TAMAMLA' : 'TEKRAR OYNA') : 'OYNA'}
          </span>
        </button>
      </div>
    </main>
  );
}
