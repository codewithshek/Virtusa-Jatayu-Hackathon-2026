import React from 'react'
import { AgentTrace } from '../types'
import { Activity, Clock, CheckCircle2, ChevronRight } from 'lucide-react'

interface AgentTraceTimelineProps {
  trace: AgentTrace[]
  latency: number
}

const AGENT_CONFIGS: Record<string, { label: string; color: string; badge: string }> = {
  retriever: { label: 'Retriever Agent', color: 'from-blue-500 to-cyan-400', badge: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
  synthesizer: { label: 'Synthesizer Agent', color: 'from-emerald-500 to-teal-400', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  critic: { label: 'Critic Agent', color: 'from-amber-500 to-orange-400', badge: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  resolution_engine: { label: 'Resolution Engine', color: 'from-purple-500 to-pink-500', badge: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  resolver: { label: 'Resolution Engine', color: 'from-purple-500 to-pink-500', badge: 'text-purple-400 bg-purple-500/10 border-purple-500/30' }
}

export const AgentTraceTimeline: React.FC<AgentTraceTimelineProps> = ({ trace, latency }) => {
  if (!trace || trace.length === 0) {
    return null
  }

  const totalLatency = latency || trace.reduce((sum, t) => sum + (t.latency_ms || 0), 0)

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Agent Trace</h3>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-700/60 text-xs font-mono text-emerald-300">
          <Clock className="w-3 h-3" />
          <span>{totalLatency.toFixed(0)} ms</span>
        </div>
      </div>

      <div className="space-y-4">
        {trace.map((step, index) => {
          const cfg = AGENT_CONFIGS[step.step] || {
            label: step.step,
            color: 'from-slate-500 to-slate-400',
            badge: 'text-slate-400 bg-slate-800 border-slate-700'
          }
          const percentage = totalLatency > 0 ? ((step.latency_ms || 0) / totalLatency) * 100 : 25

          return (
            <div key={index} className="relative pl-6 pb-2 border-l border-slate-800 last:border-transparent">
              <div className="absolute -left-1.5 top-0 w-3 h-3 rounded-full bg-slate-900 border-2 border-emerald-400" />
              
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-mono px-2 py-0.5 rounded border ${cfg.badge}`}>
                  {cfg.label}
                </span>
                <span className="text-xs font-mono text-slate-400">
                  {step.latency_ms ? `${step.latency_ms.toFixed(0)}ms` : '<1ms'}
                </span>
              </div>

              <div className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-1">
                <span>{step.action?.replace(/_/g, ' ') || 'Process'}</span>
                {step.contradictions_found !== undefined && (
                  <span className="text-amber-400 font-mono">({step.contradictions_found} conflicts)</span>
                )}
                {step.provider && (
                  <span className="text-emerald-400 font-mono text-[11px]">[{step.provider}]</span>
                )}
              </div>

              <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${cfg.color} transition-all duration-500`}
                  style={{ width: `${Math.max(percentage, 8)}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
