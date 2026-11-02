# SECURITY.md — STRIDE Threat Model & SHA-256 Provenance Ledger

## 1. STRIDE Threat Model

| Threat | Vector | Mitigation |
|--------|--------|------------|
| **Spoofing** | Fake document injection | SHA-256 document registry; HMAC-signed provenance receipts |
| **Tampering** | Corpus modification after ingestion | Immutable document store; content-addressable storage |
| **Repudiation** | Denying answer origin | Cryptographic provenance ledger with SHA-256 chain |
| **Information Disclosure** | Sensitive policy leakage | Role-based document access; query audit logging |
| **Denial of Service** | Resource exhaustion via adversarial queries | Rate limiting; circuit breakers on LLM calls |
| **Elevation of Privilege** | Unauthorized admin operations | Principle of least privilege; signed admin tokens |

## 2. SHA-256 Provenance Ledger

Every TruthGuard answer emits a **Provenance Receipt** containing:

```json
{
  "query": "user question",
  "answer_hash": "sha256(final_answer + sorted(citations))",
  "retrieved_passages": [
    {"doc_id": "POL-2023-v1", "passage_hash": "sha256(text)", "span": [start, end]}
  ],
  "contradiction_edges": [...],
  "claim_audits": [...],
  "resolution_rule_applied": "EXPLICIT_SUPERSESSION",
  "timestamp": "ISO-8601",
  "receipt_hash": "sha256(entire_receipt_without_this_field)"
}
```

The `receipt_hash` forms a hash chain for audit integrity.

## 3. MCP Server Security
- Tool exposure requires explicit capability grants
- All MCP calls authenticated via shared secret or mTLS
- Input validation on all tool parameters
- Audit log for every MCP invocation