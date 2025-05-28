import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Default bucket name for audio files
const DEFAULT_AUDIO_BUCKET = "audio"

export function getMediaUrl(path: string, bucketName: string = DEFAULT_AUDIO_BUCKET): string {
    // Safety check to prevent errors
    if (!path) {
        console.error("No file path provided to getMediaUrl")
        return ""
    }

    // Remove leading slash if present
    const cleanPath = path.startsWith("/") ? path.substring(1) : path

    // Extract filename from path (e.g., /audio/forest-background.mp3 -> forest-background.mp3)
    const filename = cleanPath.includes("/") ? cleanPath.split("/").pop() : cleanPath

    try {
        const { data } = supabase.storage.from(bucketName).getPublicUrl(filename || "")
        console.log(`Generated Supabase URL for ${filename}: ${data.publicUrl}`)
        return data.publicUrl
    } catch (error) {
        console.error(`Error generating Supabase URL for ${filename}:`, error)
        throw error
    }
}
