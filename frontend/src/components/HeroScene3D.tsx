import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

export const HeroScene3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Scene & Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 7)

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a1020, 2.5)
    scene.add(ambientLight)

    const emeraldLight = new THREE.PointLight(0x10b981, 5, 20)
    emeraldLight.position.set(3, 4, 3)
    scene.add(emeraldLight)

    const cyanLight = new THREE.PointLight(0x06b6d4, 4, 20)
    cyanLight.position.set(-4, -2, 2)
    scene.add(cyanLight)

    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2)
    rimLight.position.set(0, 5, -5)
    scene.add(rimLight)

    // Core Geometry: Truth Prism Group
    const coreGroup = new THREE.Group()
    scene.add(coreGroup)

    // Inner Faceted Core: Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(1.6, 0)
    const coreMat = new THREE.MeshPhysicalMaterial({
      color: 0x091428,
      metalness: 0.85,
      roughness: 0.15,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
      flatShading: true
    })
    const coreMesh = new THREE.Mesh(coreGeo, coreMat)
    coreGroup.add(coreMesh)

    // Outer Lattice Cage: Wireframe Dodecahedron
    const cageGeo = new THREE.DodecahedronGeometry(2.3, 1)
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.28
    })
    const cageMesh = new THREE.Mesh(cageGeo, cageMat)
    coreGroup.add(cageMesh)

    // Outer Glow Ring: Torus
    const ringGeo = new THREE.TorusGeometry(3.0, 0.02, 16, 100)
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      transparent: true,
      opacity: 0.4
    })
    const ringMesh = new THREE.Mesh(ringGeo, ringMat)
    ringMesh.rotation.x = Math.PI / 3
    coreGroup.add(ringMesh)

    // Second Inclined Ring
    const ringGeo2 = new THREE.TorusGeometry(3.4, 0.015, 16, 100)
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0x34d399,
      transparent: true,
      opacity: 0.25
    })
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2)
    ringMesh2.rotation.x = -Math.PI / 4
    ringMesh2.rotation.y = Math.PI / 6
    coreGroup.add(ringMesh2)

    // Data Particle Field (1,200 points)
    const particleCount = 1200
    const particleGeo = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    const colorA = new THREE.Color(0x10b981)
    const colorB = new THREE.Color(0x06b6d4)
    const colorC = new THREE.Color(0x38bdf8)

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3
      const radius = 3.5 + Math.random() * 8.0
      const theta = Math.random() * Math.PI * 2
      const phi = (Math.random() - 0.5) * Math.PI

      positions[idx] = radius * Math.cos(phi) * Math.cos(theta)
      positions[idx + 1] = radius * Math.sin(phi)
      positions[idx + 2] = radius * Math.cos(phi) * Math.sin(theta)

      const mixedColor = Math.random() > 0.5 ? colorA.clone().lerp(colorB, Math.random()) : colorC
      colors[idx] = mixedColor.r
      colors[idx + 1] = mixedColor.g
      colors[idx + 2] = mixedColor.b
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    })

    const particleSystem = new THREE.Points(particleGeo, particleMat)
    scene.add(particleSystem)

    // Interaction & Damping
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouse.targetY = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Resize Handler
    const handleResize = () => {
      if (!container) return
      const width = container.clientWidth
      const height = container.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // Scroll Reaction
    let scrollY = window.scrollY
    const handleScroll = () => {
      scrollY = window.scrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth mouse lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05

      // Core rotation with subtle wobble
      coreGroup.rotation.y = elapsedTime * 0.15 + mouse.x * 0.4
      coreGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1 + mouse.y * 0.3
      cageMesh.rotation.y = -elapsedTime * 0.2
      cageMesh.rotation.z = elapsedTime * 0.1
      ringMesh.rotation.z = elapsedTime * 0.25
      ringMesh2.rotation.z = -elapsedTime * 0.2

      // Scroll effect: elevate & expand slightly
      const scrollFactor = Math.min(scrollY / 1000, 1.5)
      coreGroup.position.y = -scrollFactor * 0.8
      coreGroup.scale.setScalar(1 + scrollFactor * 0.15)

      // Slow particle drift
      particleSystem.rotation.y = elapsedTime * 0.03
      particleSystem.rotation.x = Math.cos(elapsedTime * 0.02) * 0.05

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      cancelAnimationFrame(animId)

      coreGeo.dispose()
      coreMat.dispose()
      cageGeo.dispose()
      cageMat.dispose()
      ringGeo.dispose()
      ringMat.dispose()
      ringGeo2.dispose()
      ringMat2.dispose()
      particleGeo.dispose()
      particleMat.dispose()
      renderer.dispose()

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    />
  )
}

