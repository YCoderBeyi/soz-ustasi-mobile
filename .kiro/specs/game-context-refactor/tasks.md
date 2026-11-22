# Implementation Plan: GameContext Refactor

## Overview

GameContext.tsx uc slice context'e bolunur, cleanup guvenligi saglanir,
play/haptic stale closure duzeltilir ve PlayerSave migration pipeline eklenir.

## Tasks

- [-] 1. PlayerSave v2 ve Migration Pipeline
  - PlayerSave tipini version 2 ve levelStats alaniyla guncelle
  - CURRENT_SAVE_VERSION = 2 sabiti ekle
  - migrateV1ToV2: soz-stats-v1 key okur, save'e ekler, eski key'i siler
  - migratePlayerSave(raw: unknown): PlayerSave pure fonksiyonu
  - loadPlayerSave icinde migratePlayerSave cagir
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 1.1 Write property test for PlayerSave round-trip
  - fast-check ve @fast-check/vitest ekle
  - arbitrary PlayerSave v2 uret, persistPlayerSave + loadPlayerSave round-trip dogrula
  - **Property 5: PlayerSave Round-Trip**
  - **Validates: Requirements 7.1, 7.2, 7.3**

- [ ] 1.2 Write property test for migration validity
  - migratePlayerSave({ version: 1, ...partial }) -> version === 2, alanlar korunmali
  - **Property 4: Migration Validity**
  - **Validates: Requirements 5.2, 5.5**

- [ ] 2. Cleanup Registry
  - src/game/cleanup.ts: createCleanupRegistry() -> { safeTimeout, safeInterval, clearSafeInterval, safeRaf, flushAll }
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 2.1 Write property test for cleanup on unmount
  - vi.useFakeTimers(): safeTimeout kaydet, flushAll cagir, callback calismamali
  - **Property 2: Cleanup on Unmount**
  - **Validates: Requirements 3.1**

- [ ] 3. ResourceContext Slice
  - src/store/contexts/ResourceContext.tsx
  - State: coins, hintsRemaining, coinMultiplier, ownedShopItems, coinPulse
  - Actions: pulseCoins, addCoins, spendCoins, spendHint, addHints, setCoinMultiplier, addOwnedItem, isItemOwned
  - useResource hook: provider disinda Error firlatir
  - useMemo ile sarmalanmis context value
  - _Requirements: 1.1, 1.2, 1.4, 2.2, 2.3_

- [ ] 3.1 Write unit tests for ResourceContext
  - spendCoins yetersiz -> false, state degismez
  - spendHint: hint once, sonra coin
  - addCoins -> coins artar
  - _Requirements: 1.2_

- [ ] 4. SessionContext Slice
  - src/store/contexts/SessionContext.tsx
  - State: level, letters, selected, found, hiddenFound, revealedLetters, meaning, feedback, streak, maxStreak, usedHint, earnedObjectives, sealOpen, elapsedTime, complete, currentWord, levelTransitionKey, modal, toast
  - Timer: createCleanupRegistry ile, screen=game baslar, cikinca durur
  - startLevel: earnedObjectives = [] olarak sifirla
  - play/haptic: soundEnabledRef/hapticsEnabledRef render body'de guncellenir, useCallback([], [])
  - Tum setTimeout/rAF -> safeTimeout/safeRaf
  - useSession hook, useMemo ile context value
  - _Requirements: 1.1, 1.2, 3.1, 3.2, 3.4, 3.5, 4.1, 4.2, 4.3, 4.4, 6.1_

- [ ] 4.1 Write property test for earnedObjectives reset
  - startLevel() sonrasi earnedObjectives bos olmali
  - **Property 6: earnedObjectives Reset**
  - **Validates: Requirements 6.1, 6.3**

- [ ] 4.2 Write unit test for stable play callback
  - soundEnabled true -> playSfx cagirilir
  - soundEnabled false -> playSfx cagrilmaz
  - soundEnabled toggle sonrasi play referansi ayni kalir
  - **Property 3: Stable Audio/Haptic Callbacks**
  - **Validates: Requirements 4.1, 4.3, 4.4**

- [ ] 5. PersistenceContext Slice
  - src/store/contexts/PersistenceContext.tsx
  - State: completedLevels, awardedLevels, levelMastery, collectedWords, favoriteWords, levelStats, dailyChallenge, soundEnabled, hapticsEnabled
  - Actions: isLevelUnlocked, markLevelCompleted, markLevelAwarded, mergeMastery, addCollectedWord, toggleFavorite, setSoundEnabled, setHapticsEnabled, updateStats, claimDailyReward
  - useEffect ile persistPlayerSave cagir
  - usePersistence hook, useMemo ile context value
  - _Requirements: 1.1, 1.2, 5.3_

- [ ] 5.1 Write unit tests for PersistenceContext
  - isLevelUnlocked(1) -> true
  - isLevelUnlocked(N) -> N-1 tamamlanmissa true
  - mergeMastery -> daha dusuk yildiz almaz
  - _Requirements: 1.2_

- [ ] 6. GameProvider ve useGame Alias
  - src/store/GameProvider.tsx: ResourceProvider, SessionProvider, PersistenceProvider ic ice
  - PlayerSave tek yerden yuklenir, her slice'a prop olarak gecilir
  - src/store/GameContext.tsx: useGame alias tum slice'lari birlestirsin
  - App.tsx: yeni GameProvider'i import et
  - _Requirements: 1.4, 1.5_

- [ ] 7. Checkpoint
  - npm run test -> tum testler yesil
  - npm run build -> basarili
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Call Site Migration
  - MapScreen.tsx: usePersistence + useResource
  - GameScreen.tsx: useSession + useResource
  - RewardModal.tsx: useSession + usePersistence
  - LevelModal.tsx: usePersistence
  - ShopScreen.tsx: useResource + usePersistence
  - _Requirements: 1.3, 2.1_

- [ ] 8.1 Write render isolation test
  - SessionContext degisimi ResourceContext-only consumer'i render ettirmemeli
  - **Property 1: Render Isolation**
  - **Validates: Requirements 1.3, 2.1**

- [ ] 9. MapScreen back button bug duzeltmesi
  - map-header-back: setScreen("dictionary") -> dogru hedef
  - _Requirements: 1.1_

- [ ] 10. Final Checkpoint
  - npm run test, npm run build, npm run lint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Gorev 7: kritik kontrol noktasi, 8'e gecmeden once tum testler gecmeli
- useGame alias migration tamamlanana kadar korunur
- soz-stats-v1 key migration sonrasi temizlenir, kullanici verisi kaybolmaz
- Property testleri @fast-check/vitest, minimum 100 iterasyon
