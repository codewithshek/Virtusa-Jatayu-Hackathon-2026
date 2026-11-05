import React from 'react'
import { AgentTrace } from '../types'
import { Clock } from 'lucide-react'

interface AgentTraceTimelineProps {
  trace: AgentTrace[]
  latency: number
}

const AGENT_LABELS: Record<string, string> = {
  retriever: 'RETRIEVER // BM25 + FAISS + DAG',
  synthesizer: 'SYNTHESIZER // NIM LLAMA 3.1 70B',
  critic: 'CRITIC // 3-VECTOR ADVERSARY',
  resolution_engine: 'RESOLVER // DEONTIC PRECEDENCE',
  resolver: 'RESOLVER // DEONTIC PRECEDENCE',
}

export const AgentTraceTimeline: React.FC<AgentTraceTimelineProps> = ({ trace, latency }) => {
  if (!trace || trace.length === 0) {
    return null
  }

  const totalLatency = latency || trace.reduce((sum, t) => sum + (t.latency_ms || 0), 0)

  return (
    <div className="w-full border border-[#F4F1EA]/12 bg-[#0D0D11]/90 crosshair-corner p-5 font-sans">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F4F1EA]/10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#D2FF28] uppercase">
          [SYS.02 // TRACE TELEMETRY]
        </span>
        <div className="flex items-center gap-1.5 font-mono text-[11px] text-zinc">
          <Clock className="w-3 h-3 text-ash" />
          <span className="text-bone font-bold">{totalLatency.toFixed(0)} ms</span>
        </div>
      </div>

      <div className="space-y-4 font-mono text-xs">
        {trace.map((step, index) => {
          const label = AGENT_LABELS[step.step] || step.step.toUpperCase()
          const percentage = totalLatency > 0 ? ((step.latency_ms || 0) / totalLatency) * 100 : 25

          return (
            <div key={index} className="space-y-1.5 pb-3 border-b border-[#F4F1EA]/5 last:border-b-0 last:pb-0">
              <div className="flex items-center justify-between">
                <span className="text-bone font-medium text-[11px]">{label}</span>
                <span className="text-zinc text-[11px]">
                  {step.latency_ms ? `${step.latency_ms.toFixed(0)}ms` : '<1ms'}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ash">
                <span>{step.action?.toUpperCase().replace(/_/g, ' ') || 'EXECUTION'}</span>
                {step.contradictions_found !== undefined && (
                  <span className="text-[#FF331F] font-bold">
                    [{step.contradictions_found} CONFLICTS]
                  </span>
                )}
                {step.provider && (
                  <span className="text-[#D2FF28]">[{step.provider}]</span>
                )}
              </div>

              <div className="w-full bg-black h-1 overflow-hidden border border-[#F4F1EA]/10 mt-1.5">
                <div
                  className="h-full bg-[#D2FF28]"
                  style={{ width: `${Math.max(percentage, 6)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
