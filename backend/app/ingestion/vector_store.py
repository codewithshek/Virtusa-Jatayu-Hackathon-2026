"""Hybrid Retriever: FAISS dense vectors + BM25 keyword search with Reciprocal Rank Fusion."""

import pickle
from pathlib import Path
from typing import List, Dict, Any, Optional, Tuple
from dataclasses import dataclass

import numpy as np
import faiss
from rank_bm25 import BM25Okapi
from sentence_transformers import SentenceTransformer

from app.schemas.models import RetrievedPassage, PassageMetadata
from app.ingestion.parser import DocumentChunk, load_corpus
from app.ingestion.authority_dag import authority_dag
from app.config import settings


@dataclass
class RetrievalResult:
    passage: RetrievedPassage
    bm25_score: float
    dense_score: float
    fused_score: float


class HybridRetriever:
    """Hybrid retrieval combining BM25 and dense vector search with RRF."""

    def __init__(self):
        self.embedding_model = SentenceTransformer(settings.embedding_model)
        self.chunks: List[DocumentChunk] = []
        self.passages: List[RetrievedPassage] = []
        self.bm25: Optional[BM25Okapi] = None
        self.faiss_index: Optional[faiss.Index] = None
        self.embeddings: Optional[np.ndarray] = None
        self._initialized = False

    def initialize(self):
        """Load corpus and build indices."""
        if self._initialized:
            return

        print("Loading corpus...")
        self.chunks = load_corpus()

        print("Building BM25 index...")
        tokenized_corpus = [chunk.text.lower().split() for chunk in self.chunks]
        self.bm25 = BM25Okapi(tokenized_corpus)

        print("Building FAISS index...")
        texts = [chunk.text for chunk in self.chunks]
        self.embeddings = self.embedding_model.encode(texts, show_progress_bar=True, convert_to_numpy=True)

        # Normalize for cosine similarity
        faiss.normalize_L2(self.embeddings)

        dimension = self.embeddings.shape[1]
        self.faiss_index = faiss.IndexFlatIP(dimension)
        self.faiss_index.add(self.embeddings)

        # Create RetrievedPassage objects
        self.passages = [
            RetrievedPassage(
                passage_id=f"p_{i}",
                text=chunk.text,
                score=0.0,  # Will be set during retrieval
                metadata=chunk.metadata
            )
            for i, chunk in enumerate(self.chunks)
        ]

        self._initialized = True
        print(f"Initialized with {len(self.passages)} passages")

    def retrieve(self, query: str, top_k: Optional[int] = None) -> List[RetrievalResult]:
        """Hybrid retrieval with Reciprocal Rank Fusion."""
        if not self._initialized:
            self.initialize()

        if top_k is None:
            top_k = settings.top_k_retrieval

        # BM25 retrieval
        tokenized_query = query.lower().split()
        bm25_scores = self.bm25.get_scores(tokenized_query)
        bm25_top_indices = np.argsort(bm25_scores)[::-1][:top_k * 2]  # Get more for fusion

        # Dense retrieval
        query_embedding = self.embedding_model.encode([query], convert_to_numpy=True)
        faiss.normalize_L2(query_embedding)
        dense_scores, dense_indices = self.faiss_index.search(query_embedding, top_k * 2)

        # Reciprocal Rank Fusion
        k = 60  # RRF parameter
        fused_scores = {}

        # BM25 ranks
        for rank, idx in enumerate(bm25_top_indices):
            if idx not in fused_scores:
                fused_scores[idx] = 0
            fused_scores[idx] += 1.0 / (k + rank + 1)

        # Dense ranks
        for rank, idx in enumerate(dense_indices[0]):
            if idx not in fused_scores:
                fused_scores[idx] = 0
            fused_scores[idx] += 1.0 / (k + rank + 1)

        # Sort by fused score
        sorted_indices = sorted(fused_scores.keys(), key=lambda x: fused_scores[x], reverse=True)

        # Build results
        results = []
        for idx in sorted_indices[:top_k]:
            passage = self.passages[idx]
            results.append(RetrievalResult(
                passage=passage,
                bm25_score=float(bm25_scores[idx]),
                dense_score=float(dense_scores[0][list(dense_indices[0]).index(idx)]) if idx in dense_indices[0] else 0.0,
                fused_score=fused_scores[idx]
            ))

        # Update passage scores
        for r in results:
            r.passage.score = r.fused_score

        # DAG Lineage Expansion: fetch superseding documents
        if settings.enable_dag_expansion:
            results = self._expand_with_dag(results, query)

        return results

    def _expand_with_dag(self, results: List[RetrievalResult], query: str) -> List[RetrievalResult]:
        """Expand retrieval with superseding documents from DAG."""
        expanded_passages = {r.passage.passage_id: r for r in results}
        original_doc_ids = set(r.passage.metadata.doc_id for r in results)

        # For each retrieved document, check if there are superseding documents
        for doc_id in original_doc_ids:
            superseding = authority_dag.get_superseding_documents(doc_id)
            for sup_id in superseding:
                # Find passages from superseding document
                for i, chunk in enumerate(self.chunks):
                    if chunk.metadata.doc_id == sup_id:
                        # Check if we already have this passage
                        passage_id = f"p_{i}"
                        if passage_id not in expanded_passages:
                            passage = self.passages[i]
                            expanded_passages[passage_id] = RetrievalResult(
                                passage=passage,
                                bm25_score=0.0,
                                dense_score=0.0,
                                fused_score=0.0
                            )

        return list(expanded_passages.values())


# Global instance
hybrid_retriever = HybridRetriever()