"""Counterfactual Query Immunizer.

Strips user presuppositions from leading queries and generates an orthogonal
falsification query (Q^-) that actively hunts for revocations, caps, and superseding amendments.
"""

import re
from typing import List, Dict, Any, Optional

from app.schemas.models import RetrievedPassage
from app.ingestion.vector_store import hybrid_retriever
from app.ingestion.authority_dag import authority_dag


def generate_counterfactual_probes(query: str) -> List[str]:
    """
    Generates orthogonal retrieval probes that strip presuppositions and actively
    hunt for superseding amendments, revocations, caps, and exceptions.
    """
    clean_q = re.sub(r'^(since|given that|because|assuming)\s+[^,]+,\s*', '', query, flags=re.IGNORECASE)
    probes = [
        query,
        f"{clean_q} amendment supersedes revision cap limit exception",
        f"{clean_q} revoked deprecated updated policy effective date"
    ]
    return list(dict.fromkeys(probes))


def fuse_counterfactual_results(
    original_passages: List[RetrievedPassage],
    counterfactual_passages: List[RetrievedPassage],
    k: int = 10
) -> List[RetrievedPassage]:
    """Fuse original and counterfactual retrieval results using RRF."""
    seen_ids = set()
    fused = []

    # Collect all passages with their scores
    all_passages = {}

    for rank, p in enumerate(original_passages):
        if p.passage_id not in all_passages:
            all_passages[p.passage_id] = {"passage": p, "rrf_score": 0.0}
        all_passages[p.passage_id]["rrf_score"] += 1.0 / (60 + rank + 1)

    for rank, p in enumerate(counterfactual_passages):
        if p.passage_id not in all_passages:
            all_passages[p.passage_id] = {"passage": p, "rrf_score": 0.0}
        all_passages[p.passage_id]["rrf_score"] += 1.0 / (60 + rank + 1)

    # Sort by RRF score
    sorted_passages = sorted(
        all_passages.values(),
        key=lambda x: x["rrf_score"],
        reverse=True
    )[:k]

    for entry in sorted_passages:
        passage = entry["passage"]
        passage.score = entry["rrf_score"]
        fused.append(passage)

    return fused


async def retrieve_with_counterfactual(
    query: str,
    top_k: int = 10
) -> List[RetrievedPassage]:
    """
    Main entry point: generate counterfactual probes, retrieve, and fuse results.
    """
    if not hybrid_retriever._initialized:
        hybrid_retriever.initialize()

    if not authority_dag._built:
        authority_dag.build_from_manifest()

    probes = generate_counterfactual_probes(query)

    # Get original results
    original_results = hybrid_retriever.retrieve(query, top_k)
    original_passages = [r.passage for r in original_results]

    # Get counterfactual results
    cf_passages = []
    for probe in probes[1:]:  # Skip the original query itself
        cf_results = hybrid_retriever.retrieve(probe, top_k)
        cf_passages.extend([r.passage for r in cf_results])

    # Fuse
    fused = fuse_counterfactual_results(original_passages, cf_passages, k=top_k)

    return fused