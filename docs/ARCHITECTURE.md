# ARCHITECTURE.md — TruthGuard Technical Reference Architecture

## 1. Multi-Agent State Graph (LangGraph)

[User Query]
│
▼
┌──────────────────────────────────────────────────────────┐
│ 1. RETRIEVER AGENT (Hybrid BM25 + Dense + DAG Expansion) │
│    Pulls top-K chunks + auto-fetches superseding docs    │
└───────────────────────────┬──────────────────────────────┘
│ List[RetrievedPassage]
▼
┌──────────────────────────────────────────────────────────┐
│ 2. SYNTHESIZER AGENT (Claim-Decomposed Drafter)          │
│    Produces candidate answer as List[AtomicClaim]        │
└───────────────────────────┬──────────────────────────────┘
│ DraftAnswer + List[RetrievedPassage]
▼
┌──────────────────────────────────────────────────────────┐
│ 3. CRITIC / ADVERSARY AGENT (3 Parallel Audit Probes)    │
│    ├── Probe A: Pairwise NLI Contradiction Matrix        │
│    ├── Probe B: Bi-Temporal DAG Staleness & Hierarchy    │
│    └── Probe C: Claim-to-Quote Entailment Verifier       │
└───────────────────────────┬──────────────────────────────┘
│ CriticAuditReport
▼
┌───────────────────┴───────────────────┐
│ Has Unbacked Claims & RetryCount < 1? │
└───────┬───────────────────────┬───────┘
YES  │                       │ NO
▼                       ▼
[Re-Synthesize Strict]   ┌─────────────────────────────────────────┐
│ 4. RESOLUTION ENGINE                    │
│    • RESOLVED_BY_SUPERSESSION (Show A&B)│
│    • CONDITIONAL_SPLIT (Show Scope A&B) │
│    • UNRESOLVABLE_ABSTAIN (Refuse tie)  │
└─────────────────┬───────────────────────┘
│
▼
[Final Verdict + SHA-256 Provenance Receipt]

## 2. Core Data Contracts (`backend/app/schemas/models.py`)

```python
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field

class DocAuthorityTier(int, Enum):
    FAQ = 1
    MEMO = 2
    POLICY = 3
    AMENDMENT = 4
    REGULATORY_MANDATE = 5

class PassageMetadata(BaseModel):
    doc_id: str
    title: str
    version: str
    effective_date: str          # ISO-8601 YYYY-MM-DD
    authority_tier: DocAuthorityTier
    supersedes: List[str] = Field(default_factory=list)
    domain_scope: str = "general"

class RetrievedPassage(BaseModel):
    passage_id: str
    text: str
    score: float
    metadata: PassageMetadata
    is_stale: bool = False
    superseded_by: Optional[str] = None

class AtomicClaim(BaseModel):
    claim_id: str
    statement: str
    cited_passage_ids: List[str]
    verbatim_quotes: List[str]

class ContradictionEdge(BaseModel):
    passage_a_id: str
    passage_b_id: str
    nli_label: str               # CONTRADICTION | ENTAILMENT | NEUTRAL
    confidence: float
    conflict_summary: str
    resolution_rule: str         # RECENCY | AUTHORITY_TIER | SCOPE_SPLIT | DEADLOCK

class ClaimAuditResult(BaseModel):
    claim_id: str
    is_supported: bool
    relies_on_stale_source: bool
    failure_reason: Optional[str] = None

class ResolutionStatus(str, Enum):
    CONSISTENT = "CONSISTENT"
    RESOLVED_CONFLICT = "RESOLVED_CONFLICT"
    UNRESOLVABLE_ABSTAIN = "UNRESOLVABLE_ABSTAIN"

class TruthGuardResponse(BaseModel):
    query: str
    status: ResolutionStatus
    final_answer: str
    positions_surfaced: List[dict]
    contradictions_detected: List[ContradictionEdge]
    claim_audits: List[ClaimAuditResult]
    retrieved_passages: List[RetrievedPassage]
    provenance_sha256: str
    latency_ms: float
```

## 3. Bi-Temporal Authority Resolution Rules

When Passage A and Passage B have `nli_label == "CONTRADICTION"` (confidence >= 0.70):

**Explicit Supersession Edge**: If `A.doc_id in B.supersedes`, B wins deterministically (resolution_rule = "EXPLICIT_SUPERSESSION").

**Authority Hierarchy**: If `B.authority_tier > A.authority_tier` and `B.effective_date >= A.effective_date`, B wins (resolution_rule = "AUTHORITY_TIER").

**Temporal Recency (Same Tier)**: If `B.authority_tier == A.authority_tier` and `B.effective_date > A.effective_date`, B wins (resolution_rule = "TEMPORAL_RECENCY").

**Scope Disambiguation**: If `A.domain_scope != B.domain_scope`, both are valid within their respective scopes (resolution_rule = "SCOPE_SPLIT").

**Deadlock -> Epistemic Abstention**: If A and B have identical authority_tier, identical or missing effective_date, and overlapping domain_scope, set status to UNRESOLVABLE_ABSTAIN.