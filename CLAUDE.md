# CLAUDE.md — TruthGuard Engineering & Architectural Rules

## Project Mission
You are building **TruthGuard — Adversarial Verification for Multi-Agent Document Q&A** for Virtusa Jatayu Season 6 (Use Case 2, TIME Business Unit).
TruthGuard answers questions over a deliberately inconsistent document corpus (conflicting versions, outdated policies, contradicting FAQs, superseded amendments).

## Non-Negotiable Use Case Invariants
1. **Never Silently Blend Conflicts**: When retrieved passages disagree, the system MUST NEVER produce a smoothed-over compromise answer or silently pick one side without explanation.
2. **Mandatory 4-Step Pipeline**:
   - `RetrieverAgent`: Hybrid retrieval (dense embeddings + BM25 keyword search) plus metadata extraction (`doc_id`, `title`, `version`, `effective_date`, `doc_type`, `supersedes`).
   - `SynthesizerAgent`: Drafts a structured candidate answer decomposed into atomic `Claim` objects, each linked to explicit `source_doc_id` and `verbatim_quote` spans.
   - `CriticAgent` (Adversary): Actively attempts to break the Synthesizer's draft across three mandatory vectors:
     1. **Direct Contradiction Check**: Pairwise NLI comparison across retrieved passages (`ENTAILMENT`, `NEUTRAL`, `CONTRADICTION`).
     2. **Staleness & Supersession Check**: Queries the Bi-Temporal Authority DAG (`authority_dag.py`) to detect if a cited passage is superseded by a newer version or higher-authority amendment.
     3. **Unsupported Claim Check**: Flags any atomic claim in the Synthesizer's draft that is not strictly entailed by at least one retrieved passage.
   - `ResolutionEngine`: Executes deterministic conflict resolution based on the Critic's audit:
     - **Mode A (`RESOLVED_BY_AUTHORITY_OR_RECENCY`)**: Surfaces both conflicting positions with full provenance AND explains which one governs and why (e.g., *"Policy v1 (2023) states X; however, Amendment March 2025 states Y and explicitly supersedes Policy v1"*).
     - **Mode B (`CONDITIONAL_SCOPE_SPLIT`)**: Surfaces both positions when each applies to a distinct valid scope/role.
     - **Mode C (`UNRESOLVABLE_CONFLICT_ABSTAIN`)**: When two sources of equal authority and identical/missing timestamps directly contradict each other, explicitly states that the conflict cannot be resolved with available information and presents both raw citations side-by-side.

## Tech Stack Standards
- **Backend**: Python 3.11+, FastAPI, Pydantic v2 (strict typed schemas), LangGraph (state machine), NetworkX (Bi-Temporal Authority DAG), Rank-BM25 + FAISS/ChromaDB (hybrid retrieval).
- **LLM & NLI Support**: Pluggable provider supporting Gemini / Claude / OpenAI / Ollama + local `cross-encoder/nli-deberta-v3-base` (with deterministic LLM-structured NLI fallback so offline/low-VRAM laptops run effortlessly).
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons.
- **Verification Gate**: Every backend module must have a corresponding `pytest` test in `backend/tests/`. Always run `pytest` after editing agent logic.