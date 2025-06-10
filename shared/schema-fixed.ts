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
  content: text("content"),
  imageUrl: text("image_url"),
  order: integer("order").default(0),
  isVisible: boolean("is_visible").default(true),
  customStyles: jsonb("custom_styles"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  difficulty_level: integer("difficulty_level").default(1),
  total_levels: integer("total_levels").default(1),
  base_price_brl: numeric("base_price_brl", { precision: 10, scale: 2 }),
  is_active: boolean("is_active").default(true),
  featured_image: text("featured_image"),
  tags: text("tags").array().default([]),
  requirements: text("requirements").array().default([]),
  what_you_learn: text("what_you_learn").array().default([]),
  includes: text("includes").array().default([]),
  instructor: text("instructor"),
  estimated_duration: text("estimated_duration"),
  certification_available: boolean("certification_available").default(false),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const courseLevels = pgTable("course_levels", {
  id: serial("id").primaryKey(),
  course_id: integer("course_id").references(() => courses.id).notNull(),
  level_number: integer("level_number").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price_brl: numeric("price_brl", { precision: 10, scale: 2 }),
  content_modules: jsonb("content_modules"),
  duration_hours: integer("duration_hours"),
  materials_included: text("materials_included").array().default([]),
  unlock_requirements: text("unlock_requirements").array().default([]),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
});

export const courseEnrollments = pgTable("course_enrollments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  course_id: integer("course_id").references(() => courses.id).notNull(),
  enrollment_type: text("enrollment_type").notNull(), // full_course, single_level
  level_id: integer("level_id").references(() => courseLevels.id),
  status: text("status").default("active"), // active, completed, cancelled
  progress_percentage: integer("progress_percentage").default(0),
  purchase_price_brl: numeric("purchase_price_brl", { precision: 10, scale: 2 }),
  enrolled_at: timestamp("enrolled_at").defaultNow(),
  completed_at: timestamp("completed_at"),
});

