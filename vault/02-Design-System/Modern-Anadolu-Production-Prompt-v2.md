# Söz Ustası — Modern Anadolu Final Production Prompt V2.0

**PROJECT:** Söz Ustası – Kelime Oyunu  
**DEVELOPER:** Derebasi Studio  
**STYLE:** Modern Anadolu / Premium 2.5D  
**TARGET:** Android portrait, React + TypeScript + Capacitor  
**REFERENCE:** Approved 14-screen Modern Anadolu design board  
**STATUS:** Approved production brief (design lock + process)  
**DATE:** 2026-11-21

Related: [[Global-UI]], [[Audio-Animation-Decisions]], [[Asset-Usage-Rules]], [[01-Product/Product-Brief]]

---

## PRIMARY OBJECTIVE

Recreate the approved Modern Anadolu visual identity across all existing Söz Ustası screens while preserving current gameplay mechanics, user progress, saved data and rewarded-ad logic.

The result must look like a cohesive, professionally art-directed, premium mobile word puzzle game.

---

## CRITICAL DESIGN LOCK

The existing letter wheel and crossword board must NOT be replaced by the simplified illustrations shown in the concept board.

Preserve and reuse:

- `src/screens/GameScreen.tsx`
- `WordPuzzle`
- `useWheelGesture`
- `src/game/tileSkins.ts`
- Existing letter positions and swipe behaviour
- Existing crossword rules and level state

Improve their surrounding visual presentation only.

Any change to letter geometry, tile skin or gameplay interaction requires separate approval.

---

## SHARED VISUAL SYSTEM

### Primary tokens (CSS SSOT)

Implement as `--anadolu-*` (or equivalent) on `:root` / theme scope; components read variables — do not scatter hex literals.

| Token | Hex | Role |
| --- | --- | --- |
| Deep petrol green | `#133D36` | Primary surfaces / primary CTA |
| Ivory parchment | `#F5E8CE` | Backgrounds / cards |
| Copper | `#BF8744` | Accent trim |
| Wax-seal burgundy | `#6F3928` | Seal / reward emphasis |
| Gold | `#D5AD57` | Achievement / premium highlight |
| Dark text | `#263028` | Body / labels on light surfaces |

Use raised 2.5D buttons, warm contact shadows, restrained gold trim, subtly textured parchment, enamel surfaces and modern Anatolian decorative details.

Use the existing S wax seal as the primary brand element.

The style must be elegant, welcoming and mature rather than childish or excessively ornate.

### Button / pill alignment

- Primary CTA: petrol green 2.5D (prefer over concept “random gold primary”).
- Secondary CTA: ivory / copper outline or quieter blue — never more prominent than primary.
- Resource pills / shared chrome: single frame, no nested double borders (see current `ResourcePill` direction).

---

## USER PSYCHOLOGY

Design for a broad adult audience, testing differences across 18–34, 35–54 and 55+ users.

Prioritise:

- Clear first action
- Large readable letters
- Simple navigation
- Minimal visual distractions
- Recognisable icons
- Short, satisfying feedback
- Comfortable one-handed interactions
- Reduced-motion accessibility
- Optional, clearly explained advertisements

Do not infer a universal preference from age alone.

---

## SCREEN ORDER (production sequence)

Do not invent missing routes. Rebuild **existing** screens in this order:

1. **Reward / level complete** — `RewardModal` (+ related CSS) — *Welcome deferred: current StartScreen is the premium baseline; see [[Screen-01-Welcome-Current-vs-Target]]*
2. **Map** — `MapScreen` (+ CSS) — chrome only; path/node logic unchanged
3. **Shop** — `ShopScreen`
4. **Hint** — `HintModal`
5. **Level start** — `LevelStartScreen`
6. **Game chrome only** — `GameScreen` HUD / backdrop / meaning strip; **not** wheel/board geometry
7. **Welcome** — only if new art equals/exceeds current plaque + cinematic depth
8. Then: Profile, Dictionary, Settings, Pause, Onboarding — as needed for cohesion

**Welcome rule:** Never ship a flatter parchment/card treatment that undercuts the live gold plaque + seal hero.

Skip or backlog concept-only surfaces (IAP price grids, achievements, daily chest, ranking) unless product already owns them.

---

## CTA COPY RULE (existing product wins)

Concept board labels are reference, not mandatory strings.

Preserve current product copy unless a separate copy pass is approved:

| Screen | Keep (examples) |
| --- | --- |
| Welcome | `BAŞLA` / `DEVAM ET` |
| Reward | `Sonraki Seviye` / `Haritaya Dön` |
| Seal confirm | `Aramaya Devam Et` / `Yine de Mühürle (1★)` |
| Second chance | `Reklamsız Devam Et` / optional ad CTA |

Board phrases like “Oyuna Başla” / “İlerlemeni Koru” are optional variants only after copy approval.

---

## SCREEN PRODUCTION STANDARD

For every screen:

1. Inspect the actual React component and its associated CSS.
2. Identify all gameplay actions and state dependencies.
3. Compare the existing implementation with the approved design reference.
4. Create one standalone 390×844 visual mockup.
5. Produce reusable assets as SVG or optimised WebP/PNG.
6. Implement the layout using React, TypeScript and CSS.
7. Capture the running application at matching viewport dimensions.
8. Compare reference and implementation side by side.
9. Correct alignment, typography, proportions, colours and depth.
10. Test interactions, responsiveness, accessibility and regressions.

Follow SSOT and SOLID. Centralise shared design tokens and components.

---

## IMPLEMENTATION RESTRICTIONS

- Do not invent purchase prices, rewards, levels, daily tasks, hearts, achievements or screen routes simply because they appear in a concept illustration.
- Do not replace working gameplay components (wheel, board, gesture, tile skins).
- Do not embed UI labels and buttons into a static background image.
- Do not claim that a generated mockup is already implemented.
- Do not grant advertising rewards before the verified SDK reward event.
- Do not merge, deploy or publish without explicit approval.
- Do not commit secrets or ad unit IDs into design docs beyond what Production vault already records.

---

## APPROVAL PROCESS

Each screen must pass three gates:

**Gate 1 — Visual:** Screen design / mockup approved.  
**Gate 2 — Functional:** Components and interactions verified, including:

- One-handed portrait use
- Focus / Escape / close labels where modals exist
- `calmMode` / `reduceMotion` / sound & haptics prefs respected (no new motion that ignores them)

**Gate 3 — Regression:** Existing gameplay and persistence unaffected (levels, coins, mastery, rewarded ads).

Produce a short report with screenshots, component changes, test results and unresolved issues.

**Stop after each screen for approval.**

---

## FIRST ACTION

1. Skip Welcome redesign until stronger art exists (Gate 1 rejected: current welcome more premium).
2. Next Gate 1 candidate: **Reward modal** current-vs-target + 390×844 mockup — keep existing CTA copy and hierarchy.
3. Wait for approval before implementation.

---

## CHANGE LOG

- **v2.1 (2026-11-21):** Welcome Gate 1 rejected; current StartScreen locked as premium baseline; production order starts at Reward.
- **v2.0 (2026-11-21):** Production prompt locked with wheel/board design lock; added screen order, CTA copy rule, CSS token SSOT, calm/reduce-motion on Gate 2, vault location.
