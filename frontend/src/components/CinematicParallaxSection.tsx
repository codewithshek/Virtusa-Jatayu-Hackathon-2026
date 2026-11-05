import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SlabData } from './HeroScene3D'

gsap.registerPlugin(ScrollTrigger)

interface CinematicParallaxSectionProps {
  hoveredSlab?: SlabData | null
  onBurnProgress?: (progress: number) => void
}

export const CinematicParallaxSection: React.FC<CinematicParallaxSectionProps> = ({
  hoveredSlab,
  onBurnProgress,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const act3Ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const ctx = gsap.context(() => {
      // 1. Chapter Hairline Rules & Numeric Watermark ScrollTrigger
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
            { y: 80, opacity: 0 },
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
            { y: 50, opacity: 0 },
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

      // 2. Act III Chameleon Polarity Burn Transition
      if (act3Ref.current && onBurnProgress) {
        ScrollTrigger.create({
          trigger: act3Ref.current,
          start: 'top 90%',
          end: 'top 30%',
          scrub: true,
          onUpdate: (self) => {
            onBurnProgress(self.progress)
          },
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [onBurnProgress])

  return (
    <div ref={containerRef} className="relative w-full z-10 pointer-events-auto">
      {/* Live Raycast Monolith Inspection HUD (When hovering 3D blades) */}
      {hoveredSlab && (
        <aside
          aria-label="3D Blade Inspector"
          className="fixed bottom-6 right-6 z-50 p-4 border border-[#F4F1EA]/20 bg-[#0D0D11]/95 backdrop-blur-md shadow-2xl pointer-events-none rounded-none max-w-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono px-2 py-0.5 bg-[#F4F1EA]/10 text-bone uppercase tracking-widest">
              [SPECTROGRAPH // {hoveredSlab.id}]
            </span>
            <span
              className="text-[10px] font-mono font-bold"
              style={{ color: hoveredSlab.color }}
            >
              {hoveredSlab.status}
            </span>
          </div>
          <div className="text-sm font-bold font-display text-bone mb-1">{hoveredSlab.clause}</div>
          <div className="text-[11px] font-mono text-ash flex items-center justify-between pt-2 border-t border-[#F4F1EA]/10">
            <span>{hoveredSlab.tier}</span>
            <span>PRECEDENCE: TIER {hoveredSlab.tierNum}</span>
          </div>
        </aside>
      )}

      {/* ===================================================================== */}
      {/* ACT I: Epistemic Grounding (Obsidian Void #060608)                    */}
      {/* ===================================================================== */}
      <section className="narrative-chapter relative min-h-screen flex flex-col justify-between px-6 md:px-16 pt-32 pb-20 max-w-7xl mx-auto">
        <div className="chapter-num absolute top-20 right-6 text-[18vw] font-display font-black text-bone opacity-10 select-none pointer-events-none leading-none">
          01
        </div>

        <div className="chapter-content max-w-2xl relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-[#D2FF28]" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#D2FF28] uppercase font-semibold">
              [SYS.01 // EPISTEMIC ENGINE]
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.035em] text-bone font-display leading-[0.94] mb-6">
            Adversarial <br />
            Verification for <br />
            Inconsistent <br />
            Corpora.
          </h1>

          <p className="text-sm sm:text-base text-ash leading-relaxed font-sans max-w-md mb-8">
            Enterprise document corpora decay into diametric policy contradictions across version boundaries.
            TruthGuard rejects probabilistic hallucination, enforcing 3-vector adversarial verification,
            bi-temporal DAG precedence, and autonomous epistemic abstention.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href="#workbench-terminal"
              className="px-7 py-4 bg-[#F4F1EA] text-[#060608] hover:bg-white text-xs font-mono font-bold tracking-widest uppercase transition-colors"
            >
              Initialize Forensic Terminal →
            </a>
            <span className="text-[11px] font-mono text-zinc hidden sm:inline-block">
              [SCROLL TO AUDIT SPECTROGRAPH]
            </span>
          </div>
        </div>

        {/* Technical Coordinate Baseline */}
        <div className="relative z-10 pt-8 border-t border-[#F4F1EA]/10">
          <div className="hairline-rule w-full h-[1px] bg-[#F4F1EA]/20 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-mono text-xs text-ash">
            <div>
              <span className="text-zinc block text-[10px] tracking-widest mb-1">[BACKBONE]</span>
              <span className="text-bone font-medium">NVIDIA NIM // Llama 3.1 70B</span>
            </div>
            <div>
              <span className="text-zinc block text-[10px] tracking-widest mb-1">[PRECEDENCE]</span>
              <span className="text-[#D2FF28] font-medium">5-Tier Authority DAG</span>
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
      {/* ACT II: Deontic Contradiction Isolation (Obsidian Void #060608)       */}
      {/* ===================================================================== */}
      <section className="narrative-chapter relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="chapter-num absolute top-12 left-4 text-[18vw] font-display font-black text-bone opacity-10 select-none pointer-events-none leading-none">
          02
        </div>

        <div className="chapter-content grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#FF331F] uppercase">
              <span className="w-1.5 h-1.5 bg-[#FF331F]" />
              <span>[SYS.02 // DEONTIC CONTRADICTION]</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold text-bone font-display tracking-tight leading-[1.05]">
              Symbolic <br />
              Deontic Clash.
            </h2>

            <p className="text-xs md:text-sm text-ash leading-relaxed">
              Standard LLMs average contradictory policy values into an ungrounded compromise.
              TruthGuard decomposes policy statements into bounded deontic intervals, evaluating
              cross-document satisfiability before draft synthesis.
            </p>

            {/* Industrial Data Box */}
            <div className="p-5 border border-[#FF331F]/30 bg-[#0D0D11]/90 rounded-none font-mono text-xs">
              <div className="flex items-center justify-between text-[#FF331F] font-bold mb-2 pb-2 border-b border-[#FF331F]/20">
                <span>EVALUATION: UNSAT</span>
                <span>DELTA DETECTED</span>
              </div>
              <div className="p-3 bg-black text-[#F4F1EA] mb-2 border border-[#F4F1EA]/10">
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
              <div className="p-5 border border-[#F4F1EA]/12 bg-[#0D0D11]/85 crosshair-corner">
                <div className="flex items-center justify-between text-zinc mb-2">
                  <span>TIER 03 // POLICY</span>
                  <span>DOC: HR-POL-2024</span>
                </div>
                <div className="text-base font-bold font-display text-bone mb-2">
                  Remote Work Allowance
                </div>
                <p className="text-ash font-editorial italic text-sm mb-4 leading-relaxed">
                  "Full-time employees may work remotely up to one (1) day per week with department approval."
                </p>
                <div className="text-[11px] text-[#FF331F] pt-2 border-t border-[#F4F1EA]/10">
                  INTERVAL BOUND: [0, 1] DAYS/WK
                </div>
              </div>

              {/* Blade B */}
              <div className="p-5 border border-[#FF331F]/40 bg-[#0D0D11]/85 crosshair-corner">
                <div className="flex items-center justify-between text-[#FF331F] mb-2">
                  <span>TIER 04 // ADDENDUM</span>
                  <span>DOC: ENG-MEMO-25</span>
                </div>
                <div className="text-base font-bold font-display text-bone mb-2">
                  Engineering Scope Addendum
                </div>
                <p className="text-ash font-editorial italic text-sm mb-4 leading-relaxed">
                  "Field and systems engineering personnel are permitted remote flexibility up to four (4) days per week."
                </p>
                <div className="text-[11px] text-[#FF331F] pt-2 border-t border-[#FF331F]/20">
                  INTERVAL BOUND: [4, 5] DAYS/WK
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* ACT III: Bi-Temporal DAG (Chameleon Polarity Parchment #F4F1EA)       */}
      {/* ===================================================================== */}
      <section
        ref={act3Ref}
        className="narrative-chapter relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 bg-[#F4F1EA] text-[#111110] transition-colors duration-700"
      >
        <div className="chapter-num absolute top-12 right-6 text-[18vw] font-display font-black text-[#111110] opacity-[0.06] select-none pointer-events-none leading-none">
          03
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="chapter-content grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-5 space-y-6">
              <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#111110] uppercase font-semibold">
                <span className="w-1.5 h-1.5 bg-[#111110]" />
                <span>[SYS.03 // BI-TEMPORAL DAG PRECEDENCE]</span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold text-[#111110] font-display tracking-tight leading-[1.05]">
                Deterministic <br />
                Authority Precedence.
              </h2>

              <p className="text-xs md:text-sm text-[#5C5B56] leading-relaxed">
                When documents possess mismatched authority tiers, TruthGuard traverses the Directed Acyclic Graph:
                Tier 1 Mandate &gt; Tier 2 Directive &gt; Tier 3 Policy &gt; Tier 4 Memo &gt; Tier 5 FAQ.
                Superseded clauses are pruned; silent omissions are flagged.
              </p>

              {/* Silent Revocation Card on Parchment */}
              <div className="p-5 border border-[#111110]/20 bg-white shadow-sm font-mono text-xs">
                <div className="text-[#FF331F] font-bold mb-2 flex items-center justify-between pb-2 border-b border-[#111110]/10">
                  <span>SILENT REVOCATION DETECTOR</span>
                  <span>STATUS: PRUNED</span>
                </div>
                <p className="text-[#5C5B56] text-xs mb-3 font-editorial italic">
                  Mandate <strong>REG-2025-09</strong> enforces FIDO2 Hardware Tokens, silently revoking legacy SMS 2FA.
                </p>
                <div className="p-3 bg-[#F4F1EA] border border-[#111110]/15 space-y-1.5 text-[11px]">
                  <div className="text-[#111110] font-semibold">
                    + REG-2025-09: FIDO2 Token Enforced [GOVERNING]
                  </div>
                  <div className="text-[#FF331F] line-through">
                    - FAQ-2023-OLD: SMS 2FA Permitted [REVOKED]
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              {/* Architectural Hierarchy Stack on Archival Parchment */}
              <div className="p-6 border border-[#111110]/20 bg-white/90 shadow-sm space-y-2.5 font-mono text-xs">
                <div className="text-[#5C5B56] uppercase text-[10px] tracking-widest pb-2 border-b border-[#111110]/10 flex items-center justify-between">
                  <span>[AUTHORITY DAG RESOLUTION TREE]</span>
                  <span className="text-[#111110] font-bold">DETERMINISTIC EVALUATION</span>
                </div>

                <div className="p-3 border-l-4 border-l-[#111110] border border-[#111110]/20 bg-[#F4F1EA]/80 flex items-center justify-between">
                  <span className="text-[#111110] font-bold">TIER 01 // REGULATORY MANDATE</span>
                  <span className="text-[#111110] font-semibold">REG-2025-09 (GOVERNING)</span>
                </div>

                <div className="p-3 border border-[#111110]/15 bg-white flex items-center justify-between">
                  <span className="text-[#111110] font-medium">TIER 02 // SECURITY DIRECTIVE</span>
                  <span className="text-[#5C5B56]">SEC-2025-11 (ACTIVE)</span>
                </div>

                <div className="p-3 border border-[#111110]/15 bg-white flex items-center justify-between">
                  <span className="text-[#5C5B56]">TIER 03 // FORMAL POLICY</span>
                  <span className="text-[#8E8E96]">HR-POL-2024 (SUPERSEDED BY SCOPE)</span>
                </div>

                <div className="p-3 border border-[#111110]/15 bg-white flex items-center justify-between text-[#8E8E96]">
                  <span>TIER 04 // DEPT ADDENDUM</span>
                  <span>ENG-MEMO-25 (FIELD EXCEPTION)</span>
                </div>

                <div className="p-3 border border-[#FF331F]/30 bg-[#FF331F]/5 flex items-center justify-between text-[#FF331F]">
                  <span className="line-through">TIER 05 // GENERAL FAQ</span>
                  <span className="text-[10px] font-bold border border-[#FF331F]/40 px-2 py-0.5">REVOKED & PRUNED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================================== */}
      {/* ACT IV: Cryptographic Merkle Provenance (Return to Anodized Carbon)   */}
      {/* ===================================================================== */}
      <section className="narrative-chapter relative min-h-screen flex flex-col justify-center px-6 md:px-16 py-32 max-w-7xl mx-auto">
        <div className="chapter-num absolute top-12 left-4 text-[18vw] font-display font-black text-bone opacity-10 select-none pointer-events-none leading-none">
          04
        </div>

        <div className="chapter-content grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.2em] text-[#D2FF28] uppercase">
              <span className="w-1.5 h-1.5 bg-[#D2FF28]" />
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
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F4F1EA] text-[#060608] hover:bg-white text-xs font-mono font-bold tracking-widest uppercase transition-colors"
            >
              Test Scenarios in Live Terminal →
            </a>
          </div>

          <div className="lg:col-span-7">
            <div className="p-6 border border-[#F4F1EA]/12 bg-[#0D0D11]/90 font-mono text-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F4F1EA]/10">
                <span className="text-[#D2FF28] font-bold uppercase tracking-wider">[PROVENANCE RECEIPT]</span>
                <span className="text-zinc">RFC-2104 COMPLIANT</span>
              </div>

              <div>
                <span className="text-zinc block text-[10px] tracking-widest mb-1">MERKLE ROOT DIGEST:</span>
                <div className="p-3 bg-black border border-[#F4F1EA]/10 text-bone break-all select-all text-xs font-mono">
                  0xd13f7247a0607f672c779c2d7f32dd5a1e5da1df4ac7b87c6539603fbb5872e2
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 border border-[#F4F1EA]/10 bg-black/40">
                  <span className="text-zinc block text-[10px] tracking-widest mb-1">ATOMIC CLAIMS</span>
                  <span className="text-[#D2FF28] font-bold text-sm">3 / 3 ENTAILED</span>
                </div>
                <div className="p-3 border border-[#F4F1EA]/10 bg-black/40">
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
