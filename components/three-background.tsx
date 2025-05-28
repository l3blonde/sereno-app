"use client"

import type React from "react"
import type { ThemeColorType } from "@/components/theme-color-provider" // Import the ThemeColorType

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import * as THREE from "three"

export interface ThreeBackgroundProps {
    backgroundType?: string
    color?: string
    accentColor?: string
    breathPhase?: "inhale" | "hold1" | "exhale" | "hold2"
    breathProgress?: number
    paused?: boolean
    isLightTheme?: boolean
    themeColor?: ThemeColorType // Add themeColor prop with the correct type
}

// Define proper types for the refs
type MeshRefType = React.RefObject<THREE.Mesh>
type PointsRefType = React.RefObject<THREE.Points>
type GroupRefType = React.RefObject<THREE.Group>

// Scene background component that adapts to theme
function SceneBackground({ isLightTheme }: { isLightTheme?: boolean }) {
    const { scene } = useThree()

    useEffect(() => {
        // Set background color based on theme
        if (isLightTheme) {
            scene.background = new THREE.Color(0xf5f5f5) // Light gray for light theme
        } else {
            scene.background = new THREE.Color(0x000000) // Black for dark theme
        }
    }, [scene, isLightTheme])

    return null
}

function BreathingSphere({
                             phase,
                             progress,
                             color,
                             accentColor,
                             isPaused = false,
                             isLightTheme = false,
                         }: {
    phase: "inhale" | "hold1" | "exhale" | "hold2"
    progress: number
    color: string
    accentColor: string
    isPaused?: boolean
    isLightTheme?: boolean
}) {
    // Use proper typing for the ref
    const meshRef = useRef<THREE.Mesh>(null)
    const [scale, setScale] = useState(1)

    // Adjust colors based on theme
    const sphereColor = isLightTheme ? new THREE.Color(color).lerp(new THREE.Color("#ffffff"), 0.3).getStyle() : color

    const glowColor = isLightTheme
        ? new THREE.Color(accentColor).lerp(new THREE.Color("#ffffff"), 0.2).getStyle()
        : accentColor

    useEffect(() => {
        // Calculate scale based on breathing phase
        if (isPaused) return

        if (phase === "inhale") {
            setScale(1 + progress * 0.5) // 1.0 to 1.5
        } else if (phase === "exhale") {
            setScale(1.5 - progress * 0.5) // 1.5 to 1.0
        } else if (phase === "hold1") {
            setScale(1.5) // Stay expanded
        } else {
            setScale(1.0) // Stay contracted
        }
    }, [phase, progress, isPaused])

    useFrame(() => {
        if (meshRef.current) {
            // Smooth transition to target scale
            meshRef.current.scale.x = THREE.MathUtils.lerp(meshRef.current.scale.x, scale, 0.1)
            meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, scale, 0.1)
            meshRef.current.scale.z = THREE.MathUtils.lerp(meshRef.current.scale.z, scale, 0.1)

            // Gentle rotation (only if not paused)
            if (!isPaused) {
                meshRef.current.rotation.y += 0.002
                meshRef.current.rotation.z += 0.001
            }
        }
    })

    return (
        <group>
            {/* Glow sphere (slightly larger) */}
            <mesh scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshBasicMaterial color={glowColor} transparent={true} opacity={0.2} />
            </mesh>

            {/* Main sphere */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    color={sphereColor}
                    transparent={true}
                    opacity={0.8}
                    roughness={0.2}
                    metalness={0.8}
                    emissive={glowColor}
                    emissiveIntensity={0.4}
                />
            </mesh>
        </group>
    )
}

