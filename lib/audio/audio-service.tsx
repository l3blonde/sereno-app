"use client"

import { useEffect } from "react"

// Audio service for Sereno in-car experience
import type React from "react"

// Audio service for Sereno in-car experience
import { useState, useCallback } from "react"

/**
 * Gets the global AudioContext that was initialized by user interaction
 */
export function getAudioContext(): AudioContext | null {
    // Access the global AudioContext that was initialized by user interaction
    return (window as any).serenoPWAAudioContext || null
}

/**
 * React hook to check if audio is initialized
 */
export function useAudioStatus() {
    const [isInitialized, setIsInitialized] = useState(() => {
        // Check if we're in the browser and if the AudioContext exists
        if (typeof window !== "undefined") {
            return !!(window as any).serenoPWAAudioContext
        }
        return false
    })

    // Function to check audio status
    const checkAudioStatus = useCallback(() => {
        const isAvailable = !!(window as any).serenoPWAAudioContext
        setIsInitialized(isAvailable)
        return isAvailable
    }, [])

    return {
        isInitialized,
        checkAudioStatus,
    }
}

// Audio Context singleton
const audioContext: AudioContext | null = null

// Flag to track if audio is unlocked
let isAudioUnlocked = false

/**
 * Creates and returns an AudioContext, ensuring it's initialized properly
 */
/*export function getAudioContext(): AudioContext | null {
  if (!audioContext) {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext
      if (AudioContextClass) {
        audioContext = new AudioContextClass()

        // Don't automatically resume here - wait for user interaction
        console.log("AudioContext created, waiting for user interaction")
      }
    } catch (error) {
      console.error("Failed to create AudioContext:", error)
      return null
    }
  }

  return audioContext
}*/

/**
 * Attempts to unlock audio - should be called from a user interaction event
 */
export function unlockAudio(): Promise<boolean> {
    return new Promise((resolve) => {
        if (isAudioUnlocked) {
            resolve(true)
            return
        }

        const context = getAudioContext()
        if (!context) {
            console.error("No AudioContext available")
            resolve(false)
            return
        }

        // Check if context is in suspended state
        if (context.state === "suspended") {
            console.log("Attempting to resume AudioContext...")
            context
                .resume()
                .then(() => {
                    console.log("AudioContext resumed successfully")
                    isAudioUnlocked = true
                    resolve(true)
                })
                .catch((error) => {
                    console.error("Failed to resume AudioContext:", error)
                    resolve(false)
                })
        } else if (context.state === "running") {
            // Context is already running
            console.log("AudioContext is already running")
            isAudioUnlocked = true
            resolve(true)
        } else {
            // Create and play a silent buffer to unlock audio
            const buffer = context.createBuffer(1, 1, 22050)
            const source = context.createBufferSource()
            source.buffer = buffer
            source.connect(context.destination)

            // Play the source with a timeout (some browsers need this)
            try {
                source.start(0)
                console.log("Audio unlocked successfully")
                isAudioUnlocked = true
                resolve(true)
            } catch (error) {
                console.error("Failed to unlock audio:", error)
                resolve(false)
            }
        }
    })
}

/**
 * React hook to handle audio unlocking
 */
export function useAudioUnlock() {
    const [audioUnlocked, setAudioUnlocked] = useState(isAudioUnlocked)

    // Function to unlock audio on user interaction
    const handleUnlockAudio = useCallback(async () => {
        const result = await unlockAudio()
        setAudioUnlocked(result)
        return result
    }, [])

    return {
        audioUnlocked,
        unlockAudio: handleUnlockAudio,
    }
}

/**
 * Component to ensure audio is unlocked on user interaction
 */
export function AudioUnlocker({ children }: { children: React.ReactNode }) {
    const { audioUnlocked, unlockAudio } = useAudioUnlock()
    const [hasInteracted, setHasInteracted] = useState(false)

    // Try to unlock audio on any user interaction
    const handleInteraction = useCallback(() => {
        if (!audioUnlocked) {
            console.log("User interaction detected, attempting to unlock audio")
            unlockAudio()
            setHasInteracted(true)
        }
    }, [audioUnlocked, unlockAudio])

    // Add event listeners for common user interactions
    useEffect(() => {
        if (!audioUnlocked) {
            const events = ["click", "touchstart", "keydown"]

            const handleGlobalInteraction = () => {
                handleInteraction()
            }

            events.forEach((event) => {
                document.addEventListener(event, handleGlobalInteraction, { once: true })
            })

            return () => {
                events.forEach((event) => {
                    document.removeEventListener(event, handleGlobalInteraction)
                })
            }
        }
    }, [audioUnlocked, handleInteraction])

    return (
        <div onClick={handleInteraction} onTouchStart={handleInteraction}>
            {children}
        </div>
    )
}
