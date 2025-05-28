"use client"

import { useState, useEffect, useCallback } from "react"

export function useDrivingMode() {
    const [isDriving, setIsDriving] = useState(false)
    const [lastVelocity, setLastVelocity] = useState(0)

    // Mock function to detect if vehicle is in motion
    // In a real implementation, this would connect to the vehicle's API
    const detectDrivingState = useCallback(() => {
        // For demo purposes, we'll use a simulated velocity
        // In a real app, this would come from the vehicle's data
        const mockVelocity = Math.random() > 0.7 ? Math.random() * 60 : lastVelocity
        setLastVelocity(mockVelocity)

        // Consider driving if velocity is above 5 km/h
        setIsDriving(mockVelocity > 5)

        return mockVelocity > 5
    }, [lastVelocity])

    // Periodically check driving state
    useEffect(() => {
        // Initial check
        detectDrivingState()

        // Set up periodic checking
        const interval = setInterval(() => {
            detectDrivingState()
        }, 10000) // Check every 10 seconds

        return () => clearInterval(interval)
    }, [detectDrivingState])

    // Restrict certain interactions while driving
    const shouldRestrictInteraction = useCallback(
        (interactionType: "complex" | "basic" | "essential") => {
            if (!isDriving) return false

            switch (interactionType) {
                case "complex":
                    // Always restrict complex interactions while driving
                    return true
                case "basic":
                    // Restrict basic interactions only at higher speeds
                    return lastVelocity > 20
                case "essential":
                    // Never restrict essential interactions
                    return false
                default:
                    return false
            }
        },
        [isDriving, lastVelocity],
    )

    return {
        isDriving,
        velocity: lastVelocity,
        shouldRestrictInteraction,
        detectDrivingState,
    }
}
