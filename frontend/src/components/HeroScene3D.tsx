import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
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
  conflictState?: number // 0.0 to 1.0 external conflict override if provided
}

// Custom Cinema Lens Post-Processing Shader (Radial Chromatic Dispersion + Tactile 35mm Film Grain + Vignette)
const CinemaLensShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberration: { value: 0.0022 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAberration;
    varying vec2 vUv;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
    }

    void main() {
      vec2 dist = vUv - 0.5;
      vec2 offset = dist * uAberration * (1.0 + dot(dist, dist) * 2.5);
      float r = texture2D(tDiffuse, vUv + offset).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - offset).b;
      vec3 col = vec3(r, g, b);

      // 35mm tactile film grain
      float grain = (hash(vUv * 800.0 + uTime) - 0.5) * 0.032;
      col += grain;

      // Optical vignette
      float vig = smoothstep(0.95, 0.25, length(dist));
      col *= mix(0.55, 1.0, vig);

      gl_FragColor = vec4(col, 1.0);
    }
  `,
}

export const HeroScene3D: React.FC<HeroScene3DProps> = ({ onHoverSlab, conflictState: externalConflict }) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // 1. WebGL Renderer with High-Performance Settings & ACES Filmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      powerPreference: 'high-performance',
      alpha: false,
    })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.outputColorSpace = THREE.SRGBColorSpace
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x060608)
    scene.fog = new THREE.FogExp2(0x060608, 0.055)

    // Studio HDRI Lighting via PMREMGenerator + RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer)
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture

    const camera = new THREE.PerspectiveCamera(
      35,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    )
    camera.position.set(0.0, 0.0, 8.4)

    // 2. Post-Processing Pipeline
    const composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))

    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(container.clientWidth, container.clientHeight),
      0.40, // Calibrated bloom strength
      0.32, // Tight optical radius
      0.82  // Elevated specular threshold
    )
    composer.addPass(bloomPass)

    const lensPass = new ShaderPass(CinemaLensShader)
    composer.addPass(lensPass)

    // 3. Studio Lighting
    const keyLight = new THREE.DirectionalLight(0xf4f1ea, 2.0)
    keyLight.position.set(5, 7, 4)
    scene.add(keyLight)

    const signalLight = new THREE.PointLight(0xd2ff28, 2.2, 14)
    signalLight.position.set(2.5, 2.0, 3.0)
    scene.add(signalLight)

    const conflictLight = new THREE.PointLight(0xff331f, 0, 14)
    conflictLight.position.set(-2.5, -1.5, 3.0)
    scene.add(conflictLight)

    // 4. Central Rig: The "Epistemic Horological Spectrograph"
    const rig = new THREE.Group()
    rig.position.set(2.7, 0.0, 0)
    scene.add(rig)

    // 4A. Living Energy Nucleus (Domain-Warped fBm Shader)
    const nucleusMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uConflict: { value: 0 },
      },
      vertexShader: `
        uniform float uTime;
        uniform float uConflict;
        varying vec3 vNormal;
        varying float vDisplacement;
        void main() {
          vNormal = normal;
          float d = sin(position.x * 4.0 + uTime * 2.2) * cos(position.y * 4.0 - uTime * 1.8) * 0.12;
          d += sin(position.z * 8.0 + uTime * 4.0) * (0.04 + uConflict * 0.08);
          vDisplacement = d;
          vec3 newPos = position + normal * d;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uConflict;
        varying vec3 vNormal;
        varying float vDisplacement;
        void main() {
          float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
          vec3 lime = vec3(0.824, 1.0, 0.157);       // #D2FF28 Signal Lime
          vec3 vermilion = vec3(1.0, 0.20, 0.12);     // #FF331F Signal Vermilion
          vec3 base = vec3(0.024, 0.024, 0.031);
          vec3 glow = mix(lime, vermilion, uConflict);
          vec3 col = mix(base, glow, fresnel * 0.85 + smoothstep(0.02, 0.14, vDisplacement) * 0.65);
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    })
    const nucleusMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(0.78, 24), nucleusMat)
    rig.add(nucleusMesh)

    // 4B. Faceted Refractive Crystal Housing (Real Transmission Glass)
    const crystalGeo = new THREE.OctahedronGeometry(1.38, 2)
    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.96,
      opacity: 1,
      transparent: true,
      roughness: 0.06,
      metalness: 0.0,
      ior: 1.68,
      thickness: 2.8,
      specularIntensity: 1.0,
      attenuationColor: new THREE.Color(0xd4d4d8),
      attenuationDistance: 3.0,
      flatShading: true,
    })
    const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat)
    rig.add(crystalMesh)

    // 4C. Three Machined Titanium Gimbal Rings + 120 Instanced Vernier Ticks
    const titaniumMat = new THREE.MeshStandardMaterial({
      color: 0x141418,
      metalness: 0.92,
      roughness: 0.22,
    })
    const gimbal1 = new THREE.Mesh(new THREE.TorusGeometry(1.85, 0.028, 24, 128), titaniumMat)
    const gimbal2 = new THREE.Mesh(new THREE.TorusGeometry(2.25, 0.018, 24, 128), titaniumMat)
    gimbal2.rotation.x = Math.PI / 2.6
    const gimbal3 = new THREE.Mesh(new THREE.TorusGeometry(2.65, 0.012, 16, 128), titaniumMat)
    gimbal3.rotation.y = Math.PI / 3
    rig.add(gimbal1, gimbal2, gimbal3)

    // 120 Instanced Vernier Scale Ticks
    const tickCount = 120
    const tickGeo = new THREE.BoxGeometry(0.012, 0.09, 0.012)
    const tickMat = new THREE.MeshBasicMaterial({ color: 0xf4f1ea, transparent: true, opacity: 0.55 })
    const tickInstanced = new THREE.InstancedMesh(tickGeo, tickMat, tickCount)
    const dummy = new THREE.Object3D()
    for (let i = 0; i < tickCount; i++) {
      const angle = (i / tickCount) * Math.PI * 2
      const r = 2.25
      dummy.position.set(Math.cos(angle) * r, Math.sin(angle) * r, 0)
      dummy.rotation.z = angle + Math.PI / 2
      dummy.scale.y = i % 10 === 0 ? 2.2 : 1.0
      dummy.updateMatrix()
      tickInstanced.setMatrixAt(i, dummy.matrix)
    }
    gimbal2.add(tickInstanced)

    // 5. Five Architectural Optical Evidence Blades
    const slabConfigs: SlabData[] = [
      { id: 'REG-2025-09', tier: 'TIER 01 // MANDATE', tierNum: 1, clause: 'FIDO2 HARDWARE TOKEN ENFORCED', status: 'GOVERNING', color: '#D2FF28' },
      { id: 'SEC-2025-11', tier: 'TIER 02 // DIRECTIVE', tierNum: 2, clause: 'ZERO-TRUST ENCLAVE OVERRIDE', status: 'ACTIVE', color: '#F4F1EA' },
      { id: 'HR-POL-2024', tier: 'TIER 03 // POLICY', tierNum: 3, clause: 'REMOTE WORK: MAX 1 DAY/WK', status: 'CONFLICTING', color: '#FF331F' },
      { id: 'ENG-MEMO-25', tier: 'TIER 04 // ADDENDUM', tierNum: 4, clause: 'EXCEPTION: UP TO 4 DAYS/WK', status: 'SUPERSEDED', color: '#FF331F' },
      { id: 'FAQ-2023-OLD', tier: 'TIER 05 // LEGACY FAQ', tierNum: 5, clause: 'SMS 2FA PERMITTED [REVOKED]', status: 'PRUNED', color: '#52525B' },
    ]

    const createSwissBladeTexture = (cfg: SlabData) => {
      const canvas = document.createElement('canvas')
      canvas.width = 1024
      canvas.height = 512
      const ctx = canvas.getContext('2d')!
      ctx.fillStyle = '#060608'
      ctx.fillRect(0, 0, 1024, 512)

      // Hairline architectural border
      ctx.strokeStyle = 'rgba(244, 241, 234, 0.22)'
      ctx.lineWidth = 2
      ctx.strokeRect(24, 24, 976, 464)

      // Left vertical signal bar
      ctx.fillStyle = cfg.color
      ctx.fillRect(24, 24, 10, 464)

      // Tier coordinate
      ctx.fillStyle = cfg.color
      ctx.font = '600 24px "JetBrains Mono", monospace'
      ctx.fillText(cfg.tier, 64, 82)

      // Document ID
      ctx.fillStyle = '#F4F1EA'
      ctx.font = '700 58px "Syne", sans-serif'
      ctx.fillText(cfg.id, 64, 168)

      // Clause text
      ctx.fillStyle = '#8E8E96'
      ctx.font = '400 26px "JetBrains Mono", monospace'
      ctx.fillText(cfg.clause, 64, 248)

      // Bottom technical dividing line
      ctx.strokeStyle = 'rgba(244, 241, 234, 0.12)'
      ctx.beginPath()
      ctx.moveTo(24, 380)
      ctx.lineTo(1000, 380)
      ctx.stroke()

      // Disposition and SHA256 receipt
      ctx.fillStyle = '#52525B'
      ctx.font = '500 22px "JetBrains Mono", monospace'
      ctx.fillText(`DISPOSITION: ${cfg.status}`, 64, 435)

      ctx.fillStyle = cfg.color
      ctx.fillText(`SHA256 // 0x9F4A...8E2C`, 640, 435)

      const tex = new THREE.CanvasTexture(canvas)
      tex.anisotropy = 8
      return tex
    }

    const blades: THREE.Mesh[] = []
    const bladeCoords = [
      { x: -1.35, y: 1.55, z: 0.3, ry: 0.32 },
      { x: 2.25, y: 1.35, z: 0.4, ry: -0.35 },
      { x: -1.25, y: -0.85, z: 0.85, ry: 0.25 },
      { x: 2.35, y: -0.65, z: 0.85, ry: -0.28 },
      { x: 0.35, y: -1.95, z: -0.6, ry: 0.0 },
    ]

    const bladeGeo = new THREE.BoxGeometry(1.75, 0.88, 0.04)

    // Wireframe geometry for X-Ray AST pass
    const wireframeGeo = new THREE.EdgesGeometry(bladeGeo)

    slabConfigs.forEach((cfg, idx) => {
      const tex = createSwissBladeTexture(cfg)
      const solidMat = new THREE.MeshPhysicalMaterial({
        map: tex,
        roughness: 0.15,
        metalness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.08,
        transparent: true,
        opacity: 1.0,
      })

      const mesh = new THREE.Mesh(bladeGeo, solidMat)
      const base = bladeCoords[idx]
      mesh.position.set(base.x, base.y, base.z)
      mesh.rotation.y = base.ry
      mesh.userData = { index: idx, base, cfg, solidMat }

      // Add wireframe child for X-Ray pass
      const wireMat = new THREE.LineBasicMaterial({
        color: new THREE.Color(cfg.color),
        transparent: true,
        opacity: 0.0,
      })
      const wireMesh = new THREE.LineSegments(wireframeGeo, wireMat)
      mesh.add(wireMesh)
      mesh.userData.wireMat = wireMat

      rig.add(mesh)
      blades.push(mesh)

      // Fiber-optic Bezier conduit linking each blade to the central crystal core
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(base.x * 0.4, base.y * 0.8, base.z * 0.5),
        new THREE.Vector3(base.x * 0.8, base.y * 0.3, base.z),
        new THREE.Vector3(base.x, base.y, base.z)
      )
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.008, 8, false)
      const tubeMat = new THREE.MeshBasicMaterial({
        color: cfg.color,
        transparent: true,
        opacity: 0.35,
      })
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat)
      rig.add(tubeMesh)
      mesh.userData.tubeMesh = tubeMesh
    })

    // 6. ScrollTrigger Multi-Beat Choreography
    const scrollState = { conflict: 0, dagSpread: 0, merkleLock: 0 }
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
        },
      })

      // Beat 1 -> 2: Center rig, dolly camera, flare vermilion conflict state
      tl.to(rig.position, { x: 0, y: 0.1, ease: 'power2.inOut' }, 0)
        .to(camera.position, { x: 0, z: 6.4, ease: 'power2.inOut' }, 0)
        .to(scrollState, { conflict: 1, ease: 'power2.inOut' }, 0)
        .to(conflictLight, { intensity: 14, ease: 'power2.inOut' }, 0)
        .to(lensPass.uniforms.uAberration, { value: 0.0048, ease: 'power2.inOut' }, 0)

      // Beat 2 -> 3: DAG Precedence Alignment
      tl.to(scrollState, { conflict: 0, dagSpread: 1, ease: 'power3.inOut' }, 0.38)
        .to(camera.position, { z: 7.4, y: -0.2, ease: 'power3.inOut' }, 0.38)
        .to(conflictLight, { intensity: 0, ease: 'power3.inOut' }, 0.38)
        .to(lensPass.uniforms.uAberration, { value: 0.0018, ease: 'power3.inOut' }, 0.38)

      // Beat 3 -> 4: Merkle Seal Compression
      tl.to(scrollState, { merkleLock: 1, dagSpread: 0, ease: 'power2.inOut' }, 0.72)
        .to(rig.position, { y: 0.8, z: -1.5, ease: 'power2.inOut' }, 0.72)
    })

    // 7. Pointer Raycasting & Animation Loop
    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2(999, 999)
    const mouseSmooth = { x: 0, y: 0, tx: 0, ty: 0 }

    const onPointerMove = (e: MouseEvent) => {
      mouseSmooth.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouseSmooth.ty = -(e.clientY / window.innerHeight) * 2 + 1
      pointer.set(mouseSmooth.tx, mouseSmooth.ty)
    }
    window.addEventListener('mousemove', onPointerMove)

    let rafId: number
    let lastHoveredId: string | null = null
    const startTime = performance.now()

    const animate = () => {
      rafId = requestAnimationFrame(animate)
      const t = (performance.now() - startTime) * 0.001

      mouseSmooth.x += (mouseSmooth.tx - mouseSmooth.x) * 0.06
      mouseSmooth.y += (mouseSmooth.ty - mouseSmooth.y) * 0.06

      const activeConflict = externalConflict !== undefined ? externalConflict : scrollState.conflict

      nucleusMat.uniforms.uTime.value = t
      nucleusMat.uniforms.uConflict.value = activeConflict
      lensPass.uniforms.uTime.value = t

      // Counter-rotating precision gimbals
      crystalMesh.rotation.y = t * 0.18
      crystalMesh.rotation.z = Math.sin(t * 0.4) * 0.15

      gimbal1.rotation.y = -t * 0.22 + activeConflict * 1.2
      gimbal1.rotation.x = Math.sin(t * 0.3) * 0.25

      gimbal2.rotation.z = t * 0.14 - scrollState.dagSpread * 0.8
      gimbal3.rotation.x = t * 0.19

      rig.rotation.y = mouseSmooth.x * 0.25
      rig.rotation.x = -mouseSmooth.y * 0.15

      raycaster.setFromCamera(pointer, camera)
      const hits = raycaster.intersectObjects(blades)
      const hoveredMesh = hits.length > 0 ? (hits[0].object as THREE.Mesh) : null
      const hoveredCfg = hoveredMesh ? (hoveredMesh.userData.cfg as SlabData) : null

      if ((hoveredCfg?.id || null) !== lastHoveredId) {
        lastHoveredId = hoveredCfg?.id || null
        if (onHoverSlab) onHoverSlab(hoveredCfg)
      }

      // Dynamic Wireframe-to-Solid X-Ray Pass (Design Tree Q3)
      blades.forEach((blade, idx) => {
        const { base, solidMat, wireMat } = blade.userData
        const isHovered = hoveredMesh === blade
        const isConflictBlade = idx === 2 || idx === 3
        const floatY = Math.sin(t * 1.5 + idx * 1.2) * 0.06

        let cx = 0
        let cz = 0
        if (idx === 2) {
          cx = activeConflict * 1.25
          cz = activeConflict * 0.95
        } else if (idx === 3) {
          cx = -activeConflict * 1.25
          cz = activeConflict * 0.95
        }

        // X-Ray AST Wireframe transition logic
        if (activeConflict > 0.4) {
          if (isConflictBlade || isHovered) {
            // Conflicting blades stay solid & flare
            solidMat.opacity = 1.0
            wireMat.opacity = 0.2
          } else {
            // Non-conflicting blades shift into AST wireframe lattice
            solidMat.opacity = THREE.MathUtils.lerp(solidMat.opacity, 0.25, 0.1)
            wireMat.opacity = THREE.MathUtils.lerp(wireMat.opacity, 0.75, 0.1)
          }
        } else {
          // Normal mode
          solidMat.opacity = THREE.MathUtils.lerp(solidMat.opacity, 1.0, 0.1)
          wireMat.opacity = THREE.MathUtils.lerp(wireMat.opacity, 0.0, 0.1)
        }

        const scale = isHovered ? 1.12 : 1.0
        blade.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.12)
        blade.position.x = base.x + cx - base.x * scrollState.merkleLock * 0.55
        blade.position.y = base.y + floatY + (2 - idx) * 0.35 * scrollState.dagSpread
        blade.position.z = base.z + cz + (isHovered ? 0.35 : 0)
      })

      composer.render()
    }
    animate()

    const handleResize = () => {
      if (!container) return
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      composer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafId)
      ctx.revert()
      pmremGenerator.dispose()
      renderer.dispose()
      crystalGeo.dispose()
      crystalMat.dispose()
      bladeGeo.dispose()
      wireframeGeo.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [onHoverSlab, externalConflict])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen pointer-events-none z-0"
      style={{ overflow: 'hidden' }}
    />
  )
}
