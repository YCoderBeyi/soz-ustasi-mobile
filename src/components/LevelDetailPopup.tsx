import type { CSSProperties } from 'react';
import { useGame } from '../store/GameContext';
import { getLevelStory } from '../data/levelStories';
import { getTheme } from '../data/themes';

const ASSETS = '/assets/level-start';

export function LevelDetailPopup() {
  const { level, levelMastery, setModal, startLevel, play, levelStats } = useGame();
  const theme = getTheme(level.themeId);
  const story = getLevelStory(level.levelId);
  const mastery = levelMastery[level.levelId];
  const stats = levelStats[level.levelId];

  const handleStart = () => {
    play('tap');
    startLevel(level);
  };

  return (
    <div className="modalShade" onClick={() => { play('tap'); setModal(null); }}>
      <section
        className="levelDetail parchment-bg"
        style={{ '--level-accent': theme.primaryColor } as CSSProperties}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="levelClose" onClick={() => { play('tap'); setModal(null); }} aria-label="Kapat">
          <img src={`${ASSETS}/03-close-button.png`} alt="" className="levelCloseImg" />
        </button>

        <div className="levelHero">
          <img className="levelHeroFrame" src={`${ASSETS}/02-hero-card-frame.png`} alt="" />
          <div className="levelHeroContent">
            <span className="levelBadge">LEVEL {level.levelId}</span>
            <h2>{theme.title}</h2>
            {story && (
              <div className="levelStoryMeta">
                <span>{story.era}</span>
                <span>{story.place}</span>
              </div>
            )}
          </div>
          <div className="levelSealWrap">
            <img className="levelSealImg" src={`${ASSETS}/04-wax-lock-seal.png`} alt="" />
            <span className="levelSealNumber">{level.levelId}</span>
          </div>
        </div>

        <div className="levelStats">
          <div className="statBlock statBlockCard">
            <img className="statFrameImg" src={`${ASSETS}/06-stat-icon-main-words.png`} alt="" />
            <div className="statBlockInner">
              <strong>ANA KELİMELER</strong>
              <span>{level.mainWords.length} KELİME</span>
            </div>
          </div>
          <div className="statBlock statBlockCard statBlockSecret">
            <img className="statFrameImg" src={`${ASSETS}/07-stat-icon-secret-words.png`} alt="" />
            <div className="statBlockInner">
              <strong>GİZLİ KELİMELER</strong>
              <span>{level.hiddenWords.length} ADET</span>
            </div>
          </div>
          <div className="statBlock statBlockReward">
            <img className="statFrameImg" src={`${ASSETS}/08-stat-icon-reward.png`} alt="" />
            <div className="statBlockInner">
              <strong>ÖDÜL</strong>
              <span>{level.reward.baseCoin} ALTIN</span>
              <small>+ Gizli Bonus</small>
            </div>
          </div>
        </div>

        {theme.modifier && (
          <div className="themeModifierTag">
            <span>{theme.modifier.icon}</span>
            <div>
              <strong>{theme.modifier.label}</strong>
              <p>{theme.modifier.description}</p>
            </div>
          </div>
        )}

        {story && (
          <div className="levelStory">
            <img className="levelStoryFrame" src={`${ASSETS}/09-story-card-frame.png`} alt="" />
            <div className="levelStoryContent">
              <strong>{story.title}</strong>
              <p>{story.body}</p>
            </div>
          </div>
        )}

        {stats && (
          <div className="levelStatsLine">
            <span>⏱ {stats.bestTime}s</span>
            <span>👑 {stats.bestStreak}</span>
            <span>🔀 {stats.attempts}</span>
          </div>
        )}

        <div className="briefObjectives" aria-label="Ustalık hedefleri">
          {['complete', 'discovery', 'noHint'].map((key) => (
            <div className={`objectiveRow ${mastery?.objectives.includes(key) ? 'earned' : ''}`} key={key}>
              <span className="objectiveStar">{mastery?.objectives.includes(key) ? '★' : '☆'}</span>
              <p>{key === 'complete' ? 'Tüm ana kelimeleri bul' : key === 'discovery' ? 'Gizli kelime keşfet' : 'İpucu kullanmadan bitir'}</p>
              <div className="objectiveBadge">
                <img src={`${ASSETS}/10-objective-row-frame.png`} alt="" />
              </div>
            </div>
          ))}
        </div>

        <button className="levelPlayBtn" onClick={handleStart}>
          <img className="levelPlayBtnFrame" src={`${ASSETS}/13-play-button-green-frame.png`} alt="" />
          <span className="levelPlayBtnText">
            {mastery ? (mastery.stars < 3 ? 'EKSİK YILDIZLARI TAMAMLA' : 'TEKRAR OYNA') : 'BAŞLA'}
          </span>
        </button>
      </section>
    </div>
  );
}
