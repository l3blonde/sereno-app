"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light" | "focus" | "vitalize" | "zen"

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark")

    useEffect(() => {
        // Apply theme to document
        document.documentElement.setAttribute("data-theme", theme)

        // Store theme preference
        localStorage.setItem("sereno-theme", theme)
    }, [theme])

    useEffect(() => {
        // Load saved theme on mount
        const savedTheme = localStorage.getItem("sereno-theme") as Theme | null
        if (savedTheme) {
            setTheme(savedTheme)
        }
    }, [])

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
