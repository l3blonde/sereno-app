"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export type ThemeColorType = {
    accentColor: string
    setAccentColor: (color: string) => void
}

const ThemeColorContext = createContext<ThemeColorType>({
    accentColor: "#cf0000",
    setAccentColor: () => {},
})

export function ThemeColorProvider({ children }: { children: React.ReactNode }) {
    const [accentColor, setAccentColor] = useState("#cf0000")

    useEffect(() => {
        // Update CSS variables when accent color changes
        document.documentElement.style.setProperty("--accent-red", accentColor)

        // Calculate darker and lighter variants
        const darkerColor = adjustColorBrightness(accentColor, -0.3)
        const lighterColor = adjustColorBrightness(accentColor, 0.3)
        const hoverColor = adjustColorBrightness(accentColor, -0.1)
        const activeColor = adjustColorBrightness(accentColor, -0.4)

        document.documentElement.style.setProperty("--accent-red-dark", darkerColor)
        document.documentElement.style.setProperty("--accent-red-light", lighterColor)
        document.documentElement.style.setProperty("--accent-red-hover", hoverColor)
        document.documentElement.style.setProperty("--accent-red-active", activeColor)
    }, [accentColor])

    // Helper function to adjust color brightness
    const adjustColorBrightness = (hex: string, factor: number): string => {
        // Convert hex to RGB
        let r = Number.parseInt(hex.substring(1, 3), 16)
        let g = Number.parseInt(hex.substring(3, 5), 16)
        let b = Number.parseInt(hex.substring(5, 7), 16)

        // Adjust brightness
        r = Math.min(255, Math.max(0, Math.round(r + r * factor)))
        g = Math.min(255, Math.max(0, Math.round(g + g * factor)))
        b = Math.min(255, Math.max(0, Math.round(b + b * factor)))

        // Convert back to hex
        return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`
    }

    return <ThemeColorContext.Provider value={{ accentColor, setAccentColor }}>{children}</ThemeColorContext.Provider>
}

export const useThemeColor = () => useContext(ThemeColorContext)
