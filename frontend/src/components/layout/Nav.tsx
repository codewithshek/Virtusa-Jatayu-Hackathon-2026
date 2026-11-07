import { useEffect, useState } from 'react'
import { ArrowUpRight, Menu, X } from 'lucide-react'
import { BrandMark } from '../graphics/BrandMark'
import { NAV_SECTIONS } from '../../data/edition'
import { lockScroll, scrollToId, scrollToTop } from '../../lib/scroll'

interface NavProps {
  active: string
}

export function Nav({ active }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let frame = 0

    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrolled(window.scrollY > 16)
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0)
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
    lockScroll(open)
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => () => lockScroll(false), [])

  const go = (id: string) => {
    setOpen(false)
    scrollToId(id)
  }

  return (
    <>
      <header className={`site-nav ${scrolled ? 'is-scrolled' : ''}`.trim()}>
        <div className="nav-inner">
          <button type="button" className="nav-brand" onClick={scrollToTop} aria-label="TruthGuard — back to top">
            <BrandMark />
            <span className="text-left">
              <span className="brand-name block">TruthGuard</span>
              <span className="brand-sub block">The Provenance Edition</span>
            </span>
          </button>

          <nav className="nav-center" aria-label="Primary">
            {NAV_SECTIONS.slice(0, 5).map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  go(section.id)
                }}
                aria-current={active === section.id ? 'true' : undefined}
              >
                {section.label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button type="button" className="btn btn-light btn-sm nav-cta" onClick={() => go('workbench')}>
              Open workbench
              <ArrowUpRight strokeWidth={2.2} />
            </button>
            <button
              type="button"
              className="nav-burger"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              {open ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>
        <span className="nav-progress" style={{ width: `${progress * 100}%` }} />
      </header>

      {open && (
        <div className="mobile-menu" id="mobile-menu">
          <div className="flex items-center justify-between">
            <span className="label-2 opacity-60">Index / Winter ’26</span>
            <span className="meta-mono opacity-50">{NAV_SECTIONS.length} sections</span>
          </div>

          <nav aria-label="Mobile" className="mt-6">
            {NAV_SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={(event) => {
                  event.preventDefault()
                  go(section.id)
                }}
              >
                {section.label}
                <span>{section.num}</span>
              </a>
            ))}
          </nav>

          <button type="button" className="btn btn-light btn-lg mt-8 self-start" onClick={() => go('workbench')}>
            Open the workbench
            <ArrowUpRight />
          </button>

          <div className="mobile-menu-foot">
            TruthGuard · Adversarial verification for document Q&amp;A
            <br />
            Virtusa Jatayu Hackathon 2026 · Time BU
          </div>
        </div>
      )}
    </>
  )
}