function ParticleField({
                           count = 500,
                           color = "#ffffff",
                           isPaused = false,
                           isLightTheme = false,
                       }: {
    count?: number
    color?: string
    isPaused?: boolean
    isLightTheme?: boolean
}) {
    // Use proper typing for the ref
    const pointsRef = useRef<THREE.Points>(null)

    // Adjust particle color based on theme
    const particleColor = isLightTheme ? new THREE.Color(color).lerp(new THREE.Color("#000000"), 0.7).getStyle() : color

    useEffect(() => {
        if (pointsRef.current) {
            const positions = new Float32Array(count * 3)
            const geometry = pointsRef.current.geometry

            for (let i = 0; i < count; i++) {
                const i3 = i * 3
                positions[i3] = (Math.random() - 0.5) * 20
                positions[i3 + 1] = (Math.random() - 0.5) * 20
                positions[i3 + 2] = (Math.random() - 0.5) * 20
            }

            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
        }
    }, [count])

    useFrame(() => {
        if (pointsRef.current && !isPaused) {
            pointsRef.current.rotation.y += 0.0005
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry />
            <pointsMaterial
                size={0.05}
                color={particleColor}
                transparent={true}
                opacity={isLightTheme ? 0.4 : 0.6}
                sizeAttenuation={true}
            />
        </points>
    )
}

// Create rings for different visualization types
function OceanRings({
                        color,
                        accentColor,
                        scale,
                        isPaused = false,
                        isLightTheme = false,
                    }: {
    color: string
    accentColor: string
    scale: number
    isPaused?: boolean
    isLightTheme?: boolean
}) {
    // Use proper typing for the ref
    const groupRef = useRef<THREE.Group>(null)

    // Adjust colors based on theme
    const primaryColor = isLightTheme ? new THREE.Color(color).lerp(new THREE.Color("#000000"), 0.7).getStyle() : color

    const secondaryColor = isLightTheme
        ? new THREE.Color(accentColor).lerp(new THREE.Color("#000000"), 0.5).getStyle()
        : accentColor

    useFrame(() => {
        if (groupRef.current && !isPaused) {
            groupRef.current.rotation.z += 0.001
        }
    })

    return (
        <group ref={groupRef} scale={[scale, scale, 1]}>
            {[0, 1, 2, 3, 4].map((i) => (
                <mesh key={i} position={[0, 0, -i * 0.1]}>
                    <torusGeometry args={[1.5 + i * 0.2, 0.05, 16, 100]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? primaryColor : secondaryColor}
                        transparent={true}
                        opacity={0.8 - i * 0.1}
                        emissive={i % 2 === 0 ? primaryColor : secondaryColor}
                        emissiveIntensity={0.3}
                    />
                </mesh>
            ))}
        </group>
    )
}

// New Forest Waves visualization - horizontal waves that move like a forest canopy
function ForestWaves({
                         color,
                         accentColor,
                         scale,
                         phase,
                         progress,
                         isPaused = false,
                         isLightTheme = false,
                     }: {
    color: string
    accentColor: string
    scale: number
    phase: "inhale" | "hold1" | "exhale" | "hold2"
    progress: number
    isPaused?: boolean
    isLightTheme?: boolean
}) {
    // Use proper typing for the ref
    const groupRef = useRef<THREE.Group>(null)
    const waveTime = useRef(0)
    const wavesRef = useRef<THREE.Mesh[]>([])

    // Adjust colors based on theme
    const primaryColor = isLightTheme ? new THREE.Color(color).lerp(new THREE.Color("#000000"), 0.7).getStyle() : color

    const secondaryColor = isLightTheme
        ? new THREE.Color(accentColor).lerp(new THREE.Color("#000000"), 0.5).getStyle()
        : accentColor

    // Calculate wave amplitude based on breathing phase
    const getWaveAmplitude = () => {
        if (phase === "inhale") {
            return 0.05 + progress * 0.1 // Increase during inhale
        } else if (phase === "exhale") {
            return 0.15 - progress * 0.1 // Decrease during exhale
        } else if (phase === "hold1") {
            return 0.15 // Maximum during hold after inhale
        } else {
            return 0.05 // Minimum during hold after exhale
        }
    }

    useFrame((_, delta) => {
        if (isPaused) return

        // Increment time for wave animation
        waveTime.current += delta * 0.5

        // Get current amplitude
        const amplitude = getWaveAmplitude()

        // Animate each wave with a different phase
        wavesRef.current.forEach((wave, index) => {
            if (wave) {
                // Create a wave-like motion
                const frequency = 1 - index * 0.1
                const xOffset = index * 0.2

                // Update wave vertices
                const geometry = wave.geometry
                const positions = geometry.getAttribute("position")

                for (let i = 0; i < positions.count; i++) {
                    const x = positions.getX(i)
                    const originalY = i % 2 === 0 ? 0.075 : -0.075 // Original y position

                    // Calculate wave effect
                    const waveEffect = Math.sin(waveTime.current * frequency + x + xOffset) * amplitude

                    // Apply wave effect
                    positions.setY(i, originalY + waveEffect)
                }

                positions.needsUpdate = true
            }
        })
    })

    return (
        <group ref={groupRef} scale={[scale * 1.5, scale * 0.8, 1]} rotation={[0, 0, 0]}>
            {[0, 1, 2, 3, 4, 5].map((i) => (
                <mesh
                    key={i}
                    position={[0, -0.5 + i * 0.2, -i * 0.05]}
                    ref={(el: THREE.Mesh | null) => {
                        if (el) wavesRef.current[i] = el
                    }}
                >
                    {/* Use a plane with many segments for wave animation */}
                    <planeGeometry args={[4, 0.15, 32, 1]} />
                    <meshStandardMaterial
                        color={i % 2 === 0 ? primaryColor : secondaryColor}
                        transparent={true}
                        opacity={0.9 - i * 0.1}
                        emissive={i % 2 === 0 ? primaryColor : secondaryColor}
                        emissiveIntensity={0.4}
                        side={THREE.DoubleSide}
                    />
                </mesh>
            ))}

            {/* Add some vertical elements to suggest trees */}
            {[0, 1, 2, 3].map((i) => (
                <mesh key={`tree-${i}`} position={[-1.5 + i * 1, -0.3, 0.1]}>
                    <boxGeometry args={[0.05, 0.4, 0.05]} />
                    <meshStandardMaterial
                        color={secondaryColor}
                        transparent={true}
                        opacity={0.7}
                        emissive={secondaryColor}
                        emissiveIntensity={0.3}
                    />
                </mesh>
            ))}
        </group>
    )
}

function SunriseVisualization({
                                  color,
                                  accentColor,
                                  scale,
                                  phase,
                                  progress,
                                  isPaused = false,
                                  isLightTheme = false,
                              }: {
    color: string
    accentColor: string
    scale: number
    phase: "inhale" | "hold1" | "exhale" | "hold2"
    progress: number
    isPaused?: boolean
    isLightTheme?: boolean
}) {
    // Use proper typing for the refs
    const sunRef = useRef<THREE.Mesh>(null)
    const raysRef = useRef<THREE.Group>(null)
    const particlesRef = useRef<THREE.Points>(null)

    // Adjust colors based on theme
    const primaryColor = isLightTheme ? new THREE.Color(color).lerp(new THREE.Color("#000000"), 0.6).getStyle() : color

    const secondaryColor = isLightTheme
        ? new THREE.Color(accentColor).lerp(new THREE.Color("#000000"), 0.3).getStyle()
        : accentColor

    // Calculate sun position based on breathing phase
    const getSunPosition = () => {
        if (phase === "inhale") {
            return -0.5 + progress * 0.5 // Rise during inhale
        } else if (phase === "exhale") {
            return 0 // Stay at horizon during exhale
        } else if (phase === "hold1") {
            return 0 // Stay at horizon during hold after inhale
        } else {
            return -0.5 // Stay below horizon during hold after exhale
        }
    }

    // Calculate ray intensity based on breathing phase
    const getRayIntensity = () => {
        if (phase === "inhale") {
            return progress // Increase during inhale
        } else if (phase === "exhale") {
            return 1 - progress // Decrease during exhale
        } else if (phase === "hold1") {
            return 1 // Maximum during hold after inhale
        } else {
            return 0 // Minimum during hold after exhale
        }
    }

    useEffect(() => {
        if (particlesRef.current) {
            const positions = new Float32Array(200 * 3)
            const colors = new Float32Array(200 * 3)
            const sizes = new Float32Array(200)

            const color = new THREE.Color(secondaryColor)

            for (let i = 0; i < 200; i++) {
                // Position particles in a dome shape above the horizon
                const theta = Math.random() * Math.PI
                const phi = Math.random() * Math.PI * 2

                const x = Math.sin(theta) * Math.cos(phi) * 2
                const y = Math.abs(Math.sin(theta) * Math.sin(phi)) * 1.5
                const z = Math.cos(theta) * 2

                positions[i * 3] = x
                positions[i * 3 + 1] = y
                positions[i * 3 + 2] = z

                // Vary colors slightly
                colors[i * 3] = color.r * (0.8 + Math.random() * 0.2)
                colors[i * 3 + 1] = color.g * (0.8 + Math.random() * 0.2)
                colors[i * 3 + 2] = color.b * (0.8 + Math.random() * 0.2)

                // Vary sizes
                sizes[i] = Math.random() * 0.1 + 0.05
            }

            const geometry = particlesRef.current.geometry
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
            geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
            geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
        }
    }, [secondaryColor])

    useFrame(() => {
        if (!isPaused) {
            if (sunRef.current) {
                // Update sun position
                sunRef.current.position.y = getSunPosition()

                // Gentle rotation
                sunRef.current.rotation.z += 0.001
            }

            if (raysRef.current) {
                // Update ray opacity based on intensity
                const intensity = getRayIntensity()
                raysRef.current.children.forEach((child: any, index: number) => {
                    if (child instanceof THREE.Mesh) {
                        const material = child.material
                        if ("opacity" in material) {
                            material.opacity = Math.max(0.1, intensity * (0.8 - index * 0.15))
                        }
                    }
                })

                // Gentle rotation
                raysRef.current.rotation.z += 0.0005
            }

            if (particlesRef.current) {
                // Gentle rotation for particles
                particlesRef.current.rotation.y += 0.0003
            }
        }
    })

    return (
        <group scale={[scale, scale, 1]}>
            {/* Horizon line */}
            <mesh position={[0, -0.5, -1]}>
                <planeGeometry args={[10, 0.05]} />
                <meshBasicMaterial color={primaryColor} transparent={true} opacity={0.5} />
            </mesh>

            {/* Sun glow */}
            <mesh position={[0, getSunPosition(), 0]} scale={[1.2, 1.2, 1.2]}>
                <circleGeometry args={[1, 32]} />
                <meshBasicMaterial color={secondaryColor} transparent={true} opacity={0.2} />
            </mesh>

            {/* Sun */}
            <mesh ref={sunRef} position={[0, getSunPosition(), 0]}>
                <circleGeometry args={[1, 32]} />
                <meshBasicMaterial color={secondaryColor} transparent={true} opacity={0.9} />
            </mesh>

            {/* Rays */}
            <group ref={raysRef} position={[0, getSunPosition(), -0.1]}>
                {[0, 1, 2].map((i) => (
                    <mesh key={i}>
                        <ringGeometry args={[1.5 + i * 0.4, 1.6 + i * 0.4, 32]} />
                        <meshStandardMaterial
                            color={primaryColor}
                            transparent={true}
                            opacity={0.7 - i * 0.15}
                            side={THREE.DoubleSide}
                            emissive={primaryColor}
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                ))}
            </group>

            {/* Atmospheric particles */}
            <points ref={particlesRef}>
                <bufferGeometry />
                <pointsMaterial size={0.1} vertexColors={true} transparent={true} opacity={0.6} sizeAttenuation={true} />
            </points>
        </group>
    )
}

function SpaceVisualization({
                                color,
                                accentColor,
                                scale,
                                phase,
                                progress,
                                isPaused = false,
                                isLightTheme = false,
                            }: {
    color: string
    accentColor: string
    scale: number
    phase: "inhale" | "hold1" | "exhale" | "hold2"
    progress: number
    isPaused?: boolean
    isLightTheme?: boolean
}) {
    // Use proper typing for the refs
    const planetRef = useRef<THREE.Mesh>(null)
    const ringsRef = useRef<THREE.Group>(null)
    const energyRef = useRef<THREE.Mesh>(null)
    const starsRef = useRef<THREE.Points>(null)

    // Adjust colors based on theme
    const primaryColor = isLightTheme ? new THREE.Color(color).lerp(new THREE.Color("#000000"), 0.6).getStyle() : color

    const secondaryColor = isLightTheme
        ? new THREE.Color(accentColor).lerp(new THREE.Color("#000000"), 0.3).getStyle()
        : accentColor

    // Calculate energy scale based on breathing phase
    const getEnergyScale = () => {
        if (phase === "inhale") {
            return 1 + progress * 0.5 // Increase during inhale
        } else if (phase === "exhale") {
            return 1.5 - progress * 0.5 // Decrease during exhale
        } else if (phase === "hold1") {
            return 1.5 // Maximum during hold after inhale
        } else {
            return 1 // Minimum during hold after exhale
        }
    }

    useEffect(() => {
        if (starsRef.current) {
            const positions = new Float32Array(500 * 3)
            const colors = new Float32Array(500 * 3)
            const sizes = new Float32Array(500)

            for (let i = 0; i < 500; i++) {
                // Position stars randomly in a sphere
                const radius = 10 + Math.random() * 10
                const theta = Math.random() * Math.PI * 2
                const phi = Math.random() * Math.PI

                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta) * Math.PI

                positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
                positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
                positions[i * 3 + 2] = radius * Math.cos(phi)

                // Vary colors slightly
                const brightness = 0.5 + Math.random() * 0.5
                colors[i * 3] = brightness
                colors[i * 3 + 1] = brightness
                colors[i * 3 + 2] = brightness

                // Vary sizes
                sizes[i] = Math.random() * 0.1 + 0.02
            }

            const geometry = starsRef.current.geometry
            geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3))
            geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3))
            geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1))
        }
    }, [])

    useFrame(() => {
        if (!isPaused) {
            if (planetRef.current) {
                // Gentle rotation for planet
                planetRef.current.rotation.y += 0.002
            }

            if (ringsRef.current) {
                // Gentle rotation for rings
                ringsRef.current.rotation.x += 0.001
                ringsRef.current.rotation.z += 0.0005
            }

            if (energyRef.current) {
                // Update energy scale based on breathing phase
                const targetScale = getEnergyScale()
                energyRef.current.scale.set(targetScale, targetScale, targetScale)

                // Pulse effect
                energyRef.current.rotation.z += 0.01
            }

            if (starsRef.current) {
                // Very slow rotation for stars
                starsRef.current.rotation.y += 0.0001
            }
        }
    })

    return (
        <group scale={[scale, scale, 1]}>
            {/* Stars background */}
            <points ref={starsRef}>
                <bufferGeometry />
                <pointsMaterial size={0.1} vertexColors={true} transparent={true} opacity={0.8} sizeAttenuation={true} />
            </points>

            {/* Energy field */}
            <mesh ref={energyRef} position={[0, 0, 0]}>
                <sphereGeometry args={[1.2, 32, 32]} />
                <meshBasicMaterial color={secondaryColor} transparent={true} opacity={0.1} wireframe={true} />
            </mesh>

            {/* Planet glow */}
            <mesh scale={[1.1, 1.1, 1.1]}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshBasicMaterial color={secondaryColor} transparent={true} opacity={0.2} />
            </mesh>

            {/* Planet */}
            <mesh ref={planetRef}>
                <sphereGeometry args={[0.8, 32, 32]} />
                <meshStandardMaterial
                    color={secondaryColor}
                    transparent={true}
                    opacity={0.9}
                    emissive={secondaryColor}
                    emissiveIntensity={0.4}
                />
            </mesh>

            {/* Rings */}
            <group ref={ringsRef} rotation={[Math.PI / 4, 0, 0]}>
                {[0, 1, 2].map((i) => (
                    <mesh key={i} position={[0, 0, -i * 0.1]}>
                        <torusGeometry args={[1.2 + i * 0.3, 0.05, 16, 100]} />
                        <meshStandardMaterial
                            color={primaryColor}
                            transparent={true}
                            opacity={0.9 - i * 0.2}
                            emissive={primaryColor}
                            emissiveIntensity={0.3}
                        />
                    </mesh>
                ))}
            </group>
        </group>
    )
}

