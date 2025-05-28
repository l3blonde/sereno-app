"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useDrivingMode } from "@/hooks/use-driving-mode"

type DrivingModeContextType = {
    isDriving: boolean
    velocity: number
    shouldRestrictInteraction: (interactionType: "complex" | "basic" | "essential") => boolean
    drivingModeEnabled: boolean
    toggleDrivingMode: () => void
    setDrivingModeEnabled: (enabled: boolean) => void
}

const DrivingModeContext = createContext<DrivingModeContextType>({
    isDriving: false,
    velocity: 0,
    shouldRestrictInteraction: () => false,
    drivingModeEnabled: false,
    toggleDrivingMode: () => {},
    setDrivingModeEnabled: () => {},
})

export function DrivingModeProvider({ children }: { children: React.ReactNode }) {
    const { isDriving, velocity, shouldRestrictInteraction } = useDrivingMode()
    const [drivingModeEnabled, setDrivingModeEnabled] = useState(false)

    // Auto-enable driving mode when vehicle is in motion
    useEffect(() => {
        if (isDriving && !drivingModeEnabled) {
            setDrivingModeEnabled(true)
        }
    }, [isDriving, drivingModeEnabled])

    const toggleDrivingMode = () => {
        setDrivingModeEnabled((prev) => !prev)
    }

    // Add driving-mode class to body when enabled
    useEffect(() => {
        if (drivingModeEnabled) {
            document.body.classList.add("driving-mode")
        } else {
            document.body.classList.remove("driving-mode")
        }

        return () => {
            document.body.classList.remove("driving-mode")
        }
    }, [drivingModeEnabled])

    return (
        <DrivingModeContext.Provider
            value={{
                isDriving,
                velocity,
                shouldRestrictInteraction,
                drivingModeEnabled,
                toggleDrivingMode,
                setDrivingModeEnabled,
            }}
        >
            {children}
        </DrivingModeContext.Provider>
    )
}

export function useDrivingModeContext() {
    return useContext(DrivingModeContext)
}
