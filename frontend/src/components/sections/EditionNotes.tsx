import { ArrowUpRight } from 'lucide-react'
import { RELEASE_NOTES, STATS } from '../../data/edition'
import { MaskLine, Reveal } from '../ui/Reveal'

export function EditionNotes() {
  return (
    <section id="notes" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-marker">
            <span className="num">07</span>
            Release notes
          </div>
        </Reveal>

        <div className="section-head mt-8 gap-8">
          <h2 className="display-1 max-w-[15ch]">
            <MaskLine>Twelve changes.</MaskLine>
            <MaskLine delay={0.06}>
              One <em className="font-editorial font-normal italic">edition.</em>
            </MaskLine>
          </h2>
          <Reveal delay={0.08} className="lede">
            <p className="narrative-3 text-ink/65">
              The Provenance Edition is the verification stack we wanted to demo: retrieval that respects
              lineage, critique that runs before delivery, and receipts that survive the room.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="stat-strip mt-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="stat-cell">
                <p className="stat-value">
                  {stat.value}
                  {'unit' in stat && stat.unit ? <span className="unit">{stat.unit}</span> : null}
                </p>
                <p className="stat-label">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-x-16 lg:grid-cols-2">
          {RELEASE_NOTES.map((note, index) => (
            <Reveal key={note.title} delay={(index % 6) * 0.03}>
              <article className="note-item">
                <span className="note-index">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h4>{note.title}</h4>
                  <p>{note.body}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4">
          <a href="/docs" target="_blank" rel="noreferrer" className="link-arrow text-ink">
            Read the technical notes
            <ArrowUpRight />
          </a>
          <span className="pill-tag text-ink/60">Winter ’26 · No. 01 · Virtusa Jatayu 2026</span>
        </div>
      </div>
    </section>
  )
}
