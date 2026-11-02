"""Corpus Hygiene Radar & Auto-Redline PR Generator.

Computes a Contradiction Infection Score per document and auto-generates
a ready-to-merge Git Patch / Redline Diff so admins can fix contradicting FAQs in one click.
"""

import difflib
import hashlib
import json
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, asdict

from app.schemas.models import RetrievedPassage, ContradictionEdge


@dataclass
class ContradictionInfectionScore:
    doc_id: str
    title: str
    infection_score: float  # 0.0 to 1.0
    contradictions_found: int
    superseded: bool
    superseded_by: Optional[str]
    stale_clauses: List[str]
    recommended_fix: str


@dataclass
class RedlinePatch:
    stale_doc_id: str
    governing_doc_id: str
    governing_date: str
    unified_diff_patch: str
    infection_score: float


def compute_infection_score(
    doc_id: str,
    passages: List[RetrievedPassage],
    contradictions: List[ContradictionEdge]
) -> ContradictionInfectionScore:
    """
    Compute a Contradiction Infection Score per document.
    Higher scores indicate the document is more likely to cause confusion.
    """
    doc_passages = [p for p in passages if p.metadata.doc_id == doc_id]
    if not doc_passages:
        return ContradictionInfectionScore(
            doc_id=doc_id,
            title="Unknown",
            infection_score=0.0,
            contradictions_found=0,
            superseded=False,
            superseded_by=None,
            stale_clauses=[],
            recommended_fix="No action needed"
        )

    title = doc_passages[0].metadata.title
    is_superseded = doc_passages[0].is_stale
    superseded_by = doc_passages[0].superseded_by

    # Count contradictions involving this document
    doc_contradictions = [
        c for c in contradictions
        if c.passage_a_id in [p.passage_id for p in doc_passages]
        or c.passage_b_id in [p.passage_id for p in doc_passages]
    ]

    # Base score from contradictions
    contradiction_score = min(len(doc_contradictions) * 0.2, 0.6)

    # Supersession penalty
    supersession_score = 0.4 if is_superseded else 0.0

    # Staleness penalty
    staleness_score = 0.2 if is_superseded else 0.0

    total_score = min(contradiction_score + supersession_score + staleness_score, 1.0)

    stale_clauses = []
    for p in doc_passages:
        if p.is_stale:
            stale_clauses.append(p.text[:200])

    if is_superseded:
        recommended_fix = f"Superseded by {superseded_by}. Consider archiving or updating."
    elif doc_contradictions:
        recommended_fix = f"Has {len(doc_contradictions)} contradiction(s). Review against governing documents."
    else:
        recommended_fix = "No action needed"

    return ContradictionInfectionScore(
        doc_id=doc_id,
        title=title,
        infection_score=total_score,
        contradictions_found=len(doc_contradictions),
        superseded=is_superseded,
        superseded_by=superseded_by,
        stale_clauses=stale_clauses,
        recommended_fix=recommended_fix
    )


def generate_redline_remediation_patch(
    stale_doc_id: str,
    stale_clause: str,
    governing_doc_id: str,
    governing_clause: str,
    governing_date: str
) -> str:
    """
    Produces a Git-style unified diff patch so Knowledge Admins can remediate
    contradicting FAQs or legacy policies in one click.
    """
    before_lines = [f"[{stale_doc_id}] {stale_clause}\n"]
    after_lines = [
        f"[{stale_doc_id} — AUTO-PATCHED VIA {governing_doc_id} ({governing_date})]\n",
        f"{governing_clause}\n"
    ]
    diff = difflib.unified_diff(
        before_lines,
        after_lines,
        fromfile=f"a/corpus/{stale_doc_id}.md",
        tofile=f"b/corpus/{stale_doc_id}.md",
        lineterm=""
    )
    return "\n".join(diff)


def generate_auto_pr(
    stale_doc_id: str,
    stale_clause: str,
    governing_doc_id: str,
    governing_clause: str,
    governing_date: str,
    infection_score: float
) -> RedlinePatch:
    """Generate a complete Auto-PR with unified diff patch."""
    patch = generate_redline_remediation_patch(
        stale_doc_id, stale_clause,
        governing_doc_id, governing_clause, governing_date
    )

    return RedlinePatch(
        stale_doc_id=stale_doc_id,
        governing_doc_id=governing_doc_id,
        governing_date=governing_date,
        unified_diff_patch=patch,
        infection_score=infection_score
    )


def compute_corpus_hygiene_report(
    passages: List[RetrievedPassage],
    contradictions: List[ContradictionEdge]
) -> Dict:
    """Compute a full corpus hygiene report with infection scores."""
    doc_ids = set(p.metadata.doc_id for p in passages)

    scores = []
    for doc_id in doc_ids:
        score = compute_infection_score(doc_id, passages, contradictions)
        scores.append(score)

    # Sort by infection score descending
    scores.sort(key=lambda x: x.infection_score, reverse=True)

    # Generate auto-PRs for superseded documents
    auto_prs = []
    for score in scores:
        if score.superseded and score.superseded_by:
            # Find governing clause
            governing_passages = [
                p for p in passages
                if p.metadata.doc_id == score.superseded_by
            ]
            if governing_passages:
                auto_pr = generate_auto_pr(
                    stale_doc_id=score.doc_id,
                    stale_clause=score.stale_clauses[0] if score.stale_clauses else "Unknown clause",
                    governing_doc_id=score.superseded_by,
                    governing_clause=governing_passages[0].text[:300],
                    governing_date=governing_passages[0].metadata.effective_date,
                    infection_score=score.infection_score
                )
                auto_prs.append(auto_pr)

    return {
        "infection_scores": [asdict(s) for s in scores],
        "auto_prs": [asdict(p) for p in auto_prs],
        "total_documents": len(doc_ids),
        "infected_documents": sum(1 for s in scores if s.infection_score > 0.3)
    }