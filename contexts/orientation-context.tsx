"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

type OrientationContextType = {
    isLandscape: boolean
    isPortrait: boolean
    width: number
    height: number
}

const OrientationContext = createContext<OrientationContextType>({
    isLandscape: true,
    isPortrait: false,
    width: 0,
    height: 0,
})

export function OrientationProvider({ children }: { children: ReactNode }) {
    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
        isLandscape: true,
        isPortrait: false,
    })

    useEffect(() => {
        // Only run on client
        if (typeof window === "undefined") return

        const updateDimensions = () => {
            const width = window.innerWidth
            const height = window.innerHeight
            const isLandscape = width > height
            const isPortrait = !isLandscape

            setDimensions({
                width,
                height,
                isLandscape,
                isPortrait,
            })
        }

        // Try to lock screen to landscape where supported
        const lockOrientation = async () => {
            try {
                // Fix: Use proper type checking for screen.orientation
                if (screen.orientation && typeof screen.orientation.lock === "function") {
                    await screen.orientation.lock("landscape").catch((err) => {
                        console.log("Could not lock screen orientation:", err)
                    })
                }
            } catch (error) {
                console.log("Screen orientation lock not supported or permission denied")
            }
        }

        // Initial update
        updateDimensions()

        // Fix: Handle the promise properly
        void lockOrientation() // Use void to explicitly ignore the promise

        // Add event listeners
        window.addEventListener("resize", updateDimensions)
        window.addEventListener("orientationchange", updateDimensions)

        // Cleanup
        return () => {
            window.removeEventListener("resize", updateDimensions)
            window.removeEventListener("orientationchange", updateDimensions)
        }
    }, [])

    return <OrientationContext.Provider value={dimensions}>{children}</OrientationContext.Provider>
}

// Fix: Export the hook to be used elsewhere
export const useOrientation = () => useContext(OrientationContext)
