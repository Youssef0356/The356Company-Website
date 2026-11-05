# AGENTS.md — Permanent Guidelines for AI Coding Agents

> **Project:** The356Company Official Website  
> **Workspace:** `c:\Users\nejiy\Documents\Development\The356Company Website`  
> **Role Context:** You are pair-programming as a Creative Director, Senior Frontend Architect, 3D Web Experience Designer, and Technical Planner.

---

## 1. Project Overview & Prime Directives

The356Company is an independent software and game development studio. Its official website is not an ordinary corporate portfolio, SaaS landing page, or boilerplate application directory. It is an **interactive digital exhibition and sensory product showcase** celebrating technical craft, indie gaming innovation, and the studio's long-term vision of an interconnected product ecosystem.

### Core Rules for Every Agent:
1. **Never Implement Code Before Reading Documentation:**
   - Every agent must first read `AGENTS.md` and `Docs/CHECKPOINT.md`.
   - Never begin generating arbitrary React components or 3D scenes without checking the current roadmap milestone in `Docs/11_IMPLEMENTATION_ROADMAP.md`.
2. **Strict Product Showcase Eligibility:**
   - **Only officially published applications and games** belong on the public website showcase.
   - The 4 confirmed published products are:
     1. **Pagelit** (`com.the356company.pagelit`) — Android PDF Reader & Viewer
     2. **AR Explorer** (`com.the356company.arexplorer`) — Augmented Reality educational/model explorer
     3. **The System** (`com.the356company.the_system`) — Social deduction bluffing card game
     4. **Battle Cows** (`com.the356company.battlecows`) — Hex-based strategy board game
   - **SendSnap is unreleased** (`com.the356company.sendsnap` is not live on Google Play). Do NOT showcase SendSnap as a published product.
   - Do NOT include internal experiments, game jam prototypes (`nightseeker`, `cyber-clash`, `google-it`), or unfinished client work in the flagship showcase.
3. **Strict Brand Integrity:**
   - Official Palette: Primary Deep Purple (`#2C115F`), Secondary Light Purple (`#DCB0FF`), Crisp White (`#FFFFFF`).
   - Deep background dark surfaces: `#090414` / `#0D061A`.
   - The official company logo already exists and must **never** be redesigned, regenerated, or distorted.
   - Each product section must celebrate its own distinct visual identity and color signature while harmonizing with the overarching studio brand.
4. **Autonomous Context Continuity:**
   - This project spans multiple AI agents and sessions. Conversation histories may be wiped or truncated.
   - **Always update `Docs/CHECKPOINT.md`** at the conclusion of any major phase, task, or milestone.
   - Maintain documentation integrity: do not delete existing documentation unless superseded, and document all design decisions in `Docs/12_DECISION_LOG.md`.

---

## 2. Technical Stack & Architecture Standards

- **Runtime & Build:** Vite 6 + React 19 + TypeScript (Strict mode).
- **Styling:** Tailwind CSS v4 + Custom 3D CSS utilities.
- **3D & WebGL:** Three.js + React Three Fiber (`@react-three/fiber`) + `@react-three/drei` + `@react-three/postprocessing`.
- **Motion & Scroll:** GSAP 3.12 (`gsap`, `ScrollTrigger`) + Lenis smooth scrolling.
- **Design Metaphor:** Spatial Depth, Weightlessness ("Antigravity"), Glassmorphism (`backdrop-filter: blur(12px)`), Layered Z-axis cards, and bespoke cursor micro-interactions (inspired by `aliadeel.com`).
- **Performance Budget:** 60fps on modern desktop & mobile, < 2.5s LCP, lazy-loaded Three.js canvases, responsive DPR scaling `[1, 2]`, and full `prefers-reduced-motion` fallbacks.

---

## 3. Directory Navigation Map

```
The356Company Website/
├── .agents/skills/            # Project-specific AI skills (antigravity, gsap, r3f, web-design)
├── AGENTS.md                  # Permanent instructions for all AI agents (this file)
├── Docs/                      # Comprehensive Master Blueprint
│   ├── 01_PROJECT_VISION.md           # Studio ethos, ecosystem philosophy & visitor journey
│   ├── 02_BRAND_IDENTITY.md          # Official palette, logo rules & typography
│   ├── 03_DESIGN_SYSTEM.md           # Tokens, glassmorphism, buttons, cards & cursor
│   ├── 04_PRODUCT_RESEARCH.md        # Verified facts, APK listings & mechanics of 4 apps
│   ├── 05_ASSET_INVENTORY.md         # Play Store screenshots, icons, 3D models & audit
│   ├── 06_CREATIVE_DIRECTION.md      # Art direction, thematic worlds & experiential goals
│   ├── 07_SCROLL_STORYBOARD.md       # Scene-by-scene scrub choreography & transitions
│   ├── 08_TECHNICAL_ARCHITECTURE.md  # Component hierarchy, canvas management & state
│   ├── 09_3D_AND_ANIMATION.md        # Shaders, lighting, materials, rigging & GSAP triggers
│   ├── 10_PERFORMANCE.md             # Optimization, mobile fallbacks, a11y & budgets
│   ├── 11_IMPLEMENTATION_ROADMAP.md  # Step-by-step milestones & acceptance criteria
│   ├── 12_DECISION_LOG.md            # Architectural & creative decisions rationale
│   ├── CHECKPOINT.md                 # Live status, completed work & instructions for next agent
│   └── Brand and graphic charter.md  # Original brand charter reference
└── research/play/             # Real extracted Google Play assets for the 4 products
    ├── ar-explorer/           # Icon, listing, and 7 high-res Play Store screenshots
    ├── battle-cows/           # Icon, feature graphic, listing, and 6 Play Store screenshots
    ├── pagelit/               # Icon, site, listing, and 6 Play Store screenshots
    └── the-system/            # Icon, listing, and 8 Play Store screenshots
```

---

## 4. Handover & Agent Workflow Checklist

When you are activated to continue work:
1. Read `Docs/CHECKPOINT.md` to identify the active milestone.
2. Verify all references, packages, and assets against `Docs/05_ASSET_INVENTORY.md` and `Docs/08_TECHNICAL_ARCHITECTURE.md`.
3. Adhere strictly to the performance and accessibility constraints outlined in `Docs/10_PERFORMANCE.md`.
4. Run tests or build checks when code changes are made.
5. Update `Docs/CHECKPOINT.md` with:
   - What you accomplished.
   - Any technical risks or questions identified.
   - Exactly what the next agent should execute.
