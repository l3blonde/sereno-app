/**
 * components/ui/back-button.tsx
 * Back button component used for navigation within the application.
 * Provides a consistent way to return to previous screens.
 */
"use client"

import { ChevronLeft } from "lucide-react"

interface BackButtonProps {
    onBack: () => void
    exerciseTitle?: string
}

export function BackButton({ onBack, exerciseTitle }: BackButtonProps) {
    return (
        <div className="fixed top-5 left-24 z-50 flex items-center gap-4">
            <button
                className="flex items-center justify-center w-14 h-14 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white transition-all duration-300 hover:bg-white/25 hover:scale-110 active:scale-95 shadow-lg"
                onClick={onBack}
                aria-label="Go back"
            >
                <ChevronLeft size={32} strokeWidth={2} />
            </button>

            {exerciseTitle && <h2 className="text-2xl font-semibold text-white tracking-wide">{exerciseTitle}</h2>}
        </div>
    )
}
