"use client"

import { useState, useEffect } from "react"
import { Cloud, CloudRain, CloudSnow, Wind } from "lucide-react"
import { AnimatedSun } from "./weather-icons/animated-sun"
import { useWeather } from "@/hooks/use-weather"

interface WeatherWidgetProps {
    size?: number
    glowEffect?: boolean
    enhancedGlanceability?: boolean
}

export function WeatherWidget({ size = 440, glowEffect = true, enhancedGlanceability = true }: WeatherWidgetProps) {
    const [mounted, setMounted] = useState(false)

    // Use real weather data for Mechelen, Belgium
    const { weather, loading, error } = useWeather(51.0259, 4.4776, "Mechelen")

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted || loading) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
                <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                <div className="text-white text-lg mt-6 text-shadow-medium">Loading weather...</div>
            </div>
        )
    }

    if (error || !weather) {
        return (
            <div className="flex flex-col items-center justify-center" style={{ width: size, height: size }}>
                <div className="text-white text-lg text-center text-shadow-medium">
                    Weather unavailable
                    <br />
                    <span className="text-base text-white/80">{error}</span>
                </div>
            </div>
        )
    }

    const getWeatherIcon = (iconType: string) => {
        const iconSize = enhancedGlanceability ? 80 : 56

        switch (iconType) {
            case "sun":
                return <AnimatedSun size={iconSize} />
            case "cloud":
                return <Cloud size={iconSize} className={glowEffect ? "text-blue-400 drop-shadow-lg" : "text-blue-400"} />
            case "rain":
                return <CloudRain size={iconSize} className={glowEffect ? "text-blue-400 drop-shadow-lg" : "text-blue-400"} />
            case "snow":
                return <CloudSnow size={iconSize} className={glowEffect ? "text-blue-400 drop-shadow-lg" : "text-blue-400"} />
            case "wind":
                return <Wind size={iconSize} className={glowEffect ? "text-blue-400 drop-shadow-lg" : "text-blue-400"} />
            default:
                return <AnimatedSun size={iconSize} />
        }
    }

    // Enhanced glanceable typography with strong white glow
    const glowTextClass = glowEffect ? "text-shadow-strong" : ""
    const temperatureSize = enhancedGlanceability ? "text-8xl lg:text-9xl" : "text-6xl lg:text-7xl"
    const locationSize = enhancedGlanceability ? "text-2xl lg:text-3xl" : "text-xl lg:text-2xl"
    const conditionSize = enhancedGlanceability ? "text-xl lg:text-2xl" : "text-lg lg:text-xl"
    const highLowSize = enhancedGlanceability ? "text-lg lg:text-xl" : "text-base lg:text-lg"

    return (
        <div
            className="flex flex-col items-center justify-center space-y-6 lg:space-y-8"
            style={{ width: size, height: size }}
        >
            {/* Location - Enhanced glanceability */}
            <div className={`text-white font-bold text-center ${locationSize} ${glowTextClass} tracking-wide`}>
                {weather.location}
            </div>

            {/* Main Temperature - Super glanceable */}
            <div className={`text-white font-bold ${temperatureSize} ${glowTextClass} leading-none tracking-tight`}>
                {weather.temperature}°
            </div>

            {/* 3D Weather Icon - Larger size */}
            <div className="flex justify-center">{getWeatherIcon(weather.icon)}</div>

            {/* Weather Condition - Enhanced readability */}
            <div className={`text-white font-semibold text-center ${conditionSize} ${glowTextClass} tracking-wide`}>
                {weather.condition}
            </div>

            {/* High/Low Temperatures - Enhanced spacing */}
            <div className={`text-white font-semibold ${highLowSize} ${glowTextClass} tracking-wider`}>
                H:{weather.high}° L:{weather.low}°
            </div>

            {/* Real data indicator - Enhanced visibility */}
            <div className="absolute bottom-3 right-3 text-sm text-green-400 font-medium text-shadow-medium">Live Data</div>
        </div>
    )
}
