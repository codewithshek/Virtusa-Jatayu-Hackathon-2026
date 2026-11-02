"""Tests for direct contradiction detection."""

import pytest

from app.schemas.models import NLILabel, DocAuthorityTier, DocType, PassageMetadata, RetrievedPassage, ContradictionEdge
from app.verification.nli_matrix import NLIMatrix
from app.ingestion.authority_dag import AuthorityDAG


class TestContradictionDetection:
    """Test contradiction detection across retrieved passages."""

    @pytest.fixture
    def nli_matrix(self):
        return NLIMatrix()

    @pytest.fixture
    def authority_dag(self):
        return AuthorityDAG()

    def test_contradiction_detection_simple(self, nli_matrix):
        """Test basic contradiction detection between two passages."""
        # Create contradictory passages
        p1 = RetrievedPassage(
            passage_id="p1",
            text="Employees may work remotely up to 2 days per week.",
            score=0.9,
            metadata=PassageMetadata(
                doc_id="POL-2024-v2",
                title="Remote Work Policy v2",
                version="2.0",
                effective_date="2024-03-01",
                authority_tier=DocAuthorityTier.POLICY,
                doc_type=DocType.POLICY,
                supersedes=[],
                domain_scope="general"
            )
        )

        p2 = RetrievedPassage(
            passage_id="p2",
            text="Employees may work remotely up to 4 days per week.",
            score=0.85,
            metadata=PassageMetadata(
                doc_id="POL-2023-v1",
                title="Remote Work Policy v1",
                version="1.0",
                effective_date="2023-01-15",
                authority_tier=DocAuthorityTier.POLICY,
                doc_type=DocType.POLICY,
                supersedes=[],
                domain_scope="general"
            )
        )

        passages = [(p1.passage_id, p1.text), (p2.passage_id, p2.text)]
        edges = nli_matrix.compute_matrix(passages, threshold=0.5)

        # Should detect contradiction
        assert len(edges) >= 1
        assert edges[0].nli_label == NLILabel.CONTRADICTION

    def test_no_contradiction_same_text(self, nli_matrix):
        """Test that identical texts don't produce contradiction."""
        text = "Employees may work remotely up to 2 days per week."

        passages = [("p1", text), ("p2", text)]
        edges = nli_matrix.compute_matrix(passages, threshold=0.5)

        # Should not detect contradiction
        assert len(edges) == 0

    def test_heuristic_contradiction_fallback(self, nli_matrix):
        """Test heuristic contradiction detection when NLI unavailable."""
        # Force fallback mode
        nli_matrix.model = None

        text1 = "The policy allows 4 days of remote work per week."
        text2 = "The policy does not allow remote work beyond 2 days."

        # Heuristic should detect contradiction
        score = nli_matrix._heuristic_contradiction(text1, text2)
        assert score > 0.5


class TestAuthorityDAGResolution:
    """Test DAG-based supersession resolution."""

    @pytest.fixture
    def dag(self):
        dag = AuthorityDAG()
        # Build with test data
        dag.graph.add_node("doc_v1", authority_tier=DocAuthorityTier.POLICY)
        dag.graph.add_node("doc_v2", authority_tier=DocAuthorityTier.POLICY)
        dag.graph.add_edge("doc_v2", "doc_v1", edge_type="explicit_supersession")
        dag.nodes = {
            "doc_v1": type('obj', (object,), {
                'doc_id': 'doc_v1',
                'authority_tier': DocAuthorityTier.POLICY,
                'effective_date': '2023-01-01',
                'supersedes': [],
                'domain_scope': 'general'
            })(),
            "doc_v2": type('obj', (object,), {
                'doc_id': 'doc_v2',
                'authority_tier': DocAuthorityTier.POLICY,
                'effective_date': '2024-01-01',
                'supersedes': ['doc_v1'],
                'domain_scope': 'general'
            })()
        }
        dag._built = True
        return dag

    def test_explicit_supersession(self, dag):
        """Test explicit supersession edge detection."""
        governing = dag.get_governing_document(["doc_v1", "doc_v2"])
        assert governing == "doc_v2"

    def test_is_superseded(self, dag):
        """Test superseded document detection."""
        assert dag.is_superseded("doc_v1")
        assert not dag.is_superseded("doc_v2")