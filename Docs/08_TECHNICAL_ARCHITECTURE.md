# 08 — TECHNICAL ARCHITECTURE & COMPONENT BLUEPRINT

> **Document Status:** Verified & Approved  
> **Skill Integration:** `threejs-react-three-fiber`, `r3f-materials`, `gsap-scrolltrigger`  
> **Target Toolchain:** Vite 6 + React 19 + TypeScript + Tailwind CSS v4

---

## 1. Technology Stack Specification

The frontend architecture is selected to deliver state-of-the-art 3D graphics and scroll choreography with absolute zero-backend overhead:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORE PRODUCTION TOOLCHAIN                         │
├─────────────────────┬───────────────────────────┬───────────────────────────┤
│ Layer               │ Library / Technology      │ Purpose / Justification   │
├─────────────────────┼───────────────────────────┼───────────────────────────┤
│ Build & Bundler     │ Vite 6 + TypeScript       │ Instant HMR, tree-shaking │
│ UI Framework        │ React 19                  │ Modern concurrent engine  │
│ Styling             │ Tailwind CSS v4 + PostCSS │ Utility & CSS 3D helpers  │
│ Smooth Scroll       │ Lenis (@studio-freight)   │ Decoupled hardware scroll │
│ Motion & Triggers   │ GSAP 3.12 + ScrollTrigger │ Scrubbing, timeline sync  │
│ WebGL Canvas        │ Three.js r170+            │ 3D scene engine           │
│ React 3D Renderer   │ @react-three/fiber        │ Declarative R3F components│
│ 3D Helpers & Text   │ @react-three/drei         │ Orbit, Float, MeshReflect │
│ Shaders / Effects   │ @react-three/postprocess  │ Selective Bloom & Vignette│
│ State Store         │ Zustand                   │ Ultra-lean state without  │
│                     │                           │ triggering DOM re-renders │
│ Deployment Host     │ Vercel / GitHub Pages     │ Global edge static CDN    │
└─────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 2. Pinned Canvas vs. DOM Decoupling Pattern

A common anti-pattern in 3D web design is mounting separate `<Canvas>` elements for every section down the page. This destroys mobile performance by allocating multiple WebGL contexts and wasting GPU memory.

The356Company website enforces the **Single Persistent Background Canvas Pattern**:

```
 ┌──────────────────────────────────────────────────────────────────┐
 │                         VIEWPORT ROOT                            │
 ├─────────────────────────────────┬────────────────────────────────┤
 │   FIXED WEBGL BACKGROUND CANVAS │      SCROLLABLE DOM LAYER      │
 │       (fixed inset-0 z-0)       │     (relative z-10 w-full)     │
 │                                 │                                │
 │  • SceneManager.tsx             │  • Navbar (fixed top-6)        │
 │  • CameraController.tsx         │  • Hero Section (100vh)        │
 │  • Scene01Genesis.tsx           │  • ARExplorer Section (120vh)  │
 │  • Scene02ARExplorer.tsx        │  • Pagelit Section (120vh)     │
 │  • Scene03Pagelit.tsx           │  • TheSystem Section (120vh)   │
 │  • Scene04TheSystem.tsx         │  • BattleCows Section (100vh)  │
 │  • Scene05BattleCows.tsx        │  • Ecosystem Section (100vh)   │
 │  • Scene06Ecosystem.tsx         │  • Footer & Legal              │
 └─────────────────────────────────┴────────────────────────────────┘
                 ▲                                  │
                 │        GSAP SCROLL PROGRESS      │
                 └──────────────────────────────────┘
```

### Communication Bridge (Zero Re-render State):
- **DOM triggers GSAP ScrollTrigger:** As DOM sections scroll, ScrollTrigger calculates precise normalized progress (`0.000` to `1.000`).
- **Direct 3D Mutable Refs:** Scroll progress is passed directly to 3D object references and the camera via mutable refs inside `useFrame()`. 
- **Zero React DOM re-renders occur during scroll scrubbing**, ensuring a continuous 60fps frame rate.

---

## 3. Directory & Component Structure

