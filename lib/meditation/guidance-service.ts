class MeditationGuidanceService {
    private audioElement: HTMLAudioElement | null = null
    private isEnabled = true
    private currentSession: string | null = null
    private guidanceQueue: { file: string; timing: number }[] = []
    private timers: NodeJS.Timeout[] = []

    constructor() {
        if (typeof window !== "undefined") {
            this.audioElement = new Audio()
        }
    }

    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled
        if (!enabled) {
            this.stop()
        }
    }

    public startSession(sessionId: string, guidanceFiles: string[], guidanceTiming: number[]): void {
        if (!this.isEnabled || !this.audioElement) return

        // Clear any existing session
        this.stop()

        this.currentSession = sessionId

        // Create guidance queue
        this.guidanceQueue = guidanceFiles.map((file, index) => ({
            file,
            timing: guidanceTiming[index] || 0,
        }))

        // Schedule all guidance audio
        this.scheduleGuidance()
    }

    private scheduleGuidance(): void {
        if (!this.isEnabled) return

        // Clear any existing timers
        this.clearTimers()

        // Schedule each guidance audio
        this.guidanceQueue.forEach((guidance) => {
            const timer = setTimeout(() => {
                this.playGuidance(guidance.file)
            }, guidance.timing * 1000)

            this.timers.push(timer)
        })
    }

    private playGuidance(file: string): void {
        if (!this.isEnabled || !this.audioElement) return

        // Stop any currently playing guidance
        this.audioElement.pause()

        // Load and play the new guidance
        this.audioElement.src = file
        this.audioElement.load()

        // Play the audio
        this.audioElement.play().catch((error) => {
            console.error("Error playing guidance audio:", error)
        })
    }

    public stop(): void {
        // Clear all scheduled timers
        this.clearTimers()

        // Stop any playing audio
        if (this.audioElement) {
            this.audioElement.pause()
            this.audioElement.currentTime = 0
        }

        this.currentSession = null
        this.guidanceQueue = []
    }

    private clearTimers(): void {
        this.timers.forEach((timer) => clearTimeout(timer))
        this.timers = []
    }

    public pause(): void {
        if (this.audioElement) {
            this.audioElement.pause()
        }

        // Pause all timers (not supported directly, so we'd need to implement a more complex system)
        // For now, we'll just stop everything
        this.clearTimers()
    }

    public resume(): void {
        if (!this.isEnabled) return

        // Resume audio if it was playing
        if (this.audioElement && this.audioElement.paused && this.audioElement.src) {
            this.audioElement.play().catch((error) => {
                console.error("Error resuming guidance audio:", error)
            })
        }

        // For a proper implementation, we'd need to reschedule remaining guidance
        // This is simplified for now
    }
}

export const meditationGuidance = new MeditationGuidanceService()
