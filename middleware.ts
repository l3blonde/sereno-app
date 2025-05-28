import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simple middleware that allows all routes
export function middleware(_request: NextRequest) {
    // Allow all routes
    return NextResponse.next()
}

// Keep the matcher configuration for future use
export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
