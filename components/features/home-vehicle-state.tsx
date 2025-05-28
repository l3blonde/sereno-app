"use client"
import { Car, BatteryCharging } from "lucide-react"

// Custom P icon for parking
const ParkingIcon = ({ className }: { className?: string }) => (
    <div className={`flex items-center justify-center w-6 h-6 rounded-full border-2 border-white ${className}`}>
        <span className="text-xs font-bold">P</span>
    </div>
)

interface HomeVehicleStateProps {
    onStateChange: (state: "parked" | "moving" | "charging") => void
    currentState: "parked" | "moving" | "charging"
}

export function HomeVehicleState({ onStateChange, currentState }: HomeVehicleStateProps) {
    // Get the current state icon
    const getStateIcon = () => {
        switch (currentState) {
            case "parked":
                return <ParkingIcon className="mr-3" />
            case "moving":
                return <Car size={24} className="mr-3" />
            case "charging":
                return <BatteryCharging size={24} className="mr-3" />
        }
    }

    // Get the current state label
    const getStateLabel = () => {
        switch (currentState) {
            case "parked":
                return "PARKED"
            case "moving":
                return "MOVING"
            case "charging":
                return "CHARGING"
        }
    }

    // Get button style based on state
    const getButtonStyle = () => {
        switch (currentState) {
            case "parked":
                return "bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            case "moving":
                return "bg-blue-600 hover:bg-blue-700 text-white border border-blue-700"
            case "charging":
                return "bg-green-600 hover:bg-green-700 text-white border border-green-700"
        }
    }

    return (
        <button
            onClick={() => {
                const states: Array<"parked" | "moving" | "charging"> = ["parked", "moving", "charging"]
                const currentIndex = states.indexOf(currentState)
                const nextIndex = (currentIndex + 1) % states.length
                onStateChange(states[nextIndex])
            }}
            className={`flex items-center justify-center rounded-lg py-3 px-6 transition-all duration-200 min-h-[64px] min-w-[140px] ${getButtonStyle()}`}
            aria-label={`Vehicle state: ${currentState}. Click to change.`}
        >
            {getStateIcon()}
            <span className="font-heading tracking-wider text-lg">{getStateLabel()}</span>
        </button>
    )
}
