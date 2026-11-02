import React from 'react'
import { ClaimAuditResult } from '../types'

interface ClaimAuditTableProps {
  audits: ClaimAuditResult[]
}

export const ClaimAuditTable: React.FC<ClaimAuditTableProps> = ({ audits }) => {
  if (!audits || audits.length === 0) {
    return null
  }

  const passedCount = audits.filter((a) => a.is_supported && !a.relies_on_stale_source).length

  return (
    <div className="w-full border border-[#F4F3EF]/12 bg-[#0B0B0D]/90 crosshair-corner p-6 font-sans">
      <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#F4F3EF]/10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#C4F82A] uppercase">
          [SYS.05 // CRITIC CLAIM AUDIT MATRIX]
        </span>
        <span className="font-mono text-[11px] text-zinc">
          DISPOSITION: <strong className="text-bone">{passedCount} / {audits.length} VERIFIED</strong>
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-black/60 border-b border-[#F4F3EF]/10 text-zinc text-[10px] tracking-widest uppercase">
            <tr>
              <th className="py-3 px-4">GATE</th>
              <th className="py-3 px-4">CLAIM ID</th>
              <th className="py-3 px-4">VERIFICATION RATIONALE</th>
              <th className="py-3 px-4">PASSAGE CITATION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F4F3EF]/5">
            {audits.map((a, idx) => {
              const isBacked = a.is_supported && !a.relies_on_stale_source
              const isStale = a.relies_on_stale_source
              const isRejected = !a.is_supported

              return (
                <tr key={a.claim_id || idx} className="hover:bg-white/[0.02]">
                  <td className="py-3 px-4">
                    {isBacked && (
                      <span className="text-[#C4F82A] font-bold text-[10px] border border-[#C4F82A]/40 px-2 py-0.5">
                        [BACKED]
                      </span>
                    )}
                    {isStale && (
                      <span className="text-[#FF3B1D] font-bold text-[10px] border border-[#FF3B1D]/40 px-2 py-0.5">
                        [STALE SOURCE]
                      </span>
                    )}
                    {isRejected && (
                      <span className="text-[#FF3B1D] font-bold text-[10px] border border-[#FF3B1D]/40 px-2 py-0.5">
                        [REJECTED]
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-bone font-bold">{a.claim_id}</td>
                  <td className="py-3 px-4 text-ash">
                    {a.failure_reason || 'Verified entailment against governing passage'}
                  </td>
                  <td className="py-3 px-4 text-zinc">
                    {a.supporting_passage_ids && a.supporting_passage_ids.length > 0 ? (
                      a.supporting_passage_ids.map((id, pidx) => (
                        <span key={pidx} className="mr-2 text-bone">
                          [{id}]
                        </span>
                      ))
                    ) : (
                      <span className="text-zinc italic">None (Hallucination pruned)</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
