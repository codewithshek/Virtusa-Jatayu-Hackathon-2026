"""Resolution Engine: Deterministic Conflict Resolution with Abstention & Merkle Provenance."""

import hashlib
import time
from typing import List, Dict, Any

from app.schemas.models import (
    AtomicClaim, RetrievedPassage, ContradictionEdge,
    ClaimAuditResult, ResolutionStatus, ResolutionRule,
    PositionSurfaced
)
from app.verification.merkle_provenance import (
    build_merkle_provenance_receipt,
    build_byte_span_provenance
)


class ResolverAgentState(Dict[str, Any]):
    """State for Resolver Agent."""
    query: str
    passages: List[RetrievedPassage]
    claims: List[AtomicClaim]
    contradictions: List[ContradictionEdge]
    claim_audits: List[ClaimAuditResult]
    final_answer: str
    status: ResolutionStatus
    positions: List[PositionSurfaced]
    merkle_provenance: Dict[str, Any]
    trace: List[Dict[str, Any]]


async def resolver_agent(state: ResolverAgentState) -> ResolverAgentState:
    """
    Resolution Engine:
    1. Strip any unbacked/hallucinated claims flagged by the Critic
    2. Apply deterministic resolution rules for conflicts
    3. Surface governing and superseded positions with provenance
    4. Trigger explicit abstention on deadlocks
    5. Generate SHA-256 provenance receipt + Merkle-Tree Byte-Span inclusion proofs
    """
    start_time = time.time()

    query = state.get("query", "")
    passages: List[RetrievedPassage] = state.get("passages", [])
    claims: List[AtomicClaim] = state.get("claims", [])
    contradictions: List[ContradictionEdge] = state.get("contradictions", [])
    claim_audits: List[ClaimAuditResult] = state.get("claim_audits", [])

    supported_claim_ids = {ca.claim_id for ca in claim_audits if ca.is_supported}
    verified_claims = [c for c in claims if not claim_audits or c.claim_id in supported_claim_ids]

    is_deadlock = any(
        c.resolution_rule == ResolutionRule.DEADLOCK
        for c in contradictions
    )

    if is_deadlock:
        status = ResolutionStatus.UNRESOLVABLE_ABSTAIN
        final_answer = (
            "Explicit Abstention (Deadlock): This conflict cannot be resolved with available "
            "information because conflicting authoritative documents exist with equal authority "
            "tiers and identical effective dates. Both positions are surfaced below with provenance."
        )
    elif contradictions:
        status = ResolutionStatus.RESOLVED_CONFLICT
        final_answer = _build_resolved_answer(passages, contradictions)
    else:
        status = ResolutionStatus.CONSISTENT
        final_answer = _build_consistent_answer(passages, verified_claims)

    positions = _build_positions(passages, contradictions)

    claim_dicts = [
        {
            "claim_id": c.claim_id,
            "cited_doc_ids": [
                p.metadata.doc_id for p in passages if p.passage_id in c.cited_passage_ids
            ],
            "verbatim_quotes": c.verbatim_quotes
        }
        for c in verified_claims
    ]
    passage_dicts = [
        {"doc_id": p.metadata.doc_id, "text": p.text}
        for p in passages
    ]
    merkle_claim_tree = build_merkle_provenance_receipt(claim_dicts)
    merkle_span_tree = build_byte_span_provenance(claim_dicts, passage_dicts)
    merkle_provenance = {
        "merkle_root": merkle_span_tree["merkle_root"],
        "claim_merkle_root": merkle_claim_tree["merkle_root"],
        "inclusion_proofs": merkle_claim_tree["inclusion_proofs"],
        "byte_spans": merkle_span_tree["byte_spans"],
        "span_count": merkle_span_tree["span_count"]
    }

    provenance_sha256 = _compute_provenance_hash(
        query=query,
        answer=final_answer,
        passages=passages,
        contradictions=contradictions,
        claim_audits=claim_audits,
        resolution_rule=str(status)
    )

    elapsed_ms = (time.time() - start_time) * 1000

    out = dict(state)
    out.update({
        "claims": verified_claims,
        "final_answer": final_answer,
        "status": status,
        "positions": positions,
        "merkle_provenance": merkle_provenance,
        "trace": state.get("trace", []) + [{
            "step": "resolver",
            "action": "deterministic_resolution_and_merkle_seal",
            "status": status,
            "merkle_root": merkle_provenance["merkle_root"][:16],
            "positions_surfaced": len(positions),
            "latency_ms": elapsed_ms
        }],
        "provenance_sha256": provenance_sha256,
        "latency_ms": elapsed_ms
    })
    return ResolverAgentState(out)


