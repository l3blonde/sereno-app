/**
 * @fileoverview Sereno Home Dashboard
 * @description Main dashboard displaying time and weather information for the Sereno wellness application.
 * @functionality Provides animated clock and weather widget components in a responsive layout.
 * @styling Uses Tailwind CSS for layout and positioning with custom animations from app/styles/components.css.
 * @layout Fixed-position system dock on left with responsive two-column layout for clock and weather.
 */
"use client"

import { SystemDock } from "@/components/ui/system-dock"
import { AnimatedClock } from "@/components/ui/animated-clock"
import { WeatherWidget } from "@/components/ui/weather-widget"

export default function HomePage() {
    return (
        <div className="fixed inset-0 bg-black flex">
            {/* System dock remains on the left */}
            <SystemDock />

            {/* Main dashboard content with responsive sizing */}
            <div className="flex-1 flex items-center justify-center p-2 sm:p-4 md:p-6 lg:p-8">
                <div className="w-full max-w-7xl flex flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-8 xl:gap-12">
                    {/* Left side - Animated Clock */}
                    <div className="flex-1 flex justify-center">
                        <AnimatedClock
                            size={280} // Reduced for mobile landscape
                            primaryColor="#e41300"
                            glowEffect={true}
                            enhancedGlanceability={true}
                        />
                    </div>

                    {/* Right side - Weather Widget */}
                    <div className="flex-1 flex justify-center">
                        <WeatherWidget
                            size={320} // Reduced for mobile landscape
                            glowEffect={true}
                            enhancedGlanceability={true}
                        />
                    </div>
                </div>
            </div>

            {/* Status indicators in corners - responsive */}
            <div className="absolute top-2 right-2 md:top-4 md:right-4 flex items-center space-x-2 text-white/60 text-xs md:text-sm">
                <span className="hidden sm:inline">5G+</span>
                <span className="sm:hidden">5G</span>
                <div className="w-5 h-2 md:w-6 md:h-3 border border-white/60 rounded-sm">
                    <div className="w-3 h-0.5 md:w-4 md:h-1 bg-green-500 rounded-sm mt-0.5 ml-0.5"></div>
                </div>
            </div>

            <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 text-white/60">
                <div className="w-6 h-3 md:w-8 md:h-4 border border-white/60 rounded-sm flex items-center justify-center">
                    <div className="w-4 h-1.5 md:w-6 md:h-2 bg-green-500 rounded-sm"></div>
                </div>
            </div>
        </div>
    )
}
