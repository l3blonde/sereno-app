/**
 * components/ui/settings-panel.tsx
 * Beautiful automotive-style settings panel with single-row grid layout.
 * Clean horizontal design for quick glanceable selection.
 */
"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Clock, Settings, ChevronRight, Palette, Zap } from "lucide-react"
import { RCTLabDashboard } from "./rct-lab-dashboard"

interface SettingsPanelProps {
    onCloseAction: () => void
    onSelectDurationAction?: (minutes: number) => void
    currentDuration: number
    onSelectThemeAction?: (theme: string) => void
    currentTheme: string
}

export function SettingsPanel({
                                  onCloseAction,
                                  onSelectDurationAction,
                                  currentDuration,
                                  onSelectThemeAction,
                                  currentTheme,
                              }: SettingsPanelProps) {
    const [activeTab, setActiveTab] = useState<"timer" | "theme" | "rct">("timer")
    const [selectedDuration, setSelectedDuration] = useState(Math.floor(currentDuration / 60))
    const [showCustomPicker, setShowCustomPicker] = useState(false)
    const [customDuration, setCustomDuration] = useState(Math.floor(currentDuration / 60))
    const [ambientLighting, setAmbientLighting] = useState(true)
    const scrollRef = useRef<HTMLDivElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Predefined timer options
    const timerOptions = [
        { minutes: 1, label: "1 min", icon: <Clock size={28} /> },
        { minutes: 3, label: "3 min", icon: <Clock size={28} /> },
        { minutes: 5, label: "5 min", icon: <Clock size={28} /> },
        { minutes: 15, label: "15 min", icon: <Clock size={28} /> },
    ]

    // Theme options with beautiful automotive gradients
    const themeOptions = [
        {
            id: "dark",
            name: "Dark",
            gradient: "linear-gradient(135deg, #4a4a4a 0%, #2a2a2a 50%, #1a1a1a 100%)",
        },
        {
            id: "light",
            name: "Light",
            gradient: "linear-gradient(135deg, #6a6a6a 0%, #4a4a4a 50%, #3a3a3a 100%)",
        },
        {
            id: "vitalize",
            name: "Vitalize",
            gradient: "linear-gradient(135deg, #5a5a5a 0%, #3a4a3a 50%, #2a3a2a 100%)",
        },
        {
            id: "relax",
            name: "Relax",
            gradient: "linear-gradient(135deg, #5a5a6a 0%, #3a3a4a 50%, #2a3a3a 100%)",
        },
    ]

    // Generate duration options for custom picker (1-60 minutes)
    const customDurations = Array.from({ length: 60 }, (_, i) => i + 1)

    const handleTimerSelect = (minutes: number) => {
        setSelectedDuration(minutes)
        setShowCustomPicker(false)
    }

    const handleCustomSelect = () => {
        setShowCustomPicker(true)
    }

    const handleSetTimer = () => {
        if (onSelectDurationAction) {
            const finalDuration = showCustomPicker ? customDuration : selectedDuration
            onSelectDurationAction(finalDuration)
        }
        onCloseAction()
    }

    // Custom picker scroll handling
    const handleScroll = useCallback(() => {
        if (!scrollRef.current) return

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        timeoutRef.current = setTimeout(() => {
            const scrollTop = scrollRef.current?.scrollTop || 0
            const itemHeight = 60
            const newIndex = Math.round(scrollTop / itemHeight)
            if (newIndex >= 0 && newIndex < customDurations.length) {
                setCustomDuration(customDurations[newIndex])
            }
        }, 100)
    }, [customDurations])

    useEffect(() => {
        if (showCustomPicker && scrollRef.current) {
            const currentIndex = customDuration - 1
            scrollRef.current.scrollTop = currentIndex * 60
        }
    }, [showCustomPicker, customDuration])

    if (showCustomPicker) {
        return (
            <div
                className="bg-[#0A0A0A] flex items-center justify-center overflow-hidden"
                style={{
                    marginLeft: "60px",
                    marginRight: "40px",
                    height: "100vh",
                }}
            >
                <div className="flex items-center gap-8 lg:gap-16">
                    {/* Elegant picker wheel */}
                    <div className="relative">
                        <div
                            className="relative h-[240px] w-[200px] lg:h-[320px] lg:w-[260px] overflow-hidden rounded-lg bg-gradient-to-b from-[#1A1A1A] to-[#0A0A0A] border border-[#3A3A3A]"
                            style={{
                                boxShadow: "0 25px 50px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                            }}
                        >
                            {/* Elegant fades */}
                            <div className="absolute top-0 left-0 right-0 h-10 lg:h-16 bg-gradient-to-b from-[#1A1A1A] to-transparent z-10 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 right-0 h-10 lg:h-16 bg-gradient-to-t from-[#1A1A1A] to-transparent z-10 pointer-events-none" />

                            {/* Beautiful selection highlight */}
                            <div
                                className="absolute top-1/2 left-2 right-2 lg:left-4 lg:right-4 h-[40px] lg:h-[55px] transform -translate-y-1/2 pointer-events-none z-5 rounded-lg border border-white/50"
                                style={{
                                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)",
                                    boxShadow: "0 0 25px rgba(255, 255, 255, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.25)",
                                }}
                            />

                            <div
                                ref={scrollRef}
                                className="h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] px-2 lg:px-4"
                                onScroll={handleScroll}
                                style={{ scrollSnapType: "y mandatory" }}
                            >
                                <div className="h-[100px] lg:h-[132px]" />
                                {customDurations.map((minutes, index) => {
                                    const isSelected = index === customDuration - 1
                                    const distance = Math.abs(index - (customDuration - 1))
                                    const opacity = Math.max(0.3, 1 - distance * 0.15)
                                    const scale = Math.max(0.85, 1 - distance * 0.05)

                                    return (
                                        <div
                                            key={minutes}
                                            className="flex items-center justify-center h-[40px] lg:h-[55px] cursor-pointer transition-all duration-200"
                                            style={{
                                                scrollSnapAlign: "center",
                                                opacity,
                                                transform: `scale(${scale})`,
                                            }}
                                            onClick={() => setCustomDuration(minutes)}
                                        >
                      <span
                          className={`font-bold transition-all duration-200 ${
                              isSelected
                                  ? "text-white text-xl lg:text-3xl"
                                  : "text-gray-400 text-base lg:text-xl hover:text-gray-200"
                          }`}
                          style={{
                              textShadow: isSelected ? "0 0 15px rgba(255, 255, 255, 0.4)" : "none",
                          }}
                      >
                        {minutes} min
                      </span>
                                        </div>
                                    )
                                })}
                                <div className="h-[100px] lg:h-[132px]" />
                            </div>
                        </div>
                    </div>

                    {/* Elegant action buttons */}
                    <div className="flex flex-col gap-3 lg:gap-6">
                        <button
                            onClick={() => setShowCustomPicker(false)}
                            className="px-6 lg:px-10 py-2 lg:py-4 text-base lg:text-xl font-bold text-gray-300 bg-gradient-to-r from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 rounded-lg border border-[#404040]"
                            style={{
                                boxShadow: "0 12px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                setSelectedDuration(customDuration)
                                setShowCustomPicker(false)
                            }}
                            className="px-6 lg:px-10 py-2 lg:py-4 text-base lg:text-xl font-bold text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-200 rounded-lg"
                            style={{
                                boxShadow: "0 12px 30px rgba(255, 255, 255, 0.25), 0 6px 15px rgba(0, 0, 0, 0.3)",
                            }}
                        >
                            Set Timer
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className="bg-[#0A0A0A] flex flex-col overflow-hidden"
            style={{
                marginLeft: "60px",
                marginRight: "40px",
                height: "100vh",
            }}
        >
            {/* Beautiful automotive tabs */}
            <div className="border-b border-[#2A2A2A] bg-gradient-to-r from-[#0A0A0A] to-[#1A1A1A] flex-shrink-0">
                <div className="flex h-12 lg:h-18">
                    <button
                        className={`
              flex-1 px-2 lg:px-6 py-2 lg:py-4 text-sm lg:text-lg font-bold transition-all duration-300 flex items-center justify-center gap-1 lg:gap-4 border-r border-[#2A2A2A] relative
              ${
                            activeTab === "timer"
                                ? "text-white bg-gradient-to-b from-[#4A4A4A] to-[#3A3A3A]"
                                : "text-gray-300 bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] hover:text-white"
                        }
            `}
                        onClick={() => setActiveTab("timer")}
                    >
                        <Clock size={16} className="lg:hidden" />
                        <Clock size={22} className="hidden lg:block" />
                        <span className="hidden sm:inline">Timer</span>
                        {activeTab === "timer" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm" />}
                    </button>

                    <button
                        className={`
              flex-1 px-2 lg:px-6 py-2 lg:py-4 text-sm lg:text-lg font-bold transition-all duration-300 flex items-center justify-center gap-1 lg:gap-4 border-r border-[#2A2A2A] relative
              ${
                            activeTab === "theme"
                                ? "text-white bg-gradient-to-b from-[#4A4A4A] to-[#3A3A3A]"
                                : "text-gray-300 bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] hover:text-white"
                        }
            `}
                        onClick={() => setActiveTab("theme")}
                    >
                        <Palette size={16} className="lg:hidden" />
                        <Palette size={22} className="hidden lg:block" />
                        <span className="hidden sm:inline">Theme</span>
                        {activeTab === "theme" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm" />}
                    </button>

                    <button
                        className={`
              flex-1 px-2 lg:px-6 py-2 lg:py-4 text-sm lg:text-lg font-bold transition-all duration-300 flex items-center justify-center gap-1 lg:gap-4 relative
              ${
                            activeTab === "rct"
                                ? "text-white bg-gradient-to-b from-[#4A4A4A] to-[#3A3A3A]"
                                : "text-gray-300 bg-gradient-to-b from-[#2A2A2A] to-[#1A1A1A] hover:from-[#3A3A3A] hover:to-[#2A2A2A] hover:text-white"
                        }
            `}
                        onClick={() => setActiveTab("rct")}
                    >
                        <Zap size={16} className="lg:hidden" />
                        <Zap size={22} className="hidden lg:block" />
                        <span className="hidden sm:inline">RCT LAB</span>
                        {activeTab === "rct" && <div className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-sm" />}
                    </button>
                </div>
            </div>

            {/* Beautiful content with single-row grids - SCROLLABLE */}
            <div className="flex-1 overflow-y-auto">
                {activeTab === "timer" && (
                    <div className="p-3 lg:p-8 flex flex-col h-full">
                        {/* Beautiful timer grid - COMPACT FOR MOBILE */}
                        <div className="grid grid-cols-4 gap-2 lg:gap-6 mb-4 lg:mb-8">
                            {timerOptions.map((option) => (
                                <button
                                    key={option.minutes}
                                    className={`
                    flex flex-col items-center justify-center gap-1 lg:gap-4 py-3 lg:py-8 text-center transition-all duration-300 rounded-lg border-2 aspect-[4/3]
                    ${
                                        selectedDuration === option.minutes && !showCustomPicker
                                            ? "text-white bg-gradient-to-br from-[#3A3A3A] via-[#2A2A2A] to-[#1A1A1A] border-white/60 scale-[1.03] shadow-2xl"
                                            : "text-gray-300 bg-gradient-to-br from-[#1A1A1A] via-[#0A0A0A] to-[#050505] border-[#2A2A2A] hover:border-[#3A3A3A] hover:scale-[1.01] hover:bg-gradient-to-br hover:from-[#2A2A2A] hover:via-[#1A1A1A] hover:to-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-gradient-to-br focus:from-[#2A2A2A] focus:via-[#1A1A1A] focus:to-[#0A0A0A]"
                                    }
                  `}
                                    style={{
                                        boxShadow:
                                            selectedDuration === option.minutes && !showCustomPicker
                                                ? "0 20px 40px rgba(0, 0, 0, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.2), 0 0 30px rgba(255, 255, 255, 0.1)"
                                                : "0 10px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                                    }}
                                    onClick={() => handleTimerSelect(option.minutes)}
                                >
                                    <div className="text-gray-400">
                                        <Clock size={16} className="lg:hidden" />
                                        <Clock size={28} className="hidden lg:block" />
                                    </div>
                                    <span className="text-sm lg:text-2xl font-bold">{option.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Beautiful custom option - COMPACT */}
                        <button
                            className={`
                w-full flex items-center justify-between px-3 lg:px-8 py-3 lg:py-6 text-left transition-all duration-300 rounded-lg border-2 mb-4 lg:mb-8
                ${
                                showCustomPicker ||
                                (!timerOptions.some((opt) => opt.minutes === selectedDuration) && selectedDuration > 0)
                                    ? "text-white bg-gradient-to-r from-[#3A3A3A] via-[#2A2A2A] to-[#1A1A1A] border-white/60"
                                    : "text-gray-300 bg-gradient-to-r from-[#1A1A1A] via-[#0A0A0A] to-[#050505] border-[#2A2A2A] hover:border-[#3A3A3A] hover:bg-gradient-to-r hover:from-[#2A2A2A] hover:via-[#1A1A1A] hover:to-[#0A0A0A] focus:outline-none focus:ring-2 focus:ring-white/20 focus:bg-gradient-to-r focus:from-[#2A2A2A] focus:via-[#1A1A1A] focus:to-[#0A0A0A]"
                            }
              `}
                            style={{
                                boxShadow:
                                    showCustomPicker ||
                                    (!timerOptions.some((opt) => opt.minutes === selectedDuration) && selectedDuration > 0)
                                        ? "0 20px 40px rgba(0, 0, 0, 0.6), inset 0 2px 0 rgba(255, 255, 255, 0.2)"
                                        : "0 10px 25px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
                            }}
                            onClick={handleCustomSelect}
                        >
                            <div className="flex items-center gap-2 lg:gap-4">
                                <Settings size={18} className="text-gray-400 lg:hidden" />
                                <Settings size={28} className="text-gray-400 hidden lg:block" />
                                <span className="text-base lg:text-xl font-bold">
                  Custom{" "}
                                    {selectedDuration && !timerOptions.some((opt) => opt.minutes === selectedDuration)
                                        ? `(${selectedDuration} min)`
                                        : ""}
                </span>
                            </div>
                            <ChevronRight size={18} className="text-gray-400 lg:hidden" />
                            <ChevronRight size={24} className="text-gray-400 hidden lg:block" />
                        </button>

                        {/* Beautiful action button - COMPACT */}
                        <div className="flex justify-center">
                            <button
                                onClick={handleSetTimer}
                                className="px-6 lg:px-16 py-2 lg:py-4 text-lg lg:text-2xl font-bold text-black bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 rounded-lg hover:scale-[1.02]"
                                style={{
                                    boxShadow: "0 20px 40px rgba(255, 255, 255, 0.25), 0 10px 20px rgba(0, 0, 0, 0.3)",
                                }}
                            >
                                Set Timer
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "theme" && (
                    <div className="p-3 lg:p-8 flex flex-col h-full">
                        {/* Beautiful theme grid - 4 COLUMNS HORIZONTAL COMPACT */}
                        <div className="grid grid-cols-4 gap-2 lg:gap-6 mb-4 lg:mb-8">
                            {themeOptions.map((theme) => (
                                <button
                                    key={theme.id}
                                    className={`
                    relative transition-all duration-300 rounded-lg border-2 flex flex-col items-center justify-center p-2 lg:p-6 aspect-[3/4]
                    ${
                                        currentTheme === theme.id
                                            ? "border-white/70 scale-[1.03] shadow-2xl"
                                            : "border-[#2A2A2A] hover:border-[#3A3A3A] hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-white/20"
                                    }
                  `}
                                    style={{
                                        background: theme.gradient,
                                        boxShadow:
                                            currentTheme === theme.id
                                                ? "0 0 40px rgba(255, 255, 255, 0.25), 0 20px 40px rgba(0, 0, 0, 0.6)"
                                                : "0 10px 25px rgba(0, 0, 0, 0.4)",
                                    }}
                                    onClick={() => onSelectThemeAction?.(theme.id)}
                                >
                                    <span className="text-sm lg:text-2xl font-bold text-white/95 mb-1 lg:mb-3">{theme.name}</span>
                                    {currentTheme === theme.id && (
                                        <div
                                            className="w-2 h-2 lg:w-4 lg:h-4 bg-white rounded-full shadow-lg"
                                            style={{
                                                boxShadow: "0 0 15px rgba(255, 255, 255, 0.6)",
                                            }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Beautiful ambient lighting toggle - COMPACT */}
                        <div
                            className="flex items-center justify-between px-3 lg:px-8 py-3 lg:py-6 rounded-lg backdrop-blur-md"
                            style={{
                                background: "linear-gradient(135deg, rgba(26, 26, 26, 0.95) 0%, rgba(42, 42, 42, 0.9) 100%)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(255, 255, 255, 0.15)",
                            }}
                        >
                            <span className="text-white font-bold text-base lg:text-xl">Pair with ambient lighting</span>

                            <button
                                onClick={() => {
                                    setAmbientLighting(!ambientLighting)
                                    if (!ambientLighting) {
                                        setTimeout(() => {
                                            onCloseAction()
                                        }, 300)
                                    }
                                }}
                                className={`
                  relative w-14 h-7 lg:w-20 lg:h-10 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/20 border-2
                  ${
                                    ambientLighting
                                        ? "bg-white border-white shadow-lg"
                                        : "bg-[#2A2A2A] border-[#404040] hover:bg-[#3A3A3A] hover:border-[#505050]"
                                }
                `}
                                style={{
                                    boxShadow: ambientLighting
                                        ? "0 0 20px rgba(255, 255, 255, 0.5), inset 0 2px 4px rgba(0, 0, 0, 0.1)"
                                        : "inset 0 2px 4px rgba(0, 0, 0, 0.3)",
                                }}
                            >
                                <div
                                    className={`
                    absolute top-0.5 w-6 h-6 lg:w-8 lg:h-8 rounded-full transition-all duration-300 shadow-lg flex items-center justify-center
                    ${
                                        ambientLighting
                                            ? "left-7 lg:left-10 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A]"
                                            : "left-0.5 bg-gradient-to-br from-[#6A6A6A] to-[#4A4A4A]"
                                    }
                  `}
                                    style={{
                                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                                    }}
                                >
                                    {ambientLighting && <div className="w-1 h-1 lg:w-2 lg:h-2 bg-white rounded-full opacity-80" />}
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === "rct" && <RCTLabDashboard />}
            </div>
        </div>
    )
}
