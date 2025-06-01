import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { userData, responses } = body

        // Validate required fields
        if (!userData || !responses) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        console.log("Received test submission:", { userData, responses })

        // Check if Supabase is properly initialized
        if (!supabaseAdmin) {
            console.error("Supabase admin client not initialized")
            return NextResponse.json({ error: "Database connection error" }, { status: 500 })
        }

        // Get user agent and IP for analytics
        const userAgent = request.headers.get("user-agent") || "Unknown"
        const forwarded = request.headers.get("x-forwarded-for")
        const ip = forwarded ? forwarded.split(",")[0] : "Unknown"

        try {
            // Insert into Supabase
            const { data, error } = await supabaseAdmin
                .from("user_test_results")
                .insert([
                    {
                        user_data: userData,
                        responses: responses,
                        test_version: "1.0",
                        user_agent: userAgent,
                        ip_address: ip,
                    },
                ])
                .select()

            if (error) {
                console.error("Supabase error:", error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json(
                {
                    success: true,
                    message: "Test results saved successfully",
                    id: data?.[0]?.id,
                },
                { status: 201 },
            )
        } catch (dbError) {
            console.error("Database operation error:", dbError)
            return NextResponse.json({ error: "Database operation failed" }, { status: 500 })
        }
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const limit = Number.parseInt(searchParams.get("limit") || "50")
        const offset = Number.parseInt(searchParams.get("offset") || "0")

        // Check if Supabase is properly initialized
        if (!supabaseAdmin) {
            console.error("Supabase admin client not initialized")
            return NextResponse.json({ error: "Database connection error" }, { status: 500 })
        }

        try {
            const { data, error, count } = await supabaseAdmin
                .from("user_test_results")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1)

            if (error) {
                console.error("Supabase error:", error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            return NextResponse.json({
                data,
                total: count,
                limit,
                offset,
            })
        } catch (dbError) {
            console.error("Database operation error:", dbError)
            return NextResponse.json({ error: "Database operation failed" }, { status: 500 })
        }
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
