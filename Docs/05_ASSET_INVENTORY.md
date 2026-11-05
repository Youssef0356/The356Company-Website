# 05 — ASSET INVENTORY & PRODUCTION AUDIT

> **Document Status:** Verified & Indexed  
> **Source Directory:** `research/play/` + Sibling Development Folders  
> **Target Production Formats:** WebP / AVIF, Optimized Draco GLB, Procedural Shaders

---

## 1. Verified Play Store Assets (In Workspace)

All assets listed below have been extracted directly from live Google Play listings and are verified to represent current, production-grade versions of the applications.

### 1.1. Pagelit Asset Manifest (`research/play/pagelit/`)

| File Name | Dimensions | Size | Type | Verification Status | Intended Website Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `icon_512.png` | 512×512 | 278 KB | App Icon | ✅ Live Store Icon | Header avatar, app pill, ecosystem orbital node |
| `play_01.png` | 1080×2400 | 889 KB | Screen | ✅ Verified v1.0 | Hero phone mockup: Reader view with markup tools |
| `play_02.png` | 1080×2400 | 109 KB | Screen | ✅ Verified v1.0 | Feature card: Multi-format support (PDF/Word/Excel) |
| `play_03.png` | 1080×2400 | 119 KB | Screen | ✅ Verified v1.0 | Feature card: 7-color annotation & sticky note panel |
| `play_04.png` | 1080×2400 | 137 KB | Screen | ✅ Verified v1.0 | Feature card: Dark / Sepia / Night Dim reading modes |
| `play_05.png` | 1080×2400 | 279 KB | Screen | ✅ Verified v1.0 | Feature card: Smart text search with diacritic filters |
| `play_06.png` | 1080×2400 | 205 KB | Screen | ✅ Verified v1.0 | Feature card: 100% offline, zero-tracking privacy guarantee |

---

### 1.2. AR Explorer Asset Manifest (`research/play/ar-explorer/`)

| File Name | Dimensions | Size | Type | Verification Status | Intended Website Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `icon_512.png` | 512×512 | 275 KB | App Icon | ✅ Live Store Icon | Header avatar, app badge, ecosystem node |
| `promo_video_thumb.jpg`| 1920×1080 | 80 KB | Banner | ✅ Live Store Media | Cinematic video backdrop texture or preview card |
| `play_01.png` | 1080×2400 | 1.6 MB | Screen | ✅ Verified Live | Phone 3D screen texture: Real-time spatial tracking |
| `play_02.png` | 1080×2400 | 4.1 MB | Screen | ✅ Verified Live | Feature card: Surface plane detection in physical space |
| `play_03.png` | 1080×2400 | 3.7 MB | Screen | ✅ Verified Live | Feature card: Anchoring interactive 3D mechanical model |
| `play_04.png` | 1080×2400 | 3.4 MB | Screen | ✅ Verified Live | Feature card: Multi-touch gesture scaling & rotation |
| `play_05.png` | 1080×2400 | 444 KB | Screen | ✅ Verified Live | Feature card: Educational assembly inspection view |
| `play_06.png` | 1080×2400 | 253 KB | Screen | ✅ Verified Live | Feature card: Physics simulation & collision detection |
| `play_07.png` | 1080×2400 | 2.9 MB | Screen | ✅ Verified Live | Feature card: AR snapshot capture & model library |

---

### 1.3. The System Asset Manifest (`research/play/the-system/`)

| File Name | Dimensions | Size | Type | Verification Status | Intended Website Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `icon_512.png` | 512×512 | 156 KB | App Icon | ✅ Live Store Icon | App avatar, card emblem, ecosystem node |
| `play_01.png` | 1080×2400 | 1.8 MB | Screen | ✅ Verified Live | 3D card deck texture: Main bluffing game table |
| `play_02.png` | 1080×2400 | 1.7 MB | Screen | ✅ Verified Live | Feature card: Secret identity role assignment (Assassin) |
| `play_03.png` | 1080×2400 | 1.4 MB | Screen | ✅ Verified Live | Feature card: The "Call Bluff" challenge confrontation |
| `play_04.png` | 1080×2400 | 1.7 MB | Screen | ✅ Verified Live | Feature card: 2-8 player pass-and-play room lobby |
| `play_05.png` | 1080×2400 | 1.8 MB | Screen | ✅ Verified Live | Feature card: Tactical coin economy & influence actions |
| `play_06.png` | 1080×2400 | 4.5 MB | Screen | ✅ Verified Live | Feature card: Character role illustrations & abilities |
| `play_07.png` | 1080×2400 | 4.2 MB | Screen | ✅ Verified Live | Feature card: Detective investigation & deduction log |
| `play_08.png` | 1080×2400 | 730 KB | Screen | ✅ Verified Live | Feature card: Final round showdown & victory screen |

---

### 1.4. Battle Cows Asset Manifest (`research/play/battle-cows/`)

