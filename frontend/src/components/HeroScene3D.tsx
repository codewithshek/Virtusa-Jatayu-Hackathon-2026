import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface SlabData {
  id: string
  tier: string
  tierNum: number
  clause: string
  status: string
  color: string
}

interface HeroScene3DProps {
  onHoverSlab?: (slab: SlabData | null) => void
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({ onHoverSlab }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. Scene, Camera & ACESFilmic Renderer
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x03060c, 0.045)

    const camera = new THREE.PerspectiveCamera(
      38,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0.4, 8.5)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.35
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    // 2. Procedural Studio Lighting (Key, Crimson Conflict Rim, Emerald Authority Fill)
    const ambient = new THREE.AmbientLight(0x0b1324, 2.2)
    scene.add(ambient)

    const keyLight = new THREE.DirectionalLight(0xe2e8f0, 3.2)
    keyLight.position.set(4, 6, 5)
    scene.add(keyLight)

    const emeraldRim = new THREE.PointLight(0x10b981, 8, 18)
    emeraldRim.position.set(3.5, 2.0, 2.5)
    scene.add(emeraldRim)

    const crimsonConflictLight = new THREE.PointLight(0xf43f5e, 0, 16)
    crimsonConflictLight.position.set(-3.5, -1.0, 2.5)
    scene.add(crimsonConflictLight)

    // 3. Central Optical Dispersion Prism (3-Sided Forensic Crystal)
    const stageGroup = new THREE.Group()
    scene.add(stageGroup)

