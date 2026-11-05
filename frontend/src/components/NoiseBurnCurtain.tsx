import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface NoiseBurnCurtainProps {
  progress?: number // 0.0 (dark void) -> 1.0 (burned away)
  active?: boolean
}

const BurnCurtainShader = {
  uniforms: {
    uProgress: { value: 0.0 },
    uTime: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(1, 1) },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uProgress;
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Simplex 2D noise implementation
    vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

    float snoise(vec2 v){
      const vec4 C = vec4(0.211324865405187, 0.366025403784439,
               -0.577350269189626, 0.024390243902439);
      vec2 i  = floor(v + dot(v, C.yy) );
      vec2 x0 = v -   i + dot(i, C.xx);
      vec2 i1;
      i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
        + i.x + vec3(0.0, i1.x, 1.0 ));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy),
        dot(x12.zw,x12.zw)), 0.0);
      m = m*m ;
      m = m*m ;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }

    void main() {
      if (uProgress <= 0.001) {
        discard;
      }

      vec2 uv = vUv;
      float aspect = uResolution.x / max(uResolution.y, 1.0);
      vec2 scaledUv = vec2(uv.x * aspect, uv.y);

      // Multi-octave domain noise
      float n1 = snoise(scaledUv * 3.5 + vec2(0.0, uTime * 0.08));
      float n2 = snoise(scaledUv * 7.0 - vec2(uTime * 0.04, 0.0)) * 0.5;
      float noiseVal = (n1 + n2) * 0.5 + 0.5; // [0, 1]

      // Sweeping burn front moving from center outwards and top to bottom
      float distFromTop = 1.0 - uv.y;
      float burnThreshold = uProgress * 1.55;
      float burnCoord = distFromTop * 0.45 + noiseVal * 0.55;

      float diff = burnCoord - burnThreshold;

      // Burned away -> reveal underlying parchment
      if (diff < 0.0) {
        discard;
      }

      // Incandescent glowing ember edge
      vec3 lime = vec3(0.824, 1.0, 0.157);       // #D2FF28 Signal Lime
      vec3 vermilion = vec3(1.0, 0.20, 0.12);     // #FF331F Signal Vermilion
      vec3 obsidian = vec3(0.024, 0.024, 0.031);  // #060608 Void

      if (diff < 0.08) {
        float emberFactor = diff / 0.08;
        vec3 flameCol = mix(vermilion, lime, 1.0 - emberFactor);
        float boost = pow(1.0 - emberFactor, 2.5) * 3.0;
        gl_FragColor = vec4(flameCol * boost, 1.0);
      } else {
        // Darkroom void body with subtle noise texture
        float ashDust = noiseVal * 0.04;
        gl_FragColor = vec4(obsidian + ashDust, 1.0);
      }
    }
  `,
}

export const NoiseBurnCurtain: React.FC<NoiseBurnCurtainProps> = ({ progress = 0, active = true }) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container || !active) return

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

    const material = new THREE.ShaderMaterial({
      vertexShader: BurnCurtainShader.vertexShader,
      fragmentShader: BurnCurtainShader.fragmentShader,
      uniforms: THREE.UniformsUtils.clone(BurnCurtainShader.uniforms),
      transparent: true,
      depthTest: false,
    })
    material.uniforms.uResolution.value.set(container.clientWidth, container.clientHeight)
    materialRef.current = material

    const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material)
    scene.add(quad)

    let animationFrameId: number
    const startTime = performance.now()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value = (performance.now() - startTime) * 0.001
      }
      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!container || !materialRef.current || !rendererRef.current) return
      const w = container.clientWidth
      const h = container.clientHeight
      rendererRef.current.setSize(w, h)
      materialRef.current.uniforms.uResolution.value.set(w, h)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameId)
      renderer.dispose()
      material.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [active])

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uProgress.value = progress
    }
  }, [progress])

  if (!active) return null

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-15 overflow-hidden"
    />
  )
}
