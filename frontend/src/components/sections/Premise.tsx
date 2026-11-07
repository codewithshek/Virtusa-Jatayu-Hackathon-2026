import { useState, type FormEvent } from 'react'
import { ArrowRight } from 'lucide-react'
import { CASES } from '../../data/scenarios'
import { MaskLine, Reveal } from '../ui/Reveal'

interface PremiseProps {
  onQuery: (query: string) => void
  loading: boolean
}

const DIFFERENCES = [
  {
    num: '01',
    title: 'Retrieval knows the family tree',
    body: 'A superseded document is still retrieved — then demoted by the authority graph, not ignored.',
  },
  {
    num: '02',
    title: 'Critique runs before delivery',
    body: 'Contradiction, staleness, and entailment probes attack the draft before you ever see it.',
  },
  {
    num: '03',
    title: 'Refusal is a first-class answer',
    body: 'When authority ties or grounding is absent, the system abstains instead of guessing.',
  },
]

export function Premise({ onQuery, loading }: PremiseProps) {
  const [value, setValue] = useState('')

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const query = value.trim()
    if (!query || loading) return
    onQuery(query)
  }

  return (
    <section id="premise" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-marker">
            <span className="num">01</span>
            Premise
          </div>
        </Reveal>

        <div className="mt-8 grid-12 gap-y-12 lg:gap-y-0">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="display-2">
              <MaskLine>Answers that</MaskLine>
              <MaskLine delay={0.06}>can survive</MaskLine>
              <MaskLine delay={0.12}>
                <em className="font-editorial font-normal italic leading-none text-[0.6em]">
                  cross-examination.
                </em>
              </MaskLine>
            </h2>

            <Reveal delay={0.08}>
              <p className="narrative-2 drop-cap mt-8 text-ink/90">
                Most answer engines retrieve a passage and trust it. TruthGuard retrieves the whole dispute:
                the governing document, the stale one it replaced, and the exact sentence that proves which
                one wins.
              </p>
              <p className="body-1 mt-5 max-w-[44ch] text-ink/65">
                Four agents run in sequence. A deterministic magistrate applies the authority ladder. The
                output is either a verdict with receipts or an honest refusal — never a confident guess.
              </p>
            </Reveal>

            <div className="mt-10">
              {DIFFERENCES.map((item, index) => (
                <Reveal key={item.num} delay={index * 0.05}>
                  <div className="grid grid-cols-[34px_1fr] gap-4 border-t border-line-light py-5 last:border-b">
                    <span className="meta-mono pt-1 text-muted">{item.num}</span>
                    <div>
                      <h3 className="text-[0.86rem] font-bold tracking-[-0.01em]">{item.title}</h3>
                      <p className="mt-1 max-w-[42ch] text-[0.76rem] leading-relaxed text-ink/60">{item.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal variant="scale" delay={0.12}>
              <div className="query-panel dusk-card dot-grid-dark min-h-[460px]">
                <div className="query-panel-inner">
                  <div className="w-full max-w-[680px]">
                    <div className="mb-6 flex items-center justify-between gap-4">
                      <span className="meta-mono text-parchment/60">Live query / ask the corpus</span>
                      <span className="pill-tag text-parchment/70">
                        <span className="dot-status" aria-hidden="true" />
                        NVIDIA NIM
                      </span>
                    </div>

                    <form className="query-bar" onSubmit={submit}>
                      <label htmlFor="premise-query" className="sr-only">
                        Ask the document corpus a question
                      </label>
                      <input
                        id="premise-query"
                        value={value}
                        onChange={(event) => setValue(event.target.value)}
                        placeholder="Ask a question the documents disagree on…"
                        autoComplete="off"
                        spellCheck={false}
                      />
                      <button type="submit" className="query-bar-btn" disabled={loading || !value.trim()}>
                        {loading ? 'Verifying' : 'Verify'}
                        <ArrowRight strokeWidth={2.2} />
                      </button>
                    </form>

                    <div className="query-suggestions">
                      {CASES.map((scenario, index) => (
                        <button
                          key={scenario.id}
                          type="button"
                          className="query-chip"
                          title={scenario.query}
                          onClick={() => onQuery(scenario.query)}
                        >
                          <span className="idx">{String(index + 1).padStart(2, '0')}</span>
                          {scenario.label}
                        </button>
                      ))}
                    </div>

                    <p className="meta-mono mt-7 text-center text-parchment/40">
                      Four agents · five authority tiers · one sealed verdict
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-4 flex items-start justify-between gap-6 border border-line-light px-4 py-3">
                <span className="meta-mono text-muted">TRY A REAL CONFLICT →</span>
                <span className="max-w-[34ch] text-right text-[0.7rem] leading-snug text-ink/55">
                  Each preset runs the full pipeline against a deliberately inconsistent corpus.
                </span>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
