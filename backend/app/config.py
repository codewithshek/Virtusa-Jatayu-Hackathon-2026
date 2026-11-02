"""Configuration settings for TruthGuard backend."""

from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field


class Settings(BaseSettings):
    # LLM Provider Settings
    llm_provider: str = Field(default="nvidia", description="LLM provider: nvidia, ollama, openai, anthropic, gemini")
    nvidia_api_key: Optional[str] = Field(default="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", description="NVIDIA NIM API key")
    nvidia_base_url: str = Field(default="https://integrate.api.nvidia.com/v1", description="NVIDIA NIM base URL")
    nvidia_model: str = Field(default="meta/llama-3.1-70b-instruct", description="NVIDIA NIM model")
    ollama_base_url: str = Field(default="http://localhost:11434", description="Ollama base URL")
    ollama_model: str = Field(default="llama3.1:8b", description="Ollama model name")
    openai_api_key: Optional[str] = Field(default=None, description="OpenAI API key")
    openai_model: str = Field(default="gpt-4o-mini", description="OpenAI model")
    anthropic_api_key: Optional[str] = Field(default=None, description="Anthropic API key")
    anthropic_model: str = Field(default="claude-3-5-sonnet-20241022", description="Anthropic model")

    # NLI Model Settings
    nli_model_name: str = Field(default="none", description="NLI model for contradiction detection: none for heuristic, or cross-encoder/nli-deberta-v3-base")
    nli_device: str = Field(default="cpu", description="Device for NLI model: cpu or cuda")
    nli_threshold: float = Field(default=0.70, description="Contradiction confidence threshold")
    entailment_threshold: float = Field(default=0.75, description="Entailment threshold for claim verification")

    # Retrieval Settings
    top_k_retrieval: int = Field(default=10, description="Top K passages to retrieve")
    bm25_weight: float = Field(default=0.5, description="BM25 weight in hybrid retrieval")
    dense_weight: float = Field(default=0.5, description="Dense vector weight in hybrid retrieval")
    embedding_model: str = Field(default="all-MiniLM-L6-v2", description="Sentence transformer model for embeddings")

    # Corpus Settings
    corpus_path: str = Field(default="../../corpus/raw_docs", description="Path to corpus documents")
    manifest_path: str = Field(default="../../corpus/manifest.json", description="Path to corpus manifest")

    # Agent Settings
    max_synthesis_retries: int = Field(default=1, description="Max retries for synthesizer after critic rejection")
    enable_dag_expansion: bool = Field(default=True, description="Enable DAG lineage expansion during retrieval")

    # Provenance
    provenance_secret: str = Field(default="truthguard-dev-secret-change-in-prod", description="HMAC secret for provenance receipts")

    # Server
    host: str = Field(default="0.0.0.0", description="Server host")
    port: int = Field(default=8000, description="Server port")

    class Config:
        env_file = (".env", "backend/.env")
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()