```
The356Company Website/
├── public/
│   ├── favicon.ico
│   ├── logo_white.svg
│   ├── logo_purple.svg
│   └── models/
│       └── phone_chassis.glb      # Lightweight Draco-compressed model (~120KB)
├── src/
│   ├── assets/                    # Optimized WebP screenshots & store badges
│   │   ├── ar-explorer/
│   │   ├── battle-cows/
│   │   ├── pagelit/
│   │   └── the-system/
│   ├── components/
│   │   ├── canvas/                # All React Three Fiber (R3F) 3D components
│   │   │   ├── SceneManager.tsx   # Master WebGL canvas & postprocessing
│   │   │   ├── CameraRig.tsx      # Smooth camera interpolation
│   │   │   ├── Lighting.tsx       # Dynamic scene lighting crossfades
│   │   │   ├── scenes/
│   │   │   │   ├── GenesisScene.tsx
│   │   │   │   ├── ARExplorerScene.tsx
│   │   │   │   ├── PagelitScene.tsx
│   │   │   │   ├── TheSystemScene.tsx
│   │   │   │   ├── BattleCowsScene.tsx
│   │   │   │   └── EcosystemScene.tsx
│   │   │   └── effects/
│   │   │       ├── LaserGridPlane.tsx
│   │   │       ├── FloatingPages.tsx
│   │   │       ├── CardDeck3D.tsx
│   │   │       └── HexPastureGrid.tsx
│   │   ├── dom/                   # Scrollable DOM content & section overlays
│   │   │   ├── HeroOverlay.tsx
│   │   │   ├── ARExplorerOverlay.tsx
│   │   │   ├── PagelitOverlay.tsx
│   │   │   ├── TheSystemOverlay.tsx
│   │   │   ├── BattleCowsOverlay.tsx
│   │   │   └── EcosystemOverlay.tsx
│   │   └── ui/                    # Reusable Antigravity UI atoms & molecules
│   │       ├── Navbar.tsx         # Floating glass pill navbar
│   │       ├── CustomCursor.tsx   # Magnetic pointer & trailer ring
│   │       ├── GlassCard.tsx      # Frosted glass panel with specular border
│   │       ├── StoreBadge.tsx     # Google Play & Itch.io pill buttons
│   │       └── Footer.tsx         # Studio legal, copyright, and social links
│   ├── hooks/
│   │   ├── useLenisScroll.ts      # Lenis smooth scroll initializer
│   │   ├── useMasterTimeline.ts   # GSAP ScrollTrigger timeline binder
│   │   └── useReducedMotion.ts    # Accessibility detection
│   ├── stores/
│   │   └── useExperienceStore.ts  # Zustand store (active scene, audio, cursor state)
│   ├── styles/
│   │   └── globals.css            # Tailwind directives & 3D CSS transforms
│   ├── App.tsx                    # Root application entry
│   └── main.tsx                   # Vite React bootstrap
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 4. State Management with Zustand (`useExperienceStore`)

```typescript
import { create } from 'zustand';

interface ExperienceState {
  // Navigation & Scene Index (0: Genesis, 1: AR, 2: Pagelit, 3: System, 4: Cows, 5: Ecosystem)
  activeSceneIndex: number;
  setActiveSceneIndex: (index: number) => void;

  // Global Scroll Scrub Progress (0.0 to 1.0)
  scrollProgress: number;
  setScrollProgress: (progress: number) => void;

  // Custom Cursor Mode
  cursorVariant: 'default' | 'hover' | 'drag-3d' | 'reading-markup';
  setCursorVariant: (variant: 'default' | 'hover' | 'drag-3d' | 'reading-markup') => void;

  // Audio / Sound FX Toggle
  isAudioMuted: boolean;
  toggleAudio: () => void;
}

export const useExperienceStore = create<ExperienceState>((set) => ({
  activeSceneIndex: 0,
  setActiveSceneIndex: (index) => set({ activeSceneIndex: index }),

  scrollProgress: 0,
  setScrollProgress: (progress) => set({ scrollProgress: progress }),

  cursorVariant: 'default',
  setCursorVariant: (variant) => set({ cursorVariant: variant }),

  isAudioMuted: true,
  toggleAudio: () => set((state) => ({ isAudioMuted: !state.isAudioMuted })),
}));
```

---

## 5. Deployment & CI/CD Pipeline

- **Static Generation:** Built via `vite build` to generate pure, lightweight static HTML, JS, and CSS chunks in `dist/`.
- **Zero Server Costs:** Hosted directly on Vercel or GitHub Pages with zero compute costs.
- **Cache Headers:** All 3D assets, fonts, and WebP screenshots configured with immutable 1-year cache headers (`Cache-Control: public, max-age=31536000, immutable`).
