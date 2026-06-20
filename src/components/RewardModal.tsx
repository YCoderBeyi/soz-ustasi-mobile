import { useRef } from 'react';
import { useGame } from '../store/GameContext';
import { OBJECTIVE_KEYS, chooseBestMastery, getObjectiveLabels } from '../game/objectives';
import { getLevelStory } from '../data/levelStories';
import { Modal } from './Modal';
import { Button3D } from './Button3D';
import { levels } from '../data/levels';
import type { LevelData } from '../types';

export function isFinalLevel(levelId: number, catalog: LevelData[] = levels): boolean {
  return levelId === catalog.at(-1)?.levelId;
}

type RewardItem = {
  key: string;
  icon: string;
  label: string;
  className: string;
};

export function RewardModal() {
  const {
    level, rewardSummary, levelMastery, earnedObjectives, goToNextLevel, play,
  } = useGame();
  // Both the backdrop/X (onClose) and the primary button advance the level.
  // goToNextLevel has no idempotency guard, so a fast double activation (button
  // tap + backdrop dismiss) could skip a level. This ref collapses them to one.
  const advancingRef = useRef(false);
  const advance = () => {
    if (advancingRef.current) return;
    advancingRef.current = true;
    play('tap');
    goToNextLevel();
  };
  const story = getLevelStory(level.levelId);
  const objectiveLabels = getObjectiveLabels(level);
  const mastery = levelMastery[level.levelId];
  const displayedMastery = chooseBestMastery(mastery, earnedObjectives);
  const isFinal = isFinalLevel(level.levelId);
  const rewardItems: RewardItem[] = [
    rewardSummary.base > 0 ? {
      key: 'base',
      icon: '/assets/reward/v2/coins.png',
      label: `+${rewardSummary.base} ALTIN`,
      className: '',
    } : null,
    rewardSummary.hidden > 0 ? {
      key: 'hidden',
      icon: '/assets/reward/v2/history.png',
      label: `+${rewardSummary.hidden} GİZLİ BONUS`,
      className: 'hiddenBonus',
    } : null,
    rewardSummary.region !== undefined && rewardSummary.region > 0 ? {
      key: 'region',
      icon: '/assets/reward/v2/star.png',
      label: `+${rewardSummary.region} BÖLGE SANDIĞI`,
      className: 'regionBonus',
    } : null,
    rewardSummary.flawless ? {
      key: 'flawless',
      icon: '/assets/reward/v2/star.png',
      label: 'KUSURSUZ +%50',
      className: 'flawlessBonus',
    } : null,
    rewardSummary.doubled ? {
      key: 'doubler',
      icon: '/assets/reward/v2/coins.png',
      label: 'ALTIN KATLAYICI ×2',
      className: 'doublerBonus',
    } : null,
  ].filter((item): item is RewardItem => item !== null);

  return (
    <Modal title="Mühür Açıldı!" onClose={advance}>
      <div className="rewardModalBody">
        <div className="rewardHero">
          <img src="/assets/reward/v2/history.png" alt="" />
          <div><span>YENİ KEŞİF</span><strong>{story.title}</strong></div>
        </div>
        <article className="rewardStory">
          <div className="storyMeta"><span>{story.era}</span><span>{story.place}</span></div>
          <p>{story.body}</p>
          {story.impact && (
            <p className="storyImpact"><b>Neden önemli?</b> {story.impact}</p>
          )}
          {story.today && (
            <p className="storyToday"><b>Bugün nerede?</b> {story.today}</p>
          )}
          {story.person && (
            <div className="storyPerson">
              <small>Öne çıkan isim: <b>{story.person}</b></small>
              {story.personInfo && <p>{story.personInfo}</p>}
            </div>
          )}
        </article>
        <section className="rewardMastery" aria-label="Seviye ustalığı">
          <div className="rewardStars3d" aria-label={`${displayedMastery.stars} yıldız`}>
            {[1, 2, 3].map((star) => (
              <img
                key={star}
                className={star <= displayedMastery.stars ? 'earned' : ''}
                src="/assets/reward/v2/star.png"
                alt=""
              />
            ))}
          </div>
          {OBJECTIVE_KEYS.map((key) => (
            <p className={earnedObjectives.includes(key) ? 'earnedNow' : mastery?.objectives.includes(key) ? 'earnedBefore' : ''} key={key}>
              <span>{displayedMastery.objectives.includes(key) ? '✓' : '○'}</span>{objectiveLabels[key]}
            </p>
          ))}
        </section>
        {rewardItems.length > 0 ? (
          <div className="rewardSummary3d">
            {rewardItems.map((item) => (
              <div key={item.key} className={`rewardItem3d ${item.className}`.trim()}>
                <img src={item.icon} alt="" />
                <strong>{item.label}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="modalWarning">Bu mühür daha önce ödüllendirildi.</p>
        )}
      </div>
      <div className="rewardActions rewardActionsSticky">
        <Button3D variant={isFinal ? 'blue' : 'green'} onClick={advance}>
          {isFinal ? 'Haritaya Dön' : 'Sonraki Seviye'}
        </Button3D>
      </div>
    </Modal>
  );
}
