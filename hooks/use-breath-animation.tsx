"use client"

import { useState, useEffect, useRef, useCallback } from "react"

interface BreathAnimationResult {
    progress: number
    cycleProgress: number
    currentPhase: "inhale" | "hold" | "exhale"
}

export function useBreathAnimation(
    isActive: boolean,
    isPaused: boolean,
    initialPhase: "inhale" | "hold" | "exhale" = "inhale",
    onPhaseChange?: (phase: "inhale" | "hold" | "exhale") => void,
): BreathAnimationResult {
    const [progress, setProgress] = useState(0)
    const [cycleProgress, setCycleProgress] = useState(0)
    const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale">(initialPhase)
    const animationRef = useRef<number | null>(null)
    const lastTimeRef = useRef<number>(0)
    const phaseChangeRef = useRef(onPhaseChange)

    // Update the ref when onPhaseChange changes
    useEffect(() => {
        phaseChangeRef.current = onPhaseChange
    }, [onPhaseChange])

    // Fixed 4-4-4 cycle (each phase is exactly 4 seconds)
    const phaseDuration = 4000 // milliseconds

    // Function to advance to the next phase
    const advanceToNextPhase = useCallback(() => {
        setCurrentPhase((prevPhase) => {
            const nextPhase = prevPhase === "inhale" ? "hold" : prevPhase === "hold" ? "exhale" : "inhale"

            // Use setTimeout to avoid state updates during render
            setTimeout(() => {
                if (phaseChangeRef.current) {
                    phaseChangeRef.current(nextPhase)
                }
            }, 0)

            return nextPhase
        })

        // Reset progress for the new phase
        setProgress(0)
    }, [])

    useEffect(() => {
        if (!isActive || isPaused) {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
            return
        }

        lastTimeRef.current = performance.now()

        const animate = (time: number) => {
            const elapsed = time - lastTimeRef.current
            const phaseProgress = Math.min(elapsed / phaseDuration, 1)

            setProgress(phaseProgress)

            // Calculate overall cycle progress (0-1 across all phases)
            const phaseIndex = ["inhale", "hold", "exhale"].indexOf(currentPhase)
            const phaseFraction = 1 / 3 // Each phase is 1/3 of the cycle
            setCycleProgress(phaseIndex * phaseFraction + phaseProgress * phaseFraction)

            // If this phase is complete, advance to the next phase
            if (phaseProgress >= 1) {
                advanceToNextPhase()
                lastTimeRef.current = performance.now()
            }

            if (isActive && !isPaused) {
                animationRef.current = requestAnimationFrame(animate)
            }
        }

        animationRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [isActive, isPaused, currentPhase, advanceToNextPhase, phaseDuration])

    return { progress, cycleProgress, currentPhase }
}
