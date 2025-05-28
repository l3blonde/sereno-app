"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, PaintBucket } from "lucide-react"
import styles from "@/app/styles/components.module.css"

type ThemeType = "dark" | "light" | "focus" | "vitalize" | "zen"

interface ThemeButtonProps {
    onThemeChange: (theme: ThemeType) => void
}

export default function ThemeButton({ onThemeChange }: ThemeButtonProps) {
    const [currentTheme, setCurrentTheme] = useState<ThemeType>("dark")

    // Load theme from localStorage on component mount
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as ThemeType | null
        if (savedTheme && ["dark", "light", "focus", "vitalize", "zen"].includes(savedTheme)) {
            setCurrentTheme(savedTheme)
        }
    }, [])

    const cycleTheme = () => {
        const themes: ThemeType[] = ["dark", "light", "focus", "vitalize", "zen"]
        const currentIndex = themes.indexOf(currentTheme)
        const nextIndex = (currentIndex + 1) % themes.length
        const nextTheme = themes[nextIndex]

        setCurrentTheme(nextTheme)
        localStorage.setItem("theme", nextTheme)
        onThemeChange(nextTheme)
    }

    const getThemeIcon = () => {
        switch (currentTheme) {
            case "dark":
                return <Moon size={20} />
            case "light":
                return <Sun size={20} />
            default:
                return <PaintBucket size={20} />
        }
    }

    const getThemeClass = () => {
        switch (currentTheme) {
            case "dark":
                return styles.themeDark
            case "light":
                return styles.themeLight
            case "focus":
                return styles.themeFocus
            case "vitalize":
                return styles.themeVitalize
            case "zen":
                return styles.themeZen
            default:
                return ""
        }
    }

    return (
        <button
            className={`${styles.porscheButton} ${getThemeClass()}`}
            onClick={cycleTheme}
            aria-label={`Switch theme, current theme: ${currentTheme}`}
        >
            {getThemeIcon()}
            <span>{currentTheme.toUpperCase()}</span>
        </button>
    )
}
