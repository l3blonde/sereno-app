/**
 * components/ui/timer-overlay.tsx
 * Timer overlay component that allows users to select a duration
 * for their breathing or meditation session.
 */
"use client"

import { X } from "lucide-react"

interface TimerOverlayProps {
    onCloseAction: () => void
    onSelectDurationAction: (minutes: number) => void
    currentDuration: number
}

export function TimerOverlay({ onCloseAction, onSelectDurationAction, currentDuration }: TimerOverlayProps) {
    const durations = [1, 3, 5, 10, 15, 20, 30]

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-black border border-gray-800 rounded-xl p-8 w-96 relative">
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    onClick={onCloseAction}
                    aria-label="Close"
                >
                    <X size={24} />
                </button>

                <h2 className="text-2xl font-bold mb-6 text-center">Session Duration</h2>

                <div className="grid grid-cols-3 gap-4">
                    {durations.map((minutes) => (
                        <button
                            key={minutes}
                            className={`
                py-4 px-2 rounded-lg text-center text-lg font-medium transition-all
                ${
                                currentDuration === minutes
                                    ? "bg-gradient-to-br from-red-800 to-red-600 text-white shadow-lg"
                                    : "bg-gray-900 text-gray-300 hover:bg-gray-800"
                            }
              `}
                            onClick={() => onSelectDurationAction(minutes)}
                        >
                            {minutes} min
                        </button>
                    ))}
                </div>

                <div className="mt-8 text-center text-gray-400 text-sm">
                    Select a duration for your breathing or meditation session
                </div>
            </div>
        </div>
    )
}