interface VisualizationSelectorProps {
    type: string
    color: string
    accentColor: string
    phase: "inhale" | "hold1" | "exhale" | "hold2"
    progress: number
    isPaused: boolean
    isLightTheme?: boolean
}

function VisualizationSelector({
                                   type,
                                   color,
                                   accentColor,
                                   phase,
                                   progress,
                                   isPaused,
                                   isLightTheme = false,
                               }: VisualizationSelectorProps) {
    // Calculate scale based on breathing phase
    const [scale, setScale] = useState(1)

    useEffect(() => {
        // Calculate scale based on breathing phase
        if (isPaused) return

        if (phase === "inhale") {
            setScale(1 + progress * 0.5) // 1.0 to 1.5
        } else if (phase === "exhale") {
            setScale(1.5 - progress * 0.5) // 1.5 to 1.0
        } else if (phase === "hold1") {
            setScale(1.5) // Stay expanded
        } else {
            setScale(1.0) // Stay contracted
        }
    }, [phase, progress, isPaused])

    switch (type) {
        case "ocean":
            return (
                <OceanRings
                    color={color}
                    accentColor={accentColor}
                    scale={scale}
                    isPaused={isPaused}
                    isLightTheme={isLightTheme}
                />
            )
        case "forest-waves":
            return (
                <ForestWaves
                    color={color}
                    accentColor={accentColor}
                    scale={scale}
                    phase={phase}
                    progress={progress}
                    isPaused={isPaused}
                    isLightTheme={isLightTheme}
                />
            )
        case "sunrise":
            return (
                <SunriseVisualization
                    color={color}
                    accentColor={accentColor}
                    scale={scale}
                    phase={phase}
                    progress={progress}
                    isPaused={isPaused}
                    isLightTheme={isLightTheme}
                />
            )
        case "space":
            return (
                <SpaceVisualization
                    color={color}
                    accentColor={accentColor}
                    scale={scale}
                    phase={phase}
                    progress={progress}
                    isPaused={isPaused}
                    isLightTheme={isLightTheme}
                />
            )
        default:
            return (
                <BreathingSphere
                    phase={phase}
                    progress={progress}
                    color={color}
                    accentColor={accentColor}
                    isPaused={isPaused}
                    isLightTheme={isLightTheme}
                />
            )
    }
}

