"use client"

import { useState } from "react"
import { Settings, X } from "lucide-react"
import Logo from "@/components/shared/logo"
import { SettingsOverlay } from "@/components/ui/settings-overlay"
import { useRouter } from "next/navigation"
import { ThemeSelector } from "@/components/ui/theme-selector"

interface HeaderProps {
    activeTab: "breathing" | "meditating"
    onTabChange: (tab: "breathing" | "meditating") => void
    onLogoClick: () => void
    theme?: "night" | "day" // Added theme prop
    onThemeToggle?: () => void // Added onThemeToggle prop
}

export function Header({ activeTab, onTabChange, onLogoClick, theme, onThemeToggle }: HeaderProps) {
    const [showSettings, setShowSettings] = useState(false)
    const router = useRouter()

    const toggleSettings = () => {
        setShowSettings(!showSettings)
    }

    return (
        <>
            <header className="w-full py-3 px-6 flex justify-between items-center z-20 relative">
                <div className="flex items-center cursor-pointer" onClick={onLogoClick}>
                    <Logo size={36} />
                    <span className="text-3xl font-extrabold tracking-widest text-[#cf0000] font-heading uppercase">SERENO</span>
                </div>

                {/* Right side - Add ThemeSelector */}
                <div className="flex items-center gap-4">
                    <ThemeSelector />
                    <div className="bg-neutral-800 rounded-lg p-1 flex">
                        <button
                            className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                                activeTab === "breathing" ? "bg-black shadow-[0_0_10px_rgba(0,0,0,0.3)]" : ""
                            }`}
                            onClick={() => onTabChange("breathing")}
                        >
                            <span className="font-heading tracking-wider text-white font-bold text-lg uppercase">Breathing</span>
                        </button>
                        <button
                            className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                                activeTab === "meditating" ? "bg-black shadow-[0_0_10px_rgba(0,0,0,0.3)]" : ""
                            }`}
                            onClick={() => onTabChange("meditating")}
                        >
                            <span className="font-heading tracking-wider text-white font-bold text-lg uppercase">Meditating</span>
                        </button>
                    </div>

                    <button
                        className={`w-10 h-10 flex items-center justify-center rounded-lg ${
                            showSettings ? "bg-neutral-700" : "bg-neutral-800"
                        } hover:bg-neutral-700 active:bg-neutral-600 transition-all duration-300
           border border-neutral-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black focus-visible:ring-porsche-red`}
                        aria-label={showSettings ? "Close Settings" : "Settings"}
                        onClick={toggleSettings}
                    >
                        {showSettings ? <X size={20} className="text-white" /> : <Settings size={20} className="text-white" />}
                    </button>
                </div>
            </header>

            {/* Settings Overlay */}
            {showSettings && <SettingsOverlay onClose={toggleSettings} />}
        </>
    )
}
