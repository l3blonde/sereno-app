import { type NextRequest, NextResponse } from "next/server"

// Only initialize Supabase if environment variables are available
let supabase: any = null

if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    try {
        const { createClient } = require("@supabase/supabase-js")
        supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
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

        // Get all media files for this exercise
        const { data, error } = await supabase
            .from("media_files")
            .select("*")
            .eq("exercise_id", exerciseId)
            .order("created_at", { ascending: false })

        if (error) {
            console.error("Database error:", error)
            return NextResponse.json({ error: "Failed to fetch media files" }, { status: 500 })
        }

        // Group by category
        const mediaFiles = {
            audio: data.filter((file: any) => file.category === "audio"),
            video: data.filter((file: any) => file.category === "video"),
            thumbnails: data.filter((file: any) => file.category === "thumbnail"),
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

        if (!exerciseId) {
            return NextResponse.json({ error: "Exercise ID is required" }, { status: 400 })
        }

        // Return success if Supabase is not available
        if (!supabase) {
            return NextResponse.json({
                success: true,
                message: `Mock deletion for exercise ${exerciseId} - Supabase not configured`,
            })
        }

        // Get all files for this exercise
        const { data: files, error: fetchError } = await supabase
            .from("media_files")
            .select("file_path")
            .eq("exercise_id", exerciseId)

        if (fetchError) {
            console.error("Fetch error:", fetchError)
            return NextResponse.json({ error: "Failed to fetch files" }, { status: 500 })
        }

        // Delete files from storage
        if (files && files.length > 0) {
            const filePaths = files.map((file: any) => file.file_path)
            const { error: storageError } = await supabase.storage.from("sereno-media").remove(filePaths)

            if (storageError) {
                console.error("Storage deletion error:", storageError)
            }
        }

        // Delete records from database
        const { error: dbError } = await supabase.from("media_files").delete().eq("exercise_id", exerciseId)

        if (dbError) {
            console.error("Database deletion error:", dbError)
            return NextResponse.json({ error: "Failed to delete media files" }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            message: `All media files for exercise ${exerciseId} have been deleted`,
        })
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
