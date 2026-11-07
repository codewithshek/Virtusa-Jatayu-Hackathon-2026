import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { CASES } from '../../data/scenarios'
import { tierLabel, tierNumber } from '../../lib/labels'
import { Reveal } from '../ui/Reveal'

interface ConflictAtlasProps {
  onRun: (query: string) => void
}

const STATE_CLASS = {
  governing: 'is-governing',
  stale: 'is-stale',
  unresolved: 'is-deadlock',
} as const

const STATE_LABEL = {
  governing: 'Governing',
  stale: 'Superseded',
  unresolved: 'Unresolved',
} as const

export function ConflictAtlas({ onRun }: ConflictAtlasProps) {
  const [activeId, setActiveId] = useState(CASES[0].id)
  const active = CASES.find((item) => item.id === activeId) ?? CASES[0]

  return (
    <section id="conflict-atlas" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-marker">
            <span className="num">03</span>
            The conflict atlas
          </div>
        </Reveal>

        <div className="section-head mt-8 gap-8">
          <h2 className="display-1 max-w-[14ch]">
            <span className="block">Where the</span>
            <span className="block">
              documents <em className="font-editorial font-normal italic">disagree.</em>
            </span>
          </h2>
          <Reveal delay={0.1} className="lede">
            <p className="narrative-3 text-parchment/70">
              Four real failure modes, each drawn from the verification suite. Pick a case to inspect the
              competing passages, the precedence rule, and the verdict the magistrate must reach.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <div className="case-tabs mt-10">
            {CASES.map((scenario) => (
              <button
                key={scenario.id}
                type="button"
                className={`case-tab ${active.id === scenario.id ? 'is-active' : ''}`.trim()}
                onClick={() => setActiveId(scenario.id)}
                aria-pressed={active.id === scenario.id}
              >
                <span className="case-num">{scenario.code.replace('CASE ', '')}</span>
                {scenario.label}
              </button>
            ))}
          </div>
        </Reveal>

        <div key={active.id} style={{ animation: 'results-in 0.55s var(--ease-out) both' }}>
          <div className="mt-8 flex flex-col gap-4 border-t border-parchment/15 pt-6 sm:flex-row sm:items-start sm:justify-between">
            <p className="narrative-3 max-w-[62ch] text-parchment/85">{active.summary}</p>
            <span className="pill-tag shrink-0 text-parchment/65">{active.tag}</span>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[active.left, active.right].map((evidence) => (
              <article
                key={`${active.id}-${evidence.doc_id}`}
                className={`evidence-card ${STATE_CLASS[evidence.state]}`}
              >
                <div>
                  <div className="eco-top">
                    <div>
                      <p className="eco-id">{evidence.doc_id}</p>
                      <p className="eco-title">{evidence.title}</p>
                    </div>
                    <span className="eco-stamp">{STATE_LABEL[evidence.state]}</span>
                  </div>
                  <p className="eco-quote">“{evidence.quote}”</p>
                </div>

                <div className="eco-meta">
                  <span>TIER {tierNumber(evidence.tier)} · {tierLabel(evidence.tier)}</span>
                  <span>EFFECTIVE {evidence.date}</span>
                </div>
              </article>
            ))}
          </div>

          <div className="conflict-verdict mt-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="meta-mono text-parchment/50">RULE</span>
              <span className="text-[0.82rem] font-semibold text-parchment">{active.rule}</span>
            </div>
            <button type="button" className="btn btn-light btn-sm" onClick={() => onRun(active.query)}>
              Run this case
              <ArrowUpRight />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
