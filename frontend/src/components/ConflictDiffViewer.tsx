import React from 'react'
import { PositionSurfaced, ResolutionStatus, ContradictionEdge } from '../types'
import { CheckCircle2, XCircle, GitPullRequest, ShieldAlert, Cpu, Hash } from 'lucide-react'

interface ConflictDiffViewerProps {
  positions: PositionSurfaced[]
  status: ResolutionStatus
  finalAnswer?: string
  contradictions?: ContradictionEdge[]
  corpusHygiene?: {
    infected_documents?: number
    auto_prs?: Array<{
      stale_doc_id: string
      governing_doc_id: string
      governing_date: string
      unified_diff_patch: string
      infection_score: number
    }>
  }
  merkleProvenance?: {
    merkle_root?: string
    span_count?: number
  }
}

export const ConflictDiffViewer: React.FC<ConflictDiffViewerProps> = ({
  positions,
  status,
  finalAnswer,
  contradictions = [],
  corpusHygiene,
  merkleProvenance
}) => {
  if (!positions || positions.length === 0) {
    return null
  }

  const isAbstention = status === ResolutionStatus.UNRESOLVABLE_ABSTAIN
  const governingPositions = positions.filter(p => p.is_governing)
  const supersededPositions = positions.filter(p => p.is_stale || !p.is_governing)
  const autoPrs = corpusHygiene?.auto_prs || []

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 backdrop-blur-xl shadow-2xl">
      {/* Header Banner */}
      <div className={`p-5 border-b ${
        isAbstention
          ? 'bg-rose-950/40 border-rose-500/30'
          : 'bg-emerald-950/30 border-emerald-500/20'
      }`}>
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-mono font-bold tracking-wider rounded-full border ${
              isAbstention
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
            }`}>
              {isAbstention ? 'UNRESOLVABLE ABSTENTION (DEADLOCK)' : 'CONFLICT RESOLVED VIA AUTHORITY DAG'}
            </span>
            {!isAbstention && governingPositions.length > 0 && (
              <span className="text-xs font-mono text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
                Governing Doc: <strong className="text-emerald-400">{governingPositions[0].doc_id}</strong>
              </span>
            )}
          </div>

          {merkleProvenance?.merkle_root && (
            <div className="flex items-center gap-1.5 text-xs font-mono bg-slate-900/90 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-lg">
              <Hash className="w-3.5 h-3.5 text-cyan-400" />
              <span>Merkle: {merkleProvenance.merkle_root.slice(0, 16)}...</span>
              <span className="text-slate-500">({merkleProvenance.span_count || 0} spans)</span>
            </div>
          )}
        </div>

        {finalAnswer && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-sm md:text-base text-slate-200 leading-relaxed font-normal">
            <span className="text-xs font-mono text-emerald-400 block mb-1 uppercase tracking-wider">
              {isAbstention ? 'Abstention Disposition' : 'Epistemically Verified Resolution'}
            </span>
            {finalAnswer}
          </div>
        )}
      </div>

      {/* Cross-Encoder Contradiction Edge Badges */}
      {contradictions.length > 0 && (
        <div className="px-5 pt-4 flex flex-wrap gap-2">
          {contradictions.map((c, i) => (
            <div
              key={i}
              className="text-xs font-mono bg-amber-500/10 border border-amber-500/30 text-amber-300 px-3 py-1.5 rounded-lg flex items-center gap-2"
            >
              <span className="text-amber-400 font-bold">⚡ Contradiction Detected:</span>
              <span>{c.conflict_summary}</span>
              <span className="text-amber-200/60 font-semibold">({Math.round(c.confidence * 100)}% conf · {c.resolution_rule})</span>
            </div>
          ))}
        </div>
      )}

      {/* Side-by-side Git-style Truth Diff */}
      <div className="p-5">
        {isAbstention ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {positions.map((pos) => (
              <div key={pos.doc_id} className="rounded-xl p-4 bg-rose-950/20 border border-rose-500/30">
                <div className="flex items-center gap-2 mb-2">
                  <XCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase">
                    Deadlocked Dialectic Position
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-white mb-1">{pos.title}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{pos.claim_text}</p>
                <div className="mt-3 pt-2 border-t border-rose-500/20 text-xs font-mono text-slate-400 flex items-center justify-between">
                  <span>Doc: {pos.doc_id}</span>
                  <span>Date: {pos.effective_date}</span>
                  <span>Tier: {pos.authority_tier}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Superseded / Stale Column */}
            {supersededPositions.length > 0 && (
              <div className="rounded-xl p-4 bg-slate-950/60 border border-rose-500/30">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-rose-500/20">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span className="text-xs font-mono font-bold text-rose-400 uppercase tracking-wider">
                    − Superseded / Stale Predecessor
                  </span>
                </div>
                {supersededPositions.map((pos) => (
                  <div key={pos.doc_id} className="pl-3 border-l-2 border-rose-500/40 mb-3 last:mb-0">
                    <h4 className="text-sm font-semibold text-slate-300">{pos.title}</h4>
                    <p className="text-sm text-slate-500 line-through decoration-rose-500/60 mt-1">
                      {pos.claim_text}
                    </p>
                    <div className="mt-2 text-xs font-mono text-slate-400 flex flex-wrap gap-2">
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800">{pos.doc_id}</span>
                      <span className="text-rose-400">Date: {pos.effective_date}</span>
                      <span className="text-slate-400">
                        Superseded by {governingPositions[0]?.doc_id || 'higher tier'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Governing / Active Column */}
            {governingPositions.length > 0 && (
              <div className="rounded-xl p-4 bg-slate-950/60 border border-emerald-500/40 shadow-lg shadow-emerald-500/5">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-emerald-500/20">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                    + Governing Active Policy
                  </span>
                </div>
                {governingPositions.map((pos) => (
                  <div key={pos.doc_id} className="pl-3 border-l-2 border-emerald-400 mb-3 last:mb-0">
                    <h4 className="text-sm font-semibold text-white">{pos.title}</h4>
                    <p className="text-sm text-slate-200 mt-1 leading-relaxed">
                      {pos.claim_text}
                    </p>
                    <div className="mt-2 text-xs font-mono text-slate-400 flex flex-wrap gap-2">
                      <span className="bg-slate-900 px-2 py-0.5 rounded border border-slate-800 text-emerald-400">{pos.doc_id}</span>
                      <span className="text-emerald-400">Date: {pos.effective_date}</span>
                      <span className="text-cyan-300">
                        Tier {pos.authority_tier}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Self-Healing Corpus Auto-Redline PR Patch Drawer */}
        {autoPrs.length > 0 && (
          <div className="mt-5 rounded-xl bg-slate-950 border border-cyan-500/30 p-4">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitPullRequest className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-300">
                  Self-Healing Corpus Patch (Automated Redline PR)
                </span>
              </div>
              <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/20">
                {corpusHygiene?.infected_documents || autoPrs.length} Stale Doc(s) Flagged for Auto-Remediation
              </span>
            </div>
            <pre className="text-xs font-mono overflow-x-auto text-emerald-300 bg-slate-900/90 p-3 rounded-lg border border-slate-800 whitespace-pre-wrap leading-relaxed">
              {autoPrs[0].unified_diff_patch}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
