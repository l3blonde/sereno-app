"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface MinimalistWaveHorizonProps {
    phase: "inhale" | "hold" | "exhale" | "hold2"
    progress: number
    isPaused: boolean
    isLightTheme?: boolean
}

// Particle system for the scattered dots effect
function ParticleField({ phase, progress, isPaused }: MinimalistWaveHorizonProps) {
    const pointsRef = useRef<THREE.Points>(null)
    const time = useRef(0)

    // Create particles
    const particles = useMemo(() => {
        const count = 2000
        const positions = new Float32Array(count * 3)
        const sizes = new Float32Array(count)

        for (let i = 0; i < count; i++) {
            // Position particles in a horizontal band with more concentration near the center
            const x = (Math.random() * 2 - 1) * 10
            const y = (Math.random() * 2 - 1) * 3
            const z = (Math.random() - 0.5) * 2

            positions[i * 3] = x
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = z

            // Vary sizes
            sizes[i] = Math.random() * 0.05 + 0.01
        }

        return { positions, sizes }
    }, [])

    // Set up geometry
    useEffect(() => {
        if (!pointsRef.current) return

        const geometry = pointsRef.current.geometry
        geometry.setAttribute("position", new THREE.BufferAttribute(particles.positions, 3))
        geometry.setAttribute("size", new THREE.BufferAttribute(particles.sizes, 1))
    }, [particles])

    // Animate particles
    useFrame((_, delta) => {
        if (isPaused || !pointsRef.current) return

        time.current += delta * 0.3

        // Add null checks to prevent runtime errors
        const geometry = pointsRef.current.geometry
        if (!geometry) return

        const positions = geometry.getAttribute("position")
        const sizes = geometry.getAttribute("size")

        // Make sure positions and sizes exist before proceeding
        if (!positions || !sizes) return

        for (let i = 0; i < positions.count; i++) {
            // Get current position
            const x = positions.getX(i)
            const y = positions.getY(i)
            const z = positions.getZ(i)

            // Apply gentle movement
            positions.setX(i, x + Math.sin(time.current + i * 0.1) * 0.005)
            positions.setY(i, y + Math.cos(time.current + i * 0.1) * 0.005)

            // Phase-specific behavior
            if (phase === "inhale") {
                // During inhale, particles move outward
                const direction = Math.atan2(y, x)
                positions.setX(i, x + Math.cos(direction) * 0.001 * progress)
                positions.setY(i, y + Math.sin(direction) * 0.001 * progress)
                sizes.setX(i, Math.random() * 0.05 + 0.02 + progress * 0.01)
            } else if (phase === "exhale") {
                // During exhale, particles move inward
                const direction = Math.atan2(y, x)
                positions.setX(i, x - Math.cos(direction) * 0.001 * progress)
                positions.setY(i, y - Math.sin(direction) * 0.001 * progress)
                sizes.setX(i, Math.random() * 0.05 + 0.01)
            }
        }

        positions.needsUpdate = true
        sizes.needsUpdate = true
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry />
            <pointsMaterial
                size={0.05}
                color="#4080ff"
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    )
}

function GlowingWaves({ phase, progress, isPaused }: MinimalistWaveHorizonProps) {
    const meshRef = useRef<THREE.Mesh>(null)
    const time = useRef(0)

    // Create shader material for glowing waves
    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPhase: { value: 0 }, // 0: inhale, 1: hold1, 2: exhale, 3: hold2
                uProgress: { value: 0 },
                uColor1: { value: new THREE.Color(0x03045e) }, // Deep blue (from SVG)
                uColor2: { value: new THREE.Color(0x0096c7) }, // Medium blue (from SVG)
                uColor3: { value: new THREE.Color(0x90e0ef) }, // Light blue (from SVG)
                uColor4: { value: new THREE.Color(0xcaf0f8) }, // Foam color (from SVG)
                uAspect: { value: 1.0 }, // Will be updated with actual aspect ratio
            },
            vertexShader: `
        uniform float uTime;
        uniform float uPhase;
        uniform float uProgress;
        uniform float uAspect;
        
        varying vec2 vUv;
        varying float vElevation;
        
        // Simplex noise function
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy));
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1;
          i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod(i, 289.0);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m;
          m = m*m;
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
          vUv = uv;
          
          // Calculate wave amplitude based on phase and progress - INCREASED SIGNIFICANTLY
          float amplitude = 0.0;
          if (uPhase == 0.0) { // inhale
            amplitude = 0.2 + uProgress * 0.8; // Greatly increased amplitude for more visible waves
          } else if (uPhase == 2.0) { // exhale
            amplitude = 1.0 - uProgress * 0.8;
          } else if (uPhase == 1.0) { // hold1
            amplitude = 1.0; // Maximum during hold after inhale
          } else { // hold2
            amplitude = 0.2; // Minimum during hold after exhale
          }
          
          // Calculate wave frequency based on phase - adjusted for more natural waves
          float frequency = 1.0;
          if (uPhase == 0.0) { // inhale
            frequency = 1.0 + uProgress * 0.5; // Increase frequency during inhale
          } else if (uPhase == 2.0) { // exhale
            frequency = 1.5 - uProgress * 0.5; // Decrease frequency during exhale
          } else if (uPhase == 1.0) { // hold1
            frequency = 1.5; // Maximum during hold after inhale
          } else { // hold2
            frequency = 1.0; // Minimum during hold after exhale
          }
          
          // Adjust frequency for aspect ratio to maintain wave appearance on wide screens
          frequency = frequency / uAspect * 2.0;
          
          // Generate more natural sea-like waves using multiple frequencies and amplitudes
          float wave1 = sin(vUv.x * frequency * 3.0 + uTime * 0.5) * amplitude;
          float wave2 = sin(vUv.x * frequency * 2.0 - uTime * 0.3) * amplitude * 0.8;
          float wave3 = sin(vUv.x * frequency * 5.0 + uTime * 0.7) * amplitude * 0.3;
          float wave4 = sin(vUv.x * frequency * 8.0 + uTime * 0.9) * amplitude * 0.1;

          // Add some noise to create more natural, sea-like waves
          float noiseX = snoise(vec2(vUv.x * 3.0 + uTime * 0.2, uTime * 0.1));
          float noiseY = snoise(vec2(vUv.x * 2.0 - uTime * 0.15, uTime * 0.05));
          float noise = noiseX * noiseY * amplitude * 0.5;

          // Combine waves with noise for a more natural sea-like appearance
          float elevation = wave1 + wave2 + wave3 + wave4 + noise;
          
          // Apply elevation to vertex - AMPLIFIED by 5x for more pronounced waves
          vec3 newPosition = position;
          newPosition.y += elevation * 5.0;
          
          // Store elevation for fragment shader
          vElevation = elevation;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 uColor1; // Deep blue
        uniform vec3 uColor2; // Medium blue
        uniform vec3 uColor3; // Light blue
        uniform vec3 uColor4; // Foam color
        uniform float uPhase;
        uniform float uProgress;
        
        varying vec2 vUv;
        varying float vElevation;
        
        void main() {
          // Calculate base color based on elevation with more sea-like colors
          vec3 deepColor = uColor1; // Deep sea blue
          vec3 midColor = uColor2;  // Medium blue
          vec3 shallowColor = uColor3; // Light blue
          vec3 foamColor = uColor4; // Foam/crest color

          // Create a more complex color gradient based on elevation
          vec3 color;
          
          // Map elevation to 0-1 range for better color control
          float normalizedElevation = (vElevation + 1.0) * 0.5;
          
          if (normalizedElevation < 0.3) {
            // Deep water
            color = mix(deepColor, midColor, normalizedElevation / 0.3);
          } else if (normalizedElevation < 0.7) {
            // Mid to shallow water
            color = mix(midColor, shallowColor, (normalizedElevation - 0.3) / 0.4);
          } else {
            // Shallow to foam
            color = mix(shallowColor, foamColor, (normalizedElevation - 0.7) / 0.3);
          }

          // Add foam/crest effect at wave peaks - more pronounced
          float crestFactor = smoothstep(0.7, 0.9, normalizedElevation);
          color = mix(color, foamColor, crestFactor);
          
          // Add glow effect - enhanced
          float glow = 0.5 / (abs(vElevation) * 10.0 + 0.1);
          color = mix(color, foamColor, min(1.0, glow * 0.7));
          
          // Adjust color based on breathing phase
          if (uPhase == 0.0) { // inhale
            // Gradually increase brightness during inhale
            color = mix(color, vec3(0.6, 0.9, 1.0), uProgress * 0.3);
          } else if (uPhase == 2.0) { // exhale
            // Gradually decrease brightness during exhale
            color = mix(color, vec3(0.0, 0.3, 0.8), uProgress * 0.3);
          } else if (uPhase == 1.0) { // hold1
            // Maximum brightness during hold after inhale
            color = mix(color, vec3(0.6, 0.9, 1.0), 0.3);
          }
          
          // Calculate opacity based on glow and elevation
          float opacity = min(1.0, glow + crestFactor);
          
          gl_FragColor = vec4(color, opacity);
        }
      `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        })
    }, [])

    // Update shader uniforms based on phase and progress
    useEffect(() => {
        if (!material) return

        // Map phase to uniform value
        let phaseValue = 0
        if (phase === "inhale") phaseValue = 0
        else if (phase === "hold") phaseValue = 1
        else if (phase === "exhale") phaseValue = 2
        else if (phase === "hold2") phaseValue = 3

        material.uniforms.uPhase.value = phaseValue
        material.uniforms.uProgress.value = progress
    }, [material, phase, progress])

    // Animate waves
    useFrame((_, delta) => {
        if (isPaused) return

        time.current += delta * 0.5
        if (material) {
            material.uniforms.uTime.value = time.current
        }
    })

    // Create multiple wave layers with varying heights for a more 3D ocean effect
    return (
        <group>
            {/* Main waves - now using curved geometries and more pronounced heights */}
            {/* Bottom layer - deep waves */}
            <mesh position={[0, -1.5, 0]}>
                <planeGeometry args={[20, 1.5, 256, 8]} /> {/* Increased height and segments */}
                {material && <primitive object={material} attach="material" />}
            </mesh>

            {/* Middle layer waves */}
            <mesh position={[0, -0.8, 0.5]}>
                <planeGeometry args={[20, 1.2, 256, 6]} />
                {material && <primitive object={material} attach="material" />}
            </mesh>

            {/* Upper layer waves */}
            <mesh position={[0, -0.2, 1]}>
                <planeGeometry args={[20, 0.8, 256, 4]} />
                {material && <primitive object={material} attach="material" />}
            </mesh>

            {/* Top foam layer */}
            <mesh position={[0, 0.3, 1.5]}>
                <planeGeometry args={[20, 0.5, 256, 2]} />
                {material && <primitive object={material} attach="material" />}
            </mesh>

            {/* Additional wave details for more complexity */}
            <mesh position={[2, -0.5, 0.8]}>
                <planeGeometry args={[15, 0.6, 200, 3]} />
                {material && <primitive object={material} attach="material" />}
            </mesh>

            <mesh position={[-3, -0.6, 0.7]}>
                <planeGeometry args={[18, 0.7, 220, 3]} />
                {material && <primitive object={material} attach="material" />}
            </mesh>
        </group>
    )
}

