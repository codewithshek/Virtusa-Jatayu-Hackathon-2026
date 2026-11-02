import React from 'react'
import { DocumentNode, EdgeData, DocAuthorityTier } from '../types'
import { GitBranch, Layers, ArrowUp, CheckCircle, AlertCircle } from 'lucide-react'

interface AuthorityDagGraphProps {
  dagData: {
    nodes: DocumentNode[]
    edges: EdgeData[]
  } | null
}

const TIER_LABELS: Record<number, string> = {
  [DocAuthorityTier.FAQ]: 'Tier 1: FAQ',
  [DocAuthorityTier.MEMO]: 'Tier 2: Memo',
  [DocAuthorityTier.POLICY]: 'Tier 3: Policy',
  [DocAuthorityTier.AMENDMENT]: 'Tier 4: Amendment',
  [DocAuthorityTier.REGULATORY_MANDATE]: 'Tier 5: Regulatory'
}

export const AuthorityDagGraph: React.FC<AuthorityDagGraphProps> = ({ dagData }) => {
  if (!dagData || dagData.nodes.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-5 border border-slate-800 backdrop-blur-xl">
        <div className="flex items-center gap-2 mb-3">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Authority DAG</h3>
        </div>
        <p className="text-xs text-slate-500 font-mono">Syncing DAG lineage topology...</p>
      </div>
    )
  }

  const { nodes, edges } = dagData

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Authority DAG</h3>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
          Bi-Temporal Lineage
        </span>
      </div>

      {/* Hierarchy Precedence Flow Legend */}
      <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 mb-4 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-rose-400">
          <span>Stale</span>
          <span className="w-2 h-2 rounded-full bg-rose-500" />
        </div>
        <div className="flex items-center gap-1 text-slate-600">
          <span>Tier 1-2</span>
          <span>→</span>
          <span>Tier 3 (Policy)</span>
          <span>→</span>
          <span className="text-emerald-400 font-bold">Tier 4-5 (Governing)</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active</span>
        </div>
      </div>

      {/* SVG Network Map */}
      <div className="rounded-xl bg-slate-950/90 border border-slate-800/80 p-3 overflow-x-auto">
        <svg
          viewBox={`0 0 460 ${Math.max(nodes.length * 65 + 40, 260)}`}
          className="w-full min-w-[340px] h-auto"
        >
          <defs>
            <marker
              id="arrow-cyan"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#06b6d4" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, idx) => {
            const sourceIdx = nodes.findIndex(n => n.id === edge.source)
            const targetIdx = nodes.findIndex(n => n.id === edge.target)
            if (sourceIdx === -1 || targetIdx === -1) return null

            const y1 = 45 + sourceIdx * 60
            const y2 = 45 + targetIdx * 60

            return (
              <g key={`edge-${idx}`}>
                <path
                  d={`M 150 ${y1} C 210 ${y1}, 210 ${y2}, 260 ${y2}`}
                  stroke="#06b6d4"
                  strokeWidth="2"
                  strokeDasharray="4,3"
                  fill="none"
                  opacity="0.6"
                  markerEnd="url(#arrow-cyan)"
                />
              </g>
            )
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const isSuperseded = node.is_superseded
            const y = 45 + idx * 60
            const x = isSuperseded ? 80 : 340

            return (
              <g key={node.id} className="cursor-pointer transition-transform">
                {/* Node Box */}
                <rect
                  x={x - 65}
                  y={y - 20}
                  width="130"
                  height="40"
                  rx="8"
                  fill={isSuperseded ? '#1e1b2e' : '#0c221f'}
                  stroke={isSuperseded ? '#e11d48' : '#10b981'}
                  strokeWidth="1.5"
                />

                {/* Node Title */}
                <text
                  x={x - 52}
                  y={y - 2}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="monospace"
                  fill={isSuperseded ? '#fda4af' : '#6ee7b7'}
                >
                  {node.id}
                </text>

                {/* Subtitle / Scope */}
                <text
                  x={x - 52}
                  y={y + 12}
                  fontSize="9"
                  fontFamily="sans-serif"
                  fill="#94a3b8"
                >
                  {TIER_LABELS[node.tier] || `Tier ${node.tier}`}
                </text>

                {/* Status Indicator */}
                <circle
                  cx={x + 48}
                  cy={y}
                  r="6"
                  fill={isSuperseded ? '#f43f5e' : '#10b981'}
                />
              </g>
            )
          })}
        </svg>
      </div>

      {/* Document Hierarchy Quick List */}
      <div className="mt-4 space-y-2">
        <h4 className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Corpus Precedence Hierarchy
        </h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {nodes.map(node => (
            <div
              key={node.id}
              className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs font-mono"
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${node.is_superseded ? 'bg-rose-500' : 'bg-emerald-400'}`} />
                <span className="text-white font-medium">{node.id}</span>
              </div>
              <span className={node.is_superseded ? 'text-rose-400 text-[11px]' : 'text-emerald-400 text-[11px]'}>
                {node.is_superseded ? 'Superseded' : 'Governing'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
