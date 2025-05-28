/**
 * Service for playing voice guidance audio in breathing exercises
 */
class AudioSpeechServiceClass {
    private static instance: AudioSpeechServiceClass
    private audioElement: HTMLAudioElement | null = null
    private isEnabled = true
    private playPromise: Promise<void> | null = null

    // Mapping of phases to their audio files - simplified to only use basic files
    private readonly audioMap: Record<string, string> = {
        inhale: "/audio/inhale.mp3",
        hold: "/audio/hold.mp3",
        exhale: "/audio/exhale.mp3",
        complete: "/audio/complete.mp3",
    }

    private constructor() {
        // Private constructor for singleton pattern
        if (typeof window !== "undefined") {
            this.audioElement = new Audio()
        }
    }

    /**
     * Get the singleton instance
     */
    public static getInstance(): AudioSpeechServiceClass {
        if (!AudioSpeechServiceClass.instance) {
            AudioSpeechServiceClass.instance = new AudioSpeechServiceClass()
        }
        return AudioSpeechServiceClass.instance
    }

    /**
     * Play a voice guidance audio file
     * @param phase The breathing phase or event (inhale, hold, exhale, complete)
     * @param _unused Kept for compatibility with previous code
     * @param onStart Callback when audio starts
     * @param onEnd Callback when audio ends
     * @param onError Callback when error occurs
     */
    async speak(
        phase: "inhale" | "hold" | "exhale" | "complete" | string,
        _unused: string, // Kept for compatibility with previous code
        onStart?: () => void,
        onEnd?: () => void,
        onError?: (error: any) => void,
    ): Promise<void> {
        if (!this.audioElement || !this.isEnabled) {
            return Promise.resolve()
        }

        // Only play audio for supported phases
        if (!this.audioMap[phase]) {
            console.log(`No audio file for phase: ${phase}`)
            return Promise.resolve()
        }

        // Stop any current audio
        this.stop()

        // Set up audio element
        this.audioElement.src = this.audioMap[phase]

        // Set event handlers
        this.audioElement.onplay = () => {
            if (onStart) onStart()
        }

        this.audioElement.onended = () => {
            if (onEnd) onEnd()
        }

        this.audioElement.onerror = (event) => {
            if (onError) onError(event)
        }

        // Play audio with proper promise handling
        try {
            this.playPromise = this.audioElement.play()
            await this.playPromise
        } catch (error) {
            if (onError) onError(error)
            console.error(`Error playing ${phase} audio:`, error)
        } finally {
            this.playPromise = null
        }
    }

    /**
     * Stop current audio
     */
    stop(): void {
        if (!this.audioElement) return

        // If there's an ongoing play operation, wait for it to complete before stopping
        if (this.playPromise) {
            this.playPromise
                .then(() => {
                    if (this.audioElement) {
                        this.audioElement.pause()
                        this.audioElement.currentTime = 0
                    }
                })
                .catch(() => {
                    // Even if play failed, try to stop
                    if (this.audioElement) {
                        this.audioElement.pause()
                        this.audioElement.currentTime = 0
                    }
                })
        } else {
            // No ongoing play operation, safe to stop immediately
            this.audioElement.pause()
            this.audioElement.currentTime = 0
        }
    }

    /**
     * Enable or disable voice guidance
     */
    setEnabled(enabled: boolean): void {
        this.isEnabled = enabled
        if (!enabled) {
            this.stop()
        }
    }

    /**
     * Check if audio is currently playing
     */
    isPlaying(): boolean {
        return this.audioElement ? !this.audioElement.paused : false
    }
}

// Export as singleton
export const AudioSpeechService = AudioSpeechServiceClass.getInstance()
