# 10 — PERFORMANCE, ACCESSIBILITY & RESPONSIVE STRATEGY

> **Document Status:** Verified & Approved  
> **Skill Integration:** `web-design-guidelines`, `threejs-react-three-fiber`  
> **Target Budgets:** 60fps Steady, LCP < 2.5s, Mobile Battery Friendly

---

## 1. Performance Budgets & Core Web Vitals Targets

A premier 3D digital experience must never sacrifice speed or battery efficiency. The website adheres to strict technical thresholds:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CORE PERFORMANCE TARGETS                         │
├─────────────────────┬───────────────────────────┬───────────────────────────┤
│ Metric              │ Production Target         │ Measurement Strategy      │
├─────────────────────┼───────────────────────────┼───────────────────────────┤
│ LCP (Largest Paint) │ < 2.2 seconds             │ Text & Hero image above   │
│ INP (Next Paint)    │ < 150 milliseconds        │ Decoupled RAF loop        │
│ CLS (Shift)         │ < 0.05 (Near Zero)        │ Fixed viewport stage      │
│ Frame Rate          │ 60 FPS (Desktop & Mobile) │ Hardware-accelerated WebGL│
│ Initial JS Bundle   │ < 320 KB (gzipped)        │ Dynamic code-splitting    │
│ 3D Model Total      │ < 200 KB (Draco GLB)      │ Procedural code geometry  │
└─────────────────────┴───────────────────────────┴───────────────────────────┘
```

---

## 2. Dynamic WebGL Quality & Adaptive DPR Scaling

High-density mobile screens (such as 3x Retina displays) will overheat the GPU and drop frames if forced to render at native device pixel ratio. The canvas enforces **smart DPR clamping**:

```tsx
<Canvas
  // Clamps DPR between 1.0 (minimum legibility) and 1.5 on mobile, 2.0 on desktop
  dpr={typeof window !== 'undefined' && window.innerWidth < 768 ? [1, 1.5] : [1, 2]}
  gl={{
    powerPreference: 'high-performance',
    antialias: true,
    stencil: false,
    depth: true,
  }}
  performance={{ min: 0.5 }} // Allows R3F to dynamically drop quality if frames dip below 50fps
>
  <AdaptiveDpr pixelated />
  <AdaptiveEvents />
  <SceneManager />
</Canvas>
```

### Additional GPU Optimization Rules:
- **Geometry Instancing:** All 35+ hexagonal pasture tiles in Battle Cows are drawn in **a single draw call** using `THREE.InstancedMesh`.
- **Frustum Culling:** Any 3D object that rotates out of the active camera frustum is immediately culled from the render pass.
- **Offscreen Throttling:** When a section is completely outside the scroll viewport, its 3D group is set to `visible = false`, preventing unnecessary matrix transformations.

---

## 3. Accessibility & `prefers-reduced-motion` Architecture

In strict adherence to Web Interface Guidelines, visitors who have enabled reduced motion in their OS settings must receive a calm, comfortable experience:

```
                      [USER MOTION PREFERENCE DETECTION]
                                      │
                 ┌────────────────────┴────────────────────┐
                 ▼                                         ▼
     [MOTION PERMITTED]                           [PREFERS REDUCED MOTION]
     • Full 3D camera scrub flights               • 3D camera remains static
     • Pinned continuous scroll                   • Standard native page scroll
     • Custom magnetic cursor                     • Native OS system cursor
     • Kinetic card tilts & springs               • Elegant instantaneous card fades
```

### Implementation Hook:
```typescript
// src/hooks/useReducedMotion.ts
import { useState, useEffect } from 'react';

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};
```

---

## 4. Mobile Layout & Touch Ergonomics

On touch devices (screens < 768px wide):
- **Custom Cursor:** Hidden automatically (`display: none;`). Standard mobile touch events handle navigation.
- **Interactive Canvases:** 3D canvases set `pointer-events: none` on mobile to prevent hijacking the user's natural finger scroll.
- **Card Stacking:** Instead of floating multi-column glass grids, mobile screens present a clean, vertically stacked sequence of glass cards with high contrast and generous touch targets (minimum 48×48px for all store download buttons).
- **Store Badges:** Google Play and GitHub buttons remain pinned or easily reachable within the thumb zone.

---

## 5. WebGL Failure & Hardware Fallback

If WebGL is unavailable (e.g., outdated device driver, enterprise browser restrictions):
1. The site detects `!window.WebGLRenderingContext`.
2. The `<Canvas>` is replaced with a CSS-only static hero backdrop with subtle CSS gradient animations.
3. High-resolution rendered mockup images seamlessly take the place of the 3D meshes.
4. The user experiences zero breakage or blank screens.
