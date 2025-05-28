import { pgTable, serial, text, timestamp, integer, boolean } from "drizzle-orm/pg-core"

// User profiles
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Breathing sessions
export const breathingSessions = pgTable("breathing_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  exerciseId: text("exercise_id").notNull(),
  duration: integer("duration").notNull(), // in seconds
  completed: boolean("completed").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// Meditation sessions
export const meditationSessions = pgTable("meditation_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  experienceId: text("experience_id").notNull(),
  duration: integer("duration").notNull(), // in seconds
  completed: boolean("completed").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// User settings
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id")
      .references(() => users.id)
      .unique(),
  notifications: boolean("notifications").default(true),
  darkMode: boolean("dark_mode").default(true),
  hapticFeedback: boolean("haptic_feedback").default(true),
  backgroundAudio: boolean("background_audio").default(true),
  highContrast: boolean("high_contrast").default(false),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})
