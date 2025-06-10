import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, numeric } from "drizzle-orm/pg-core";
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
  member_type: text("member_type").default("visitante"), // visitante, iniciado, vip
  role: text("role").notNull().default("user"),

  // Sistema T'KAZH (créditos)
  tkazh_credits: integer("tkazh_credits").default(100), // Créditos atuais
  tkazh_purchased: integer("tkazh_purchased").default(0), // Créditos comprados (não resetam)
  last_weekly_reset: timestamp("last_weekly_reset").defaultNow(),
  vip_daily_bonus: boolean("vip_daily_bonus").default(false),
  last_daily_bonus: timestamp("last_daily_bonus"),

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

// Sistema T'KAZH (Créditos)
export const tkazhTransactions = pgTable("tkazh_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // gain, spend, purchase, bonus, reset
  amount: integer("amount").notNull(),
  reason: text("reason").notNull(),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Uso de Oráculos
export const oracleUsage = pgTable("oracle_usage", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  oracleType: text("oracle_type").notNull(),
  question: text("question").notNull(),
  result: jsonb("result").notNull(),
  creditsCost: integer("credits_cost").notNull(),
  usedAt: timestamp("used_at").defaultNow(),
  weeklyReset: timestamp("weekly_reset").notNull(),
});

// Selos Pessoais
export const personalSeals = pgTable("personal_seals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull().unique(),
  magicalName: text("magical_name").notNull(),
  sealImageUrl: text("seal_image_url").notNull(),
  sealDescription: text("seal_description"),
  energyType: text("energy_type"),
  generatedAt: timestamp("generated_at").defaultNow(),
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
  short_description: text("short_description").notNull(), // Para a página de listagem
  full_description: text("full_description").notNull(), // Para a página individual
  slug: text("slug").notNull().unique(), // Para URLs amigáveis
  category: text("category").default("luciferiano"),
  difficulty_level: integer("difficulty_level").default(1), // 1-5
  total_levels: integer("total_levels").default(1), // Quantos níveis o curso tem
  full_course_price_brl: numeric("full_course_price_brl", { precision: 10, scale: 2 }).default("0"),
  discount_percentage: integer("discount_percentage").default(30), // Desconto para curso completo
  estimated_duration_hours: integer("estimated_duration_hours").default(10),
  cover_image: text("cover_image"),
  preview_video_url: text("preview_video_url"),
  requirements: text("requirements").array().default([]),
  what_you_learn: text("what_you_learn").array().default([]),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const courseLevels = pgTable("course_levels", {
  id: serial("id").primaryKey(),
  course_id: integer("course_id").references(() => courses.id).notNull(),
  level_number: integer("level_number").notNull(), // 1, 2, 3, etc.
  title: text("title").notNull(), // Ex: "Nível 1: Fundamentos"
  description: text("description").notNull(),
  price_brl: numeric("price_brl", { precision: 10, scale: 2 }).default("0"),
  content_modules: jsonb("content_modules").notNull(), // Módulos de conteúdo do nível
  duration_hours: integer("duration_hours").default(0),
  materials_included: text("materials_included").array().default([]),
  unlock_requirements: text("unlock_requirements").array().default([]), // Requisitos para desbloquear
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  course_id: integer("course_id").references(() => courses.id).notNull(),
  enrollment_type: text("enrollment_type").notNull(), // "level" ou "full_course"
  level_id: integer("level_id").references(() => courseLevels.id), // Se comprou nível específico
  purchase_price_brl: numeric("purchase_price_brl", { precision: 10, scale: 2 }).notNull(),
  progress_percentage: integer("progress_percentage").default(0),
  completed_at: timestamp("completed_at"),
  certificate_issued: boolean("certificate_issued").default(false),
  enrolled_at: timestamp("enrolled_at").defaultNow(),
});

export const courseProgress = pgTable("course_progress", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  course_id: integer("course_id").references(() => courses.id).notNull(),
  level_id: integer("level_id").references(() => courseLevels.id).notNull(),
  module_id: text("module_id").notNull(), // ID do módulo dentro do nível
  completed: boolean("completed").default(false),
  completion_date: timestamp("completion_date"),
  notes: text("notes"), // Anotações pessoais do estudante
  created_at: timestamp("created_at").defaultNow(),
});

