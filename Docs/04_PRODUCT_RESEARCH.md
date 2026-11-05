# 04 — PRODUCT RESEARCH & VERIFICATION REPORT

> **Document Status:** Verified & Confirmed via Live Store Listings, Local Repositories, and APK Assets  
> **Investigation Date:** November 2026  
> **Auditor:** Creative Direction & Technical Planning Team

---

## 1. Executive Summary & Showcase Eligibility

To uphold the absolute credibility of The356Company, **only officially published, production-grade applications and games** are eligible for the primary website showcase. Every product was verified across its Google Play Store listing, live web landing pages, and local source repositories.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PRODUCT ELIGIBILITY AUDIT                                 │
├──────────────────┬───────────────────────────────┬─────────────────┬───────────────────┤
│ Product Name     │ Package ID / Distribution     │ Engine / Tech   │ Showcase Status   │
├──────────────────┼───────────────────────────────┼─────────────────┼───────────────────┤
│ Pagelit          │ com.the356company.pagelit     │ Flutter/Dart    │ ✅ ELIGIBLE (Live)│
│ AR Explorer      │ com.the356company.arexplorer  │ Unity / ARCore  │ ✅ ELIGIBLE (Live)│
│ The System       │ com.the356company.the_system  │ Flutter/Dart    │ ✅ ELIGIBLE (Live)│
│ Battle Cows      │ com.the356company.battlecows  │ Flutter + Flame │ ✅ ELIGIBLE (Live)│
├──────────────────┼───────────────────────────────┼─────────────────┼───────────────────┤
│ SendSnap         │ com.the356company.sendsnap    │ Flutter / P2P   │ ⛔ EXCLUDED (404) │
│ Cyber Clash      │ Itch.io (Game Jam)            │ Unreal Engine   │ ⛔ EXCLUDED (Jam) │
│ Google It        │ Itch.io (Game Jam)            │ 2.5D Mini Game  │ ⛔ EXCLUDED (Jam) │
│ Nightseeker      │ Itch.io (Prototype)           │ 3D Unity Horror │ ⛔ EXCLUDED (Proto)
└──────────────────┴───────────────────────────────┴─────────────────┴───────────────────┘
```

---

## 2. Product Deep Dives (Eligible Commercial Flagships)

---

### Product 01: Pagelit — PDF Reader & Document Viewer

- **Store Package:** `com.the356company.pagelit`
- **Official Store Link:** [Google Play Store](https://play.google.com/store/apps/details?id=com.the356company.pagelit)
- **Official Web Landing:** [https://youssef0356.github.io/pagelit/](https://youssef0356.github.io/pagelit/)
- **GitHub Repository:** [Youssef0356/pagelit](https://github.com/Youssef0356/pagelit)
- **Latest Release Date:** November 1, 2026
- **Primary Domain:** Utility, Privacy-First Productivity, Document Management

#### Core Mechanics & Features Verified:
1. **Multi-Format Document Engine:** Instant native reading of `.pdf`, Word (`.docx`), Excel (`.xlsx`), and PowerPoint (`.pptx`) without needing external cloud converters.
2. **100% Offline & Zero Cloud Uploads:** No user accounts, no login required, zero data collection or tracking. All files remain completely localized on device storage.
3. **Versatile Markup & Annotation Suite:** 
   - 7 distinct highlight colors with custom default memory.
   - Text markup: highlight, underline, strikethrough, squiggly lines.
   - Spatial sticky notes & comments attached to specific page coordinates.
   - One-tap annotation editing, recoloring, and bulk deletion.
4. **Reading Comfort & Ergonomics:**
   - Multi-layout options: continuous vertical scroll vs. single-page swipe.
   - Eye-care palettes: Clean Light, AMOLED Deep Dark, Warm Sepia, and Night Dim modes.
   - Screen-keep-on toggle and distraction-free full-screen reading mode.
   - Full Right-to-Left (RTL) layout support for Arabic, English, and French.
5. **Smart Search & Export:** Fast in-text search with diacritic/Tashkeel tolerance, export high-res page snapshots to gallery, duplicate clean/annotated copies.

#### Visual Identity & Assets Available:
- **Color Accent:** Cyan & Paper White (`#00E5FF`, `#F8FAFC`).
- **Extracted Assets in Workspace (`research/play/pagelit/`):**
  - High-res application icon (`icon_512.png`).
  - 6 verified Play Store screenshots (`play_01.png` to `play_06.png`) showing real UI, PDF rendering, annotations, and reading themes.

---

### Product 02: AR Explorer — Learn & Build in Augmented Reality

