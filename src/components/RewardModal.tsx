import { useGame } from '../store/GameContext';
import { OBJECTIVE_KEYS, getObjectiveLabels } from '../game/objectives';
import { getLevelStory } from '../data/levelStories';
import { Modal } from './Modal';
import { Icon } from './Icon';
import { Button3D } from './Button3D';
import { StarRating } from './StarRating';

export function RewardModal() {
  const { level, rewardSummary, levelMastery, earnedObjectives, goToNextLevel } = useGame();
  const story = getLevelStory(level.levelId);
  const totalReward = rewardSummary.base + rewardSummary.hidden;
  const objectiveLabels = getObjectiveLabels(level);
  const mastery = levelMastery[level.levelId];
  const isFinal = level.levelId === 45;

  return (
    <Modal title="Mühür Açıldı!" onClose={goToNextLevel}>
      <article className="rewardStory">
        <div className="storyMeta">
          <span>{story.era}</span>
          <span>{story.place}</span>
        </div>
        <strong>{story.title}</strong>
        <p>{story.body}</p>
        {story.person && (
          <div className="storyPerson">
            <small>Öne çıkan isim: <b>{story.person}</b></small>
            {story.personInfo && <p>{story.personInfo}</p>}
          </div>
        )}
      </article>
      <section className="rewardMastery" aria-label="Seviye ustalığı">
        <StarRating stars={mastery?.stars ?? earnedObjectives.length} large />
        {OBJECTIVE_KEYS.map((key) => (
          <p className={earnedObjectives.includes(key) ? 'earnedNow' : mastery?.objectives.includes(key) ? 'earnedBefore' : ''} key={key}>
            <span>{mastery?.objectives.includes(key) ? '✓' : '○'}</span>{objectiveLabels[key]}
          </p>
        ))}
      </section>
      {totalReward > 0 ? (
        <>
          <p><Icon name="coin" size={22} /> +{rewardSummary.base} Elmas</p>
          {rewardSummary.hidden > 0 && <p>🎁 +{rewardSummary.hidden} Gizli Kelime Bonusu</p>}
        </>
      ) : (
        <p>Bu mühür daha önce ödüllendirildi.</p>
      )}
      <Button3D variant={isFinal ? 'blue' : 'green'} onClick={goToNextLevel}>
        {isFinal ? 'Haritaya Dön' : 'Sonraki Level'}
      </Button3D>
    </Modal>
  );
}
