"""Core data contracts for TruthGuard - Pydantic v2 models."""

from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
import uuid


class DocAuthorityTier(int, Enum):
    FAQ = 1
    MEMO = 2
    POLICY = 3
    AMENDMENT = 4
    REGULATORY_MANDATE = 5


class DocType(str, Enum):
    POLICY = "POLICY"
    AMENDMENT = "AMENDMENT"
    FAQ = "FAQ"
    MEMO = "MEMO"
    SLA = "SLA"
    SOP = "SOP"
    REGULATORY = "REGULATORY"


class PassageMetadata(BaseModel):
    doc_id: str
    title: str
    version: str
    effective_date: str  # ISO-8601 YYYY-MM-DD
    authority_tier: DocAuthorityTier
    doc_type: DocType = DocType.POLICY
    supersedes: List[str] = Field(default_factory=list)
    domain_scope: str = "general"


class RetrievedPassage(BaseModel):
    passage_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    text: str
    score: float
    metadata: PassageMetadata
    is_stale: bool = False
    superseded_by: Optional[str] = None


class AtomicClaim(BaseModel):
    claim_id: str = Field(default_factory=lambda: str(uuid.uuid4())[:8])
    statement: str
    cited_passage_ids: List[str]
    verbatim_quotes: List[str]


class NLILabel(str, Enum):
    CONTRADICTION = "CONTRADICTION"
    ENTAILMENT = "ENTAILMENT"
    NEUTRAL = "NEUTRAL"


class ResolutionRule(str, Enum):
    EXPLICIT_SUPERSESSION = "EXPLICIT_SUPERSESSION"
    AUTHORITY_TIER = "AUTHORITY_TIER"
    TEMPORAL_RECENCY = "TEMPORAL_RECENCY"
    SCOPE_SPLIT = "SCOPE_SPLIT"
    DEADLOCK = "DEADLOCK"


class ContradictionEdge(BaseModel):
    passage_a_id: str
    passage_b_id: str
    nli_label: NLILabel
    confidence: float
    conflict_summary: str
    resolution_rule: Optional[ResolutionRule] = None


class ClaimAuditResult(BaseModel):
    claim_id: str
    is_supported: bool
    relies_on_stale_source: bool = False
    failure_reason: Optional[str] = None
    supporting_passage_ids: List[str] = Field(default_factory=list)


class ResolutionStatus(str, Enum):
    CONSISTENT = "CONSISTENT"
    RESOLVED_CONFLICT = "RESOLVED_CONFLICT"
    UNRESOLVABLE_ABSTAIN = "UNRESOLVABLE_ABSTAIN"


class PositionSurfaced(BaseModel):
    doc_id: str
    title: str
    claim_text: str
    is_governing: bool
    is_stale: bool
    authority_tier: DocAuthorityTier
    effective_date: str
    resolution_rule: Optional[ResolutionRule] = None

    def __getitem__(self, key: str) -> Any:
        return getattr(self, key)


class TruthGuardResponse(BaseModel):
    query: str
    status: ResolutionStatus
    final_answer: str
    positions_surfaced: List[PositionSurfaced]
    contradictions_detected: List[ContradictionEdge]
    claim_audits: List[ClaimAuditResult]
    retrieved_passages: List[RetrievedPassage]
    provenance_sha256: str
    merkle_provenance: Dict[str, Any] = Field(default_factory=dict)
    silent_revocations: List[Dict[str, Any]] = Field(default_factory=list)
    corpus_hygiene: Dict[str, Any] = Field(default_factory=dict)
    counterfactual_probes: List[str] = Field(default_factory=list)
    latency_ms: float
    trace: List[Dict[str, Any]] = Field(default_factory=list)


class QueryRequest(BaseModel):
    query: str
    top_k: Optional[int] = None
    include_trace: bool = True


class CorpusDocument(BaseModel):
    doc_id: str
    title: str
    version: str
    effective_date: str
    authority_tier: int
    doc_type: str
    supersedes: List[str]
    domain_scope: str
    content: str


class AuditReceipt(BaseModel):
    query: str
    answer_hash: str
    retrieved_passages: List[Dict[str, Any]]
    contradiction_edges: List[Dict[str, Any]]
    claim_audits: List[Dict[str, Any]]
    resolution_rule_applied: str
    timestamp: str
    receipt_hash: str