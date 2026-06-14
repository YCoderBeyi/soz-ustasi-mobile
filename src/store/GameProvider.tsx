import { type ReactNode } from 'react';
import { ResourceProvider } from './contexts/ResourceContext';
import { SessionProvider } from './contexts/SessionContext';
import { PersistenceProvider, usePersistence } from './contexts/PersistenceContext';
import { useResource } from './contexts/ResourceContext';
import { GameContextBridge } from './GameContext';

function ResourceProviderBridge({ children }: { children: ReactNode }) {
  const { soundEnabled, hapticsEnabled } = usePersistence();
  return (
    <ResourceProvider soundEnabled={soundEnabled} hapticsEnabled={hapticsEnabled}>
      {children}
    </ResourceProvider>
  );
}

function SessionProviderBridge({ children }: { children: ReactNode }) {
  const { addCoins, spendHint, play, haptic } = useResource();
  const {
    currentLevelId, setCurrentLevelId,
    awardedLevels,
    markLevelCompleted, markLevelAwarded,
    mergeMastery, addCollectedWord, updateStats,
    dailyChallenge, claimDailyReward,
  } = usePersistence();
  return (
    <SessionProvider
      initialLevelId={currentLevelId}
      setCurrentLevelId={setCurrentLevelId}
      addCoins={addCoins}
      spendHint={spendHint}
      play={play}
      haptic={haptic}
      awardedLevels={awardedLevels}
      markLevelCompleted={markLevelCompleted}
      markLevelAwarded={markLevelAwarded}
      mergeMastery={mergeMastery}
      addCollectedWord={addCollectedWord}
      updateStats={updateStats}
      dailyChallenge={dailyChallenge}
      claimDailyReward={claimDailyReward}
    >
      {children}
    </SessionProvider>
  );
}

export function GameProvider({ children }: { children: ReactNode }) {
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
