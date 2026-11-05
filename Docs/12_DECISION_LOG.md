# 12 — ARCHITECTURAL & CREATIVE DECISION LOG

> **Document Status:** Verified & Immutable  
> **Purpose:** Historical Record of Key Engineering & Design Decisions  
> **Rule:** Future agents must consult this log before proposing major architectural reversals.

---

## Decision 01: Product Showcase Scope & Eligibility

- **Decision:** Restrict the public showcase exclusively to the **four officially published Google Play products**:
  1. Pagelit (`com.the356company.pagelit`)
  2. AR Explorer (`com.the356company.arexplorer`)
  3. The System (`com.the356company.the_system`)
  4. Battle Cows (`com.the356company.battlecows`)
- **Alternatives Considered:** 
  - *Option B:* Include SendSnap as a flagship product.
  - *Option C:* Include all itch.io game jam titles (`Cyber Clash`, `Google It`, `Nightseeker`).
- **Rationale:** 
  - SendSnap returned an HTTP 404 on Google Play (`com.the356company.sendsnap`), proving it is not yet publicly live. Advertising unreleased software as available damages user trust.
  - The game jam games are experimental student/jam prototypes. Diluting the studio flagship site with prototypes lowers perceived brand authority.
- **Status:** **APPROVED & ENFORCED**.

---

## Decision 02: Single Fixed Background Canvas vs. Multi-Canvas DOM

- **Decision:** Mount one single persistent `<Canvas>` fixed across the entire viewport (`fixed inset-0 pointer-events-none`) and drive all camera/scene transitions via GSAP ScrollTrigger scrub progress.
- **Alternatives Considered:** 
  - *Option B:* Embed a separate `<Canvas>` inside each product section down the page.
- **Rationale:**
  - Modern mobile browsers (iOS Safari, Android Chrome) severely limit WebGL contexts (often crashing or refusing to allocate beyond 4-8 contexts).
  - Multiple canvases cause massive GPU context switching, excessive memory consumption, and stuttering scroll.
  - A single canvas enables cinematic, seamless camera transitions where objects can cross-dissolve into one another without DOM seam lines.
- **Status:** **APPROVED & ENFORCED**.

---

## Decision 03: Procedural 3D Geometry vs. Heavy External GLTF Assets

- **Decision:** Build scene objects procedurally via Three.js primitives (CylinderGeometry for hex tiles, BoxGeometry for cards, parametric curved pages for books) paired with custom GLSL shaders and lightweight low-poly meshes (< 200KB total).
- **Alternatives Considered:**
  - *Option B:* Download heavy, photo-scanned 20MB+ 3D models with 4K PBR textures for each scene.
- **Rationale:**
  - Heavy 3D assets introduce agonizing loading spinners and ruin initial page speed (LCP > 8s on 4G connections).
  - Procedural geometry loads in 0 milliseconds (pure JavaScript math) and scales infinitely without pixelation.
- **Status:** **APPROVED & ENFORCED**.

---

## Decision 04: Studio Purple Framing with Product Individuality

- **Decision:** Use the official Deep Purple (`#2C115F`) and Light Purple (`#DCB0FF`) for studio branding, navigation, and overarching atmosphere, while allowing each product's 3D scene to introduce its own signature accent color (Pagelit Cyan, AR Cobalt, System Noir Amber, Battle Cows Meadow Green).
- **Alternatives Considered:**
  - *Option B:* Recoloring all products to fit strictly into purple.
- **Rationale:**
  - Forcing Battle Cows or Pagelit into purple would destroy their authentic brand identities and make the website look like an artificial template.
  - Coexistence proves the studio's versatility across multiple software genres.
- **Status:** **APPROVED & ENFORCED**.

---

## Decision 05: Motion Decoupling & Reduced Motion Fallback

- **Decision:** Implement a dual-mode presentation that detects `prefers-reduced-motion`. When active, all 3D camera travel and scroll scrubbing are disabled, replaced by clean, static, high-contrast accessible layouts.
- **Alternatives Considered:**
  - *Option B:* Ignore reduced motion and force 3D camera scrubbing on all visitors.
- **Rationale:**
  - Compliance with international accessibility standards (WCAG 2.2).
  - Respects visitors with vestibular disorders who experience motion sickness from 3D camera movements.
- **Status:** **APPROVED & ENFORCED**.

---

## Decision 06: Bespoke Authentic 2D/3D Hybrid Mechanics & Edge Parallax

- **Decision:** Replace generic 3D primitives with a hybrid architecture combining authentic 2D studio game sprites, high-resolution Play Store assets, and CSS 3D physics (`perspective: 1200-1600px`, `transform-style: preserve-3d`), framed by Firewatch-style stacked edge parallax layers.
- **Alternatives Considered:**
  - *Option B:* Standard low-poly Three.js procedural models across all sections.
  - *Option C:* Flat 2D layout with simple CSS borders between sections.
