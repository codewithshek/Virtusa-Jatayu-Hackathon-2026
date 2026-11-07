interface EmptyOrbitProps {
  className?: string
}

export function EmptyOrbit({ className = 'empty-art' }: EmptyOrbitProps) {
  return (
    <svg className={className} viewBox="0 0 240 180" fill="none" aria-hidden="true">
      <g className="orbit-slow">
        <circle cx="120" cy="90" r="62" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 6" />
        <circle cx="120" cy="28" r="2.4" fill="#7126ff" />
      </g>
      <g className="orbit-slow-reverse">
        <circle cx="120" cy="90" r="44" stroke="currentColor" strokeWidth="0.6" />
        <circle cx="120" cy="46" r="1.8" fill="currentColor" />
      </g>
      <circle cx="120" cy="90" r="26" stroke="currentColor" strokeWidth="0.8" />
      <path d="M120 70v40M100 90h40" stroke="currentColor" strokeWidth="0.7" opacity="0.55" />
      <circle cx="120" cy="90" r="4" stroke="currentColor" strokeWidth="0.8" />
      <circle cx="120" cy="90" r="1.4" fill="#7126ff" />

      <g opacity="0.4">
        <path d="M20 24h20M20 24v20M220 156h-20M220 156v-20" stroke="currentColor" strokeWidth="0.8" />
        <path d="M220 24h-20M220 24v20M20 156h20M20 156v-20" stroke="currentColor" strokeWidth="0.8" />
      </g>
    </svg>
  )
}
