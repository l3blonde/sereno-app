"use client"

import { useRef, useEffect, useState } from "react"

interface MeditationPreviewProps {
    videoSrc: string
    isLightTheme?: boolean
}

export default function MeditationPreview({ videoSrc, isLightTheme = false }: MeditationPreviewProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [hasError, setHasError] = useState(false)

    useEffect(() => {
        // Load the video but don't play it
        if (videoRef.current) {
            videoRef.current.load()

            // Add event listeners for hover
            const video = videoRef.current

            const handleMouseEnter = () => {
                video.play().catch((err) => console.log("Preview autoplay prevented:", err))
            }

            const handleMouseLeave = () => {
                video.pause()
                video.currentTime = 0
            }

            const handleLoadedData = () => {
                setIsLoading(false)
            }

            const handleError = () => {
                setIsLoading(false)
                setHasError(true)
            }

            // Add the container element as the target for mouse events
            const container = video.parentElement
            if (container) {
                container.addEventListener("mouseenter", handleMouseEnter)
                container.addEventListener("mouseleave", handleMouseLeave)
            }

            // Add video event listeners
            video.addEventListener("loadeddata", handleLoadedData)
            video.addEventListener("error", handleError)

            // Clean up
            return () => {
                if (container) {
                    container.removeEventListener("mouseenter", handleMouseEnter)
                    container.removeEventListener("mouseleave", handleMouseLeave)
                }
                video.removeEventListener("loadeddata", handleLoadedData)
                video.removeEventListener("error", handleError)
            }
        }
    }, [videoSrc])

    return (
        <div className="relative w-full h-full overflow-hidden">
            {/* Loading state */}
            {isLoading && (
                <div
                    className={`absolute inset-0 flex items-center justify-center ${isLightTheme ? "bg-gray-100" : "bg-gray-900"}`}
                >
                    <div className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin border-white"></div>
                </div>
            )}

            {/* Error state */}
            {hasError && (
                <div
                    className={`absolute inset-0 flex items-center justify-center ${isLightTheme ? "bg-gray-100" : "bg-gray-900"}`}
                >
                    <img src="/peaceful-meditation.png" alt="Meditation preview" className="w-full h-full object-cover" />
                </div>
            )}

            {/* Video */}
            <video ref={videoRef} src={videoSrc} className="w-full h-full object-cover" muted loop playsInline />

            {/* Play indicator overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
                    <div className="w-0 h-0 border-y-8 border-y-transparent border-l-12 border-l-white ml-1"></div>
                </div>
            </div>
        </div>
    )
}
