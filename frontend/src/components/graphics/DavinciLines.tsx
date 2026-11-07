import React from 'react'

interface DavinciLinesProps {
  className?: string
  density?: 'hero' | 'section'
}

const STARS = [
  [114, 148, 1.6],
  [208, 96, 1.1],
  [318, 214, 1.4],
  [276, 650, 1.2],
  [412, 736, 1.7],
  [102, 486, 1.2],
  [1266, 176, 1.3],
  [1338, 302, 1.6],
  [1184, 624, 1.1],
  [1288, 742, 1.4],
  [880, 108, 1.2],
  [978, 812, 1.3],
  [720, 82, 1.1],
  [648, 830, 1.5],
  [524, 132, 1.1],
  [1148, 432, 1.2],
  [302, 420, 1.1],
  [1038, 318, 1.2],
]

const CROSSES = [
  [156, 262],
  [1284, 236],
  [238, 706],
  [1196, 690],
  [722, 140],
  [722, 770],
]

export function DavinciLines({ className = '', density = 'hero' }: DavinciLinesProps) {
  const spokes = Array.from({ length: density === 'hero' ? 28 : 20 }, (_, i) => {
    const angle = (i / (density === 'hero' ? 28 : 20)) * Math.PI * 2
    const inner = 196
    const outer = i % 3 === 0 ? 660 : 610
    return {
      x1: 720 + Math.cos(angle) * inner,
      y1: 450 + Math.sin(angle) * inner,
      x2: 720 + Math.cos(angle) * outer,
      y2: 450 + Math.sin(angle) * outer,
      delay: 0.1 + (i % 7) * 0.09,
    }
  })

  const ticks = Array.from({ length: 72 }, (_, i) => {
    const angle = (i / 72) * Math.PI * 2
    const r1 = 452
    const r2 = i % 6 === 0 ? 470 : 461
    return {
      x1: 720 + Math.cos(angle) * r1,
      y1: 450 + Math.sin(angle) * r1,
      x2: 720 + Math.cos(angle) * r2,
      y2: 450 + Math.sin(angle) * r2,
    }
  })

  return (
    <svg
      className={`davinci ${className}`}
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <g className="faint">
        <path className="stroke" d="M0 118 H1440 M0 782 H1440 M118 0 V900 M1322 0 V900" opacity="0.35" />
        <path className="stroke" d="M0 90 H1440 M0 810 H1440" opacity="0.18" />
        <path className="stroke" d="M90 0 V900 M1350 0 V900" opacity="0.18" />
      </g>

      <g className="medium">
        <path className="stroke draw-path" pathLength={1} style={{ ['--delay' as string]: '0.2s' }} d="M46 46 H196 V96" />
        <path className="stroke draw-path" pathLength={1} style={{ ['--delay' as string]: '0.28s' }} d="M1394 46 H1244 V96" />
        <path className="stroke draw-path" pathLength={1} style={{ ['--delay' as string]: '0.36s' }} d="M46 854 H196 V804" />
        <path className="stroke draw-path" pathLength={1} style={{ ['--delay' as string]: '0.44s' }} d="M1394 854 H1244 V804" />
        <rect x="146" y="96" width="52" height="52" className="stroke faint" />
        <rect x="1242" y="96" width="52" height="52" className="stroke faint" />
        <rect x="1188" y="752" width="54" height="54" className="stroke faint" />
      </g>

      <g className="medium">
        <circle cx="720" cy="450" r="196" className="stroke draw-path" pathLength={1} style={{ ['--delay' as string]: '0.15s' }} />
        <circle cx="720" cy="450" r="268" className="stroke draw-path" pathLength={1} style={{ ['--delay' as string]: '0.22s' }} />
        <circle cx="720" cy="450" r="340" className="stroke draw-path" pathLength={1} style={{ ['--delay' as string]: '0.3s' }} />
        <circle cx="720" cy="450" r="420" className="stroke draw-path" pathLength={1} style={{ ['--delay' as string]: '0.38s' }} />
        <circle cx="720" cy="450" r="520" className="stroke draw-path dash" pathLength={1} style={{ ['--delay' as string]: '0.48s' }} />
        <circle cx="720" cy="450" r="640" className="stroke faint dash" />
      </g>

      <g className="faint">
        <ellipse cx="720" cy="450" rx="612" ry="246" className="stroke" transform="rotate(-14 720 450)" />
        <ellipse cx="720" cy="450" rx="612" ry="246" className="stroke" transform="rotate(42 720 450)" />
        <ellipse cx="720" cy="450" rx="612" ry="246" className="stroke" transform="rotate(96 720 450)" />
      </g>

      <g className="medium">
        {spokes.map((s, i) => (
          <line
            key={`s-${i}`}
            className="stroke draw-path"
            pathLength={1}
            style={{ ['--delay' as string]: `${s.delay}s` }}
            x1={s.x1}
            y1={s.y1}
            x2={s.x2}
            y2={s.y2}
            opacity={i % 4 === 0 ? 0.85 : 0.34}
          />
        ))}
      </g>

      <g className="faint">
        {ticks.map((t, i) => (
          <line key={`t-${i}`} className="stroke" x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} opacity={i % 6 === 0 ? 0.8 : 0.36} />
        ))}
      </g>

      <g className="medium">
        <circle cx="720" cy="450" r="570" className="stroke dash" />
        <circle className="dot" cx="1194" cy="216" r="3.2" />
        <circle className="dot" cx="252" cy="638" r="2.4" />
        <circle className="dot" cx="986" cy="786" r="2.8" />
        <circle cx="1194" cy="216" r="9" className="stroke" opacity="0.5" />
        <circle cx="252" cy="638" r="7" className="stroke" opacity="0.5" />
        <circle cx="986" cy="786" r="8" className="stroke" opacity="0.5" />
      </g>

      <g className="faint">
        <path className="stroke" d="M720 228 V672 M498 450 H942" />
        <path className="stroke dash" d="M565 295 L875 605 M875 295 L565 605" />
      </g>

      <g>
        {STARS.map(([x, y, r], i) => (
          <g key={`star-${i}`} className="faint">
            <circle className="dot" cx={x} cy={y} r={r} />
            <path className="stroke" d={`M${x - 7} ${y} H${x + 7} M${x} ${y - 7} V${y + 7}`} opacity="0.55" />
          </g>
        ))}
        {CROSSES.map(([x, y], i) => (
          <path key={`cross-${i}`} className="stroke medium" d={`M${x - 5} ${y} H${x + 5} M${x} ${y - 5} V${y + 5}`} />
        ))}
      </g>

      <g>
        <circle cx="990" cy="300" r="46" className="stroke" stroke="var(--violet-soft)" opacity="0.55" />
        <circle cx="990" cy="300" r="28" className="stroke" stroke="var(--violet-soft)" opacity="0.85" />
        <circle cx="990" cy="300" r="5" fill="var(--violet-soft)" />
      </g>

      {density === 'section' && (
        <g className="faint">
          <path className="stroke" d="M720 120 C 540 300, 540 600, 720 780 C 900 600, 900 300, 720 120 Z" opacity="0.5" />
        </g>
      )}
    </svg>
  )
}
