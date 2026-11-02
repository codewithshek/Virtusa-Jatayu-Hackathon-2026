"""Tests for staleness and supersession detection via DAG."""

import pytest
from datetime import date

from app.schemas.models import DocAuthorityTier, DocType, PassageMetadata, RetrievedPassage, AtomicClaim
from app.ingestion.authority_dag import AuthorityDAG
from app.agents.critic_agent import critic_agent
from app.verification.claim_auditor import claim_auditor


@pytest.fixture
def authority_dag():
    """Build DAG matching the test manifest."""
    dag = AuthorityDAG()
    dag.graph.add_node("POL-2023-v1", authority_tier=DocAuthorityTier.POLICY)
    dag.graph.add_node("POL-2024-v2", authority_tier=DocAuthorityTier.POLICY)
    dag.graph.add_node("AMD-2025-03", authority_tier=DocAuthorityTier.AMENDMENT)

    # Supersession edges
    dag.graph.add_edge("POL-2024-v2", "POL-2023-v1", edge_type="explicit_supersession")
    dag.graph.add_edge("AMD-2025-03", "POL-2024-v2", edge_type="explicit_supersession")

    dag.nodes = {
        "POL-2023-v1": type('obj', (object,), {
            'doc_id': 'POL-2023-v1',
            'title': 'Remote Work Policy v1',
            'authority_tier': DocAuthorityTier.POLICY,
            'effective_date': '2023-01-15',
            'supersedes': [],
            'domain_scope': 'general'
        })(),
        "POL-2024-v2": type('obj', (object,), {
            'doc_id': 'POL-2024-v2',
            'title': 'Remote Work Policy v2',
            'authority_tier': DocAuthorityTier.POLICY,
            'effective_date': '2024-03-01',
            'supersedes': ['POL-2023-v1'],
            'domain_scope': 'general'
        })(),
        "AMD-2025-03": type('obj', (object,), {
            'doc_id': 'AMD-2025-03',
            'title': 'Executive Amendment: Remote Work Flexibility',
            'authority_tier': DocAuthorityTier.AMENDMENT,
            'effective_date': '2025-03-15',
            'supersedes': ['POL-2024-v2', 'POL-2023-v1'],
            'domain_scope': 'field_engineering'
        })()
    }
    dag._built = True
    return dag


class TestStalenessDetection:
    """Test detection of stale documents via Bi-Temporal Authority DAG."""


class TestSupersessionDAG:
    """Test March 2025 amendment superseding Policy v1."""

    def test_april_2025_amendment_supersedes_policies(self, authority_dag):
        """Test that April 2025 Amendment supersedes both Policy versions."""
        # AMD-2025-03 should supersede both POL-2024-v2 and POL-2023-v1
        superseding = authority_dag.get_superseding_documents("POL-2023-v1")
        assert "AMD-2025-03" in superseding
        assert "POL-2024-v2" in superseding

        superseding = authority_dag.get_superseding_documents("POL-2024-v2")
        assert "AMD-2025-03" in superseding

    def test_authority_tier_ordering(self, authority_dag):
        """Test AMENDMENT > POLICY hierarchy."""
        governing = authority_dag.get_governing_document(
            ["POL-2023-v1", "AMD-2025-03"],
            "field_engineering"
        )
        assert governing == "AMD-2025-03"

    def test_staleness_flag(self, authority_dag):
        """Test that older policy documents are marked stale."""
        is_stale, superseded_by = authority_dag.check_staleness(
            "POL-2023-v1",
            ["AMD-2025-03"]
        )
        assert is_stale
        assert superseded_by == "AMD-2025-03"

    def test_governing_document_field_engineering(self, authority_dag):
        """Test governing document for field engineering scope."""
        governing = authority_dag.get_governing_document(
            ["POL-2023-v1", "POL-2024-v2", "AMD-2025-03"],
            "field_engineering"
        )
        assert governing == "AMD-2025-03"

        # For general scope, POL-2024-v2 should also be considered
        governing_general = authority_dag.get_governing_document(
            ["POL-2023-v1", "POL-2024-v2"],
            "general"
        )
        # No clear winner without AMD-2025-03
        assert governing_general in ["POL-2024-v2", None]


class TestStalenessWithFieldEngineerScope:
    """Test that Field Engineers get 3 days while general gets 2, based on scope."""

    def test_scope_disambiguation(self, authority_dag):
        """Test that scope is properly considered in resolution."""
        # AMD-2025-03 only applies to field_engineering scope
        # So for general scope, POL-2024-v2 (2 days) governs
        general_governing = authority_dag.get_governing_document(
            ["AMD-2025-03", "POL-2024-v2"],
            "general"
        )
        assert general_governing == "POL-2024-v2"

        # For field_engineering, AMD-2025-03 governs
        fe_governing = authority_dag.get_governing_document(
            ["AMD-2025-03", "POL-2024-v2"],
            "field_engineering"
        )
        assert fe_governing == "AMD-2025-03"