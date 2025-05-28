"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "focus" | "vitalize" | "zen"
type DockVisibility = boolean

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    showDock: DockVisibility
    toggleDock: () => void
}

interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: Theme
    enableSystem?: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, defaultTheme = "focus", enableSystem = false }: ThemeProviderProps) {
    const [theme, setTheme] = useState<Theme>(defaultTheme)
    const [showDock, setShowDock] = useState<DockVisibility>(false)

    // Toggle dock visibility
    const toggleDock = () => {
        setShowDock((prev) => !prev)
    }

    // Apply theme to document
    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])

    // Initialize from localStorage if available
    useEffect(() => {
        const storedTheme = localStorage.getItem("theme") as Theme | null
        const storedDock = localStorage.getItem("showDock")

        if (storedTheme) {
            setTheme(storedTheme)
        }

        if (storedDock !== null) {
            setShowDock(storedDock === "true")
        }
    }, [])

    // Save to localStorage when changed
    useEffect(() => {
        localStorage.setItem("theme", theme)
        localStorage.setItem("showDock", String(showDock))
    }, [theme, showDock])

    return <ThemeContext.Provider value={{ theme, setTheme, showDock, toggleDock }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
