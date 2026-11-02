import React from 'react'
import { AlertTriangle, ShieldX, HelpCircle, FileSpreadsheet } from 'lucide-react'

interface AbstentionBannerProps {
  query: string
}

export const AbstentionBanner: React.FC<AbstentionBannerProps> = ({ query }) => {
  return (
    <div className="relative rounded-2xl p-6 mb-8 bg-gradient-to-r from-rose-950/70 via-slate-900/90 to-amber-950/60 border border-rose-500/40 backdrop-blur-xl shadow-2xl shadow-rose-950/40">
      <div className="flex flex-col md:flex-row items-start gap-5">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
          <ShieldX className="w-6 h-6 animate-pulse" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
              Epistemic Refusal Gate
            </span>
            <span className="text-xs text-slate-400 font-mono">Status: UNRESOLVABLE_ABSTAIN</span>
          </div>

          <h3 className="text-lg font-bold text-white mb-2">
            Autonomous Abstention Triggered — Unresolvable Policy Contradiction
          </h3>

          <p className="text-sm text-slate-300 leading-relaxed mb-4">
            TruthGuard identified direct diametric contradictions between documents possessing identical authority tiers and effective dates.
            Rather than fabricating a compromise or guessing, the system strictly halts synthesis and issues an escalation receipt.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <span className="text-rose-400 font-semibold block mb-0.5">Equal Authority Tier</span>
              Neither document supersedes the other
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <span className="text-rose-400 font-semibold block mb-0.5">Zero Temporal Offset</span>
              Co-current effective validation dates
            </div>
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300">
              <span className="text-amber-400 font-semibold block mb-0.5">Direct NLI Contradiction</span>
              Cross-encoder score exceeds 0.70 threshold
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-rose-500/20 text-xs font-mono text-slate-300">
            <span className="text-slate-500">Query under review:</span> <span className="text-emerald-300">"{query}"</span>
            <div className="mt-1 text-slate-400">
              <strong className="text-rose-400">Action:</strong> Surfacing both dialectic positions side-by-side below for human policy officer determination.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
