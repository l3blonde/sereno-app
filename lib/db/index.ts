import { drizzle } from "drizzle-orm/vercel-postgres"
import { sql } from "@vercel/postgres"

// Initialize Drizzle with the Vercel Postgres client
export const db = drizzle(sql)

// Export all tables from the schema
export * from "./schema"
