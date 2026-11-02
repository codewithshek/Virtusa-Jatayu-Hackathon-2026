"""Orchestrator: LangGraph StateGraph (with zero-dependency async fallback) wiring the 4 core TruthGuard agents."""

import time
from typing import Dict, Any

try:
    from langgraph.graph import StateGraph, START, END
    LANGGRAPH_AVAILABLE = True
except ImportError:
    LANGGRAPH_AVAILABLE = False

from app.agents.retriever_agent import retrieve_agent
from app.agents.synthesizer_agent import synthesizer_agent
from app.agents.critic_agent import critic_agent
from app.agents.resolver_agent import resolver_agent
from app.schemas.models import TruthGuardResponse, ResolutionStatus


class TruthGuardOrchestrator:
    """4-Agent pipeline orchestrator with all 5 Zero-Prior-Art verifiers wired."""

    def __init__(self):
        self.graph = self._build_graph() if LANGGRAPH_AVAILABLE else None

    def _build_graph(self):
        """Build the LangGraph state machine when langgraph is installed."""
        builder = StateGraph(dict)
        builder.add_node("retriever", self._run_retriever)
        builder.add_node("synthesizer", self._run_synthesizer)
        builder.add_node("critic", self._run_critic)
        builder.add_node("resolver", self._run_resolver)

        builder.add_edge(START, "retriever")
        builder.add_edge("retriever", "synthesizer")
        builder.add_edge("synthesizer", "critic")
        builder.add_edge("critic", "resolver")
        builder.add_edge("resolver", END)
        return builder.compile()

    async def _run_retriever(self, state: Dict[str, Any]) -> Dict[str, Any]:
        return await retrieve_agent(state)

    async def _run_synthesizer(self, state: Dict[str, Any]) -> Dict[str, Any]:
        return await synthesizer_agent(state)

    async def _run_critic(self, state: Dict[str, Any]) -> Dict[str, Any]:
        return await critic_agent(state)

    async def _run_resolver(self, state: Dict[str, Any]) -> Dict[str, Any]:
        return await resolver_agent(state)

    async def invoke(self, query: str, top_k: int = 10) -> TruthGuardResponse:
        """Execute the full 4-agent + 5-Zero-Prior-Art pipeline for a query."""
        start_time = time.time()

        initial_state: Dict[str, Any] = {
            "query": query,
            "top_k": top_k,
            "trace": [],
            "latency_ms": 0.0
        }

        if self.graph is not None and hasattr(self.graph, "ainvoke"):
            result = await self.graph.ainvoke(initial_state)
        else:
            result = await self._run_pipeline_manual(initial_state)

        elapsed_ms = (time.time() - start_time) * 1000

        return TruthGuardResponse(
            query=result.get("query", query),
            status=result.get("status", ResolutionStatus.CONSISTENT),
            final_answer=result.get("final_answer", ""),
            positions_surfaced=result.get("positions", []),
            contradictions_detected=result.get("contradictions", []),
            claim_audits=result.get("claim_audits", []),
            retrieved_passages=result.get("passages", []),
            provenance_sha256=result.get("provenance_sha256", ""),
            merkle_provenance=result.get("merkle_provenance", {}),
            silent_revocations=result.get("silent_revocations", []),
            corpus_hygiene=result.get("corpus_hygiene", {}),
            counterfactual_probes=result.get("counterfactual_probes", []),
            latency_ms=elapsed_ms,
            trace=result.get("trace", [])
        )

    async def _run_pipeline_manual(self, state: Dict[str, Any]) -> Dict[str, Any]:
        state = await retrieve_agent(state)
        state = await synthesizer_agent(state)
        state = await critic_agent(state)
        state = await resolver_agent(state)
        return state


orchestrator = TruthGuardOrchestrator()