import { AGENTS, CAPABILITY_STRIP } from '../../data/edition'
import { AgentGlyph } from '../graphics/AgentGlyph'
import { MaskLine, Reveal } from '../ui/Reveal'

const STRIP = [
  ...CAPABILITY_STRIP,
  'BM25 + dense retrieval',
  'Bi-temporal DAG',
  'NLI ≥ 0.70',
  'Entailment ≥ 0.75',
  'Explicit supersession',
  'Merkle receipt',
]

export function Tribunal() {
  return (
    <section id="tribunal" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-marker">
            <span className="num">02</span>
            The tribunal
          </div>
        </Reveal>

        <div className="section-head mt-8 gap-8">
          <h2 className="display-1 max-w-[13ch]">
            <MaskLine>Four agents.</MaskLine>
            <MaskLine delay={0.06}>
              <em className="font-editorial font-normal italic">One verdict.</em>
            </MaskLine>
          </h2>
          <Reveal delay={0.1} className="lede">
            <p className="narrative-3 text-parchment/65">
              Retrieval, synthesis, adversarial critique, and resolution are separate jobs. Separating them
              is what makes the final ruling auditable — and what lets the system refuse when the record
              cannot support an answer.
            </p>
          </Reveal>
        </div>

        <div className="agent-grid mt-12">
          {AGENTS.map((agent, index) => (
            <Reveal key={agent.num} delay={index * 0.06} className="h-full">
              <article className="agent-card h-full">
                <div className="agent-card-top">
                  <span className="agent-num">{agent.num}</span>
                  <AgentGlyph variant={agent.variant} />
                </div>

                <div className="agent-body">
                  <h3>{agent.name}</h3>
                  <p className="agent-role">{agent.role}</p>
                  <p>{agent.description}</p>
                  <div className="agent-spec">
                    {agent.specs.map((spec) => (
                      <span key={spec}>{spec}</span>
                    ))}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 overflow-hidden border-y border-line-dark py-4">
          <div className="marquee marquee-fast">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
                {STRIP.map((item) => (
                  <span key={`${copy}-${item}`} className="marquee-item meta-mono text-parchment/55">
                    {item}
                    <span className="text-signal-soft">✳</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
