# UI Asset Audit v2 — Profesyonel 3D Tarama

Tarih: 2026-06-07  
Hedef: Royal Match / Wordscapes seviyesi tutarlı 3D mobil oyun UI

## Özet Skor

| Alan | Skor | Durum |
|------|------|-------|
| 3D derinlik (gölge/parlaklık) | 7/10 | SVG'ler 3D; CSS butonlar düz |
| Tema tutarlılığı (Osmanlı altın/lacivert) | 4/10 | V2 candy renkler, V1/V2 karışık |
| Asset kullanım oranı | 35% | 52 dosya, ~18 aktif |
| Dinamik veri (coin/timer/metin) | 3/10 | Pill SVG'lerde baked text |
| Touch target (min 44px) | 8/10 | Çoğu uygun |
| State varyantları (active/inactive/disabled) | 2/10 | Nav inactive yok |
| Tipografi (Playfair/Cormorant) | 3/10 | Georgia/Inter fallback |
| Animasyon polish | 7/10 | Tap, seal, burst iyi |
| Erişilebilirlik (aria-label) | 6/10 | Kısmi |
| **Genel** | **5.5/10** | Prototip+, production değil |

---

## Asset Envanteri (52 dosya)

### V2 — `public/assets/ui/v2/` (16 dosya)

| # | Dosya | 3D | Kullanım | Sorun |
|---|-------|-----|----------|-------|
| 01 | back-button | ✅ | ❌ Kod V1 `16-icon-back` kullanıyor | Duplicate |
| 02 | settings-button | ✅ | ❌ | Duplicate |
| 03 | coin-pill | ✅ | ❌ | "2.850" baked — dinamik değil |
| 04 | timer-pill | ✅ | ❌ | "0:20" baked |
| 05 | wax-seal-button | ✅ | ❌ | WaxSeal.tsx SVG kullanıyor |
| 06 | hint-action-button | ✅ | ✅ GameScreen | İyi |
| 07 | shuffle-action-button | ✅ | ✅ GameScreen | İyi |
| 08 | seal-action-button | ✅ | ✅ GameScreen | İyi |
| 09 | bottom-tasks | ✅ | ✅ BottomNav | Inactive varyant yok |
| 10 | bottom-dictionary | ✅ | ✅ BottomNav | Inactive varyant yok |
| 11 | bottom-map-active | ✅ | ✅ BottomNav | Her zaman "active" renk |
| 12 | bottom-shop | ✅ | ✅ BottomNav | Inactive varyant yok |
| 13 | bottom-profile | ✅ | ⚠️ | Tab tıklanmıyor (id: null) |
| 14 | word-tile-empty | ✅ | ❌ | CSS `.crosswordCell` kullanılıyor |
| 15 | letter-node | ✅ | ❌ | CSS `.wheelLetter` kullanılıyor |
| 16 | letter-node-selected | ✅ | ❌ | CSS `.wheelSelected` kullanılıyor |

### V1 — `public/assets/ui/svg/` (36 dosya)

#### İkonlar (01–20) — Aktif kullanım

| # | İkon | Kullanıldığı yer | 3D | Not |
|---|------|------------------|-----|-----|
| 01 | hint | MapScreen, HintModal, LevelModal | ✅ | |
| 02 | shuffle | LevelModal, LevelDetailPopup | ✅ | |
| 03 | seal | MapScreen daily | ✅ | |
| 04 | dictionary | LevelModal, LevelDetailPopup | ✅ | |
| 05 | tasks | LevelModal, LevelDetailPopup | ✅ | |
| 06 | shop | MapScreen | ✅ | |
| 07 | settings | — | ✅ | **Kullanılmıyor** |
| 08 | sound | GameScreen, Shop, Pause, TopBar | ✅ | |
| 09 | life | — | ✅ | **Kullanılmıyor** |
| 10 | daily | MapScreen, timer ikonu olarak | ✅ | Yanlış semantik (timer için) |
| 11 | home | — | ✅ | **Kullanılmıyor** |
| 12 | map | RewardModal, PauseModal | ✅ | |
| 13 | play | RewardModal, PauseModal | ✅ | |
| 14 | events | — | ✅ | **Kullanılmıyor** |
| 15 | crown | LevelModal, LevelDetailPopup | ✅ | |
| 16 | back | Tüm ekranlar | ✅ | V2 ile duplicate |
| 17 | close | Modal, StoryBanner | ✅ | |
| 18 | coin | Her yerde | ✅ | Pill yerine küçük ikon |
| 19 | gem | — | ✅ | **Kullanılmıyor** |
| 20 | energy | — | ✅ | **Kullanılmıyor** |

