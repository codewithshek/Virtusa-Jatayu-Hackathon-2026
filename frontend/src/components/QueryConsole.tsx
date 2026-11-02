import React, { useState } from 'react'
import { Search, ArrowRight, Loader2 } from 'lucide-react'

interface QueryConsoleProps {
  onSubmit: (query: string) => Promise<any>
  onLoadScenario: (scenario: string) => Promise<any>
  isLoading: boolean
}

const SCENARIOS = [
  {
    id: 'sc-1',
    code: 'SC.01',
    label: 'Remote Work Supersession',
    query: 'How many days per week can employees work remotely according to the policy?',
    tag: 'SUPERSESSION & AMENDMENT',
    isConflict: false,
  },
  {
    id: 'sc-2',
    code: 'SC.02',
    label: 'Deadlocked Retention Mandate',
    query: 'What is the mandatory cold-storage retention window for telemetry audit logs?',
    tag: 'EQUAL-TIER DEADLOCK [ABSTAIN]',
    isConflict: true,
  },
  {
    id: 'sc-3',
    code: 'SC.03',
    label: 'Enterprise SLA vs FAQ',
    query: 'What is the guaranteed uptime SLA for enterprise cloud deployments?',
    tag: 'HIERARCHY PRECEDENCE',
    isConflict: false,
  },
  {
    id: 'sc-4',
    code: 'SC.04',
    label: 'Unbacked Hallucination Trap',
    query: 'What is the maximum reimbursement amount for private aircraft charter expenses?',
    tag: 'ZERO-GROUNDING FILTER',
    isConflict: false,
  },
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
    <div className="w-full border border-[#F4F3EF]/12 bg-[#0B0B0D]/90 crosshair-corner p-6 md:p-8 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-[#F4F3EF]/10 gap-4">
        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] text-[#C4F82A] uppercase mb-1">
            [SYS.01 // ADVERSARIAL QUERY TERMINAL]
          </div>
          <h3 className="text-xl font-bold font-display text-bone">
            Cross-Corpus Epistemic Query Arena
          </h3>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-ash bg-black/60 px-3 py-1.5 border border-[#F4F3EF]/10">
          <span className="w-2 h-2 bg-[#C4F82A] animate-pulse" />
          <span>INFERENCE: NVIDIA NIM // Llama 3.1 70B</span>
        </div>
      </div>

      {/* Preset Scenarios */}
      <div className="mb-6">
        <div className="font-mono text-[10px] tracking-widest text-zinc uppercase mb-3 flex items-center justify-between">
          <span>SELECT ADVERSARIAL TEST VECTOR:</span>
          <span>1-CLICK EXECUTION</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => handleScenario(s.query)}
              disabled={isLoading}
              className={`text-left p-3.5 border transition-all duration-150 disabled:opacity-50 ${
                s.isConflict
                  ? 'border-[#FF3B1D]/30 bg-black/40 hover:border-[#FF3B1D] hover:bg-[#FF3B1D]/5'
                  : 'border-[#F4F3EF]/10 bg-black/40 hover:border-[#C4F82A] hover:bg-[#C4F82A]/5'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-zinc mb-2">
                <span>[{s.code}]</span>
                <span className={s.isConflict ? 'text-[#FF3B1D]' : 'text-[#C4F82A]'}>{s.tag}</span>
              </div>
              <div className="text-bone font-medium text-xs mb-1 line-clamp-1">{s.label}</div>
              <div className="text-[11px] text-zinc line-clamp-2">{s.query}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Query Input */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center border border-[#F4F3EF]/20 bg-black/80">
          <div className="pl-4 pr-2 text-zinc">
            <Search className="w-4 h-4 text-ash" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Input proposition or policy question..."
            disabled={isLoading}
            className="w-full py-4 pr-36 bg-transparent text-bone placeholder:text-zinc text-xs sm:text-sm font-mono focus:outline-none"
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-2 px-5 py-2.5 bg-bone text-carbon hover:bg-white text-xs font-mono font-bold tracking-widest uppercase transition-colors flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AUDITING...</span>
              </>
            ) : (
              <>
                <span>VERIFY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
