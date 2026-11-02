import React, { useState, useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
  const [dagData, setDagData] = useState<{ nodes: DocumentNode[]; edges: EdgeData[] } | null>(null)
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
    <div className="relative min-h-screen bg-[#050506] text-[#F4F3EF] flex flex-col font-sans selection:bg-[#C4F82A] selection:text-black">
      {/* ===================================================================== */}
      {/* LAYER 1: Full-Viewport Post-Processed WebGL Stage (z-0)                */}
      {/* ===================================================================== */}
      <HeroScene3D onHoverSlab={setHoveredSlab} />

      {/* ===================================================================== */}
      {/* Minimal Architectural Navigation Header                               */}
      {/* ===================================================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#050506]/85 border-b border-[#F4F3EF]/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-3">
            <span className="font-display font-extrabold text-sm text-bone tracking-tight">
              TRUTHGUARD
            </span>
            <span className="text-zinc">/</span>
            <span className="text-ash tracking-widest text-[11px] hidden sm:inline-block">
              [EPISTEMIC SPECTROGRAPH // V3]
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <div className="flex items-center gap-2 px-3 py-1 border border-[#F4F3EF]/10 bg-black/60 text-ash">
              <span className="w-1.5 h-1.5 bg-[#C4F82A] animate-pulse" />
              <span>NVIDIA NIM // Llama 3.1 70B</span>
            </div>
            {response?.provenance_sha256 && (
              <div className="hidden md:flex items-center gap-2 px-3 py-1 border border-[#F4F3EF]/10 bg-black/60 text-zinc">
                <span className="text-bone">SHA256: {response.provenance_sha256.slice(0, 12)}...</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ===================================================================== */}
      {/* LAYER 2: 4-Beat Pinned Scroll Narrative (z-10)                        */}
      {/* ===================================================================== */}
      <div className="relative z-10 w-full">
        <CinematicParallaxSection hoveredSlab={hoveredSlab} />
      </div>

      {/* ===================================================================== */}
      {/* LAYER 3: Interactive Forensic Terminal & Results (z-20)               */}
      {/* ===================================================================== */}
      <section
        id="workbench-terminal"
        className="relative z-20 w-full pt-20 pb-28 px-6 md:px-12 border-t border-[#F4F3EF]/12 bg-[#050506]/95 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between pb-6 border-b border-[#F4F3EF]/10 gap-4">
            <div>
              <div className="font-mono text-[11px] tracking-[0.2em] text-[#C4F82A] uppercase mb-2">
                [SYS.00 // INTERACTIVE VERIFICATION WORKBENCH]
              </div>
              <h2 className="text-3xl md:text-5xl font-bold font-display text-bone tracking-tight">
                Forensic Audit Terminal.
              </h2>
            </div>
            <div className="font-mono text-xs text-ash max-w-md">
              Execute adversarial policy scenarios or custom queries across inconsistent document layers.
            </div>
          </div>

          {/* Query Terminal */}
          <QueryConsole
            onSubmit={handleQuery}
            onLoadScenario={handleQuery}
            isLoading={isLoading}
          />

          {/* Results Telemetry */}
          {response && (
            <main id="verification-results" className="pt-4 scroll-mt-24 space-y-8">
              {/* Disposition Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#F4F3EF]/10 font-mono text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#C4F82A] animate-ping" />
                  <span className="font-bold text-bone uppercase tracking-wider">
                    [TELEMETRY DISPOSITION REPORT]
                  </span>
                </div>
                <div className="text-zinc">
                  LATENCY: <strong className="text-bone">{response.latency_ms?.toFixed(0) || 0} MS</strong>
                </div>
              </div>

              {/* Abstention Gate Alert if Unresolvable */}
              {response.status === ResolutionStatus.UNRESOLVABLE_ABSTAIN && (
                <AbstentionBanner query={response.query} />
              )}

              {/* Diagnostic Grid */}
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

              {/* Full Width: Claim Audit Matrix */}
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
      <footer className="relative z-20 border-t border-[#F4F3EF]/10 bg-[#050506] py-10 px-6 font-mono text-xs text-zinc">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>TRUTHGUARD // VIRTUSA JATAYU HACKATHON 2026 // TIME BU</div>
          <div className="flex items-center gap-4 text-ash">
            <span>THREE.JS R187</span>
            <span>·</span>
            <span>POST-PROCESSING BLOOM</span>
            <span>·</span>
            <span>LENIS 1.3</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
