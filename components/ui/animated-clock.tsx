/**
 * @fileoverview Animated Clock Component
 * @description Visually appealing analogue clock with smooth animations and digital time display.
 * @functionality Shows current time with animated hands and optional glow effects.
 * @styling Uses SVG with inline styles for animations and transitions; no external CSS dependencies.
 * @layout Circular clock face with hour/minute/second hands and digital time display below.
 */

"use client"

import { useState, useEffect } from "react"

interface AnimatedClockProps {
    size?: number
    primaryColor?: string
    glowEffect?: boolean
    enhancedGlanceability?: boolean
}


export function AnimatedClock({
                                  size = 320,
                                  primaryColor = "#ff6b35",
                                  glowEffect = false,
                                  enhancedGlanceability = false,
                              }: AnimatedClockProps) {
    const [time, setTime] = useState<Date | null>(null)
    const [mounted, setMounted] = useState(false)

    // Prevent hydration mismatch by only rendering after mount
    useEffect(() => {
        setMounted(true)
        setTime(new Date())

        const timer = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(timer)
    }, [])

    // Don't render anything until mounted (prevents hydration mismatch)
    if (!mounted || !time) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
                <div className="w-12 h-12 border-3 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        )
    }

    const centerX = size / 2
    const centerY = size / 2
    const clockRadius = enhancedGlanceability ? size * 0.45 : size * 0.4

    // Get current time values
    const hours = time.getHours() % 12
    const minutes = time.getMinutes()
    const seconds = time.getSeconds()

    // Calculate angles (fixed calculations to prevent floating point differences)
    const secondAngle = (seconds * 6 - 90) * (Math.PI / 180)
    const minuteAngle = (minutes * 6 + seconds * 0.1 - 90) * (Math.PI / 180)
    const hourAngle = (hours * 30 + minutes * 0.5 - 90) * (Math.PI / 180)

    // Responsive stroke widths
    const strokeWidth = enhancedGlanceability
        ? {
            hour: 7,
            minute: 5,
            second: 2,
            markers: 4,
            minuteMarkers: 2,
        }
        : {
            hour: 5,
            minute: 3,
            second: 1.5,
            markers: 3,
            minuteMarkers: 1,
        }

    // Glow effects
    const glowFilter = glowEffect
        ? {
            filter: "drop-shadow(0 0 6px rgba(255, 255, 255, 0.6))",
        }
        : {}

    const handGlowFilter = glowEffect
        ? {
            filter: `drop-shadow(0 0 4px ${primaryColor}) drop-shadow(0 0 8px rgba(255, 255, 255, 0.4))`,
        }
        : {}

    // Generate markers for hours and minutes
    const createMarkers = () => {
        const markers = []

        // Hour markers
        for (let i = 0; i < 12; i++) {
            const angle = (i * 30 - 90) * (Math.PI / 180)
            const innerRadius = clockRadius * (enhancedGlanceability ? 0.8 : 0.85)
            const outerRadius = clockRadius * 0.95

            // Round coordinates to prevent hydration mismatches
            const x1 = Math.round((centerX + Math.cos(angle) * innerRadius) * 1000) / 1000
            const y1 = Math.round((centerY + Math.sin(angle) * innerRadius) * 1000) / 1000
            const x2 = Math.round((centerX + Math.cos(angle) * outerRadius) * 1000) / 1000
            const y2 = Math.round((centerY + Math.sin(angle) * outerRadius) * 1000) / 1000

            markers.push(
                <line
                    key={`hour-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="white"
                    strokeWidth={strokeWidth.markers}
                    strokeLinecap="round"
                    style={glowFilter}
                />,
            )
        }

        // Minute markers
        for (let i = 0; i < 60; i++) {
            if (i % 5 === 0) continue // Skip hour positions

            const angle = (i * 6 - 90) * (Math.PI / 180)
            const innerRadius = clockRadius * (enhancedGlanceability ? 0.88 : 0.9)
            const outerRadius = clockRadius * 0.95

            // Round coordinates to prevent hydration mismatches
            const x1 = Math.round((centerX + Math.cos(angle) * innerRadius) * 1000) / 1000
            const y1 = Math.round((centerY + Math.sin(angle) * innerRadius) * 1000) / 1000
            const x2 = Math.round((centerX + Math.cos(angle) * outerRadius) * 1000) / 1000
            const y2 = Math.round((centerY + Math.sin(angle) * outerRadius) * 1000) / 1000

            markers.push(
                <line
                    key={`minute-${i}`}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="white"
                    strokeWidth={strokeWidth.minuteMarkers}
                    strokeLinecap="round"
                    opacity={enhancedGlanceability ? "0.8" : "0.6"}
                    style={glowFilter}
                />,
            )
        }

        return markers
    }

    // Calculate hand positions with rounding
    const hourHandLength = clockRadius * (enhancedGlanceability ? 0.55 : 0.5)
    const minuteHandLength = clockRadius * (enhancedGlanceability ? 0.75 : 0.7)
    const secondHandLength = clockRadius * (enhancedGlanceability ? 0.85 : 0.8)

    const hourX = Math.round((centerX + Math.cos(hourAngle) * hourHandLength) * 1000) / 1000
    const hourY = Math.round((centerY + Math.sin(hourAngle) * hourHandLength) * 1000) / 1000
    const minuteX = Math.round((centerX + Math.cos(minuteAngle) * minuteHandLength) * 1000) / 1000
    const minuteY = Math.round((centerY + Math.sin(minuteAngle) * minuteHandLength) * 1000) / 1000
    const secondX = Math.round((centerX + Math.cos(secondAngle) * secondHandLength) * 1000) / 1000
    const secondY = Math.round((centerY + Math.sin(secondAngle) * secondHandLength) * 1000) / 1000

    return (
        <div className="flex flex-col items-center justify-center">
            <svg width={size} height={size} className={glowEffect ? "drop-shadow-lg" : ""}>
                {/* Clock face with responsive styling */}
                <circle
                    cx={centerX}
                    cy={centerY}
                    r={clockRadius}
                    fill="none"
                    stroke="white"
                    strokeWidth={enhancedGlanceability ? 4 : 2}
                    opacity={enhancedGlanceability ? "0.5" : "0.3"}
                    style={glowFilter}
                />

                {/* Hour and minute markers */}
                {createMarkers()}

                {/* Clock hands */}
                <line
                    x1={centerX}
                    y1={centerY}
                    x2={hourX}
                    y2={hourY}
                    stroke="white"
                    strokeWidth={strokeWidth.hour}
                    strokeLinecap="round"
                    style={{
                        transition: "all 0.5s ease-in-out",
                        ...glowFilter,
                    }}
                />

                <line
                    x1={centerX}
                    y1={centerY}
                    x2={minuteX}
                    y2={minuteY}
                    stroke={primaryColor}
                    strokeWidth={strokeWidth.minute}
                    strokeLinecap="round"
                    style={{
                        transition: "all 0.5s ease-in-out",
                        ...handGlowFilter,
                    }}
                />

                <line
                    x1={centerX}
                    y1={centerY}
                    x2={secondX}
                    y2={secondY}
                    stroke={primaryColor}
                    strokeWidth={strokeWidth.second}
                    strokeLinecap="round"
                    style={{
                        transition: "all 0.1s ease-in-out",
                        ...handGlowFilter,
                    }}
                />

                {/* Center dot with responsive sizing */}
                {glowEffect ? (
                    <>
                        <circle cx={centerX} cy={centerY} r="8" fill="#111" />
                        <circle cx={centerX} cy={centerY} r="6" fill={primaryColor} style={handGlowFilter} />
                        <circle cx={centerX - 1} cy={centerY - 1} r="2" fill="white" opacity="0.7" />
                    </>
                ) : (
                    <circle cx={centerX} cy={centerY} r="6" fill="white" />
                )}
            </svg>

            {/* Digital time display - responsive sizing */}
            <div
                className={`mt-4 lg:mt-6 text-white ${enhancedGlanceability ? "text-3xl lg:text-4xl" : "text-xl lg:text-2xl"} font-bold tracking-wider ${glowEffect ? "text-shadow-medium" : ""}`}
            >
                {time.toLocaleTimeString("en-US", {
                    hour12: false,
                    hour: "2-digit",
                    minute: "2-digit",
                })}
            </div>
        </div>
    )
}
