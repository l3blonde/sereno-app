"use client"

import { cn } from "@/lib/utils"

interface CloseButtonProps {
    onClick: () => void
    className?: string
}

export function CloseButton({ onClick, className = "" }: CloseButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn("group flex items-center justify-center h-14 w-14 relative transition-all duration-200", className)}
            aria-label="Close"
        >
            <div className="absolute inset-0 rounded-[4px] bg-black/80 group-hover:bg-black/90 group-focus:bg-black/90 transition-colors duration-200 shadow-porsche"></div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 text-white group-hover:text-sereno-red group-focus:text-sereno-red transition-colors duration-200"
            >
                <path d="M18 6L6 18"></path>
                <path d="M6 6l12 12"></path>
            </svg>
        </button>
    )
}
