"use client"

import { useState, useEffect } from "react"

export function useThemePersistence() {
    const [theme, setTheme] = useState<"night" | "day">("night")

    useEffect(() => {
        // Load theme from localStorage on mount
        const savedTheme = localStorage.getItem("sereno-theme")
        if (savedTheme === "day" || savedTheme === "night") {
            setTheme(savedTheme as "day" | "night")

            if (savedTheme === "day") {
                document.documentElement.classList.add("light-theme")
                document.documentElement.classList.remove("dark-theme")
            } else {
                document.documentElement.classList.add("dark-theme")
                document.documentElement.classList.remove("light-theme")
            }
        }
    }, [])

    const toggleTheme = () => {
        const newTheme = theme === "night" ? "day" : "night"
        setTheme(newTheme)

        if (newTheme === "day") {
            document.documentElement.classList.add("light-theme")
            document.documentElement.classList.remove("dark-theme")
        } else {
            document.documentElement.classList.add("dark-theme")
            document.documentElement.classList.remove("light-theme")
        }

        localStorage.setItem("sereno-theme", newTheme)
    }

    return { theme, toggleTheme }
}
