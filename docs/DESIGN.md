# DESIGN.md — TruthGuard "Git-Diff for Truth" UI Specification

## 1. Visual Aesthetic
- **Theme**: High-trust Enterprise Forensic Console (Slate-900 dark header, crisp white/slate-50 workspace cards, semantic status badges).
- **Status Color System**:
  - `Emerald (#10B981)`: Verified & Active Governing Source (`AMD-2025-03`)
  - `Amber (#F59E0B)`: Superseded / Stale Source (`POL-2023-v1`, `FAQ-2023-HR`)
  - `Rose (#F43F5E)`: Direct Contradiction / Unbacked Hallucination / Deadlock Abstention

## 2. Four Core UI Panels (Single-Screen Executive Layout)
1. **Top Bar & Scenario Selector**:
   - Instant one-click pills for Virtusa evaluators:
     - `[Scenario 1: Policy v1 vs March 2025 Amendment]`
     - `[Scenario 2: Deadlocked Security Policies (Abstention)]`
     - `[Scenario 3: FAQ vs SLA Contradiction]`
     - `[Scenario 4: Hallucination Trap (Unbacked Claim)]`

2. **Left Column — Multi-Agent Execution Trace**:
   - Live step cards showing latency and token/NLI metrics for:
     - `1. Retriever Agent` (Passages pulled + DAG lineage expansion)
     - `2. Synthesizer Agent` (Draft claims generated)
     - `3. Critic / Adversary Agent` (Contradictions found, stale docs flagged, unbacked claims stripped)
     - `4. Resolution Step` (Final epistemic state)

3. **Center Column — Transparent Resolution Verdict & "Git-Diff for Truth"**:
   - Banner showing `RESOLVED_CONFLICT` (with governing doc badge) or `UNRESOLVABLE_ABSTAIN` (warning banner).
   - **Side-by-Side Conflict Diff Card**: Left pane shows the superseded/conflicting claim (`Policy v1: "Up to 4 days remote"` highlighted in Amber/Red with `SUPERSEDED` stamp); Right pane shows the governing claim (`Amendment Mar 2025: "Max 2 days remote"` highlighted in Emerald with `GOVERNING` stamp).

4. **Right Column — Bi-Temporal Authority DAG & Claim Audit Ledger**:
   - Interactive node graph (`FAQ-2023` --> `POL-2023-v1` --> `POL-2024-v2` --> `AMD-2025-03`).
   - Cryptographic `SHA-256 Provenance Receipt` with copy/download JSON button.