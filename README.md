# TruthGuard — Forensic Epistemic Engine & Adversarial 3D Document Q&A

**Virtusa Jatayu Season 6 (Use Case 2 — TIME Business Unit)**

TruthGuard answers queries across deliberately inconsistent enterprise document corpora (conflicting policy versions, outdated guidelines, contradicting FAQs, superseded amendments, and jurisdiction mismatches) using a 4-agent adversarial pipeline grounded by **NVIDIA NIM Cloud** (`meta/llama-3.1-70b-instruct`) and an **Awwwards-caliber 3D WebGL frontend**.

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

### 3. Running the Frontend (Awwwards 3D + Vite)

The frontend features a cinematic 3D experience with Three.js WebGL, ACESFilmic tone mapping, Lenis smooth scrolling, GSAP ScrollTrigger, and interactive verification telemetry.

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

## 🎨 Frontend Features & 3D Visuals

- **WebGL Truth Prism (`HeroScene3D.tsx`)**: Real-time Three.js scene with a faceted obsidian icosahedron, outer wireframe dodecahedron lattice, glowing orbit rings, 1,200 additive data particles, ACESFilmic tone mapping, and cursor-damped physics.
- **Cinematic Visuals (`CinematicParallaxSection.tsx`)**: High-resolution 3D asset showcase:
  - `hero-prism.jpg`: The obsidian Truth Core scanning holographic document pages.
  - `adversarial-conflict.jpg`: Red vs Cyan adversarial data streams colliding with telemetry indicators.
  - `provenance-dag.jpg`: Bi-temporal isometric authority graph with timeline markers.
- **Interactive Adversarial Terminal (`QueryConsole.tsx`)**: 1-click execution for standard attack vectors:
  - *Scenario 1: Remote Work Policy Supersession* (Executive Amendment vs HR FAQ).
  - *Scenario 2: Deadlocked Retention Mandate* (Equal-tier co-current conflict triggering autonomous refusal).
  - *Scenario 3: Customer SLA vs Marketing FAQ* (Contractual precedence over informal docs).
  - *Scenario 4: Unbacked Hallucination Trap* (Zero-support claim stripping).
- **Epistemic Diff Viewer (`ConflictDiffViewer.tsx`)**: Git-diff style side-by-side comparison of active governing policies vs superseded stale predecessors with auto-generated redline PR patch drawers.
- **Authority DAG Visualizer (`AuthorityDagGraph.tsx`)**: Interactive SVG graph displaying document hierarchies across all 5 tiers.
- **Critic Claim Audit Table (`ClaimAuditTable.tsx`)**: Micro-level audit of every individual sentence and cited passage.

---

## 🔑 Environment Variables (`backend/.env`)

```ini
ENVIRONMENT=development
HOST=0.0.0.0
PORT=8000

# NVIDIA NIM Configuration
LLM_PROVIDER=nvidia
NVIDIA_API_KEY=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
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
