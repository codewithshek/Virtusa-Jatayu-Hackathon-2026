import React from 'react'
import { DocumentNode, EdgeData, DocAuthorityTier } from '../types'

interface AuthorityDagGraphProps {
  dagData: {
    nodes: DocumentNode[]
    edges: EdgeData[]
  } | null
}

const TIER_NAMES: Record<number, string> = {
  [DocAuthorityTier.FAQ]: 'T1: FAQ',
  [DocAuthorityTier.MEMO]: 'T2: MEMO',
  [DocAuthorityTier.POLICY]: 'T3: POLICY',
  [DocAuthorityTier.AMENDMENT]: 'T4: AMENDMENT',
  [DocAuthorityTier.REGULATORY_MANDATE]: 'T5: MANDATE',
}

export const AuthorityDagGraph: React.FC<AuthorityDagGraphProps> = ({ dagData }) => {
  if (!dagData || dagData.nodes.length === 0) {
    return (
      <div className="w-full border border-[#F4F1EA]/12 bg-[#0D0D11]/90 p-5 font-mono text-xs text-zinc">
        <span>[SYS.04 // AUTHORITY DAG LINEAGE INITIALIZING...]</span>
      </div>
    )
  }

  const { nodes, edges } = dagData

  return (
    <div className="w-full border border-[#F4F1EA]/12 bg-[#0D0D11]/90 crosshair-corner p-5 font-sans">
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#F4F1EA]/10">
        <span className="font-mono text-[11px] tracking-[0.2em] text-[#D2FF28] uppercase">
          [SYS.04 // BI-TEMPORAL DAG]
        </span>
        <span className="font-mono text-[10px] text-zinc">
          {nodes.length} NODES · {edges.length} EDGES
        </span>
      </div>

      {/* SVG Network Graph */}
      <div className="border border-[#F4F1EA]/10 bg-black/60 p-3 overflow-x-auto mb-4">
        <svg
          viewBox={`0 0 460 ${Math.max(nodes.length * 62 + 30, 240)}`}
          className="w-full min-w-[320px] h-auto"
        >
          <defs>
            <marker
              id="dag-arrow"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(244, 241, 234, 0.4)" />
            </marker>
          </defs>

          {/* Edges */}
          {edges.map((edge, idx) => {
            const sIdx = nodes.findIndex((n) => n.id === edge.source)
            const tIdx = nodes.findIndex((n) => n.id === edge.target)
            if (sIdx === -1 || tIdx === -1) return null

            const y1 = 40 + sIdx * 58
            const y2 = 40 + tIdx * 58

            return (
              <path
                key={`edge-${idx}`}
                d={`M 150 ${y1} C 210 ${y1}, 210 ${y2}, 260 ${y2}`}
                stroke="rgba(244, 241, 234, 0.25)"
                strokeWidth="1.5"
                strokeDasharray="4,3"
                fill="none"
                markerEnd="url(#dag-arrow)"
              />
            )
          })}

          {/* Nodes */}
          {nodes.map((node, idx) => {
            const isSuperseded = node.is_superseded
            const y = 40 + idx * 58
            const x = isSuperseded ? 80 : 340

            return (
              <g key={node.id}>
                <rect
                  x={x - 65}
                  y={y - 18}
                  width="130"
                  height="36"
                  fill="#060608"
                  stroke={isSuperseded ? '#FF331F' : '#D2FF28'}
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={y - 2}
                  fontSize="11"
                  fontWeight="600"
                  fontFamily="'JetBrains Mono', monospace"
                  fill="#F4F1EA"
                  textAnchor="middle"
                >
                  {node.id}
                </text>
                <text
                  x={x}
                  y={y + 11}
                  fontSize="9"
                  fontFamily="'JetBrains Mono', monospace"
                  fill={isSuperseded ? '#FF331F' : '#D2FF28'}
                  textAnchor="middle"
                >
                  {isSuperseded ? '[SUPERSEDED]' : '[GOVERNING]'}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Nodes Quick Summary */}
      <div className="space-y-1.5 font-mono text-[11px]">
        {nodes.map((n) => (
          <div
            key={n.id}
            className="flex items-center justify-between p-2 border border-[#F4F1EA]/5 bg-black/40"
          >
            <div className="flex items-center gap-2">
              <span
                className={`w-1.5 h-1.5 ${n.is_superseded ? 'bg-[#FF331F]' : 'bg-[#D2FF28]'}`}
              />
              <span className="text-bone">{n.id}</span>
            </div>
            <span className={n.is_superseded ? 'text-[#FF331F]' : 'text-[#D2FF28]'}>
              {n.is_superseded ? 'SUPERSEDED' : 'TIER ' + n.tier}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
