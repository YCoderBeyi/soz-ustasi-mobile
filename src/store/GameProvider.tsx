import { type ReactNode, useEffect } from 'react';
import { ResourceProvider } from './contexts/ResourceContext';
import { SessionProvider } from './contexts/SessionContext';
import { PersistenceProvider, usePersistence } from './contexts/PersistenceContext';
import { useResource } from './contexts/ResourceContext';
import { GameContextBridge } from './GameContext';
import { initializeAdMob } from '../services/admob';

function ResourceProviderBridge({ children }: { children: ReactNode }) {
  const { soundEnabled, soundVolume, hapticsEnabled } = usePersistence();
  return (
    <ResourceProvider soundEnabled={soundEnabled} soundVolume={soundVolume} hapticsEnabled={hapticsEnabled}>
      {children}
    </ResourceProvider>
  );
}

function SessionProviderBridge({ children }: { children: ReactNode }) {
  const { addCoins, spendHint, play, haptic, selectedThemeId, consumeDoubler } = useResource();
  const {
    currentLevelId, setCurrentLevelId,
    awardedLevels,
    markLevelCompleted, markLevelAwarded, markWordRewarded, isWordRewarded, countRewardedBonus,
    mergeMastery, addCollectedWord, updateStats,
    dailyChallenge, claimDailyReward, calmMode,
  } = usePersistence();
  return (
    <SessionProvider
      initialLevelId={currentLevelId}
      setCurrentLevelId={setCurrentLevelId}
      addCoins={addCoins}
      spendHint={spendHint}
      consumeDoubler={consumeDoubler}
      play={play}
      haptic={haptic}
      awardedLevels={awardedLevels}
      markLevelCompleted={markLevelCompleted}
      markLevelAwarded={markLevelAwarded}
      markWordRewarded={markWordRewarded}
      isWordRewarded={isWordRewarded}
      countRewardedBonus={countRewardedBonus}
      mergeMastery={mergeMastery}
      addCollectedWord={addCollectedWord}
      updateStats={updateStats}
      dailyChallenge={dailyChallenge}
      claimDailyReward={claimDailyReward}
      selectedThemeId={selectedThemeId}
      calmMode={calmMode}
    >
      {children}
    </SessionProvider>
  );
}

export function GameProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    void initializeAdMob();
  }, []);

  return (
    <PersistenceProvider>
      <ResourceProviderBridge>
        <SessionProviderBridge>
          <GameContextBridge>
            {children}
          </GameContextBridge>
        </SessionProviderBridge>
      </ResourceProviderBridge>
    </PersistenceProvider>
  );
}