export const grimoires = pgTable("grimoires", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  author: text("author").default("Templo do Abismo"),
  level: integer("level").default(1), // 1-5 difficulty
  access_level: integer("access_level").default(0),
  
  // Pricing options
  purchase_price_brl: numeric("purchase_price_brl", { precision: 10, scale: 2 }).default("20.00"), // Full download price
  rental_price_brl: numeric("rental_price_brl", { precision: 10, scale: 2 }).default("5.00"), // 7-day rental
  chapter_price_brl: numeric("chapter_price_brl", { precision: 10, scale: 2 }).default("3.00"), // Per chapter
  
  rental_days: integer("rental_days").default(7),
  total_chapters: integer("total_chapters").default(1),
  
  // Content
  pdf_url: text("pdf_url"),
  cover_image: text("cover_image"),
  
  // Access types enabled
  enable_rental: boolean("enable_rental").default(true),
  enable_purchase: boolean("enable_purchase").default(true),
  enable_chapter_purchase: boolean("enable_chapter_purchase").default(true),
  enable_online_reading: boolean("enable_online_reading").default(true),
  
  tags: text("tags").array().default([]),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const grimoireChapters = pgTable("grimoire_chapters", {
  id: serial("id").primaryKey(),
  grimoire_id: integer("grimoire_id").references(() => grimoires.id).notNull(),
  chapter_number: integer("chapter_number").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  is_preview: boolean("is_preview").default(false), // Free preview chapter
  created_at: timestamp("created_at").defaultNow(),
});

export const grimoireAccess = pgTable("grimoire_access", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  grimoire_id: integer("grimoire_id").references(() => grimoires.id).notNull(),
  access_type: text("access_type").notNull(), // 'rental', 'purchase', 'chapter'
  chapter_id: integer("chapter_id").references(() => grimoireChapters.id), // For chapter purchases
  
  // Access control
  expires_at: timestamp("expires_at"), // For rentals
  downloads_remaining: integer("downloads_remaining").default(5), // For purchases
  
  // Payment info
  price_paid_brl: integer("price_paid_brl").notNull(),
  payment_id: text("payment_id"),
  
  created_at: timestamp("created_at").defaultNow(),
});

