import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export const ForensicCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null)
  const coordsRef = useRef<HTMLSpanElement>(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isPointerDevice, setIsPointerDevice] = useState(true)

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia('(pointer: coarse)').matches) {
      setIsPointerDevice(false)
      return
    }

    const cursor = cursorRef.current
    if (!cursor) return

    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.15, ease: 'power3' })
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.15, ease: 'power3' })

    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)

      // Calculate normalized device coordinates [-1.0, 1.0]
      const ndcX = ((e.clientX / window.innerWidth) * 2 - 1).toFixed(2)
      const ndcY = (-((e.clientY / window.innerHeight) * 2 - 1)).toFixed(2)
      setCoords({ x: Number(ndcX), y: Number(ndcY) })
    }

    window.addEventListener('mousemove', onMouseMove)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])

  if (!isPointerDevice) return null

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      className="fixed top-0 left-0 pointer-events-none z-[99] transform -translate-x-1/2 -translate-y-1/2 select-none flex items-center gap-2"
      style={{ willChange: 'transform' }}
    >
      {/* Precision Tactical Crosshair */}
      <div className="relative w-5 h-5 flex items-center justify-center">
        <div className="absolute w-2.5 h-[1px] bg-[#D2FF28]" />
        <div className="absolute h-2.5 w-[1px] bg-[#D2FF28]" />
        <div className="w-1 h-1 rounded-full bg-[#D2FF28]" />
      </div>

      {/* Coordinate Telemetry Tag */}
      <span
        ref={coordsRef}
        className="font-mono text-[9px] tracking-widest text-[#D2FF28]/80 bg-[#060608]/85 border border-[#F4F1EA]/15 px-1.5 py-0.5 whitespace-nowrap shadow-lg tabular-nums"
      >
        {coords.x >= 0 ? `+${coords.x}` : coords.x} // {coords.y >= 0 ? `+${coords.y}` : coords.y}
      </span>
    </div>
  )
}

