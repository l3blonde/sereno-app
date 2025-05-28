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

export async function POST(request: NextRequest) {
    try {
        // Return mock response if Supabase is not available
        if (!supabase) {
            return NextResponse.json({
                success: true,
                message: "Upload endpoint available - Supabase not configured",
                fileUrl: "/mock-upload-url",
            })
        }

        const formData = await request.formData()
        const file = formData.get("file") as File
        const exerciseId = formData.get("exerciseId") as string
        const category = formData.get("category") as string

        if (!file || !exerciseId || !category) {
            return NextResponse.json({ error: "File, exerciseId, and category are required" }, { status: 400 })
        }

        // Upload file to Supabase Storage
        const fileName = `${exerciseId}/${category}/${Date.now()}-${file.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage.from("sereno-media").upload(fileName, file)

        if (uploadError) {
            console.error("Upload error:", uploadError)
            return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
        }

        // Get public URL
        const { data: urlData } = supabase.storage.from("sereno-media").getPublicUrl(fileName)

        // Save metadata to database
        const { data: dbData, error: dbError } = await supabase
            .from("media_files")
            .insert({
                exercise_id: exerciseId,
                file_name: file.name,
                file_path: fileName,
                file_url: urlData.publicUrl,
                category: category,
                file_size: file.size,
                mime_type: file.type,
            })
            .select()

        if (dbError) {
            console.error("Database error:", dbError)
            return NextResponse.json({ error: "Failed to save file metadata" }, { status: 500 })
        }

        return NextResponse.json({
            success: true,
            file: dbData[0],
            fileUrl: urlData.publicUrl,
        })
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
