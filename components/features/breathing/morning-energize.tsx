/**
 * components/features/breathing/morning-energize.tsx
 * Morning Energize breathing visualization component that provides
 * an energizing breathing pattern with bright, vibrant visuals.
 */
"use client"
import { useRef } from "react"
import dynamic from "next/dynamic"
import { useBreathAnimation } from "@/hooks/use-breath-animation"

// Dynamically import our simplified sunrise particles visualization
const SimpleSunriseParticles = dynamic(() => import("@/components/features/breathing/sunrise-particles"), {
    ssr: false,
})

interface MorningEnergizeProps {
    isActive: boolean
    isPaused: boolean
    currentPhase?: "inhale" | "hold" | "exhale"
    isLightTheme?: boolean
}

export default function MorningEnergize({
                                            isActive,
                                            isPaused,
                                            currentPhase = "inhale",
                                            isLightTheme = false,
                                        }: MorningEnergizeProps) {
    const { progress } = useBreathAnimation(isActive, isPaused, currentPhase)
    const containerRef = useRef<HTMLDivElement>(null)

    // Map the phase to the format expected by SimpleSunriseParticles
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
                <SimpleSunriseParticles
                    phase={mappedPhase}
                    progress={progress}
                    isPaused={isPaused}
                    isLightTheme={isLightTheme}
                />
            </div>
        </div>
    )
}
