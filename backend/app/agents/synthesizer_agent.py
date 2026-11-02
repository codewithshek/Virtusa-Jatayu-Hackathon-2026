"""Synthesizer Agent: Generates atomic claims from retrieved passages."""

import time
import re
import logging
from typing import List, Dict, Any, Optional

from app.config import settings
from app.schemas.models import AtomicClaim, RetrievedPassage

logger = logging.getLogger(__name__)


class SynthesizerAgentState(Dict[str, Any]):
    """State for Synthesizer Agent."""
    query: str
    passages: List[RetrievedPassage]
    claims: List[AtomicClaim]
    trace: List[Dict[str, Any]]
    needs_retry: bool = False


def _split_into_claims(text: str, passages: List[RetrievedPassage]) -> List[AtomicClaim]:
    """
    Decomposes candidate synthesis into atomic claims bound to highest-overlap source passages.
    """
    claims = []
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', text) if s.strip()]

    for i, sentence in enumerate(sentences):
        clean_sent = sentence.rstrip('.')
        if not clean_sent:
            continue

        # Link to MOST relevant passage (max word overlap, not min!)
        sent_words = set(re.findall(r'\w+', clean_sent.lower()))
        best_passage = max(
            passages,
            key=lambda p: len(sent_words & set(re.findall(r'\w+', p.text.lower())))
        )

        claim_id = f"c_{i+1}"
        claims.append(AtomicClaim(
            claim_id=claim_id,
            statement=clean_sent + ".",
            cited_passage_ids=[best_passage.passage_id],
            verbatim_quotes=[clean_sent[:100]]
        ))

    return claims


async def _synthesize_with_nvidia_nim(query: str, passages: List[RetrievedPassage]) -> Optional[str]:
    """Call NVIDIA NIM API to synthesize a factual response grounded in non-stale passages."""
    if not settings.nvidia_api_key:
        return None

    try:
        from openai import AsyncOpenAI
        client = AsyncOpenAI(
            base_url=settings.nvidia_base_url,
            api_key=settings.nvidia_api_key,
            timeout=10.0
        )

        context_blocks = "\n\n".join([
            f"Passage ID: {p.passage_id} (Doc: {p.metadata.doc_id if p.metadata else 'unknown'}, Date: {p.metadata.effective_date if p.metadata else 'unknown'}):\n{p.text}"
            for p in passages[:4]
        ])

        system_prompt = (
            "You are TruthGuard's Synthesizer Agent. Your task is to provide a concise, factual answer "
            "to the user query using strictly the verified passages provided below. "
            "Formulate 2 to 4 clear declarative factual sentences. Do not speculate or introduce unbacked external claims."
        )

        response = await client.chat.completions.create(
            model=settings.nvidia_model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Query: {query}\n\nEvidence Passages:\n{context_blocks}"}
            ],
            temperature=0.1,
            max_tokens=256
        )

        return response.choices[0].message.content.strip()
    except Exception as e:
        logger.warning(f"NVIDIA NIM synthesis failed or unentitled ({e}), falling back to deterministic extraction.")
        return None


async def synthesizer_agent(state: SynthesizerAgentState) -> SynthesizerAgentState:
    """
    Synthesizer Agent:
    1. Generate draft answer from retrieved passages (via NVIDIA NIM or deterministic fallback)
    2. Decompose into atomic claims with verbatim quotes
    3. Link each claim to source passages
    """
    start_time = time.time()

    query = state.get("query", "")
    passages = state.get("passages", [])
    trace = state.get("trace", [])

    if not passages:
        return {**state, "claims": [], "trace": trace + [{"error": "No passages to synthesize"}]}

    non_stale = [p for p in passages if not p.is_stale]
    relevant_passages = non_stale if non_stale else passages

    draft_answer = None
    provider_used = "deterministic_fallback"

    if settings.llm_provider == "nvidia" and settings.nvidia_api_key:
        draft_answer = await _synthesize_with_nvidia_nim(query, relevant_passages)
        if draft_answer:
            provider_used = f"nvidia_nim:{settings.nvidia_model}"

    if not draft_answer:
        draft_parts = []
        for p in relevant_passages[:3]:
            first_sent = re.split(r'(?<=[.!?])\s+', p.text.strip())[0]
            draft_parts.append(first_sent)
        draft_answer = " ".join(draft_parts)

    claims = _split_into_claims(draft_answer, passages)

    elapsed_ms = (time.time() - start_time) * 1000

    trace_entries = [{
        "step": "synthesizer",
        "action": "generate_claims",
        "provider": provider_used,
        "claim_count": len(claims),
        "draft_length": len(draft_answer),
        "latency_ms": elapsed_ms
    }]

    return SynthesizerAgentState(
        query=query,
        passages=passages,
        claims=claims,
        trace=trace + trace_entries,
        needs_retry=state.get("needs_retry", False),
        latency_ms=elapsed_ms
    )