def _build_resolved_answer(passages: List[RetrievedPassage], contradictions: List[ContradictionEdge]) -> str:
    """Build transparent dual-position answer when conflicts are resolved."""
    passage_map = {p.passage_id: p for p in passages}
    for c in contradictions:
        if c.resolution_rule in (
            ResolutionRule.EXPLICIT_SUPERSESSION,
            ResolutionRule.AUTHORITY_TIER,
            ResolutionRule.TEMPORAL_RECENCY,
        ):
            stale_p = passage_map.get(c.passage_a_id)
            gov_p = passage_map.get(c.passage_b_id)
            if gov_p and stale_p:
                return (
                    f"[{stale_p.metadata.doc_id}] ({stale_p.metadata.title}, effective {stale_p.metadata.effective_date}) "
                    f"states: \"{stale_p.text[:140].strip()}...\" — HOWEVER, [{gov_p.metadata.doc_id}] "
                    f"({gov_p.metadata.title}, effective {gov_p.metadata.effective_date}) supersedes it via "
                    f"{c.resolution_rule.value} and governs: \"{gov_p.text[:160].strip()}...\""
                )
    return "Conflicts resolved via Bi-Temporal Authority DAG. See surfaced provenance positions."


def _build_consistent_answer(passages: List[RetrievedPassage], claims: List[AtomicClaim]) -> str:
    """Build answer when no conflicts exist."""
    if claims:
        return " ".join(c.statement for c in claims)
    if not passages:
        return "No relevant information found in documents."
    return " ".join(p.text[:250] for p in passages[:2])


def _build_positions(
    passages: List[RetrievedPassage],
    contradictions: List[ContradictionEdge]
) -> List[PositionSurfaced]:
    """Build surfaced positions for the response."""
    positions = []
    governing_passage_ids = set()
    rule_by_passage: Dict[str, ResolutionRule] = {}

    for c in contradictions:
        if c.resolution_rule in (
            ResolutionRule.EXPLICIT_SUPERSESSION,
            ResolutionRule.AUTHORITY_TIER,
            ResolutionRule.TEMPORAL_RECENCY,
        ):
            governing_passage_ids.add(c.passage_b_id)
            rule_by_passage[c.passage_b_id] = c.resolution_rule
            rule_by_passage[c.passage_a_id] = c.resolution_rule
        elif c.resolution_rule == ResolutionRule.DEADLOCK:
            rule_by_passage[c.passage_a_id] = ResolutionRule.DEADLOCK
            rule_by_passage[c.passage_b_id] = ResolutionRule.DEADLOCK

    for p in passages:
        is_governing = (p.passage_id in governing_passage_ids) or (not p.is_stale and not contradictions)
        if not any(pos.doc_id == p.metadata.doc_id for pos in positions):
            positions.append(PositionSurfaced(
                doc_id=p.metadata.doc_id,
                title=p.metadata.title,
                claim_text=p.text[:220],
                is_governing=is_governing and not p.is_stale,
                is_stale=p.is_stale,
                authority_tier=p.metadata.authority_tier,
                effective_date=p.metadata.effective_date,
                resolution_rule=rule_by_passage.get(p.passage_id)
            ))

    return positions


def _compute_provenance_hash(
    query: str,
    answer: str,
    passages: List[RetrievedPassage],
    contradictions: List[ContradictionEdge],
    claim_audits: List[ClaimAuditResult],
    resolution_rule: str
) -> str:
    """Compute SHA-256 hash of all provenance data."""
    data = {
        "query": query,
        "answer": answer,
        "passages": [
            {
                "id": p.passage_id,
                "text": hashlib.sha256(p.text.encode()).hexdigest()[:16],
                "doc_id": p.metadata.doc_id
            }
            for p in passages
        ],
        "contradictions": [
            {
                "a": c.passage_a_id,
                "b": c.passage_b_id,
                "rule": c.resolution_rule.value if c.resolution_rule else None
            }
            for c in contradictions
        ],
        "resolution": resolution_rule
    }
    return hashlib.sha256(str(sorted(data.items())).encode()).hexdigest()