# EVALUATION.md — Benchmark Metrics & Evaluation Protocol

## 1. Evaluation Dimensions

| Metric | Description | Target |
|--------|-------------|--------|
| **Conflict Detection F1** | Precision/Recall on detecting actual contradictions in retrieved passages | ≥ 0.85 |
| **Supersession Accuracy** | % of cases where governing document correctly identified via DAG | 100% |
| **Hallucination Rejection Rate** | % of unbacked claims correctly flagged & stripped by Critic | ≥ 0.95 |
| **Abstention Precision** | % of deadlocked queries correctly triggering UNRESOLVABLE_ABSTAIN | 100% |
| **p50 Latency** | Median end-to-end query latency | ≤ 3000ms |
| **p95 Latency** | 95th percentile latency | ≤ 8000ms |

## 2. Benchmark Corpus
50 adversarial queries across 5 conflict clusters:
- Cluster 1: Remote Work (supersession by amendment)
- Cluster 2: Data Retention (deadlocked abstention)
- Cluster 3: Telecom SLA (tiered authority)
- Cluster 4: Healthcare SOP (emergency override)
- Cluster 4: Cloud Expenses (unbacked claim trap)

## 3. Comparison Baselines
- **Standard RAG**: Single-pass concatenated-prompt RAG
- **Multi-Agent RAG**: Without adversarial critic (MADAM-RAG style without NLI)
- **TruthGuard**: Full 4-agent pipeline with 3-vector critic

## 4. Automated Evaluation Script
`backend/evaluate_benchmark.py` runs all queries and outputs a Markdown scorecard with per-cluster breakdown.