function MinimalistScene({ phase, progress, isPaused }: { phase: string; progress: number; isPaused: boolean }) {
    const { camera, size } = useThree()

    // Set up camera and handle aspect ratio
    useEffect(() => {
        // Calculate aspect ratio
        const aspect = size.width / size.height

        // Update camera
        if (aspect > 1) {
            // Landscape/horizontal view - pull back camera to see more waves
            camera.position.set(0, 1, 8) // Raised and pulled back
            camera.lookAt(0, -0.5, 0) // Look slightly down at waves
        } else {
            // Portrait view
            camera.position.set(0, 1, 10)
            camera.lookAt(0, -0.5, 0)
        }

        // Find all meshes and update their aspect ratio uniform if available
        const meshes =
            camera.parent?.children.filter((child: any) => {
                return child instanceof THREE.Mesh
            }) || []

        meshes.forEach((mesh: any) => {
            if (mesh.material instanceof THREE.ShaderMaterial) {
                const material = mesh.material
                if (material && material.uniforms && material.uniforms.uAspect) {
                    material.uniforms.uAspect.value = aspect
                }
            }
        })
    }, [camera, size])

    return (
        <>
            <color attach="background" args={[0x000000]} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[0, 10, 5]} intensity={0.5} color="#ffffff" />

            {/* Particle field for scattered dots effect */}
            <ParticleField phase={phase as "inhale" | "hold" | "exhale" | "hold2"} progress={progress} isPaused={isPaused} />

            {/* Glowing wave layers */}
            <GlowingWaves phase={phase as "inhale" | "hold" | "exhale" | "hold2"} progress={progress} isPaused={isPaused} />
        </>
    )
}

export function MinimalistWaveHorizon({
                                          phase = "inhale",
                                          progress = 0,
                                          isPaused = false,
                                          isLightTheme = false,
                                      }: {
    phase?: string
    progress?: number
    isPaused?: boolean
    isLightTheme?: boolean
}) {
    // Convert phase string to the expected format for the MinimalistScene component
    const mappedPhase = phase

    return (
        <div className="absolute inset-0 w-full h-full">
            <Canvas dpr={[1, 2]}>
                <MinimalistScene phase={mappedPhase} progress={progress} isPaused={isPaused} />
            </Canvas>
        </div>
    )
}
