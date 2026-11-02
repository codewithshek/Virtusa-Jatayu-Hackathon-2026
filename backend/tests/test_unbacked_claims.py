"""Tests for hallucination / unbacked claim stripping by Critic agent."""

import pytest

from app.schemas.models import DocAuthorityTier, DocType, PassageMetadata, RetrievedPassage, AtomicClaim
from app.verification.claim_auditor import ClaimAuditor, claim_auditor


class TestUnbackedClaims:
    """Test detection and stripping of unbacked claims."""

    @pytest.fixture
    def auditor(self):
        return ClaimAuditor()

    def test_supported_claim_passes(self, auditor):
        """Test that a claim backed by passage passes audit."""
        passage = RetrievedPassage(
            passage_id="p1",
            text="Employees may work remotely up to 2 days per week.",
            score=0.9,
            metadata=PassageMetadata(
                doc_id="POL-2024-v2",
                title="Remote Work Policy v2",
                version="2.0",
                effective_date="2024-03-01",
                authority_tier=DocAuthorityTier.POLICY,
                doc_type=DocType.POLICY
            )
        )

        claim = AtomicClaim(
            claim_id="c1",
            statement="Employees may work remotely up to 2 days per week.",
            cited_passage_ids=["p1"],
            verbatim_quotes=["up to 2 days per week"]
        )

        result = auditor.audit_claim(claim, [passage])

        assert result.is_supported
        assert len(result.supporting_passage_ids) == 1

    def test_unbacked_claim_fails(self, auditor):
        """Test that a claim not supported by any passage fails."""
        passage = RetrievedPassage(
            passage_id="p1",
            text="Employees may work remotely up to 2 days per week.",
            score=0.9,
            metadata=PassageMetadata(
                doc_id="POL-2024-v2",
                title="Remote Work Policy v2",
                version="2.0",
                effective_date="2024-03-01",
                authority_tier=DocAuthorityTier.POLICY,
                doc_type=DocType.POLICY
            )
        )

        # Claim mentions penalty (not in passage)
        claim = AtomicClaim(
            claim_id="c2",
            statement="Employees who violate remote policy face a $500 penalty.",
            cited_passage_ids=["p1"],
            verbatim_quotes=["$500 penalty"]  # This quote doesn't exist
        )

        result = auditor.audit_claim(claim, [passage])

        assert not result.is_supported
        assert result.failure_reason is not None

    def test_numerical_fact_extraction(self, auditor):
        """Test that numerical facts can be validated."""
        passage = RetrievedPassage(
            passage_id="p1",
            text="The SLA guarantees 99.9% monthly uptime.",
            score=0.9,
            metadata=PassageMetadata(
                doc_id="SLA-2024",
                title="Service Level Agreement",
                version="1.0",
                effective_date="2024-01-01",
                authority_tier=DocAuthorityTier.AMENDMENT
            )
        )

        # Claim with correct number
        claim_correct = AtomicClaim(
            claim_id="c3",
            statement="The SLA guarantees 99.9% uptime.",
            cited_passage_ids=["p1"],
            verbatim_quotes=["99.9%"]
        )

        result = auditor.audit_claim(claim_correct, [passage])
        assert result.is_supported

        # Claim with wrong number
        claim_wrong = AtomicClaim(
            claim_id="c4",
            statement="The SLA guarantees 99.5% uptime.",  # Different number
            cited_passage_ids=["p1"],
            verbatim_quotes=["99.5%"]
        )

        result = auditor.audit_claim(claim_wrong, [passage])
        assert not result.is_supported

    def test_stale_source_flagging(self, auditor):
        """Test that claims based on stale sources are flagged."""
        passage = RetrievedPassage(
            passage_id="p1",
            text="Employees may work remotely up to 4 days per week.",
            score=0.8,
            metadata=PassageMetadata(
                doc_id="POL-2023-v1",
                title="Remote Work Policy v1",
                version="1.0",
                effective_date="2023-01-15",
                authority_tier=DocAuthorityTier.POLICY,
                doc_type=DocType.POLICY
            ),
            is_stale=True,
            superseded_by="AMD-2025-03"
        )

        claim = AtomicClaim(
            claim_id="c5",
            statement="Employees may work remotely up to 4 days per week.",
            cited_passage_ids=["p1"],
            verbatim_quotes=["4 days per week"]
        )

        result = auditor.audit_claim(claim, [passage])

        # Claim is supported but based on stale source
        assert result.is_supported
        assert result.relies_on_stale_source

    def test_mixed_support_passage_and_quote(self, auditor):
        """Test claim supports via word overlap, not verbatim quote."""
        passage = RetrievedPassage(
            passage_id="p1",
            text="All full-time employees are eligible for remote work up to two days weekly.",
            score=0.85,
            metadata=PassageMetadata(
                doc_id="POL-2024-v2",
                title="Remote Work Policy v2",
                version="2.0",
                effective_date="2024-03-01",
                authority_tier=DocAuthorityTier.POLICY,
                doc_type=DocType.POLICY
            )
        )

        # Statement uses different wording but same meaning
        claim = AtomicClaim(
            claim_id="c6",
            statement="Remote work is allowed up to two days per week.",
            cited_passage_ids=["p1"],
            verbatim_quotes=["remote work allowed"]  # Partially present
        )

        result = auditor.audit_claim(claim, [passage])

        # Should be supported via word overlap
        assert result.is_supported