import type { CSSProperties } from 'react';
import { useGame } from '../store/GameContext';
import { OBJECTIVE_KEYS, getObjectiveLabels } from '../game/objectives';
import { getLevelStory } from '../data/levelStories';
import { getTheme } from '../data/themes';

// Tüm seviyeler aynı çark-tabanlı kelime kurma mekaniğini oynatır; puzzleType
// veride tematik bilgi olarak korunur ama oyuncuya ayrı bir "oyun tipi" gibi
// sunulmaz (anagram modu fiilen crossword ile aynı oynanıyordu).
const PUZZLE_BADGE_LABEL = 'Kelime Bulmaca';
const PUZZLE_BADGE_ICON = '✚';

const ASSETS = '/assets/level-start';

export function LevelModal() {
  const { level, levelMastery, setModal, startLevel, play, levelStats } = useGame();
  const theme = getTheme(level.themeId);
  const story = getLevelStory(level.levelId);
  const objectiveLabels = getObjectiveLabels(level);
  const mastery = levelMastery[level.levelId];
  const stats = levelStats[level.levelId];
  const puzzleLabel = PUZZLE_BADGE_LABEL;
  const puzzleIcon = PUZZLE_BADGE_ICON;

  return (
    <div className="modalShade modalShadeLevel">
      <section
        className="modal levelModal levelModal--premium"
        style={{ '--level-bg': `url(${theme.backgroundImage})`, '--level-accent': theme.primaryColor } as CSSProperties}
      >
        <button className="levelClose" onClick={() => { play('tap'); setModal(null); }} aria-label="Kapat">
          <img src={`${ASSETS}/03-close-button.png`} alt="" className="levelCloseImg" />
        </button>

        <div className="levelModalBody">
          <div className="levelHero">
            <img className="levelHeroFrame" src={`${ASSETS}/02-hero-card-frame.png`} alt="" />
            <div className="levelHeroContent">
              <span className="levelBadge">LEVEL {level.levelId}</span>
              <div className="puzzleTypeBadge">
                <span>{puzzleIcon}</span>
                <span>{puzzleLabel}</span>
              </div>
              <h2>{theme.title}</h2>
              <p>{level.mainWords.length} ana kelime · {level.hiddenWords.length} gizli keşif</p>
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

          <div className="levelStory">
            <img className="levelStoryFrame" src={`${ASSETS}/09-story-card-frame.png`} alt="" />
            <div className="levelStoryContent">
              <div className="levelStoryMeta">
                <span>{story.era}</span>
                <span>{story.place}</span>
              </div>
              <strong>{story.title}</strong>
              <p>{story.body}</p>
            </div>
          </div>

          {stats && (
            <div className="levelStatsLine">
              <span>Süre {stats.bestTime}s</span>
              <span>Seri {stats.bestStreak}</span>
              <span>Deneme {stats.attempts}</span>
            </div>
          )}

          <div className="briefObjectives" aria-label="Ustalık hedefleri">
            {OBJECTIVE_KEYS.map((key) => (
              <div className={`objectiveRow ${mastery?.objectives.includes(key) ? 'earned' : ''}`} key={key}>
                <span className="objectiveStar">{mastery?.objectives.includes(key) ? '★' : '☆'}</span>
                <p>{objectiveLabels[key]}</p>
                <div className="objectiveBadge">
                  <img src={`${ASSETS}/10-objective-row-frame.png`} alt="" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="levelModalFooter">
          <button className="levelPlayBtn" onClick={() => { play('tap'); startLevel(level); }}>
            <img className="levelPlayBtnFrame" src={`${ASSETS}/13-play-button-green-frame.png`} alt="" />
            <span className="levelPlayBtnText">
              {mastery ? (mastery.stars < 3 ? 'EKSİK YILDIZLARI TAMAMLA' : 'TEKRAR OYNA') : 'OYNA'}
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
