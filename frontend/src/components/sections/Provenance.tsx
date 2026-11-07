import { ArrowUpRight } from 'lucide-react'
import type { TruthGuardResponse } from '../../types'
import { shortHash } from '../../lib/labels'
import { MerkleDiagram } from '../graphics/MerkleDiagram'
import { MaskLine, Reveal } from '../ui/Reveal'

interface ProvenanceProps {
  response: TruthGuardResponse | null
}

const STEPS = [
  {
    num: '01',
    title: 'Bind',
    body: 'Every claim is tied to a source document and a verbatim quote span. No span, no claim.',
  },
  {
    num: '02',
    title: 'Hash',
    body: 'Each surviving claim becomes a SHA-256 leaf. Pairs are hashed upward until one root remains.',
  },
  {
    num: '03',
    title: 'Seal',
    body: 'The root travels with the answer. Inclusion proofs let an auditor re-derive it independently.',
  },
]

const TICKER = [
  'd13f7247a0607f67',
  'e9a421b8f520938b',
  '3fc8180de4859a11',
  'a91c9b3eb1f210da',
  '4e7b2c810da4c02d',
  'c02d71fa9e3e0bb4',
]

export function Provenance({ response }: ProvenanceProps) {
  const merkle = response?.merkle_provenance
  const root = merkle?.merkle_root ?? response?.provenance_sha256?.replace(/^0x/, '')
  const leaves = merkle?.leaf_count ?? 4

  return (
    <section id="provenance" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-marker">
            <span className="num">06</span>
            Provenance
          </div>
        </Reveal>

        <div className="mt-8 grid-12 gap-y-12 lg:gap-y-0">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="display-2">
              <MaskLine>A receipt for</MaskLine>
              <MaskLine delay={0.06}>every</MaskLine>
              <MaskLine delay={0.12}>
                <em className="font-editorial font-normal italic">sentence.</em>
              </MaskLine>
            </h2>

            <Reveal delay={0.08}>
              <p className="narrative-3 mt-8 max-w-[40ch] text-parchment/70">
                Most systems say “trust the model.” This one hands you a hash. The answer is sealed the same
                way a document is: leaf by leaf, then a root you can check without asking permission.
              </p>
            </Reveal>

            <div className="mt-10">
              {STEPS.map((step, index) => (
                <Reveal key={step.num} delay={index * 0.05}>
                  <div className="grid grid-cols-[38px_1fr] gap-4 border-t border-parchment/15 py-5 last:border-b">
                    <span className="meta-mono pt-0.5 text-signal-soft">{step.num}</span>
                    <div>
                      <h3 className="text-[0.88rem] font-bold tracking-[-0.01em]">{step.title}</h3>
                      <p className="mt-1 max-w-[38ch] text-[0.76rem] leading-relaxed text-parchment/60">
                        {step.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal variant="scale" delay={0.1}>
              <div className="rounded-[10px] border border-parchment/15 bg-[#0b0620] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-parchment/15 pb-3">
                  <span className="meta-mono text-parchment/45">Provenance tree · current query</span>
                  <span className="pill-tag text-parchment/60">
                    {response ? 'Sealed' : 'Awaiting query'}
                  </span>
                </div>

                <MerkleDiagram root={root} leafCount={leaves} className="mx-auto mt-4 w-full" />

                <div className="mt-4 border-t border-parchment/15 pt-3">
                  <p className="meta-mono text-parchment/35">MERKLE ROOT</p>
                  <p className="mt-1 break-all font-mono text-[0.62rem] leading-relaxed text-parchment/75">
                    {root ?? 'Run a query in the workbench to generate a sealed receipt.'}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="meta-mono text-parchment/35">LEAVES</p>
                    <p className="mt-0.5 text-sm font-bold">{leaves} claim(s)</p>
                  </div>
                  {root ? (
                    <a
                      href={`/api/audit/${root}`}
                      target="_blank"
                      rel="noreferrer"
                      className="link-arrow text-parchment/75"
                    >
                      Verify at the audit endpoint
                      <ArrowUpRight />
                    </a>
                  ) : (
                    <span className="meta-mono text-parchment/35">SHA-256 · NO ROOT YET</span>
                  )}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      <div className="mt-14 overflow-hidden border-y border-parchment/15 py-3">
        <div className="marquee">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {TICKER.map((hash) => (
                <span key={`${copy}-${hash}`} className="marquee-item font-mono text-[0.62rem] text-parchment/35">
                  {hash}
                  <span className="text-signal-soft">/</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