export const grimoires = pgTable("grimoires", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  author: text("author").notNull(),
  level: text("level").notNull(), // iniciante, intermediario, avancado
  access_level: text("access_level").notNull(), // free, premium, vip
  purchase_price_brl: numeric("purchase_price_brl", { precision: 10, scale: 2 }),
  rental_price_brl: numeric("rental_price_brl", { precision: 10, scale: 2 }),
  chapter_price_brl: numeric("chapter_price_brl", { precision: 10, scale: 2 }),
  rental_days: integer("rental_days").default(30),
  total_chapters: integer("total_chapters").default(1),
  pdf_url: text("pdf_url"),
  cover_image: text("cover_image"),
  enable_rental: boolean("enable_rental").default(false),
  enable_purchase: boolean("enable_purchase").default(true),
  enable_chapter_purchase: boolean("enable_chapter_purchase").default(false),
  enable_online_reading: boolean("enable_online_reading").default(true),
  tags: text("tags").array().default([]),
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const grimoireChapters = pgTable("grimoire_chapters", {
  id: serial("id").primaryKey(),
  grimoire_id: integer("grimoire_id").references(() => grimoires.id).notNull(),
  chapter_number: integer("chapter_number").notNull(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary"),
  is_preview: boolean("is_preview").default(false),
  created_at: timestamp("created_at").defaultNow(),
});

export const grimoireAccess = pgTable("grimoire_access", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  grimoire_id: integer("grimoire_id").references(() => grimoires.id).notNull(),
  access_type: text("access_type").notNull(), // purchase, rental, chapter
  chapter_id: integer("chapter_id").references(() => grimoireChapters.id),
  granted_at: timestamp("granted_at").defaultNow(),
  expires_at: timestamp("expires_at"),
  purchase_price_brl: numeric("purchase_price_brl", { precision: 10, scale: 2 }),
  is_active: boolean("is_active").default(true),
});

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  item_type: text("item_type").notNull(), // course, grimoire, credits, vip
  item_id: text("item_id"),
  amount_brl: numeric("amount_brl", { precision: 10, scale: 2 }).notNull(),
  payment_method: text("payment_method").notNull(), // pix, paypal, stripe
  payment_provider: text("payment_provider").notNull(),
  provider_payment_id: text("provider_payment_id"),
  status: text("status").default("pending"), // pending, completed, failed, cancelled
  provider_status: text("provider_status"),
  metadata: jsonb("metadata"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const vozPlumaManifestations = pgTable("voz_pluma_manifestations", {
  id: serial("id").primaryKey(),
  manifestation_time: text("manifestation_time").notNull(), // '07:00', '09:00', '11:00'
  type: text("type").notNull(), // 'ritual', 'verso', 'reflexao'
  title: text("title").notNull(),
  content: text("content").notNull(),
  author: text("author").notNull(),
  posted_date: text("posted_date").notNull(), // YYYY-MM-DD
  posted_at: timestamp("posted_at").defaultNow(),
  is_current: boolean("is_current").default(true),
});

export const oracleConsultations = pgTable("oracle_consultations", {
  id: serial("id").primaryKey(),
  user_id: text("user_id"),
  consultation_type: text("consultation_type").notNull(), // tarot, runes, mirror, fire, abyssal
  question: text("question").notNull(),
  response: jsonb("response").notNull(),
  cost_credits: integer("cost_credits").default(0),
  ritual_type: text("ritual_type"), // for ritual consultations
  entity_name: text("entity_name"), // for ritual consultations
  created_at: timestamp("created_at").defaultNow(),
});

export const tkazhTransactions = pgTable("tkazh_transactions", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  transaction_type: text("transaction_type").notNull(), // credit, debit, purchase, bonus
  amount: integer("amount").notNull(),
  description: text("description").notNull(),
  reference_type: text("reference_type"), // oracle, course, vip, manual
  reference_id: text("reference_id"),
  created_at: timestamp("created_at").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  message: text("message").notNull(),
  response: text("response").notNull(),
  chat_type: text("chat_type").notNull(), // free, premium
  cost_credits: integer("cost_credits").default(0),
  created_at: timestamp("created_at").defaultNow(),
});

export const personalSeals = pgTable("personal_seals", {
  id: serial("id").primaryKey(),
  user_id: integer("user_id").references(() => users.id).notNull(),
  magical_name: text("magical_name").notNull(),
  seal_image_url: text("seal_image_url").notNull(),
  seal_description: text("seal_description").notNull(),
  energy_type: text("energy_type").notNull(),
  generated_at: timestamp("generated_at").defaultNow(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  author: text("author").notNull(),
  category: text("category").notNull(),
  tags: text("tags").array().default([]),
  featured_image: text("featured_image"),
  seo_title: text("seo_title"),
  seo_description: text("seo_description"),
  is_published: boolean("is_published").default(false),
  published_at: timestamp("published_at"),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  subscription_type: text("subscription_type").default("general"),
  preferences: jsonb("preferences"),
  is_active: boolean("is_active").default(true),
  subscribed_at: timestamp("subscribed_at").defaultNow(),
  unsubscribed_at: timestamp("unsubscribed_at"),
});

// Types
export type User = typeof users.$inferSelect;
export type Course = typeof courses.$inferSelect;
export type CourseLevel = typeof courseLevels.$inferSelect;
export type CourseEnrollment = typeof courseEnrollments.$inferSelect;
export type Grimoire = typeof grimoires.$inferSelect;
export type GrimoireChapter = typeof grimoireChapters.$inferSelect;
export type GrimoireAccess = typeof grimoireAccess.$inferSelect;
export type Payment = typeof payments.$inferSelect;
export type VozPlumaManifestation = typeof vozPlumaManifestations.$inferSelect;
export type OracleConsultation = typeof oracleConsultations.$inferSelect;
export type TkazhTransaction = typeof tkazhTransactions.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type PersonalSeal = typeof personalSeals.$inferSelect;
export type BlogPost = typeof blogPosts.$inferSelect;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type ContentSection = typeof contentSections.$inferSelect;
export type SiteConfig = typeof siteConfig.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;

// Insert Types
export type InsertUser = typeof users.$inferInsert;
export type InsertCourse = typeof courses.$inferInsert;
export type InsertCourseLevel = typeof courseLevels.$inferInsert;
export type InsertCourseEnrollment = typeof courseEnrollments.$inferInsert;
export type InsertGrimoire = typeof grimoires.$inferInsert;
export type InsertGrimoireChapter = typeof grimoireChapters.$inferInsert;
export type InsertGrimoireAccess = typeof grimoireAccess.$inferInsert;
export type InsertPayment = typeof payments.$inferInsert;
export type InsertVozPlumaManifestation = typeof vozPlumaManifestations.$inferInsert;
export type InsertOracleConsultation = typeof oracleConsultations.$inferInsert;
export type InsertTkazhTransaction = typeof tkazhTransactions.$inferInsert;
export type InsertChatMessage = typeof chatMessages.$inferInsert;
export type InsertPersonalSeal = typeof personalSeals.$inferInsert;
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
export type InsertContentSection = typeof contentSections.$inferInsert;
export type InsertSiteConfig = typeof siteConfig.$inferInsert;
export type InsertAdminSession = typeof adminSessions.$inferInsert;

// Insert Schemas
export const insertUserSchema = createInsertSchema(users);
export const insertCourseSchema = createInsertSchema(courses);
export const insertCourseLevelSchema = createInsertSchema(courseLevels);
export const insertCourseEnrollmentSchema = createInsertSchema(courseEnrollments);
export const insertGrimoireSchema = createInsertSchema(grimoires);
export const insertGrimoireChapterSchema = createInsertSchema(grimoireChapters);
export const insertGrimoireAccessSchema = createInsertSchema(grimoireAccess);
export const insertPaymentSchema = createInsertSchema(payments);
export const insertVozPlumaManifestationSchema = createInsertSchema(vozPlumaManifestations);
export const insertOracleConsultationSchema = createInsertSchema(oracleConsultations);
export const insertTkazhTransactionSchema = createInsertSchema(tkazhTransactions);
export const insertChatMessageSchema = createInsertSchema(chatMessages);
export const insertPersonalSealSchema = createInsertSchema(personalSeals);
export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers);
export const insertContentSectionSchema = createInsertSchema(contentSections);
export const insertSiteConfigSchema = createInsertSchema(siteConfig);
export const insertAdminSessionSchema = createInsertSchema(adminSessions);