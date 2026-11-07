# TruthGuard — "The Provenance Edition" Design System

The frontend is a single, continuous edition experience — **The Provenance Edition, Winter ’26** — modelled on a printed technical release: black covers, parchment interior, a deep-violet provenance chapter, engraved line art, and a working adversarial console. Everything on the page is derived from TruthGuard’s real backend contract (`/api/query`, `/api/corpus`, `/api/audit/{hash}`); there is no decorative 3D, no placeholder data, and no stock illustration.

Reference genes: Shopify Editions (Winter ’26) for pacing, torn-paper edges, oversized typography, and release-notes structure. TruthGuard contributes the legal/technical content, the four-agent tribunal, and the Merkle provenance seal.

---

## 1. Color System

Strictly three paper stocks plus one deep-violet chapter. No gradients-as-spectacle, no lime/vermilion.

### Stocks & Inks
- `#000000` — Cover black (hero, footer ground)
- `#F7F7EE` — Parchment (primary paper stock)
- `#292919` — Ink (primary text on parchment)
- `#DCDCD0` — Stone (hairline rules on parchment)
- `#CFCFD5` — Mist (secondary lines on dark)
- `#909083` — Muted (tertiary telemetry)
- `#1C004F` — Dusk deep violet (provenance chapter ground)
- `#7126FF` — Signal violet (CTAs, seals, opposing party)
- `#8051FF` — Violet soft (highlights on deep violet)

### Semantic Signals
- Supported claims, governing position, verified seal: ink / signal violet on paper; parchment on dark.
- Contradiction & failure: `#8F1D14` (oxblood) on paper; agent glyph failure uses the same.
- Status pills are quiet: hairline border, mono label, small dot — never filled urgency badges.

---

## 2. Typography

| Role | Face | Usage |
|------|------|-------|
| Display | **Inter Tight** (400–800, tight tracking) | Headlines, `.display-1`/`.display-2`, numerals |
| Editorial | **Instrument Serif** (italic) | Editorial counter-lines inside headlines (“on *trial*”) |
| Script | **Pinyon Script** | Drop caps, flourishes, release-note initial |
| Telemetry | **JetBrains Mono** | Coordinates, Merkle roots, latencies, tier labels |
| Body | Inter Tight 400/500 | Narrative copy |

Rules: headlines use negative tracking (`-0.04em` to `-0.06em`); full-width headings use `.display-1`, split-column section heads use `.display-2`; mono runs are uppercase with wide tracking; one script accent per section maximum.

---

## 3. Paper, Texture & Line Art

- **Torn edges** (`TornEdge.tsx`): SVG torn-paper divider at section boundaries. Static, not animated.
- **Noise overlay**: fixed CSS grain (sub-pixel opacity) over the whole document; disabled for `prefers-reduced-motion`.
- **Engraving line art** (`DavinciLines.tsx`): the Da Vinci-study star/line drawings used on the cover hero and Provenance chapter. Stroke-drawn SVG, hairline weight, low opacity.
- **Dot grid**: `radial-gradient` dot paper for console panels, case tiles, DAG backdrop, provenance receipt.
- **Crosshair & corner marks**: small `+` corner ticks on framed panels (hero frame, workbench shell) — technical engraving language, not ornament.

## 4. Layout System

- 12-column grid on a fluid shell (`--pad-x: clamp(20px, 4.2vw, 64px)`, max width 1680px).
- Section numbering `01 → 07` rendered as hairline markers (`.section-marker`) — the page is an index, not a brochure.
- **Side rail** (`SideRail.tsx`): fixed minimal numeric index (`01–07`) visible ≥1200px, `mix-blend-mode: difference`, left 8px. It numbers sections; it never labels them in the gutter.
- Hero and Closing use full-bleed black; Premise, Tribunal, Conflict Atlas, Workbench, Authority, Edition Notes are parchment; Provenance is the deep-violet chapter.

## 5. Signature Components

- **Hero** (`Hero.tsx`): black cover; thin framed plate; oversized “One edition.” headline with an Instrument Serif italic line; Davinci star-map study; availability ticker (“Winter ’26”), two pills (“Open workbench”, “Read the notes”).
- **Premise** (`Premise.tsx`): thesis statements plus the capability strip (`4 adversarial agents · 5 authority tiers · 3 resolution modes · 1 Merkle root`).
- **Tribunal** (`Tribunal.tsx`): the four agents as engraved cards — The Archivist (retriever), The Advocate (synthesizer), The Adversary (critic), The Magistrate (resolver) — each with an `AgentGlyph` (stack, lens, scales, seal) and machine specs (`BM25 0.5 + DENSE 0.5`, `NLI ≥ 0.70`, …).
- **Conflict Atlas** (`ConflictAtlas.tsx`): tabbed anatomy of the three conflict classes with evidence passages, resolution rule, and the stamped outcome.
- **Workbench** (`Workbench.tsx`): the live console. Query input, four case files, audit pipeline (Retrieve → Expand → Synthesize → Adversary → Resolve), then the results ledger.
- **Authority** (`Authority.tsx`): bi-temporal precedence across the 5-tier ladder (FAQ 01 → Regulatory mandate 05) with the live `AuthorityDag.tsx` graph.
- **Provenance** (`Provenance.tsx`): deep-violet chapter; `MerkleDiagram.tsx`; byte-span inclusion proof walkthrough; audit-endpoint link (`/api/audit/{root}`).
- **Edition Notes** (`EditionNotes.tsx`): release notes with script initials and mono marginalia.
- **Closing CTA** (`ClosingCta.tsx`) + **Footer** (`Footer.tsx`): back cover; colophon, edition metadata, audit endpoint.
- **Results** (`results/Results.tsx`): position cards (Governing / Stale / Unresolved), claim audit ledger (supported / stripped, with entailment reason and supporting passage IDs), contradiction ledger, agent trace, Merkle receipt (copyable root, leaf hashes, `/api/audit/` link), corpus hygiene PRs, counterfactual probes, abstention panel.

## 6. Motion

- **Lenis** smooth scroll; **GSAP + ScrollTrigger** for scroll-linked reveals.
- `Reveal.tsx`: viewport-observed opacity/translate reveals and `MaskLine` (headline lines rise behind a mask).
- `useInView.ts` hook; `lib/scroll.ts` centralizes `scrollToId` with Lenis-aware easing.
- Pipeline steps in the Workbench advance on a timer while the audit runs (620 ms/step, visual only).
- All motion respects `prefers-reduced-motion: reduce`.

## 7. Anti-patterns (removed, do not reintroduce)

- Three.js / WebGL prisms, orbiting blades, gimbals, “spectrograph” concepts.
- Lime `#D2FF28` / vermilion `#FF331F` / `Syne` / `Space Grotesk` / `Newsreader`.
- Flat “Git-Diff” enterprise slate-900 console.
- Emoji section markers, filled status badges, rounded slop (`rounded-2xl/3xl`), drop shadows as depth.
- Fake counters, fake terminals, static screenshots of anything the API can actually return.

## 8. Verification Loop

1. `npx tsc --noEmit` (or the project typecheck command) — types must stay green.
2. `npm run build` — Vite production build must succeed.
3. Dev server on `http://localhost:5173`; `/api` proxied to `http://127.0.0.1:8000` (FastAPI). When the backend is offline, the UI exercises deterministic local fallbacks (`data/fallback.ts`) for all four case files.
4. Visual check via Chrome DevTools screenshots: every section, every case file, abstention path, mobile 390px, tablet 1024px, desktop 1440px.
