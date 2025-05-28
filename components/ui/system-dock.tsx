/**
 * @fileoverview System Dock Component
 * @description Left navigation sidebar for CarPlay-style app with time, temperature, and navigation buttons.
 * @functionality Shows current time, temperature controls, and navigation buttons with glowing effects.
 * @styling Uses Tailwind CSS for layout and styling with custom CSS for triangles and glow effects.
 * @layout Fixed position on left side of screen with stacked icons and controls.
 */

"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Home, Navigation, Clock } from "lucide-react"
import SerenoLogo from "../icons/sereno-logo"

interface SystemDockProps {
    onNavigationChange?: (destination: "home" | "navigation") => void
}

export function SystemDock({ onNavigationChange }: SystemDockProps) {
    const router = useRouter()
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [currentTime, setCurrentTime] = useState("--:--")
    const [activeIcon, setActiveIcon] = useState<"home" | "navigation">("home")
    const [driverTemperature, setDriverTemperature] = useState(22.0)

    // Ensure component is mounted before showing dynamic content
    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const updateTime = () => {
            const now = new Date()
            const hours = now.getHours()
            const minutes = now.getMinutes()
            const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
            setCurrentTime(formattedTime)
        }

        // Set initial time immediately
        updateTime()

        // Update every minute
        const interval = setInterval(updateTime, 60000)

        return () => clearInterval(interval)
    }, [mounted])

    useEffect(() => {
        if (pathname === "/home") {
            setActiveIcon("home")
        } else if (pathname === "/scenarios/moving") {
            setActiveIcon("navigation")
        }
    }, [pathname])

    const handleNavigationClick = (destination: "home" | "navigation") => {
        setActiveIcon(destination)
        onNavigationChange?.(destination)

        if (destination === "home") {
            router.push("/home")
        } else if (destination === "navigation") {
            router.push("/scenarios/moving")
        }
    }

    const handleSerenoClick = () => {
        router.push("/")
    }

    const increaseDriverTemperature = () => {
        setDriverTemperature((prev) => Math.min(prev + 0.5, 30.0))
    }

    const decreaseDriverTemperature = () => {
        setDriverTemperature((prev) => Math.max(prev - 0.5, 16.0))
    }

    // Prevent hydration mismatch by not rendering time until mounted
    if (!mounted) {
        return (
            <div className="fixed left-0 top-0 bottom-0 w-20 bg-black/95 backdrop-blur-xl border-r border-white/10 flex flex-col items-center justify-between py-3 z-50 lg:w-24 lg:py-6">
                {/* Static placeholder during SSR */}
                <div className="text-white text-center mt-2 mb-4 lg:mt-8 lg:mb-6">
                    <div className="mx-auto mb-1 lg:mb-2">
                        <Clock size={18} className="mx-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] lg:size-6" />
                    </div>
                    <div className="text-xs font-semibold tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] lg:text-lg">
                        --:--
                    </div>
                </div>

                {/* Temperature controls - Desktop Only */}
                <div className="hidden lg:flex flex-col items-center mb-8">
                    <div className="flex flex-col items-center gap-2">
                        <button
                            className="bg-transparent border-none cursor-pointer p-2 rounded-lg transition-all duration-200 min-w-[48px] min-h-[48px] flex items-center justify-center relative hover:bg-white/10 hover:scale-110 active:scale-95"
                            onClick={increaseDriverTemperature}
                            aria-label="Increase driver temperature"
                        >
                            <div className="triangle-up"></div>
                        </button>

                        <div className="text-white text-xl font-bold text-center transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                            <span className="block">22.0</span>
                        </div>

                        <button
                            className="bg-transparent border-none cursor-pointer p-2 rounded-lg transition-all duration-200 min-w-[48px] min-h-[48px] flex items-center justify-center relative hover:bg-white/10 hover:scale-110 active:scale-95"
                            onClick={decreaseDriverTemperature}
                            aria-label="Decrease driver temperature"
                        >
                            <div className="triangle-down"></div>
                        </button>
                    </div>
                </div>

                {/* Navigation Icons */}
                <div className="flex flex-col gap-5 flex-1 justify-center lg:gap-8">
                    {/* Sereno App Logo - Using Flower icon as placeholder */}
                    <div
                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center relative overflow-visible transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] cursor-pointer"
                        onClick={handleSerenoClick}
                    >
                        <SerenoLogo className="scale-120 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                        <div className="icon-glow red-glow"></div>
                        <div className="star-shine"></div>
                    </div>

                    {/* Home Navigation */}
                    <div
                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white/10 hover:bg-white/20"
                        onClick={() => handleNavigationClick("home")}
                    >
                        <Home size={24} className="text-white lg:size-7" />
                        <div className="icon-glow"></div>
                    </div>

                    {/* Navigation/Maps */}
                    <div
                        className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] bg-white/10 hover:bg-white/20"
                        onClick={() => handleNavigationClick("navigation")}
                    >
                        <Navigation size={24} className="text-white lg:size-7" />
                        <div className="icon-glow"></div>
                    </div>
                </div>

                {/* Bottom Spacer */}
                <div className="h-2 lg:h-6"></div>
            </div>
        )
    }

    return (
        <div className="fixed left-0 top-0 bottom-0 w-20 bg-black/95 backdrop-blur-xl border-r border-white/10 flex flex-col items-center justify-between py-3 z-50 lg:w-24 lg:py-6">
            {/* Time Display */}
            <div className="text-white text-center mt-2 mb-4 lg:mt-8 lg:mb-6">
                <div className="mx-auto mb-1 lg:mb-2">
                    <Clock size={18} className="mx-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] lg:size-6" />
                </div>
                <div className="text-xs font-semibold tracking-wider drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] lg:text-lg">
                    {currentTime}
                </div>
            </div>

            {/* Driver Temperature Controls - Desktop Only */}
            <div className="hidden lg:flex flex-col items-center mb-8">
                <div className="flex flex-col items-center gap-2">
                    <button
                        className="bg-transparent border-none cursor-pointer p-2 rounded-lg transition-all duration-200 min-w-[48px] min-h-[48px] flex items-center justify-center relative hover:bg-white/10 hover:scale-110 active:scale-95"
                        onClick={increaseDriverTemperature}
                        aria-label="Increase driver temperature"
                    >
                        <div className="triangle-up"></div>
                    </button>

                    <div className="text-white text-xl font-bold text-center transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
                        <span className="block">{driverTemperature.toFixed(1)}</span>
                    </div>

                    <button
                        className="bg-transparent border-none cursor-pointer p-2 rounded-lg transition-all duration-200 min-w-[48px] min-h-[48px] flex items-center justify-center relative hover:bg-white/10 hover:scale-110 active:scale-95"
                        onClick={decreaseDriverTemperature}
                        aria-label="Decrease driver temperature"
                    >
                        <div className="triangle-down"></div>
                    </button>
                </div>
            </div>

            {/* Navigation Icons */}
            <div className="flex flex-col gap-5 flex-1 justify-center lg:gap-8">
                {/* Sereno App Logo - Using Flower icon as placeholder */}
                <div
                    className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center relative overflow-visible transition-all duration-300 hover:scale-105 hover:bg-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.5)] cursor-pointer"
                    onClick={handleSerenoClick}
                >
                    <SerenoLogo className="scale-120 drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
                    <div className="icon-glow red-glow"></div>
                    <div className="star-shine"></div>
                </div>

                {/* Home Navigation */}
                <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
                        activeIcon === "home"
                            ? "bg-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)] border-white/30"
                            : "bg-white/10 hover:bg-white/20"
                    }`}
                    onClick={() => handleNavigationClick("home")}
                >
                    <Home size={24} className="text-white lg:size-7" />
                    <div className="icon-glow"></div>
                </div>

                {/* Navigation/Maps */}
                <div
                    className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl border border-white/10 flex items-center justify-center relative overflow-hidden transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
                        activeIcon === "navigation"
                            ? "bg-white/30 shadow-[0_0_20px_rgba(255,255,255,0.3)] border-white/30"
                            : "bg-white/10 hover:bg-white/20"
                    }`}
                    onClick={() => handleNavigationClick("navigation")}
                >
                    <Navigation size={24} className="text-white lg:size-7" />
                    <div className="icon-glow"></div>
                </div>
            </div>

            {/* Bottom Spacer */}
            <div className="h-2 lg:h-6"></div>
        </div>
    )
}
