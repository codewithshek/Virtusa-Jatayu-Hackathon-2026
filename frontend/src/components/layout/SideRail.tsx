import { NAV_SECTIONS } from '../../data/edition'
import { scrollToId } from '../../lib/scroll'

interface SideRailProps {
  active: string
}

export function SideRail({ active }: SideRailProps) {
  return (
    <aside className="side-rail" aria-label="Section index">
      <span className="side-rail-label">Index</span>
      {NAV_SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={active === section.id ? 'is-active' : ''}
          title={section.label}
          aria-label={`${section.num} ${section.label}`}
          onClick={(event) => {
            event.preventDefault()
            scrollToId(section.id)
          }}
        >
          <span className="font-mono">{section.num}</span>
        </a>
      ))}
    </aside>
  )
}
