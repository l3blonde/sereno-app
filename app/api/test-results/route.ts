import { type NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

export async function POST(request: NextRequest) {
    try {
        console.log("=== API POST /test-results called ===")

        const body = await request.json()
        const { userData, responses } = body

        console.log("Request body:", JSON.stringify(body, null, 2))

        // Validate required fields
        if (!userData || !responses) {
            console.error("Missing required fields:", { userData: !!userData, responses: !!responses })
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        console.log("Received test submission:", { userData, responses })

        // Check if Supabase is properly initialized
        if (!supabaseAdmin) {
            console.error("Supabase admin client not initialized")
            return NextResponse.json({ error: "Database connection error" }, { status: 500 })
        }

        console.log("Supabase client initialized successfully")

        // Get user agent and IP for analytics
        const userAgent = request.headers.get("user-agent") || "Unknown"
        const forwarded = request.headers.get("x-forwarded-for")
        const ip = forwarded ? forwarded.split(",")[0] : "Unknown"

        const insertData = {
            user_data: userData,
            responses: responses,
            test_version: "1.0",
            user_agent: userAgent,
            ip_address: ip,
        }

        console.log("Data to insert:", JSON.stringify(insertData, null, 2))

        try {
            // Insert into Supabase
            const { data, error } = await supabaseAdmin.from("user_test_results").insert([insertData]).select()

            console.log("Supabase insert result:", { data, error })

            if (error) {
                console.error("Supabase error details:", {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code,
                })
                return NextResponse.json(
                    {
                        error: error.message,
                        details: error.details,
                        hint: error.hint,
                    },
                    { status: 500 },
                )
            }

            console.log("Successfully inserted data:", data)

            return NextResponse.json(
                {
                    success: true,
                    message: "Test results saved successfully",
                    id: data?.[0]?.id,
                    insertedData: data?.[0],
                },
                { status: 201 },
            )
        } catch (dbError) {
            console.error("Database operation error:", dbError)
            return NextResponse.json(
                {
                    error: "Database operation failed",
                    details: dbError instanceof Error ? dbError.message : String(dbError),
                },
                { status: 500 },
            )
        }
    } catch (error) {
        console.error("API error:", error)
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        )
    }
}

export async function GET(request: NextRequest) {
    try {
        console.log("=== API GET /test-results called ===")

        const { searchParams } = new URL(request.url)
        const limit = Number.parseInt(searchParams.get("limit") || "50")
        const offset = Number.parseInt(searchParams.get("offset") || "0")

        console.log("Query params:", { limit, offset })

        // Check if Supabase is properly initialized
        if (!supabaseAdmin) {
            console.error("Supabase admin client not initialized")
            return NextResponse.json({ error: "Database connection error" }, { status: 500 })
        }

        console.log("Supabase client initialized for GET request")

        try {
            const { data, error, count } = await supabaseAdmin
                .from("user_test_results")
                .select("*", { count: "exact" })
                .order("created_at", { ascending: false })
                .range(offset, offset + limit - 1)

            console.log("Supabase query result:", {
                dataCount: data?.length || 0,
                totalCount: count,
                error: error?.message,
            })

            if (error) {
                console.error("Supabase GET error:", error)
                return NextResponse.json({ error: error.message }, { status: 500 })
            }

            console.log("Successfully fetched data:", data?.length || 0, "records")

            return NextResponse.json({
                data: data || [],
                total: count || 0,
                limit,
                offset,
            })
        } catch (dbError) {
            console.error("Database operation error:", dbError)
            return NextResponse.json(
                {
                    error: "Database operation failed",
                    details: dbError instanceof Error ? dbError.message : String(dbError),
                },
                { status: 500 },
            )
        }
    } catch (error) {
        console.error("API GET error:", error)
        return NextResponse.json(
            {
                error: "Internal server error",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 },
        )
    }
}
