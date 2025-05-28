"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useRef } from "react"

interface AudioContextType {
    isInitialized: boolean
    playAudio: (src: string, loop?: boolean, volume?: number) => Promise<void>
    stopAudio: () => void
    stopAndPlayAudio: (src: string, loop?: boolean, volume?: number) => Promise<void>
    playBackgroundAudio: (src: string, loop?: boolean, volume?: number) => Promise<void>
    stopBackgroundAudio: () => void
    setVolume: (volume: number) => void
    volume: number
    initializeAudio: () => void
}

const AudioContext = createContext<AudioContextType>({
    isInitialized: false,
    playAudio: async () => {},
    stopAudio: () => {},
    stopAndPlayAudio: async () => {},
    playBackgroundAudio: async () => {},
    stopBackgroundAudio: () => {},
    setVolume: () => {},
    volume: 1,
    initializeAudio: () => {},
})

export function AudioProvider({ children }: { children: React.ReactNode }) {
    const [isInitialized, setIsInitialized] = useState(false)
    const [volume, setVolume] = useState(1)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const backgroundAudioRef = useRef<HTMLAudioElement | null>(null)

    // Manual initialization function
    const initializeAudio = () => {
        if (!isInitialized) {
            console.log("Initializing audio context...")

            // Create audio elements
            audioRef.current = new Audio()
            backgroundAudioRef.current = new Audio()

            // Set initial volume and properties
            if (audioRef.current) {
                audioRef.current.volume = volume
                audioRef.current.preload = "auto"
                audioRef.current.crossOrigin = "anonymous"
            }
            if (backgroundAudioRef.current) {
                backgroundAudioRef.current.volume = volume
                backgroundAudioRef.current.preload = "auto"
                backgroundAudioRef.current.crossOrigin = "anonymous"
            }

            setIsInitialized(true)
            console.log("Audio context initialized successfully")
        }
    }

    // Automatic initialization on first user interaction
    useEffect(() => {
        const handleUserInteraction = () => {
            initializeAudio()
            // Remove event listeners after initialization
            document.removeEventListener("click", handleUserInteraction)
            document.removeEventListener("touchstart", handleUserInteraction)
            document.removeEventListener("keydown", handleUserInteraction)
        }

        // Add event listeners for user interaction
        document.addEventListener("click", handleUserInteraction)
        document.addEventListener("touchstart", handleUserInteraction)
        document.addEventListener("keydown", handleUserInteraction)

        return () => {
            document.removeEventListener("click", handleUserInteraction)
            document.removeEventListener("touchstart", handleUserInteraction)
            document.removeEventListener("keydown", handleUserInteraction)

            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current = null
            }
            if (backgroundAudioRef.current) {
                backgroundAudioRef.current.pause()
                backgroundAudioRef.current = null
            }
        }
    }, [])

    // Play audio
    const playAudio = async (src: string, loop = false, volume = 1) => {
        if (!isInitialized || !audioRef.current) {
            console.warn("Audio not initialized")
            return
        }

        try {
            console.log(`Playing audio: ${src}`)
            audioRef.current.src = src
            audioRef.current.loop = loop
            audioRef.current.volume = volume
            await audioRef.current.play()
            console.log("Audio started successfully")
        } catch (error) {
            console.error("Error playing audio:", error)
        }
    }

    // Stop audio
    const stopAudio = () => {
        if (!isInitialized || !audioRef.current) return

        audioRef.current.pause()
        audioRef.current.currentTime = 0
        console.log("Audio stopped")
    }

    // Stop audio and ensure it's fully stopped before playing new audio
    const stopAndPlayAudio = async (src: string, loop = false, volume = 1) => {
        if (!isInitialized || !audioRef.current) {
            console.warn("Audio not initialized")
            return
        }

        try {
            // First stop any currently playing audio
            audioRef.current.pause()
            audioRef.current.currentTime = 0

            // Small delay to ensure audio is fully stopped
            await new Promise((resolve) => setTimeout(resolve, 50))

            // Now set up and play the new audio
            audioRef.current.src = src
            audioRef.current.loop = loop
            audioRef.current.volume = volume
            await audioRef.current.play()
            console.log(`Switched to audio: ${src}`)
        } catch (error) {
            console.error("Error playing audio:", error)
        }
    }

    // Play background audio
    const playBackgroundAudio = async (src: string, loop = true, volume = 0.5) => {
        if (!isInitialized || !backgroundAudioRef.current) {
            console.warn("Background audio not initialized")
            return
        }

        try {
            console.log(`Playing background audio: ${src}`)

            // Stop any currently playing background audio
            backgroundAudioRef.current.pause()
            backgroundAudioRef.current.currentTime = 0

            // Set up new audio
            backgroundAudioRef.current.src = src
            backgroundAudioRef.current.loop = loop
            backgroundAudioRef.current.volume = volume

            await backgroundAudioRef.current.play()
            console.log("Background audio started successfully")
        } catch (error) {
            console.error("Error playing background audio:", error)
            throw error // Re-throw to let caller handle
        }
    }

    // Stop background audio
    const stopBackgroundAudio = () => {
        if (!isInitialized || !backgroundAudioRef.current) return

        backgroundAudioRef.current.pause()
        backgroundAudioRef.current.currentTime = 0
        console.log("Background audio stopped")
    }

    // Update volume for all audio elements
    const updateVolume = (newVolume: number) => {
        setVolume(newVolume)

        if (audioRef.current) {
            audioRef.current.volume = newVolume
        }

        if (backgroundAudioRef.current) {
            backgroundAudioRef.current.volume = newVolume
        }
    }

    return (
        <AudioContext.Provider
            value={{
                isInitialized,
                playAudio,
                stopAudio,
                stopAndPlayAudio,
                playBackgroundAudio,
                stopBackgroundAudio,
                setVolume: updateVolume,
                volume,
                initializeAudio,
            }}
        >
            {children}
        </AudioContext.Provider>
    )
}

export const useAudioContext = () => useContext(AudioContext)
