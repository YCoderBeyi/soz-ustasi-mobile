# Requirements Document

## Introduction

`GameContext.tsx` currently holds all game state (600+ lines, 35+ state fields) in a single React context. Every small state change re-renders all consumer components; missing cleanups create memory leaks; `playerSave` and `levelStats` use two separate localStorage keys and there is no version migration mechanism. This spec covers splitting the context by responsibility domain, improving render performance, ensuring cleanup safety, and hardening the save layer.

## Glossary

- **GameContext**: The React context that provides game state and actions.
- **SliceContext**: A sub-context covering a single responsibility domain (e.g. `ResourceContext`, `SessionContext`).
- **PlayerSave**: Persistent player data written to localStorage.
- **Session**: A single level-play session; spans from start until the reward modal closes.
- **Feedback**: Temporary visual-haptic response to correct/wrong/hidden/shuffle/seal events.
- **Objective**: A mastery goal earnable within a level (`complete`, `discovery`, `noHint`).
- **Cleanup**: The release of React effects or timers when a component unmounts.
- **Migration**: A safe transition mechanism from an old save format to a new one.
- **StaleClosureBug**: A silent bug caused by a `useCallback` or `useEffect` capturing a stale state reference.
- **Pretty_Printer**: The serialization function (`JSON.stringify`) that formats `PlayerSave` objects into valid JSON strings.

---

## Requirements

### Requirement 1: Context Split

**User Story:** As a developer, I want state changes to only re-render the components that care about them, so that UI fluidity is preserved and the game remains extensible.

#### Acceptance Criteria

1. THE System SHALL split `GameContext` into at minimum three focused slice contexts: `ResourceContext` (coins, hintsRemaining, coinMultiplier, ownedShopItems), `SessionContext` (letters, selected, found, hiddenFound, revealedLetters, meaning, feedback, streak, maxStreak, usedHint, earnedObjectives, sealOpen, elapsedTime, complete, currentWord), and `PersistenceContext` (completedLevels, awardedLevels, levelMastery, collectedWords, favoriteWords, levelStats, dailyChallenge).
2. THE System SHALL expose a `useResource`, `useSession`, and `usePersistence` hook that each throw when used outside their respective provider.
3. WHEN a `SessionContext` value changes, THE System SHALL NOT cause components that depend only on `ResourceContext` to re-render.
4. THE System SHALL maintain a single `GameProvider` root component that composes all slice providers.
5. THE System SHALL preserve the existing `useGame` hook as a backward-compatible alias that merges all slice contexts until all call sites are migrated.

### Requirement 2: Render Control

**User Story:** As a developer, I want to observe and prevent unnecessary re-renders, so that I can catch performance issues early.

#### Acceptance Criteria

1. WHEN `coins` changes, THE System SHALL NOT re-render components that do not consume `ResourceContext`.
2. THE System SHALL wrap all action callbacks in `useCallback` with correct and complete dependency arrays.
3. THE System SHALL NOT pass inline object or array literals as context values without `useMemo`.
4. IF a component receives a context value it does not use, THEN THE System SHALL provide a selector pattern or separate context so the component can opt out of re-renders.

### Requirement 3: Cleanup Safety

**User Story:** As a player, I want to open and close the app quickly without freezes or memory growth, so that I do not experience problems on low-memory devices.

#### Acceptance Criteria

1. WHEN a component unmounts, THE System SHALL cancel all pending `setTimeout` and `setInterval` calls registered by that component.
2. WHEN a level transition occurs, THE System SHALL clear the reward timer before starting the new level.
3. THE System SHALL use a single `useRef`-tracked timeout registry per SliceContext that is flushed on unmount.
4. IF `window.requestAnimationFrame` is used for feedback animation, THEN THE System SHALL cancel the frame handle via `cancelAnimationFrame` on unmount.
5. WHEN the screen becomes `'game'`, THE Timer SHALL be started, and WHEN the screen leaves `'game'`, THE Timer SHALL be stopped, both managed inside `SessionContext`.

### Requirement 4: StaleClosureBug Fix

**User Story:** As a developer, I want sound and haptics to always reflect the current settings, so that toggling `soundEnabled` or `hapticsEnabled` takes effect immediately and correctly.

#### Acceptance Criteria

1. THE `play` function SHALL read `soundEnabled` from a ref that is kept in sync with state, so the function reference remains stable.
2. WHEN `soundEnabled` changes, THE System SHALL update the ref within the same render cycle using `useLayoutEffect` or by assigning in the render body before callbacks are created.
3. THE System SHALL expose `play` via `useCallback` with a stable identity across renders.
4. THE System SHALL apply the same ref-based pattern to `hapticsEnabled` for the `haptic` function.

### Requirement 5: Save Layer Hardening

**User Story:** As a player, I want my save data to survive app updates without being deleted or corrupted, so that I never lose progress.

#### Acceptance Criteria

1. THE PlayerSave SHALL include a `version` field and THE Loader SHALL check it against the current expected version before parsing.
2. WHEN the loaded `version` is lower than the current version, THE System SHALL apply incremental Migration functions to bring the save up to date.
3. THE System SHALL merge `levelStats` into `PlayerSave` so that all persistent data lives under a single localStorage key (`soz-ustasi-player-v1`).
4. WHEN `levelStats` data is absent from a loaded save, THE System SHALL default to an empty record without discarding other fields.
5. THE System SHALL export a `migratePlayerSave(raw: unknown): PlayerSave` function that is pure and independently testable.
6. IF localStorage throws (quota exceeded, security error), THEN THE System SHALL catch the error and continue without crashing.

### Requirement 6: earnedObjectives Reset

**User Story:** As a player, when I replay a completed level and the reward modal opens, I want to see this session's results rather than the previous session's, so that my current performance is accurately reflected.

#### Acceptance Criteria

1. WHEN a new level Session starts via `startLevel`, THE System SHALL reset `earnedObjectives` to an empty array.
2. WHEN `RewardModal` opens, THE System SHALL display only the Objective values earned in the current Session combined with the persisted best objectives for that level.
3. THE System SHALL NOT carry `earnedObjectives` state across level transitions.

### Requirement 7: Parser/Serializer Round-Trip

**User Story:** As a developer, I want any valid `PlayerSave` object to serialize and deserialize back to an equivalent object, so that the save system is reliable.

#### Acceptance Criteria

1. FOR ALL valid `PlayerSave` objects, serializing then deserializing SHALL produce an equivalent object.
2. THE Pretty_Printer SHALL format `PlayerSave` objects into valid JSON strings.
3. FOR ALL valid `PlayerSave` objects, parsing then printing then parsing SHALL produce an equivalent object (round-trip property).
