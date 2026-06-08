import type { CSSProperties } from 'react';
import { useGame } from '../store/GameContext';
import { OBJECTIVE_KEYS, getObjectiveLabels } from '../game/objectives';
import { getLevelStory } from '../data/levelStories';
import { getTheme } from '../data/themes';
import { WaxSeal } from './WaxSeal';
import { Icon, V2Icon } from './Icon';
import { Button3D } from './Button3D';

const puzzleTypeLabels: Record<string, string> = {
  crossword: 'Çapraz Bulmaca',
  anagram: 'Anagram',
  wordsearch: 'Kelime Avı',
};

const puzzleTypeIcons: Record<string, string> = {
  crossword: '✚',
  anagram: '↔',
  wordsearch: '🔍',
};

export function LevelModal() {
  const { level, levelMastery, setModal, startLevel, play, levelStats } = useGame();
  const theme = getTheme(level.themeId);
  const story = getLevelStory(level.levelId);
  const objectiveLabels = getObjectiveLabels(level);
  const mastery = levelMastery[level.levelId];
  const stats = levelStats[level.levelId];
  const puzzleLabel = puzzleTypeLabels[level.puzzleType ?? 'crossword'] ?? 'Bulmaca';
  const puzzleIcon = puzzleTypeIcons[level.puzzleType ?? 'crossword'] ?? '✚';

  return (
    <div className="modalShade modalShadeLevel">
      <section
        className="modal levelModal"
        style={{ '--level-bg': `url(${theme.backgroundImage})`, '--level-accent': theme.primaryColor } as CSSProperties}
      >
        <button className="svgBtn modalClose3d levelClose" onClick={() => { play('tap'); setModal(null); }} aria-label="Kapat"><V2Icon name="closeButton" /></button>

        <div className="levelHero">
          <div className="levelHeroCopy">
            <span>LEVEL {level.levelId}</span>
            <div className="puzzleTypeBadge">
              <span>{puzzleIcon}</span>
              <span>{puzzleLabel}</span>
            </div>
            <h2>{theme.title}</h2>
            <p><Icon name="tasks" size={18} /> {level.mainWords.length} ana kelime · <Icon name="dictionary" size={18} /> {level.hiddenWords.length} gizli keşif</p>
          </div>
          <WaxSeal className="sealCore" label={String(level.levelId)} />
        </div>

        <div className="levelStats">
          <div className="statBlock">
            <div className="statIcon">✎</div>
            <strong>ANA KELİMELER</strong>
            <span>{level.mainWords.length} KELİME</span>
            <div className="pips" aria-hidden="true">
              {Array.from({ length: Math.min(level.mainWords.length, 6) }).map((_, index) => (
                <span key={index} />
              ))}
            </div>
          </div>
          <div className="statDivider" />
          <div className="statBlock">
            <div className="statIcon">□</div>
            <strong>GİZLİ KELİMELER</strong>
            <span>{level.hiddenWords.length} ADET</span>
            <div className="statQuestion">?</div>
          </div>
          <div className="statDivider" />
          <div className="statBlock">
            <div className="statIcon">★</div>
            <strong>ÖDÜL</strong>
            <span>{level.reward.baseCoin} ELMAS</span>
            <small>+ GİZLİ BONUS</small>
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

        <div className="levelHint">
          <div className="levelStoryMeta">
            <span>{story.era}</span>
            <span>{story.place}</span>
          </div>
          <strong>{story.title}</strong>
          <p>{story.body}</p>
        </div>

        {stats && (
          <div className="levelStatsLine">
            <span><Icon name="daily" size={16} /> {stats.bestTime}s</span>
            <span><Icon name="crown" size={16} /> {stats.bestStreak}</span>
            <span><Icon name="shuffle" size={16} /> {stats.attempts}</span>
          </div>
        )}

        <div className="briefObjectives" aria-label="Ustalık hedefleri">
          {OBJECTIVE_KEYS.map((key) => (
            <div className={`objectiveRow ${mastery?.objectives.includes(key) ? 'earned' : ''}`} key={key}>
              <span className="objectiveStar">{mastery?.objectives.includes(key) ? '★' : '☆'}</span>
              <p>{objectiveLabels[key]}</p>

            </div>
          ))}
        </div>

        <Button3D variant="green" className="levelStart" onClick={() => { play('tap'); startLevel(level); }}>
          {mastery ? (mastery.stars < 3 ? 'EKSİK YILDIZLARI TAMAMLA' : 'TEKRAR OYNA') : 'OYNA'}
        </Button3D>
      </section>
    </div>
  );
}
