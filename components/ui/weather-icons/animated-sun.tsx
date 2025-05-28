"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Canvas } from "@react-three/fiber"
import * as THREE from "three"

function Sun3D() {
    const sunRef = useRef<THREE.Group>(null)
    const raysRef = useRef<THREE.Group>(null)

    useFrame((state) => {
        if (sunRef.current) {
            sunRef.current.rotation.y = state.clock.elapsedTime * 0.5
        }
        if (raysRef.current) {
            raysRef.current.rotation.z = state.clock.elapsedTime * 0.3
        }
    })

    return (
        <>
            {/* Ambient light */}
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />

            {/* Sun group */}
            <group ref={sunRef}>
                {/* Main sun sphere */}
                <mesh>
                    <sphereGeometry args={[1.2, 32, 32]} />
                    <meshStandardMaterial
                        color="#ffeb3b"
                        emissive="#ff9800"
                        emissiveIntensity={0.3}
                        roughness={0.1}
                        metalness={0.1}
                    />
                </mesh>

                {/* Inner glow */}
                <mesh>
                    <sphereGeometry args={[1.4, 32, 32]} />
                    <meshBasicMaterial color="#ffeb3b" transparent opacity={0.2} side={THREE.BackSide} />
                </mesh>
            </group>

            {/* Sun rays */}
            <group ref={raysRef}>
                {Array.from({ length: 8 }).map((_, i) => {
                    const angle = (i / 8) * Math.PI * 2
                    const x = Math.cos(angle) * 2.5
                    const y = Math.sin(angle) * 2.5

                    return (
                        <mesh key={i} position={[x, y, 0]} rotation={[0, 0, angle]}>
                            <boxGeometry args={[0.8, 0.15, 0.1]} />
                            <meshStandardMaterial color="#ffeb3b" emissive="#ff9800" emissiveIntensity={0.4} />
                        </mesh>
                    )
                })}
            </group>
        </>
    )
}

interface AnimatedSunProps {
    size?: number
}

export function AnimatedSun({ size = 48 }: AnimatedSunProps) {
    return (
        <div style={{ width: size, height: size }}>
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
                <Sun3D />
            </Canvas>
        </div>
    )
}