// Legacy table for compatibility
export const grimoire_rentals = pgTable("grimoire_rentals", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  grimoire_id: integer("grimoire_id").references(() => grimoires.id).notNull(),
  expires_at: timestamp("expires_at").notNull(),
  downloads: integer("downloads").default(0),
  max_downloads: integer("max_downloads").default(5),
  last_downloaded_at: timestamp("last_downloaded_at"),
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

// Voz da Pluma - Três manifestações diárias que se renovam
export const voz_pluma_manifestations = pgTable("voz_pluma_manifestations", {
  id: serial("id").primaryKey(),
  manifestation_time: text("manifestation_time").notNull(), // '07:00', '09:00', '11:00'
  type: text("type").notNull(), // 'dica', 'verso', 'ritual'
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  posted_date: date("posted_date").notNull(), // Data de postagem
  posted_at: timestamp("posted_at").defaultNow(), // Timestamp completo
  is_current: boolean("is_current").default(true), // Apenas a manifestação atual
});

export const voz_pluma_settings = pgTable("voz_pluma_settings", {
  id: serial("id").primaryKey(),
  auto_publish_enabled: boolean("auto_publish_enabled").default(true),
  manifestation_07_enabled: boolean("manifestation_07_enabled").default(true),
  manifestation_09_enabled: boolean("manifestation_09_enabled").default(true),
  manifestation_11_enabled: boolean("manifestation_11_enabled").default(true),
  last_manifestation_07: timestamp("last_manifestation_07"),
  last_manifestation_09: timestamp("last_manifestation_09"),
  last_manifestation_11: timestamp("last_manifestation_11"),
  updated_at: timestamp("updated_at").defaultNow(),
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

export const pages = pgTable("pages", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  pageType: text("page_type").notNull().default("page"), // page, grimoire, scripture, teaching
  status: text("status").notNull().default("draft"), // draft, published, private
  featuredImage: text("featured_image"),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  customCss: text("custom_css"),
  customJs: text("custom_js"),
  parentId: integer("parent_id"),
  sortOrder: integer("sort_order").default(0),
  viewCount: integer("view_count").default(0),
  isHomepage: boolean("is_homepage").default(false),
  requiresAuth: boolean("requires_auth").default(false),
  authorId: integer("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const page_revisions = pgTable("page_revisions", {
  id: serial("id").primaryKey(),
  pageId: integer("page_id").references(() => pages.id).notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  revisionNote: text("revision_note"),
  authorId: integer("author_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const media_library = pgTable("media_library", {
  id: serial("id").primaryKey(),
  filename: text("filename").notNull(),
  originalName: text("original_name").notNull(),
  mimeType: text("mime_type").notNull(),
  fileSize: integer("file_size").notNull(),
  width: integer("width"),
  height: integer("height"),
  url: text("url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  altText: text("alt_text"),
  caption: text("caption"),
  description: text("description"),
  tags: text("tags").array().default([]),
  uploadedBy: integer("uploaded_by").references(() => users.id),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const scriptures = pgTable("scriptures", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: text("category").notNull(), // luciferian, abyssal, transformation, etc
  difficulty: text("difficulty").default("beginner"), // beginner, intermediate, advanced
  estimatedReadTime: integer("estimated_read_time"),
  isPublic: boolean("is_public").default(false),
  requiresInitiation: boolean("requires_initiation").default(false),
  minimumLevel: integer("minimum_level").default(0),
  downloads: integer("downloads").default(0),
  ratings: jsonb("ratings").default([]), // Array of {userId, rating, comment}
  authorId: integer("author_id").references(() => users.id),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCourseSchema = createInsertSchema(courses);

export const insertCourseLevelSchema = createInsertSchema(courseLevels).pick({
  course_id: true,
  level_number: true,
  title: true,
  description: true,
  price_brl: true,
  content_modules: true,
  duration_hours: true,
  materials_included: true,
  unlock_requirements: true,
  is_active: true,
});

export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments).pick({
  user_id: true,
  course_id: true,
  enrollment_type: true,
  level_id: true,
  purchase_price_brl: true,
});

export const insertGrimoireSchema = createInsertSchema(grimoires).pick({
  title: true,
  description: true,
  author: true,
  level: true,
  access_level: true,
  purchase_price_brl: true,
  rental_price_brl: true,
  chapter_price_brl: true,
  rental_days: true,
  total_chapters: true,
  pdf_url: true,
  cover_image: true,
  enable_rental: true,
  enable_purchase: true,
  enable_chapter_purchase: true,
  enable_online_reading: true,
  tags: true,
  is_active: true,
});

export const insertGrimoireChapterSchema = createInsertSchema(grimoireChapters).pick({
  grimoire_id: true,
  chapter_number: true,
  title: true,
  content: true,
  summary: true,
  is_preview: true,
});

export const insertGrimoireAccessSchema = createInsertSchema(grimoireAccess).pick({
  user_id: true,
  grimoire_id: true,
  access_type: true,
  chapter_id: true,
  expires_at: true,
  downloads_remaining: true,
  price_paid_brl: true,
  payment_id: true,
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

export const insertPageSchema = createInsertSchema(pages).omit({
  id: true,
  viewCount: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPageRevisionSchema = createInsertSchema(page_revisions).omit({
  id: true,
  createdAt: true,
});

export const insertMediaLibrarySchema = createInsertSchema(media_library).omit({
  id: true,
  uploadedAt: true,
});

export const insertScriptureSchema = createInsertSchema(scriptures).omit({
  id: true,
  downloads: true,
  ratings: true,
  publishedAt: true,
  createdAt: true,
  updatedAt: true,
});

export const insertVozPlumaContentSchema = createInsertSchema(voz_pluma_content).omit({
  id: true,
  generated_at: true,
  created_at: true,
});

export const insertVozPlumaSettingsSchema = createInsertSchema(voz_pluma_settings).omit({
  id: true,
  updated_at: true,
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
export type VozPlumaContent = typeof voz_pluma_content.$inferSelect;
export type InsertVozPlumaContent = z.infer<typeof insertVozPlumaContentSchema>;
export type VozPlumaSettings = typeof voz_pluma_settings.$inferSelect;
export type InsertVozPlumaSettings = z.infer<typeof insertVozPlumaSettingsSchema>;
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
export type Page = typeof pages.$inferSelect;
export type InsertPage = z.infer<typeof insertPageSchema>;
export type PageRevision = typeof page_revisions.$inferSelect;
export type InsertPageRevision = z.infer<typeof insertPageRevisionSchema>;
export type MediaLibrary = typeof media_library.$inferSelect;
export type InsertMediaLibrary = z.infer<typeof insertMediaLibrarySchema>;
export type Scripture = typeof scriptures.$inferSelect;
export type InsertScripture = z.infer<typeof insertScriptureSchema>;
