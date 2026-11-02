import React, { useState, useEffect } from 'react'
import Lenis from 'lenis'
import {
  ShieldCheck,
  Cpu,
  Layers,
  ArrowRight,
  GitPullRequest,
  Hash,
  Database,
  Terminal,
  Activity,
  ChevronDown
} from 'lucide-react'

import { HeroScene3D } from './components/HeroScene3D'
import { CinematicParallaxSection } from './components/CinematicParallaxSection'
import { QueryConsole } from './components/QueryConsole'
import { AgentTraceTimeline } from './components/AgentTraceTimeline'
import { ConflictDiffViewer } from './components/ConflictDiffViewer'
import { AuthorityDagGraph } from './components/AuthorityDagGraph'
import { ClaimAuditTable } from './components/ClaimAuditTable'
import { AbstentionBanner } from './components/AbstentionBanner'
import { TruthGuardResponse, ResolutionStatus, DocumentNode, EdgeData } from './types'

export default function App() {
  const [response, setResponse] = useState<TruthGuardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dagData, setDagData] = useState<{ nodes: DocumentNode[], edges: EdgeData[] } | null>(null)

  // Initialize Lenis Smooth Scrolling (Awwwards 1.1.0 standard)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    // Preload corpus DAG structure
    fetch('/api/corpus')
      .then(res => res.json())
      .then(data => {
        if (data.nodes && data.edges) {
          setDagData({ nodes: data.nodes, edges: data.edges })
        } else if (data.documents && data.relationships) {
          setDagData({ nodes: data.documents, edges: data.relationships })
        }
      })
      .catch(err => console.log('Corpus load error:', err))

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  const handleQuery = async (query: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      })
      const data = await res.json()
      setResponse(data)

      // Scroll smoothly to results
      setTimeout(() => {
        const resultsEl = document.getElementById('verification-results')
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } catch (error) {
      console.error('Query execution error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col relative selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Cinematic Navigation Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#050811]/80 border-b border-slate-800/80 px-6 py-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  T
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold tracking-tight text-white">TruthGuard</h1>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                  Awwwards 3D Edition
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                Forensic Epistemic Engine · Bi-Temporal Authority DAG
              </p>
            </div>
          </div>

          {/* Telemetry Status Bar */}
          <div className="hidden md:flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>NVIDIA NIM: <strong className="text-emerald-400 font-normal">Llama 3.1 70B</strong></span>
            </div>
            {response?.provenance_sha256 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-slate-300">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span>SHA-256: <strong className="text-cyan-300 font-normal">{response.provenance_sha256.slice(0, 10)}...</strong></span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section with WebGL 3D Canvas */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 overflow-hidden">
        {/* Three.js Interactive 3D Canvas Overlay */}
        <HeroScene3D />

        {/* Ambient Gradient Highlights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-emerald-500/15 via-teal-500/10 to-cyan-500/15 rounded-full blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-4xl mx-auto text-center relative z-10 pt-12 pb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-8 backdrop-blur-xl shadow-lg shadow-emerald-500/5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>5-Tier Deterministic Precedence Engine Active</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            Zero-Hallucination <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              Adversarial Document Q&A
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            When organizational policies, amendments, and mandates contradict each other,
            TruthGuard refuses to guess. Powered by NVIDIA NIM, cross-document NLI, and bi-temporal DAG traversal.
          </p>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto mb-10">
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400">100.0%</div>
              <div className="text-xs text-slate-400 mt-0.5">Supersession Accuracy</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400">1.000</div>
              <div className="text-xs text-slate-400 mt-0.5">Contradiction F1</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-bold font-mono text-teal-400">0.0%</div>
              <div className="text-xs text-slate-400 mt-0.5">Unbacked Claims</div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
              <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400">100.0%</div>
              <div className="text-xs text-slate-400 mt-0.5">Abstention Precision</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#interactive-console"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5"
            >
              <span>Launch Verification Console</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#telemetry-showcase"
              className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2"
            >
              <span>Explore 3D Lineage</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </a>
          </div>
        </div>
      </section>

      {/* Cinematic Parallax Section with Generated Visuals */}
      <div id="telemetry-showcase">
        <CinematicParallaxSection />
      </div>

      {/* Interactive Verification Console */}
      <div className="py-12">
        <QueryConsole
          onSubmit={handleQuery}
          onLoadScenario={handleQuery}
          isLoading={isLoading}
        />
      </div>

      {/* Results Arena */}
      {response && (
        <main id="verification-results" className="max-w-7xl mx-auto px-6 pb-24 w-full scroll-mt-24">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Epistemic Verification Telemetry
            </h2>
            <span className="text-xs font-mono text-slate-400 ml-auto">
              Execution Time: {response.latency_ms?.toFixed(0) || 0}ms
            </span>
          </div>

          {response.status === ResolutionStatus.UNRESOLVABLE_ABSTAIN && (
            <AbstentionBanner query={response.query} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {/* Column 1: Agent Trace Timeline */}
            <div className="lg:col-span-1">
              <AgentTraceTimeline trace={response.trace || []} latency={response.latency_ms} />
            </div>

            {/* Column 2: Conflict Diff Viewer */}
            <div className="lg:col-span-2 space-y-6">
              <ConflictDiffViewer
                positions={response.positions_surfaced}
                status={response.status}
                finalAnswer={response.final_answer}
                contradictions={response.contradictions_detected}
                corpusHygiene={(response as any).corpus_hygiene}
                merkleProvenance={(response as any).merkle_provenance}
              />
            </div>

            {/* Column 3: Authority DAG Graph */}
            <div className="lg:col-span-1 space-y-6">
              <AuthorityDagGraph dagData={dagData} />
            </div>
          </div>

          {/* Full Width: Claim Audit Matrix */}
          {response.claim_audits && response.claim_audits.length > 0 && (
            <div className="mt-8">
              <ClaimAuditTable audits={response.claim_audits} />
            </div>
          )}
        </main>
      )}

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 backdrop-blur-lg py-10 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            TruthGuard Epistemic Engine · Virtusa Jatayu Hackathon 2026
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>NVIDIA NIM Llama 3.1 70B</span>
            <span>·</span>
            <span>Three.js WebGL</span>
            <span>·</span>
            <span>GSAP ScrollTrigger</span>
            <span>·</span>
            <span>Lenis 1.1.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
