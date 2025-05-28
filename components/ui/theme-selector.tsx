"use client"

import { useTheme } from "@/contexts/theme-context"
import { Palette } from 'lucide-react'

export function ThemeSelector() {
    const { theme, setTheme } = useTheme()

    const themes = [
        { id: "dark", name: "Dark" },
        { id: "light", name: "Light" },
        { id: "focus", name: "Focus" },
        { id: "vitalize", name: "Vitalize" },
        { id: "zen", name: "Zen" },
    ] as const

    return (
        <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                <Palette className="h-5 w-5" />
            </div>
            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
                {themes.map((t) => (
                    <li key={t.id}>
                        <button onClick={() => setTheme(t.id)} className={theme === t.id ? "active" : ""}>
                            {t.name}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    )
}
