"use client"

import { useRef, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

interface ParticleFieldProps {
    phase: "inhale" | "hold1" | "exhale" | "hold2"
    progress: number
    isPaused: boolean
}

function ParticleField({ phase, progress, isPaused }: ParticleFieldProps) {
    const pointsRef = useRef<THREE.Points>(null)
    const time = useRef(0)

    // Create particles
    const particles = useMemo(() => {
        const count = 2000
        const positions = new Float32Array(count * 3)
        const sizes = new Float32Array(count)
        const colors = new Float32Array(count * 3)

        // Create a base teal color
        const baseColor = new THREE.Color("#64E9E2")

        for (let i = 0; i < count; i++) {
            // Position particles in a sphere
            const radius = Math.random() * 5 + 2
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI * 2

            positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
            positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
            positions[i * 3 + 2] = radius * Math.cos(phi) - 5 // Push back a bit

            // Vary sizes - create a few larger particles
            const size =
                Math.random() < 0.1
                    ? Math.random() * 0.15 + 0.05 // 10% larger particles
                    : Math.random() * 0.05 + 0.01 // 90% smaller particles

            sizes[i] = size

            // Slightly vary the color
            const colorVariation = 0.1
            const color = baseColor.clone()
            color.r += (Math.random() * 2 - 1) * colorVariation
            color.g += (Math.random() * 2 - 1) * colorVariation
            color.b += (Math.random() * 2 - 1) * colorVariation

            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }

        return { positions, sizes, colors }
    }, [])

    // Set up geometry
    useEffect(() => {
        if (!pointsRef.current) return

        const geometry = pointsRef.current.geometry
        geometry.setAttribute("position", new THREE.BufferAttribute(particles.positions, 3))
        geometry.setAttribute("size", new THREE.BufferAttribute(particles.sizes, 1))
        geometry.setAttribute("color", new THREE.BufferAttribute(particles.colors, 3))
    }, [particles])

    // Animate particles
    useFrame((_, delta) => {
        if (isPaused || !pointsRef.current) return

        time.current += delta * 0.2

        const positions = pointsRef.current.geometry.getAttribute("position")
        const sizes = pointsRef.current.geometry.getAttribute("size")

        if (!positions || !sizes) return

        // Calculate breathing effect factor
        let breathFactor = 0
        if (phase === "inhale") {
            breathFactor = progress * 0.2 // Expand during inhale
        } else if (phase === "exhale") {
            breathFactor = -progress * 0.2 // Contract during exhale
        }

        for (let i = 0; i < positions.count; i++) {
            // Get current position
            const i3 = i * 3
            const x = positions.getX(i)
            const y = positions.getY(i)
            const z = positions.getZ(i)

            // Calculate distance from center for directional movement
            const distance = Math.sqrt(x * x + y * y + z * z)
            const direction = {
                x: x / distance,
                y: y / distance,
                z: z / distance,
            }

            // Apply gentle random movement
            const noise = {
                x: Math.sin(time.current + i * 0.1) * 0.003,
                y: Math.cos(time.current + i * 0.1) * 0.003,
                z: Math.sin(time.current * 0.8 + i * 0.1) * 0.003,
            }

            // Apply breathing movement (expand/contract)
            const breath = {
                x: direction.x * breathFactor,
                y: direction.y * breathFactor,
                z: direction.z * breathFactor,
            }

            // Update position
            positions.setXYZ(i, x + noise.x + breath.x, y + noise.y + breath.y, z + noise.z + breath.z)

            // Pulse size slightly based on breathing
            const originalSize = particles.sizes[i]
            let sizeModifier = 1.0

            if (phase === "inhale") {
                sizeModifier = 1.0 + progress * 0.3
            } else if (phase === "exhale") {
                sizeModifier = 1.3 - progress * 0.3
            } else if (phase === "hold1") {
                sizeModifier = 1.3
            } else {
                sizeModifier = 1.0
            }

            sizes.setX(i, originalSize * sizeModifier)
        }

        positions.needsUpdate = true
        sizes.needsUpdate = true
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry />
            <pointsMaterial
                size={0.1}
                vertexColors
                transparent
                opacity={0.8}
                blending={THREE.AdditiveBlending}
                depthWrite={false}
                sizeAttenuation
            />
        </points>
    )
}

function CalmScene({
                       phase,
                       progress,
                       isPaused,
                       isLightTheme,
                   }: {
    phase: string
    progress: number
    isPaused: boolean
    isLightTheme?: boolean
}) {
    const { scene } = useThree()

    // Set background based on theme
    useEffect(() => {
        if (isLightTheme) {
            scene.background = new THREE.Color(0xf5f5f5) // Light gray for light theme
        } else {
            scene.background = new THREE.Color(0x000000) // Black for dark theme
        }
    }, [scene, isLightTheme])

    return (
        <>
            <ambientLight intensity={0.2} />
            <ParticleField phase={phase as "inhale" | "hold1" | "exhale" | "hold2"} progress={progress} isPaused={isPaused} />
        </>
    )
}

export default function CalmParticles({
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
    return (
        <div className={`w-full h-full ${isLightTheme ? "bg-white" : "bg-black"}`}>
            <Canvas>
                <CalmScene phase={phase} progress={progress} isPaused={isPaused} isLightTheme={isLightTheme} />
            </Canvas>
        </div>
    )
}
