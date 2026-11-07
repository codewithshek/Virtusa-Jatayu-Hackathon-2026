interface BrandMarkProps {
  className?: string
}

export function BrandMark({ className = 'brand-mark' }: BrandMarkProps) {
  return (
    <svg className={className} viewBox="0 0 27 30" fill="none" aria-hidden="true">
      <path
        d="M13.5 1.2 25.6 5.9v10.4c0 6.2-5.2 10.3-12.1 12.3C6.6 26.6 1.4 22.5 1.4 16.3V5.9L13.5 1.2Z"
        stroke="currentColor"
        strokeWidth="1"
      />
      <path
        d="M13.5 6.6 20.7 9.3v6.6c0 3.9-3.1 6.6-7.2 8-4.1-1.4-7.2-4.1-7.2-8V9.3l7.2-2.7Z"
        stroke="currentColor"
        strokeWidth="0.65"
        opacity="0.5"
      />
      <path d="M13.5 9.8v10.4M8.3 15h10.4" stroke="currentColor" strokeWidth="0.9" />
      <circle cx="13.5" cy="15" r="2.15" stroke="currentColor" strokeWidth="0.7" />
      <circle cx="13.5" cy="15" r="0.7" fill="currentColor" />
    </svg>
  )
}
