"use client"

import { useEffect, useState } from "react"
import { useAudioContext } from "./audio-service"
import { Volume2 } from "lucide-react"

export function AudioInitializer() {
    const { isInitialized } = useAudioContext()
    const [showPrompt, setShowPrompt] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        // Show prompt if audio isn't initialized after a short delay
        const timer = setTimeout(() => {
            if (!isInitialized) {
                setShowPrompt(true)
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [isInitialized])

    // Hide prompt when audio is initialized
    useEffect(() => {
        if (isInitialized) {
            setShowPrompt(false)
        }
    }, [isInitialized])

    if (!showPrompt) return null

    const handleGotIt = () => {
        console.log("Got it clicked - dismissing audio prompt")
        setShowPrompt(false)
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 backdrop-blur-sm z-[1000]">
            <div className="bg-neutral-900 border border-neutral-700 p-10 rounded-2xl max-w-sm mx-4 text-center shadow-2xl">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 bg-neutral-800 rounded-full flex items-center justify-center border border-neutral-600">
                    <Volume2 size={32} className="text-white" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold mb-4 text-white">Enable Audio</h2>

                {/* Description */}
                <p className="mb-8 text-neutral-300 text-sm leading-relaxed">
                    Tap or click anywhere to enable audio features for breathing exercises and meditation sessions.
                </p>

                {/* Got it Button */}
                <button
                    className="w-full px-8 py-4 bg-white hover:bg-neutral-100 text-black font-bold text-lg rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-neutral-300 cursor-pointer"
                    onClick={handleGotIt}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    type="button"
                >
                    <span className={`transition-transform duration-200 ${isHovered ? "scale-110" : ""}`}>Got it</span>
                </button>
            </div>
        </div>
    )
}
