# TruthGuard Master Design System & Architectural Specification

Synthesizing atomic design genes from 100+ Awwwards Sites of the Month (*Lusion, Audemars Piguet RD#5 Lab, Terminal Industries, Shopify Renaissance Edition, Locomotive, Unseen Studio*).

---

## 1. Color System (Strict OKLCH Grounded Palette)

### Canvases & Surfaces
- `--bg-void`: `#060608` (Obsidian Forensic Void — Acts I & II)
- `--bg-instrument`: `#0D0D11` (Machined Console Chassis)
- `--bg-parchment`: `#F4F1EA` (Warm Archival Parchment — Act III DAG)
- `--bg-panel-dark`: `rgba(13, 13, 17, 0.92)`
- `--bg-panel-light`: `rgba(244, 241, 234, 0.94)`

### Typography Inks
- `--ink-bone`: `#F4F1EA` (Primary text on dark surfaces)
- `--ink-carbon`: `#111110` (Primary text on parchment surfaces)
- `--ink-ash`: `#8E8E96` (Secondary metadata on dark surfaces)
- `--ink-lead`: `#5C5B56` (Secondary metadata on parchment surfaces)
- `--ink-zinc`: `#52525B` (Tertiary telemetry coordinates)

### Signal Chromas (Zero Generic Blues/Purples)
- `--signal-lime`: `#D2FF28` (Governing Tier 1 / Entailment Truth / Merkle Seal)
- `--signal-lime-dim`: `rgba(210, 255, 40, 0.15)`
- `--signal-vermilion`: `#FF331F` (Deontic Conflict / UNSAT / Abstention Gate / Silent Revocation)
- `--signal-vermilion-dim`: `rgba(255, 51, 31, 0.15)`

---

## 2. Typography Triad

1. **Monumental Display**: `Syne` (Weights: 700, 800)
   - Used for monumental section coordinates, numbers (e.g., `01`, `02`, `03`, `04`), and high-impact hero headings.
   - Tracking: `-0.04em` to `-0.02em`.
2. **Editorial Verbatim**: `Newsreader` (Weights: 400 italic, 500, 600)
   - Used for verbatim policy quotes, legal clauses, statutory language, and philosophical citations.
   - Evokes archival legal gazettes and forensic documentation.
3. **Telemetry & Monospace**: `JetBrains Mono` (Weights: 400, 500, 600)
   - Used for technical labels, Merkle hashes, NLI confidence figures, latency stats, and coordinate axes.
   - Enforced: `font-variant-numeric: tabular-nums slashed-zero`.
4. **Interface Body**: `Space Grotesk` (Weights: 400, 500)
   - Used for analytical narrative copy, descriptions, and user interface labels.

---

## 3. Swiss Architectural Grid & Hairline Primitives

- **Grid System**: 48px baseline hairline coordinate grid (`rgba(244, 241, 234, 0.03)`).
- **Hairline Borders**: `1px solid rgba(244, 241, 234, 0.11)` on dark surfaces; `1px solid rgba(17, 17, 16, 0.12)` on parchment.
- **Tactile Crosshairs (`.crosshair-corner`)**:
  - `+` glyphs placed at corners with `pointer-events-none`.
  - Color: `rgba(244, 241, 234, 0.35)` or `rgba(17, 17, 16, 0.35)`.
- **Zero Rounded Slop**:
  - Strictly `rounded-none`. No `rounded-2xl` or `rounded-3xl` bubble cards.
  - Razor-sharp corners with architectural bevels or crosshairs.

---

## 4. 3D Horological Spectrograph & WebGL Pipeline

- **WebGL Engine**: Three.js r187 with `ACESFilmicToneMapping` and `SRGBColorSpace`.
- **Lighting**: Key Directional Light (`2.0`), Signal Point Light (`#D2FF28`, intensity `2.2`), Conflict Point Light (`#FF331F`, dynamic intensity up to `14.0`).
- **PMREM Environment**: `RoomEnvironment` procedural studio HDRI for physical glass transmission and metal roughness reflections.
- **Nucleus**: Domain-warped fBm displacement shader reacting to scroll and deontic conflict.
- **Refractive Housing**: Faceted `OctahedronGeometry` transmission glass (`ior: 1.68`, `transmission: 0.96`, `roughness: 0.06`).
- **Mechanical Gimbals**: 3 counter-rotating titanium tori (`metalness: 0.92`, `roughness: 0.22`) with 120 instanced vernier scale ticks.
- **5 Evidence Blades**: High-DPI canvas textures with Swiss typography + 3D Bezier fiber-optic conduit curves.
- **Post-Processing Pass**:
  - `RenderPass`
  - `UnrealBloomPass` (`radius: 0.30`, `strength: 0.38`, `threshold: 0.84`)
  - `CinemaLensShader` (Radial chromatic dispersion, 35mm subtle film grain, optical vignette).

---

## 5. 4-Act Chameleon Polarity Narrative

- **Act I — Epistemic Grounding**: `#060608` Void. Monumental title depth sandwich, 3D Spectrograph floating on right hemisphere.
- **Act II — Deontic Contradiction Isolation**: Pinned 280vh stage. Camera dolly-in (`z: 8.4 -> 6.4`). Blades lock head-to-head. Deontic UNSAT flare (`#FF331F`).
- **Act III — Bi-Temporal DAG Precedence**: Chameleon shift to `#F4F1EA` Warm Parchment via WebGL Noise-Burn Curtain. Editorial layout, high-contrast dark carbon ink, 5-tier authority hierarchy.
- **Act IV — Cryptographic Grounding & Workbench**: Pinned return to Anodized Carbon `#09090B`. Merkle seal digest animation and transition into the interactive forensic console.

