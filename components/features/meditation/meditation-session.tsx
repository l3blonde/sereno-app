/**
 * components/features/meditation/meditation-session.tsx
 * Meditation session component that provides a full-screen
 * video-based meditation experience with audio controls.
 */
"use client"

import { useRef, useEffect, useState } from "react"
import type { MeditationSession } from "@/lib/meditation/meditation-data"

interface MeditationSessionViewProps {
    session: MeditationSession
    onExitAction: () => void
    isLightTheme?: boolean
    volume: number
    isPlaying: boolean
    onPlayPauseAction: () => void
    onRestartAction: () => void
    onVolumeChangeAction: (volume: number) => void
    voiceEnabled: boolean
    onVoiceToggleAction: () => void
    audioEnabled: boolean
    onAudioToggleAction: () => void
    timeRemaining: number
    totalDuration: number
}

export default function MeditationSessionView({
                                                  session,
                                                  onExitAction,
                                                  isLightTheme = false,
                                                  volume,
                                                  isPlaying,
                                                  onPlayPauseAction,
                                                  onRestartAction,
                                                  onVolumeChangeAction,
                                                  voiceEnabled,
                                                  onVoiceToggleAction,
                                                  audioEnabled,
                                                  onAudioToggleAction,
                                                  timeRemaining,
                                                  totalDuration,
                                              }: MeditationSessionViewProps) {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [voiceGuidancePlayed, setVoiceGuidancePlayed] = useState({
        intro: false,
        middle: false,
        end: false,
    })

    useEffect(() => {
        if (!videoRef.current) return

        videoRef.current.volume = volume / 100
        videoRef.current.muted = !audioEnabled
    }, [volume, audioEnabled])

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

    useEffect(() => {
        return () => {
            if (videoRef.current) {
                videoRef.current.pause()
            }
        }
    }, [])

    // Voice guidance effect - with proper error checking
    useEffect(() => {
        if (!voiceEnabled || !audioEnabled || !session) return

        const elapsed = totalDuration - timeRemaining

        // Only play voice guidance if the session has voiceGuidance property
        if (session.voiceGuidance) {
            // Play intro at start (first 5 seconds)
            if (elapsed >= 2 && elapsed <= 7 && !voiceGuidancePlayed.intro && session.voiceGuidance.intro) {
                // Note: playAudio function would need to be passed as prop or imported
                console.log("Playing intro voice guidance:", session.voiceGuidance.intro)
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
                setVoiceGuidancePlayed((prev) => ({ ...prev, middle: true }))
            }

            // Play end guidance (last 10 seconds)
            if (timeRemaining <= 10 && timeRemaining > 5 && !voiceGuidancePlayed.end && session.voiceGuidance.end) {
                console.log("Playing end voice guidance:", session.voiceGuidance.end)
                setVoiceGuidancePlayed((prev) => ({ ...prev, end: true }))
            }
        }
    }, [timeRemaining, totalDuration, voiceEnabled, audioEnabled, session, voiceGuidancePlayed])

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
                    autoPlay
                    loop
                    muted={!audioEnabled}
                    playsInline
                    className="meditation-session-video w-full h-full object-cover"
                />
            </div>
        </div>
    )
}