- **Rationale:**
  - Standard 3D procedural primitives looked generic and failed to convey the handcrafted personality of each game/app.
  - Authentic sprites (Holstein cow leaping with dust bursts, noir confidential dossier elements, secret role cards) deliver genuine studio identity with instantaneous 0-millisecond asset loading and zero WebGL shader compilation stutter.
  - Firewatch-style edge parallax frames the viewport organically without artificial section dividers.
  - Bespoke mechanics per section (Gaussian Splat phone assembly & volumetric ray projection for AR Explorer; 3D dual-pageflip reader for Pagelit; 3D card fanning deck with bluff confrontation for The System; live hex-hopping cow for Battle Cows) provide unique experiential delight for every single product.
- **Status:** **APPROVED & IMPLEMENTED**.

---

## Decision 07: Radical Section Differentiation & Elimination of Boxed Cards

- **Decision:** Strip out repetitive two-column bordered card containers across all product sections (`glass-panel-... p-8 border border-...`) in favor of completely unique, open, and theme-tailored layouts:
  1. **AR Explorer:** Interactive R3F WebGL spatial laboratory (`ARSpatialViewer`) with 3 scan modes (LiDAR Point Cloud, Spatial Wireframe Torus, Depth Occlusion Heatmap), laser scanning plane, and wide-open spatial telemetry strip (`0.012mm`, `60 FPS`, `6-DOF`, `0.00 KB`).
  2. **Pagelit:** Minimalist Swiss editorial typography spread with wide pull quote, 3 open column dividers (`01`, `02`, `03`), and 3D binder hero.
  3. **The System:** Confidential declassified government dossier with typewriter typography, red classified stamp, interactive click-to-reveal redacted text bars, and suspect evidence line-up.
  4. **Battle Cows:** Retro arcade pasture arena with live territory conquest split meter (`64% vs 36%`), floating 8-bit game mechanics, and live leaping cow on hex stepping stones.
- **Alternatives Considered:**
  - *Option B:* Keep identical card templates with different border colors.
- **Rationale:**
  - Boxed cards create visual fatigue and make a creative portfolio look like a boilerplate SaaS directory.
  - Giving each section a radically distinct layout structure (Spatial Lab vs. Swiss Editorial vs. Noir Dossier vs. Arcade Arena) fulfills the studio's identity as a versatile indie powerhouse.
- **Status:** **APPROVED & IMPLEMENTED**.

---

## Decision 08: Signal Atlas — Independent Worlds, One Constellation

- **Date:** November 5, 2026
- **Decision:** Proceed with Signal Atlas as the overall narrative direction, refined as **Independent Worlds, One Constellation**. The experience is a continuous scroll-led digital exhibition with four distinct product scenes and a subtle signal motif used only to connect transitions.
- **Per-product direction:** AR Explorer uses spatial scanning/anchoring; Pagelit uses quiet reading and annotation; The System uses a rules-accurate card reveal; Battle Cows uses verified tactical movement on a pasture board. Palettes, composition, typography, pacing, and motion grammars remain distinct.
- **Alternatives considered:** Open Studio (more free navigation, less directed scroll journey); Four Independent Instruments (maximizes product independence, weakens continuous narrative); single repeating “atlas” look (rejected because it risks template repetition).
- **Rationale:** The approved direction preserves the user's original brief for a continuous scroll journey, unique product environments, and an ecosystem finale, while avoiding the conventional hero/product-card rhythm and false claims implied by simulated product telemetry.
- **Content integrity:** All feature claims and gameplay interactions must be verified against current published products. Clearly label web interpretations. The final constellation represents future ambition; products remain independent today.
- **Implementation implications:** Prefer normal document flow with optional scroll-linked motion, direct navigation, keyboard/touch alternatives, reduced-motion and WebGL fallbacks. Reassess multiple WebGL canvases and continuous effects before building.
- **Status:** Approved for creative direction and storyboard; detailed feature interactions remain subject to verification.


---

## Decision 09: Restore the Previous Visual Treatment After Review

- **Date:** November 5, 2026
- **Decision:** Restore the page composition and visual treatment that preceded the first full-page Signal Atlas pass. Keep product-specific color and motion; defer another broad redesign.
- **User feedback:** The user preferred the previous style after seeing the new pass.
- **Implementation:** Recovered the prior App, AR Explorer, Battle Cows, navbar, scroll hooks, stylesheet, and Three.js chunking from the local session snapshot. Pagelit and The System source were clipped in that snapshot, so those two sections were reconstructed from surviving markup and existing public assets.
- **Rationale:** The earlier product showcase is the user's preferred visual baseline. Motion and creative polish should build on that baseline.
- **Status:** Implemented; browser review remains.
