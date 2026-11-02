import React, { useRef, useState } from 'react'
import { ShieldCheck, GitMerge, FileCode, Layers, ArrowUpRight, Cpu, Eye } from 'lucide-react'

export const CinematicParallaxSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'conflict' | 'dag' | 'prism'>('conflict')

  return (
    <section className="relative py-24 px-6 md:px-12 max-w-7xl mx-auto z-10">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono mb-4 tracking-wider uppercase">
          <Eye className="w-3.5 h-3.5" />
          <span>Forensic Architecture & Visual Telemetry</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-6">
          Adversarial Verification Meets <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            Bi-Temporal Provenance
          </span>
        </h2>
        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          Traditional RAG collapses when enterprise documents contradict one another across time and authority tiers.
          TruthGuard isolates competing claims, resolves them using directed acyclic graph lineage, and cryptographically signs every synthesis.
        </p>
      </div>

      {/* Interactive Feature Showcase with Split Animation Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        {/* Card 1: Adversarial Conflict Resolution */}
        <div
          onClick={() => setActiveTab('conflict')}
          className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border ${
            activeTab === 'conflict'
              ? 'border-emerald-500/50 shadow-2xl shadow-emerald-500/10 bg-slate-900/80 scale-[1.02]'
              : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-900/40'
          }`}
        >
          <div className="relative h-64 overflow-hidden">
            <img
              src="/assets/adversarial-conflict.jpg"
              alt="Adversarial Conflict Resolution"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-mono">
                Cross-Doc NLI
              </span>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono">
              <GitMerge className="w-3 h-3 text-cyan-400" />
              <span>Contradiction Matrix</span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
              Adversarial Conflict Matrix
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Detects diametric policy contradictions across version boundaries. Eliminates hallucinated compromises by surfacing opposing evidence before resolution.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs font-mono text-slate-500">
              <span>NLI Confidence: 0.94</span>
              <span className="text-emerald-400 flex items-center gap-1">
                Active Verification <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Card 2: Bi-Temporal Lineage Graph */}
        <div
          onClick={() => setActiveTab('dag')}
          className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border ${
            activeTab === 'dag'
              ? 'border-cyan-500/50 shadow-2xl shadow-cyan-500/10 bg-slate-900/80 scale-[1.02]'
              : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-900/40'
          }`}
        >
          <div className="relative h-64 overflow-hidden">
            <img
              src="/assets/provenance-dag.jpg"
              alt="Bi-Temporal Authority Graph"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono">
                DAG Lineage
              </span>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono">
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>5-Tier Hierarchy</span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
              Authority DAG Traversal
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Hierarchical precedence engine: Regulatory Mandate &gt; Amendment &gt; Policy &gt; Memo &gt; FAQ. Stale predecessors are pruned from governing synthesis.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs font-mono text-slate-500">
              <span>Supersession Rate: 100%</span>
              <span className="text-cyan-400 flex items-center gap-1">
                Lineage Explorer <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>

        {/* Card 3: Cryptographic Provenance Prism */}
        <div
          onClick={() => setActiveTab('prism')}
          className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border ${
            activeTab === 'prism'
              ? 'border-teal-500/50 shadow-2xl shadow-teal-500/10 bg-slate-900/80 scale-[1.02]'
              : 'border-slate-800/80 hover:border-slate-700 bg-slate-950/60 hover:bg-slate-900/40'
          }`}
        >
          <div className="relative h-64 overflow-hidden">
            <img
              src="/assets/hero-prism.jpg"
              alt="Truth Prism Core"
              className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110 filter brightness-90 contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 rounded bg-teal-500/20 border border-teal-500/40 text-teal-300 text-xs font-mono">
                SHA-256 Provenance
              </span>
            </div>
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 text-slate-300 text-xs font-mono">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>NVIDIA NIM Grounded</span>
            </div>
          </div>

          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-teal-300 transition-colors">
              Grounded NIM Synthesis
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Integrated with NVIDIA NIM (Llama 3.1 70B Instruct). Every sentence is bound to source citations and verified through Critic claim audit gates.
            </p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-800/60 text-xs font-mono text-slate-500">
              <span>Zero-Hallucination Gate</span>
              <span className="text-teal-400 flex items-center gap-1">
                Audit Trail <ArrowUpRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Interactive Deep Dive Banner */}
      <div className="relative rounded-2xl p-8 bg-gradient-to-br from-slate-900/90 via-slate-950/95 to-slate-900/90 border border-slate-800/80 backdrop-blur-xl shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Inference Backbone</div>
              <div className="text-lg font-bold text-white">NVIDIA NIM Cloud</div>
              <div className="text-xs text-emerald-400">Meta Llama 3.1 70B Instruct</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <FileCode className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Cryptographic Security</div>
              <div className="text-lg font-bold text-white">HMAC & Merkle Root</div>
              <div className="text-xs text-cyan-400">Tamper-Proof Audit Receipts</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">Safety Guarantee</div>
              <div className="text-lg font-bold text-white">Autonomous Abstention</div>
              <div className="text-xs text-amber-400">Refuses to Gamble on Unresolvable Data</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

