"use client"

import { useState } from "react"
import { Play, Clock, Volume2 } from "lucide-react"
import dynamic from "next/dynamic"
import type { JSX } from "react"

// Dynamically import visualization components
const QuickCalm = dynamic(() => import("@/components/features/breathing/quick-calm"), { ssr: false })
const DeepFocus = dynamic(() => import("@/components/features/breathing/deep-focus"), { ssr: false })
const MorningEnergize = dynamic(() => import("@/components/features/breathing/morning-energize"), { ssr: false })
const SouffleDeVador = dynamic(() => import("@/components/features/breathing/souffle-de-vador"), { ssr: false })
const VideoBackground = dynamic(() => import("@/components/features/meditation/video-background"), { ssr: false })

interface Exercise {
    id: string
    title: string
    description: string
    category: "breathing" | "meditation"
    tags: string[]
    icon: JSX.Element
    audioSrc: string
    backgroundSrc?: string
    duration?: number
    guidanceFiles?: string[]
    guidanceTiming?: number[]
}

interface ExercisePreviewProps {
    exercise: Exercise
    onStart: () => void
}

export function ExercisePreview({ exercise, onStart }: ExercisePreviewProps) {
    const [selectedDuration, setSelectedDuration] = useState(5)
    const [isPlaying, setIsPlaying] = useState(true)
    const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale")

    // Toggle play/pause for preview
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    // Render the appropriate visualization based on exercise type and ID
    const renderVisualization = () => {
        if (exercise.category === "breathing") {
            switch (exercise.id) {
                case "quick-calm":
                    return <QuickCalm isActive={true} isPaused={!isPlaying} currentPhase={currentPhase} isLightTheme={false} />
                case "deep-focus":
                    return <DeepFocus isActive={true} isPaused={!isPlaying} currentPhase={currentPhase} />
                case "morning-energize":
                    return (
                        <MorningEnergize isActive={true} isPaused={!isPlaying} currentPhase={currentPhase} isLightTheme={false} />
                    )
                case "souffle-de-vador":
                    return (
                        <SouffleDeVador isActive={true} isPaused={!isPlaying} currentPhase={currentPhase} isLightTheme={false} />
                    )
                default:
                    return (
                        <div className="w-full h-full flex items-center justify-center bg-gray-800 rounded-lg">
                            <p>Visualization not available</p>
                        </div>
                    )
            }
        } else {
            // For meditation, use video background
            return (
                <VideoBackground
                    src={exercise.backgroundSrc || "/videos/ocean-background.mp4"}
                    isPlaying={isPlaying}
                    volume={0.5}
                />
            )
        }
    }

    // Cycle through breathing phases for preview
    useState(() => {
        if (exercise.category === "breathing" && isPlaying) {
            const phaseOrder: ("inhale" | "hold1" | "exhale" | "hold2")[] = ["inhale", "hold1", "exhale", "hold2"]
            const phaseIndex = phaseOrder.indexOf(currentPhase)
            const nextPhase = phaseOrder[(phaseIndex + 1) % phaseOrder.length]

            const timer = setTimeout(() => {
                setCurrentPhase(nextPhase)
            }, 4000) // 4 seconds per phase for preview

            return () => clearTimeout(timer)
        }
    }, [currentPhase, isPlaying, exercise.category])

    return (
        <div className="h-full flex flex-col">
            {/* Visualization Preview */}
            <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
                <div className="absolute inset-0">{renderVisualization()}</div>

                {/* Play/Pause Overlay */}
                <div
                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={togglePlayPause}
                >
                    <button className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                        {isPlaying ? (
                            <div className="w-4 h-10 border-l-4 border-r-4 border-white"></div>
                        ) : (
                            <Play size={32} className="text-white ml-1" />
                        )}
                    </button>
                </div>
            </div>

            {/* Exercise Details */}
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{exercise.title}</h2>
                <p className="text-gray-300">{exercise.description}</p>

                <div className="flex items-center mt-4 space-x-4 text-gray-300">
                    <div className="flex items-center">
                        <Clock size={16} className="mr-2" />
                        <span>
              {exercise.category === "breathing"
                  ? "Breathing exercise"
                  : `${exercise.duration ? Math.floor(exercise.duration / 60) : 5} min meditation`}
            </span>
                    </div>

                    <div className="flex items-center">
                        <Volume2 size={16} className="mr-2" />
                        <span>Audio guidance</span>
                    </div>
                </div>
            </div>

            {/* Duration Selector */}
            <div className="mb-6">
                <h3 className="text-lg font-medium mb-3">Duration</h3>
                <div className="flex space-x-3">
                    {[5, 10, 15, 20].map((minutes) => (
                        <button
                            key={minutes}
                            className={`px-4 py-2 rounded-lg transition-colors ${
                                selectedDuration === minutes
                                    ? "bg-[#cf0000] text-white"
                                    : "bg-[#2a2a2a] text-gray-300 hover:bg-[#3a3a3a]"
                            }`}
                            onClick={() => setSelectedDuration(minutes)}
                        >
                            {minutes} min
                        </button>
                    ))}
                </div>
            </div>

            {/* Start Button */}
            <div className="mt-auto">
                <button
                    className="w-full py-3 rounded-lg bg-[#cf0000] hover:bg-[#a30000] transition-colors flex items-center justify-center"
                    onClick={onStart}
                >
                    <Play size={20} className="mr-2" />
                    <span className="font-bold">Start {exercise.category === "breathing" ? "Exercise" : "Meditation"}</span>
                </button>
            </div>
        </div>
    )
}
