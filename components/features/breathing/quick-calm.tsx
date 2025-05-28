/**
 * components/features/breathing/quick-calm.tsx
 * Quick Calm breathing visualization component that provides
 * a simple, calming visual feedback for breathing exercises.
 */
"use client"
import { useRef } from "react"
import dynamic from "next/dynamic"
import { useBreathAnimation } from "@/hooks/use-breath-animation"

// Dynamically import our Calm Particles visualization
const CalmParticles = dynamic(() => import("@/components/features/breathing/calm-particles"), {
    ssr: false,
})

interface QuickCalmProps {
    isActive: boolean
    isPaused: boolean
    currentPhase?: "inhale" | "hold" | "exhale"
    isLightTheme?: boolean
}

export default function QuickCalm({
                                      isActive,
                                      isPaused,
                                      currentPhase = "inhale",
                                      isLightTheme = false,
                                  }: QuickCalmProps) {
    const { progress } = useBreathAnimation(isActive, isPaused, currentPhase)
    const containerRef = useRef<HTMLDivElement>(null)

    // Map the phase to the format expected by CalmParticles
    const mappedPhase = currentPhase === "hold" ? "hold1" : currentPhase

    return (
        <div
            className="w-full h-full absolute inset-0"
            ref={containerRef}
            style={{
                // Add a darker background in light mode to improve contrast
                background: isLightTheme ? "linear-gradient(to bottom, #e0e0e0, #f0f0f0)" : "black",
            }}
        >
            <div className="w-full h-full">
                <CalmParticles phase={mappedPhase} progress={progress} isPaused={isPaused} isLightTheme={isLightTheme} />
            </div>
        </div>
    )
}
