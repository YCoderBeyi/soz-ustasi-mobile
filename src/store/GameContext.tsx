import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useResource } from './contexts/ResourceContext';
import { useSession } from './contexts/SessionContext';
import { usePersistence } from './contexts/PersistenceContext';

const GameContext = createContext<unknown>(null);

export function useGame() {
  const resource = useResource();
  const session = useSession();
  const persistence = usePersistence();
  return useMemo(() => ({ ...resource, ...session, ...persistence }), [
    resource, session, persistence,
  ]);
}

export function GameContextBridge({ children }: { children: ReactNode }) {
  const value = useGame();
  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
