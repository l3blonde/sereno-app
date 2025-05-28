/**
 * Service for managing audio in driving mode
 */
class DrivingAudioService {
    private static instance: DrivingAudioService
    private backgroundAudio: HTMLAudioElement | null = null
    private voiceGuidanceAudio: HTMLAudioElement | null = null
    private isPlaying = false
    private volume = 0.7
    private currentExercise = "deep-focus"

    // Audio files mapping
    private readonly backgroundTracks: Record<string, string> = {
        "deep-focus": "/audio/deep-focus.mp3",
        "quick-calm": "/audio/forest-background.mp3",
        "morning-energize": "/audio/morning-energize.mp3",
        "evening-wind-down": "/audio/evening-wind-down.mp3",
    }

    // Voice guidance mapping
    private readonly voiceGuidance: Record<string, string[]> = {
        "deep-focus": ["/audio/inhale.mp3", "/audio/hold.mp3", "/audio/exhale.mp3", "/audio/hold.mp3"],
        "quick-calm": ["/audio/inhale.mp3", "/audio/hold.mp3", "/audio/exhale.mp3", "/audio/hold.mp3"],
        "morning-energize": ["/audio/inhale.mp3", "/audio/hold.mp3", "/audio/exhale.mp3", "/audio/hold.mp3"],
        "evening-wind-down": ["/audio/inhale.mp3", "/audio/hold.mp3", "/audio/exhale.mp3", "/audio/hold.mp3"],
    }

    private guidanceIndex = 0
    private guidanceInterval: NodeJS.Timeout | null = null

    private constructor() {
        // Private constructor for singleton pattern
        if (typeof window !== "undefined") {
            this.backgroundAudio = new Audio()
            this.voiceGuidanceAudio = new Audio()

            // Set up audio elements
            this.backgroundAudio.loop = true
            this.voiceGuidanceAudio.onended = () => {
                // When one guidance clip ends, we might want to do something
                console.log("Voice guidance clip ended")
            }
        }
    }

    /**
     * Get the singleton instance
     */
    public static getInstance(): DrivingAudioService {
        if (!DrivingAudioService.instance) {
            DrivingAudioService.instance = new DrivingAudioService()
        }
        return DrivingAudioService.instance
    }

    /**
     * Load audio for an exercise
     */
    public loadExercise(exerciseId: string): void {
        if (!this.backgroundAudio || !this.voiceGuidanceAudio) return

        // Stop current audio if playing
        this.stop()

        // Set current exercise
        this.currentExercise = exerciseId

        // Load background track
        const backgroundTrack = this.backgroundTracks[exerciseId] || this.backgroundTracks["deep-focus"]
        this.backgroundAudio.src = backgroundTrack
        this.backgroundAudio.load()
        this.backgroundAudio.volume = this.volume

        // Reset guidance index
        this.guidanceIndex = 0

        console.log(`Loaded exercise: ${exerciseId}`)
    }

    /**
     * Play audio with breathing guidance
     */
    public play(): void {
        if (!this.backgroundAudio || !this.voiceGuidanceAudio) return

        // Start background music
        this.backgroundAudio.play().catch((error) => {
            console.error("Error playing background audio:", error)
        })

        // Start voice guidance cycle
        this.startGuidanceCycle()

        this.isPlaying = true
        console.log("Driving audio started")
    }

    /**
     * Start the breathing guidance cycle
     */
    private startGuidanceCycle(): void {
        if (!this.voiceGuidanceAudio) return

        // Clear any existing interval
        if (this.guidanceInterval) {
            clearInterval(this.guidanceInterval)
        }

        // Play first guidance immediately
        this.playNextGuidance()

        // Set up interval for guidance (every 4 seconds in a 4-4-4-4 pattern)
        this.guidanceInterval = setInterval(() => {
            this.playNextGuidance()
        }, 4000) // 4 seconds between each guidance
    }

    /**
     * Play the next guidance audio in sequence
     */
    private playNextGuidance(): void {
        if (!this.voiceGuidanceAudio) return

        const guidanceFiles = this.voiceGuidance[this.currentExercise] || this.voiceGuidance["deep-focus"]
        const currentGuidance = guidanceFiles[this.guidanceIndex]

        // Load and play guidance
        this.voiceGuidanceAudio.src = currentGuidance
        this.voiceGuidanceAudio.load()
        this.voiceGuidanceAudio.volume = this.volume
        this.voiceGuidanceAudio.play().catch((error) => {
            console.error("Error playing guidance audio:", error)
        })

        // Move to next guidance in cycle
        this.guidanceIndex = (this.guidanceIndex + 1) % guidanceFiles.length
    }

    /**
     * Pause all audio
     */
    public pause(): void {
        if (!this.backgroundAudio || !this.voiceGuidanceAudio) return

        // Pause background music
        this.backgroundAudio.pause()

        // Pause voice guidance
        this.voiceGuidanceAudio.pause()

        // Clear guidance interval
        if (this.guidanceInterval) {
            clearInterval(this.guidanceInterval)
            this.guidanceInterval = null
        }

        this.isPlaying = false
        console.log("Driving audio paused")
    }

    /**
     * Stop and reset all audio
     */
    public stop(): void {
        if (!this.backgroundAudio || !this.voiceGuidanceAudio) return

        // Stop background music
        this.backgroundAudio.pause()
        this.backgroundAudio.currentTime = 0

        // Stop voice guidance
        this.voiceGuidanceAudio.pause()
        this.voiceGuidanceAudio.currentTime = 0

        // Clear guidance interval
        if (this.guidanceInterval) {
            clearInterval(this.guidanceInterval)
            this.guidanceInterval = null
        }

        this.isPlaying = false
        this.guidanceIndex = 0
        console.log("Driving audio stopped")
    }

    /**
     * Set volume for all audio
     */
    public setVolume(volume: number): void {
        this.volume = Math.max(0, Math.min(1, volume))

        if (this.backgroundAudio) {
            this.backgroundAudio.volume = this.volume
        }

        if (this.voiceGuidanceAudio) {
            this.voiceGuidanceAudio.volume = this.volume
        }

        console.log(`Volume set to: ${this.volume}`)
    }

    /**
     * Check if audio is playing
     */
    public getIsPlaying(): boolean {
        return this.isPlaying
    }

    /**
     * Switch to next exercise
     */
    public nextExercise(): string {
        const exercises = Object.keys(this.backgroundTracks)
        const currentIndex = exercises.indexOf(this.currentExercise)
        const nextIndex = (currentIndex + 1) % exercises.length
        const nextExercise = exercises[nextIndex]

        this.loadExercise(nextExercise)

        if (this.isPlaying) {
            this.play()
        }

        return nextExercise
    }

    /**
     * Switch to previous exercise
     */
    public previousExercise(): string {
        const exercises = Object.keys(this.backgroundTracks)
        const currentIndex = exercises.indexOf(this.currentExercise)
        const prevIndex = (currentIndex - 1 + exercises.length) % exercises.length
        const prevExercise = exercises[prevIndex]

        this.loadExercise(prevExercise)

        if (this.isPlaying) {
            this.play()
        }

        return prevExercise
    }

    /**
     * Get current exercise ID
     */
    public getCurrentExercise(): string {
        return this.currentExercise
    }
}

// Export singleton instance
export const drivingAudio = DrivingAudioService.getInstance()
