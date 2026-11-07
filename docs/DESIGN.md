# DESIGN.md — Frontend Architecture & UI Contract

Technical companion to `/DESIGN.md` (the visual system). This document describes how the Provenance Edition is wired, not how it looks.

## Stack

- Vite + React 19 + TypeScript, Tailwind CSS, GSAP + ScrollTrigger, Lenis.
- No WebGL. Graphics are SVG line art and CSS textures.

## Page Composition (`src/App.tsx`)

`Nav` · `SideRail` (fixed numeric index ≥1200px) · `<main>` containing `Hero` → torn edge → `Premise` → `Tribunal` → `ConflictAtlas` → `Workbench` → `Authority` → `Provenance` → `EditionNotes` → `ClosingCta`, then `Footer`. Torn-paper edges are section wrappers in `App.tsx`; sections are theme classes (`theme-light` / `theme-dark` / `theme-violet` / `theme-deep`).

The Workbench owns the query lifecycle: `handleQuery` in `App.tsx` POSTs to `/api/query`, normalizes with `normalizeResponse`, and falls back to `FALLBACK_RESPONSES` / `genericFallback` when the API is unreachable. A `pendingScroll` ref scrolls to `#results` after the response lands; `useInView` tracks the active section driving `Nav`/`SideRail`.

## Data Contracts

`src/types/index.ts` mirrors `backend/app/schemas/models.py`:

- `TruthGuardResponse` — `status` (`CONSISTENT` | `RESOLVED_CONFLICT` | `UNRESOLVABLE_ABSTAIN`), `final_answer`, `positions_surfaced[]`, `contradictions_detected[]`, `claim_audits[]`, `retrieved_passages[]`, `provenance_sha256`, `merkle_provenance` (`merkle_root`, `leaf_hashes`, `leaf_count`, `inclusion_proofs`), `corpus_hygiene`, `counterfactual_probes`, `trace[]`, `latency_ms`.
- Authority tiers (numeric, displayed bottom-up 01→05): FAQ/guidance = 1, Memo/addendum = 2, Formal policy = 3, Amendment = 4, Regulatory mandate = 5.
- `/api/corpus` returns `{ nodes, edges }` (and/or `{ documents, relationships }`); `normalizeDag` in `App.tsx` prefers the former.

Deterministic tier orderings, labels, and enums live in `src/lib/labels.ts` (`tierLabel`, `tierNumber`, `statusMeta`, `splitSentences`, `shortHash`). Case files live in `src/data/scenarios.ts`; offline fixtures in `src/data/fallback.ts`; editorial content (nav, agents, tiers, release notes, stats) in `src/data/edition.ts`.

## Results Rendering (`src/components/results/Results.tsx`)

- **Verdict card** (disposition, latency, positions/conflicts/evidence counts, sealed hash).
- **Abstain panel** when `status === UNRESOLVABLE_ABSTAIN`; reason is sourced from audits' `failure_reason`.
- **Positions**: governing / stale / unresolved stamps, tier, effective date, resolution rule.
- **Claim audit**: supported audits map to sentences only when `supportedCount === sentenceCount` (sentences split with a section-number/abbreviation-aware splitter in `lib/labels.ts`); unsupported audits show "Stripped before publication…" with the entailment failure reason. Never guesses a 1:1 mapping.
- **Trace** (dark card), **Contradiction ledger**, **Merkle receipt** (copy root; `/api/audit/{root}` link), **Corpus hygiene** (infected docs + unified-diff patch), **Counterfactual probes**.

## Hard Invariants for Contributors

1. No Three.js/WebGL reintroduction; effects are SVG/CSS.
2. No fabricated metrics — everything in the UI must trace to the API contract or the seeded corpus; evaluation stats come from the backend scorecard (F1 1.000, 19/19) and are labelled as such.
3. Offline fallbacks must remain deterministic and semantically aligned with the backend (same statuses, same tiers).
4. `prefers-reduced-motion` is respected everywhere motion is added.
5. Keep the side rail numeric-only; prose belongs inside sections.
