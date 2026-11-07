import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, CornerDownLeft } from 'lucide-react'
import { CASES } from '../../data/scenarios'
import type { TruthGuardResponse } from '../../types'
import { ResolutionStatus } from '../../types'
import { scrollToId } from '../../lib/scroll'
import { EmptyOrbit } from '../graphics/EmptyOrbit'
import { Results } from '../results/Results'
import { MaskLine, Reveal } from '../ui/Reveal'

interface WorkbenchProps {
  query: string
  setQuery: (query: string) => void
  onSubmit: (query: string) => void
  loading: boolean
  response: TruthGuardResponse | null
}

const STEPS = [
  { name: 'Retrieve', action: 'BM25 + dense hybrid' },
  { name: 'Expand', action: 'authority DAG lineage' },
  { name: 'Synthesize', action: 'atomic claims + spans' },
  { name: 'Adversary', action: 'NLI · staleness · entailment' },
  { name: 'Resolve', action: 'precedence engine' },
]

function Pipeline({ step }: { step: number }) {
  return (
    <div className="pb-2">
      <div className="flex items-center justify-between gap-4 pb-2">
        <span className="label-2 text-ink-soft">Audit in progress</span>
        <span className="meta-mono text-signal">
          STEP {String(Math.min(step + 1, STEPS.length)).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
        </span>
      </div>

      {STEPS.map((item, index) => {
        const state = index < step ? 'is-done' : index === step ? 'is-running' : ''
        return (
          <div key={item.name} className={`pipeline-step ${state}`.trim()}>
            <span className="ps-index">{index < step ? '✓' : String(index + 1).padStart(2, '0')}</span>
            <span className="ps-name">{item.name}</span>
            <span className="ps-action">{item.action}</span>
          </div>
        )
      })}
    </div>
  )
}

export function Workbench({ query, setQuery, onSubmit, loading, response }: WorkbenchProps) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!loading) return
    setStep(0)
    const timer = window.setInterval(() => {
      setStep((current) => Math.min(current + 1, STEPS.length - 1))
    }, 620)
    return () => window.clearInterval(timer)
  }, [loading])

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const value = query.trim()
    if (!value || loading) return
    onSubmit(value)
  }

  const activeCase = CASES.find((item) => item.query === query)

  return (
    <section id="workbench" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-marker">
            <span className="num">04</span>
            The workbench
            <span className="dot-status ml-1" aria-hidden="true" />
          </div>
        </Reveal>

        <div className="section-head mt-8 gap-8">
          <h2 className="display-1 max-w-[14ch]">
            <MaskLine>Put the corpus</MaskLine>
            <MaskLine delay={0.06}>
              on <em className="font-editorial font-normal italic">trial.</em>
            </MaskLine>
          </h2>
          <Reveal delay={0.08} className="lede">
            <p className="narrative-3 text-ink/65">
              Ask a question, load a case file, or challenge the system with something it cannot prove. The
              full audit record is returned: positions, contradictions, claim verdicts, agent trace, and the
              Merkle receipt.
            </p>
          </Reveal>
        </div>

        <Reveal variant="scale" delay={0.1} className="mt-12">
          <div className="workbench-shell">
            <div className="workbench-topbar">
              <div className="flex min-w-0 items-center gap-3">
                <div className="workbench-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="meta-mono truncate text-ink/60">TRUTHGUARD / VERIFICATION WORKBENCH</span>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span
                  className={`dot-status ${loading ? '' : 'dot-status-green'}`.trim()}
                  aria-hidden="true"
                />
                <span className="meta-mono text-ink/65">
                  {loading ? 'AUDITING' : response ? 'SEALED' : 'READY'}
                </span>
                {response && (
                  <span className="meta-mono hidden text-ink/40 sm:inline">
                    {Math.round(response.latency_ms)} MS
                  </span>
                )}
              </div>
            </div>

            <div className="workbench-body">
              <div className="workbench-layout">
                <div>
                  <form className="console-input-wrap" onSubmit={submit}>
                    <label htmlFor="workbench-query" className="sr-only">
                      Query the document corpus
                    </label>
                    <input
                      id="workbench-query"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder="Ask a question across contradictory policy documents…"
                      autoComplete="off"
                      spellCheck={false}
                    />
                    <button type="submit" className="console-submit" disabled={loading || !query.trim()}>
                      {loading ? 'Auditing' : 'Run audit'}
                      <ArrowRight strokeWidth={2.2} />
                    </button>
                  </form>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="meta-mono flex items-center gap-1.5 text-ink/40">
                      <CornerDownLeft size={10} /> ENTER TO RUN
                    </span>
                    <span className="meta-mono text-ink/40">FALLBACK DATA IS LOCAL AND DETERMINISTIC</span>
                  </div>
                </div>

                <aside className="workbench-side">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="label-2 text-ink-soft">Case files</p>
                    <span className="meta-mono text-ink/40">{CASES.length}</span>
                  </div>

                  <div className="case-rail">
                    {CASES.map((scenario) => (
                      <button
                        key={scenario.id}
                        type="button"
                        className={`case-tile ${activeCase?.id === scenario.id ? 'is-active' : ''}`.trim()}
                        onClick={() => onSubmit(scenario.query)}
                        disabled={loading}
                      >
                        <span className="ct-code">
                          <span>{scenario.code}</span>
                          <span>
                            {scenario.status === ResolutionStatus.UNRESOLVABLE_ABSTAIN ? 'ABSTAIN' : 'RESOLVE'}
                          </span>
                        </span>
                        <span className="ct-label block">{scenario.label}</span>
                        <span className="ct-query block">{scenario.query}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 border border-line-light px-4 py-4">
                    <p className="label-2 text-ink-soft">Suite</p>
                    <div className="mt-3 space-y-2">
                      {[
                        ['Conflict F1', '1.000'],
                        ['Supersession', '100%'],
                        ['Abstention', '100%'],
                        ['Tests', '19/19'],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-baseline justify-between gap-3">
                          <span className="meta-mono text-ink/45">{label}</span>
                          <span className="font-mono text-[0.66rem] font-semibold text-ink">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              <div className="mt-6 border-t border-line-light pt-4">
                {loading ? (
                  <Pipeline step={step} />
                ) : response ? (
                  <Results response={response} />
                ) : (
                  <div className="workbench-empty">
                    <EmptyOrbit />
                    <div>
                      <p className="label-2 text-muted">No case loaded</p>
                      <h3 className="narrative-2 mt-2 text-ink">Put a question on the record.</h3>
                      <p className="body-1 mt-3 max-w-[42ch] text-ink/60">
                        The workbench returns every position it found, the contradictions between them, and
                        the precise rule that decided the verdict — or the reason it refused.
                      </p>
                      <button
                        type="button"
                        className="btn btn-dark btn-sm mt-5"
                        onClick={() => {
                          setQuery(CASES[0].query)
                          scrollToId('workbench')
                          onSubmit(CASES[0].query)
                        }}
                      >
                        Load case 01
                        <ArrowRight />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
