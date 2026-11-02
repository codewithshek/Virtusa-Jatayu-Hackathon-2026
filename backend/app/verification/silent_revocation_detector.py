"""Silent Revocation Detector.

Aligns clauses across v1 -> v2 -> Amendment to detect "Silent Omissions"
(clauses present in v1 that vanished in v2 without explicit negation).
"""

import re
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass

from app.schemas.models import RetrievedPassage


@dataclass
class SilentRevocation:
    doc_id_v1: str
    doc_id_v2: str
    clause_v1: str
    clause_v2: Optional[str]
    is_silent_omission: bool
    reason: str


def extract_clauses(text: str) -> List[str]:
    """Extract clauses from text by splitting on headers and sentences."""
    clauses = []
    # Split by markdown headers
    header_pattern = re.compile(r'^(#{1,6})\s+(.+)$', re.MULTILINE)
    matches = list(header_pattern.finditer(text))

    if not matches:
        # Fallback: split by sentences
        sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]
        return sentences

    for i, match in enumerate(matches):
        start = match.end()
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        section_text = text[start:end].strip()
        if section_text:
            clauses.append(f"## {match.group(2)}\n{section_text[:300]}")

    return clauses


def compute_clause_similarity(clause1: str, clause2: str) -> float:
    """Compute semantic similarity between two clauses using word overlap."""
    words1 = set(clause1.lower().split())
    words2 = set(clause2.lower().split())

    if not words1 or not words2:
        return 0.0

    overlap = len(words1 & words2)
    return overlap / max(len(words1), len(words2))


def detect_silent_revocations(
    passages_v1: List[RetrievedPassage],
    passages_v2: List[RetrievedPassage]
) -> List[SilentRevocation]:
    """
    Detect silent revocations when v2 supersedes v1.
    A clause is a "silent revocation" if it exists in v1 but has no
    corresponding clause in v2 AND v2 doesn't explicitly negate it.
    """
    revocations = []

    for p1 in passages_v1:
        for p2 in passages_v2:
            if p1.metadata.doc_id == p2.metadata.doc_id:
                continue

            clauses_v1 = extract_clauses(p1.text)
            clauses_v2 = extract_clauses(p2.text)

            for clause_v1 in clauses_v1:
                # Find best matching clause in v2
                best_match = None
                best_score = 0.0

                for clause_v2 in clauses_v2:
                    score = compute_clause_similarity(clause_v1, clause_v2)
                    if score > best_score:
                        best_score = score
                        best_match = clause_v2

                # If no good match found, this might be a silent omission
                if best_score < 0.3 and best_match is None:
                    revocations.append(SilentRevocation(
                        doc_id_v1=p1.metadata.doc_id,
                        doc_id_v2=p2.metadata.doc_id,
                        clause_v1=clause_v1[:200],
                        clause_v2=None,
                        is_silent_omission=True,
                        reason=f"Clause in {p1.metadata.doc_id} has no corresponding clause in {p2.metadata.doc_id}"
                    ))
                elif best_score < 0.5:
                    revocations.append(SilentRevocation(
                        doc_id_v1=p1.metadata.doc_id,
                        doc_id_v2=p2.metadata.doc_id,
                        clause_v1=clause_v1[:200],
                        clause_v2=best_match[:200] if best_match else None,
                        is_silent_omission=False,
                        reason=f"Partial match ({best_score:.2f}) - possible modification"
                    ))

    return revocations


def analyze_silent_revocations(
    passages: List[RetrievedPassage]
) -> List[SilentRevocation]:
    """Analyze a list of passages for silent revocations across versions."""
    # Group passages by document family
    doc_groups = {}
    for p in passages:
        doc_id = p.metadata.doc_id
        if doc_id not in doc_groups:
            doc_groups[doc_id] = []
        doc_groups[doc_id].append(p)

    # Find v1/v2 pairs
    revocations = []
    doc_ids = list(doc_groups.keys())

    for i, doc_a in enumerate(doc_ids):
        for doc_b in doc_ids[i+1:]:
            # Check if one supersedes the other
            if doc_b in doc_groups[doc_a][0].metadata.supersedes:
                revocations.extend(detect_silent_revocations(
                    doc_groups[doc_a], doc_groups[doc_b]
                ))
            elif doc_a in doc_groups[doc_b][0].metadata.supersedes:
                revocations.extend(detect_silent_revocations(
                    doc_groups[doc_b], doc_groups[doc_a]
                ))

    return revocations