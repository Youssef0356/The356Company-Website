# 02 — BRAND IDENTITY & GRAPHIC RULES

> **Document Status:** Verified & Approved  
> **Source Charter:** `Docs/Brand and graphic charter.md`  
> **Applies to:** Global Website Shell, Navigation, Overlays, and Product Framing

---

## 1. Official Studio Color System

The356Company's visual foundation is anchored in a signature celestial purple spectrum, balanced by deep space darks and high-contrast clinical neutrals.

### Primary Color Tokens

| Token Name | Hex Code | RGB | Role & Application |
| :--- | :--- | :--- | :--- |
| **Deep Purple** *(Brand Primary)* | `#2C115F` | `rgb(44, 17, 95)` | Foundational brand presence, major CTA surfaces, prominent headers, dark glass tinting. |
| **Light Purple** *(Brand Secondary)*| `#DCB0FF` | `rgb(220, 176, 255)`| Luminous interactive highlights, neon glows, cursor trails, secondary tags, bloom shaders. |
| **Pure White** *(Brand Neutral)* | `#FFFFFF` | `rgb(255, 255, 255)`| Crisp foreground typography, high-contrast badges, light card surfaces, reflective highlights. |

### Derived Deep Space & Contrast Gradients

To support high-end 3D WebGL scenes, glassmorphism, and cinematic mood, the following extended tokens are officially approved:

```css
:root {
  /* Core Brand Tokens */
  --color-brand-primary: #2C115F;
  --color-brand-secondary: #DCB0FF;
  --color-brand-white: #FFFFFF;

  /* Deep Space Background Spectrum */
  --color-bg-abyss: #07030F;        /* Deepest void behind WebGL canvases */
  --color-bg-surface: #0E071F;      /* Base container and sheet background */
  --color-bg-surface-elevated: #180D33; /* Floating glass cards and dropdowns */

  /* Translucent Glass Strokes & Fills */
  --glass-fill: rgba(44, 17, 95, 0.25);
  --glass-border: rgba(220, 176, 255, 0.18);
  --glass-border-hover: rgba(220, 176, 255, 0.45);
  --glass-glow: rgba(220, 176, 255, 0.15);

  /* Typography Contrast */
  --text-primary: #FFFFFF;
  --text-secondary: rgba(255, 255, 255, 0.72);
  --text-muted: rgba(220, 176, 255, 0.55);
}
```

---

## 2. Logo Rules & Constraints

The official company logo exists and is supplied as an immutable brand asset.

```
                  ┌───────────────────────────────┐
                  │      THE 356 COMPANY LOGO     │
                  │   [Immutable Project Asset]   │
                  └───────────────┬───────────────┘
                                  │
         ┌────────────────────────┴────────────────────────┐
         ▼                                                 ▼
   [PERMITTED USAGE]                               [STRICT PROHIBITIONS]
   • Vector SVG or high-res PNG                     ❌ Never redesign, recreate, or trace
   • Lock proportions exactly (1:1 aspect)         ❌ Never stretch or skew
   • Position in navbar and legal footer           ❌ Never substitute with random AI symbols
   • Dual rendering: White on dark / Deep on light ❌ Never apply unchartered color gradients
```

- **Variant Selection:** Use the all-white vector silhouette on dark WebGL and deep space sections. Use the Deep Purple `#2C115F` version when placed against crisp light surfaces.
- **Clearance Zone:** Maintain a minimum margin of `1.5x` the logo's height on all sides. No text or overlapping decorative elements may encroach on this zone.

---

## 3. Typography Hierarchy

The brand demands a contemporary, geometric, and high-performance typographic identity that bridges technical software engineering with indie gaming imagination.

### Primary Font Families
- **Display Headings:** `Plus Jakarta Sans` or `Space Grotesk` (Geometric, wide proportion, futuristic yet human).
- **Body & Interface Text:** `Inter` (Standard industry gold standard for legibility at small sizes, tabular numbers, and UI controls).
- **Code & Technical Specs:** `JetBrains Mono` (Used for version tags, coordinates, file sizes, and package IDs).

### Typographic Scale & Hierarchy

| Level | Size (Desktop) | Size (Mobile) | Weight | Line Height | Tracking | Purpose |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 01** | `5.0rem` (80px) | `2.75rem` (44px) | Bold (700/800) | `1.05` | `-0.03em` | Hero titles & scene overtures |
| **Heading 02** | `3.25rem` (52px) | `2.0rem` (32px)  | SemiBold (600) | `1.15` | `-0.02em` | Product showcase names |
| **Heading 03** | `1.75rem` (28px) | `1.35rem` (22px) | Medium (500)   | `1.25` | `-0.01em` | Section anchors & feature titles |
| **Body Large** | `1.125rem` (18px)| `1.0rem` (16px)  | Regular (400)  | `1.6`  | `normal`  | Lead introductory paragraphs |
| **Body Small** | `0.875rem` (14px)| `0.8125rem` (13px)| Regular (400) | `1.5`  | `normal`  | Captions, specs, descriptions |
| **Overline/Badge**| `0.75rem` (12px)| `0.6875rem` (11px)| Bold (700)   | `1.0`  | `+0.08em` | Package badges, statuses, tags |

---

## 4. Multi-Product Color Coexistence Rule

One of the most critical design principles of The356Company is **product individuality within studio harmony**:

> **Rule:** *Do not force every product into the company's purple palette.*  
> Every published application and game possesses its own artistic identity, lore, and visual language. The studio's purple palette acts as the cosmic stage and framing shell (navbar, footer, transitions, background ambience), while each product introduces its own distinct signature color accent:

- **Pagelit:** Studio Cyan & Crisp White (`#00E5FF`, `#F0FDF4`) — Represents clarity, document pagination, crisp daylight text, and reading comfort.
- **AR Explorer:** Electric Cobalt & Spatial Neon (`#2563EB`, `#60A5FA`) — Represents computer vision, laser scanning grids, and augmented depth.
- **The System:** Noir Gold & Amber Crimson (`#F59E0B`, `#DC2626`) — Evokes dimly lit poker rooms, political intrigue, assassin seals, and mystery.
- **Battle Cows:** Meadow Green & Warm Earth Honey (`#10B981`, `#FBBF24`) — Captures tactile pastures, cartoon hex grids, and playful barnyard strategy.

When a visitor scrolls into a product's showcase section, the ambient lighting of the 3D scene smoothly crossfades to embrace the product's signature color, while remaining anchored to the studio's deep space purple background.
