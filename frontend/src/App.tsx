import React, { useState, useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  ShieldCheck,
  Cpu,
  Hash,
  Terminal,
  Activity,
  Layers,
  Sparkles
} from 'lucide-react'

import { HeroScene3D, SlabData } from './components/HeroScene3D'
import { CinematicParallaxSection } from './components/CinematicParallaxSection'
import { QueryConsole } from './components/QueryConsole'
import { AgentTraceTimeline } from './components/AgentTraceTimeline'
import { ConflictDiffViewer } from './components/ConflictDiffViewer'
import { AuthorityDagGraph } from './components/AuthorityDagGraph'
import { ClaimAuditTable } from './components/ClaimAuditTable'
import { AbstentionBanner } from './components/AbstentionBanner'
import { TruthGuardResponse, ResolutionStatus, DocumentNode, EdgeData } from './types'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [response, setResponse] = useState<TruthGuardResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [dagData, setDagData] = useState<{ nodes: DocumentNode[], edges: EdgeData[] } | null>(null)
  const [hoveredSlab, setHoveredSlab] = useState<SlabData | null>(null)

  // 1. Lenis Smooth Scroll Synced with GSAP ScrollTrigger & Ticker (Awwwards SOTM standard)
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    // Synchronize Lenis with ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)

    // Bind GSAP ticker to drive Lenis smoothly
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // Preload corpus DAG structure
    fetch('/api/corpus')
      .then((res) => res.json())
      .then((data) => {
        if (data.nodes && data.edges) {
          setDagData({ nodes: data.nodes, edges: data.edges })
        } else if (data.documents && data.relationships) {
          setDagData({ nodes: data.documents, edges: data.relationships })
        }
      })
      .catch((err) => console.log('Corpus load error:', err))

    return () => {
      gsap.ticker.remove(tickerCallback)
      lenis.destroy()
    }
  }, [])

  const handleQuery = async (query: string) => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      })
      const data = await res.json()
      setResponse(data)

      // Smoothly navigate to results arena
      setTimeout(() => {
        const el = document.getElementById('verification-results')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 150)
    } catch (error) {
      console.error('Query execution error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#03060c] text-slate-100 flex flex-col selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* ===================================================================== */}
      {/* LAYER 1: Persistent Fixed Full-Viewport WebGL Stage (z-0)              */}
      {/* ===================================================================== */}
      <HeroScene3D onHoverSlab={setHoveredSlab} />

      {/* ===================================================================== */}
      {/* Minimal Header                                                        */}
      {/* ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[#03060c]/70 border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center font-display font-bold text-emerald-400">
              T
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white font-display">
                TruthGuard
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                Awwwards SOTM Edition
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300">
              <Cpu className="w-3.5 h-3.5 text-emerald-400" />
              <span>NVIDIA NIM: <strong className="text-emerald-400 font-normal">Llama 3.1 70B</strong></span>
            </div>
            {response?.provenance_sha256 && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-slate-300">
                <Hash className="w-3.5 h-3.5 text-cyan-400" />
                <span>SHA-256: <strong className="text-cyan-300 font-normal">{response.provenance_sha256.slice(0, 10)}...</strong></span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* LAYER 2: 4-Beat Pinned Scroll Narrative & Monumental Typography (z-10) */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full">
        <CinematicParallaxSection hoveredSlab={hoveredSlab} />
      </div>

      {/* ===================================================================== */}
      {/* LAYER 3: Interactive Forensic Workbench Console & Results (z-20)       */}
      {/* ===================================================================== */}
      <section id="workbench-console" className="relative z-20 w-full pt-16 pb-24 px-6 md:px-12 bg-gradient-to-b from-transparent via-[#03060c]/95 to-[#03060c] border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          {/* Section Sub-heading */}
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-3 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>Interactive Verification Console</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white tracking-tight font-display mb-3">
              Forensic Attack Vectors & Query Arena
            </h2>
            <p className="text-xs md:text-sm text-slate-400 font-light">
              Select an adversarial policy conflict scenario below or enter your own query to trigger the 4-agent verification loop.
            </p>
          </div>

          {/* Live Query Console */}
          <QueryConsole
            onSubmit={handleQuery}
            onLoadScenario={handleQuery}
            isLoading={isLoading}
          />

          {/* Results Telemetry Arena */}
          {response && (
            <main id="verification-results" className="mt-12 scroll-mt-24 space-y-8">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <h3 className="text-xl font-bold text-white font-display">
                    Epistemic Verification Telemetry
                  </h3>
                </div>
                <div className="text-xs font-mono text-slate-400">
                  Total Latency: <strong className="text-emerald-400">{response.latency_ms?.toFixed(0) || 0}ms</strong>
                </div>
              </div>

              {/* Refusal Banner on Unresolvable Contradiction */}
              {response.status === ResolutionStatus.UNRESOLVABLE_ABSTAIN && (
                <AbstentionBanner query={response.query} />
              )}

              {/* 3-Column Diagnostic Matrix */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <AgentTraceTimeline trace={response.trace || []} latency={response.latency_ms} />
                </div>

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

                <div className="lg:col-span-1 space-y-6">
                  <AuthorityDagGraph dagData={dagData} />
                </div>
              </div>

              {/* Full Width: Critic Claim-by-Claim Audit */}
              {response.claim_audits && response.claim_audits.length > 0 && (
                <div className="pt-2">
                  <ClaimAuditTable audits={response.claim_audits} />
                </div>
              )}
            </main>
          )}
        </div>
      </section>

      {/* Global Minimal Footer */}
      <footer className="relative z-20 border-t border-slate-900 bg-[#03060c] py-8 px-6 text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div>TruthGuard · Forensic Epistemic Engine · Virtusa Jatayu Season 6</div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>NVIDIA NIM Llama 3.1 70B</span>
            <span>·</span>
            <span>Three.js r187</span>
            <span>·</span>
            <span>GSAP ScrollTrigger</span>
            <span>·</span>
            <span>Lenis 1.3</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
