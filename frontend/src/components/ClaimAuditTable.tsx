import React from 'react'
import { ClaimAuditResult } from '../types'
import { CheckCircle2, AlertTriangle, XCircle, ShieldCheck } from 'lucide-react'

interface ClaimAuditTableProps {
  audits: ClaimAuditResult[]
}

const STATUS_CONFIG = {
  supported: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
    label: 'Backed by Source',
    text: 'text-emerald-300'
  },
  stale: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />,
    label: 'Relies on Stale Source',
    text: 'text-amber-300'
  },
  unsupported: {
    bg: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    icon: <XCircle className="w-3.5 h-3.5 text-rose-400" />,
    label: 'Unsupported (Filtered)',
    text: 'text-rose-300'
  }
}

export const ClaimAuditTable: React.FC<ClaimAuditTableProps> = ({ audits }) => {
  if (!audits || audits.length === 0) {
    return null
  }

  const getConfig = (audit: ClaimAuditResult) => {
    if (!audit.is_supported) return STATUS_CONFIG.unsupported
    if (audit.relies_on_stale_source) return STATUS_CONFIG.stale
    return STATUS_CONFIG.supported
  }

  return (
    <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800 backdrop-blur-xl shadow-2xl">
      <div className="flex items-center justify-between p-5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
            Critic Claim Audit Matrix
          </h3>
        </div>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          {audits.filter(a => a.is_supported && !a.relies_on_stale_source).length} / {audits.length} Passed
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-950/80 text-xs font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-5 py-3">Verification Gate</th>
              <th className="px-5 py-3">Claim Identifier</th>
              <th className="px-5 py-3">Audit Details & Rationale</th>
              <th className="px-5 py-3">Grounded Passage IDs</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {audits.map((audit, idx) => {
              const config = getConfig(audit)

              return (
                <tr key={audit.claim_id || idx} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${config.bg} ${config.border} ${config.text}`}>
                      {config.icon}
                      <span className="font-semibold">{config.label}</span>
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-white font-bold">{audit.claim_id}</td>
                  <td className="px-5 py-3.5 text-slate-300">
                    {audit.failure_reason || 'Verified entailment against governing passage'}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex flex-wrap gap-1">
                      {audit.supporting_passage_ids && audit.supporting_passage_ids.length > 0 ? (
                        audit.supporting_passage_ids.map((pid, pidx) => (
                          <span
                            key={pidx}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 text-[11px]"
                          >
                            {pid}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-500 italic">None (Hallucination blocked)</span>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Entailed & Active</span>
          </div>
          <div className="flex items-center gap-1.5 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Stale Document Source</span>
          </div>
          <div className="flex items-center gap-1.5 text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            <span>Unbacked (Stripped)</span>
          </div>
        </div>
        <span className="text-slate-500">Autonomous 3-Vector Critique</span>
      </div>
    </div>
  )
}
