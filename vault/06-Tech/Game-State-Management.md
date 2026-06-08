# Game State Management

## React Context (Sıfır Bağımlılık)

State yönetimi için ek kütüphane kullanılmaz. React Context + useReducer ile merkezi state sağlanır.

## GameContext (`src/store/GameContext.tsx`)

```typescript
interface GameContextValue {
  currentLevel: LevelData | null;
  coins: number;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  collectedWords: string[];
  favoriteWords: string[];   // Phase 4
  completedLevels: number[];
  awardedLevels: number[];
  levelMastery: Record<number, LevelMastery>;
  ownedShopItems: string[];
  hintsRemaining: number;
  coinMultiplier: number;
  // Actions
  completeLevel: (levelId: number, mastery: LevelMastery) => void;
  toggleFavorite: (word: string) => void;  // Phase 4
  setSound: (v: boolean) => void;
  setHaptics: (v: boolean) => void;
  buyItem: (itemId: string) => void;
}
```

### State Akışı

```
Action → dispatch → reducer → yeni state → useEffect(localStorage) → playerSave.ts
```

Her state değişikliği otomatik olarak localStorage'a yazılır. Uygulama açılışında `loadPlayerSave()` ile geri yüklenir.

## PlayerSave (`src/game/playerSave.ts`)

```typescript
interface PlayerSave {
  version: 1;
  currentLevelId: number;
  coins: number;
  completedLevels: number[];
  awardedLevels: number[];
  collectedWords: string[];
  favoriteWords: string[];   // Phase 4
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  levelMastery: Record<number, { stars: number; objectives: string[] }>;
  ownedShopItems: string[];
  hintsRemaining: number;
  coinMultiplier: number;
}
```

- `persistPlayerSave(save)`: JSON.stringify → localStorage.setItem('sozustasi_save')
- `loadPlayerSave()`: localStorage.getItem → JSON.parse → versiyon kontrolü
- `getDefaultSave()`: yeni oyun başlangıç state'i (120 coin, level 1)

## favoriteWords Detayı (Phase 4)

- Anlam kartı (`MeaningCard`) üzerinde `FavStar` butonu
- Toggle: `favoriteWords.includes(word) ? remove : add`
- VaultScreen "Favoriler" sekmesi: `collectedWords.filter(w => favoriteWords.includes(w))`
- Her wordCard'da favori durumunu gösteren yıldız ikonu
- Kalıcılık: localStorage round-trip ile

## Level Progresyonu

- `getNextLevelId(completedLevels)`: tamamlanan level sayısı + 1 (max 45)
- `canPlayLevel(levelId, completedLevels)`: levelId <= completedLevels.length + 1
- Kilit açma: lineer, her level bir öncekinin tamamlanmasını gerektirir
- Tema geçişleri: levelId bazlı, otomatik
