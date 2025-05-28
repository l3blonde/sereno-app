/**
 * components/features/meditation/video-preview.tsx
 * Video preview component for meditation sessions that displays
 * a preview of the meditation video with playback controls.
 */
"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, Volume2, VolumeX } from "lucide-react"

interface VideoPreviewProps {
    videoSrc: string
    title: string
    isLightTheme?: boolean
}

export default function VideoPreview({ videoSrc, title, isLightTheme = false }: VideoPreviewProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(true)
    const [isLoaded, setIsLoaded] = useState(false)
    const [isError, setIsError] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    const togglePlayback = () => {
        if (!videoRef.current || isError) return

        if (isPlaying) {
            videoRef.current.pause()
        } else {
            videoRef.current.play().catch((err) => {
                console.error("Error playing video:", err)
                setIsError(true)
            })
        }

        setIsPlaying(!isPlaying)
    }

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (!videoRef.current) return

        videoRef.current.muted = !isMuted
        setIsMuted(!isMuted)
    }

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause()
            }
        }
    }, [])

    const handleVideoLoaded = () => {
        setIsLoaded(true)
        setIsError(false)
    }

    const handleVideoError = () => {
        setIsError(true)
        setIsLoaded(false)
        console.error("Error loading video:", videoSrc)
    }

    const getCorrectVideoPath = (path: string) => {
        const pathMap: Record<string, string> = {
            "/videos/forest-meditation.mp4": "/videos/forest-background.mp4",
            "/videos/ocean-meditation.mp4": "/videos/ocean-background.mp4",
            "/videos/mountain-drive-meditation.mp4": "/videos/porsche-mountain-drive.mp4",
            "/videos/charging-meditation.mp4": "/videos/charging-chakras.mp4",
        }

        return pathMap[path] || path
    }

    const correctedVideoSrc = getCorrectVideoPath(videoSrc)

    return (
        <div className="meditation-video-preview w-full h-full flex items-center justify-center">
            <div className="video-container" onClick={togglePlayback}>
                <video
                    ref={videoRef}
                    src={correctedVideoSrc}
                    muted={isMuted}
                    loop
                    playsInline
                    className="meditation-video"
                    onLoadedData={handleVideoLoaded}
                    onError={handleVideoError}
                    autoPlay
                />

                <div className={`video-overlay ${isPlaying ? "playing" : ""}`}>
                    <div className="video-title">{title}</div>

                    <div className="play-button">
                        {isPlaying ? <Pause size={48} strokeWidth={1.5} /> : <Play size={48} strokeWidth={1.5} />}
                    </div>

                    <button className="volume-control" onClick={toggleMute}>
                        {isMuted ? <VolumeX size={24} strokeWidth={1.5} /> : <Volume2 size={24} strokeWidth={1.5} />}
                    </button>
                </div>

                {!isLoaded && !isError && (
                    <div className="video-loading">
                        <div className="loading-spinner"></div>
                        <div className="loading-text">Loading...</div>
                    </div>
                )}

                {isError && (
                    <div className="video-error">
                        <div className="error-message">Video could not be loaded</div>
                    </div>
                )}
            </div>
        </div>
    )
}
