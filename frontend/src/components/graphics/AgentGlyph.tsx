type GlyphVariant = 'stack' | 'lens' | 'scales' | 'seal'

interface AgentGlyphProps {
  variant: GlyphVariant
  className?: string
}

export function AgentGlyph({ variant, className = 'agent-icon' }: AgentGlyphProps) {
  if (variant === 'stack') {
    return (
      <svg className={className} viewBox="0 0 54 54" fill="none" aria-hidden="true">
        <path d="M27 8 47 18 27 28 7 18 27 8Z" stroke="currentColor" strokeWidth="1.1" />
        <path d="M7 25.5 27 35.5 47 25.5" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />
        <path d="M7 33 27 43 47 33" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
        <path d="M27 13v10M21 18h12" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      </svg>
    )
  }

  if (variant === 'lens') {
    return (
      <svg className={className} viewBox="0 0 54 54" fill="none" aria-hidden="true">
        <circle cx="24" cy="23" r="14" stroke="currentColor" strokeWidth="1.1" />
        <circle cx="24" cy="23" r="8.5" stroke="currentColor" strokeWidth="0.8" opacity="0.55" strokeDasharray="1.5 4" />
        <path d="M34 33 45 44" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M24 17v12M18 23h12" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
        <circle cx="24" cy="23" r="1.6" fill="currentColor" />
      </svg>
    )
  }

  if (variant === 'scales') {
    return (
      <svg className={className} viewBox="0 0 54 54" fill="none" aria-hidden="true">
        <path d="M27 10v34M17 44h20" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M12 16h30" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
        <path d="M12 16 5 30h14L12 16ZM42 16l-7 14h14l-7-14Z" stroke="currentColor" strokeWidth="1" opacity="0.8" />
        <path d="M5 30c0 2.8 3.1 4.6 7 4.6s7-1.8 7-4.6M35 30c0 2.8 3.1 4.6 7 4.6s7-1.8 7-4.6" stroke="currentColor" strokeWidth="0.8" opacity="0.65" />
        <circle cx="27" cy="10" r="2" stroke="currentColor" strokeWidth="0.9" />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 54 54" fill="none" aria-hidden="true">
      <circle cx="27" cy="27" r="19" stroke="currentColor" strokeWidth="1.1" />
      <circle cx="27" cy="27" r="14.5" stroke="currentColor" strokeWidth="0.7" opacity="0.55" strokeDasharray="2 4" />
      <path d="M27 13 31.9 23.6 43 24.8 34.6 32.4 37 43 27 37.5 17 43 19.4 32.4 11 24.8 22.1 23.6 27 13Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="27" cy="27" r="3.4" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="27" cy="27" r="1.2" fill="currentColor" />
    </svg>
  )
}
