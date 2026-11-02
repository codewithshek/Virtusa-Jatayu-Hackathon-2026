"""Critic Agent: 3-Vector Adversarial Critique + All 5 Zero-Prior-Art Verifiers Wired."""

import time
from typing import List, Dict, Any
from dataclasses import asdict

from app.schemas.models import (
    AtomicClaim, RetrievedPassage, ContradictionEdge,
    ClaimAuditResult, NLILabel, ResolutionRule
)
from app.verification.nli_matrix import nli_matrix
from app.verification.claim_auditor import claim_auditor
from app.verification.symbolic_deontic_solver import (
    extract_numeric_constraints, detect_symbolic_conflict
)
from app.verification.silent_revocation_detector import (
    analyze_silent_revocations
)
from app.verification.corpus_healer import (
    compute_corpus_hygiene_report
)
from app.ingestion.authority_dag import authority_dag


class CriticAgentState(Dict[str, Any]):
    """State for Critic Agent."""
    query: str
    passages: List[RetrievedPassage]
    claims: List[AtomicClaim]
    contradictions: List[ContradictionEdge]
    claim_audits: List[ClaimAuditResult]
    silent_revocations: List[Dict[str, Any]]
    corpus_hygiene: Dict[str, Any]
    has_unbacked_claims: bool
    trace: List[Dict[str, Any]]


def _determine_resolution_rule(p1: RetrievedPassage, p2: RetrievedPassage) -> ResolutionRule:
    """Determine the exact DAG resolution rule between two conflicting passages."""
    doc_a, doc_b = p1.metadata.doc_id, p2.metadata.doc_id
    if doc_a in p2.metadata.supersedes or doc_b in p1.metadata.supersedes:
        return ResolutionRule.EXPLICIT_SUPERSESSION

    governing = authority_dag.get_governing_document(
        [doc_a, doc_b],
        p1.metadata.domain_scope if p1.metadata.domain_scope == p2.metadata.domain_scope else None
    )
    if governing is None:
        if (
            p1.metadata.domain_scope != p2.metadata.domain_scope
            and p1.metadata.domain_scope != "general"
            and p2.metadata.domain_scope != "general"
            and p1.metadata.effective_date != p2.metadata.effective_date
        ):
            return ResolutionRule.SCOPE_SPLIT
        return ResolutionRule.DEADLOCK

    if p1.metadata.authority_tier != p2.metadata.authority_tier:
        return ResolutionRule.AUTHORITY_TIER
    if p1.metadata.effective_date != p2.metadata.effective_date:
        return ResolutionRule.TEMPORAL_RECENCY
    return ResolutionRule.EXPLICIT_SUPERSESSION


class CriticEngine:
    """
    3-Vector Adversarial Critic + Symbolic Deontic, Silent Revocation & Corpus Hygiene Verifiers.
    """

    def check_contradiction(self, text1: str, text2: str) -> tuple[NLILabel, float]:
        edges = nli_matrix.compute_matrix([("a", text1), ("b", text2)], threshold=0.70)
        if edges:
            return NLILabel.CONTRADICTION, edges[0].confidence
        return NLILabel.NEUTRAL, 0.30

    def check_entailment(self, claim: str, passage: str) -> float:
        return claim_auditor._compute_overlap(claim, passage)


critic_engine = CriticEngine()


async def critic_agent(state: CriticAgentState) -> CriticAgentState:
    """
    Critic Agent: Adversarial verification of synthesizer output across:
    1. Pairwise Contradiction Matrix (DeBERTa-v3 NLI + Symbolic Deontic Interval Solver)
    2. Bi-Temporal DAG Staleness & Supersession Resolution
    3. Claim-to-Quote Entailment & Numerical Consistency Audit
    4. Silent Revocation AST Clause Detector
    5. Corpus Hygiene Infection Score & Auto-Redline PR Generator
    """
    start_time = time.time()

    passages: List[RetrievedPassage] = state.get("passages", [])
    claims: List[AtomicClaim] = state.get("claims", [])
    trace = list(state.get("trace", []))

    contradictions: List[ContradictionEdge] = []
    seen_pairs = set()

    for i, p1 in enumerate(passages):
        for p2 in passages[i + 1:]:
            if p1.metadata.doc_id == p2.metadata.doc_id:
                continue
            pair_key = tuple(sorted([p1.passage_id, p2.passage_id]))
            if pair_key in seen_pairs:
                continue

            rules1 = extract_numeric_constraints(p1.metadata.doc_id, p1.passage_id, p1.text)
            rules2 = extract_numeric_constraints(p2.metadata.doc_id, p2.passage_id, p2.text)

            symbolic_edge = None
            for r1 in rules1:
                for r2 in rules2:
                    symbolic_edge = detect_symbolic_conflict(r1, r2)
                    if symbolic_edge:
                        break
                if symbolic_edge:
                    break

            nli_label, nli_conf = critic_engine.check_contradiction(p1.text, p2.text)

            if symbolic_edge or nli_label == NLILabel.CONTRADICTION:
                seen_pairs.add(pair_key)
                rule = _determine_resolution_rule(p1, p2)

                governing_doc = authority_dag.get_governing_document(
                    [p1.metadata.doc_id, p2.metadata.doc_id]
                )
                if governing_doc == p1.metadata.doc_id:
                    pa_id, pb_id = p2.passage_id, p1.passage_id
                else:
                    pa_id, pb_id = p1.passage_id, p2.passage_id

                summary = (
                    symbolic_edge.conflict_summary
                    if symbolic_edge
                    else f"Contradiction between {p1.metadata.doc_id} and {p2.metadata.doc_id}"
                )
                conf = symbolic_edge.confidence if symbolic_edge else nli_conf

                contradictions.append(ContradictionEdge(
                    passage_a_id=pa_id,
                    passage_b_id=pb_id,
                    nli_label=NLILabel.CONTRADICTION,
                    confidence=conf,
                    conflict_summary=summary,
                    resolution_rule=rule
                ))

    claim_audits: List[ClaimAuditResult] = claim_auditor.audit_all_claims(claims, passages)
    has_unbacked_claims = any(not ca.is_supported for ca in claim_audits)

    revocation_objs = analyze_silent_revocations(passages)
    silent_revocations = [asdict(r) for r in revocation_objs]

    corpus_hygiene = compute_corpus_hygiene_report(passages, contradictions)

    elapsed_ms = (time.time() - start_time) * 1000

    trace.append({
        "step": "critic",
        "action": "adversarial_3vector_and_zero_prior_art_audit",
        "contradictions_found": len(contradictions),
        "silent_revocations_found": len(silent_revocations),
        "auto_prs_generated": len(corpus_hygiene.get("auto_prs", [])),
        "unbacked_claims": has_unbacked_claims,
        "claims_audited": len(claim_audits),
        "latency_ms": elapsed_ms
    })

    out = dict(state)
    out.update({
        "contradictions": contradictions,
        "claim_audits": claim_audits,
        "silent_revocations": silent_revocations,
        "corpus_hygiene": corpus_hygiene,
        "has_unbacked_claims": has_unbacked_claims,
        "trace": trace,
        "latency_ms": elapsed_ms
    })
    return CriticAgentState(out)