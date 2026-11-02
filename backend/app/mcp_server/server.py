"""MCP Server for TruthGuard - Model Context Protocol tool exposure."""

import json
from typing import Any, Dict, List, Optional
from mcp.server.fastapi import serve_app
from mcp.server.models import Tool
from fastapi import FastAPI

from app.agents.orchestrator import orchestrator
from app.ingestion.authority_dag import authority_dag
from app.config import settings


# Define MCP tools
TOOLS = [
    Tool(
        name="query_with_conflict_verification",
        description="Query TruthGuard with full adversarial conflict verification. "
                    "Returns answer with provenance and any detected contradictions.",
        inputSchema={
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The question to answer"},
                "top_k": {"type": "integer", "description": "Number of passages to retrieve", "default": 10}
            },
            "required": ["query"]
        }
    ),
    Tool(
        name="inspect_document_authority_lineage",
        description="Get the authority lineage (supersession DAG) for a document.",
        inputSchema={
            "type": "object",
            "properties": {
                "doc_id": {"type": "string", "description": "Document ID to inspect"}
            },
            "required": ["doc_id"]
        }
    ),
    Tool(
        name="verify_draft_claims",
        description="Audit one or more claims against the current corpus for support and validity.",
        inputSchema={
            "type": "object",
            "properties": {
                "claims": {
                    "type": "array",
                    "items": {"type": "string"},
                    "description": "List of claims to verify"
                }
            },
            "required": ["claims"]
        }
    )
]


async def handle_tool_call(name: str, arguments: Dict[str, Any]) -> Dict[str, Any]:
    """Handle MCP tool calls."""
    if name == "query_with_conflict_verification":
        query = arguments["query"]
        top_k = arguments.get("top_k", settings.top_k_retrieval)

        response = await orchestrator.invoke(query=query, top_k=top_k)

        return {
            "query": response.query,
            "status": response.status,
            "answer": response.final_answer,
            "positions": [
                {
                    "doc_id": p.doc_id,
                    "title": p.title,
                    "claim": p.claim_text,
                    "is_governing": p.is_governing,
                    "is_stale": p.is_stale
                }
                for p in response.positions_surfaced
            ],
            "contradictions": [
                {
                    "between": [c.passage_a_id, c.passage_b_id],
                    "confidence": c.confidence,
                    "resolution": c.resolution_rule.value if c.resolution_rule else None
                }
                for c in response.contradictions_detected
            ],
            "provenance_sha256": response.provenance_sha256,
            "latency_ms": response.latency_ms
        }

    elif name == "inspect_document_authority_lineage":
        doc_id = arguments["doc_id"]

        # Initialize DAG if needed
        if not authority_dag._built:
            authority_dag.build_from_manifest()

        passage = authority_dag.nodes.get(doc_id)
        if not passage:
            return {"error": f"Document {doc_id} not found"}

        lineage = authority_dag.get_lineage_path(doc_id)
        superseded = authority_dag.get_superseded_documents(doc_id)
        superseding = authority_dag.get_superseding_documents(doc_id)

        return {
            "document": {
                "doc_id": passage.doc_id,
                "title": passage.title,
                "effective_date": passage.effective_date,
                "authority_tier": passage.authority_tier.name,
                "supersedes": passage.supersedes
            },
            "lineage_path": lineage,
            "supersedes": superseded,
            "superseded_by": superseding
        }

    elif name == "verify_draft_claims":
        claims = arguments["claims"]

        from app.verification.claim_auditor import claim_auditor
        from app.ingestion.vector_store import hybrid_retriever

        # Get recent passages for context
        if not hybrid_retriever._initialized:
            hybrid_retriever.initialize()

        all_passages = list(hybrid_retriever.passages)

        results = []
        for claim_text in claims:
            from app.schemas.models import AtomicClaim
            claim = AtomicClaim(
                claim_id=f"claim_{hash(claim_text) % 10000}",
                statement=claim_text,
                cited_passage_ids=[],
                verbatim_quotes=[]
            )
            audit = claim_auditor.audit_claim(claim, all_passages)
            results.append({
                "claim": claim_text,
                "supported": audit.is_supported,
                "failure_reason": audit.failure_reason
            })

        return {"claims": results}

    else:
        return {"error": f"Unknown tool: {name}"}


# Create FastAPI app
app = FastAPI(title="TruthGuard MCP Server")


@app.get("/.well-known/mcp/tools")
async def list_tools():
    """List available MCP tools."""
    return {"tools": TOOLS}


@app.post("/mcp/tool/call")
async def call_tool(name: str, arguments: Dict[str, Any]):
    """Call an MCP tool."""
    return await handle_tool_call(name, arguments)


if __name__ == "__main__":
    # Run as MCP server
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)