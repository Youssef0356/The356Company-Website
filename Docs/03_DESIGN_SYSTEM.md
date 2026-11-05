# 03 — DESIGN SYSTEM & "ANTIGRAVITY" UI SPECIFICATION

> **Document Status:** Verified & Approved  
> **Skill Integration:** `antigravity-design-expert`, `gsap-scrolltrigger`, `web-design-guidelines`  
> **Theme:** Weightlessness, Spatial Glassmorphism, Kinetic Micro-Interactions

---

## 1. The "Antigravity" Design Pillars

The design system is engineered around four core tenets that distinguish The356Company from flat 2D websites:

```
                      ┌────────────────────────────────────────┐
                      │        ANTIGRAVITY UI ARCHITECTURE     │
                      └───────────────────┬────────────────────┘
                                          │
         ┌──────────────────┬─────────────┴──────┬──────────────────┐
         ▼                  ▼                    ▼                  ▼
   WEIGHTLESSNESS     SPATIAL DEPTH        GLASSMORPHISM      KINETIC FEEDBACK
   Diffused shadows   Multi-layer Z-axis   Frosted refraction Magnetic cursor,
   Zero-G float       Tilt & Perspective   Subtle neon stroke Spring dampening
```

1. **Weightlessness (Zero-G Suspension):**  
   Cards, devices, and UI elements do not sit heavily on borders. They hover. Drop-shadows are extra-soft and diffused (`box-shadow: 0 24px 48px -12px rgba(0, 0, 0, 0.45), 0 0 32px rgba(220, 176, 255, 0.08)`). Subtle idle floating keyframes (`translateY: ±6px`, `rotate: ±0.7deg`, `duration: 4-6s`, `ease: sine.inOut`) reinforce zero gravity.
2. **Spatial Depth & 3D CSS Perspectives:**  
   The viewport is treated as a 3D stage (`perspective: 1200px`). Elements tilt dynamically based on cursor proximity (`rotateX`, `rotateY`) and move with multi-layered parallax rates during scroll.
3. **Glassmorphism & Material Refraction:**  
   Surfaces utilize high-density frosted glass (`backdrop-filter: blur(16px) saturate(180%)`), translucent purple-tinted backgrounds (`rgba(44, 17, 95, 0.35)`), and 1px dual-tone gradient border strokes (`border-image: linear-gradient(to bottom, rgba(220,176,255,0.4), rgba(44,17,95,0.1))`).
4. **Kinetic Feedback & Magnetic Proximity:**  
   Every interactive element responds physically. Buttons magnetically attract the cursor, cards tilt toward the mouse position, and transitions feel organic through custom easing curves (`cubic-bezier(0.16, 1, 0.3, 1)`).

---

## 2. Interactive Cursor Architecture (Inspired by `aliadeel.com`)

The website implements a custom magnetic cursor system that elevates the user's tactile connection to the interface:

```
                      [CURSOR SYSTEM COMPOSITION]
   
             ●  Center Dot (r = 4px, #FFFFFF, instantaneous)
          ╭─────╮
        │   ○   │  Outer Magnetic Ring (r = 20px, stroke: #DCB0FF, lerp = 0.15)
          ╰─────╯
      ░░░░░░░░░░░░░░  Ambient Radial Spotlight (r = 250px, opacity: 0.12, soft blur)
```

### Cursor State Machine:
- **Default State:** A crisp 4px white dot surrounded by a smooth 32px ring (`border: 1.5px solid rgba(220, 176, 255, 0.4)`).
- **Hover State (Interactive Elements):** The outer ring expands to 64px, shifts to pure white with `backdrop-filter: invert(1)` or glass blur, and snaps magnetically to the center of buttons or link pills.
- **3D Interaction State (WebGL Canvases):** When hovering over rotatable 3D scenes (e.g., AR Explorer phone, The System card deck), the cursor transforms into a stylized drag reticle: `DRAG TO ROTATE` with animated circular arrows.
- **Accessibility Fallback:** Automatically hidden and disabled on touch devices (`@media (pointer: coarse)`) or when `prefers-reduced-motion` is enabled.

