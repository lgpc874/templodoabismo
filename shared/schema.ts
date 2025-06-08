
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  tkazh_credits: integer("tkazh_credits").default(0),
  free_credits: integer("free_credits").default(10),
  last_credit_reset: text("last_credit_reset"),
  personal_seal_generated: integer("personal_seal_generated", { mode: "boolean" }).default(false),
  initiation_level: integer("initiation_level").default(0),
  created_at: text("created_at").default("datetime('now')"),
});

export const grimoires = sqliteTable("grimoires", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  price_tkazh: integer("price_tkazh"),
  price_real: real("price_real"),
  is_free: integer("is_free", { mode: "boolean" }).default(false),
  chapter_count: integer("chapter_count").default(1),
  image_url: text("image_url"),
});

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: integer("level").notNull(), // 1-7 para níveis iniciáticos
  is_professional: integer("is_professional", { mode: "boolean" }).default(false),
  price_real: real("price_real"),
  modules: text("modules"), // JSON string
  requirements: text("requirements"),
  image_url: text("image_url"),
});

export const oracles = sqliteTable("oracles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  tkazh_cost: integer("tkazh_cost").notNull(),
  oracle_type: text("oracle_type").notNull(), // tarot, mirror, runes, flames, voice
});

export const oracle_sessions = sqliteTable("oracle_sessions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").references(() => users.id),
  oracle_id: integer("oracle_id").references(() => oracles.id),
  question: text("question").notNull(),
  response: text("response").notNull(),
  created_at: text("created_at").default("datetime('now')"),
});

export const user_grimoire_access = sqliteTable("user_grimoire_access", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").references(() => users.id),
  grimoire_id: integer("grimoire_id").references(() => grimoires.id),
  access_type: text("access_type").notNull(), // full, chapter, rental
  expires_at: text("expires_at"),
  purchased_at: text("purchased_at").default("datetime('now')"),
});

export const user_courses = sqliteTable("user_courses", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  user_id: integer("user_id").references(() => users.id),
  course_id: integer("course_id").references(() => courses.id),
  progress: integer("progress").default(0),
  completed: integer("completed", { mode: "boolean" }).default(false),
  enrolled_at: text("enrolled_at").default("datetime('now')"),
});

export const plume_posts = sqliteTable("plume_posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").default("Voz da Pluma"),
  created_at: text("created_at").default("datetime('now')"),
  is_featured: integer("is_featured", { mode: "boolean" }).default(false),
});

export const site_settings = sqliteTable("site_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updated_at: text("updated_at").default("datetime('now')"),
});

export const admin_users = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  created_at: text("created_at").default("datetime('now')"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  oracleSessions: many(oracle_sessions),
  grimoireAccess: many(user_grimoire_access),
  courses: many(user_courses),
}));

export const grimoiresRelations = relations(grimoires, ({ many }) => ({
  userAccess: many(user_grimoire_access),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  userCourses: many(user_courses),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
});

export const insertGrimoireSchema = createInsertSchema(grimoires).omit({
  id: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertOracleSessionSchema = createInsertSchema(oracle_sessions).omit({
  id: true,
  created_at: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Grimoire = typeof grimoires.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type Oracle = typeof oracles.$inferSelect;
export type OracleSession = typeof oracle_sessions.$inferSelect;
export type PlumePost = typeof plume_posts.$inferSelect;