    const prismGeo = new THREE.CylinderGeometry(1.15, 1.15, 2.6, 3, 1)
    const prismMat = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      transmission: 0.92,
      opacity: 1,
      transparent: true,
      metalness: 0.1,
      roughness: 0.08,
      ior: 1.62,
      thickness: 2.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      attenuationColor: new THREE.Color(0x10b981),
      attenuationDistance: 2.5,
    })
    const prismMesh = new THREE.Mesh(prismGeo, prismMat)
    prismMesh.rotation.z = Math.PI / 6
    stageGroup.add(prismMesh)

    // Sharp Precision Edge Wireframe on Prism
    const prismEdges = new THREE.LineSegments(
      new THREE.EdgesGeometry(prismGeo),
      new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.55 })
    )
    prismMesh.add(prismEdges)

    // 4. Custom GLSL Laser Scanner Plane (Dual-Clock uTime + uConflictMix)
    const scannerShaderMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uConflictMix: { value: 0 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uConflictMix;
        varying vec2 vUv;

        void main() {
          float distFromCenter = abs(vUv.y - 0.5) * 2.0;
          float coreBeam = exp(-distFromCenter * 14.0);
          float grid = step(0.92, fract(vUv.x * 28.0 + uTime * 0.4));
          vec3 emerald = vec3(0.063, 0.725, 0.506);
          vec3 crimson = vec3(0.957, 0.247, 0.369);
          vec3 beamColor = mix(emerald, crimson, uConflictMix * step(0.5, vUv.x));
          float alpha = (coreBeam * 0.75 + grid * coreBeam * 0.35) * (1.0 - smoothstep(0.35, 0.5, abs(vUv.x - 0.5)));
          gl_FragColor = vec4(beamColor, alpha);
        }
      `,
    })
    const scannerPlane = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 0.55), scannerShaderMat)
    scannerPlane.rotation.x = Math.PI / 2
    stageGroup.add(scannerPlane)

    // 5. Five Forensic Policy Monolith Slabs (Representing the 5 Authority Tiers)
    const slabConfigs: SlabData[] = [
      { id: 'REG-2025-09', tier: 'TIER 1 · REGULATORY MANDATE', tierNum: 1, clause: 'MFA: FIDO2 Hardware Key Required', status: 'GOVERNING', color: '#10b981' },
      { id: 'SEC-2025-11', tier: 'TIER 2 · SECURITY DIRECTIVE', tierNum: 2, clause: 'Zero-Trust Enclave Override', status: 'GOVERNING', color: '#06b6d4' },
      { id: 'HR-POL-2024 v2.1', tier: 'TIER 3 · FORMAL POLICY', tierNum: 3, clause: 'Remote Work: Max 1 Day/Week', status: 'CONFLICTING', color: '#f59e0b' },
      { id: 'ENG-MEMO-2025', tier: 'TIER 4 · DEPT MEMO', tierNum: 4, clause: 'Exception: Up to 4 Days/Week', status: 'SUPERSEDED', color: '#f43f5e' },
      { id: 'FAQ-2023-LEGACY', tier: 'TIER 5 · GENERAL FAQ', tierNum: 5, clause: 'SMS 2FA Permitted [REVOKED]', status: 'PRUNED', color: '#ef4444' },
    ]

    const createSlabTexture = (cfg: SlabData) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 640
      const ctx = canvas.getContext('2d')!
      
      // Dark slate background
      ctx.fillStyle = '#060a12'
      ctx.fillRect(0, 0, 1024, 640)

      // Outer border
      ctx.strokeStyle = cfg.color
      ctx.lineWidth = 6
      ctx.strokeRect(20, 20, 984, 600)

      // Header tier banner
      ctx.fillStyle = cfg.color
      ctx.font = 'bold 32px "JetBrains Mono", monospace'
      ctx.fillText(cfg.tier, 50, 85)

      // Document ID
      ctx.fillStyle = '#f8fafc'
      ctx.font = 'bold 52px "Plus Jakarta Sans", sans-serif'
      ctx.fillText(cfg.id, 50, 170)

      // Clause body
      ctx.fillStyle = '#cbd5e1'
      ctx.font = '36px "JetBrains Mono", monospace'
      ctx.fillText(cfg.clause, 50, 270)

      // Telemetry metadata box
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)'
      ctx.fillRect(50, 360, 924, 110)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)'
      ctx.lineWidth = 2
      ctx.strokeRect(50, 360, 924, 110)

      ctx.fillStyle = '#94a3b8'
      ctx.font = '24px "JetBrains Mono", monospace'
      ctx.fillText(`STATUS: ${cfg.status}  |  PRECEDENCE: TIER ${cfg.tierNum}`, 75, 410)
      ctx.fillText(`HASH: 0x9F4A8E2C...B71D  |  VERIFIED ENTAILMENT`, 75, 445)

      // Footer brand stamp
      ctx.fillStyle = cfg.color
      ctx.font = 'bold 22px "JetBrains Mono", monospace'
      ctx.fillText(`TRUTHGUARD FORENSIC AST SLAB // SPEC-2026`, 50, 560)

      const tex = new THREE.CanvasTexture(canvas)
      tex.anisotropy = 4
      return tex
    }

    const slabs: THREE.Mesh[] = []
    const slabBaseTransforms: { x: number; y: number; z: number; ry: number }[] = [
      { x: -2.5, y: 1.25, z: 0.6, ry: 0.32 },
      { x: 2.5, y: 1.15, z: 0.5, ry: -0.32 },
      { x: -2.7, y: -0.15, z: 0.9, ry: 0.28 },
      { x: 2.7, y: -0.25, z: 0.9, ry: -0.28 },
      { x: 0.0, y: -1.55, z: -0.8, ry: 0.0 },
    ]

    const slabGeo = new THREE.BoxGeometry(1.85, 1.12, 0.06)
    slabConfigs.forEach((cfg, idx) => {
      const tex = createSlabTexture(cfg)
      const mat = new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: 0.18,
        metalness: 0.35,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.95,
      })
      const mesh = new THREE.Mesh(slabGeo, mat)
      const base = slabBaseTransforms[idx]
      mesh.position.set(base.x, base.y, base.z)
      mesh.rotation.y = base.ry
      mesh.userData = { index: idx, base, cfg }
      stageGroup.add(mesh)
      slabs.push(mesh)
    })

    // 6. Raycaster for Interactive Hover Inspection on Slabs
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(999, 999)
    const mouseSmooth = { x: 0, y: 0, tx: 0, ty: 0 }

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseSmooth.tx = ((e.clientX - rect.left) / rect.width) * 2 - 1
      mouseSmooth.ty = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      pointer.set(mouseSmooth.tx, mouseSmooth.ty)
    }
    window.addEventListener('mousemove', onPointerMove)

    // 7. GSAP ScrollTrigger 4-Beat Choreography
    const scrollState = {
      beat: 0,
      conflictIntensity: 0,
      dagSpread: 0,
      burnProgress: 0,
      merkleLock: 0,
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.0,
        },
      })

      // Beat 1 -> Beat 2 (0% -> 35%): Deontic Contradiction Isolation
      tl.to(camera.position, { z: 6.8, y: 0.1, ease: 'power2.inOut' }, 0)
        .to(prismMesh.rotation, { y: Math.PI * 1.25, x: 0.25, ease: 'power2.inOut' }, 0)
        .to(scrollState, { conflictIntensity: 1, ease: 'power2.inOut' }, 0)
        .to(crimsonConflictLight, { intensity: 12, ease: 'power2.inOut' }, 0)

      // Beat 2 -> Beat 3 (35% -> 70%): Bi-Temporal DAG Formation & Silent Revocation Dissolve
      tl.to(scrollState, { dagSpread: 1, conflictIntensity: 0.2, burnProgress: 1, ease: 'power3.inOut' }, 0.4)
        .to(camera.position, { z: 7.8, y: -0.4, ease: 'power3.inOut' }, 0.4)
        .to(crimsonConflictLight, { intensity: 2, ease: 'power3.inOut' }, 0.4)
        .to(emeraldRim, { intensity: 14, ease: 'power3.inOut' }, 0.4)

      // Beat 3 -> Beat 4 (70% -> 100%): Merkle Seal & Live Workbench Dock
      tl.to(scrollState, { merkleLock: 1, ease: 'power2.inOut' }, 0.75)
        .to(stageGroup.position, { y: 0.6, z: -1.2, ease: 'power2.inOut' }, 0.75)
        .to(camera.position, { z: 8.8, y: 0.0, ease: 'power2.inOut' }, 0.75)
    })

    // 8. Dual-Clock Render Loop (uScroll + uTime + uMouse)
    const clock = new THREE.Clock()
    let rafId: number
    let currentHoveredSlab: SlabData | null = null

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      mouseSmooth.x += (mouseSmooth.tx - mouseSmooth.x) * 0.06
      mouseSmooth.y += (mouseSmooth.ty - mouseSmooth.y) * 0.06

      // Update Laser Scanner Plane
      scannerShaderMat.uniforms.uTime.value = t
      scannerShaderMat.uniforms.uConflictMix.value = scrollState.conflictIntensity
      scannerPlane.position.y = Math.sin(t * 1.4) * 1.35

      // Stage tilt with pointer
      stageGroup.rotation.y = mouseSmooth.x * 0.28
      stageGroup.rotation.x = -mouseSmooth.y * 0.16
      prismMesh.rotation.y += 0.003

      // Raycast hover detection on individual policy slabs
      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(slabs)
      const hoveredMesh = hits.length > 0 ? hits[0].object : null

      const newlyHoveredSlab = hoveredMesh ? (hoveredMesh.userData.cfg as SlabData) : null
      if (newlyHoveredSlab?.id !== currentHoveredSlab?.id) {
        currentHoveredSlab = newlyHoveredSlab
        if (onHoverSlab) {
          onHoverSlab(newlyHoveredSlab)
        }
      }

      slabs.forEach((slab, idx) => {
        const { base } = slab.userData
        const floatY = Math.sin(t * 1.6 + idx * 1.3) * 0.08
        const isHovered = hoveredMesh === slab

        // Scroll-driven conflict pull for slabs 2 (HR-POL) and 3 (ENG-MEMO)
        let conflictOffsetX = 0
        let conflictOffsetZ = 0
        if (idx === 2) {
          conflictOffsetX = scrollState.conflictIntensity * 1.3
          conflictOffsetZ = scrollState.conflictIntensity * 1.0
        } else if (idx === 3) {
          conflictOffsetX = -scrollState.conflictIntensity * 1.3
          conflictOffsetZ = scrollState.conflictIntensity * 1.0
        }

        // DAG spread positioning in Beat 3
        let dagOffsetX = 0
        let dagOffsetY = 0
        if (scrollState.dagSpread > 0) {
          dagOffsetX = (idx - 2) * 0.65 * scrollState.dagSpread
          dagOffsetY = (2 - idx) * 0.5 * scrollState.dagSpread
        }

        // Beat 3: Burn & dissolve superseded Slab #4 (FAQ-2023-LEGACY)
        if (idx === 4) {
          const mat = slab.material as THREE.MeshPhysicalMaterial
          mat.opacity = Math.max(0.12, 0.95 - scrollState.burnProgress * 0.85)
          slab.scale.setScalar(Math.max(0.7, 1.0 - scrollState.burnProgress * 0.25))
        }

        // Beat 4: Compress into Merkle lock
        let merkleOffsetX = 0
        let merkleOffsetZ = 0
        if (scrollState.merkleLock > 0) {
          merkleOffsetX = -base.x * scrollState.merkleLock * 0.7
          merkleOffsetZ = -base.z * scrollState.merkleLock * 0.7
        }

        const targetScale = isHovered ? 1.12 : 1.0
        slab.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)
        slab.position.x = base.x + conflictOffsetX + dagOffsetX + merkleOffsetX
        slab.position.y = base.y + floatY + dagOffsetY
        slab.position.z = base.z + conflictOffsetZ + merkleOffsetZ + (isHovered ? 0.35 : 0)
      })

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container) return
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafId)
      ctx.revert()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [onHoverSlab])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    />
  )
}
