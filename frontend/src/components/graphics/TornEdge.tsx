interface TornEdgeProps {
  from: string
  className?: string
}

const EDGE = [3, 10, 6, 15, 8, 4, 13, 7, 17, 5, 11, 3, 14, 9, 6, 16, 8, 12, 4, 15, 10, 5, 13, 7, 11, 3, 16, 9, 14, 6, 12, 8, 17, 5, 10, 4]
const WIDTH = 1440
const HEIGHT = 60

export function TornEdge({ from, className = '' }: TornEdgeProps) {
  const step = WIDTH / (EDGE.length - 1)

  const points = EDGE.map((height, index) => [index * step, height] as const)
  const line = points.map(([x, y]) => `${x.toFixed(1)} ${y}`).join(' L ')
  const fill = `M0 0 H${WIDTH} V ${EDGE[EDGE.length - 1]} L ${points
    .slice(0, -1)
    .reverse()
    .map(([x, y]) => `${x.toFixed(1)} ${y}`)
    .join(' L ')} Z`

  return (
    <div className={`torn-edge ${className}`.trim()} aria-hidden="true">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} preserveAspectRatio="none" fill="none">
        <path d={fill} fill={from} />
        <path d={`M ${line}`} stroke="rgba(0,0,0,0.14)" strokeWidth="0.7" />
      </svg>
    </div>
  )
}
