import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),

  initiation_level: integer("initiation_level").default(0),
  personal_seal_generated: boolean("personal_seal_generated").default(false),
  personal_seal_url: text("personal_seal_url"),
  magical_name: text("magical_name"),
  member_type: text("member_type").default("initiate"), // initiate, member
  role: text("role").notNull().default("user"),

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
  price_brl: integer("price_brl").notNull().default(0), // Price in Brazilian Real (centavos)
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
  price_brl: integer("price_brl").default(2000), // Purchase price in centavos (R$ 20.00)
  rental_price_brl: integer("rental_price_brl").default(500), // Rental price in centavos (R$ 5.00)
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
  cost_brl: integer("cost_brl").default(300), // Cost in centavos (R$ 3.00)
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

export const blog_posts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  tags: text("tags").array().notNull().default([]),
  featured: boolean("featured").default(false),
  published: boolean("published").default(false),
  readTime: integer("read_time").notNull(),
  publishedAt: timestamp("published_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const blog_categories = pgTable("blog_categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull().unique(),
  description: text("description"),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  color: varchar("color", { length: 7 }).default("#6366f1"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const blog_tags = pgTable("blog_tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 30 }).notNull().unique(),
  slug: varchar("slug", { length: 30 }).notNull().unique(),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const newsletter_subscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  subscribedAt: timestamp("subscribed_at").defaultNow(),
  active: boolean("active").default(true),
  confirmationToken: varchar("confirmation_token", { length: 100 }),
  confirmedAt: timestamp("confirmed_at"),
});

export const susurri_abyssos = pgTable("susurri_abyssos", {
  id: serial("id").primaryKey(),
  phrase: text("phrase").notNull(),
  author: text("author"),
  category: text("category").notNull().default("wisdom"), // wisdom, darkness, power, transformation
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").default(0),
  aiGenerated: boolean("ai_generated").notNull().default(false),
  generationPrompt: text("generation_prompt"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const api_configurations = pgTable("api_configurations", {
  id: serial("id").primaryKey(),
  serviceName: text("service_name").notNull().unique(), // openai, paypal, mercadopago, infinitepay, pagseguro
  displayName: text("display_name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // payments, ai, notifications, etc
  isEnabled: boolean("is_enabled").notNull().default(false),
  configuration: jsonb("configuration").notNull().default({}), // API keys, endpoints, settings
  testEndpoint: text("test_endpoint"), // URL to test API connection
  lastTested: timestamp("last_tested"),
  testStatus: text("test_status"), // success, failed, never_tested
  testMessage: text("test_message"),
  priority: integer("priority").default(0), // Order within category
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  price_brl: true,
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
  price_brl: true,
  rental_price_brl: true,
  pdf_url: true,
  cover_image: true,
  is_active: true,
});

export const insertOracleSessionSchema = createInsertSchema(oracle_sessions).omit({
  id: true,
  session_date: true,
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

export const insertBlogPostSchema = createInsertSchema(blog_posts).omit({
  id: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBlogCategorySchema = createInsertSchema(blog_categories).omit({
  id: true,
  createdAt: true,
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletter_subscribers).omit({
  id: true,
  subscribedAt: true,
  active: true,
  confirmationToken: true,
  confirmedAt: true,
});

export const insertSusurriAbyssosSchema = createInsertSchema(susurri_abyssos).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertApiConfigurationSchema = createInsertSchema(api_configurations).omit({
  id: true,
  lastTested: true,
  testStatus: true,
  testMessage: true,
  createdAt: true,
  updatedAt: true,
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

// Blog types
export type BlogPost = typeof blog_posts.$inferSelect;
export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type BlogCategory = typeof blog_categories.$inferSelect;
export type InsertBlogCategory = z.infer<typeof insertBlogCategorySchema>;
export type BlogTag = typeof blog_tags.$inferSelect;
export type NewsletterSubscriber = typeof newsletter_subscribers.$inferSelect;
export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type SusurriAbyssos = typeof susurri_abyssos.$inferSelect;
export type InsertSusurriAbyssos = z.infer<typeof insertSusurriAbyssosSchema>;
export type ApiConfiguration = typeof api_configurations.$inferSelect;
export type InsertApiConfiguration = z.infer<typeof insertApiConfigurationSchema>;
