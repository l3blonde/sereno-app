import { type NextRequest, NextResponse } from "next/server"
import { MediaFileManager, checkSupabaseHealth } from "@/lib/enhanced-supabase"

// Define types for better type safety
interface MediaFile {
    id: string
    exercise_id: string
    category: "audio" | "video" | "thumbnail"
    file_path: string
    file_name: string
    created_at: string
}

// Use a simpler type for Supabase client
type SupabaseClient = ReturnType<typeof import("@supabase/supabase-js").createClient>

// Only initialize Supabase if environment variables are available
let supabase: SupabaseClient | null = null

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
        // Use dynamic import for Supabase
        const initSupabase = async () => {
            try {
                const { createClient } = await import("@supabase/supabase-js")
                supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
            } catch (error) {
                console.warn("Supabase not available during build:", error)
            }
        }

        // Initialize Supabase asynchronously
        void initSupabase()
    } catch (error) {
        console.warn("Supabase not available during build:", error)
    }
}

export async function GET(_request: NextRequest, { params }: { params: { exerciseId: string } }) {
    try {
        const { exerciseId } = params

        if (!exerciseId) {
            return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 })
        }

        const health = await checkSupabaseHealth()
        if (health.status !== "healthy") {
            return NextResponse.json(
                {
                    error: "Database unavailable",
                    details: health.message,
                },
                { status: 503 },
            )
        }

        // Return mock data if Supabase is not available
        if (!supabase) {
            return NextResponse.json({
                success: true,
                exerciseId,
                mediaFiles: {
                    audio: [],
                    video: [],
                    thumbnails: [],
                },
                message: "Supabase not configured - returning mock data",
            })
        }

        // Get all media files for this exercise with proper error handling
        const response = await supabase
            .from("media_files")
            .select("*")
            .eq("exercise_id", exerciseId)
            .order("created_at", { ascending: false })

        const { data, error } = response

        if (error) {
            console.error("Database error:", error)
            return NextResponse.json({ error: "Failed to fetch media files" }, { status: 500 })
        }

        // Safely convert data to MediaFile[] through unknown first
        const mediaFileData = data as unknown as MediaFile[]

        // Group by category with proper typing
        const mediaFiles = {
            audio: mediaFileData?.filter((file) => file.category === "audio") || [],
            video: mediaFileData?.filter((file) => file.category === "video") || [],
            thumbnails: mediaFileData?.filter((file) => file.category === "thumbnail") || [],
        }

        return NextResponse.json({
            success: true,
            exerciseId,
            mediaFiles,
        })
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function DELETE(_request: NextRequest, { params }: { params: { exerciseId: string } }) {
    try {
        const { exerciseId } = params
        const result = await MediaFileManager.deleteExerciseFiles(exerciseId)
        return NextResponse.json(result)
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
