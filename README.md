# TruthGuard — Adversarial Document Q&A · The Provenance Edition

**Virtusa Jatayu Season 6 (Use Case 2 — TIME Business Unit)**

TruthGuard answers queries across deliberately inconsistent enterprise document corpora (conflicting policy versions, outdated guidelines, contradicting FAQs, superseded amendments, and jurisdiction mismatches) using a 4-agent adversarial pipeline grounded by **NVIDIA NIM Cloud** (`meta/llama-3.1-70b-instruct`) and an **editorial, research-driven frontend** — *The Provenance Edition, Winter ’26*.

---

## 🏛️ System Architecture

```
User Query
    │
    ▼
┌─────────────────────────────────┐
│ 1. Retriever Agent              │  Hybrid BM25 + Dense FAISS + Bi-Temporal DAG Expansion
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ 2. Synthesizer Agent            │  NVIDIA NIM (Llama 3.1 70B) Grounded Claim Decomposition
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ 3. Critic / Adversary Agent     │  3-Vector: Cross-Doc NLI + Staleness DAG + Hallucination Check
└────────────────┬────────────────┘
                 ▼
┌─────────────────────────────────┐
│ 4. Resolution Engine            │  Deterministic 5-Tier Precedence + Autonomous Abstention Gate
└────────────────┬────────────────┘
                 ▼
[Final Epistemic Verdict + SHA-256 Merkle Provenance Receipt]
```

---

## ⚡ How to Run the Project

### 1. Prerequisites
- **Node.js** v18+ and **npm**
- **Python** 3.11 or 3.12 (virtual environment pre-configured in `backend/.venv`)

---

### 2. Running the Backend (FastAPI + NVIDIA NIM)

The backend is configured to use the **NVIDIA NIM API** with model `meta/llama-3.1-70b-instruct`.

```powershell
# Open terminal 1:
cd backend

# Activate virtual environment and start server:
.venv\Scripts\python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

Backend health & documentation:
- Health check: `http://127.0.0.1:8000/api/health`
- Interactive Swagger docs: `http://127.0.0.1:8000/docs`
- Corpus DAG Lineage: `http://127.0.0.1:8000/api/corpus`

---

### 3. Running the Frontend (Vite + Editorial UI)

The frontend is **The Provenance Edition**: a black-cover parchment edition with engraved line art (SVG, not WebGL), a deep-violet provenance chapter, Lenis smooth scrolling, GSAP ScrollTrigger reveals, and a live adversarial verification console. Vite proxies `/api` to `http://127.0.0.1:8000`, so run the backend first. If the backend is offline, the UI runs on deterministic local fallbacks for all four case files.

```powershell
# Open terminal 2:
cd frontend

# Start the Vite development server:
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

### 4. Running Benchmark & Tests

#### Run the 19-test verification suite:
```powershell
cd backend
.venv\Scripts\python -m pytest tests/ -q
```
*(All 19 tests pass 100% across abstention, contradiction, staleness DAG, and unbacked claim filtering).*

#### Run the benchmark scorecard evaluation:
```powershell
cd backend
.venv\Scripts\python evaluate_benchmark.py
```
*(Generates `BENCHMARK_SCORECARD.md`: 5/5 (100.0%) correct resolutions, F1: 1.000, 100% supersession accuracy, 100% abstention precision).*

---

## 🎨 Frontend Features — "The Provenance Edition" (Winter ’26)

- **Cover Hero (`Hero.tsx`)**: Oversized framed plate — "One edition." — with Instrument Serif italic and Davinci-style star-map line art (`DavinciLines.tsx`).
- **Premise (`Premise.tsx`)**: The edition thesis, the capability strip (4 agents · 5 tiers · 3 resolution modes · 1 Merkle root), and the evaluation scorecard (F1 1.000, 19/19).
- **The Tribunal (`Tribunal.tsx`)**: Four engraved agent cards — The Archivist (retriever), The Advocate (synthesizer), The Adversary (critic), The Magistrate (resolver) — with AgentGlyph seals and machine specs.
- **Conflict Atlas (`ConflictAtlas.tsx`)**: Tabbed anatomy of stale, superseded, and contradicting passages with evidence spans and resolution rulings.
- **Verification Workbench (`Workbench.tsx`)**: Live `/api/query` console — enter a query or load one of four deterministic case files; the audit pipeline animates (Retrieve → Expand → Synthesize → Adversary → Resolve), then renders the full results ledger.
- **Results Ledger (`results/Results.tsx`)**: Position cards (Governing / Stale / Unresolved), claim-level audit with entailment reasons and supporting passage IDs, contradiction ledger, agent trace, and a copyable Merkle receipt with `/api/audit/{hash}` link. Unsupported claims are shown as *stripped*, never silently dropped.
- **Authority DAG (`AuthorityDag.tsx`)**: The bi-temporal precedence graph across all 5 tiers (FAQ 01 → Regulatory mandate 05), backed by live `/api/corpus` data when the backend is up.
- **Provenance Chapter (`Provenance.tsx`)**: Deep-violet interlude with a Merkle tree diagram (`MerkleDiagram.tsx`) and a byte-span inclusion-proof walkthrough.
- **Edition Notes (`EditionNotes.tsx`) & Closing (`ClosingCta.tsx`)**: Release notes with script drop caps, then the back cover.

---

## 🔑 Environment Variables (`backend/.env`)

```ini
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000

# NVIDIA NIM Configuration
LLM_PROVIDER=nvidia
NVIDIA_API_KEY=your-nvidia-api-key-here
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-70b-instruct

# Corpus Paths
CORPUS_PATH=../corpus/raw_docs
MANIFEST_PATH=../corpus/manifest.json

# Verification & Retrieval Settings
TOP_K_RETRIEVAL=10
BM25_WEIGHT=0.5
DENSE_WEIGHT=0.5
EMBEDDING_MODEL=all-MiniLM-L6-v2
NLI_MODEL_NAME=none
NLI_DEVICE=cpu
NLI_THRESHOLD=0.70
ENTAILMENT_THRESHOLD=0.75
```

---

## 🏆 Key Performance Scorecard

| Metric | Score | Target | Status |
|--------|-------|--------|--------|
| **Conflict Detection F1** | **1.000** | ≥ 0.85 | ✅ Surpassed |
| **Supersession Accuracy** | **100.0%** | 100% | ✅ Perfect |
| **Abstention Precision** | **100.0%** | 100% | ✅ Zero Gambles |
| **Benchmark Accuracy** | **5 / 5 (100%)** | 100% | ✅ Full Pass |
| **Build & Unit Tests** | **19 / 19 (100%)** | 100% | ✅ Passing |

---

## 📜 License
MIT License · Built for Virtusa Jatayu Hackathon 2026.
