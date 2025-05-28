"use client"

import { useState, useEffect } from "react"
import { ChevronRight } from "lucide-react"
import { SystemDock } from "@/components/ui/system-dock"
import dynamic from "next/dynamic"
import { AudioPlayer } from "@/components/ui/audio-player"

/**
 * @fileoverview Sereno Moving Scenario
 * @description Driving mode interface with navigation map and audio controls for in-vehicle use.
 * @functionality Displays an enhanced map with navigation instructions, estimated arrival time, and audio playback controls.
 * @styling Uses Tailwind CSS for layout with custom CSS in app/styles/moving-page.css for map animations.
 * @layout Fixed system dock on left, full-screen map in centre, and overlay elements for navigation data.
 */

// Dynamic import for EnhancedMap to avoid SSR issues with Leaflet
const EnhancedMap = dynamic(
    () => import("@/components/ui/enhanced-map").then((mod) => ({ default: mod.EnhancedMap })),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-full bg-black flex items-center justify-center">
                <div className="text-white">Loading map...</div>
            </div>
        ),
    },
)

export default function MovingPage() {
    // Fixed arrival time - doesn't need to be in state since it doesn't change
    const estimatedArrival = "9:42"
    const [remainingTime, setRemainingTime] = useState("1 min")
    const [currentDistance, setCurrentDistance] = useState("600 ft")
    const [currentManeuver, setCurrentManeuver] = useState("Turn right")
    const [currentStreet, setCurrentStreet] = useState("N Tantau Ave")
    const [isMapReady, setIsMapReady] = useState(false)

    // Listen for navigation updates from the map
    useEffect(() => {
        const handleNavUpdate = (event: CustomEvent) => {
            const { pointIndex, instruction } = event.detail

            if (instruction) {
                setCurrentManeuver(instruction.instruction)
                setCurrentDistance(instruction.distance)
            }

            // Update remaining time based on progress
            const timeValues = [
                "1 min",
                "2 min",
                "3 min",
                "4 min",
                "5 min",
                "8 min",
                "10 min",
                "12 min",
                "15 min",
                "18 min",
                "20 min",
                "25 min",
                "30 min",
                "35 min",
                "40 min",
                "45 min",
                "50 min",
                "55 min",
                "1h",
                "1h 5m",
                "1h 10m",
                "1h 15m",
                "1h 20m",
                "1h 25m",
                "1h 30m",
            ]
            setRemainingTime(timeValues[Math.min(pointIndex, timeValues.length - 1)])

            // Update street names
            const streetNames = [
                "N Tantau Ave",
                "Zandpoortvest",
                "Mechelen Center",
                "Local Street",
                "Local Street",
                "Highway Approach",
                "Highway Approach",
                "E19 Highway",
                "E19 Highway",
                "E19 Highway",
                "E19 Highway",
                "E19 Highway",
                "Antwerp Ring",
                "Antwerp Ring",
                "Antwerp Ring",
                "E34 Junction",
                "E34 Highway",
                "E34 Highway",
                "E34 Highway",
                "E34 Highway",
                "E34 Highway",
                "E34 near Bruges",
                "Knokke Approach",
                "Knokke Approach",
                "Knokke-Heist Beach",
            ]
            setCurrentStreet(streetNames[Math.min(pointIndex, streetNames.length - 1)])
        }

        const handleMapReady = () => {
            setIsMapReady(true)
        }

        window.addEventListener("navigationUpdate", handleNavUpdate as EventListener)
        window.addEventListener("mapReady", handleMapReady as EventListener)

        return () => {
            window.removeEventListener("navigationUpdate", handleNavUpdate as EventListener)
            window.removeEventListener("mapReady", handleMapReady as EventListener)
        }
    }, [])

    return (
        <div className="fixed inset-0 bg-black flex flex-col">
            <div className="flex-1 flex relative overflow-hidden">
                {/* Left system dock */}
                <div className="w-20 h-full flex-shrink-0 z-50">
                    <SystemDock />
                </div>

                {/* Main content area - map takes remaining space */}
                <div className={`flex-1 relative transition-opacity duration-1000 ${isMapReady ? "opacity-100" : "opacity-0"}`}>
                    <EnhancedMap />

                    {/* Navigation instruction overlay - using original CSS classes */}
                    <div className="fixed-nav-instruction">
                        <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center mr-3">
                                <ChevronRight size={20} className="text-red-400" />
                            </div>
                            <div>
                                <div className="text-red-400 text-sm font-medium">{currentDistance}</div>
                                <div className="text-white text-lg font-semibold leading-tight">{currentManeuver}</div>
                            </div>
                        </div>
                    </div>

                    {/* Street name overlay */}
                    <div className="fixed-street-name">
                        <div className="font-medium">{currentStreet}</div>
                    </div>

                    {/* ETA overlay */}
                    <div className="fixed-eta">
                        <div className="text-sm font-medium text-white">{estimatedArrival} ETA</div>
                        <div className="mx-2 text-white/50">•</div>
                        <div className="text-sm font-medium text-white">{remainingTime}</div>
                        <div className="mx-2 text-white/50">•</div>
                        <div className="text-sm font-medium text-white">{currentDistance}</div>
                    </div>

                    {/* Audio player */}
                    <div className="fixed-audio-player">
                        <AudioPlayer />
                    </div>
                </div>
            </div>
        </div>
    )
}
