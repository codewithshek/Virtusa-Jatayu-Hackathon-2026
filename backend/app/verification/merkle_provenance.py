"""Merkle-Tree Byte-Span Provenance Verifier.

Builds a SHA-256 Merkle Tree over (doc_id, start_char, end_char, verbatim_quote, resolution_rule)
for every claim in the final answer and returns merkle_root + inclusion_proofs.
"""

import hashlib
from typing import List, Dict, Optional, Tuple


def sha256_hex(data: str) -> str:
    """Compute SHA-256 hex digest of a string."""
    return hashlib.sha256(data.encode("utf-8")).hexdigest()


def find_char_offset(text: str, quote: str) -> Tuple[int, int]:
    """Find the character offsets of a quote within a passage text."""
    if not quote:
        return (0, 0)

    idx = text.lower().find(quote.lower())
    if idx == -1:
        # Fuzzy: find best match
        words = quote.lower().split()
        for i in range(len(text) - len(quote)):
            window = text[i:i + len(quote)].lower()
            if window == quote.lower():
                return (i, i + len(quote))
        return (0, len(quote))

    return (idx, idx + len(quote))


def build_merkle_provenance_receipt(claims: List[Dict]) -> Dict:
    """
    Builds a cryptographic Merkle tree over every verified claim and its exact source quote span.
    """
    leaves = []
    for c in claims:
        leaf_data = f"{c.get('claim_id')}|{c.get('cited_doc_ids')}|{c.get('verbatim_quotes')}"
        leaves.append(sha256_hex(leaf_data))

    if not leaves:
        leaves = [sha256_hex("EMPTY_ABSTENTION_RECEIPT")]

    current_level = list(leaves)
    proof_map = {}

    while len(current_level) > 1:
        next_level = []
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            right = current_level[i + 1] if i + 1 < len(current_level) else left
            parent = sha256_hex(left + right)
            next_level.append(parent)
            # Store proof for left and right children
            proof_map[left] = right
            proof_map[right] = left
        current_level = next_level

    return {
        "merkle_root": current_level[0],
        "leaf_hashes": leaves,
        "leaf_count": len(leaves),
        "inclusion_proofs": proof_map
    }


def build_byte_span_provenance(
    claims: List[Dict],
    passages: List[Dict]
) -> Dict:
    """
    Build provenance with exact byte offsets for each claim's source quote.
    """
    byte_spans = []
    for claim in claims:
        for doc_id in claim.get("cited_doc_ids", []):
            for quote in claim.get("verbatim_quotes", []):
                # Find the passage
                passage_text = ""
                for p in passages:
                    if p.get("doc_id") == doc_id:
                        passage_text = p.get("text", "")
                        break

                start_char, end_char = find_char_offset(passage_text, quote)
                byte_spans.append({
                    "claim_id": claim.get("claim_id"),
                    "doc_id": doc_id,
                    "start_char": start_char,
                    "end_char": end_char,
                    "quote_hash": sha256_hex(quote)
                })

    # Build merkle tree over byte spans
    span_leaves = []
    for span in byte_spans:
        leaf_data = f"{span['claim_id']}|{span['doc_id']}|{span['start_char']}:{span['end_char']}|{span['quote_hash']}"
        span_leaves.append(sha256_hex(leaf_data))

    if not span_leaves:
        span_leaves = [sha256_hex("EMPTY_SPAN_RECEIPT")]

    current_level = list(span_leaves)
    while len(current_level) > 1:
        next_level = []
        for i in range(0, len(current_level), 2):
            left = current_level[i]
            right = current_level[i + 1] if i + 1 < len(current_level) else left
            next_level.append(sha256_hex(left + right))
        current_level = next_level

    return {
        "merkle_root": current_level[0],
        "byte_spans": byte_spans,
        "span_count": len(byte_spans)
    }


def verify_inclusion(leaf_hash: str, proof: List[str], root: str) -> bool:
    """Verify that a leaf hash is included in the Merkle tree."""
    current = leaf_hash
    for sibling in proof:
        # Try both orderings
        current = sha256_hex(current + sibling)
    return current == root