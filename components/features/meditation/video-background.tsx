"use client"

import { useRef, useEffect } from "react"

interface VideoBackgroundProps {
    src: string
    isPlaying: boolean
    volume?: number
}

export default function VideoBackground({ src, isPlaying, volume = 0.5 }: VideoBackgroundProps) {
    const videoRef = useRef<HTMLVideoElement>(null)

    // Handle play/pause
    useEffect(() => {
        if (!videoRef.current) return

        if (isPlaying) {
            videoRef.current.play().catch((err) => {
                console.error("Error playing video:", err)
            })
        } else {
            videoRef.current.pause()
        }
    }, [isPlaying])

    // Handle volume change
    useEffect(() => {
        if (!videoRef.current) return
        videoRef.current.volume = volume
    }, [volume])

    return (
        <div className="relative w-full h-full overflow-hidden">
            <video ref={videoRef} src={src} className="absolute inset-0 w-full h-full object-cover" loop muted playsInline />
        </div>
    )
}
