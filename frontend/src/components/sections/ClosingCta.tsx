import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { scrollToId } from '../../lib/scroll'
import { DavinciLines } from '../graphics/DavinciLines'
import { Reveal } from '../ui/Reveal'

export function ClosingCta() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 opacity-55">
        <DavinciLines density="section" />
      </div>

      <div className="shell relative z-10 flex flex-col items-center py-24 text-center sm:py-32">
        <Reveal>
          <span className="pill-tag text-parchment/70">The Provenance Edition</span>
        </Reveal>

        <Reveal delay={0.06}>
          <h2 className="display-1 mx-auto mt-8 max-w-[17ch] text-balance">
            Ask what the corpus can <em className="font-editorial font-normal italic text-signal-soft">prove.</em>
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="narrative-3 mx-auto mt-6 max-w-[46ch] text-parchment/65">
            Bring a question, a contradiction, or a corpus that argues with itself. TruthGuard will return a
            verdict with receipts — or tell you, plainly, that it cannot.
          </p>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <button type="button" className="btn btn-light btn-lg" onClick={() => scrollToId('workbench')}>
              Open the workbench
              <ArrowUpRight />
            </button>
            <button type="button" className="btn btn-outline-dark btn-lg" onClick={() => scrollToId('notes')}>
              Read the release notes
              <ArrowDown />
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.24}>
          <p className="meta-mono mt-10 text-parchment/35">
            VIRTUSA JATAYU HACKATHON 2026 · TIME BU · NO GROUNDING, NO ANSWER
          </p>
        </Reveal>
      </div>
    </section>
  )
}
