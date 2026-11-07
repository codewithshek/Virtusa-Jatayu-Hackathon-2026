import { RESOLUTION_RULES, TIERS } from '../../data/edition'
import type { DagData } from '../../types'
import { AuthorityDag } from '../graphics/AuthorityDag'
import { MaskLine, Reveal } from '../ui/Reveal'

interface AuthorityProps {
  dag: DagData | null
}

export function Authority({ dag }: AuthorityProps) {
  return (
    <section id="authority" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-marker">
            <span className="num">05</span>
            Authority
          </div>
        </Reveal>

        <div className="mt-8 grid-12 gap-y-12 lg:gap-y-0">
          <div className="col-span-12 lg:col-span-5">
            <h2 className="display-2">
              <MaskLine>The ladder</MaskLine>
              <MaskLine delay={0.06}>behind every</MaskLine>
              <MaskLine delay={0.12}>
                <em className="font-editorial font-normal italic">ruling.</em>
              </MaskLine>
            </h2>

            <Reveal delay={0.08}>
              <p className="narrative-3 mt-8 max-w-[42ch] text-parchment/65">
                Precedence is not a vibe. It is an ordered set of rules applied to dated, versioned documents
                whose replacement relationships are explicit. The magistrate can always show its work.
              </p>
            </Reveal>

            <div className="mt-9 grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
              {RESOLUTION_RULES.map((rule, index) => (
                <Reveal key={rule.title} delay={index * 0.05}>
                  <div className="border-t border-line-dark pt-4">
                    <span className="meta-mono text-signal-soft">{String(index + 1).padStart(2, '0')}</span>
                    <h3 className="mt-2 text-[0.88rem] font-bold tracking-[-0.01em]">{rule.title}</h3>
                    <p className="mt-2 max-w-[30ch] text-[0.76rem] leading-relaxed text-parchment/55">
                      {rule.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 lg:col-start-7">
            <Reveal variant="scale" delay={0.1}>
              <div className="mb-4 flex items-center justify-between gap-4">
                <span className="label-2 text-parchment/45">Precedence order · highest first</span>
                <span className="meta-mono text-parchment/35">TIER 05 → 01</span>
              </div>

              <div className="tier-ladder">
                {TIERS.map((tier) => (
                  <div key={tier.num} className="tier-row">
                    <span className="tier-num">{tier.num}</span>
                    <span className="tier-name">{tier.name}</span>
                    <span className="tier-desc">{tier.desc}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex items-start gap-3 border border-parchment/15 px-4 py-3">
                <span className="dot-status mt-1 shrink-0" aria-hidden="true" />
                <p className="text-[0.72rem] leading-relaxed text-parchment/55">
                  Equal tier, equal date, overlapping scope: the ladder ends. TruthGuard abstains rather than
                  inventing a tiebreaker.
                </p>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="label-2 text-parchment/45">The corpus graph</p>
              <h3 className="mt-1 text-xl font-bold tracking-[-0.025em]">Supersession, drawn as it is.</h3>
            </div>
            <span className="pill-tag text-parchment/60">
              <span className="dot-status" aria-hidden="true" />
              Live from /api/corpus
            </span>
          </div>

          <Reveal variant="scale">
            <AuthorityDag dag={dag} />
          </Reveal>

          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            <span className="meta-mono flex items-center gap-2 text-parchment/40">
              <span className="inline-block h-2 w-3 border border-parchment/60" /> active document
            </span>
            <span className="meta-mono flex items-center gap-2 text-parchment/40">
              <span className="inline-block h-2 w-3 border border-dashed border-parchment/40" /> superseded
            </span>
            <span className="meta-mono flex items-center gap-2 text-parchment/40">
              <span className="inline-block h-px w-4 border-t border-dashed border-signal-soft" /> revocation / amendment edge
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
