"""Symbolic Deontic & Numeric Interval Constraint Solver.

Deterministically extracts formal policy tuples (Actor, Modality, Condition, [min,max], unit)
and runs interval-intersection math to catch numeric deadlocks that neural NLI misses.
"""

import re
from dataclasses import dataclass
from typing import List, Optional, Tuple

from app.schemas.models import ContradictionEdge, NLILabel, ResolutionRule


@dataclass
class DeonticRule:
    doc_id: str
    passage_id: str
    subject: str
    modality: str          # "MUST" | "MAY" | "FORBIDDEN"
    numeric_range: Optional[Tuple[float, float]]  # (min_val, max_val)
    unit: str
    raw_span: str


def extract_numeric_constraints(doc_id: str, passage_id: str, text: str) -> List[DeonticRule]:
    """Deterministically extracts numeric & deontic policy bounds from text chunks."""
    rules: List[DeonticRule] = []
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]

    for sent in sentences:
        low = sent.lower()
        modality = "MUST" if any(w in low for w in ["must", "mandatory", "required", "shall"]) else (
            "FORBIDDEN" if any(w in low for w in ["prohibited", "forbidden", "must not", "never", "cannot"]) else "MAY"
        )
        # Match "up to X days", "maximum of X days", "at most X days"
        m_max = re.search(r'(?:up to|maximum of|max|at most|within|not exceed)\s+(\d+(?:\.\d+)?)\s*(days?|hours?|months?|years?|%)', low)
        # Match "at least X days", "minimum of X days", "no less than X days"
        m_min = re.search(r'(?:at least|minimum of|min|no less than|exceeding)\s+(\d+(?:\.\d+)?)\s*(days?|hours?|months?|years?|%)', low)
        # Match exact "X days per week"
        m_exact = re.search(r'(\d+(?:\.\d+)?)\s*(days?|hours?|months?|years?|%)\s+(?:per week|a week|mandatory|retention)', low)

        if m_max:
            val, unit = float(m_max.group(1)), m_max.group(2).rstrip('s')
            rules.append(DeonticRule(doc_id, passage_id, "policy_bound", modality, (0.0, val), unit, sent))
        elif m_min:
            val, unit = float(m_min.group(1)), m_min.group(2).rstrip('s')
            rules.append(DeonticRule(doc_id, passage_id, "policy_bound", modality, (val, float("inf")), unit, sent))
        elif m_exact:
            val, unit = float(m_exact.group(1)), m_exact.group(2).rstrip('s')
            rules.append(DeonticRule(doc_id, passage_id, "policy_bound", modality, (val, val), unit, sent))
    return rules


def check_symbolic_contradiction(r1: DeonticRule, r2: DeonticRule) -> Optional[str]:
    """Checks if two extracted policy constraints are mathematically or deontically incompatible."""
    if r1.doc_id == r2.doc_id or r1.unit != r2.unit:
        return None
    if r1.numeric_range and r2.numeric_range:
        low1, high1 = r1.numeric_range
        low2, high2 = r2.numeric_range
        overlap_low = max(low1, low2)
        overlap_high = min(high1, high2)
        if overlap_low > overlap_high or (high1 != high2 and high1 < float("inf") and high2 < float("inf")):
            return (
                f"Symbolic Interval Conflict ({r1.unit}): {r1.doc_id} specifies [{low1}, {high1}] "
                f"while {r2.doc_id} specifies [{low2}, {high2}]."
            )
    if (r1.modality == "MUST" and r2.modality == "FORBIDDEN") or (r1.modality == "FORBIDDEN" and r2.modality == "MUST"):
        return f"Deontic Modality Conflict: {r1.doc_id} mandates ({r1.modality}) what {r2.doc_id} prohibits ({r2.modality})."
    return None


def detect_symbolic_conflict(c1: DeonticRule, c2: DeonticRule) -> Optional[ContradictionEdge]:
    """Deterministically detects deontic conflicts and disjoint numeric intervals."""
    conflict_msg = check_symbolic_contradiction(c1, c2)
    if conflict_msg:
        return ContradictionEdge(
            passage_a_id=c1.passage_id,
            passage_b_id=c2.passage_id,
            nli_label=NLILabel.CONTRADICTION,
            confidence=0.95,
            conflict_summary=conflict_msg,
            resolution_rule=ResolutionRule.DEADLOCK
        )
    return None


def analyze_passages_symbolically(passages) -> List[ContradictionEdge]:
    """Analyze a list of RetrievedPassage objects for symbolic conflicts."""
    all_rules = []
    for p in passages:
        rules = extract_numeric_constraints(p.metadata.doc_id, p.passage_id, p.text)
        all_rules.extend(rules)

    contradictions = []
    for i, r1 in enumerate(all_rules):
        for r2 in all_rules[i+1:]:
            edge = detect_symbolic_conflict(r1, r2)
            if edge:
                contradictions.append(edge)

    return contradictions