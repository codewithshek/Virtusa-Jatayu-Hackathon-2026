import type { CSSProperties, ReactNode } from 'react'
import { useInView } from '../../hooks/useInView'

type Variant = 'up' | 'left' | 'scale' | 'clip'

const VARIANT_CLASS: Record<Variant, string> = {
  up: 'reveal',
  left: 'reveal-left',
  scale: 'reveal-scale',
  clip: 'clip-reveal',
}

interface RevealProps {
  children: ReactNode
  className?: string
  variant?: Variant
  delay?: number
  threshold?: number
  key?: string | number
}

export function Reveal({ children, className = '', variant = 'up', delay = 0, threshold }: RevealProps) {
  const { ref, inView } = useInView<HTMLDivElement>(threshold ? { threshold } : {})

  return (
    <div
      ref={ref}
      className={`${VARIANT_CLASS[variant]} ${inView ? 'is-inview' : ''} ${className}`.trim()}
      style={{ ['--delay' as string]: `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  )
}

interface MaskLineProps {
  children: ReactNode
  className?: string
  delay?: number
}

export function MaskLine({ children, className = '', delay = 0 }: MaskLineProps) {
  const { ref, inView } = useInView<HTMLSpanElement>()

  return (
    <span
      ref={ref}
      className={`mask-line ${inView ? 'is-inview' : ''} ${className}`.trim()}
      style={{ ['--delay' as string]: `${delay}s` } as CSSProperties}
    >
      <span>{children}</span>
    </span>
  )
}
