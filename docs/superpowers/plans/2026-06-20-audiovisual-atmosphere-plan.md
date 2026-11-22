# Audiovisual Atmosphere Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Apply the approved warm, premium audiovisual style across startup, map, gameplay, reward, and store surfaces without harming readability, input flow, or Android performance.

**Architecture:** Use shared CSS tokens and asset rules as the single source of truth for look and feel. Keep loudness normalization in `src/audio.ts` and setting persistence in the context layer. Limit scene-specific changes to the relevant screen/component files so the visual language stays consistent but local regressions stay small.

**Tech Stack:** React, TypeScript, plain CSS, Web Audio API, Vitest, Capacitor Android, generated static store assets

---

## File Map

- `src/styles/base.css`: global tone, shadow, glow, and typography tokens.
- `src/styles/game.css`, `src/styles/modal.css`, `src/styles/map.css`, `src/styles/settings.css`, `src/styles/media.css`: shared atmosphere application and responsive guardrails.
- `src/screens/StartScreen3D.tsx`, `src/screens/MapScreen.tsx`, `src/screens/GameScreen.tsx`: scene-level composition and visual pacing.
- `src/components/LevelModal.tsx`, `src/components/RewardModal.tsx`, `src/components/WaxSeal.tsx`, `src/components/Confetti.tsx`, `src/components/MeaningCard3D.tsx`: premium feedback surfaces.
- `src/audio.ts`, `src/store/contexts/ResourceContext.tsx`, `src/screens/SettingsScreen.tsx`: sound normalization and user volume control.
- `src/audio.test.ts`, `src/components/RewardModal.test.ts`, `src/store/contexts/ResourceContext.test.tsx`: regression coverage for audio and reward UI.
- `scripts/generate-play-store-assets.mjs`, `scripts/process-generated-store-assets.mjs`, `scripts/generate-android-brand-assets.mjs`, `scripts/optimize-production-assets.mjs`, `public/play-store-assets.html`: store asset generation and preview.
- `vault/07-Production/Asset-License-Ledger-v1.md`, `vault/07-Production/Google-Play-Listing-v1.md`: provenance and store copy updates.

### Task 1: Establish the Warm Premium Visual System

**Files:**
- Modify: `src/styles/base.css`
- Modify: `src/styles/game.css`
- Modify: `src/styles/modal.css`
- Modify: `src/styles/map.css`
- Modify: `src/styles/settings.css`
- Modify: `src/styles/media.css`
- Modify: `src/screens/StartScreen3D.css`
- Modify: `src/components/map/LevelNode.css`
- Modify: `src/components/level-start/LevelStartScreen.css`
- Modify: `src/screens/StartScreen3D.tsx`
- Modify: `src/screens/MapScreen.tsx`
- Modify: `src/components/LevelModal.tsx`

- [ ] **Step 1: Write the style-token contract**

Add shared CSS variables in `src/styles/base.css` for the approved palette and motion surface:

```css
:root {
  --brand-bg: #0d1321;
  --brand-surface: #162238;
  --brand-surface-soft: #1f2d46;
  --brand-gold: #d8ab45;
  --brand-gold-soft: #f2cf77;
  --brand-bronze: #a8742d;
  --brand-stone: #2a3447;
  --brand-text: #f4ecd8;
  --brand-text-muted: #c8b99a;
  --brand-shadow: 0 22px 50px rgba(0, 0, 0, 0.38);
  --brand-glow: 0 0 28px rgba(216, 171, 69, 0.28);
}
```

- [ ] **Step 2: Apply the token set to the startup, map, and modal shells**

Update the referenced CSS files so backgrounds, cards, seals, and overlays reuse the shared tokens instead of ad hoc colors. Keep the existing structure and spacing, but tune gradients, borders, and shadows to the warm `gece-kütüphane` language.

- [ ] **Step 3: Tighten the scene composition**

In `StartScreen3D.tsx`, `MapScreen.tsx`, and `LevelModal.tsx`, keep the same component tree but make the hero assets, background layers, and emphasis copy read as one system. Do not add new navigation or gameplay behavior; this task is only visual composition and tone alignment.

- [ ] **Step 4: Run the build**

Run: `npm run build`

Expected: the app bundles successfully and the CSS token changes do not break the Vite build.

- [ ] **Step 5: Commit**

