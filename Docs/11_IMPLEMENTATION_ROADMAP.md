# 11 — IMPLEMENTATION ROADMAP & ACCEPTANCE CRITERIA

> **Document Status:** Verified & Approved  
> **Execution Strategy:** Phased, Testable, Multi-Agent Friendly  
> **Starting Milestone:** Phase 1 (Project Scaffolding)

> **Current direction update (November 5, 2026):** The first Signal Atlas visual pass was rolled back after user review. The previous page treatment is the implementation baseline again; retain its product-specific sections and existing motion. Decision 08 remains a narrative reference, not an instruction to replace the visual system.

> **Progress:** Rollback to the previous visual treatment is complete and npm.cmd run build succeeds. Pagelit and The System were reconstructed from clipped source snapshots and existing assets. Next: review those sections in the browser, verify claims, and refine motion within the restored style. See Docs/CHECKPOINT.md.

---

## 1. Roadmap Overview

The implementation of The356Company official website is divided into **five sequential phases**. Each milestone possesses strictly defined acceptance criteria, enabling any AI coding agent to pick up where the previous agent left off without ambiguity.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          PHASED DEVELOPMENT ROADMAP                         │
├─────────────┬─────────────────────────────────┬─────────────────────────────┤
│ Phase       │ Name                            │ Primary Deliverables        │
├─────────────┼─────────────────────────────────┼─────────────────────────────┤
│ Phase 1     │ Scaffolding & Infrastructure    │ Vite 6, TS, Tailwind, Lenis │
│ Phase 2     │ Design System & UI Atoms        │ Glass cards, Navbar, Cursor │
│ Phase 3     │ 3D Engine & Master Scroll       │ Single Canvas, CameraRig    │
│ Phase 4     │ Product Showcase Scenes         │ 6 Bespoke 3D & DOM Scenes   │
│ Phase 5     │ Optimization, A11y & Deploy     │ Performance pass, CI/CD     │
└─────────────┴─────────────────────────────────┴─────────────────────────────┘
```

---

## 2. Milestone Breakdown & Acceptance Criteria

---

### Phase 1: Scaffolding & Core Infrastructure
- **Objective:** Establish the clean, production-ready Vite + React 19 + TypeScript workspace.
- **Tasks:**
  1. Initialize Vite project with `@vitejs/plugin-react` and `tailwindcss`.
  2. Install verified dependencies:
     - `three @types/three @react-three/fiber @react-three/drei @react-three/postprocessing`
     - `gsap @studio-freight/lenis` (or `lenis`)
     - `zustand clsx tailwind-merge lucide-react`
  3. Configure `tsconfig.json` with strict type checking and path aliases (`@/*`).
  4. Set up `globals.css` with the brand colors and 3D perspective variables.
- **Acceptance Criteria:**
  - `npm run build` succeeds with zero TypeScript errors or warnings.
  - Development server runs smoothly via `npm run dev`.

---

### Phase 2: Design System & "Antigravity" UI Atoms
- **Objective:** Implement the core visual language, glassmorphism, floating navbar, and custom magnetic cursor.
- **Tasks:**
  1. Create `src/components/ui/Navbar.tsx` (pinned glass pill, navigation links to all 4 products + ecosystem).
  2. Create `src/components/ui/CustomCursor.tsx` (magnetic snap, trailer ring, spotlight blur, hidden on touch).
  3. Create `src/components/ui/GlassCard.tsx` (frosted glass container, specular border gradient, soft drop shadow).
  4. Create `src/components/ui/StoreBadge.tsx` (Google Play store pill with authentic store badge).
  5. Create `src/components/ui/Footer.tsx` (studio info, legal copyright, social channels).
- **Acceptance Criteria:**
  - Navbar docks smoothly at viewport top with frosted blur.
  - Cursor tracks mouse fluidly with zero stutter and expands magnetically on button hover.
  - Touch devices automatically suppress the custom cursor.

---

### Phase 3: Master 3D Canvas & Scroll Engine
- **Objective:** Construct the single persistent WebGL background stage synchronized with GSAP ScrollTrigger and Lenis.
- **Tasks:**
  1. Implement `useLenisScroll.ts` for buttery-smooth momentum scrolling.
  2. Create `src/components/canvas/SceneManager.tsx` with `<Canvas>`, `CameraRig.tsx`, and `Lighting.tsx`.
  3. Set up `useMasterTimeline.ts` to connect DOM scroll height (600vh) with normalized scrub progress (`0.0 to 1.0`).
  4. Connect `useExperienceStore` to track active scene index and scroll progress.
- **Acceptance Criteria:**
  - Scrolling dynamically controls camera position and lighting color without triggering DOM re-renders.
  - FPS counter maintains steady 60fps during scroll scrub.

---

### Phase 4: Product Showcase Scenes Implementation
- **Milestone 4A — Scene 01: Genesis (Hero)**
  - Rotating crystalline emblem, stardust particles, architectural studio typography.
- **Milestone 4B — Scene 02: AR Explorer**
  - Floating 3D phone chassis, animated cyan floor laser grid plane, rotating mechanical hologram model, store CTA.
- **Milestone 4C — Scene 03: Pagelit**
  - Unfolding 3D digital book with fluttering translucent pages, glowing multi-color annotation ribbons, offline privacy cards.
- **Milestone 4D — Scene 04: The System**
  - Noir overhead spotlight, fanning 3D card deck, 180° card flip revealing Assassin/Detective art, bluff challenge prompt.
- **Milestone 4E — Scene 05: Battle Cows**
  - Staggered bouncy drop of 35+ 3D hexagonal pasture tiles, low-poly cow pieces, turn-based strategy UI.
- **Milestone 4F — Scene 06: The Connected Constellation (Ecosystem Finale)**
  - Camera pull back, 4 hero tokens orbiting central studio core, constellation energy filaments, download hub.
- **Acceptance Criteria:**
  - Each scene smoothly transitions into the next with no visual pop-in or canvas flickering.
  - All screenshots and links point to verified live resources.

---

### Phase 5: Optimization, Accessibility & Deployment
- **Objective:** Final polish, WebP compression, mobile audit, reduced motion fallback, and deployment.
- **Tasks:**
  1. Compress all Play Store screenshot PNGs to `.webp` and `.avif`.
  2. Implement `useReducedMotion` fallback (static high-contrast presentation when enabled).
  3. Verify touch interactions on mobile breakpoints (< 768px).
  4. Configure GitHub Actions / Vercel deployment pipeline.
- **Acceptance Criteria:**
  - Google Lighthouse performance score > 90.
  - Verified compatibility across Chromium, Safari, and Firefox.
  - Site builds and deploys cleanly to production.
