"""Cryptographic provenance ledger: SHA-256 signed JSON receipts for audit trails."""

import hashlib
import hmac
import json
import time
from typing import Dict, Any, List, Optional
from datetime import datetime

from app.config import settings


class ProvenanceLedger:
    """
    SHA-256 cryptographic provenance receipts for TruthGuard answers.
    Each answer gets a signed receipt for compliance audit chains.
    """

    def __init__(self, secret_key: str):
        self.secret_key = secret_key.encode() if isinstance(secret_key, str) else secret_key

    def generate_receipt(
        self,
        query: str,
        answer: str,
        passages: List[Dict[str, Any]],
        contradictions: List[Dict[str, Any]],
        claim_audits: List[Dict[str, Any]],
        resolution_rule: str,
        latency_ms: float
    ) -> Dict[str, Any]:
        """Generate a provenance receipt with cryptographic signing."""
        timestamp = datetime.utcnow().isoformat()

        # Canonical form for hashing
        receipt_data = {
            "query": query,
            "answer_hash": hashlib.sha256(answer.encode()).hexdigest()[:16],
            "document_hashes": [
                hashlib.sha256(p["text"].encode()).hexdigest()[:16]
                for p in passages
            ],
            "contradiction_count": len(contradictions),
            "claim_audit_summary": [
                {"id": c["claim_id"], "supported": c["is_supported"]}
                for c in claim_audits
            ],
            "resolution_rule": resolution_rule,
            "timestamp": timestamp,
            "latency_ms": latency_ms
        }

        # Compute SHA-256 hash of canonical form
        canonical_str = json.dumps(receipt_data, sort_keys=True, separators=(',', ':'))
        receipt_hash = hashlib.sha256(canonical_str.encode()).hexdigest()

        # Add HMAC signature
        signature = hmac.new(
            self.secret_key,
            receipt_hash.encode(),
            hashlib.sha256
        ).hexdigest()

        return {
            "receipt": receipt_data,
            "receipt_hash": receipt_hash,
            "signature": signature,
            "signed_at": timestamp
        }

    def verify_receipt(self, receipt: Dict[str, Any], provided_hash: str) -> bool:
        """Verify receipt hash and signature."""
        # Recompute hash
        canonical_str = json.dumps(receipt.get("receipt", {}), sort_keys=True, separators=(',', ':'))
        computed_hash = hashlib.sha256(canonical_str.encode()).hexdigest()

        # Check hash matches
        if computed_hash != provided_hash:
            return False

        # Verify signature
        expected_signature = hmac.new(
            self.secret_key,
            computed_hash.encode(),
            hashlib.sha256
        ).hexdigest()

        return expected_signature == receipt.get("signature")

    def export_receipt(self, receipt: Dict[str, Any]) -> str:
        """Export receipt as JSON string for storage/transmission."""
        return json.dumps(receipt, indent=2)


# Global instance
provenance_ledger = ProvenanceLedger(settings.provenance_secret)