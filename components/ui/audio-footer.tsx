/**
 * AudioFooter Component - Session Audio Controls Bar
 * @description Audio control panel with playback controls and session progress visualization
 * @functionality Play/pause, restart, voice toggle, audio toggle, visual progress bar with time display
 * @styling Tailwind: Layout, spacing, buttons, responsive design, inline shadow utilities for progress bar glow
 * @cssFiles None - Pure Tailwind implementation with inline shadow utilities for glow effects
 * @layout Horizontal layout with left controls, center progress bar, right toggles
 */
"use client"

import { Play, Pause, RotateCcw, Mic, MicOff, Volume2, VolumeX } from "lucide-react"

interface AudioFooterProps {
    isPlaying: boolean
    onPlayPauseAction: () => void
    onRestartAction: () => void
    timeRemaining: number
    totalDuration: number
    voiceEnabled: boolean
    onVoiceToggleAction: () => void
    audioEnabled: boolean
    onAudioToggleAction: () => void
}

export function AudioFooter({
                                isPlaying,
                                onPlayPauseAction,
                                onRestartAction,
                                timeRemaining,
                                totalDuration,
                                voiceEnabled,
                                onVoiceToggleAction,
                                audioEnabled,
                                onAudioToggleAction,
                            }: AudioFooterProps) {
    // Format time as mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, "0")}`
    }

    // Calculate progress percentage
    const progressPercent = Math.max(0, Math.min(100, ((totalDuration - timeRemaining) / totalDuration) * 100))

    // Generate progress bar blocks - increased from 20 to 30 blocks
    const generateProgressBar = () => {
        const totalBlocks = 30
        const filledBlocks = Math.round((progressPercent / 100) * totalBlocks)

        return (
            <div className="flex items-center space-x-3">
                <div className="flex space-x-[1px]">
                    {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-[5px] h-[18px] rounded-sm ${
                                i < filledBlocks ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.7)]" : "bg-white/20"
                            }`}
                        />
                    ))}
                </div>
                <div className="text-white font-mono text-base min-w-[52px]">{formatTime(timeRemaining)}</div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
                <button
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 active:scale-95"
                    onClick={onRestartAction}
                    aria-label="Restart"
                >
                    <RotateCcw size={20} className="text-white" strokeWidth={1.5} />
                </button>

                <button
                    className="w-14 h-14 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 active:scale-95"
                    onClick={onPlayPauseAction}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause size={24} className="text-white" strokeWidth={1.5} />
                    ) : (
                        <Play size={24} className="text-white ml-1" strokeWidth={1.5} />
                    )}
                </button>
            </div>

            <div className="flex-1 mx-4 flex justify-center">{generateProgressBar()}</div>

            <div className="flex items-center gap-4">
                <button
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
                        voiceEnabled ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={onVoiceToggleAction}
                    aria-label={voiceEnabled ? "Disable voice guidance" : "Enable voice guidance"}
                    title={voiceEnabled ? "Voice guidance on" : "Voice guidance off"}
                >
                    {voiceEnabled ? (
                        <Mic size={20} className="text-white" strokeWidth={1.5} />
                    ) : (
                        <MicOff size={20} className="text-white" strokeWidth={1.5} />
                    )}
                </button>

                <button
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
                        audioEnabled ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={onAudioToggleAction}
                    aria-label={audioEnabled ? "Disable background audio" : "Enable background audio"}
                    title={audioEnabled ? "Background audio on" : "Background audio off"}
                >
                    {audioEnabled ? (
                        <Volume2 size={20} className="text-white" strokeWidth={1.5} />
                    ) : (
                        <VolumeX size={20} className="text-white" strokeWidth={1.5} />
                    )}
                </button>
            </div>
        </div>
    )
}
