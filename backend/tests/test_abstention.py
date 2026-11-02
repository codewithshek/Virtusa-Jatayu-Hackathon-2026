"""Tests for explicit refusal on deadlocked sources."""

import asyncio
import pytest

from app.schemas.models import (
    DocAuthorityTier, DocType, PassageMetadata, RetrievedPassage,
    ContradictionEdge, NLILabel, ResolutionRule, ResolutionStatus
)
from app.ingestion.authority_dag import AuthorityDAG
from app.agents.resolver_agent import resolver_agent


class TestAbstention:
    """Test explicit refusal on deadlocked queries."""

    @pytest.fixture
    def deadlock_dag(self):
        """Build DAG with truly deadlocked documents."""
        dag = AuthorityDAG()
        dag.graph.add_node("SEC-2024-A", authority_tier=DocAuthorityTier.POLICY)
        dag.graph.add_node("SEC-2024-B", authority_tier=DocAuthorityTier.POLICY)

        dag.nodes = {
            "SEC-2024-A": type('obj', (object,), {
                'doc_id': 'SEC-2024-A',
                'title': 'Security Policy v2',
                'authority_tier': DocAuthorityTier.POLICY,
                'effective_date': '2024-06-01',
                'supersedes': [],
                'domain_scope': 'security_telemetry'
            })(),
            "SEC-2024-B": type('obj', (object,), {
                'doc_id': 'SEC-2024-B',
                'title': 'Compliance Policy v2',
                'authority_tier': DocAuthorityTier.POLICY,
                'effective_date': '2024-06-01',
                'supersedes': [],
                'domain_scope': 'compliance_telemetry'
            })()
        }
        dag._built = True
        return dag

    def test_deadlock_detection(self, deadlock_dag):
        """Test detection of tied date and equal authority tier."""
        governing = deadlock_dag.get_governing_document(["SEC-2024-A", "SEC-2024-B"])
        assert governing is None

    def test_staleness_check_returns_false_for_deadlock(self, deadlock_dag):
        """Test that staleness check returns False for deadlocked docs."""
        is_stale, superseded_by = deadlock_dag.check_staleness("SEC-2024-A", ["SEC-2024-B"])
        assert not is_stale
        assert superseded_by is None

    def test_abstention_on_resolution(self, deadlock_dag):
        """Test that resolver outputs UNRESOLVABLE_ABSTAIN status."""
        passages = [
            RetrievedPassage(
                passage_id="p1",
                text="Telemetry logs must be deleted after 90 days.",
                score=0.85,
                metadata=PassageMetadata(
                    doc_id="SEC-2024-A",
                    title="Security Policy v2",
                    version="2.0",
                    effective_date="2024-06-01",
                    authority_tier=DocAuthorityTier.POLICY,
                    doc_type=DocType.POLICY,
                    supersedes=[],
                    domain_scope="security_telemetry"
                )
            ),
            RetrievedPassage(
                passage_id="p2",
                text="Telemetry logs must be retained for 365 days.",
                score=0.85,
                metadata=PassageMetadata(
                    doc_id="SEC-2024-B",
                    title="Compliance Policy v2",
                    version="2.0",
                    effective_date="2024-06-01",
                    authority_tier=DocAuthorityTier.POLICY,
                    doc_type=DocType.POLICY,
                    supersedes=[],
                    domain_scope="compliance_telemetry"
                )
            )
        ]

        state = {
            "query": "What is the mandatory cold-storage retention window for telemetry logs?",
            "passages": passages,
            "contradictions": [
                ContradictionEdge(
                    passage_a_id="p1",
                    passage_b_id="p2",
                    nli_label=NLILabel.CONTRADICTION,
                    confidence=0.95,
                    conflict_summary="Same date, equal tier, direct numerical conflict",
                    resolution_rule=ResolutionRule.DEADLOCK
                )
            ],
            "claim_audits": [],
            "trace": [],
            "latency_ms": 0.0
        }

        result = asyncio.run(resolver_agent(state))

        assert result["status"] == ResolutionStatus.UNRESOLVABLE_ABSTAIN
        assert "cannot be resolved" in result["final_answer"].lower() or "deadlock" in result["final_answer"].lower()

    def test_both_positions_surfaced(self, deadlock_dag):
        """Test that both conflicting positions are shown in abstention case."""
        passages = [
            RetrievedPassage(
                passage_id="p1",
                text="Mandatory 90-day deletion for telemetry logs.",
                score=0.85,
                metadata=PassageMetadata(
                    doc_id="SEC-2024-A",
                    title="Security Policy v2",
                    version="2.0",
                    effective_date="2024-06-01",
                    authority_tier=DocAuthorityTier.POLICY,
                    doc_type=DocType.POLICY,
                    supersedes=[],
                    domain_scope="security_telemetry"
                )
            ),
            RetrievedPassage(
                passage_id="p2",
                text="Mandatory 365-day retention for telemetry logs.",
                score=0.85,
                metadata=PassageMetadata(
                    doc_id="SEC-2024-B",
                    title="Compliance Policy v2",
                    version="2.0",
                    effective_date="2024-06-01",
                    authority_tier=DocAuthorityTier.POLICY,
                    doc_type=DocType.POLICY,
                    supersedes=[],
                    domain_scope="compliance_telemetry"
                )
            )
        ]

        state = {
            "query": "What is the retention window?",
            "passages": passages,
            "contradictions": [
                ContradictionEdge(
                    passage_a_id="p1",
                    passage_b_id="p2",
                    nli_label=NLILabel.CONTRADICTION,
                    confidence=0.95,
                    conflict_summary="Direct conflict 90 vs 365 days",
                    resolution_rule=ResolutionRule.DEADLOCK
                )
            ],
            "claims": [],
            "claim_audits": [],
            "trace": [],
            "latency_ms": 0.0
        }

        result = asyncio.run(resolver_agent(state))

        assert len(result["positions"]) == 2
        assert result["positions"][0]["doc_id"] in ["SEC-2024-A", "SEC-2024-B"]
        assert result["positions"][1]["doc_id"] in ["SEC-2024-A", "SEC-2024-B"]