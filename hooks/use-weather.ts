"use client"

import { useState, useEffect } from "react"

interface WeatherData {
    location: string
    temperature: number
    condition: string
    high: number
    low: number
    icon: string
    humidity: number
    windSpeed: number
    uvIndex: number
}

interface OpenMeteoResponse {
    current: {
        temperature_2m: number
        relative_humidity_2m: number
        wind_speed_10m: number
        weather_code: number
    }
    daily: {
        temperature_2m_max: number[]
        temperature_2m_min: number[]
        uv_index_max: number[]
    }
}

// Weather code mapping for Open-Meteo
const getWeatherCondition = (code: number): { condition: string; icon: string } => {
    if (code === 0) return { condition: "Clear Sky", icon: "sun" }
    if (code <= 3) return { condition: "Mostly Sunny", icon: "sun" }
    if (code <= 48) return { condition: "Cloudy", icon: "cloud" }
    if (code <= 67) return { condition: "Rainy", icon: "rain" }
    if (code <= 77) return { condition: "Snowy", icon: "snow" }
    if (code <= 82) return { condition: "Showers", icon: "rain" }
    return { condition: "Partly Cloudy", icon: "cloud" }
}

export function useWeather(latitude = 51.0259, longitude = 4.4776, locationName = "Mechelen") {
    const [weather, setWeather] = useState<WeatherData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchWeather = async () => {
        try {
            setLoading(true)
            setError(null)

            const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=Europe/Brussels&forecast_days=1`

            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`Weather API error: ${response.status}`)
            }

            const data: OpenMeteoResponse = await response.json()

            const { condition, icon } = getWeatherCondition(data.current.weather_code)

            const weatherData: WeatherData = {
                location: locationName,
                temperature: Math.round(data.current.temperature_2m),
                condition,
                icon,
                high: Math.round(data.daily.temperature_2m_max[0]),
                low: Math.round(data.daily.temperature_2m_min[0]),
                humidity: data.current.relative_humidity_2m,
                windSpeed: Math.round(data.current.wind_speed_10m),
                uvIndex: Math.round(data.daily.uv_index_max[0]),
            }

            setWeather(weatherData)
        } catch (err) {
            console.error("Failed to fetch weather:", err)
            setError(err instanceof Error ? err.message : "Failed to fetch weather")

            // Fallback to mock data
            setWeather({
                location: locationName,
                temperature: 21,
                condition: "Mostly Sunny",
                icon: "sun",
                high: 24,
                low: 14,
                humidity: 65,
                windSpeed: 12,
                uvIndex: 6,
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchWeather()

        // Update weather every 10 minutes
        const interval = setInterval(fetchWeather, 10 * 60 * 1000)

        return () => clearInterval(interval)
    }, [latitude, longitude, locationName])

    return { weather, loading, error, refetch: fetchWeather }
}
