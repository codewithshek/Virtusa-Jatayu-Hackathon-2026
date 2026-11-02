# PRD.md — TruthGuard Product Requirements Document

## 1. Problem Statement & Business Context
Enterprise knowledge bases in Telecom, Media, Banking, and Healthcare accumulate thousands of policy documents, SLA contracts, amendments, and FAQs over time. Standard RAG systems treat all retrieved text chunks as equally true, blending outdated v1 policies with active v2 amendments or hallucinating unsupported bridges.

## 2. Target Users
1. **Enterprise Policy & Compliance Analysts**: Need answers grounded in active regulations with full auditability of superseded clauses.
2. **Field & Customer Operations Engineers (FDEs)**: Need instant clarity on whether an FAQ contradicts an official SLA amendment.
3. **Knowledge Base Administrators**: Need automated detection of deadlocked contradictions in company documentation.

## 3. Functional Requirements (Mapped to Virtusa Use Case 2)
- **FR-1 (Inconsistent Corpus Ingestion)**: Parse Markdown/PDF documents and extract frontmatter/inline metadata (`doc_id`, `version`, `effective_date`, `authority_tier`, `supersedes`, `jurisdiction`).
- **FR-2 (Hybrid Retrieval + Lineage Expansion)**: Retrieve top-$K$ chunks via Reciprocal Rank Fusion (BM25 + Dense Vector). If chunk $A$ is retrieved and the Authority DAG shows document $B$ amends or supersedes $A$, automatically pull the relevant chunk from $B$.
- **FR-3 (Atomic Claim Synthesis)**: Generate a draft answer where every sentence is emitted as a structured `AtomicClaim(claim_id, text, cited_doc_ids, cited_quotes)`.
- **FR-4 (3-Vector Adversarial Critique)**:
  - **Vector 1 (Contradiction)**: Compute pairwise contradiction scores across all retrieved passages addressing the same entity/predicate.
  - **Vector 2 (Staleness)**: Flag any claim relying on a document marked `SUPERSEDED` or older than a conflicting higher-tier document.
  - **Vector 3 (Hallucination / Unbacked)**: Flag any claim where claim-to-passage entailment < `0.75` or where the quote span does not exist in the source chunk.
- **FR-5 (Transparent Resolution & Abstention)**: Output a structured `ResolutionVerdict` containing the final transparent response, conflict cards, authority reasoning, and a SHA-256 provenance hash.

## 4. Built-in Demo Scenarios (Must Pass 100% in Live Demo)
1. **Scenario 1 — Supersession by Amendment**: *Query: "How many days per week can employees work remotely?"*
   - `POL-2023-v1`: Allows 4 days/week remote.
   - `FAQ-2023-HR`: Repeats 4 days/week remote.
   - `AMD-2025-03`: March 2025 Amendment restricts remote work to 2 days/week (3 days for Field Engineers) and supersedes `POL-2023-v1`.
   - *Expected Output*: Detects contradiction across the 3 docs, flags `POL-2023-v1` and `FAQ-2023-HR` as stale, and surfaces both positions while ruling in favor of `AMD-2025-03`.

2. **Scenario 2 — Unresolvable Conflict (Explicit Abstention)**: *Query: "What is the mandatory cold-storage retention window for telemetry logs?"*
   - `SEC-2024-A` (Security Policy v2, dated 2024-06-01): Mandates 90-day deletion.
   - `SEC-2024-B` (Compliance Policy v2, dated 2024-06-01): Mandates 365-day retention.
   - *Expected Output*: Critic detects direct contradiction with tied date (`2024-06-01`) and equal authority tier (`Policy v2`). Resolver triggers `UNRESOLVABLE_CONFLICT_ABSTAIN`, refuses to guess, and displays both side-by-side.

3. **Scenario 3 — Unsupported Claim Stripping**: Synthesizer attempts to extrapolate a numeric penalty not present in any retrieved passage; Critic flags and strips the unbacked claim before resolution.