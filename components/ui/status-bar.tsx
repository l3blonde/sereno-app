/**
 * StatusBar Component - Right System Information Panel
 * @description Fixed right sidebar displaying system info and climate controls for CarPlay interface
 * @functionality Displays signal strength, temperature controls, and battery level with interactive elements
 * @styling Tailwind for layout/spacing, CSS for custom triangle shapes only
 * @layout Fixed right sidebar, responsive width, container queries for advanced responsive design
 */

"use client"

import { useState } from "react"

export function StatusBar() {
    const [signalStrength] = useState(4)
    const [temperature, setTemperature] = useState(23.0)
    const [batteryLevel] = useState(80)

    const increaseTemperature = () => {
        setTemperature((prev) => Math.min(prev + 0.5, 30.0))
    }

    const decreaseTemperature = () => {
        setTemperature((prev) => Math.max(prev - 0.5, 16.0))
    }

    return (
        <div className="fixed top-0 right-0 w-18 @container h-screen bg-black/50 backdrop-blur-xl flex flex-col items-center py-5 z-[1000] @lg:w-20">
            {/* Cellular Signal Indicator */}
            <div className="flex flex-col items-center mb-6 min-h-[44px] justify-center @lg:mb-8">
                <div className="flex flex-col items-center gap-1">
                    <div className="flex items-end gap-0.5 h-4">
                        {[1, 2, 3, 4].map((bar) => (
                            <div
                                key={bar}
                                className={`w-0.5 rounded-sm transition-all duration-300 ${
                                    bar <= signalStrength ? "bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]" : "bg-white/30"
                                } ${bar === 1 ? "h-1" : bar === 2 ? "h-2" : bar === 3 ? "h-3" : "h-4"}`}
                            />
                        ))}
                    </div>
                    <span className="text-white text-xs font-semibold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] @lg:text-sm">
            5G
          </span>
                </div>
            </div>

            {/* Climate Temperature Controls */}
            <div className="flex flex-col items-center mb-6 @lg:mb-8">
                <div className="flex flex-col items-center gap-2">
                    <button
                        className="bg-transparent border-none cursor-pointer p-2 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center relative hover:bg-white/10 hover:scale-110 active:scale-95 @lg:min-w-[48px] @lg:min-h-[48px]"
                        onClick={increaseTemperature}
                        aria-label="Increase temperature"
                    >
                        <div className="triangle-up"></div>
                    </button>

                    <div className="text-white text-lg font-bold text-center transition-all duration-300 drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] @lg:text-xl">
                        <span className="block">{temperature.toFixed(1)}</span>
                    </div>

                    <button
                        className="bg-transparent border-none cursor-pointer p-2 rounded-lg transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center relative hover:bg-white/10 hover:scale-110 active:scale-95 @lg:min-w-[48px] @lg:min-h-[48px]"
                        onClick={decreaseTemperature}
                        aria-label="Decrease temperature"
                    >
                        <div className="triangle-down"></div>
                    </button>
                </div>
            </div>

            {/* Battery Level Indicator */}
            <div className="flex flex-col items-center mt-auto mb-5 @lg:mb-6">
                <div className="flex items-center justify-center">
                    <div className="relative flex items-center">
                        <div className="w-8 h-4 border-2 border-white rounded-sm bg-black/30 relative overflow-hidden shadow-[0_0_8px_rgba(255,255,255,0.4)] @lg:w-9 @lg:h-5">
                            <div
                                className="absolute left-0 top-0 h-full bg-white rounded-sm transition-all duration-300 shadow-[0_0_6px_rgba(255,255,255,0.6)]"
                                style={{ width: `${batteryLevel}%` }}
                            ></div>
                        </div>
                        <div className="w-0.5 h-2 bg-white rounded-r-sm ml-0.5 shadow-[0_0_4px_rgba(255,255,255,0.6)] @lg:h-2.5"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
