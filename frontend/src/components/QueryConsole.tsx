import React, { useState } from 'react'
import { Search, Send, Loader2, Sparkles, Terminal, ShieldAlert } from 'lucide-react'
import { ResolutionStatus } from '../types'

interface QueryConsoleProps {
  onSubmit: (query: string) => Promise<any>
  onLoadScenario: (scenario: string) => Promise<any>
  isLoading: boolean
}

const SCENARIOS = [
  {
    id: 'scenario-1',
    label: 'Remote Work Policy Supersession',
    query: 'How many days per week can employees work remotely according to the policy?',
    tag: 'Supersession & Amendment',
    badgeColor: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
  },
  {
    id: 'scenario-2',
    label: 'Deadlocked Retention Mandate',
    query: 'What is the mandatory cold-storage retention window for telemetry audit logs?',
    tag: 'Equal-Tier Contradiction (Abstain)',
    badgeColor: 'border-rose-500/30 text-rose-400 bg-rose-500/10'
  },
  {
    id: 'scenario-3',
    label: 'Customer SLA vs Marketing FAQ',
    query: 'What is the guaranteed uptime SLA for enterprise cloud deployments?',
    tag: 'Hierarchy Precedence',
    badgeColor: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10'
  },
  {
    id: 'scenario-4',
    label: 'Unbacked Hallucination Trap',
    query: 'What is the maximum reimbursement amount for private aircraft charter expenses?',
    tag: 'Zero-Support Rejection',
    badgeColor: 'border-amber-500/30 text-amber-400 bg-amber-500/10'
  }
]

export const QueryConsole: React.FC<QueryConsoleProps> = ({ onSubmit, onLoadScenario, isLoading }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim() && !isLoading) {
      await onSubmit(query.trim())
    }
  }

  const handleScenario = async (scenarioQuery: string) => {
    setQuery(scenarioQuery)
    await onLoadScenario(scenarioQuery)
  }

  return (
    <div id="interactive-console" className="relative z-10 max-w-6xl mx-auto px-6 py-8">
      <div className="glass-panel-glow rounded-3xl p-6 md:p-8 backdrop-blur-2xl border border-slate-700/60 shadow-2xl relative overflow-hidden">
        {/* Subtle Ambient Backlight */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Console Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800/80 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Adversarial Query Terminal
                <span className="text-xs px-2 py-0.5 rounded-full font-mono bg-slate-800 text-emerald-400 border border-emerald-500/30 font-normal">
                  v2.4 Grounded
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Execute cross-corpus epistemic verification against contradictory document layers
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>NVIDIA NIM: meta/llama-3.1-70b-instruct</span>
          </div>
        </div>

        {/* Preset Verification Scenarios */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Benchmark Attack Vectors & Policy Scenarios</span>
            </label>
            <span className="text-[11px] text-slate-500 font-mono">1-Click Automated Run</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => handleScenario(s.query)}
                disabled={isLoading}
                className="text-left p-3.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/40 transition-all duration-200 group relative disabled:opacity-50"
              >
                <div className={`inline-block text-[10px] font-mono px-2 py-0.5 rounded-md border mb-2 ${s.badgeColor}`}>
                  {s.tag}
                </div>
                <div className="text-sm font-semibold text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-1">
                  {s.label}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {s.query}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="relative">
          <div className="relative flex items-center">
            <div className="absolute left-4 pointer-events-none text-slate-400">
              <Search className="w-5 h-5 text-emerald-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Query the enterprise corpus (e.g. 'Can employees work remotely on Fridays?')..."
              disabled={isLoading}
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm md:text-base focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner disabled:opacity-50 font-normal"
            />
            <button
              type="submit"
              disabled={isLoading || !query.trim()}
              className="absolute right-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-semibold text-sm flex items-center gap-2 shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <span>Verify</span>
                  <Send className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
