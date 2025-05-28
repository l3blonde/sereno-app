"use client"

import { Sun, Moon } from "lucide-react"

interface LightToggleProps {
    isOn: boolean
    onToggle: () => void
    className?: string
}

export function LightToggle({ isOn, onToggle, className = "" }: LightToggleProps) {
    return (
        <button
            onClick={onToggle}
            className={`flex items-center justify-center gap-2 min-h-[3rem] min-w-[3rem] px-4 py-2 
      ${isOn ? "bg-porsche-red/20 text-white" : "bg-black/70 text-white/80"} 
      hover:bg-sereno-grey/70 active:bg-sereno-grey/90 
      rounded-lg border border-white/20 transition-all duration-300
      focus:outline-none focus-visible:ring-2 focus-visible:ring-porsche-red focus-visible:ring-offset-2
      relative ${className}`}
            aria-pressed={isOn}
            aria-label={isOn ? "Switch to dark mode" : "Switch to light mode"}
        >
      <span className="flex items-center justify-center w-5 h-5">
        {isOn ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </span>
            <span className="text-sm font-medium whitespace-nowrap">Light: {isOn ? "ON" : "OFF"}</span>
            {isOn && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-porsche-red"></span>}
        </button>
    )
}
