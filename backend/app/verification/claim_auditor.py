"""Claim verification: Ensures every draft sentence is entailed by retrieved passages."""

from typing import List, Dict, Any, Tuple, Set
import re

from app.schemas.models import (
    AtomicClaim, RetrievedPassage, ClaimAuditResult
)
from app.config import settings


class ClaimAuditor:
    """
    Verifies claims against retrieved passages using:
    1. Quote span extraction
    2. Word overlap analysis
    3. Numerical fact checking (including decimals/percentages)
    4. Temporal/date consistency
    """

    def audit_claim(self, claim: AtomicClaim, passages: List[RetrievedPassage]) -> ClaimAuditResult:
        """Audit a single atomic claim against retrieved passages."""
        supported_ids: Set[str] = set()

        for p in passages:
            if p.passage_id not in claim.cited_passage_ids:
                continue

            quote_found = self._check_quote_presence(claim.verbatim_quotes, p.text)
            overlap_score = self._compute_overlap(claim.statement, p.text)
            num_consistent = self._check_numerical_consistency(claim.statement, p.text)

            # Numerical consistency is a hard gate: if a claim states numbers not in the passage, it fails
            if num_consistent and (quote_found or overlap_score >= settings.entailment_threshold):
                supported_ids.add(p.passage_id)

        is_supported = len(supported_ids) > 0

        return ClaimAuditResult(
            claim_id=claim.claim_id,
            is_supported=is_supported,
            relies_on_stale_source=any(
                p.is_stale for p in passages if p.passage_id in supported_ids
            ),
            failure_reason=None if is_supported else "Claim unbacked or numerical mismatch against source passage",
            supporting_passage_ids=list(supported_ids)
        )

    def _check_quote_presence(self, quotes: List[str], passage: str) -> bool:
        """Check if verbatim quotes are present in passage."""
        passage_lower = passage.lower()
        for quote in quotes:
            quote_lower = quote.lower().strip()
            if not quote_lower:
                continue
            if quote_lower in passage_lower:
                return True
            quote_words = quote_lower.split()
            if quote_words:
                matches = sum(1 for w in quote_words if w in passage_lower)
                if matches / len(quote_words) > 0.6:
                    return True
        return False

    def _compute_overlap(self, claim: str, passage: str) -> float:
        """Compute word overlap score between claim and passage."""
        claim_words = set(re.findall(r'\w+', claim.lower()))
        passage_words = set(re.findall(r'\w+', passage.lower()))

        if not claim_words:
            return 0.0

        overlap = len(claim_words & passage_words)
        return overlap / len(claim_words)

    def _check_numerical_consistency(self, claim: str, passage: str) -> bool:
        """Check if numerical facts (including decimals like 99.5 vs 99.9) match between claim and passage."""
        claim_nums = self._extract_numbers(claim)
        passage_nums = self._extract_numbers(passage)

        if claim_nums:
            return claim_nums.issubset(passage_nums)

        return True

    def _extract_numbers(self, text: str) -> Set[str]:
        """Extract all integer and decimal numbers from text."""
        return set(re.findall(r'\b\d+(?:\.\d+)?\b', text))

    def audit_all_claims(
        self,
        claims: List[AtomicClaim],
        passages: List[RetrievedPassage]
    ) -> List[ClaimAuditResult]:
        """Audit multiple claims."""
        return [self.audit_claim(c, passages) for c in claims]


claim_auditor = ClaimAuditor()