"use client"

import { useState, useEffect } from "react"
import { RotateCcw } from "lucide-react"

export function OrientationWarning() {
    const [isPortrait, setIsPortrait] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkOrientation = () => {
            const isPortraitMode = window.innerHeight > window.innerWidth
            const isMobileDevice = window.innerWidth < 768
            setIsPortrait(isPortraitMode)
            setIsMobile(isMobileDevice)
        }

        checkOrientation()
        window.addEventListener("resize", checkOrientation)
        window.addEventListener("orientationchange", checkOrientation)

        return () => {
            window.removeEventListener("resize", checkOrientation)
            window.removeEventListener("orientationchange", checkOrientation)
        }
    }, [])

    if (!isMobile || !isPortrait) {
        return null
    }

    return (
        <div className="fixed inset-0 bg-black z-[9999] flex items-center justify-center p-6">
            <div className="text-center text-white">
                <RotateCcw size={64} className="mx-auto mb-6 text-white animate-pulse" />
                <h2 className="text-2xl font-bold mb-4">Please Rotate Your Device</h2>
                <p className="text-lg text-gray-300 mb-2">Sereno is optimized for landscape orientation</p>
                <p className="text-sm text-gray-400">Turn your phone sideways for the best experience</p>
            </div>
        </div>
    )
}
