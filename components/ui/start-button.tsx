"use client"

import { ChevronRight } from "lucide-react"

interface StartButtonProps {
    onClickAction: () => void
    isFullSession?: boolean
    className?: string
}

export function StartButton({ onClickAction, isFullSession = true, className = "" }: StartButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation() // Prevent event bubbling
                console.log("Start button clicked inside component")
                onClickAction()
            }}
            className={`flex items-center justify-between rounded-lg px-8 py-4 text-white 
      transition-all duration-300 relative z-20 shadow-lg start-button
      hover:transform hover:-translate-y-1 active:translate-y-0 ${className}`}
        >
      <span className="text-2xl font-bold font-heading tracking-wider">
        {isFullSession ? "START SESSION" : "START"}
      </span>
            <ChevronRight size={24} className="ml-3" />
        </button>
    )
}
