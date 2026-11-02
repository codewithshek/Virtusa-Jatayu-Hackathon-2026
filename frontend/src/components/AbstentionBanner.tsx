import React from 'react'

interface AbstentionBannerProps {
  query: string
}

export const AbstentionBanner: React.FC<AbstentionBannerProps> = ({ query }) => {
  return (
    <div className="w-full border border-[#FF3B1D] bg-[#0B0B0D] p-6 crosshair-corner font-mono text-xs">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#FF3B1D]/30">
        <span className="text-[11px] tracking-[0.2em] font-bold text-[#FF3B1D] uppercase">
          [ALERT // AUTONOMOUS ABSTENTION GATE TRIGGERED]
        </span>
        <span className="text-[10px] text-zinc">STATUS: UNRESOLVABLE_ABSTAIN</span>
      </div>

      <div className="space-y-3">
        <div className="text-base font-bold font-display text-bone">
          Direct Diametric Contradiction at Equal Authority Precedence
        </div>

        <p className="text-ash font-sans text-xs leading-relaxed max-w-2xl">
          TruthGuard detected competing policy positions possessing identical effective dates and equal authority tiers.
          In accordance with epistemic honesty guarantees, the system strictly halts synthesis to prevent hallucinated averaging.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3 border border-[#FF3B1D]/20 bg-black/60">
            <span className="text-[#FF3B1D] block text-[10px] tracking-widest uppercase mb-1">EQUAL TIER</span>
            <span className="text-bone">Neither document supersedes</span>
          </div>
          <div className="p-3 border border-[#FF3B1D]/20 bg-black/60">
            <span className="text-[#FF3B1D] block text-[10px] tracking-widest uppercase mb-1">TEMPORAL PARITY</span>
            <span className="text-bone">Co-current effective dates</span>
          </div>
          <div className="p-3 border border-[#FF3B1D]/20 bg-black/60">
            <span className="text-[#FF3B1D] block text-[10px] tracking-widest uppercase mb-1">DEONTIC UNSAT</span>
            <span className="text-bone">Cross-encoder confidence &gt; 0.70</span>
          </div>
        </div>

        <div className="p-3 bg-black border border-[#FF3B1D]/30 text-[11px] text-zinc mt-2">
          <span className="text-bone">QUERY UNDER REVIEW:</span> "{query}"
        </div>
      </div>
    </div>
  )
}
