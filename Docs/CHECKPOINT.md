# CHECKPOINT — PROJECT STATE & HANDOVER SPECIFICATION

> **Current Phase:** Milestone Complete — Atmospheric Nebula Environment, 3:5:6 Gyroscopic Orbital Rings, Isolated Entry Hook & 3D Hardware Showcases  
> **Status:** Live Dev Server Active (`http://localhost:3001/`) | Production Build Verified  
> **Last Updated:** November 7, 2026

---

## 1. What Was Fixed & Verified

### ✅ Fix 0: Volumetric Atmosphere, 3:5:6 Gyroscopic Orbital Rings & Isolated Entry Hook
- **Volumetric Studio Nebula & Silky Radial Particles (`AtmosphereBackground.tsx`):**
  - Replaced square pixel particles with a procedural 64x64 circular radial orb texture (`softOrbTexture`), eliminating harsh square edges.
  - Added a 2-layer Volumetric Studio Nebula Aura (`auraOuterRef` in Deep Purple `#2C115F` and `auraCoreRef` in Luminous Lavender `#DCB0FF`) directly behind the 356 Medallion, plus 550 deep-space stardust particles and 95 foreground spatial bokeh motes with cursor parallax.
- **Luminous Dual-Tone Orbital Rings & 3:5:6 Gyroscope (`StudioCore.tsx`):**
  - Discovered that in `studio_core.glb`, `Orbital_Ring_Inner_Glow` and `Orbital_Ring_Outer_Glow` had smaller tube thicknesses (`0.01`) than the opaque titanium torus meshes (`0.04`), hiding their neon emission inside the opaque metal. Scaled their local `Y` (torus cross-section thickness) by `4.5` and `3.2` so their `#F3E8FF` / `#DCB0FF` neon core protrudes visibly and triggers post-processing Bloom.
  - Aligned `Orbital_Ring_Inner` and `Orbital_Ring_Outer` using `XZY` Euler order with `Math.PI / 2` base X orientation so they spin around their true torus normals (`local Y`) and tilt at ~`25°`, guaranteeing their projected minor semi-axis (`>= 1.72`) is strictly outside the 356 Medallion (`r = 1.32`) and never cuts across the logo face.
  - Added two precision Sacred Geometry harmonic filament rings (`harmonicInnerRingRef`, `harmonicMidRingRef`) and 4 orbiting product signal nodes representing the 4 official published products: **Pagelit** (`#00E5FF`), **AR Explorer** (`#38BDF8`), **The System** (`#F59E0B`), and **Battle Cows** (`#10B981`).
- **Center-Stage Entry Isolation (`StudioCore.tsx` & `App.tsx`):**
  - Isolated the 356 Medallion at entry (`p < 0.08`) by keeping `phoneRef` hidden until `p = 0.07 -> 0.14` and `laptopRef` hidden until `p >= 0.45`, ensuring 100% of visitor focus is locked onto the 356 Medallion and its gyroscopic rings upon entry.
  - Elevated the studio glassmorphic badge (`Software • Games • Spatial Dimensions`) to `top-[6vh]` in `App.tsx` so it sits cleanly above the orbital halo.

### ✅ Fix 1: Phone Rotation on Scroll & Extended Mobile Showcase
- **Implementation:** During $p \in [0.18, 0.50]$, the phone dynamically rotates multi-axis in 3D (`scrollSwivelY`, `scrollTiltX`, plus subtle pointer parallax) as the visitor scrolls, showcasing beveled edges, premium metallic finishes, and cycling through 6 high-res screenshots of published studio applications (Pagelit, AR Explorer, The System, Battle Cows).
- **Verified:** Captured in `scratch/verify_02_phone_slide1.png` and `scratch/verify_03_phone_rotating.png`.

### ✅ Fix 2: Laptop Arrives 100% Closed, Then Opens Right Before Viewer
- **Hinge Calibration:** Hinge angle $-1.894$ rad is flat flush against keyboard base (100% closed). Hinge angle $0.000$ rad is upright at $108.5^\circ$.
- **Arrival ($p \in [0.60, 0.64]$):** Camera settles at elevated 3/4 angle `[-3.20, 0.85, 2.15]`. Laptop is resting 100% closed in space.
- **Smooth Opening ($p \in [0.64, 0.74]$):** As the visitor continues scrolling, the lid smoothly swings open from $-1.894$ to $0.000$ rad, and the camera glides forward and tilts into eye-level framing `[-3.20, 0.63, 1.35]`.
- **Verified:** Captured in `scratch/verify_04_laptop_closed.png` (closed) and `scratch/verify_05_laptop_opening.png` (halfway open).

