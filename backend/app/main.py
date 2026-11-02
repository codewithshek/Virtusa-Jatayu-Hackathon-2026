"""FastAPI entry point for TruthGuard."""

import time
import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.schemas.models import QueryRequest, TruthGuardResponse
from app.agents.orchestrator import orchestrator
from app.ingestion.authority_dag import authority_dag
from app.ingestion.vector_store import hybrid_retriever

app = FastAPI(
    title="TruthGuard API",
    description="Adversarial Verification for Multi-Agent Document Q&A",
    version="0.1.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Initialize corpus and indices on startup."""
    print("Initializing TruthGuard...")

    # Build the authority DAG
    authority_dag.build_from_manifest()
    print("Authority DAG built successfully")

    # Initialize hybrid retriever (loads and indexes corpus)
    hybrid_retriever.initialize()
    print("Hybrid retriever initialized")


@app.post("/api/query", response_model=TruthGuardResponse)
async def query_endpoint(request: QueryRequest):
    """Query TruthGuard with a question."""
    try:
        response = await orchestrator.invoke(
            query=request.query,
            top_k=request.top_k or settings.top_k_retrieval
        )
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/corpus")
async def list_corpus():
    """List available documents in the corpus."""
    try:
        data = authority_dag.get_visualization_data()
        return {
            "nodes": data["nodes"],
            "edges": data["edges"],
            "documents": data["nodes"],
            "relationships": data["edges"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/audit/{sha256_hash}")
async def get_audit(sha256_hash: str):
    """Retrieve the audit receipt for a provenance hash."""
    # In production, would fetch from persistent store
    # For now, return a placeholder structure
    return JSONResponse({
        "receipt_hash": sha256_hash,
        "message": "Provenance receipt stored with this hash",
        "note": "Store receipts in persistent store for production use"
    })


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "timestamp": time.time()}


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=True
    )