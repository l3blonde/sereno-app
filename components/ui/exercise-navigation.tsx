"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface ExerciseNavigationProps {
    onPreviousAction: () => void
    onNextAction: () => void
    hasPrevious: boolean
    hasNext: boolean
    currentIndex: number
    totalCount: number
}

export function ExerciseNavigation({
                                       onPreviousAction,
                                       onNextAction,
                                       hasPrevious,
                                       hasNext,
                                       currentIndex,
                                       totalCount,
                                   }: ExerciseNavigationProps) {
    return (
        <div className="flex items-center justify-between w-full relative z-20">
            <button
                onClick={(e) => {
                    e.stopPropagation()
                    if (hasPrevious) onPreviousAction()
                }}
                disabled={!hasPrevious}
                className={`min-w-[3rem] min-h-[3rem] w-12 h-12 flex items-center justify-center rounded-lg ${
                    hasPrevious
                        ? "bg-sereno-dark-grey hover:bg-sereno-grey active:bg-sereno-grey/80"
                        : "bg-sereno-dark-grey/30 cursor-not-allowed"
                } transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-porsche-red focus-visible:ring-offset-2`}
                aria-label="Previous exercise"
            >
                <ChevronLeft size={28} className={`text-white ${!hasPrevious ? "opacity-50" : ""}`} />
            </button>

            <div className="text-white text-base font-medium glanceable-text">
                {currentIndex + 1} / {totalCount}
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation()
                    if (hasNext) onNextAction()
                }}
                disabled={!hasNext}
                className={`min-w-[3rem] min-h-[3rem] w-12 h-12 flex items-center justify-center rounded-lg ${
                    hasNext
                        ? "bg-sereno-dark-grey hover:bg-sereno-grey active:bg-sereno-grey/80"
                        : "bg-sereno-dark-grey/30 cursor-not-allowed"
                } transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-porsche-red focus-visible:ring-offset-2`}
                aria-label="Next exercise"
            >
                <ChevronRight size={28} className={`text-white ${!hasNext ? "opacity-50" : ""}`} />
            </button>
        </div>
    )
}
