# TruthGuard Domain Glossary & Epistemic Lexicon

This document formalizes the ubiquitous domain vocabulary for the TruthGuard Epistemic Forensic Engine and its frontend, *The Provenance Edition* — an editorial, adversarially-verified console for document Q&A.

---

### Core Epistemic & Forensic Concepts

#### 1. The Provenance Edition
The frontend's design language: a Winter ’26 technical release rendered as a printed edition — black cover, parchment interior, a deep-violet provenance chapter, engraved SVG line art (`DavinciLines.tsx`), and a working adversarial console. It replaces any imitation of decorative 3D hero animations; every visual is either typography, line art, or a live response from the backend contract (`/api/query`, `/api/corpus`, `/api/audit/{hash}`).

#### 2. The Tribunal (Four Agents)
The adversarial pipeline rendered as four engraved agent cards with seal glyphs (`AgentGlyph.tsx`): **The Archivist** (retriever — BM25 + dense vectors + DAG lineage expansion), **The Advocate** (synthesizer — atomic claims bound to verbatim spans), **The Adversary** (critic — NLI contradiction, staleness, and entailment probes), and **The Magistrate** (resolution — five-tier precedence or refusal).

#### 3. Deontic Clash State
The state of diametric policy contradiction between two or more document clauses evaluated as bounded deontic intervals (e.g., $[0, 1] \cap [4, 5] = \emptyset$). When detected by the cross-document probe, the conflict ledger records the pair with an NLI label and confidence, and the verdict transports both positions to the reader — resolved by precedence where possible, refused where tied.

#### 4. Authority DAG (Directed Acyclic Graph)
The deterministic 5-tier precedence hierarchy that resolves cross-document conflicts, modeled as a directed acyclic graph of effective dates, versions, and supersedes edges:
- **Tier 05 — Regulatory Mandate**: External law, regulation, or binding standard.
- **Tier 04 — Amendment**: An explicit, dated change to a policy.
- **Tier 03 — Formal Policy**: The standing operating rule for the organization.
- **Tier 02 — Memo / Addendum**: A domain-specific exception or interpretation.
- **Tier 01 — FAQ / Guidance**: Non-binding reference material; never silently treated as binding.

#### 5. Silent Revocation
A condition where a higher-tier mandate implicitly or explicitly revokes an older lower-tier guideline without an explicit version supersession pointer (e.g., a mandatory FIDO2 hardware token rule silently revoking legacy SMS 2FA permissions). TruthGuard surfaces the stale clause as `Stale`, counts the infected documents, and can generate a unified-diff redline patch for the corpus.

#### 6. Autonomous Abstention Gate
An epistemic safety guarantee: when two diametrically conflicting claims possess identical effective dates and equal authority tiers (e.g., Tier 2 vs Tier 2), TruthGuard refuses to hallucinate a synthetic compromise or probabilistic average. Synthesis is deterministically halted and an abstention verdict is returned with both positions surfaced and full provenance.

#### 7. Merkle Provenance Receipt
The cryptographic digest chain generated across every cited atomic claim. Each verified claim becomes a SHA-256 leaf; the Merkle root seals the answer, and inclusion proofs for each leaf travel in the response (`merkle_provenance`) and are re-verifiable via `/api/audit/{root}`.

#### 8. Edition Scroll Theatre
The single-page scroll architecture of *The Provenance Edition*: Cover (Hero) → Premise → Tribunal → Conflict Atlas → Workbench → Authority → Provenance (deep violet) → Edition Notes → Back Cover (Closing CTA). Section dividers are torn-paper edges (`TornEdge.tsx`); section markers are the hairline `01–07` index; a numeric side rail (`SideRail.tsx`) tracks reading position at ≥1200px.

#### 9. Torn Edge
A static SVG torn-paper divider used at chapter boundaries. It is texture, not animation — the edition reads like a bound release, with ragged interior pages rather than abrupt full-stop cuts.

#### 10. Dot-Grid Dossier
The engraved working surface shared by the console panels, case tiles, DAG backdrop, and Merkle receipt: a `radial-gradient` dot paper with hairline rules, sharp corners, and occasional `+` corner ticks. It marks "working document" surfaces as distinct from the cover (black) and the provenance chapter (deep violet).
