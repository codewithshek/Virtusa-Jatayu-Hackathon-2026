import { ArrowUpRight } from 'lucide-react'
import { BrandMark } from '../graphics/BrandMark'
import { NAV_SECTIONS } from '../../data/edition'
import { scrollToId, scrollToTop } from '../../lib/scroll'

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <div className="flex flex-col gap-3 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="h-8 w-7 text-parchment" />
            <div>
              <p className="label-1">TruthGuard</p>
              <p className="meta-mono mt-1 text-parchment/45">The Provenance Edition · Winter ’26</p>
            </div>
          </div>
          <p className="max-w-sm text-[0.76rem] leading-relaxed text-parchment/55">
            Adversarial verification for multi-agent document Q&amp;A. Four agents, five authority tiers, one
            Merkle seal.
          </p>
        </div>

        <div className="footer-wordmark" aria-hidden="true">
          TRUTHGUARD
        </div>

        <div className="footer-grid">
          <div className="footer-col">
            <h4>Product</h4>
            {NAV_SECTIONS.slice(0, 4).map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  scrollToId(section.id)
                }}
              >
                {section.label}
              </a>
            ))}
          </div>

          <div className="footer-col">
            <h4>System</h4>
            <a href="/docs" target="_blank" rel="noreferrer">
              API reference
            </a>
            <a href="/api/corpus" target="_blank" rel="noreferrer">
              Corpus JSON
            </a>
            <a
              href="#notes"
              onClick={(event) => {
                event.preventDefault()
                scrollToId('notes')
              }}
            >
              Release notes
            </a>
            <a
              href="#provenance"
              onClick={(event) => {
                event.preventDefault()
                scrollToId('provenance')
              }}
            >
              Merkle receipts
            </a>
          </div>

          <div className="footer-col">
            <h4>Edition</h4>
            <p>Winter ’26 · No. 01</p>
            <p>4 agents / 3 modes</p>
            <p>19 verification tests</p>
            <p>SHA-256 provenance</p>
          </div>

          <div className="footer-col">
            <h4>Credits</h4>
            <p>Virtusa Jatayu Hackathon 2026</p>
            <p>Time BU track</p>
            <p>NVIDIA NIM · Llama 3.1 70B</p>
            <p>React · Vite · GSAP · Lenis</p>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 TruthGuard. Built for the Time BU track.</span>
          <div className="flex flex-wrap items-center gap-4">
            <button type="button" onClick={scrollToTop} className="inline-flex items-center gap-1 transition-opacity hover:opacity-70">
              Back to top
              <ArrowUpRight size={12} />
            </button>
            <span className="font-mono">NO GROUNDING · NO ANSWER</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
