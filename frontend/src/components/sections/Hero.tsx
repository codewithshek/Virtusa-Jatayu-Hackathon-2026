import { useEffect, useState } from 'react'
import { scrollToId } from '../../lib/scroll'
import { DavinciLines } from '../graphics/DavinciLines'

export function Hero() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 80)
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`.trim()} aria-label="TruthGuard — The Provenance Edition">
      <div className="hero-lines">
        <DavinciLines />
      </div>

      <div className="hero-corner top-left">
        TruthGuard
        <br />
        <span className="opacity-60">The Provenance Edition</span>
      </div>

      <div className="hero-corner top-right">
        Winter ’26
        <br />
        <span className="opacity-60">No. 01 / Virtusa Jatayu</span>
      </div>

      <div className="hero-corner bottom-left">
        Adversarial verification
        <br />
        <span className="opacity-60">for multi-agent document Q&amp;A</span>
      </div>

      <div className="hero-corner bottom-right">
        4 agents · 5 tiers
        <br />
        <span className="opacity-60">3 resolution modes</span>
      </div>

      <div className="hero-frame">
        <div className="hero-frame-inner">
          <div className="hero-frame-top">
            <span>
              Provenance
              <br />
              Edition
            </span>
            <span className="text-right">
              Winter ’26
              <br />
              No. 01
            </span>
          </div>

          <h1 className="hero-title">
            <span className="word">
              <span>Every</span>
            </span>{' '}
            <span className="word">
              <span>claim,</span>
            </span>{' '}
            <span className="word">
              <span>proven.</span>
            </span>
          </h1>

          <div className="hero-frame-bottom">
            <span>
              Every sentence bound to a source.
              <br />
              Every verdict sealed with a hash.
            </span>
            <span className="mark" aria-hidden="true" />
          </div>
        </div>
      </div>

      <button type="button" className="hero-scroll" onClick={() => scrollToId('premise')}>
        <span className="line" aria-hidden="true" />
        Scroll to audit
      </button>

      <div className="hero-stamp" aria-hidden="true">
        <span>Merkle sealed</span>
        <span>SHA-256</span>
        <span>No grounding · no answer</span>
      </div>
    </section>
  )
}