| File Name | Dimensions | Size | Type | Verification Status | Intended Website Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `icon_512.png` | 512×512 | 236 KB | App Icon | ✅ Live Store Icon | Header avatar, pasture icon, ecosystem node |
| `feature_graphic.png`| 1024×500 | 227 KB | Banner | ✅ Live Store Hero | Section header hero background / wide card |
| `play_01.png` | 1080×2400 | 860 KB | Screen | ✅ Verified v1.2 | Isometric pasture board preview: Hex tile grid |
| `play_02.png` | 1080×2400 | 1.1 MB | Screen | ✅ Verified v1.2 | Feature card: Bovine herd placement & movement |
| `play_03.png` | 1080×2400 | 1.3 MB | Screen | ✅ Verified v1.2 | Feature card: Territory capture & fence gate defenses |
| `play_04.png` | 1080×2400 | 1.5 MB | Screen | ✅ Verified v1.2 | Feature card: Turn-based strategy HUD & score cards |
| `play_05.png` | 1080×2400 | 997 KB | Screen | ✅ Verified v1.2 | Feature card: Campaign map & daily challenge missions |
| `play_06.png` | 1080×2400 | 929 KB | Screen | ✅ Verified v1.2 | Feature card: Cow customization, skins & tactical badges |

---

## 2. 3D Model Strategy: Procedural vs. Asset Models

To guarantee rapid loading times (< 2 seconds) and eliminate large multi-megabyte GLB downloads, the 3D architecture leverages **procedural geometric generation and lightweight optimized meshes**:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              3D SCENE ASSET ARCHITECTURE                               │
├──────────────────┬───────────────────────────────┬─────────────────┬───────────────────┤
│ Scene            │ 3D Representation             │ Implementation  │ Weight / Payload  │
├──────────────────┼───────────────────────────────┼─────────────────┼───────────────────┤
│ Hero / Genesis   │ Floating Constellation Orb    │ Procedural GLSL │ 0 KB (Code-only)  │
│ AR Explorer      │ Floating Phone & Spatial Grid │ Low-poly GLB    │ ~120 KB (Draco)   │
│ Pagelit          │ Unfolding 3D Digital Book     │ Procedural Mesh │ 0 KB (Code-only)  │
│ The System       │ 3D Holographic Card Deck      │ Procedural Mesh │ ~40 KB (Textures) │
│ Battle Cows      │ 3D Isometric Hex Pasture Grid │ Instanced Hexes │ 0 KB (Code-only)  │
│ Ecosystem Finale │ Interconnected Orbit Rings    │ Procedural GLSL │ 0 KB (Code-only)  │
└──────────────────┴───────────────────────────────┴─────────────────┴───────────────────┘
```

1. **Low-Poly Smartphone Shell (AR Explorer & Mockups):**
   - Clean, chamfered smartphone chassis with glass screen material.
   - Screen face accepts dynamic canvas textures mapped to verified Play Store screenshots.
2. **Procedural 3D Hex Tiles (Battle Cows):**
   - Generated with `THREE.CylinderGeometry(1, 1, 0.25, 6)` using an `InstancedMesh` (50 hex tiles rendered in a single GPU draw call).
   - Hex tops are dynamically textured with stylized pasture colors, fences, and coordinate pins.
3. **Procedural 3D Playing Cards (The System):**
   - Built with thin rounded boxes (`BoxGeometry(2.5, 3.5, 0.02)`).
   - Face texture renders secret role art (Assassin, Detective, Businessman) with an anisotropic metallic foil sheen shader.
4. **Procedural Unfolding Book (Pagelit):**
   - Parametric curved spine and floating leaf meshes that deform along a sine wave as the user scrolls, simulating pages turning in a zero-g digital void.

---

## 3. Asset Optimization & Delivery Pipeline

Prior to production deployment:
1. **Format Conversion:** Convert all PNG screenshots in `research/play/` to modern `.webp` and `.avif` formats using a Node/PowerShell sharp script. Target: 75% size reduction without visual loss.
2. **Responsive Thumbnails:** Generate `1080w`, `640w`, and `360w` srcset variants so mobile users download lightweight 60KB images instead of 3MB originals.
3. **Lazy Loading:** 3D scene textures load exclusively when their respective section approaches the viewport threshold via `IntersectionObserver`.

---

## 3. Official Studio Brand Assets (`public/assets/brand/`)

Ingested directly from `C:\Users\nejiy\Pictures\The356Company`:

| File Name | Dimensions | Size | Type | Verification Status | Intended Website Application |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `logo-white.png` | 2048×2048 | 55.7 KB | Official Logo | ✅ Master Studio Logo (White) | Navbar badge, Hero brand medallion, Footer identity, Favicon |
| `logo-black.png` | 2048×2048 | 49.6 KB | Official Logo | ✅ Master Studio Logo (Black) | Light-mode surfaces / high-contrast print fallbacks |
| `logo-v2.png` | 2048×2048 | 219.8 KB | Logo Mark | ✅ Studio Alternate Logo | Ecosystem convergence node |
| `banner.png` | 2048×768 | 1.4 MB | Official Banner | ✅ Master Studio Banner | OpenGraph & Twitter cards, Studio social preview |
| `color-palet.png` | 2048×2048 | 27.6 KB | Palette Spec | ✅ Brand Palette Document | Visual design token reference |
