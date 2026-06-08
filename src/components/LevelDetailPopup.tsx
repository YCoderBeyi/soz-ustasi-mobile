import type { CSSProperties } from 'react';
import { useGame } from '../store/GameContext';
import { getLevelStory } from '../data/levelStories';
import { getTheme } from '../data/themes';
import { FiligreeDivider } from './vectors/FiligreeDivider';
import { Icon, V2Icon } from './Icon';
import { Button3D } from './Button3D';
import { StarRating } from './StarRating';

export function LevelDetailPopup() {
  const { level, levelMastery, setModal, startLevel, play, setScreen, levelStats } = useGame();
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
        <button className="svgBtn modalClose3d levelDetailClose" onClick={() => { play('tap'); setModal(null); }} aria-label="Kapat">
          <V2Icon name="closeButton" />
        </button>

        <div className="levelDetailHeader">
          <span className="levelDetailBadge">LEVEL {level.levelId}</span>
          <h2>{theme.title}</h2>
          {story && (
            <div className="levelDetailMeta">
              <span>{story.era}</span>
              <span>·</span>
              <span>{story.place}</span>
            </div>
          )}
        </div>

        <FiligreeDivider className="levelDetailDivider" />

        <div className="levelDetailInfo">
          <div className="levelDetailStat">
            <Icon name="tasks" size={32} className="levelDetailStatIcon" />
            <strong>{level.mainWords.length}</strong>
            <span>Ana Kelime</span>
          </div>
          <div className="levelDetailStat">
            <Icon name="dictionary" size={32} className="levelDetailStatIcon" />
            <strong>{level.hiddenWords.length}</strong>
            <span>Gizli Keşif</span>
          </div>
          <div className="levelDetailStat">
            <Icon name="coin" size={32} className="levelDetailStatIcon" />
            <strong>{level.reward.baseCoin}</strong>
            <span>Ödül</span>
          </div>
        </div>

        {story && (
          <div className="levelDetailStory">
            <p>{story.body}</p>
          </div>
        )}

        {stats && (
          <div className="levelDetailStats">
            <span><Icon name="daily" size={16} /> {stats.bestTime}s</span>
            <span><Icon name="crown" size={16} /> {stats.bestStreak}</span>
            <span><Icon name="shuffle" size={16} /> {stats.attempts}</span>
          </div>
        )}

        {mastery && <StarRating stars={mastery.stars} large />}

        <Button3D variant="gold" className="levelDetailStart" onClick={handleStart}>
          {mastery ? (mastery.stars < 3 ? 'EKSİK YILDIZLARI TAMAMLA' : 'TEKRAR OYNA') : 'BAŞLA'}
        </Button3D>
      </section>
    </div>
  );
}
