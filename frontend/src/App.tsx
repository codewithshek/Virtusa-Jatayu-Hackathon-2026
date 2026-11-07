import { useCallback, useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { Nav } from './components/layout/Nav'
import { SideRail } from './components/layout/SideRail'
import { Footer } from './components/layout/Footer'
import { TornEdge } from './components/graphics/TornEdge'
import { Hero } from './components/sections/Hero'
import { Premise } from './components/sections/Premise'
import { Tribunal } from './components/sections/Tribunal'
import { ConflictAtlas } from './components/sections/ConflictAtlas'
import { Workbench } from './components/sections/Workbench'
import { Authority } from './components/sections/Authority'
import { Provenance } from './components/sections/Provenance'
import { EditionNotes } from './components/sections/EditionNotes'
import { ClosingCta } from './components/sections/ClosingCta'

import { NAV_SECTIONS } from './data/edition'
import { FALLBACK_RESPONSES, genericFallback } from './data/fallback'
import type { DagData, EdgeData, DocumentNode, TruthGuardResponse } from './types'
import { registerLenis, scrollToId } from './lib/scroll'

gsap.registerPlugin(ScrollTrigger)

const DEFAULT_DAG: DagData = {
  nodes: [
    {
      id: 'REG-2025-09',
      label: 'REG-2025-09\nAI Governance Mandate',
      tier: 5,
      tier_name: 'REGULATORY_MANDATE',
      date: '2025-09-01',
      scope: 'enterprise',
      is_superseded: false,
    },
    {
      id: 'ENG-MEMO-25',
      label: 'ENG-MEMO-25\nEngineering Addendum',
      tier: 4,
      tier_name: 'AMENDMENT',
      date: '2025-01-10',
      scope: 'engineering',
      is_superseded: false,
    },
    {
      id: 'SEC-2025-11',
      label: 'SEC-2025-11\nSecurity Directive',
      tier: 3,
      tier_name: 'POLICY',
      date: '2025-11-15',
      scope: 'global IT',
      is_superseded: false,
    },
    {
      id: 'HR-POL-2024',
      label: 'HR-POL-2024\nRemote Work Policy',
      tier: 2,
      tier_name: 'MEMO',
      date: '2024-03-01',
      scope: 'all staff',
      is_superseded: true,
    },
    {
      id: 'FAQ-2023-OLD',
      label: 'FAQ-2023-OLD\nLegacy Auth FAQ',
      tier: 1,
      tier_name: 'FAQ',
      date: '2023-05-20',
      scope: 'general',
      is_superseded: true,
    },
  ],
  edges: [
    { source: 'REG-2025-09', target: 'FAQ-2023-OLD', type: 'SILENT_REVOCATION' },
    { source: 'ENG-MEMO-25', target: 'HR-POL-2024', type: 'DOMAIN_EXCEPTION' },
    { source: 'SEC-2025-11', target: 'HR-POL-2024', type: 'SECURITY_SUPERSEDES' },
  ],
}

function normalizeResponse(raw: Partial<TruthGuardResponse>): TruthGuardResponse {
  return {
    ...raw,
    query: raw.query ?? '',
    status: raw.status ?? ('RESOLVED_CONFLICT' as TruthGuardResponse['status']),
    final_answer: raw.final_answer ?? '',
    positions_surfaced: raw.positions_surfaced ?? [],
    contradictions_detected: raw.contradictions_detected ?? [],
    claim_audits: raw.claim_audits ?? [],
    retrieved_passages: raw.retrieved_passages ?? [],
    provenance_sha256: raw.provenance_sha256 ?? '',
    latency_ms: Number(raw.latency_ms) || 0,
    trace: raw.trace ?? [],
  }
}

function normalizeDag(payload: Record<string, unknown>): DagData | null {
  const rawNodes = (payload.nodes ?? payload.documents) as DocumentNode[] | undefined
  const rawEdges = (payload.edges ?? payload.relationships) as EdgeData[] | undefined
  if (!rawNodes?.length) return null

  const nodes = rawNodes.map((node) => ({
    ...node,
    id: node.id,
    label: node.label ?? node.id,
    tier: Number(node.tier) || 1,
    tier_name: node.tier_name ?? '',
    date: node.date ?? '',
    scope: node.scope ?? '',
    is_superseded: Boolean(node.is_superseded),
  }))

  const edges = (rawEdges ?? []).map((edge) => ({
    source: edge.source,
    target: edge.target,
    type: edge.type ?? 'supersedes',
  }))

  return { nodes, edges }
}

export default function App() {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<TruthGuardResponse | null>(null)
  const [dag, setDag] = useState<DagData>(DEFAULT_DAG)
  const [active, setActive] = useState('')

  const pendingScroll = useRef(false)

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
    })

    registerLenis(lenis)
    lenis.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    const context = gsap.context(() => {
      gsap.to('.hero-lines', {
        yPercent: 9,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-frame', {
        yPercent: -7,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
      })
    })

    return () => {
      context.revert()
      gsap.ticker.remove(ticker)
      registerLenis(null)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const marker = 150
      let current = ''
      for (const section of NAV_SECTIONS) {
        const el = document.getElementById(section.id)
        if (el && el.getBoundingClientRect().top <= marker) current = section.id
      }
      setActive((previous) => (previous === current ? previous : current))
    }

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    fetch('/api/corpus')
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`Corpus ${res.status}`))))
      .then((payload) => {
        if (cancelled) return
        const next = normalizeDag(payload)
        if (next) setDag(next)
      })
      .catch(() => {
        /* the seeded graph stays in place when the API is offline */
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleQuery = useCallback(async (raw: string) => {
    const nextQuery = raw.trim()
    if (!nextQuery) return

    setQuery(nextQuery)
    setLoading(true)
    setResponse(null)
    pendingScroll.current = true

    try {
      const res = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: nextQuery }),
      })
      if (!res.ok) throw new Error(`Query failed with ${res.status}`)
      const payload = await res.json()
      setResponse(normalizeResponse(payload))
    } catch {
      setResponse(FALLBACK_RESPONSES[nextQuery] ?? genericFallback(nextQuery))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!response || !pendingScroll.current) return
    pendingScroll.current = false

    const frame = window.requestAnimationFrame(() => {
      window.setTimeout(() => scrollToId('results', -84), 120)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [response])

  return (
    <div className="relative">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <div className="noise-overlay" aria-hidden="true" />

      <Nav active={active} />
      <SideRail active={active} />

      <main id="main">
        <Hero />

        <div className="theme-light paper-grain">
          <TornEdge from="#000000" />
          <Premise onQuery={handleQuery} loading={loading} />
        </div>

        <div className="theme-dark">
          <TornEdge from="#f7f7ee" />
          <Tribunal />
        </div>

        <div className="theme-violet">
          <TornEdge from="#000000" />
          <ConflictAtlas onRun={handleQuery} />
        </div>

        <div className="theme-light paper-grain">
          <TornEdge from="#1c004f" />
          <Workbench
            query={query}
            setQuery={setQuery}
            onSubmit={handleQuery}
            loading={loading}
            response={response}
          />
        </div>

        <div className="theme-dark">
          <TornEdge from="#f7f7ee" />
          <Authority dag={dag} />
        </div>

        <div className="theme-deep">
          <TornEdge from="#000000" />
          <Provenance response={response} />
        </div>

        <div className="theme-light paper-grain">
          <TornEdge from="#120038" />
          <EditionNotes />
        </div>

        <div className="theme-dark">
          <TornEdge from="#f7f7ee" />
          <ClosingCta />
        </div>
      </main>

      <Footer />
    </div>
  )
}
