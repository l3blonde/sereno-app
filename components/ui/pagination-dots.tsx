"use client"

interface PaginationDotsProps {
    total: number
    active: number
    onDotClick?: (index: number) => void
    showLabels?: boolean
    exerciseNames?: string[]
    className?: string
}

export function PaginationDots({
                                   total,
                                   active,
                                   onDotClick,
                                   showLabels = false,
                                   exerciseNames = [],
                                   className = ""
                               }: PaginationDotsProps) {
    // Ensure total is at least 1 to prevent empty rendering
    const dotsCount = Math.max(1, total)

    return (
        <div className={`flex items-center space-x-4 z-20 relative ${className}`}>
            {Array.from({ length: dotsCount }).map((_, index) => (
                <div
                    key={index}
                    className={`flex flex-col items-center ${
                        onDotClick ? "cursor-pointer hover:opacity-80 active:opacity-60" : ""
                    }`}
                    onClick={() => onDotClick && onDotClick(index)}
                    role={onDotClick ? "button" : "presentation"}
                    aria-label={onDotClick ? `Go to exercise ${index + 1}` : undefined}
                    aria-current={index === active ? "true" : undefined}
                >
                    <div className={`w-3 h-3 rounded-full ${index === active ? "bg-white scale-110" : "bg-gray-500"} transition-all duration-300`} />
                    {showLabels && exerciseNames[index] && (
                        <span className={`text-xs mt-1 ${index === active ? "text-white" : "text-gray-400"}`}>
              {exerciseNames[index]}
            </span>
                    )}
                </div>
            ))}
        </div>
    )
}
