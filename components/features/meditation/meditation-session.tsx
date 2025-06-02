/**
 * components/features/meditation/meditation-session.tsx
 * Meditation session component that provides a full-screen
 * video-based meditation experience with audio controls.
 */
"use client"

import { useRef, useEffect, useState } from "react"
import type { MeditationSession } from "@/lib/meditation/meditation-data"
import { useAudioContext } from "@/components/audio-service"

interface MeditationSessionViewProps {
    session: MeditationSession
    volume: number
    isPlaying: boolean
    voiceEnabled: boolean
    audioEnabled: boolean
    timeRemaining: number
    totalDuration: number
}

export default function MeditationSessionView({
                                                  session,
                                                  volume,
                                                  isPlaying,
                                                  voiceEnabled,
                                                  audioEnabled,
                                                  timeRemaining,
                                                  totalDuration,
                                              }: MeditationSessionViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const { playAudio } = useAudioContext()
    const [voiceGuidancePlayed, setVoiceGuidancePlayed] = useState({
        intro: false,
        middle: false,
        end: false,
    })
    const [isVideoReady, setIsVideoReady] = useState(false)

    useEffect(() => {
        if (!videoRef.current) return

        videoRef.current.volume = volume / 100
        videoRef.current.muted = !audioEnabled
    }, [volume, audioEnabled])

    // Fixed video play/pause logic to prevent interruption
    useEffect(() => {
        if (!videoRef.current || !isVideoReady) return

        const video = videoRef.current

        if (isPlaying) {
            // Add a small delay to prevent rapid play/pause calls
            const playTimeout = setTimeout(() => {
                if (video.paused) {
                    video.play().catch((err) => {
                        console.error("Error playing video:", err)
                    })
                }
            }, 100)

            return () => clearTimeout(playTimeout)
        } else {
            video.pause()
        }
    }, [isPlaying, isVideoReady])

    // Handle video loading
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const handleCanPlay = () => {
            setIsVideoReady(true)
        }

        const handleLoadStart = () => {
            setIsVideoReady(false)
        }

        video.addEventListener("canplay", handleCanPlay)
        video.addEventListener("loadstart", handleLoadStart)

        return () => {
            video.removeEventListener("canplay", handleCanPlay)
            video.removeEventListener("loadstart", handleLoadStart)
            if (video) {
                video.pause()
            }
        }
    }, [])

    // Enhanced voice guidance effect with actual audio playback
    useEffect(() => {
        if (!voiceEnabled || !audioEnabled || !session || !playAudio || !session.voiceGuidance) return

        const elapsed = totalDuration - timeRemaining

        // Only play voice guidance if the session has voiceGuidance property
        if (typeof session.voiceGuidance === "object") {
            // Play intro at start (2-7 seconds)
            if (elapsed >= 2 && elapsed <= 7 && !voiceGuidancePlayed.intro && session.voiceGuidance.intro) {
                console.log("Playing intro voice guidance:", session.voiceGuidance.intro)
                playAudio(session.voiceGuidance.intro, false, 0.8)
                    .then(() => console.log("Intro voice guidance played successfully"))
                    .catch((err) => {
                        console.warn("Could not play intro voice guidance:", err)
                    })
                setVoiceGuidancePlayed((prev) => ({ ...prev, intro: true }))
            }

            // Play middle guidance (halfway point)
            const halfwayPoint = totalDuration / 2
            if (
                elapsed >= halfwayPoint - 2 &&
                elapsed <= halfwayPoint + 2 &&
                !voiceGuidancePlayed.middle &&
                session.voiceGuidance.middle
            ) {
                console.log("Playing middle voice guidance:", session.voiceGuidance.middle)
                playAudio(session.voiceGuidance.middle, false, 0.8)
                    .then(() => console.log("Middle voice guidance played successfully"))
                    .catch((err) => {
                        console.warn("Could not play middle voice guidance:", err)
                    })
                setVoiceGuidancePlayed((prev) => ({ ...prev, middle: true }))
            }

            // Play end guidance (last 10 seconds)
            if (timeRemaining <= 10 && timeRemaining > 5 && !voiceGuidancePlayed.end && session.voiceGuidance.end) {
                console.log("Playing end voice guidance:", session.voiceGuidance.end)
                playAudio(session.voiceGuidance.end, false, 0.8)
                    .then(() => console.log("End voice guidance played successfully"))
                    .catch((err) => {
                        console.warn("Could not play end voice guidance:", err)
                    })
                setVoiceGuidancePlayed((prev) => ({ ...prev, end: true }))
            }
        }
    }, [timeRemaining, totalDuration, voiceEnabled, audioEnabled, session, voiceGuidancePlayed, playAudio])

    // Reset voice guidance when session restarts
    useEffect(() => {
        if (timeRemaining === totalDuration) {
            setVoiceGuidancePlayed({
                intro: false,
                middle: false,
                end: false,
            })
        }
    }, [timeRemaining, totalDuration])

    return (
        <div className="meditation-session-view w-full h-full">
            <div className="meditation-video-container w-full h-full">
                <video
                    ref={videoRef}
                    src={session.videoSrc}
                    loop
                    muted={!audioEnabled}
                    playsInline
                    className="meditation-session-video w-full h-full object-cover"
                    onLoadStart={() => setIsVideoReady(false)}
                    onCanPlay={() => setIsVideoReady(true)}
                />
            </div>
        </div>
    )
}