export default function ThreeBackground({
                                            backgroundType = "default",
                                            color = "#4a9eff",
                                            accentColor = "#ffffff",
                                            breathPhase = "inhale",
                                            breathProgress = 0,
                                            paused = false,
                                            isLightTheme = false,
                                            themeColor,
                                        }: ThreeBackgroundProps) {
    // Get environment preset based on background type
    const getEnvironmentPreset = () => {
        switch (backgroundType) {
            case "forest":
            case "forest-waves":
                return "forest"
            case "space":
            case "vader":
                return "night"
            case "sunrise":
            case "morning":
            case "energize":
                return "sunset"
            case "stars":
            case "evening":
            case "wind-down":
                return "night"
            case "ocean":
            case "focus":
            case "deep-focus":
                return "city"
            default:
                return "sunset"
        }
    }

    return (
        <div className="absolute inset-0 z-0 w-full h-full">
            <Canvas camera={{ position: [0, 0, 5], fov: 45 }} className="w-full h-full">
                {/* Make background transparent to work with both themes */}
                <SceneBackground isLightTheme={isLightTheme} />

                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />

                {/* Main visualization based on type */}
                <VisualizationSelector
                    type={backgroundType}
                    color={color}
                    accentColor={accentColor}
                    phase={breathPhase}
                    progress={breathProgress}
                    isPaused={paused}
                    isLightTheme={isLightTheme}
                />

                {/* Particle field */}
                <ParticleField count={300} color={accentColor} isPaused={paused} isLightTheme={isLightTheme} />

                {/* Environment - reduced intensity for better contrast */}
                <Environment preset={getEnvironmentPreset() as any} background={false} blur={0.7} />

                <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
            </Canvas>
        </div>
    )
}
