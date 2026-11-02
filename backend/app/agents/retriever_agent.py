"""Retriever Agent: Hybrid retrieval + Counterfactual Probe + DAG expansion + metadata extraction."""

import time
from typing import List, Dict, Any

from app.schemas.models import RetrievedPassage
from app.ingestion.vector_store import hybrid_retriever, RetrievalResult
from app.ingestion.authority_dag import authority_dag
from app.ingestion.counterfactual_retriever import (
    generate_counterfactual_probes,
    fuse_counterfactual_results,
)


class RetrieverAgentState(Dict[str, Any]):
    """State for Retriever Agent."""
    query: str
    top_k: int
    passages: List[RetrievedPassage]
    counterfactual_probes: List[str]
    trace: List[Dict[str, Any]]


async def retrieve_agent(state: RetrieverAgentState) -> RetrieverAgentState:
    """
    Retriever Agent:
    1. Generate Counterfactual Falsification Probes (Zero-Prior-Art Module #2)
    2. Perform hybrid retrieval (BM25 + dense vectors) across original & counterfactual probes
    3. Expand with DAG supersession lineage
    4. Extract and validate staleness metadata
    """
    start_time = time.time()

    query = state.get("query", "")
    top_k = state.get("top_k", 10)

    if not query:
        return {**state, "error": "No query provided"}

    if not authority_dag._built:
        authority_dag.build_from_manifest()

    # 1. Generate Counterfactual Probes to defeat presupposition bias
    probes = generate_counterfactual_probes(query)

    # 2. Retrieve original + counterfactual passages
    retrieval_results: List[RetrievalResult] = hybrid_retriever.retrieve(query, top_k)
    original_passages = [r.passage for r in retrieval_results]

    cf_passages: List[RetrievedPassage] = []
    for probe in probes[1:]:
        cf_res = hybrid_retriever.retrieve(probe, max(3, top_k // 2))
        cf_passages.extend([r.passage for r in cf_res])

    fused_passages = fuse_counterfactual_results(original_passages, cf_passages, k=top_k)

    # Map back retrieval scores for trace
    score_lookup = {r.passage.passage_id: r for r in retrieval_results}
    all_doc_ids = [p.metadata.doc_id for p in fused_passages]

    passages: List[RetrievedPassage] = []
    trace_entries = []

    for passage in fused_passages:
        doc_id = passage.metadata.doc_id
        other_ids = [d for d in all_doc_ids if d != doc_id]
        is_stale, superseded_by = authority_dag.check_staleness(doc_id, other_ids)

        passage.is_stale = is_stale
        passage.superseded_by = superseded_by
        passages.append(passage)

        r_info = score_lookup.get(passage.passage_id)
        trace_entries.append({
            "step": "retriever",
            "action": "counterfactual_hybrid_retrieval",
            "doc_id": doc_id,
            "probes_used": len(probes),
            "score": passage.score,
            "bm25_score": r_info.bm25_score if r_info else 0.0,
            "dense_score": r_info.dense_score if r_info else 0.0,
            "is_stale": is_stale,
            "superseded_by": superseded_by
        })

    elapsed_ms = (time.time() - start_time) * 1000

    return RetrieverAgentState(
        query=query,
        top_k=top_k,
        passages=passages,
        counterfactual_probes=probes,
        trace=state.get("trace", []) + trace_entries,
        latency_ms=elapsed_ms
    )