---

## 3. UI Component Specifications

### 3.1. Floating Glassmorphic Pill Navbar
A persistent, weightless navigation bar docked at the top of the viewport.

```html
<nav class="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-6 px-6 py-3 rounded-full 
            bg-[#0E071F]/60 backdrop-blur-xl border border-[#DCB0FF]/20 shadow-[0_16px_32px_rgba(0,0,0,0.5)]">
  <!-- Logo -->
  <a href="#hero" class="flex items-center gap-2">
    <img src="/logo_white.svg" alt="The356Company" class="h-6 w-auto" />
    <span class="font-bold tracking-tight text-white text-sm">The356Company</span>
  </a>
  <!-- Links -->
  <div class="flex items-center gap-1 text-xs font-medium text-white/70">
    <a href="#ar-explorer" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">AR Explorer</a>
    <a href="#pagelit" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">Pagelit</a>
    <a href="#the-system" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">The System</a>
    <a href="#battle-cows" class="px-3 py-1.5 rounded-full hover:text-white hover:bg-white/10 transition">Battle Cows</a>
  </div>
  <!-- CTA -->
  <a href="#ecosystem" class="px-4 py-1.5 rounded-full bg-[#DCB0FF] text-[#2C115F] font-semibold text-xs 
                             hover:bg-white hover:shadow-[0_0_16px_rgba(220,176,255,0.6)] transition">
    Ecosystem
  </a>
</nav>
```

### 3.2. Primary Store Buttons (Pill & Glass)
- **Google Play Store Pill:**
  - Background: Solid crisp white (`#FFFFFF`) or Deep Purple (`#2C115F`) with dual gradient glow.
  - Typography: Text `#090414`, font weight 600, with an authentic Google Play vector icon.
  - Hover Effect: Scale `1.03`, border glow expands to `0 0 24px rgba(220, 176, 255, 0.5)`.
- **Secondary Ghost Action Pill:**
  - Background: `rgba(255, 255, 255, 0.05)`, border `1px solid rgba(220, 176, 255, 0.25)`.
  - Typography: `#DCB0FF`, font weight 500.
  - Hover Effect: Background transitions to `rgba(220, 176, 255, 0.15)`.

### 3.3. Product Feature Cards (Spatial Glass Panels)
- **Geometry:** Rounded corners (`border-radius: 24px`), padding `32px`.
- **Border:** 1px subtle gradient stroke with light specular reflection on the top-left edge.
- **Content Structure:**
  - Top Badge: Category chip (e.g., `SPATIAL AR // V1.0`, `OFFLINE PDF // PRIVACY FIRST`).
  - Title: 32px display font with subtle gradient fill (`from-white to-white/70`).
  - Body: 15px clean explanatory copy (`text-white/80`).
  - Metric Pills: Highlights such as `0 MB Cloud Uploads`, `100% Offline`, `2-8 Players Pass & Play`.
  - Actions: Direct Google Play link button, GitHub source button, and interactive feature triggers.

---

## 4. Animation Curves & Motion Tokens

Standardized animation timings prevent chaotic or disjointed motion across sections:

```javascript
export const MOTION_TOKENS = {
  ease: {
    // Elegant deceleration curve for spatial entrances & card snaps
    antigravityDecel: 'cubic-bezier(0.16, 1, 0.3, 1)',
    // Bouncy cartoon curve for Battle Cows & playful UI elements
    bouncySnap: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    // Fluid continuous motion for infinite ambient drifting
    linear: 'none',
  },
  duration: {
    micro: 0.18,      // Button hovers, toggle snaps
    standard: 0.45,   // Modal reveals, dropdowns, card flips
    spatial: 1.1,     // Camera orbital transitions, scene crossfades
    ambientLoop: 6.0  // Idle zero-g floating cycles
  },
  stagger: 0.08       // Grid card and list item entrances
};
```
