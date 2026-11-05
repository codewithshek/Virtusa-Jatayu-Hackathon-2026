import React, { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'

interface PreloaderCalibrationProps {
  onComplete?: () => void
}

const STEPS = [
  '[01/04] INITIALIZING THREE.JS R187 GL CORE...',
  '[02/04] COMPILING PMREM STUDIO HDRI...',
  '[03/04] LINKING 5-TIER AUTHORITY GRAPH...',
  '[04/04] EPISTEMIC HOROLOGICAL SPECTROGRAPH READY.',
]

export const PreloaderCalibration: React.FC<PreloaderCalibrationProps> = ({ onComplete }) => {
  const [percent, setPercent] = useState(0)
  const [stepIdx, setStepIdx] = useState(0)
  const [isFinished, setIsFinished] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const svgPathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const counter = { val: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        // SVG curved curtain lift
        if (svgPathRef.current && containerRef.current) {
          const path = svgPathRef.current
          const curveTl = gsap.timeline({
            onComplete: () => {
              setIsFinished(true)
              if (onComplete) onComplete()
            },
          })

          curveTl
            .to(path, {
              attr: { d: 'M 0 0 Q 50 -60 100 0 L 100 0 L 0 0 Z' },
              duration: 0.65,
              ease: 'power3.in',
            })
            .to(
              containerRef.current,
              {
                yPercent: -100,
                duration: 0.55,
                ease: 'power4.inOut',
              },
              '-=0.25'
            )
        } else {
          setIsFinished(true)
          if (onComplete) onComplete()
        }
      },
    })

    // 1.2s smooth counter progression
    tl.to(counter, {
      val: 100,
      duration: 1.2,
      ease: 'power2.inOut',
      onUpdate: () => {
        const current = Math.floor(counter.val)
        setPercent(current)
        if (current < 30) setStepIdx(0)
        else if (current < 65) setStepIdx(1)
        else if (current < 90) setStepIdx(2)
        else setStepIdx(3)
      },
    })

    return () => {
      tl.kill()
    }
  }, [onComplete])

  if (isFinished) return null

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#060608] text-[#F4F1EA] flex flex-col justify-between p-8 sm:p-14 select-none pointer-events-auto"
      style={{ willChange: 'transform' }}
    >
      {/* Top telemetry bar */}
      <div className="flex items-center justify-between font-mono text-xs border-b border-[#F4F1EA]/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 bg-[#D2FF28] animate-pulse" />
          <span className="tracking-widest uppercase text-bone font-bold">
            TRUTHGUARD // SYSTEM BOOTSTRAP
          </span>
        </div>
        <div className="text-zinc">
          CALIBRATION ROUTINE // 2026
        </div>
      </div>

      {/* Center monumental tabular counter */}
      <div className="flex flex-col items-center justify-center my-auto space-y-4">
        <div className="text-[18vw] sm:text-[14vw] font-display font-black leading-none text-[#F4F1EA] tracking-tighter tabular-nums">
          {percent.toString().padStart(3, '0')}%
        </div>
        <div className="font-mono text-xs sm:text-sm text-[#D2FF28] tracking-widest uppercase">
          {STEPS[stepIdx]}
        </div>
      </div>

      {/* Bottom technical progress track */}
      <div className="border-t border-[#F4F1EA]/10 pt-4 font-mono text-xs text-zinc flex items-center justify-between">
        <div>
          <span>INITIALIZING SPECTROGRAPH HARNESS</span>
        </div>
        <div className="w-32 sm:w-64 h-1 bg-[#141418] overflow-hidden border border-[#F4F1EA]/10">
          <div
            className="h-full bg-[#D2FF28] transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div>
          <span>MEM: 64MB OK</span>
        </div>
      </div>

      {/* SVG Curved Mask for the curtain lift */}
      <svg
        className="absolute bottom-0 left-0 w-full h-24 sm:h-36 pointer-events-none transform translate-y-full text-[#060608]"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          ref={svgPathRef}
          d="M 0 0 Q 50 0 100 0 L 100 0 L 0 0 Z"
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