```bash
git add src/styles/base.css src/styles/game.css src/styles/modal.css src/styles/map.css src/styles/settings.css src/styles/media.css src/screens/StartScreen3D.css src/components/map/LevelNode.css src/components/level-start/LevelStartScreen.css src/screens/StartScreen3D.tsx src/screens/MapScreen.tsx src/components/LevelModal.tsx
git commit -m "feat: unify premium visual atmosphere"
```

### Task 2: Normalize Sound and Surface the Volume Control

**Files:**
- Modify: `src/audio.ts`
- Modify: `src/store/contexts/ResourceContext.tsx`
- Modify: `src/screens/SettingsScreen.tsx`
- Modify: `src/audio.test.ts`

- [ ] **Step 1: Write the loudness regression test**

Extend `src/audio.test.ts` so the gain curve and disabled-state behavior are locked down.

```ts
import { describe, expect, it } from 'vitest';
import { volumePercentToGain } from './audio';

describe('volumePercentToGain', () => {
  it('clamps below zero to silence', () => {
    expect(volumePercentToGain(-20)).toBe(0);
  });

  it('maps 50 percent to a usable mid-level gain', () => {
    expect(volumePercentToGain(50)).toBeGreaterThan(0.3);
    expect(volumePercentToGain(50)).toBeLessThan(0.6);
  });

  it('maps 100 percent to full gain', () => {
    expect(volumePercentToGain(100)).toBe(1);
  });
});
```

- [ ] **Step 2: Adjust the Web Audio loudness curve**

In `src/audio.ts`, keep the current sound palette but rebalance the output so taps, letters, rewards, and seals are audible on mobile speakers without clipping. Preserve the `enabled` and `volume` gate, and keep the compressor in the signal path.

- [ ] **Step 3: Connect the settings screen to the real sound floor**

In `src/screens/SettingsScreen.tsx`, keep the slider and toggle, but make the helper text explicit that the control affects all effect sounds. Ensure moving the slider from zero restores audio without requiring an extra toggle.

- [ ] **Step 4: Keep sound persistence through the resource layer**

In `src/store/contexts/ResourceContext.tsx`, keep `play(name)` as the only runtime entry point and ensure the current sound toggle and volume continue to flow from persistence into the audio engine.

- [ ] **Step 5: Run the audio-focused tests**

Run: `npx vitest run src/audio.test.ts`

Expected: the gain curve assertions pass and the sound gate behavior stays deterministic.

- [ ] **Step 6: Commit**

```bash
git add src/audio.ts src/store/contexts/ResourceContext.tsx src/screens/SettingsScreen.tsx src/audio.test.ts
git commit -m "feat: normalize sound and volume control"
```

### Task 3: Polish Gameplay Feedback Surfaces

**Files:**
- Modify: `src/screens/GameScreen.tsx`
- Modify: `src/components/RewardModal.tsx`
- Modify: `src/components/LevelModal.tsx`
- Modify: `src/components/WaxSeal.tsx`
- Modify: `src/components/Confetti.tsx`
- Modify: `src/components/MeaningCard3D.tsx`
- Modify: `src/styles/game.css`
- Modify: `src/styles/modal.css`
- Modify: `src/styles/level-modal.css`
- Modify: `src/components/RewardModal.test.ts`

- [ ] **Step 1: Write the reward and seal regression test**

Extend `src/components/RewardModal.test.ts` so zero-value rewards do not render stray digits and the success surface remains readable on narrow screens.

```ts
import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RewardModal } from './RewardModal';

describe('RewardModal', () => {
  it('does not render a stray zero reward label', () => {
    render(<RewardModal rewardSummary={{ base: 0, hidden: 0 }} />);
    expect(screen.queryByText(/^0$/)).toBeNull();
  });
});
```

- [ ] **Step 2: Keep the seal flow inside the viewport**

In `GameScreen.tsx` and the modal-related CSS files, keep the seal confirmation and reward panels constrained to the viewport. The content may scroll internally, but the player should not need to scroll the page to reach the next action.

- [ ] **Step 3: Make the win state feel premium but readable**

In `RewardModal.tsx`, `LevelModal.tsx`, `WaxSeal.tsx`, `Confetti.tsx`, and `MeaningCard3D.tsx`, keep the current logic but tune contrast, spacing, and motion so the result screen feels cinematic without blocking the CTA.

- [ ] **Step 4: Preserve input during feedback bursts**

Verify that correct, hidden, wrong, and seal effects never capture pointer input for the actual puzzle area. If an overlay is decorative, it must remain `pointer-events: none`.

- [ ] **Step 5: Run the targeted UI tests**

Run: `npx vitest run src/components/RewardModal.test.ts`