- **Store Package:** `com.the356company.arexplorer`
- **Official Store Link:** [Google Play Store](https://play.google.com/store/apps/details?id=com.the356company.arexplorer)
- **Official Web Landing:** [https://youssef0356.github.io/AR_ExplorerWebsite/](https://youssef0356.github.io/AR_ExplorerWebsite/)
- **GitHub Repository:** [Youssef0356/ar_explorer](https://github.com/Youssef0356/ar_explorer)
- **Primary Domain:** Augmented Reality, Spatial Computing, 3D Interactive Learning

#### Core Mechanics & Features Verified:
1. **Real-Time Surface & Plane Detection:** Powered by ARCore to scan physical rooms, floors, and horizontal tables, projecting a real-time tracking reticle.
2. **Interactive 3D Model Anchoring:** Pin complex 3D objects (architectural structures, engineering components, animated creatures) into physical space with persistent spatial coordinates.
3. **Multi-Touch Spatial Manipulation:** Intuitive pinch-to-scale, 360-degree rotation, dual-axis elevation, and real-time collision detection.
4. **Educational Visualization:** Inspect internal assemblies, mechanical cutaways, and physics-driven simulations directly in the user's living room or classroom.

#### Visual Identity & Assets Available:
- **Color Accent:** Electric Cobalt & Laser Cyan (`#2563EB`, `#38BDF8`).
- **Extracted Assets in Workspace (`research/play/ar-explorer/`):**
  - High-res application icon (`icon_512.png`).
  - Promo video thumbnail (`promo_video_thumb.jpg`).
  - 7 verified Play Store screenshots (`play_01.png` to `play_07.png`) showcasing surface detection, model placement, and AR HUD overlays.

---

### Product 03: The System — Party Card Game (Social Deduction & Bluffing)

- **Store Package:** `com.the356company.the_system`
- **Official Store Link:** [Google Play Store](https://play.google.com/store/apps/details?id=com.the356company.the_system)
- **Alternative Distribution:** [itch.io](https://youssef356.itch.io/the-system-card-game)
- **Official Web Landing:** [https://youssef0356.github.io/The_system-Website/](https://youssef0356.github.io/The_system-Website/)
- **GitHub Repository:** [Youssef0356/the_system](https://github.com/Youssef0356/the_system)
- **Primary Domain:** Mobile Gaming, Party / Social Deduction, Tabletop Card Game

#### Core Mechanics & Features Verified:
1. **Social Deduction & Bluffing (2-8 Players):**
   - Pure offline "pass & play" mobile board experience or solo play.
   - Secret identity roles: **Businessman**, **Taxman**, **Assassin**, **Marshal**, **Detective**, **Politician**, **Thief**.
2. **The "Call Your Bluff" Core Loop:**
   - On a player's turn, they claim any role power out loud (even if they don't hold the card).
   - Any opponent may challenge the claim. If caught lying, the bluffer loses a card or influence; if falsely accused, the accuser is punished.
3. **Tactical Economy & Influence Tokens:** Accumulate gold, hire hitmen, manipulate elections, or trigger secret raids while maintaining a poker face.
4. **Localized Experience:** Full Arabic and English language support, custom card illustrations, atmospheric soundscapes.

#### Visual Identity & Assets Available:
- **Color Accent:** Noir Gold & Crimson Ember (`#F59E0B`, `#EF4444`).
- **Extracted Assets in Workspace (`research/play/the-system/`):**
  - High-res application icon (`icon_512.png`).
  - 8 verified Play Store screenshots (`play_01.png` to `play_08.png`) displaying card art, role selection, pass-and-play UI, and round victory screens.

---

### Product 04: Battle Cows — Hex-Based Territory Strategy Board Game

- **Store Package:** `com.the356company.battlecows`
- **Official Store Link:** [Google Play Store](https://play.google.com/store/apps/details?id=com.the356company.battlecows)
- **Alternative Distribution:** [itch.io](https://youssef356.itch.io/battle-cows)
- **GitHub Repository:** `Battle_Cows` (local repo analyzed)
- **Engine Version:** Flutter 3.11 + Flame Engine 1.36 (App Version `1.2.2+14`)
- **Primary Domain:** Turn-Based Strategy, Hexagonal Tactical Puzzle, Indie Game

#### Core Mechanics & Features Verified:
1. **Hexagonal Grid Conquering:** Players deploy bovine armies across dynamic hex-tiled pastures. Expanding contiguous territory unlocks stronger herds and pasture control.
2. **Strategic Obstacles & Defense:** Construct fence gates, hay bale blockades, and defensive barns to stall opponent herd invasions.
3. **Flavored Factions & Progression:** Quirky cow characters with distinct tactical stats, customizable herd banners, campaign missions, and daily quests.
4. **Custom Audio & Visuals:** Whimsical banjo-driven country soundtrack (`bg_music.wav`), satisfying tactile sound effects (`capture.wav`, `hay.wav`), and Kenney-inspired cartoon UI panels.

#### Visual Identity & Assets Available:
- **Color Accent:** Meadow Green & Sunburst Yellow (`#10B981`, `#FBBF24`).
- **Extracted Assets in Workspace (`research/play/battle-cows/`):**
  - High-res application icon (`icon_512.png`).
  - Official Feature Graphic banner (`feature_graphic.png`).
  - 6 verified Play Store screenshots (`play_01.png` to `play_06.png`) showing hex battlefields, herd placement overlays, turn banners, and campaign progression.

---

## 3. Excluded Products & Prototypes Audit

### SendSnap (Excluded from Main Showcase)
- **What It Is:** An ultra-fast offline peer-to-peer file transfer application for Android and Windows PC using local Wi-Fi / hotspot at gigabit speeds (up to 100 MB/s).
- **Audit Findings:** 
  - The repository has an impressive README, desktop downloads (`.zip`, `.rar`), and a landing page (`sendsnap_website`).
  - However, querying Google Play Store for `com.the356company.sendsnap` returned **404 Not Found**.
  - **Verdict:** Because it is unreleased on the primary public mobile store, it must NOT appear as a published card in the public showcase. It is documented in the engineering roadmap as a high-priority upcoming ecosystem product.

### Game Jam & Experimental Titles (Excluded)
- **Cyber Clash (Unreal Engine):** Short 2-minute 2-player local co-op game jam entry.
- **Google It (2.5D):** Casual jumping arcade prototype.
- **Nightseeker (Unity 3D):** Prototype Windows horror escape game.
- **Backrooms: Lost Footage:** Experimental prototype marked "In development".
- **Verdict:** Keep the official website razor-focused on the 4 production-grade published applications to project unyielding commercial quality and prestige.
