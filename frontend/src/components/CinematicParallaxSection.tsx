import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SlabData } from './HeroScene3D'

gsap.registerPlugin(ScrollTrigger)

interface CinematicParallaxSectionProps {
  hoveredSlab?: SlabData | null
}

export const CinematicParallaxSection: React.FC<CinematicParallaxSectionProps> = ({ hoveredSlab }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // Animate hairline dividers and chapter coordinates on scroll
      const chapters = gsap.utils.toArray<HTMLElement>('.narrative-chapter')
      chapters.forEach((chap) => {
        const line = chap.querySelector('.hairline-rule')
        const num = chap.querySelector('.chapter-num')
        const content = chap.querySelector('.chapter-content')

        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0, transformOrigin: 'left center' },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: chap,
                start: 'top 80%',
                end: 'top 30%',
                scrub: 0.5,
              },
            }
          )
        }

        if (num) {
          gsap.fromTo(
            num,
            { y: 60, opacity: 0 },
            {
              y: 0,
              opacity: 0.12,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: chap,
                start: 'top 85%',
                end: 'top 40%',
                scrub: true,
              },
            }
          )
        }

        if (content) {
          gsap.fromTo(
            content,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: chap,
                start: 'top 75%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={containerRef} className="relative w-full z-10 pointer-events-auto">
      {/* Live Raycast Monolith Inspection HUD (When hovering 3D blades) */}
      {hoveredSlab && (
        <aside
          aria-label="3D Blade Inspector"
          className="fixed bottom-6 right-6 z-50 p-4 border border-[#F4F3EF]/20 bg-[#0B0B0D]/95 backdrop-blur-md shadow-2xl pointer-events-none rounded-none max-w-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F4F3EF]/10 text-bone uppercase tracking-widest">
              [RAYCAST // {hoveredSlab.id}]
            </span>
            <span
              className="text-[10px] font-mono font-bold"
              style={{ color: hoveredSlab.color }}
            >
              {hoveredSlab.status}
            </span>
          </div>
          <div className="text-sm font-bold font-display text-bone mb-1">{hoveredSlab.clause}</div>
          <div className="text-[11px] font-mono text-ash flex items-center justify-between pt-2 border-t border-[#F4F3EF]/10">
            <span>{hoveredSlab.tier}</span>
            <span>PRECEDENCE: TIER {hoveredSlab.tierNum}</span>
          </div>
        </aside>
      )}

      {/* ===================================================================== */}
      {/* CHAPTER 01: Ingestion & Epistemic Grounding (Hero Beat)               */}
      {/* ===================================================================== */}
      <section className="narrative-chapter relative min-h-screen flex flex-col justify-between px-6 md:px-16 pt-32 pb-16 max-w-7xl mx-auto">
        <div className="chapter-num absolute top-20 right-6 text-[18vw] font-display font-black text-bone opacity-10 select-none pointer-events-none leading-none">
          01
        </div>

        <div className="chapter-content max-w-xl lg:max-w-lg relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-2 h-2 bg-[#C4F82A]" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#C4F82A] uppercase font-semibold">
              SYSTEM 01 // EPISTEMIC ENGINE
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.03em] text-bone font-display leading-[0.94] mb-8">
            Adversarial <br />
            Verification for <br />
            Inconsistent <br />
            Corpora.
          </h1>

          <p className="text-sm sm:text-base text-ash leading-relaxed font-sans max-w-md mb-10">
            Enterprise document corpora decay into diametric policy contradictions across version boundaries.
            TruthGuard rejects probabilistic hallucination, enforcing 3-vector adversarial verification,
            bi-temporal DAG precedence, and autonomous abstention.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#workbench-terminal"
              className="px-7 py-4 bg-bone text-carbon hover:bg-white text-xs font-mono font-bold tracking-widest uppercase transition-colors"
            >
              Initialize Forensic Terminal →
            </a>
            <span className="text-[11px] font-mono text-zinc hidden sm:inline-block">
              [SCROLL TO AUDIT SPECTROGRAPH]
            </span>
          </div>
        </div>

        {/* Technical Coordinate Baseline */}
        <div className="relative z-10 pt-8 border-t border-[#F4F3EF]/10">
          <div className="hairline-rule w-full h-[1px] bg-[#F4F3EF]/20 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs text-ash">
            <div>
              <span className="text-zinc block text-[10px] tracking-widest mb-1">[BACKBONE]</span>
              <span className="text-bone font-medium">NVIDIA NIM // Llama 3.1 70B</span>
            </div>
            <div>
              <span className="text-zinc block text-[10px] tracking-widest mb-1">[PRECEDENCE]</span>
              <span className="text-[#C4F82A] font-medium">5-Tier Authority DAG</span>
            </div>
            <div>
              <span className="text-zinc block text-[10px] tracking-widest mb-1">[CONTRADICTION F1]</span>
              <span className="text-bone font-medium">1.000 (Target ≥0.85)</span>
            </div>
            <div>
              <span className="text-zinc block text-[10px] tracking-widest mb-1">[DISPOSITION]</span>
              <span className="text-bone font-medium">Deterministic Abstention</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 02: Deontic Contradiction Isolation                          */}
      {/* ===================================================================== */}
      <section className="narrative-chapter relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="chapter-num absolute top-12 left-4 text-[18vw] font-display font-black text-bone opacity-10 select-none pointer-events-none leading-none">
          02
        </div>

        <div className="chapter-content grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#FF3B1D] uppercase">
              <span className="w-1.5 h-1.5 bg-[#FF3B1D]" />
              <span>[SYS.02 // DEONTIC CONTRADICTION]</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-bone font-display tracking-tight leading-[1.05]">
              Symbolic <br />
              Deontic Clash.
            </h2>

            <p className="text-xs md:text-sm text-ash leading-relaxed">
              Standard LLMs average contradictory policy values into an unbacked compromise.
              TruthGuard decomposes policy statements into bounded deontic intervals, evaluating
              cross-document satisfiability before draft synthesis.
            </p>

            {/* Industrial Data Box */}
            <div className="p-5 border border-[#FF3B1D]/30 bg-[#0B0B0D]/90 rounded-none font-mono text-xs">
              <div className="flex items-center justify-between text-[#FF3B1D] font-bold mb-2 pb-2 border-b border-[#FF3B1D]/20">
                <span>EVALUATION: UNSAT</span>
                <span>DELTA DETECTED</span>
              </div>
              <div className="p-3 bg-black text-[#F4F3EF] mb-2 border border-[#F4F3EF]/10">
                <code>[0, 1] ∩ [4, 5] = ∅ (Empty Set)</code>
              </div>
              <p className="text-[11px] text-zinc leading-relaxed">
                HR-POL-2024 restricts remote work to 1 day/wk. ENG-MEMO-25 allows up to 4 days/wk.
                NLI cross-encoder scores 0.94 contradiction confidence.
              </p>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              {/* Blade A */}
              <div className="p-5 border border-[#F4F3EF]/12 bg-[#0B0B0D]/85 crosshair-corner">
                <div className="flex items-center justify-between text-zinc mb-2">
                  <span>TIER 03 // POLICY</span>
                  <span>DOC: HR-POL-2024</span>
                </div>
                <div className="text-base font-bold font-display text-bone mb-2">
                  Remote Work Allowance
                </div>
                <p className="text-ash text-xs mb-4">
                  "Full-time employees may work remotely up to one (1) day per week with department approval."
                </p>
                <div className="text-[11px] text-[#FF3B1D] pt-2 border-t border-[#F4F3EF]/10">
                  INTERVAL BOUND: [0, 1] DAYS/WK
                </div>
              </div>

              {/* Blade B */}
              <div className="p-5 border border-[#FF3B1D]/40 bg-[#0B0B0D]/85 crosshair-corner">
                <div className="flex items-center justify-between text-[#FF3B1D] mb-2">
                  <span>TIER 04 // ADDENDUM</span>
                  <span>DOC: ENG-MEMO-25</span>
                </div>
                <div className="text-base font-bold font-display text-bone mb-2">
                  Engineering Scope Addendum
                </div>
                <p className="text-ash text-xs mb-4">
                  "Field and systems engineering personnel are permitted remote flexibility up to four (4) days per week."
                </p>
                <div className="text-[11px] text-[#FF3B1D] pt-2 border-t border-[#FF3B1D]/20">
                  INTERVAL BOUND: [4, 5] DAYS/WK
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 03: Bi-Temporal DAG & Silent Revocation                       */}
      {/* ===================================================================== */}
      <section className="narrative-chapter relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="chapter-num absolute top-12 right-6 text-[18vw] font-display font-black text-bone opacity-10 select-none pointer-events-none leading-none">
          03
        </div>

        <div className="chapter-content grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#C4F82A] uppercase">
              <span className="w-1.5 h-1.5 bg-[#C4F82A]" />
              <span>[SYS.03 // BI-TEMPORAL DAG]</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-bone font-display tracking-tight leading-[1.05]">
              Deterministic <br />
              Precedence.
            </h2>

            <p className="text-xs md:text-sm text-ash leading-relaxed">
              When documents possess mismatched authority tiers, TruthGuard traverses the Directed Acyclic Graph:
              Tier 1 Mandate &gt; Tier 2 Directive &gt; Tier 3 Policy &gt; Tier 4 Memo &gt; Tier 5 FAQ.
              Superseded clauses are pruned; silent omissions are flagged.
            </p>

            <div className="p-5 border border-[#C4F82A]/30 bg-[#0B0B0D]/90 font-mono text-xs">
              <div className="text-[#C4F82A] font-bold mb-2 flex items-center justify-between pb-2 border-b border-[#C4F82A]/20">
                <span>SILENT REVOCATION DETECTOR</span>
                <span>STATUS: PRUNED</span>
              </div>
              <p className="text-ash text-xs mb-3">
                Mandate <strong className="text-bone">REG-2025-09</strong> enforces FIDO2 Hardware Tokens, silently revoking legacy SMS 2FA.
              </p>
              <div className="p-3 bg-black border border-[#F4F3EF]/10 space-y-1 text-[11px]">
                <div className="text-[#C4F82A]">+ REG-2025-09: FIDO2 Token Enforced [GOVERNING]</div>
                <div className="text-[#FF3B1D] line-through">- FAQ-2023-OLD: SMS 2FA Permitted [REVOKED]</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7">
            {/* Architectural Hierarchy Stack */}
            <div className="p-6 border border-[#F4F3EF]/12 bg-[#0B0B0D]/90 space-y-2.5 font-mono text-xs">
              <div className="text-zinc uppercase text-[10px] tracking-widest pb-2 border-b border-[#F4F3EF]/10 flex items-center justify-between">
                <span>[AUTHORITY DAG RESOLUTION TREE]</span>
                <span className="text-[#C4F82A]">DETERMINISTIC EVALUATION</span>
              </div>

              <div className="p-3 border border-[#C4F82A]/40 bg-[#C4F82A]/5 flex items-center justify-between">
                <span className="text-[#C4F82A] font-bold">TIER 01 // REGULATORY MANDATE</span>
                <span className="text-bone">REG-2025-09 (GOVERNING)</span>
              </div>

              <div className="p-3 border border-[#F4F3EF]/20 bg-black/40 flex items-center justify-between">
                <span className="text-bone font-medium">TIER 02 // SECURITY DIRECTIVE</span>
                <span className="text-ash">SEC-2025-11 (ACTIVE)</span>
              </div>

              <div className="p-3 border border-[#F4F3EF]/12 bg-black/40 flex items-center justify-between">
                <span className="text-ash">TIER 03 // FORMAL POLICY</span>
                <span className="text-zinc">HR-POL-2024 (SUPERSEDED BY SCOPE)</span>
              </div>

              <div className="p-3 border border-[#F4F3EF]/12 bg-black/40 flex items-center justify-between text-zinc">
                <span>TIER 04 // DEPT ADDENDUM</span>
                <span>ENG-MEMO-25 (FIELD EXCEPTION)</span>
              </div>

              <div className="p-3 border border-[#FF3B1D]/30 bg-[#FF3B1D]/5 flex items-center justify-between text-[#FF3B1D]">
                <span className="line-through">TIER 05 // GENERAL FAQ</span>
                <span className="text-[10px] font-bold border border-[#FF3B1D]/40 px-2 py-0.5">REVOKED & PRUNED</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* CHAPTER 04: Cryptographic Merkle Provenance                           */}
      {/* ===================================================================== */}
      <section className="narrative-chapter relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="chapter-num absolute top-12 left-4 text-[18vw] font-display font-black text-bone opacity-10 select-none pointer-events-none leading-none">
          04
        </div>

        <div className="chapter-content grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#C4F82A] uppercase">
              <span className="w-1.5 h-1.5 bg-[#C4F82A]" />
              <span>[SYS.04 // CRYPTOGRAPHIC GROUNDING]</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-bone font-display tracking-tight leading-[1.05]">
              HMAC-SHA256 <br />
              Provenance Seal.
            </h2>

            <p className="text-xs md:text-sm text-ash leading-relaxed">
              Every synthesized claim is decomposed into atomic claims bound to verbatim cited byte-spans.
              The resolution engine seals the verification trajectory with a cryptographic Merkle root hash.
            </p>

            <a
              href="#workbench-terminal"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-bone text-carbon hover:bg-white text-xs font-mono font-bold tracking-widest uppercase transition-colors"
            >
              Test Scenarios in Live Terminal →
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 border border-[#F4F3EF]/12 bg-[#0B0B0D]/90 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4F3EF]/10">
                <span className="text-[#C4F82A] font-bold uppercase tracking-wider">[PROVENANCE RECEIPT]</span>
                <span className="text-zinc">RFC-2104 COMPLIANT</span>
              </div>

              <div>
                <span className="text-zinc block text-[10px] tracking-widest mb-1">MERKLE ROOT DIGEST:</span>
                <div className="p-3 bg-black border border-[#F4F3EF]/10 text-bone break-all select-all text-xs font-mono">
                  0xd13f7247a0607f672c779c2d7f32dd5a1e5da1df4ac7b87c6539603fbb5872e2
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 border border-[#F4F3EF]/10 bg-black/40">
                  <span className="text-zinc block text-[10px] tracking-widest mb-1">ATOMIC CLAIMS</span>
                  <span className="text-[#C4F82A] font-bold text-sm">3 / 3 ENTAILED</span>
                </div>
                <div className="p-3 border border-[#F4F3EF]/10 bg-black/40">
                  <span className="text-zinc block text-[10px] tracking-widest mb-1">UNBACKED CLAIMS</span>
                  <span className="text-bone font-bold text-sm">0 PERMITTED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
