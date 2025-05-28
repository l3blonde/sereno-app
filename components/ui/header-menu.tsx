/**
 * HeaderMenu Component - Top Navigation Tab Switcher
 * @description Fixed top navigation bar providing tab switching between breathing and meditation modes
 * @functionality Tab switching with active state management, smooth transitions between modes
 * @styling Tailwind: Layout, colors, responsive design, hover states, transitions
 * @layout Horizontal flex container with two equal-width tab buttons, glass morphism effect
 */
"use client"

import { Wind, Settings } from 'lucide-react'
import { LotusIcon } from "@/components/icons/lotus-icon"

interface HeaderMenuProps {
    activeTab: "breathing" | "meditating"
    onTabChange: (tab: "breathing" | "meditating") => void
    onSettingsClick: () => void
}

export function HeaderMenu({ activeTab, onTabChange, onSettingsClick }: HeaderMenuProps) {
    return (
        <div className="fixed top-0 left-20 right-16 lg:left-24 lg:right-18 z-40 flex items-center justify-between h-12 md:h-16 lg:h-20 px-4 md:px-6 bg-black/95 backdrop-blur-sm border-b border-white/10">
            <div className="flex items-center">
                <div className="text-xl font-semibold tracking-widest uppercase text-white transition-colors duration-300 hover:text-red-600 cursor-pointer">
                    SERENO
                </div>
            </div>

            <div className="flex-1 flex justify-center">
                <div className="flex bg-[rgba(53,54,57,0.8)] rounded-2xl p-1.5 border border-white/10 gap-4">
                    <div
                        className={`relative flex items-center justify-center h-14 px-8 gap-3 font-semibold text-lg tracking-wide transition-all duration-300 rounded-xl cursor-pointer ${
                            activeTab === "breathing"
                                ? "text-white bg-[rgba(83,84,87,0.8)] shadow-lg"
                                : "text-white/70 hover:text-white/90 hover:bg-[rgba(83,84,87,0.5)]"
                        }`}
                        onClick={() => onTabChange("breathing")}
                    >
                        <Wind className="w-5 h-5" />
                        BREATHE
                        {activeTab === "breathing" && (
                            <div className="absolute bottom-[-3px] left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-red-600 rounded-full shadow-glow-red"></div>
                        )}
                    </div>
                    <div
                        className={`relative flex items-center justify-center h-14 px-8 gap-3 font-semibold text-lg tracking-wide transition-all duration-300 rounded-xl cursor-pointer ${
                            activeTab === "meditating"
                                ? "text-white bg-[rgba(83,84,87,0.8)] shadow-lg"
                                : "text-white/70 hover:text-white/90 hover:bg-[rgba(83,84,87,0.5)]"
                        }`}
                        onClick={() => onTabChange("meditating")}
                    >
                        <LotusIcon width={20} height={20} />
                        MEDITATE
                        {activeTab === "meditating" && (
                            <div className="absolute bottom-[-3px] left-1/2 transform -translate-x-1/2 w-4/5 h-0.5 bg-red-600 rounded-full shadow-glow-red"></div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mr-2">
                <button
                    className="flex items-center justify-center w-12 h-12 bg-[rgba(53,54,57,0.8)] border border-white/10 rounded-xl text-white transition-all duration-300 hover:bg-[rgba(83,84,87,0.8)] hover:scale-105 active:scale-95"
                    onClick={onSettingsClick}
                    aria-label="Settings"
                >
                    <Settings size={24} />
                </button>
            </div>
        </div>
    )
}
