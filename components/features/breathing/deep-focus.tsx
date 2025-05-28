"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { MinimalistWaveHorizon } from "./minimalist-wave-horizon"
import { useTheme } from "next-themes"

interface DeepFocusProps {
    inhaleDuration?: number
    holdDuration?: number
    exhaleDuration?: number
    isPaused: boolean
    currentPhase?: "inhale" | "hold" | "exhale"
}

const DeepFocus: React.FC<DeepFocusProps> = ({
                                                 inhaleDuration = 4,
                                                 holdDuration = 4,
                                                 exhaleDuration = 4,
                                                 isPaused,
                                                 currentPhase = "inhale",
                                             }) => {
    const { theme } = useTheme()
    const isLightTheme = theme === "light"
    const [progress, setProgress] = useState(0)
    const [localPhase, setLocalPhase] = useState<"inhale" | "hold" | "exhale">(currentPhase)
    const containerRef = useRef<HTMLDivElement>(null)
    const lastTimeRef = useRef<number>(Date.now())

    // Update local phase when prop changes
    useEffect(() => {
        setLocalPhase(currentPhase)
    }, [currentPhase])

    // Calculate progress based on current phase
    useEffect(() => {
        if (isPaused) return

        const updateProgress = () => {
            const now = Date.now()
            const elapsed = (now - lastTimeRef.current) / 1000
            lastTimeRef.current = now

            setProgress((prev) => {
                const phaseDuration =
                    localPhase === "inhale" ? inhaleDuration : localPhase === "hold" ? holdDuration : exhaleDuration

                let newProgress = prev + elapsed / phaseDuration
                if (newProgress >= 1) {
                    newProgress = 0
                }
                return newProgress
            })
        }

        const animationId = requestAnimationFrame(updateProgress)
        return () => cancelAnimationFrame(animationId)
    }, [isPaused, localPhase, inhaleDuration, holdDuration, exhaleDuration])

    // Map the phase to the format expected by MinimalistWaveHorizon
    const mappedPhase = localPhase === "hold" ? "hold1" : localPhase

    return (
        <div className="w-full h-full absolute inset-0" ref={containerRef}>
            {/* Use a lighter background overlay in light mode */}
            <div className={`absolute inset-0 ${isLightTheme ? "bg-gray-200/50" : "bg-black/20"} z-0`}></div>

            <div className="w-full h-full">
                <MinimalistWaveHorizon
                    phase={mappedPhase}
                    progress={progress}
                    isPaused={isPaused}
                    isLightTheme={isLightTheme}
                />
            </div>
        </div>
    )
}

export default DeepFocus
