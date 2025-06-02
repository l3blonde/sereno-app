/**
 * AudioFooter Component - Session Audio Controls Bar
 * @description Fixed bottom audio control panel with playback controls and session progress visualization
 * @functionality Play/pause, restart, voice toggle, audio toggle, visual progress bar with time display
 * @styling Tailwind: 100% - Layout, spacing, buttons, responsive design, inline shadow utilities for progress bar glow
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

    // Calculate progress percentage (elapsed time / total time)
    const elapsedTime = totalDuration - timeRemaining
    const progressPercent = totalDuration > 0 ? Math.max(0, Math.min(100, (elapsedTime / totalDuration) * 100)) : 0

    // Generate progress bar blocks
    const generateProgressBar = () => {
        const totalBlocks = 20
        const filledBlocks = Math.round((progressPercent / 100) * totalBlocks)

        return (
            <div className="flex items-center space-x-2">
                <div className="flex space-x-[1px]">
                    {Array.from({ length: totalBlocks }).map((_, i) => (
                        <div
                            key={i}
                            className={`w-[4px] h-[16px] rounded-sm transition-all duration-300 ${
                                i < filledBlocks
                                    ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.8),0_0_4px_rgba(255,255,255,0.6)]"
                                    : "bg-white/20"
                            }`}
                        />
                    ))}
                </div>
                <div className="text-white font-mono text-sm min-w-[48px] tabular-nums">{formatTime(timeRemaining)}</div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
                <button
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300 active:scale-95"
                    onClick={onRestartAction}
                    aria-label="Restart"
                >
                    <RotateCcw size={18} className="text-white" strokeWidth={1.5} />
                </button>

                <button
                    className="w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all duration-300 active:scale-95"
                    onClick={onPlayPauseAction}
                    aria-label={isPlaying ? "Pause" : "Play"}
                >
                    {isPlaying ? (
                        <Pause size={22} className="text-white" strokeWidth={1.5} />
                    ) : (
                        <Play size={22} className="text-white ml-1" strokeWidth={1.5} />
                    )}
                </button>
            </div>

            <div className="flex-1 mx-2 flex justify-center">{generateProgressBar()}</div>

            <div className="flex items-center gap-2">
                <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
                        voiceEnabled ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={onVoiceToggleAction}
                    aria-label={voiceEnabled ? "Disable voice guidance" : "Enable voice guidance"}
                    title={voiceEnabled ? "Voice guidance on" : "Voice guidance off"}
                >
                    {voiceEnabled ? (
                        <Mic size={18} className="text-white" strokeWidth={1.5} />
                    ) : (
                        <MicOff size={18} className="text-white" strokeWidth={1.5} />
                    )}
                </button>

                <button
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 ${
                        audioEnabled ? "bg-white/20" : "bg-white/10 hover:bg-white/15"
                    }`}
                    onClick={onAudioToggleAction}
                    aria-label={audioEnabled ? "Disable background audio" : "Enable background audio"}
                    title={audioEnabled ? "Background audio on" : "Background audio off"}
                >
                    {audioEnabled ? (
                        <Volume2 size={18} className="text-white" strokeWidth={1.5} />
                    ) : (
                        <VolumeX size={18} className="text-white" strokeWidth={1.5} />
                    )}
                </button>
            </div>
        </div>
    )
}
