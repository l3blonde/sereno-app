"use client"

import { useEffect, useState } from "react"
import { getMediaUrl } from "@/lib/supabase"
import type { BreathingExercise } from "@/data/exercises"

export function useSupabaseMedia(exercise: BreathingExercise) {
    const [mediaUrls, setMediaUrls] = useState<BreathingExercise>(exercise)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const updateUrls = async () => {
            try {
                setIsLoading(true)
                const updated = { ...exercise }

                // Update background music URL if it exists
                if (exercise.backgroundMusic) {
                    updated.backgroundMusic = getMediaUrl("audio", exercise.backgroundMusic)
                }

                // Update inhale sound URL if it exists
                if (exercise.inhaleSound) {
                    updated.inhaleSound = getMediaUrl("audio", exercise.inhaleSound)
                }

                // Update exhale sound URL if it exists
                if (exercise.exhaleSound) {
                    updated.exhaleSound = getMediaUrl("audio", exercise.exhaleSound)
                }

                // Update hold sound URL if it exists
                if (exercise.holdSound) {
                    updated.holdSound = getMediaUrl("audio", exercise.holdSound)
                }

                setMediaUrls(updated)
                setError(null)
            } catch (err) {
                console.error("Error updating media URLs:", err)
                setError("Failed to load media files")
            } finally {
                setIsLoading(false)
            }
        }

        updateUrls()
    }, [exercise])

    return { exercise: mediaUrls, isLoading, error }
}
