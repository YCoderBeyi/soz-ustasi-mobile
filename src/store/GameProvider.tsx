import { type ReactNode } from 'react';
import { ResourceProvider } from './contexts/ResourceContext';
import { SessionProvider } from './contexts/SessionContext';
import { PersistenceProvider, usePersistence } from './contexts/PersistenceContext';
import { useResource } from './contexts/ResourceContext';

function ResourceProviderBridge({ children }: { children: ReactNode }) {
  const { soundEnabled, hapticsEnabled } = usePersistence();
  return (
    <ResourceProvider soundEnabled={soundEnabled} hapticsEnabled={hapticsEnabled}>
      {children}
    </ResourceProvider>
  );
}

function SessionProviderBridge({ children }: { children: ReactNode }) {
  const { addCoins, play, haptic } = useResource();
  return (
    <SessionProvider addCoins={addCoins} play={play} haptic={haptic}>
      {children}
    </SessionProvider>
  );
}

export function GameProvider({ children }: { children: ReactNode }) {
  return (
    <PersistenceProvider>
      <ResourceProviderBridge>
        <SessionProviderBridge>
          {children}
        </SessionProviderBridge>
      </ResourceProviderBridge>
    </PersistenceProvider>
  );
}
