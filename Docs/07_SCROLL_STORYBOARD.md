# 07 — SCROLL STORYBOARD: SIGNAL ATLAS

> **Status:** Approved conceptual storyboard; feature details remain gated by product verification.  
> **Format:** Long-form native-scroll exhibition with optional scroll-linked motion.

## 1. Narrative structure

The visitor enters the studio's field, encounters four independent product worlds, then sees those worlds together as a future-facing constellation. A fine signal motif carries continuity, changing its material in every section. Product scenes do not share a repeated layout or animation template.

Navigation provides direct links to each scene and a reduced-motion route. Scroll is the primary storytelling path, not a trap: content remains in normal document flow and can be read without a pinned viewport.

## 2. Scene outline

### Prologue — The field (0–12%)

- **Visitor sees:** Deep studio-purple space; the immutable company logo; four forms/signals beginning to appear at different depths; expressive but concise studio introduction.
- **Behavior:** The signal draws into view; the four marks arrive with separate timing; the inner orbit turns with scroll. Each mark links directly to its product section.
- **Transition:** One signal leads toward the first product world. A direct “Explore products” navigation remains available.
- **Content gate:** Do not obscure the company identity behind abstract 3D or use a standard centered two-button hero layout.

### AR Explorer — Spatial instrument (12–32%)

- **Visitor sees:** A real AR interface or verified capture framed by a spatial plane and relevant 3D object.
- **Behavior:** The phone composition rises and rotates as the scan line crosses the scene. Previous/next controls cycle through authentic published screenshots. Scroll reveals verified surface-detection, anchoring, and inspection descriptions.
- **Transition:** A scan trace narrows into a document annotation.
- **Content gate:** Verify exact sequence and claims against the current app. Label any web-created visualization as a web interpretation.

### Pagelit — Reading architecture (32–52%)

- **Visitor sees:** A calm editorial composition built around a current screenshot/page, typography, and one annotation detail.
- **Behavior:** The screenshot spread opens like a page with a live annotation stroke. Previous/next controls cycle current product screenshots.
- **Transition:** The annotation becomes a redaction/clue edge for The System.
- **Content gate:** Confirm supported formats, themes, offline/privacy statements, and all numeric performance claims. Avoid faux telemetry.

### The System — Table of decisions (52–72%)

- **Visitor sees:** Authentic role cards on a dark tabletop with a clear, short explanation of the actual bluffing mechanic.
- **Behavior:** The featured role artwork rises into a tabletop spotlight; selecting one of the role names replaces the art with a short reveal transition.
- **Transition:** A card's hexagonal/graphic detail becomes a Battle Cows tile.
- **Content gate:** Verify current roles and rules; distinguish a demonstration from actual app gameplay.

### Battle Cows — Tactical pasture (72–90%)

- **Visitor sees:** Real game artwork or a verified board state with distinct pasture shapes and cow sprites.
- **Behavior:** The screenshot board arrives with a tilted isometric movement as a hex field drifts behind it. Previous/next controls show published product screens; no simulated match state is shown.
- **Transition:** Pull back from the board; one tile remains as a node in the closing constellation.
- **Content gate:** Verify rules, modes, special tiles, and all player-state claims. Do not show fixed percentages as live territory data.

### Coda — One constellation (90–100%)

- **Visitor sees:** Four separate product identities gathered into one studio composition, with their independent status visible.
- **Behavior:** Scroll draws the connecting trace; product links reveal as a staggered set of destinations. The connecting trace is explicitly future-facing.
- **Transition:** Settle into studio links, contact, and legal details.
- **Content gate:** State clearly that products work independently today and connected experiences are a long-term ambition.

## 3. Motion and fallback rules

- Scroll-linked animation should move only the relevant scene elements; text remains readable and available in the DOM.
- Avoid long pinned sequences as the only presentation. Native scroll, anchor links, browser history, and section landmarks must work.
- Under `prefers-reduced-motion`, use still compositions and immediate state changes. Preserve every fact, link, and interactive control.
- Touch users receive tap controls; pointer-only hover effects are never required.
- WebGL failure falls back to current screenshots or poster art with no blank section.
- No autoplay audio. Any future audio must be explicitly user initiated and expose accessible controls.

## 4. Timing guidance

The percentages above are narrative order, not a mandate for fixed scroll proportions or a six-hundred-viewport pinned timeline. Tune section lengths to content and mobile usability. Each product should have one primary motion beat, one useful interaction at most, and a settled reading state.
