import React from 'react'
import { PositionSurfaced, ResolutionStatus, ContradictionEdge } from '../types'
import { Hash, GitPullRequest } from 'lucide-react'

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
  const governingPositions = positions.filter((p) => p.is_governing)
  const supersededPositions = positions.filter((p) => p.is_stale || !p.is_governing)
  const autoPrs = corpusHygiene?.auto_prs || []

  return (
    <div className="w-full border border-[#F4F1EA]/12 bg-[#0D0D11]/90 crosshair-corner p-6 font-sans">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between pb-4 mb-5 border-b border-[#F4F1EA]/10 gap-3">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-[#D2FF28]">
            [SYS.03 // DEONTIC DIFF MATRIX]
          </span>
          <span
            className={`font-mono text-[10px] px-2 py-0.5 border uppercase tracking-wider font-bold ${
              isAbstention
                ? 'border-[#FF331F]/40 text-[#FF331F] bg-[#FF331F]/5'
                : 'border-[#D2FF28]/40 text-[#D2FF28] bg-[#D2FF28]/5'
            }`}
          >
            {isAbstention ? 'DEADLOCK REFUSAL [ABSTAIN]' : 'RESOLVED VIA AUTHORITY DAG'}
          </span>
        </div>

        {merkleProvenance?.merkle_root && (
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc bg-black/60 px-3 py-1 border border-[#F4F1EA]/10">
            <Hash className="w-3.5 h-3.5 text-ash" />
            <span className="text-bone">{merkleProvenance.merkle_root.slice(0, 18)}...</span>
            <span className="text-zinc">({merkleProvenance.span_count || 0} spans)</span>
          </div>
        )}
      </div>

      {/* Final Synthesized Resolution Box */}
      {finalAnswer && (
        <div className="p-4 bg-black/70 border border-[#F4F1EA]/10 mb-6 font-mono text-xs text-bone leading-relaxed">
          <div className="text-[10px] tracking-widest text-[#D2FF28] uppercase mb-1.5 font-bold">
            {isAbstention ? '[ABSTENTION DISPOSITION]' : '[EPISTEMICALLY GOVERNING RESOLUTION]'}
          </div>
          {finalAnswer}
        </div>
      )}

      {/* Contradiction Edges Found */}
      {contradictions.length > 0 && (
        <div className="mb-6 space-y-2">
          {contradictions.map((c, i) => (
            <div
              key={i}
              className="p-3 border border-[#FF331F]/30 bg-[#FF331F]/5 font-mono text-xs flex flex-wrap items-center justify-between gap-2"
            >
              <div className="text-[#FF331F] font-bold">
                [CONTRADICTION DETECTED] // {c.conflict_summary}
              </div>
              <div className="text-zinc text-[11px]">
                CONFIDENCE: {(c.confidence * 100).toFixed(0)}% · RULE: {c.resolution_rule}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side-by-side Git Diff View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
        {/* Superseded Stale Position */}
        {supersededPositions.length > 0 && (
          <div className="p-5 border-l-2 border-l-[#FF331F] border border-[#FF331F]/30 bg-black/40">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#FF331F]/20 text-[#FF331F] text-[10px] tracking-widest uppercase font-bold">
              <span>[-] SUPERSEDED PREDECESSOR</span>
              <span>PRUNED</span>
            </div>
            {supersededPositions.map((pos) => (
              <div key={pos.doc_id} className="space-y-1.5 mb-4 last:mb-0">
                <div className="text-bone font-medium font-sans text-sm">{pos.title}</div>
                <div className="text-ash font-editorial italic text-xs leading-relaxed line-through decoration-[#FF331F]/60">
                  "{pos.claim_text}"
                </div>
                <div className="text-[10px] text-zinc pt-2 border-t border-[#F4F1EA]/5 flex items-center justify-between">
                  <span>DOC: {pos.doc_id}</span>
                  <span>DATE: {pos.effective_date}</span>
                  <span className="text-[#FF331F]">TIER {pos.authority_tier}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Governing Active Position */}
        {governingPositions.length > 0 && (
          <div className="p-5 border-l-2 border-l-[#D2FF28] border border-[#D2FF28]/40 bg-black/40">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#D2FF28]/20 text-[#D2FF28] text-[10px] tracking-widest uppercase font-bold">
              <span>[+] GOVERNING ACTIVE CLAUSE</span>
              <span>ENFORCED</span>
            </div>
            {governingPositions.map((pos) => (
              <div key={pos.doc_id} className="space-y-1.5 mb-4 last:mb-0">
                <div className="text-bone font-medium font-sans text-sm">{pos.title}</div>
                <div className="text-bone font-editorial italic text-xs leading-relaxed">
                  "{pos.claim_text}"
                </div>
                <div className="text-[10px] text-zinc pt-2 border-t border-[#F4F1EA]/5 flex items-center justify-between">
                  <span>DOC: {pos.doc_id}</span>
                  <span>DATE: {pos.effective_date}</span>
                  <span className="text-[#D2FF28]">TIER {pos.authority_tier}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Auto-Redline PR Patch Drawer */}
      {autoPrs.length > 0 && (
        <div className="mt-5 border border-[#F4F1EA]/10 bg-black/70 p-4 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#F4F1EA]/10">
            <div className="flex items-center gap-2 text-[#D2FF28]">
              <GitPullRequest className="w-3.5 h-3.5" />
              <span className="text-[10px] tracking-widest uppercase font-bold">
                [SELF-HEALING CORPUS AST REDLINE PR]
              </span>
            </div>
            <span className="text-zinc text-[11px]">
              {corpusHygiene?.infected_documents || autoPrs.length} Stale Document(s) Flagged
            </span>
          </div>
          <pre className="text-[11px] text-[#D2FF28] bg-black p-3 border border-[#F4F1EA]/10 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {autoPrs[0].unified_diff_patch}
          </pre>
        </div>
      )}
    </div>
  )
}
