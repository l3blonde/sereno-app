"use client"

import { AudioSpeechService } from "./speech/audio-speech-service"

// Function to preload all audio files
export function preloadAllAudio() {
    if (typeof window !== "undefined") {
        console.log("Preloading all audio files...")

        // Preload after a short delay to not block initial rendering
        setTimeout(() => {
            AudioSpeechService.preloadAll()
        }, 1000)
    }
}

// Auto-execute when imported
preloadAllAudio()
