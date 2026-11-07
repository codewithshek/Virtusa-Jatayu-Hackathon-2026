import { useMemo } from 'react'
import type { DagData, DocumentNode } from '../../types'

interface AuthorityDagProps {
  dag: DagData | null
  className?: string
}

const TIER_NAMES: Record<number, string> = {
  5: 'REGULATORY MANDATE',
  4: 'AMENDMENT',
  3: 'POLICY',
  2: 'MEMO',
  1: 'FAQ',
}

const TIER_COLORS: Record<number, string> = {
  5: '#8051ff',
  4: '#a98cff',
  3: '#dcdcd0',
  2: '#a9a99e',
  1: '#77776d',
}

const WIDTH = 860
const PAD = 58
const NODE_W = 138
const NODE_H = 46
const ROW_GAP = 82

function shortLabel(node: DocumentNode) {
  const [first, second] = String(node.label ?? '').split('\n')
  const name = second || first || node.id
  return name.length > 21 ? `${name.slice(0, 20)}…` : name
}

export function AuthorityDag({ dag, className = '' }: AuthorityDagProps) {
  const layout = useMemo(() => {
    if (!dag || !dag.nodes.length) return null

    const rows = Array.from(new Set(dag.nodes.map((n) => n.tier))).sort((a, b) => b - a)
    const height = 52 + (rows.length - 1) * ROW_GAP + NODE_H + 28
    const positions = new Map<string, { x: number; y: number; node: DocumentNode }>()

    rows.forEach((tier, rowIndex) => {
      const group = dag.nodes
        .filter((n) => n.tier === tier)
        .sort((a, b) => String(a.date).localeCompare(String(b.date)))

      group.forEach((node, index) => {
        const span = WIDTH - PAD * 2 - NODE_W
        const x =
          group.length === 1
            ? WIDTH / 2
            : PAD + NODE_W / 2 + (index * span) / (group.length - 1)
        positions.set(node.id, { x, y: 42 + rowIndex * ROW_GAP + NODE_H / 2, node })
      })
    })

    const edges = dag.edges
      .map((edge) => {
        const source = positions.get(edge.source)
        const target = positions.get(edge.target)
        if (!source || !target) return null

        const sx = source.x
        const sy = source.y + NODE_H / 2
        const tx = target.x
        const ty = target.y - NODE_H / 2

        if (Math.abs(sy - ty) < 6) {
          const lift = 34
          return {
            id: `${edge.source}-${edge.target}`,
            type: edge.type,
            d: `M ${sx} ${sy} C ${sx} ${sy + lift}, ${tx} ${ty + lift}, ${tx} ${ty}`,
          }
        }

        const mid = (sy + ty) / 2
        return {
          id: `${edge.source}-${edge.target}`,
          type: edge.type,
          d: `M ${sx} ${sy} C ${sx} ${mid}, ${tx} ${mid}, ${tx} ${ty}`,
        }
      })
      .filter(Boolean) as { id: string; type: string; d: string }[]

    return { rows, height, positions: Array.from(positions.values()), edges }
  }, [dag])

  if (!layout) {
    return (
      <div className={`dag-wrap ${className}`.trim()}>
        <div className="p-6 font-mono text-[0.62rem] text-[#909083]">
          Authority graph will populate from /api/corpus.
        </div>
      </div>
    )
  }

  return (
    <div className={`dag-wrap ${className}`.trim()}>
      <svg
        className="dag-svg"
        viewBox={`0 0 ${WIDTH} ${layout.height}`}
        role="img"
        aria-label="Document authority graph showing supersession relationships"
      >
        <defs>
          <marker id="dag-arrow" viewBox="0 0 8 8" refX="6.4" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 8 4 0 8Z" fill="rgba(247,247,238,0.45)" />
          </marker>
          <marker id="dag-arrow-violet" viewBox="0 0 8 8" refX="6.4" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M0 0 8 4 0 8Z" fill="rgba(128,81,255,0.9)" />
          </marker>
        </defs>

        <g>
          {layout.rows.map((tier, rowIndex) => (
            <g key={`row-${tier}`}>
              <text
                x="10"
                y={42 + rowIndex * ROW_GAP + NODE_H / 2 + 3}
                fill="rgba(247,247,238,0.34)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="7"
                letterSpacing="0.08em"
              >
                {String(tier).padStart(2, '0')}
              </text>
              <text
                x="10"
                y={42 + rowIndex * ROW_GAP + NODE_H / 2 + 13}
                fill="rgba(247,247,238,0.24)"
                fontFamily="JetBrains Mono, monospace"
                fontSize="5.6"
                letterSpacing="0.04em"
              >
                {TIER_NAMES[tier] ?? ''}
              </text>
            </g>
          ))}
        </g>

        <g>
          {layout.edges.map((edge) => {
            const isRevocation = edge.type.toLowerCase().includes('revoke')
            return (
              <path
                key={edge.id}
                d={edge.d}
                fill="none"
                stroke={isRevocation ? 'rgba(128,81,255,0.7)' : 'rgba(247,247,238,0.26)'}
                strokeWidth="0.9"
                strokeDasharray={isRevocation ? '3 3' : undefined}
                markerEnd={isRevocation ? 'url(#dag-arrow-violet)' : 'url(#dag-arrow)'}
              />
            )
          })}
        </g>

        <g>
          {layout.positions.map(({ x, y, node }) => {
            const color = TIER_COLORS[node.tier] ?? '#909083'
            const top = y - NODE_H / 2
            return (
              <g key={node.id} className="dag-node">
                <rect
                  x={x - NODE_W / 2}
                  y={top}
                  width={NODE_W}
                  height={NODE_H}
                  rx="5"
                  fill={node.is_superseded ? 'rgba(247,247,238,0.015)' : 'rgba(247,247,238,0.045)'}
                  stroke={node.is_superseded ? 'rgba(247,247,238,0.22)' : color}
                  strokeOpacity={node.is_superseded ? 1 : 0.7}
                  strokeDasharray={node.is_superseded ? '3 3' : undefined}
                />
                <text
                  x={x - NODE_W / 2 + 9}
                  y={top + 15}
                  fill={node.is_superseded ? 'rgba(247,247,238,0.45)' : 'rgba(247,247,238,0.9)'}
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="7.2"
                  letterSpacing="0.04em"
                >
                  {node.id.length > 17 ? `${node.id.slice(0, 16)}…` : node.id}
                </text>
                <text
                  x={x - NODE_W / 2 + 9}
                  y={top + 27}
                  fill="rgba(247,247,238,0.5)"
                  fontFamily="Inter Tight, sans-serif"
                  fontSize="7.4"
                  textDecoration={node.is_superseded ? 'line-through' : undefined}
                >
                  {shortLabel(node)}
                </text>
                <text
                  x={x - NODE_W / 2 + 9}
                  y={top + 38}
                  fill="rgba(247,247,238,0.34)"
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="5.8"
                >
                  {node.date} · {node.scope}
                </text>
                {node.is_superseded && (
                  <circle cx={x + NODE_W / 2 - 9} cy={top + 10} r="2" fill="rgba(128,81,255,0.8)" />
                )}
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
