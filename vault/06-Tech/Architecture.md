# Teknik Mimari

## Stack

- React 18 + TypeScript + Vite
- Capacitor 6 (Android)
- Portrait responsive web uygulaması
- State: React Context (sıfır bağımlılık)
- CSS: vanilla CSS, component bazlı dosyalar
- Test: Vitest (496 test) — 7 test dosyası
- Lint: ESLint + TypeScript strict
- Audit: Node.js script (12 kategori)

## Taşınabilirlik

Ana domain modelleri `src/data` ve `src/game` altında tutulur. Bu yapı ileride Unity ScriptableObject veya React Native store modeline dönüştürülebilir.

## Tip Sistemi (src/types.ts)

- `DifficultyLevel` (1 | 2 | 3 | 4 | 5): Level Design Review v1 ile eklenen zorluk skalası. Her kelimenin `difficulty` alanı bu tipi kullanır. 1=en kolay, 5=en zor.
- `WordData`: `{ word, meaning, difficulty }` — artık `difficulty: DifficultyLevel` içerir.
- `PlayerSave`: `version: 2`'ye yükseltilebilir (henüz yapılmadı).

## Ana Modüller

- `src/data/levels.ts` — 45 level, 8 tema, 168 ana kelime, 60 gizli kelime (tüm Phase 1-3-5 + Level Design Review v1 düzeltmeleri uygulandı)
- `src/data/levelStories.ts` — 45 hikaye kartı (map/level intro için)
- `src/data/themes.ts` — 8 tema, unlockAtLevel hala kullanılmıyor
- `src/game/normalize.ts` — normalizeWord: `toLocaleUpperCase('tr-TR')` + NFD + aksan strip; Ö→O, Ü→U, İ→I, Ğ→G, Ç→C, Ş→S, I→I
- `src/game/shuffle.ts` — Fisher-Yates shuffle (düzgün dağılımlı karıştırma)
- `src/game/crossword.ts` — crossword layout builder; 45 levelde null dönmez
- `src/game/playerSave.ts` — localStorage round-trip; PlayerSave tipi: version, coins, completedLevels, collectedWords, favoriteWords, soundEnabled, hapticsEnabled, levelMastery, ownedShopItems
- `src/store/GameContext.tsx` — React Context provider; state: currentLevel, coins, soundEnabled, hapticsEnabled, collectedWords, favoriteWords, completedLevels, awardedLevels, levelMastery, ownedShopItems; actions: completeLevel, toggleFavorite, setSound, setHaptics, buyItem
- `src/components/` — LetterWheel, MeaningCard, SealGrid, StoryBanner, RewardModal, vs.
- `src/screens/` — GameScreen (StoryBanner + FavStar), VaultScreen (Favorites sekmesi + wordCard toggle), ShopScreen, MapScreen
- `src/styles/` — game.css (StoryBanner, FavStar, timer, reward animasyonları), vault.css (wordCardHeader, FavStar), shop.css
- `scripts/audit-full.mjs` — 12 kategorili tam audit

## State Yönetimi (React Context)

- Provider: `GameProvider` → tüm alt bileşenlere state + dispatch
- Kalıcılık: `playerSave.ts` → her state değişikliğinde localStorage'a yazılır
- favoriteWords: `string[]` — anlam kartındaki yıldız ile toggle, VaultScreen'de filtreleme
- Yeni oyun: `getDefaultSave()` → 120 coin, level 1, tüm ayarlar varsayılan