Expected: the zero-reward regression stays green.

- [ ] **Step 6: Commit**

```bash
git add src/screens/GameScreen.tsx src/components/RewardModal.tsx src/components/LevelModal.tsx src/components/WaxSeal.tsx src/components/Confetti.tsx src/components/MeaningCard3D.tsx src/styles/game.css src/styles/modal.css src/styles/level-modal.css src/components/RewardModal.test.ts
git commit -m "feat: refine gameplay feedback surfaces"
```

### Task 4: Refresh Store Assets and Provenance

**Files:**
- Modify: `scripts/generate-play-store-assets.mjs`
- Modify: `scripts/process-generated-store-assets.mjs`
- Modify: `scripts/generate-android-brand-assets.mjs`
- Modify: `scripts/optimize-production-assets.mjs`
- Modify: `public/play-store-assets.html`
- Modify: `vault/07-Production/Asset-License-Ledger-v1.md`
- Modify: `vault/07-Production/Google-Play-Listing-v1.md`

- [ ] **Step 1: Add the warm premium capture set**

Update the store asset pipeline so the preview pages and exported images cover the approved surfaces: splash, start, map, gameplay, hint, seal, reward, and settings. Keep filenames stable and descriptive.

- [ ] **Step 2: Keep the preview HTML in sync with the new captures**

Adjust `public/play-store-assets.html` so the exported screenshots and feature art can be reviewed in one place before upload. The page should reflect the same visual language as the app, not a separate mock style.

- [ ] **Step 3: Record provenance**

Add the new store art and generated preview assets to the license/provenance ledger with creation method, source, and intended use.

- [ ] **Step 4: Verify the generated asset set**

Run:

```bash
node scripts/generate-play-store-assets.mjs
node scripts/process-generated-store-assets.mjs
node scripts/optimize-production-assets.mjs
node scripts/generate-android-brand-assets.mjs
```

Then open `public/play-store-assets.html` and confirm the captures match the warm premium tone.

- [ ] **Step 5: Commit**

```bash
git add scripts/generate-play-store-assets.mjs scripts/process-generated-store-assets.mjs scripts/generate-android-brand-assets.mjs scripts/optimize-production-assets.mjs public/play-store-assets.html vault/07-Production/Asset-License-Ledger-v1.md vault/07-Production/Google-Play-Listing-v1.md
git commit -m "feat: refresh store assets and provenance"
```

### Task 5: Release Gate and Android Verification

**Files:**
- Modify: `src/store/contexts/ResourceContext.test.tsx`
- Modify: `src/components/RewardModal.test.ts`
- Modify: `src/audio.test.ts`
- Modify: `src/data/levels.test.ts`
- Modify: `vault/07-Production/APK-Readiness-v1.md`
- Modify: `vault/07-Production/Release-Roadmap-2026-06-19.md`

- [ ] **Step 1: Run the full local quality suite**

Run:

```bash
npm run lint
npm run test:run
npm run build
```

Expected: lint, tests, and production build all pass with the audiovisual changes in place.

- [ ] **Step 2: Sync the Android shell**

Run: `npm run android:sync`

Expected: the Android wrapper picks up the new assets and build configuration without manual file edits.

- [ ] **Step 3: Validate the release checklist**

Update the release notes and readiness checklist only if the implementation changes a shipped behavior such as audio defaults, store captures, or modal sizing.

- [ ] **Step 4: Confirm the app shell behavior**

Check that the installed Android build shows the revised launcher art, startup mood, and sound defaults, and that the first-launch path still lands on the intended start screen.

- [ ] **Step 5: Commit**

```bash
git add src/store/contexts/ResourceContext.test.tsx src/components/RewardModal.test.ts src/audio.test.ts src/data/levels.test.ts vault/07-Production/APK-Readiness-v1.md vault/07-Production/Release-Roadmap-2026-06-19.md
git commit -m "chore: validate audiovisual release gate"
```

## Spec Coverage Check

- Warm premium visual system: Task 1.
- Sound balance and user volume control: Task 2.
- Seal, reward, and feedback surfaces: Task 3.
- Store assets and provenance: Task 4.
- Build, Android sync, and release readiness: Task 5.

## Self-Review Notes

- No placeholder tasks remain.
- The plan keeps audio, visuals, and store media separate enough to work independently.
- The modal/overlay work is isolated from gameplay logic, so it should not destabilize scoring or level progression.
- The plan assumes the existing asset generation scripts remain the preferred path for store capture work.
