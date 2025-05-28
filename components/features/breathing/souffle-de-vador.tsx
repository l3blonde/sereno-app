"use client"

import { useEffect, useState, useRef } from "react"

interface SouffleDeVadorProps {
    isActive: boolean
    isPaused: boolean
    currentPhase: "inhale" | "hold" | "exhale"
    isLightTheme?: boolean
}

export default function SouffleDeVador({
                                           isActive,
                                           isPaused,
                                           currentPhase,
                                           isLightTheme = false,
                                       }: SouffleDeVadorProps) {
    const [circleScale, setCircleScale] = useState(1)
    const [circleOpacity, setCircleOpacity] = useState(0.5)
    const [glowIntensity, setGlowIntensity] = useState(0.3)
    const containerRef = useRef<HTMLDivElement>(null)

    // Map the phase to the format expected by the animation
    const mappedPhase = currentPhase

    useEffect(() => {
        if (!isActive || isPaused) {
            setCircleScale(1)
            setCircleOpacity(0.5)
            setGlowIntensity(0.3)
            return
        }

        let targetScale = 1
        let targetOpacity = 0.5
        let targetGlow = 0.3

        switch (mappedPhase) {
            case "inhale":
                targetScale = 2.5
                targetOpacity = 0.8
                targetGlow = 0.7
                break
            case "hold":
                targetScale = 2.5
                targetOpacity = 0.8
                targetGlow = 0.7
                break
            case "exhale":
                targetScale = 1
                targetOpacity = 0.5
                targetGlow = 0.3
                break
        }

        setCircleScale(targetScale)
        setCircleOpacity(targetOpacity)
        setGlowIntensity(targetGlow)
    }, [mappedPhase, isActive, isPaused])

    return (
        <div className="absolute inset-0 flex items-center justify-center" ref={containerRef}>
            {/* Imperial background pattern - keeping this for Star Wars theming */}
            <div
                className="absolute inset-0"
                style={{
                    background: `radial-gradient(circle at center, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100%), 
                       url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23${
                        isLightTheme ? "cccccc" : "333333"
                    }' fillOpacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundBlendMode: "overlay",
                    opacity: 0.7,
                    zIndex: 5,
                }}
            />

            {/* Star field background */}
            <div
                className="absolute inset-0"
                style={{
                    background: "radial-gradient(circle at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.8) 100%)",
                    overflow: "hidden",
                    zIndex: 4,
                }}
            >
                {Array.from({ length: 100 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: `${Math.random() * 3 + 1}px`,
                            height: `${Math.random() * 3 + 1}px`,
                            backgroundColor: "white",
                            borderRadius: "50%",
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.8 + 0.2,
                            animation: `twinkle ${Math.random() * 5 + 3}s infinite alternate`,
                        }}
                    />
                ))}
            </div>

            {/* Red glowing circles that grow from the center */}
            <div
                className="relative w-full h-full flex items-center justify-center pointer-events-none"
                style={{ zIndex: 6 }}
            >
                {/* Multiple concentric circles with different sizes and opacities */}
                {Array.from({ length: 5 }).map((_, i) => (
                    <div
                        key={i}
                        style={{
                            position: "absolute",
                            width: "300px",
                            height: "300px",
                            borderRadius: "50%",
                            background: `radial-gradient(circle, rgba(255,0,0,0) 0%, rgba(255,0,0,${
                                glowIntensity * (1 - i * 0.15)
                            }) 50%, rgba(255,0,0,0) 100%)`,
                            opacity: circleOpacity * (1 - i * 0.15),
                            transform: `scale(${circleScale * (1 + i * 0.2)})`,
                            transition: "all 2s ease-in-out",
                        }}
                    />
                ))}

                {/* Additional pulsing circles for more dynamic effect */}
                <div
                    style={{
                        position: "absolute",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        border: `2px solid rgba(255,0,0,${glowIntensity * 0.8})`,
                        opacity: circleOpacity * 0.9,
                        transform: `scale(${circleScale * 0.9})`,
                        transition: "all 2s ease-in-out",
                        boxShadow: `0 0 30px rgba(255,0,0,${glowIntensity * 0.5})`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        border: `1px solid rgba(255,0,0,${glowIntensity * 0.6})`,
                        opacity: circleOpacity * 0.7,
                        transform: `scale(${circleScale * 1.1})`,
                        transition: "all 2s ease-in-out",
                        boxShadow: `0 0 20px rgba(255,0,0,${glowIntensity * 0.4})`,
                    }}
                />

                <div
                    style={{
                        position: "absolute",
                        width: "300px",
                        height: "300px",
                        borderRadius: "50%",
                        border: `1px solid rgba(255,0,0,${glowIntensity * 0.4})`,
                        opacity: circleOpacity * 0.5,
                        transform: `scale(${circleScale * 1.3})`,
                        transition: "all 2s ease-in-out",
                        boxShadow: `0 0 15px rgba(255,0,0,${glowIntensity * 0.3})`,
                    }}
                />
            </div>

            {/* Subtle Imperial logo in the background - keeping minimal Star Wars theming */}
            <div
                style={{
                    position: "absolute",
                    width: "200px",
                    height: "200px",
                    opacity: 0.1,
                    zIndex: 5,
                }}
            >
                <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#ff0000" strokeWidth="1" />
                    <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="#ff0000" strokeWidth="1" />
                    <circle cx="50" cy="50" r="10" fill="#ff0000" fillOpacity="0.2" />
                </svg>
            </div>

            {/* Phase text - positioned at the bottom of the screen */}
            {isActive && !isPaused && (
                <div
                    className="absolute bottom-[5%] left-1/2 transform -translate-x-1/2 text-red-600 text-3xl font-bold text-center"
                    style={{
                        textShadow: "0 0 10px rgba(255,0,0,0.8)",
                        zIndex: 7,
                        fontFamily: "'Barlow Condensed', sans-serif",
                        letterSpacing: "2px",
                    }}
                >
                    {mappedPhase === "inhale" && "INHALE"}
                    {mappedPhase === "hold" && "HOLD"}
                    {mappedPhase === "exhale" && "EXHALE"}
                </div>
            )}

            <style jsx>{`
        @keyframes twinkle {
          0% {
            opacity: 0.2;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
        </div>
    )
}