#### Büyük bileşenler (21–36) — Çoğu kullanılmıyor

| # | Bileşen | Kullanım | Sorun |
|---|---------|----------|-------|
| 21–23 | pill-coin/gem/energy | ❌ | CSS `.coin` span kullanılıyor |
| 24–25 | badge-level/streak | ❌ | Emoji ★ kullanılıyor |
| 26–29 | button-play/continue/reward/blue | ❌ | CSS `.primary` / `.chiseled-gold` |
| 30–31 | word-tile-empty/filled | ❌ | CSS grid hücreleri |
| 32 | letter-node | ❌ | CSS wheel |
| 33 | meaning-card | ❌ | CSS `.meaning` |
| 34 | reward-modal | ❌ | CSS modal |
| 35 | task-row | ❌ | — |
| 36 | bottom-nav | ❌ | CSS `.bottomNavBar` + V2 ikonlar |

---

## Ekran Bazlı Tarama

### SplashScreen
- WaxSeal SVG ✅ premium
- `.primary` CSS buton — 3D SVG `26-button-play` kullanılmıyor
- Tipografi: Georgia, Playfair yok

### GameScreen
- Action butonlar: V2 3D ✅
- Top bar: V1 flat ikonlar ❌ (V2 back/settings/sound olmalı)
- Coin/timer: span + küçük ikon ❌ (ResourcePill olmalı)
- Harf çemberi: CSS gradient daireler ❌ (V2 letter-node olmalı)
- Kelime grid: CSS hücreler ❌ (V2 word-tile olmalı)
- Favori: emoji ★/☆ ❌ (SVG ikon olmalı)
- Puzzle tipi: emoji ✚↔🔍 ❌

### MapScreen
- TopBar V1 ❌
- Level node: WaxSeal ✅
- Featured level: CSS kart — iyi ama "Başla" text-only
- Collection: emoji ★/✓ ❌

### BottomNavBar
- V2 ikonlar ✅ ama inactive state yok
- Center tab: CSS gold ring + V2 gold icon = çift chrome ❌
- Profil tab: dead button ❌

### Modallar (Hint, Pause, Reward, Level)
- CSS chrome + V1 küçük ikonlar
- `34-reward-modal.svg` kullanılmıyor
- Butonlar HTML gradient, SVG değil

---

## Modern 3D Oyun Karşılaştırması

| Kriter | Royal Match / Wordscapes | Söz Ustası |
|--------|--------------------------|------------|
| Tek asset pipeline | ✅ | ❌ V1+V2+CSS |
| Tema renk tutarlılığı | ✅ | ❌ Candy vs Ottoman |
| Dinamik HUD | ✅ | ❌ Baked SVG text |
| Buton state seti | normal/pressed/disabled | sadece :active scale |
| Harf/kutu 3D tile | ✅ beveled tiles | CSS flat gradient |
| Nav inactive dim | ✅ | ❌ |
| Ses açık/kapalı ikon | ✅ 2 varyant | tek ikon |
| Partikül/VFX | heavy | orta (confetti, burst ✅) |

---

## Öncelikli Aksiyon Planı

### P0 — Hemen (bu sprint)
1. V2 paletini Ottoman altın/lacivert/bordo yap
2. Pill SVG'lerden baked text kaldır → `ResourcePill` bileşeni
3. Tüm back/settings/sound → V2 migrate
4. Bottom nav inactive varyantları + center çift chrome düzelt
5. Harf çemberi → V2 letter-node arka plan

### P1 — Sonraki sprint
6. Kelime grid → V2 word-tile
7. Modal butonlar → 3D SVG (play/continue/reward)
8. Emoji → SVG ikon (★, 🔥, puzzle tipleri)
9. Playfair Display font yükle
10. Ses on/off ikon varyantı

### P2 — Polish
11. Kullanılmayan 18 asset'i kaldır veya bağla
12. `audit-ui-assets.mjs` CI'ya ekle
13. Unity export için sprite atlas planı

---

## Asset Usage Rules Uyumu

- [x] Arka planlarda fake buton yok
- [x] Touch target gerçek kontroller
- [ ] Tüm HUD dinamik (coin pill baked ❌)
- [ ] Tek görsel dil (V1/V2 split ❌)
- [x] Safe area destekli
