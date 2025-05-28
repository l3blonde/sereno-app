/**
 * @fileoverview Audio Player Component
 * @description Compact audio player for controlling background music playback.
 * @functionality Provides play/pause controls and track information for ambient audio.
 * @styling Uses only Tailwind CSS v4 for all styling - monochromatic grey/white design.
 * @layout Horizontal bar with lotus icon, track info, and playback controls.
 */

"use client"

import { useState } from "react"
import { Play, Pause, SkipForward } from "lucide-react"
import { LotusIcon } from "@/components/icons/lotus-icon"
import { useAudioContext } from "@/components/audio-service"

interface Track {
    id: string
    title: string
    artist: string
    duration: string
    audioSrc: string
}

const SERENO_PLAYLIST: Track[] = [
    {
        id: "breathing-background",
        title: "Breathing Harmony",
        artist: "Sereno Ambient",
        duration: "∞",
        audioSrc: "/audio/forest-background.mp3",
    },
    {
        id: "ocean-waves",
        title: "Ocean Waves",
        artist: "Sereno Ambient",
        duration: "∞",
        audioSrc: "/audio/ocean-background.mp3",
    },
    {
        id: "forest-sounds",
        title: "Forest Escape",
        artist: "Sereno Ambient",
        duration: "∞",
        audioSrc: "/audio/forest-background.mp3",
    },
    {
        id: "morning-sounds",
        title: "Morning Energize",
        artist: "Sereno Ambient",
        duration: "∞",
        audioSrc: "/audio/morning-energize.mp3",
    },
]

export function AudioPlayer() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
    const { playBackgroundAudio, stopBackgroundAudio, isInitialized, initializeAudio } = useAudioContext()

    const currentTrack = SERENO_PLAYLIST[currentTrackIndex]

    const togglePlayback = async () => {
        try {
            if (!isInitialized) {
                initializeAudio()
                // Wait for initialization
                await new Promise((resolve) => setTimeout(resolve, 200))
            }

            if (isPlaying) {
                console.log("Stopping background audio")
                stopBackgroundAudio()
                setIsPlaying(false)
            } else {
                console.log(`Starting background audio: ${currentTrack.title} - ${currentTrack.audioSrc}`)
                try {
                    await playBackgroundAudio(currentTrack.audioSrc, true, 0.4)
                    setIsPlaying(true)
                } catch (error) {
                    console.error("Failed to play background audio:", error)
                    setIsPlaying(false)
                }
            }
        } catch (error) {
            console.error("Error toggling playback:", error)
            setIsPlaying(false)
        }
    }

    const nextTrack = async () => {
        const nextIndex = (currentTrackIndex + 1) % SERENO_PLAYLIST.length
        setCurrentTrackIndex(nextIndex)

        if (isPlaying) {
            stopBackgroundAudio()
            setTimeout(async () => {
                try {
                    await playBackgroundAudio(SERENO_PLAYLIST[nextIndex].audioSrc, true, 0.4)
                } catch (error) {
                    console.error("Failed to play next track:", error)
                    setIsPlaying(false)
                }
            }, 100)
        }
    }

    return (
        <div
            className="
      w-full max-w-sm
      bg-black/85 backdrop-blur-md
      border border-white/20
      rounded-lg
      px-4 py-2.5
      shadow-lg shadow-black/30
      hover:border-white/30
      transition-all duration-300
      z-50
    "
        >
            <div className="flex items-center gap-4">
                {/* Lotus Icon */}
                <div
                    className="
          w-12 h-12
          bg-gray-900/70
          rounded-lg
          flex items-center justify-center
          border border-gray-600/30
          flex-shrink-0
          shadow-inner shadow-white/5
        "
                >
                    <LotusIcon width={24} height={24} className="text-gray-200" />
                </div>

                {/* Track info */}
                <div className="flex-1 min-w-0">
                    <div className="text-xs text-gray-400 font-medium mb-1">
                        {!isInitialized ? "Tap to enable audio" : isPlaying ? "Now Playing" : "Paused"}
                    </div>
                    <div className="text-sm text-white font-semibold truncate mb-0.5">{currentTrack.title}</div>
                    <div className="text-xs text-gray-400 truncate">{currentTrack.artist}</div>
                </div>

                {/* Control buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Play/Pause button */}
                    <button
                        className="
              w-10 h-10
              bg-gray-700/50 hover:bg-gray-600/50
              rounded-full
              flex items-center justify-center
              transition-all duration-200
              hover:scale-105
              active:scale-95
              border border-gray-600/30
              cursor-pointer
              touch-manipulation
              shadow-inner shadow-white/5
            "
                        onClick={togglePlayback}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause size={16} className="text-gray-200" />
                        ) : (
                            <Play size={16} className="text-gray-200 ml-0.5" />
                        )}
                    </button>

                    {/* Next track button */}
                    <button
                        onClick={nextTrack}
                        className="
              w-8 h-8
              bg-gray-800/50 hover:bg-gray-700/50
              rounded-full
              flex items-center justify-center
              transition-all duration-200
              hover:scale-105
              active:scale-95
              border border-gray-600/20
              cursor-pointer
              touch-manipulation
              shadow-inner shadow-white/5
            "
                        aria-label="Next track"
                    >
                        <SkipForward size={12} className="text-gray-300" />
                    </button>
                </div>
            </div>

            {/* Progress indicator with audio visualizer */}
            <div className="mt-3">
                <div className="w-full h-1.5 bg-gray-800/70 rounded-full overflow-hidden flex items-center">
                    {isPlaying ? (
                        <div className="w-full h-full flex items-center justify-around px-1">
                            <div className="w-0.5 h-3 bg-white/60 rounded-full animate-pulse-slow"></div>
                            <div className="w-0.5 h-4 bg-white/70 rounded-full animate-pulse"></div>
                            <div className="w-0.5 h-2 bg-white/50 rounded-full animate-pulse-fast"></div>
                            <div className="w-0.5 h-3 bg-white/60 rounded-full animate-pulse"></div>
                            <div className="w-0.5 h-5 bg-white/80 rounded-full animate-pulse-slow"></div>
                            <div className="w-0.5 h-2 bg-white/50 rounded-full animate-pulse-fast"></div>
                            <div className="w-0.5 h-4 bg-white/70 rounded-full animate-pulse"></div>
                        </div>
                    ) : (
                        <div className="w-0 h-full bg-gray-400 rounded-full transition-all duration-300"></div>
                    )}
                </div>
                <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            Track {currentTrackIndex + 1} of {SERENO_PLAYLIST.length}
          </span>
                    <span className="text-xs text-gray-500">{currentTrack.duration}</span>
                </div>
            </div>
        </div>
    )
}
