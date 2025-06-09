import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  tkazh_credits: integer("tkazh_credits").default(10),
  free_credits: integer("free_credits").default(3),
  initiation_level: integer("initiation_level").default(0),
  personal_seal_generated: boolean("personal_seal_generated").default(false),
  personal_seal_url: text("personal_seal_url"),
  magical_name: text("magical_name"),
  member_type: text("member_type").default("initiate"), // initiate, member, vip
  role: text("role").notNull().default("user"),
  last_credit_reset: timestamp("last_credit_reset").defaultNow(),
  oracle_uses_today: integer("oracle_uses_today").default(0),
  last_oracle_use: timestamp("last_oracle_use"),
  courses_completed: text("courses_completed").array().default([]),
  achievements: text("achievements").array().default([]),
  join_date: timestamp("join_date").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminSessions = pgTable("admin_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteConfig = pgTable("site_config", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: jsonb("value").notNull(),
  category: text("category").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const contentSections = pgTable("content_sections", {
  id: serial("id").primaryKey(),
  pageId: text("page_id").notNull(),
  sectionType: text("section_type").notNull(),
  title: text("title"),
  content: jsonb("content").notNull(),
  order: integer("order").notNull().default(0),
  isEnabled: boolean("is_enabled").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const mediaAssets = pgTable("media_assets", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  size: integer("size").notNull(),
  url: text("url").notNull(),
  alt: text("alt"),
  tags: text("tags").array(),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  target: text("target").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const backups = pgTable("backups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  size: integer("size").notNull(),
  path: text("path").notNull(),
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Templo do Abismo specific tables
export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: integer("level").notNull().default(1),
  price_tkazh: integer("price_tkazh").notNull().default(0),
  modules: jsonb("modules").notNull(),
  requirements: text("requirements").array().default([]),
  rewards: text("rewards").array().default([]),
  type: text("type").notNull().default("initiation"),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const grimoires = pgTable("grimoires", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  chapters: jsonb("chapters").notNull(),
  access_level: integer("access_level").default(0),
  price_tkazh: integer("price_tkazh").default(5),
  rental_price_tkazh: integer("rental_price_tkazh").default(2),
  rental_days: integer("rental_days").default(7),
  pdf_url: text("pdf_url"),
  cover_image: text("cover_image"),
  can_read_online: boolean("can_read_online").default(true),
  can_download: boolean("can_download").default(true),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const grimoire_rentals = pgTable("grimoire_rentals", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  grimoire_id: integer("grimoire_id").references(() => grimoires.id).notNull(),
  expires_at: timestamp("expires_at").notNull(),
  created_at: timestamp("created_at").defaultNow(),
});

export const daily_quotes = pgTable("daily_quotes", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  date: timestamp("date").notNull(),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const pluma_shares = pgTable("pluma_shares", {
  id: serial("id").primaryKey(),
  poem_id: integer("poem_id").references(() => daily_poems.id).notNull(),
  image_url: text("image_url"),
  share_count: integer("share_count").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

export const course_progress = pgTable("course_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  course_id: integer("course_id").references(() => courses.id).notNull(),
  module_index: integer("module_index").default(0),
  completed: boolean("completed").default(false),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow(),
});

export const oracle_sessions = pgTable("oracle_sessions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  oracle_type: text("oracle_type").notNull(),
  question: text("question"),
  result: jsonb("result").notNull(),
  tkazh_cost: integer("tkazh_cost").default(1),
  session_date: timestamp("session_date").defaultNow(),
});

export const daily_poems = pgTable("daily_poems", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  date: timestamp("date").notNull(),
  author: text("author").default("Voz da Pluma"),
  is_ai_generated: boolean("is_ai_generated").default(true),
  published: boolean("published").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const user_progress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  course_id: integer("course_id").references(() => courses.id).notNull(),
  current_module: integer("current_module").default(0),
  completed_modules: text("completed_modules").array().default([]),
  progress_percentage: integer("progress_percentage").default(0),
  started_at: timestamp("started_at").defaultNow(),
  completed_at: timestamp("completed_at"),
});

export const liber_access = pgTable("liber_access", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  power_word: text("power_word").notNull(),
  access_granted: timestamp("access_granted").defaultNow(),
  expires_at: timestamp("expires_at"),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  magical_name: true,
  member_type: true,
  role: true,
});

export const insertCourseSchema = createInsertSchema(courses).pick({
  title: true,
  description: true,
  level: true,
  price_tkazh: true,
  modules: true,
  requirements: true,
  rewards: true,
  type: true,
  is_active: true,
});

export const insertGrimoireSchema = createInsertSchema(grimoires).pick({
  title: true,
  description: true,
  chapters: true,
  access_level: true,
  price_tkazh: true,
  pdf_url: true,
  cover_image: true,
  is_active: true,
});

export const insertOracleSessionSchema = createInsertSchema(oracle_sessions).pick({
  user_id: true,
  oracle_type: true,
  question: true,
  result: true,
  tkazh_cost: true,
});

export const insertDailyPoemSchema = createInsertSchema(daily_poems).pick({
  title: true,
  content: true,
  date: true,
  author: true,
  is_ai_generated: true,
  published: true,
});

export const insertSiteConfigSchema = createInsertSchema(siteConfig).pick({
  key: true,
  value: true,
  category: true,
});

export const insertContentSectionSchema = createInsertSchema(contentSections).pick({
  pageId: true,
  sectionType: true,
  title: true,
  content: true,
  order: true,
  isEnabled: true,
});

export const insertMediaAssetSchema = createInsertSchema(mediaAssets).pick({
  filename: true,
  originalName: true,
  mimeType: true,
  size: true,
  url: true,
  alt: true,
  tags: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).pick({
  userId: true,
  action: true,
  target: true,
  metadata: true,
});

export const insertBackupSchema = createInsertSchema(backups).pick({
  name: true,
  type: true,
  size: true,
  path: true,
  createdBy: true,
});

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type AdminSession = typeof adminSessions.$inferSelect;
export type SiteConfig = typeof siteConfig.$inferSelect;
export type InsertSiteConfig = z.infer<typeof insertSiteConfigSchema>;
export type ContentSection = typeof contentSections.$inferSelect;
export type InsertContentSection = z.infer<typeof insertContentSectionSchema>;
export type MediaAsset = typeof mediaAssets.$inferSelect;
export type InsertMediaAsset = z.infer<typeof insertMediaAssetSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type Backup = typeof backups.$inferSelect;
export type InsertBackup = z.infer<typeof insertBackupSchema>;
export type LoginRequest = z.infer<typeof loginSchema>;

// Templo do Abismo types
export type Course = typeof courses.$inferSelect;
export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Grimoire = typeof grimoires.$inferSelect;
export type InsertGrimoire = z.infer<typeof insertGrimoireSchema>;
export type OracleSession = typeof oracle_sessions.$inferSelect;
export type InsertOracleSession = z.infer<typeof insertOracleSessionSchema>;
export type DailyPoem = typeof daily_poems.$inferSelect;
export type InsertDailyPoem = z.infer<typeof insertDailyPoemSchema>;
export type UserProgress = typeof user_progress.$inferSelect;
export type LiberAccess = typeof liber_access.$inferSelect;
