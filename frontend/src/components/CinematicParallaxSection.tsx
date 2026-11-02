import React from 'react'
import {
  ShieldAlert,
  GitBranch,
  FileCheck2,
  Lock,
  ArrowRight,
  Terminal,
  Activity,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react'
import { SlabData } from './HeroScene3D'

interface CinematicParallaxSectionProps {
  hoveredSlab?: SlabData | null
}

export const CinematicParallaxSection: React.FC<CinematicParallaxSectionProps> = ({ hoveredSlab }) => {
  return (
    <div className="relative w-full z-20 pointer-events-auto">
      {/* Floating Raycast Telemetry HUD (Appears when hovering any 3D slab) */}
      {hoveredSlab && (
        <aside
          aria-label="3D Policy Slab Inspector"
          className="fixed bottom-8 right-8 z-50 glass-slab-active p-4 rounded-xl max-w-sm border border-emerald-500/40 shadow-2xl backdrop-blur-2xl transition-all duration-300 pointer-events-none"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold uppercase">
              Raycast Slab Active
            </span>
            <span className="text-[10px] font-mono text-slate-400">{hoveredSlab.tier}</span>
          </div>
          <div className="text-base font-bold text-white mb-1 font-display">{hoveredSlab.id}</div>
          <div className="text-xs font-mono text-slate-300 mb-2">{hoveredSlab.clause}</div>
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-400">Precedence: <strong className="text-emerald-400">Tier {hoveredSlab.tierNum}</strong></span>
            <span className="text-cyan-400 font-bold">STATUS: {hoveredSlab.status}</span>
          </div>
        </aside>
      )}

      {/* ========================================================================= */}
      {/* BEAT 1: Asymmetric Swiss Hero (0% - 25% Scroll)                          */}
      {/* ========================================================================= */}
      <section className="min-h-screen flex flex-col justify-between px-6 md:px-16 pt-24 pb-16 max-w-7xl mx-auto">
        <div className="max-w-2xl">
          {/* Status Chip */}
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/60 text-slate-300 text-xs font-mono mb-8 backdrop-blur-md shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-semibold">NVIDIA NIM Grounded</span>
            <span className="text-slate-600">/</span>
            <span>Meta Llama 3.1 70B</span>
          </div>

          {/* Asymmetric Typography */}
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-white mb-8 leading-[1.04] font-display">
            Epistemic <br />
            Forensics for <br />
            <span className="text-slate-400">Contradictory</span> <br />
            Policy Corpora.
          </h1>

          <p className="text-base md:text-lg text-slate-300 leading-relaxed font-light mb-10 max-w-xl">
            When enterprise guidelines, union memos, and regulatory mandates conflict, standard RAG hallucinates a compromise.
            TruthGuard executes 3-vector adversarial verification, bi-temporal DAG precedence, and autonomous abstention.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href="#workbench-console"
              className="px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm tracking-wide transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <span>Launch Verification Console</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <span className="text-xs font-mono text-slate-400">
              Scroll down to inspect the 3D optical breakdown ↓
            </span>
          </div>
        </div>

        {/* Live Monolith Telemetry Ticker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-slate-800/80 font-mono text-xs text-slate-400">
          <div>
            <span className="text-slate-400 block mb-0.5">AUTHORITY ENGINE</span>
            <span className="text-white font-bold">5-Tier Precedence DAG</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">SUPERSESSION ACCURACY</span>
            <span className="text-emerald-400 font-bold">100.0% Verified</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">CONTRADICTION F1</span>
            <span className="text-cyan-400 font-bold">1.000 (Target ≥0.85)</span>
          </div>
          <div>
            <span className="text-slate-400 block mb-0.5">ABSTENTION GATE</span>
            <span className="text-amber-400 font-bold">Zero-Gamble Refusal</span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BEAT 2: Deontic Contradiction Isolation (25% - 55% Scroll)                */}
      {/* ========================================================================= */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 max-w-7xl mx-auto">
        {/* Monumental Watermark Typography behind HUD */}
        <div className="select-none pointer-events-none text-[12vw] font-extrabold text-slate-900/40 uppercase tracking-tighter font-display leading-none mb-4 -ml-2">
          Deontic Clash
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Chapter 02 // Deontic Logic Conflict</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-display">
              Contradiction <br />
              Isolation Matrix.
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Standard LLMs average contradictory numbers into an unbacked hallucination.
              TruthGuard models policy statements as interval bounds and evaluates cross-document deontic satisfiability.
            </p>

            <div className="glass-slab-conflict p-5 rounded-2xl border border-rose-500/40 font-mono text-xs">
              <div className="text-rose-400 font-bold mb-2 flex items-center justify-between">
                <span>SYMBOLIC EVALUATION</span>
                <span>STATUS: UNSAT</span>
              </div>
              <div className="p-3 bg-black/60 rounded-lg text-slate-200 mb-2">
                <code>[0, 1] ∩ [4, 5] = ∅ (Empty Set)</code>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                HR-POL-2024 (Tier 3) restricts remote work to 1 day/week, while ENG-MEMO-2025 permits 4 days.
                The 3-vector Critic triggers an immediate conflict edge before synthesis.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {/* Split Inspection HUD Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass-slab p-5 rounded-2xl border border-amber-500/30">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
                  <span>TIER 3 · FORMAL POLICY</span>
                  <span>DOC: HR-POL-2024</span>
                </div>
                <div className="text-lg font-bold text-white mb-2 font-display">
                  Remote Work Allowance
                </div>
                <p className="text-xs font-mono text-slate-300 mb-3">
                  "Employees may work remotely up to one (1) day per week with manager approval."
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  Interval Bound: <strong className="text-amber-400">[0, 1] days/wk</strong>
                </div>
              </div>

              <div className="glass-slab p-5 rounded-2xl border border-rose-500/40">
                <div className="flex items-center justify-between text-xs font-mono text-rose-400 mb-2">
                  <span>TIER 4 · DEPT MEMO</span>
                  <span>DOC: ENG-MEMO-2025</span>
                </div>
                <div className="text-lg font-bold text-white mb-2 font-display">
                  Engineering Department Addendum
                </div>
                <p className="text-xs font-mono text-slate-300 mb-3">
                  "Engineering personnel are permitted remote flexibility up to four (4) days per week."
                </p>
                <div className="text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-800">
                  Interval Bound: <strong className="text-rose-400">[4, 5] days/wk</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BEAT 3: Bi-Temporal DAG & Silent Revocation (55% - 85% Scroll)            */}
      {/* ========================================================================= */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 max-w-7xl mx-auto">
        {/* Monumental Watermark */}
        <div className="select-none pointer-events-none text-[12vw] font-extrabold text-slate-900/40 uppercase tracking-tighter font-display leading-none mb-4 -ml-2">
          Authority DAG
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <GitBranch className="w-3.5 h-3.5" />
              <span>Chapter 03 // Bi-Temporal Graph Lineage</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-display">
              Deterministic <br />
              Supersession.
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              When documents possess different authority tiers, TruthGuard applies formal precedence:
              Regulatory Mandate (Tier 1) &gt; Security Directive (Tier 2) &gt; Policy (Tier 3) &gt; Memo (Tier 4) &gt; FAQ (Tier 5).
              Stale legacy documents are pruned from governing synthesis.
            </p>

            <div className="glass-slab-active p-5 rounded-2xl border border-emerald-500/40 font-mono text-xs">
              <div className="text-emerald-400 font-bold mb-2 flex items-center justify-between">
                <span>SILENT REVOCATION DETECTOR</span>
                <span>DELTA IDENTIFIED</span>
              </div>
              <p className="text-slate-300 text-xs mb-3">
                Mandate <strong className="text-white">REG-2025-09</strong> supersedes legacy FAQ by requiring FIDO2 Hardware Keys, silently invalidating SMS 2FA.
              </p>
              <div className="p-3 bg-black/60 rounded border border-emerald-500/30 text-emerald-300 text-[11px]">
                <code>+ REG-2025-09: FIDO2 Token Required [ENFORCED]</code><br />
                <code className="text-rose-400">- FAQ-2023-LEGACY: SMS 2FA [REVOKED & PRUNED]</code>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* 5-Tier Precedence Hierarchy Card */}
            <div className="glass-slab rounded-2xl p-6 border border-slate-800 space-y-3 font-mono text-xs">
              <div className="text-slate-400 uppercase tracking-wider text-[11px] pb-2 border-b border-slate-800 flex items-center justify-between">
                <span>Authority Hierarchy Tree</span>
                <span className="text-cyan-400">Bi-Temporal Resolution Engine</span>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                <span className="text-emerald-400 font-bold">TIER 1 · REGULATORY MANDATE</span>
                <span className="text-white">REG-2025-09 (GOVERNING)</span>
              </div>

              <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between">
                <span className="text-cyan-400 font-bold">TIER 2 · SECURITY DIRECTIVE</span>
                <span className="text-slate-200">SEC-2025-11 (ACTIVE)</span>
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between">
                <span className="text-amber-400 font-bold">TIER 3 · FORMAL POLICY</span>
                <span className="text-slate-300">HR-POL-2024 v2.1</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-400">
                <span>TIER 4 · DEPT MEMO</span>
                <span>ENG-MEMO-2025 (EXCEPTION)</span>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-between text-rose-400">
                <span className="line-through">TIER 5 · GENERAL FAQ</span>
                <span className="text-xs uppercase font-bold bg-rose-500/20 px-2 py-0.5 rounded">PRUNED / STALE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* BEAT 4: Cryptographic Merkle Provenance (85% - 100% Scroll)               */}
      {/* ========================================================================= */}
      <section className="min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="select-none pointer-events-none text-[12vw] font-extrabold text-slate-900/40 uppercase tracking-tighter font-display leading-none mb-4 -ml-2">
          Merkle Seal
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>Chapter 04 // Cryptographic Grounding</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight font-display">
              Tamper-Proof <br />
              SHA-256 Provenance.
            </h2>

            <p className="text-sm md:text-base text-slate-300 leading-relaxed">
              Every synthesized claim is decomposed into atomic propositions bound directly to cited passage byte-spans.
              The resolution engine computes an HMAC SHA-256 Merkle root to seal the verification trace.
            </p>

            <a
              href="#workbench-console"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-400 font-mono text-xs tracking-wider uppercase transition-colors"
            >
              <span>Test Live Query in Workbench Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="lg:col-span-6">
            <div className="glass-slab-active p-6 rounded-2xl border border-teal-500/40 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-teal-400 font-bold uppercase">PROVENANCE RECEIPT</span>
                <span className="text-slate-400">HMAC-SHA256</span>
              </div>

              <div>
                <span className="text-slate-400 block mb-1">MERKLE ROOT HASH:</span>
                <div className="p-3 bg-black/60 rounded border border-slate-800 text-cyan-300 break-all select-all font-mono text-xs">
                  0xd13f7247a0607f672c779c2d7f32dd5a1e5da1df4ac7b87c6539603fbb5872e2
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">ATOMIC CLAIMS:</span>
                  <span className="text-emerald-400 font-bold text-sm">3 / 3 Verified</span>
                </div>
                <div className="p-3 rounded bg-slate-900/80 border border-slate-800">
                  <span className="text-slate-400 block text-[11px]">UNBACKED REJECTED:</span>
                  <span className="text-white font-bold text-sm">0 Permitted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
