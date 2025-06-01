"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { RotateCcw, Smartphone } from "lucide-react"

interface EnhancedOrientationManagerProps {
    children?: React.ReactNode
}

export function OrientationWarning({ children }: EnhancedOrientationManagerProps = {}) {
    const [isPortrait, setIsPortrait] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [showWarning, setShowWarning] = useState(false)
    const [orientationLocked, setOrientationLocked] = useState(false)
    const [canLockOrientation, setCanLockOrientation] = useState(false)

    // Enhanced orientation detection
    const checkOrientation = useCallback(() => {
        const isPortraitMode = window.innerHeight > window.innerWidth
        const isMobileDevice =
            window.innerWidth < 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

        setIsPortrait(isPortraitMode)
        setIsMobile(isMobileDevice)
        setShowWarning(isMobileDevice && isPortraitMode && !orientationLocked)

        // Check if orientation lock is available
        if ("screen" in window && "orientation" in window.screen) {
            setCanLockOrientation(true)
        }
    }, [orientationLocked])

    // Attempt to lock orientation to landscape
    const lockToLandscape = useCallback(async () => {
        if (!canLockOrientation) return false

        try {
            // @ts-ignore - Screen Orientation API
            await screen.orientation.lock("landscape")
            setOrientationLocked(true)
            setShowWarning(false)
            return true
        } catch (error) {
            console.warn("Could not lock orientation:", error)
            return false
        }
    }, [canLockOrientation])

    // Handle user interaction to attempt orientation lock
    const handleLockOrientation = useCallback(async () => {
        const success = await lockToLandscape()
        if (!success) {
            // Fallback: show persistent warning
            alert("Please rotate your device to landscape mode for the best experience.")
        }
    }, [lockToLandscape])

    useEffect(() => {
        checkOrientation()

        // Enhanced event listeners
        const handleResize = () => {
            setTimeout(checkOrientation, 100) // Debounce for better performance
        }

        const handleOrientationChange = () => {
            setTimeout(checkOrientation, 300) // Allow time for orientation change
        }

        window.addEventListener("resize", handleResize)
        window.addEventListener("orientationchange", handleOrientationChange)

        // Listen for fullscreen changes
        document.addEventListener("fullscreenchange", checkOrientation)

        return () => {
            window.removeEventListener("resize", handleResize)
            window.removeEventListener("orientationchange", handleOrientationChange)
            document.removeEventListener("fullscreenchange", checkOrientation)
        }
    }, [checkOrientation])

    // Auto-attempt orientation lock on mobile devices
    useEffect(() => {
        if (isMobile && isPortrait && canLockOrientation && !orientationLocked) {
            // Attempt auto-lock after a short delay
            const timer = setTimeout(() => {
                lockToLandscape().catch(console.warn)
            }, 1000)

            return () => clearTimeout(timer)
        }
    }, [isMobile, isPortrait, canLockOrientation, orientationLocked, lockToLandscape])

    if (!showWarning) {
        return <>{children}</>
    }

    return (
        <>
            <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-6">
                <div className="text-center text-white max-w-md">
                    <div className="mb-6 flex justify-center">
                        <div className="relative">
                            <Smartphone size={64} className="text-white" />
                            <RotateCcw
                                size={32}
                                className="absolute -top-2 -right-2 text-[#A581FD]"
                                style={{ animation: "spin 3s linear infinite" }}
                            />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mb-4">Please Rotate Your Device</h2>
                    <p className="text-lg text-gray-300 mb-4">Sereno is optimized for landscape orientation</p>
                    <p className="text-sm text-gray-400 mb-6">Turn your phone sideways for the best experience</p>

                    {canLockOrientation && (
                        <button
                            onClick={handleLockOrientation}
                            className="bg-[#A581FD] hover:bg-[#9070E8] text-black font-semibold py-3 px-6 rounded-lg transition-colors duration-200 mb-4"
                        >
                            Lock to Landscape
                        </button>
                    )}

                    <div className="text-xs text-gray-500 mt-4">
                        {canLockOrientation
                            ? "Tap the button above to automatically rotate and lock your screen"
                            : "Please manually rotate your device to landscape mode"}
                    </div>
                </div>
            </div>
        </>
    )
}
