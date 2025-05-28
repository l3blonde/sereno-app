/**
 * components/ui/breathing-timer.tsx
 * Simplified breathing timer component with monochromic design.
 * Provides visual feedback for breathing exercises without text indicators.
 */
"use client"

import { useEffect, useState, useRef, useCallback } from "react"

interface BreathingTimerProps {
    duration: number
    timeRemaining: number
    isPlaying: boolean
    currentPhase: "inhale" | "hold" | "exhale"
    onPhaseChange: (phase: "inhale" | "hold" | "exhale") => void
    size?: "small" | "medium" | "large"
    themeColor?: string
    isLightTheme?: boolean
}

export function BreathingTimer({
                                   duration,
                                   timeRemaining,
                                   isPlaying,
                                   currentPhase,
                                   onPhaseChange,
                                   size = "medium",
                                   isLightTheme = false,
                               }: BreathingTimerProps) {
    const [phaseProgress, setPhaseProgress] = useState(0)
    const [cycleProgress, setCycleProgress] = useState(0)
    const lastUpdateTimeRef = useRef<number>(Date.now())
    const nextPhaseRef = useRef<"inhale" | "hold" | "exhale" | null>(null)

    // Fixed 4-4-4 cycle (each phase is exactly 4 seconds)
    const phaseDuration = 4 // seconds
    const totalCycleTime = 12 // seconds (4+4+4)

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

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    const calculateProgress = () => {
        return (duration - timeRemaining) / duration
    }

    const updatePhaseRef = useCallback((newPhase: "inhale" | "hold" | "exhale") => {
        nextPhaseRef.current = newPhase
    }, [])

    // Trigger phase change when nextPhaseRef is updated
    useEffect(() => {
        if (nextPhaseRef.current) {
            const newPhase = nextPhaseRef.current
            setTimeout(() => {
                onPhaseChange(newPhase)
            }, 0)
            nextPhaseRef.current = null
        }
    }, [onPhaseChange])

    // Update phase progress and cycle progress
    useEffect(() => {
        if (!isPlaying) return

        const updatePhase = () => {
            const now = Date.now()
            const elapsed = (now - lastUpdateTimeRef.current) / 1000
            lastUpdateTimeRef.current = now

            setPhaseProgress((prev) => {
                let newProgress = prev + elapsed / phaseDuration

                if (newProgress >= 1) {
                    newProgress = 0

                    // Cycle through phases: inhale -> hold -> exhale -> inhale
                    switch (currentPhase) {
                        case "inhale":
                            updatePhaseRef("hold")
                            break
                        case "hold":
                            updatePhaseRef("exhale")
                            break
                        case "exhale":
                            updatePhaseRef("inhale")
                            break
                    }
                }

                return newProgress
            })

            // Calculate overall cycle progress (0-1 across all phases)
            const phaseIndex = ["inhale", "hold", "exhale"].indexOf(currentPhase)
            const phaseFraction = 1 / 3 // Each phase is 1/3 of the cycle
            setCycleProgress(phaseIndex * phaseFraction + phaseProgress * phaseFraction)
        }

        lastUpdateTimeRef.current = Date.now()
        const intervalId = setInterval(updatePhase, 50)

        return () => {
            clearInterval(intervalId)
        }
    }, [isPlaying, phaseDuration, updatePhaseRef, currentPhase, phaseProgress, onPhaseChange])

    const radius = 45
    const circumference = 2 * Math.PI * radius
    const sessionProgress = calculateProgress()
    const sessionStrokeDashoffset = circumference * (1 - sessionProgress)

    const phaseRadius = 38
    const phaseCircumference = 2 * Math.PI * phaseRadius
    const phaseStrokeDashoffset = phaseCircumference * (1 - phaseProgress)

    const angle = cycleProgress * 2 * Math.PI - Math.PI / 2
    const dotX = 50 + radius * Math.cos(angle)
    const dotY = 50 + radius * Math.sin(angle)

    // Monochromic colors - grey/white only
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

                {/* Phase indicator dot */}
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

            {/* Time display only */}
            <div className="absolute inset-0 flex items-center justify-center z-20">
                <div className="text-3xl font-mono text-white font-bold tracking-tight drop-shadow-md">
                    {formatTime(timeRemaining)}
                </div>
            </div>
        </div>
    )
}
