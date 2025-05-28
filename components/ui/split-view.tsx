/**
 * SplitView Component - Two-Panel Exercise Selection Interface
 * @description Divides screen into left exercise list and right preview panel for CarPlay interface
 * @functionality Exercise selection, preview display, session initiation with responsive layout
 * @styling Tailwind: Layout, spacing, responsive design, colors, hover states
 * @layout Left panel (50% width) for exercise list, right panel (50% width) for preview content
 */
"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { ChevronRight } from "lucide-react"
import VideoPreview from "@/components/features/meditation/video-preview"

interface SplitViewProps {
    exercises: any[]
    selectedExercise: any
    onSelectExerciseAction: (exercise: any) => void
    onStartExerciseAction: (exercise: any) => void
    renderBreathingPreviewAction: (exercise: any) => React.ReactNode
}

export function SplitView({
                              exercises,
                              selectedExercise,
                              onSelectExerciseAction,
                              onStartExerciseAction,
                              renderBreathingPreviewAction,
                          }: SplitViewProps) {
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        console.log("Selected exercise changed:", selectedExercise?.id)
    }, [selectedExercise])

    useEffect(() => {
        if (buttonRef.current) {
            buttonRef.current.style.display = "block"
            console.log("Button ref is available")
        }
    }, [])

    const startExerciseDirectly = (e: React.MouseEvent) => {
        e.stopPropagation()
        console.log("Start button clicked directly")

        if (selectedExercise) {
            console.log(`Attempting to start exercise: ${selectedExercise.id}`)
            try {
                onStartExerciseAction(selectedExercise)
            } catch (error) {
                console.error("Error starting exercise:", error)
            }
        } else {
            console.error("No exercise selected when trying to start")
        }
    }

    return (
        <div className="flex flex-col md:flex-row h-full w-full">
            {/* Left panel - Exercise list with 50% width and more white spacing */}
            <div className="w-full md:w-1/2 h-[50vh] md:h-full bg-black flex flex-col ml-0 md:ml-6 flex-shrink-0 px-4 md:px-6 py-4">
                {/* Exercise list with improved visibility and more white spacing */}
                <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent pt-4">
                    {exercises.length === 0 ? (
                        <div className="flex items-center justify-center h-48 text-white/50 text-lg">No exercises available</div>
                    ) : (
                        exercises.map((exercise) => (
                            <div
                                key={exercise.id}
                                className={`flex items-center p-4 md:p-6 mb-4 border-b border-white/10 transition-all duration-300 cursor-pointer rounded-lg relative
                  ${
                                    selectedExercise?.id === exercise.id
                                        ? "bg-[rgba(83,84,87,0.7)] pl-[20px] exercise-item-selected"
                                        : "hover:bg-[rgba(83,84,87,0.4)] pl-[12px] hover:pl-[20px]"
                                }`}
                                onClick={() => onSelectExerciseAction(exercise)}
                            >
                                {selectedExercise?.id === exercise.id && (
                                    <div className="absolute left-0 top-0 bottom-0 w-[8px] bg-gradient-to-b from-[#CF0000] to-[rgba(42,0,0,0.82)] rounded-l-lg shadow-[0_0_10px_rgba(207,0,0,0.5)]"></div>
                                )}
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-[rgba(107,109,112,0.7)] flex items-center justify-center mr-4 md:mr-6 flex-shrink-0">
                                    {exercise.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-lg md:text-xl font-semibold text-white mb-1 md:mb-2 truncate">
                                        {exercise.title}
                                    </div>
                                    <div className="text-sm md:text-base text-white/80 line-clamp-1">{exercise.description}</div>
                                </div>
                                <div className="text-white/70 ml-2 md:ml-4">
                                    <ChevronRight size={20} className="md:hidden" />
                                    <ChevronRight size={24} className="hidden md:block" />
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right panel - Preview */}
            <div className="flex-1 h-[50vh] md:h-full bg-black overflow-visible relative flex flex-col">
                {/* Preview content */}
                <div className="flex-1 flex flex-col justify-center items-center p-4 md:p-5 overflow-visible">
                    <div className="w-full h-full flex items-center justify-center">
                        {selectedExercise?.category === "breathing" ? (
                            renderBreathingPreviewAction(selectedExercise)
                        ) : selectedExercise ? (
                            <VideoPreview videoSrc={selectedExercise.videoSrc} title={selectedExercise.title} />
                        ) : (
                            <div className="text-white/50 text-lg">Select an exercise to preview</div>
                        )}
                    </div>
                </div>

                {/* START SESSION button - Always rendered but conditionally visible */}
                <div className="px-4 md:px-6 py-4 md:py-6 border-t border-white/10 z-50">
                    <button
                        ref={buttonRef}
                        className="w-full h-14 md:h-16 bg-[rgba(83,84,87,0.7)] border border-white/20 rounded-xl text-white text-lg md:text-xl font-semibold tracking-wide transition-all duration-300 hover:bg-gradient-to-r hover:from-[#CF0000] hover:to-[rgba(42,0,0,0.82)] hover:border-red-500/50 hover:transform hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(138,0,0,0.5)] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-black"
                        onClick={startExerciseDirectly}
                        style={{ display: selectedExercise ? "block" : "none" }}
                    >
                        START SESSION
                    </button>
                </div>
            </div>
        </div>
    )
}
