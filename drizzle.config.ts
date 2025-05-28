import type { Config } from "drizzle-kit"
import { env } from "process"

export default {
    schema: "./lib/db/schema.ts",
    out: "./drizzle",
    connectionString: env.POSTGRES_URL || "",
} satisfies Config