### ✅ Fix 3: Physical 3D Laptop Hinge Rig & React 19 StrictMode Ref Binding
- **Root Cause of Frozen 3D Laptop:** In `StudioCore.tsx`, `laptopHingeRef`, `laptopLidRef`, `laptopScreenMeshRef`, `medallionRef`, and `ringsRef` were assigned as side-effects inside `useMemo(() => scene.clone(true))`. Under React 19 `<StrictMode>`, `useMemo` runs twice on mount: React mounted the first clone into `<primitive object={clonedScene} />`, while the second `useMemo` invocation overwrote all refs with nodes from the discarded second clone (`phoneRef` survived only because of a `!phoneRef.current` guard). Consequently, `useFrame` was rotating an orphaned `Laptop_Hinge` in memory while the live scene's `Laptop_Hinge` remained frozen at `-1.894 rad` (closed).
- **Architectural Solution:**
  - Moved all scene graph ref bindings out of `useMemo` into `useLayoutEffect(() => { ... }, [clonedScene])`, guaranteeing 100% binding to the mounted WebGL scene graph.
  - Rigged the embedded `Laptop_Laptop1_0001_1` submesh inside `Laptop_Lid` with corrected 4-vertex UVs (`(1,1), (0,1), (0,0), (1,0)`) and `polygonOffset` (`polygonOffsetFactor: -1, polygonOffsetUnits: -1`), removing the decoupled floating 2D plane so the 3D lid and screen swing open together as one rigid body.
  - Calibrated `CameraRig.tsx` open display framing to eye-level `pcOpenCamPos = [-3.20, 1.10, 1.45]` looking directly along the screen normal at `pcOpenScreenCenter = [-3.20, 0.63, -0.18]`.
- **Verified:** Visually verified across `test-shots/06_laptop_closed_arrival.png` (100% closed), `test-shots/07_laptop_lid_swinging_open.png` (lid & screen swinging open together over the backlit keyboard), `test-shots/08_laptop_open_desktop_slide1.png`, and `test-shots/09_laptop_open_desktop_slide3.png`.

### ✅ Fix 4: Clean Cosmic Studio Void (No Satellites in Laptop Background)
- **Fix:** Unconditionally set `child.visible = false` on all satellite meshes when $p \ge 0.54$, eliminating any cyan shards leaking into the laptop showcase background.
- **Verified:** Background in `scratch/clean_laptop_showcase.png` is pristine deep studio void.

### ✅ Fix 5: Unified Lenis Scroll Pipeline (Eliminated Competing Scrubbers)
- **Root Cause:** `useMasterTimeline.ts` had a redundant ScrollTrigger with `scrub: 1.2` that fought `useLenisScroll.ts`'s smooth updates on every frame.
- **Fix:** Streamlined `useMasterTimeline.ts` to manage lifecycle sync while letting Lenis act as the single source of truth for smooth scroll progress.

---

## 2. Master Experience Timeline

| Phase | Scroll Range | Visual Experience | Key Anchors |
|---|---|---|---|
| **Logo Medallion Intro** | `0.00 → 0.12` | Center stage, mysterious ambient glow, 180° coin flip | Cam: `[0, 0, 7.2] → [0, 0.05, 6.4]` |
| **Dolly to Phone** | `0.12 → 0.18` | Smooth camera transition to upright mobile device | Cam: `[0, 0.05, 6.4] → [3.20, 0.20, 2.20]` |
| **Phone Showcase** | `0.18 → 0.50` | Multi-axis 3D rotation, 6 mobile app screenshots | Hinge: `-1.894` (Closed) |
| **Cinematic Sweep** | `0.50 → 0.60` | Studio arc sweep across space to laptop | Satellites fade out at $p \ge 0.54$ |
| **Arrived at Closed Laptop** | `0.60 → 0.64` | Camera frames 100% closed hardware at 3/4 angle | Cam: `[-3.20, 0.85, 2.15]`, Hinge: `-1.894` |
| **Laptop Smoothly Opens** | `0.64 → 0.74` | Lid swings open upright, camera glides to eye level | Hinge: `-1.894 → 0.000`, Cam: `[-3.20, 0.63, 1.35]` |
| **Open Laptop Showcase** | `0.74 → 0.94` | Square eye-level display, 6 desktop showcases | Screen: `[-3.20, 0.627, -0.176]`, RotX: `-0.323` |
| **Manifesto Blackout** | `0.94 → 1.00` | Smooth fade to Studio Manifesto overlay | Screen opacity: `1.0 → 0.0` |

---

## 3. Strict Scope & Brand Constraints

- Strictly 4 published products: **Pagelit** (`com.the356company.pagelit`), **AR Explorer** (`com.the356company.arexplorer`), **The System** (`com.the356company.the_system`), **Battle Cows** (`com.the356company.battlecows`).
- SendSnap is unreleased and forbidden. No prototypes or game jams.
- Brand palette: Deep Purple `#2C115F`, Light Purple `#DCB0FF`, White `#FFFFFF`, Dark surfaces `#05020A`.
- Medallion logo must never be altered or regenerated.
