/**
 * components/ui/breathing-timer.tsx
 * Enhanced breathing timer component with phase text display and proper 4-4-4 timing.
 */

"use client"

import { useEffect, useState, useRef } from "react"

interface BreathingTimerProps {
    duration: number
    timeRemaining: number
    isPlaying: boolean
    currentPhase: "inhale" | "hold" | "exhale"
    onPhaseChangeAction: (phase: "inhale" | "hold" | "exhale") => void
    size?: "small" | "medium" | "large"
    themeColor?: string
    isLightTheme?: boolean
}

export function BreathingTimer({
                                   duration,
                                   timeRemaining,
                                   isPlaying,
                                   currentPhase,
                                   onPhaseChangeAction,
                                   size = "medium",
                                   isLightTheme = false,
                               }: BreathingTimerProps) {
    const [phaseProgress, setPhaseProgress] = useState(0)
    const [cycleProgress, setCycleProgress] = useState(0)
    const [internalPhase, setInternalPhase] = useState<"inhale" | "hold" | "exhale">(currentPhase)
    const phaseStartTimeRef = useRef<number>(0)
    const animationFrameRef = useRef<number>(0)

    // Fixed 4-4-4 cycle (each phase is exactly 4 seconds)
    const phaseDuration = 4000 // milliseconds

    // Update the size classes
    const getSizeClass = () => {
        switch (size) {
            case "small":
                return "w-32 h-32"
            case "large":
                return "w-56 h-56"
            case "medium":
            default:
                return "w-44 h-44"
        }
    }

    const calculateProgress = () => {
        return (duration - timeRemaining) / duration
    }

    // Reset phase timing when starting or resuming
    useEffect(() => {
        if (isPlaying) {
            phaseStartTimeRef.current = performance.now()
            setPhaseProgress(0)
            setInternalPhase(currentPhase)
        }
    }, [isPlaying, currentPhase])

    // Main animation loop with proper phase transitions
    useEffect(() => {
        if (!isPlaying) {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
            return
        }

        const animate = () => {
            const now = performance.now()
            const elapsed = now - phaseStartTimeRef.current
            const progress = Math.min(elapsed / phaseDuration, 1)

            setPhaseProgress(progress)

            // Calculate overall cycle progress (0-1 across all phases)
            const phaseIndex = ["inhale", "hold", "exhale"].indexOf(internalPhase)
            const phaseFraction = 1 / 3
            setCycleProgress(phaseIndex * phaseFraction + progress * phaseFraction)

            // Check if phase is complete
            if (progress >= 1) {
                // Move to next phase
                let nextPhase: "inhale" | "hold" | "exhale"
                switch (internalPhase) {
                    case "inhale":
                        nextPhase = "hold"
                        break
                    case "hold":
                        nextPhase = "exhale"
                        break
                    case "exhale":
                        nextPhase = "inhale"
                        break
                }

                console.log(`Phase transition: ${internalPhase} -> ${nextPhase}`)

                setInternalPhase(nextPhase)
                setPhaseProgress(0)
                phaseStartTimeRef.current = now

                // Trigger parent callback for voice guidance
                onPhaseChangeAction(nextPhase)
            }

            if (isPlaying) {
                animationFrameRef.current = requestAnimationFrame(animate)
            }
        }

        animationFrameRef.current = requestAnimationFrame(animate)

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [isPlaying, internalPhase, onPhaseChangeAction, phaseDuration])

    const radius = 45
    const circumference = 2 * Math.PI * radius
    const sessionProgress = calculateProgress()
    const sessionStrokeDashoffset = circumference * (1 - sessionProgress)

    const phaseRadius = 38
    const phaseCircumference = 2 * Math.PI * phaseRadius
    const phaseStrokeDashoffset = phaseCircumference * (1 - phaseProgress)

    // Calculate dot position based on cycle progress
    const angle = cycleProgress * 2 * Math.PI - Math.PI / 2
    const dotX = 50 + radius * Math.cos(angle)
    const dotY = 50 + radius * Math.sin(angle)

    // Monochromic colors
    const getMonochromeColor = () => {
        return isLightTheme ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)"
    }

    const getPhaseColor = () => {
        return isLightTheme ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.6)"
    }

    return (
        <div className={`relative mx-auto ${getSizeClass()} shadow-lg`}>
            <div className="absolute inset-0 rounded-full bg-black/60 backdrop-blur-md border border-white/20"></div>

            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 relative z-10">
                {/* Base circles */}
                <circle cx="50" cy="50" r={radius} fill="transparent" stroke="#444444" strokeWidth="4" />

                {/* Subtle tick marks */}
                <line x1="50" y1="5" x2="50" y2="15" stroke="#666666" strokeWidth="2" />
                <line x1="95" y1="50" x2="85" y2="50" stroke="#666666" strokeWidth="2" />
                <line x1="50" y1="95" x2="50" y2="85" stroke="#666666" strokeWidth="2" />
                <line x1="5" y1="50" x2="15" y2="50" stroke="#666666" strokeWidth="2" />

                {/* Session progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke={getMonochromeColor()}
                    strokeWidth="4"
                    strokeDasharray={circumference}
                    strokeDashoffset={sessionStrokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        filter: `drop-shadow(0 0 6px ${getMonochromeColor()})`,
                    }}
                />

                {/* Phase progress circle */}
                <circle
                    cx="50"
                    cy="50"
                    r={phaseRadius}
                    fill="transparent"
                    stroke={getPhaseColor()}
                    strokeWidth="3"
                    strokeDasharray={phaseCircumference}
                    strokeDashoffset={phaseStrokeDashoffset}
                    strokeLinecap="round"
                    style={{
                        filter: `drop-shadow(0 0 4px ${getPhaseColor()})`,
                        transition: "stroke 0.3s ease-in-out",
                    }}
                />

                {/* Phase indicator dot - moves around the circle every 12 seconds (4+4+4) */}
                <circle
                    cx={dotX}
                    cy={dotY}
                    r="4"
                    fill={getPhaseColor()}
                    style={{
                        filter: `drop-shadow(0 0 8px ${getPhaseColor()})`,
                        transition: "fill 0.3s ease-in-out",
                    }}
                />
            </svg>

            {/* Phase text display - shows current phase */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight drop-shadow-md uppercase">
                    {internalPhase}
                </div>
            </div>
        </div>
    )
}
