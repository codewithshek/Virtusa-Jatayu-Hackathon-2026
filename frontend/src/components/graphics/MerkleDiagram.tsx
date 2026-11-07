interface MerkleDiagramProps {
  root?: string
  leafCount?: number
  className?: string
}

const LEAVES = [
  { id: 'CLM-001', x: 62, hash: 'a91c…' },
  { id: 'CLM-002', x: 178, hash: '4e7b…' },
  { id: 'CLM-003', x: 294, hash: 'c02d…' },
  { id: 'CLM-004', x: 410, hash: '71fa…' },
]

export function MerkleDiagram({ root, leafCount = 4, className = '' }: MerkleDiagramProps) {
  const label = (root ?? 'sha256:9f4a21b8c520938b81d64c01d4a89c8901fbca12').replace(/^0x/, '')
  const short = label.length > 30 ? `${label.slice(0, 14)}…${label.slice(-10)}` : label

  return (
    <svg
      className={className}
      viewBox="0 0 500 288"
      fill="none"
      role="img"
      aria-label={`Merkle provenance tree with ${leafCount} claim leaves`}
    >
      <g stroke="rgba(247,247,238,0.16)" strokeWidth="0.7">
        <path d="M250 74 V104 M250 104 H120 V142 M250 104 H380 V142" />
        <path d="M120 176 V206 H62 V236 M120 206 H178 V236" />
        <path d="M380 176 V206 H294 V236 M380 206 H410 V236" />
      </g>

      <g>
        <rect x="176" y="34" width="148" height="40" rx="5" fill="rgba(128,81,255,0.14)" stroke="rgba(128,81,255,0.8)" />
        <text x="250" y="49" textAnchor="middle" fill="rgba(247,247,238,0.52)" fontFamily="JetBrains Mono, monospace" fontSize="6.4" letterSpacing="0.12em">
          MERKLE ROOT
        </text>
        <text x="250" y="63" textAnchor="middle" fill="#f7f7ee" fontFamily="JetBrains Mono, monospace" fontSize="8">
          {short}
        </text>
      </g>

      <g>
        <rect x="72" y="142" width="96" height="34" rx="4" fill="rgba(247,247,238,0.04)" stroke="rgba(247,247,238,0.28)" />
        <text x="120" y="156" textAnchor="middle" fill="rgba(247,247,238,0.5)" fontFamily="JetBrains Mono, monospace" fontSize="6">
          H(01 · 02)
        </text>
        <text x="120" y="168" textAnchor="middle" fill="rgba(247,247,238,0.75)" fontFamily="JetBrains Mono, monospace" fontSize="6.4">
          9b3e…f210
        </text>
      </g>

      <g>
        <rect x="332" y="142" width="96" height="34" rx="4" fill="rgba(247,247,238,0.04)" stroke="rgba(247,247,238,0.28)" />
        <text x="380" y="156" textAnchor="middle" fill="rgba(247,247,238,0.5)" fontFamily="JetBrains Mono, monospace" fontSize="6">
          H(03 · 04)
        </text>
        <text x="380" y="168" textAnchor="middle" fill="rgba(247,247,238,0.75)" fontFamily="JetBrains Mono, monospace" fontSize="6.4">
          2c81…0da4
        </text>
      </g>

      {LEAVES.map((leaf, index) => (
        <g key={leaf.id} className={index >= leafCount ? 'opacity-30' : ''}>
          <rect x={leaf.x} y="236" width="88" height="34" rx="4" fill="rgba(247,247,238,0.03)" stroke="rgba(247,247,238,0.22)" strokeDasharray={index >= leafCount ? '3 3' : undefined} />
          <circle cx={leaf.x + 9} cy="246" r="2" fill={index === 0 ? '#8051ff' : 'rgba(247,247,238,0.4)'} />
          <text x={leaf.x + 17} y="248" fill="rgba(247,247,238,0.72)" fontFamily="JetBrains Mono, monospace" fontSize="6.2">
            {leaf.id}
          </text>
          <text x={leaf.x + 9} y="262" fill="rgba(247,247,238,0.4)" fontFamily="JetBrains Mono, monospace" fontSize="5.8">
            {leaf.hash}
          </text>
        </g>
      ))}

      <g>
        <text x="250" y="18" textAnchor="middle" fill="rgba(247,247,238,0.4)" fontFamily="JetBrains Mono, monospace" fontSize="6" letterSpacing="0.18em">
          SHA-256 · {leafCount} LEAVES
        </text>
      </g>
    </svg>
  )
}
