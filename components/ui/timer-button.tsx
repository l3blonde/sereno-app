"use client"

import { Clock } from "lucide-react"

interface TimerButtonProps {
    duration: number
    onClickAction: () => void
}

export function TimerButton({ duration, onClickAction }: TimerButtonProps) {
    // Format duration in minutes
    const formattedDuration = duration >= 60 ? `${Math.floor(duration / 60)} min` : `${duration} sec`

    return (
        <button
            onClick={(e) => {
                e.stopPropagation() // Prevent event bubbling
                console.log("Timer button clicked inside component")
                onClickAction()
            }}
            className="flex items-center justify-center bg-[#1A1A1A] hover:bg-[#262626] active:bg-[#333333] rounded-lg py-3 px-4 text-white transition-colors border border-[#333333] relative z-20"
        >
            <Clock size={20} className="mr-2 text-white" />
            <span className="font-heading tracking-wider text-lg">Timer: {formattedDuration}</span>
        </button>
    )
}
