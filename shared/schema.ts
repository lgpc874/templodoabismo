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

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  role: true,
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
