"use client"

import { getAudioContext } from "./audio-service"

/**
 * Service for managing background music in breathing exercises
 * with improved race condition handling
 */
class BackgroundMusicService {
    private static instance: BackgroundMusicService
    private audioElement: HTMLAudioElement | null = null
    private currentId: string | null = null
    private isEnabled = true
    private playPromise: Promise<void> | null = null
    private isPlayPending = false
    private isPausePending = false

    // Mapping of exercise IDs to their background music files
    private readonly musicMap: Record<string, string> = {
        "quick-charge": "/audio/forest-background.mp3",
        "battery-boost": "/audio/deep-focus.mp3",
        "charging-chakras": "/audio/evening-wind-down.mp3",
        "ocean-mindfulness": "/audio/morning-energize.mp3",
        "quick-calm": "/audio/forest-background.mp3",
        "deep-focus": "/audio/deep-focus.mp3",
        "morning-energize": "/audio/morning-energize.mp3",
        "evening-wind-down": "/audio/evening-wind-down.mp3",
        "souffle-de-vador": "/audio/imperialMarch.mp3",
    }

    private constructor() {
        // Private constructor for singleton pattern
    }

    /**
     * Get the singleton instance
     */
    public static getInstance(): BackgroundMusicService {
        if (!BackgroundMusicService.instance) {
            BackgroundMusicService.instance = new BackgroundMusicService()
        }
        return BackgroundMusicService.instance
    }

    /**
     * Load and prepare background music for an exercise
     */
    public loadMusic(exerciseId: string): void {
        // If already loaded for this exercise, do nothing
        if (this.currentId === exerciseId && this.audioElement) {
            return
        }

        // Clean up any existing audio
        this.stop()

        // Get the music path for this exercise
        const musicPath = this.musicMap[exerciseId] || "/audio/deep-focus.mp3"

        try {
            // Create new audio element
            this.audioElement = new Audio(musicPath)
            this.audioElement.loop = true
            this.audioElement.volume = 0.3
            this.audioElement.preload = "auto"

            // Set current ID
            this.currentId = exerciseId

            console.log(`Background music loaded for ${exerciseId}: ${musicPath}`)
        } catch (error) {
            console.error(`Failed to load music for ${exerciseId}:`, error)
            this.audioElement = null
        }
    }

    /**
     * Load custom audio file for meditation sessions
     */
    public loadCustomAudio(audioPath: string): void {
        // Clean up any existing audio
        this.stop()

        try {
            // Create new audio element
            this.audioElement = new Audio(audioPath)
            this.audioElement.loop = true
            this.audioElement.volume = 0.3
            this.audioElement.preload = "auto"

            // Set current ID to the path for tracking
            this.currentId = audioPath

            console.log(`Custom audio loaded: ${audioPath}`)
        } catch (error) {
            console.error(`Failed to load custom audio ${audioPath}:`, error)
            this.audioElement = null
        }
    }

    /**
     * Play the background music with improved race condition handling
     */
    public async play(): Promise<void> {
        // If audio is disabled or no audio element, do nothing
        if (!this.audioElement || !this.isEnabled) {
            return Promise.resolve()
        }

        // If already playing, do nothing
        if (this.isPlaying() && !this.isPausePending) {
            return Promise.resolve()
        }

        // Mark that we're trying to play
        this.isPlayPending = true
        this.isPausePending = false

        // If there's an ongoing play operation, wait for it to complete
        if (this.playPromise) {
            try {
                await this.playPromise
            } catch (error) {
                // Ignore AbortError as it's expected during normal operation
                if (error instanceof Error && error.name !== "AbortError") {
                    console.error("Previous play operation failed:", error)
                }
            }
        }

        // If a pause was requested while waiting, honor it
        if (this.isPausePending || !this.isEnabled || !this.audioElement) {
            this.isPlayPending = false
            return Promise.resolve()
        }

        // Create a new play promise
        try {
            // Check if AudioContext is available and resume it if needed
            const audioContext = getAudioContext()
            if (audioContext && audioContext.state === "suspended") {
                await audioContext.resume()
            }

            // Start playback
            this.playPromise = this.audioElement.play()

            // Wait for playback to start
            await this.playPromise
            console.log("Background music playing successfully")
        } catch (error) {
            // Only log non-abort errors as errors
            if (error instanceof Error && error.name !== "AbortError") {
                console.error("Error playing background music:", error)
            } else {
                console.log("Play operation was aborted, likely due to pause")
            }
        } finally {
            this.playPromise = null
            this.isPlayPending = false
        }

        return Promise.resolve()
    }

    /**
     * Pause the background music with improved race condition handling
     */
    public pause(): void {
        // Mark that we want to pause
        this.isPausePending = true
        this.isPlayPending = false

        // If there's no audio element, nothing to do
        if (!this.audioElement) {
            return
        }

        // If there's an ongoing play operation
        if (this.playPromise) {
            // We'll let the play promise complete and it will check isPausePending
            console.log("Pause requested while play is in progress")
        } else {
            // No ongoing play operation, safe to pause immediately
            try {
                this.audioElement.pause()
                console.log("Background music paused")
            } catch (error) {
                console.error("Error pausing background music:", error)
            }
        }
    }

    /**
     * Stop and reset the background music
     */
    public stop(): void {
        // Mark that we want to stop everything
        this.isPausePending = true
        this.isPlayPending = false

        // If there's no audio element, nothing to do
        if (!this.audioElement) {
            this.playPromise = null
            this.currentId = null
            return
        }

        try {
            // Pause first
            this.audioElement.pause()

            // Then reset
            this.audioElement.currentTime = 0
            this.audioElement = null
            this.currentId = null
            this.playPromise = null

            console.log("Background music stopped and reset")
        } catch (error) {
            console.error("Error stopping background music:", error)
            // Clean up anyway
            this.audioElement = null
            this.currentId = null
            this.playPromise = null
        }
    }

    /**
     * Set the volume of the background music
     */
    public setVolume(volume: number): void {
        const safeVolume = Math.max(0, Math.min(1, volume))

        if (this.audioElement) {
            try {
                this.audioElement.volume = safeVolume
            } catch (error) {
                console.error("Error setting volume:", error)
            }
        }
    }

    /**
     * Enable or disable background music
     */
    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled

        if (!enabled && this.audioElement) {
            this.pause()
        } else if (enabled && this.audioElement && !this.isPlaying() && !this.isPausePending) {
            this.play().catch((err) => {
                // Ignore AbortError as it's expected during normal operation
                if (err instanceof Error && err.name !== "AbortError") {
                    console.error("Error resuming background music:", err)
                }
            })
        }
    }

    /**
     * Check if background music is currently playing
     */
    public isPlaying(): boolean {
        return !!this.audioElement && !this.audioElement.paused
    }
}

// Export a singleton instance
export const backgroundMusic = BackgroundMusicService.getInstance()
