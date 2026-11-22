# Screen 01 — Welcome (`StartScreen3D`) Current vs Target

**Date:** 2026-11-21  
**Brief:** [[Modern-Anadolu-Production-Prompt-v2]]  
**Gate:** 1 Visual — revised (2026-11-21). Approved presentation art direction applied in code with generated BG + title plaque; existing wax seal kept.  
**Assets:** Runtime assets live in `public/assets/ui/start/kit/`; unused source and reference images were removed from the project. The existing seal remains in `public/assets/ui/start/wax-seal-s.webp`.

---

## Source of truth (code)

| Item | Location |
| --- | --- |
| Component | `src/screens/StartScreen3D.tsx` |
| Styles | `src/screens/StartScreen3D.css` |
| CTA | `Button3D` — `BAŞLA` / `DEVAM ET` |
| Brand assets | `logo-plaque.webp`, `wax-seal-s.webp`, `welcome-plaque.svg` |
| Background | `/assets/themes/old_istanbul/background.webp` |

---

## Design lock (Welcome)

| Keep | Optional later (only if ≥ current premium) |
| --- | --- |
| Full-bleed cinematic background | New Anatolian plate with equal depth/lighting |
| Gold logo plaque + serif title | Subtle petrol/copper grading in overlays |
| Existing wax seal placement | — |
| Welcome plaque treatment | Copy/contrast micro-tweak |
| Single large `Button3D` CTA | Green variant **only if** it still reads as premium 3D enamel |

**Rule:** Modern Anadolu on Screen 01 = polish around the existing hero, not a flat redesign. If a change reduces perceived premium, revert.

---

## Revised production order note

Prefer applying C palette first to **Reward / Map / Shop / Hint / Level start** chrome. Revisit Welcome only with art that matches or beats current plaque depth.

---

## Gate 1 status

- [x] User feedback: current welcome more premium than mockup  
- [ ] New Welcome mockup — deferred until stronger art direction  
- [ ] Welcome implementation — **blocked** (not approved)
