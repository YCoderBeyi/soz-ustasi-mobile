import { useGame } from '../store/GameContext';
import { OBJECTIVE_KEYS, getObjectiveLabels } from '../game/objectives';
import { getLevelStory } from '../data/levelStories';
import { Modal } from './Modal';
import { Button3D } from './Button3D';

export function RewardModal() {
  const { level, rewardSummary, levelMastery, earnedObjectives, goToNextLevel, play } = useGame();
  const story = getLevelStory(level.levelId);
  const totalReward = rewardSummary.base + rewardSummary.hidden + (rewardSummary.region ?? 0);
  const objectiveLabels = getObjectiveLabels(level);
  const mastery = levelMastery[level.levelId];
  const isFinal = level.levelId === 45;

  return (
    <Modal title="Mühür Açıldı!" onClose={() => { play('tap'); goToNextLevel(); }}>
      <div className="rewardHero">
        <img src="/assets/reward/v2/history.png" alt="" />
        <div>
          <span>YENİ KEŞİF</span>
          <strong>{story.title}</strong>
        </div>
      </div>
      <article className="rewardStory">
        <div className="storyMeta">
          <span>{story.era}</span>
          <span>{story.place}</span>
        </div>
        <p>{story.body}</p>
        {story.person && (
          <div className="storyPerson">
            <small>Öne çıkan isim: <b>{story.person}</b></small>
            {story.personInfo && <p>{story.personInfo}</p>}
          </div>
        )}
      </article>
      <section className="rewardMastery" aria-label="Seviye ustalığı">
        <div className="rewardStars3d" aria-label={`${mastery?.stars ?? earnedObjectives.length} yıldız`}>
          {[1, 2, 3].map((star) => (
            <img
              key={star}
              className={star <= (mastery?.stars ?? earnedObjectives.length) ? 'earned' : ''}
              src="/assets/reward/v2/star.png"
              alt=""
            />
          ))}
        </div>
        {OBJECTIVE_KEYS.map((key) => (
          <p className={earnedObjectives.includes(key) ? 'earnedNow' : mastery?.objectives.includes(key) ? 'earnedBefore' : ''} key={key}>
            <span>{mastery?.objectives.includes(key) ? '✓' : '○'}</span>{objectiveLabels[key]}
          </p>
        ))}
      </section>
      {totalReward > 0 ? (
        <div className="rewardSummary3d">
          <div className="rewardItem3d">
            <img src="/assets/reward/v2/coins.png" alt="" />
            <strong>+{rewardSummary.base} ALTIN</strong>
          </div>
          {rewardSummary.hidden > 0 && (
            <div className="rewardItem3d hiddenBonus">
              <span className="rewardIconEmoji">🎁</span>
              <strong>+{rewardSummary.hidden} BONUS</strong>
            </div>
          )}
          {rewardSummary.region && rewardSummary.region > 0 && (
            <div className="rewardItem3d regionBonus" style={{ borderColor: '#ffd966', boxShadow: '0 0 10px rgba(255,217,102,0.4)' }}>
              <span className="rewardIconEmoji" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>🏆</span>
              <strong style={{ color: '#ffe599' }}>+{rewardSummary.region} BÖLGE SANDIĞI</strong>
            </div>
          )}
          {rewardSummary.flawless && (
            <div className="rewardItem3d flawlessBonus">
              <span className="rewardIconEmoji">✨</span>
              <strong>KUSURSUZ +%50</strong>
            </div>
          )}
        </div>
      ) : (
        <p className="modalWarning">Bu mühür daha önce ödüllendirildi.</p>
      )}
      <Button3D variant={isFinal ? 'blue' : 'green'} onClick={() => { play('tap'); goToNextLevel(); }}>
        {isFinal ? 'Haritaya Dön' : 'Sonraki Seviye'}
      </Button3D>
    </Modal>
  );
}
