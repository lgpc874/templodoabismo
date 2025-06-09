import {
  users,
  adminSessions,
  siteConfig,
  contentSections,
  mediaAssets,
  activityLogs,
  backups,
  courses,
  grimoires,
  oracle_sessions,
  daily_poems,
  daily_quotes,
  grimoire_rentals,
  course_progress,
  user_progress,
  liber_access,
  type User,
  type InsertUser,
  type AdminSession,
  type SiteConfig,
  type InsertSiteConfig,
  type ContentSection,
  type InsertContentSection,
  type MediaAsset,
  type InsertMediaAsset,
  type ActivityLog,
  type InsertActivityLog,
  type Backup,
  type InsertBackup,
  type Course,
  type InsertCourse,
  type Grimoire,
  type InsertGrimoire,
  type OracleSession,
  type InsertOracleSession,
  type DailyPoem,
  type InsertDailyPoem,
  blog_posts,
  blog_categories,
  blog_tags,
  newsletter_subscribers,
  type BlogPost,
  type InsertBlogPost,
  type BlogCategory,
  type InsertBlogCategory,
  type BlogTag,
  type NewsletterSubscriber,
  type InsertNewsletterSubscriber,
  susurri_abyssos,
  api_configurations,
  type SusurriAbyssos,
  type InsertSusurriAbyssos,
  type ApiConfiguration,
  type InsertApiConfiguration,
} from "@shared/schema";

import { db } from "./db";
import { eq, desc, and, lt, gte, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  
  // Admin Sessions
  createAdminSession(userId: number, token: string, expiresAt: Date): Promise<AdminSession>;
  getAdminSession(token: string): Promise<AdminSession | undefined>;
  deleteAdminSession(token: string): Promise<boolean>;
  
  // Site Configuration
  getSiteConfig(key?: string): Promise<SiteConfig[]>;
  setSiteConfig(config: InsertSiteConfig): Promise<SiteConfig>;
  deleteSiteConfig(key: string): Promise<boolean>;
  
  // Content Sections
  getContentSections(pageId?: string): Promise<ContentSection[]>;
  getContentSection(id: number): Promise<ContentSection | undefined>;
  createContentSection(section: InsertContentSection): Promise<ContentSection>;
  updateContentSection(id: number, updates: Partial<InsertContentSection>): Promise<ContentSection | undefined>;
  deleteContentSection(id: number): Promise<boolean>;
  reorderContentSections(pageId: string, sectionIds: number[]): Promise<boolean>;
  
  // Media Assets
  getMediaAssets(): Promise<MediaAsset[]>;
  getMediaAsset(id: number): Promise<MediaAsset | undefined>;
  createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset>;
  updateMediaAsset(id: number, updates: Partial<InsertMediaAsset>): Promise<MediaAsset | undefined>;
  deleteMediaAsset(id: number): Promise<boolean>;
  
  // Activity Logs
  getActivityLogs(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  
  // Backups
  getBackups(): Promise<Backup[]>;
  getBackup(id: number): Promise<Backup | undefined>;
  createBackup(backup: InsertBackup): Promise<Backup>;
  deleteBackup(id: number): Promise<boolean>;
  
  // Courses
  getCourses(): Promise<Course[]>;
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  updateCourse(id: number, updates: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;
  
  // Course Progress
  createCourseProgress(progress: any): Promise<any>;
  getUserCourseProgress(userId: number): Promise<any[]>;
  
  // Grimoires
  getGrimoires(): Promise<Grimoire[]>;
  getAllGrimoires(): Promise<Grimoire[]>;
  getGrimoire(id: number): Promise<Grimoire | undefined>;
  createGrimoire(grimoire: InsertGrimoire): Promise<Grimoire>;
  
  // Grimoire Rentals/Purchases
  createGrimoireRental(rental: any): Promise<any>;
  createGrimoirePurchase(purchase: any): Promise<any>;
  getUserGrimoireRentals(userId: number): Promise<any[]>;
  getUserGrimoirePurchases(userId: number): Promise<any[]>;
  
  // Oracle Sessions
  createOracleSession(session: InsertOracleSession): Promise<OracleSession>;
  getUserOracleHistory(userId: number): Promise<OracleSession[]>;
  
  // Daily Content
  getDailyQuote(date: Date): Promise<any>;
  createDailyQuote(quote: any): Promise<any>;
  getDailyPoem(date: Date): Promise<DailyPoem | undefined>;
  createDailyPoem(poem: InsertDailyPoem): Promise<DailyPoem>;
  getRecentPoems(days: number): Promise<DailyPoem[]>;
  
  // Stats
  getStats(): Promise<{
    totalUsers: number;
    totalPages: number;
    totalAssets: number;
    lastBackup: string | null;
  }>;
  
  // Blog
  getBlogPosts(published?: boolean): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined>;
  deleteBlogPost(id: number): Promise<boolean>;
  
  getBlogCategories(): Promise<BlogCategory[]>;
  createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory>;
  
  getBlogTags(): Promise<string[]>;
  updateTagUsage(tags: string[]): Promise<void>;
  
  subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber>;
  
  // Susurri Abyssos
  getSusurriAbyssos(): Promise<SusurriAbyssos[]>;
  getSusurriAbysso(id: number): Promise<SusurriAbyssos | undefined>;
  createSusurriAbysso(susurri: InsertSusurriAbyssos): Promise<SusurriAbyssos>;
  updateSusurriAbysso(id: number, updates: Partial<InsertSusurriAbyssos>): Promise<SusurriAbyssos | undefined>;
  deleteSusurriAbysso(id: number): Promise<boolean>;
  getRandomSusurriAbyssos(limit: number): Promise<SusurriAbyssos[]>;
  
  // API Configurations
  getApiConfigurations(): Promise<ApiConfiguration[]>;
  getApiConfiguration(serviceName: string): Promise<ApiConfiguration | undefined>;
  createApiConfiguration(config: InsertApiConfiguration): Promise<ApiConfiguration>;
  updateApiConfiguration(serviceName: string, updates: Partial<InsertApiConfiguration>): Promise<ApiConfiguration | undefined>;
  deleteApiConfiguration(serviceName: string): Promise<boolean>;
  testApiConnection(serviceName: string): Promise<{success: boolean, message: string}>;
}

export class DatabaseStorage implements IStorage {
  
  // Users
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));
    return allUsers;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [updatedUser] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount > 0;
  }

  // Admin Sessions
  async createAdminSession(userId: number, token: string, expiresAt: Date): Promise<AdminSession> {
    const [session] = await db
      .insert(adminSessions)
      .values({ userId, token, expiresAt })
      .returning();
    return session;
  }

  async getAdminSession(token: string): Promise<AdminSession | undefined> {
    const [session] = await db
      .select()
      .from(adminSessions)
      .where(eq(adminSessions.token, token));
    return session;
  }

  async deleteAdminSession(token: string): Promise<boolean> {
    const result = await db.delete(adminSessions).where(eq(adminSessions.token, token));
    return result.rowCount > 0;
  }

  // Site Configuration
  async getSiteConfig(key?: string): Promise<SiteConfig[]> {
    if (key) {
      const configs = await db.select().from(siteConfig).where(eq(siteConfig.key, key));
      return configs;
    }
    return await db.select().from(siteConfig);
  }

  async setSiteConfig(config: InsertSiteConfig): Promise<SiteConfig> {
    const [newConfig] = await db
      .insert(siteConfig)
      .values(config)
      .onConflictDoUpdate({
        target: siteConfig.key,
        set: { value: config.value, updatedAt: new Date() }
      })
      .returning();
    return newConfig;
  }

  async deleteSiteConfig(key: string): Promise<boolean> {
    const result = await db.delete(siteConfig).where(eq(siteConfig.key, key));
    return result.rowCount > 0;
  }

  // Content Sections
  async getContentSections(pageId?: string): Promise<ContentSection[]> {
    if (pageId) {
      return await db
        .select()
        .from(contentSections)
        .where(eq(contentSections.pageId, pageId))
        .orderBy(contentSections.sortOrder);
    }
    return await db.select().from(contentSections).orderBy(contentSections.sortOrder);
  }

  async getContentSection(id: number): Promise<ContentSection | undefined> {
    const [section] = await db.select().from(contentSections).where(eq(contentSections.id, id));
    return section;
  }

  async createContentSection(section: InsertContentSection): Promise<ContentSection> {
    const [newSection] = await db.insert(contentSections).values(section).returning();
    return newSection;
  }

  async updateContentSection(id: number, updates: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const [updatedSection] = await db
      .update(contentSections)
      .set(updates)
      .where(eq(contentSections.id, id))
      .returning();
    return updatedSection;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    const result = await db.delete(contentSections).where(eq(contentSections.id, id));
    return result.rowCount > 0;
  }

  async reorderContentSections(pageId: string, sectionIds: number[]): Promise<boolean> {
    try {
      for (let i = 0; i < sectionIds.length; i++) {
        await db
          .update(contentSections)
          .set({ sortOrder: i })
          .where(and(eq(contentSections.id, sectionIds[i]), eq(contentSections.pageId, pageId)));
      }
      return true;
    } catch {
      return false;
    }
  }

  // Media Assets
  async getMediaAssets(): Promise<MediaAsset[]> {
    return await db.select().from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
  }

  async getMediaAsset(id: number): Promise<MediaAsset | undefined> {
    const [asset] = await db.select().from(mediaAssets).where(eq(mediaAssets.id, id));
    return asset;
  }

  async createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset> {
    const [newAsset] = await db.insert(mediaAssets).values(asset).returning();
    return newAsset;
  }

  async updateMediaAsset(id: number, updates: Partial<InsertMediaAsset>): Promise<MediaAsset | undefined> {
    const [updatedAsset] = await db
      .update(mediaAssets)
      .set(updates)
      .where(eq(mediaAssets.id, id))
      .returning();
    return updatedAsset;
  }

  async deleteMediaAsset(id: number): Promise<boolean> {
    const result = await db.delete(mediaAssets).where(eq(mediaAssets.id, id));
    return result.rowCount > 0;
  }

  // Activity Logs
  async getActivityLogs(limit = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db.insert(activityLogs).values(log).returning();
    return newLog;
  }

  // Backups
  async getBackups(): Promise<Backup[]> {
    return await db.select().from(backups).orderBy(desc(backups.createdAt));
  }

  async getBackup(id: number): Promise<Backup | undefined> {
    const [backup] = await db.select().from(backups).where(eq(backups.id, id));
    return backup;
  }

  async createBackup(backup: InsertBackup): Promise<Backup> {
    const [newBackup] = await db.insert(backups).values(backup).returning();
    return newBackup;
  }

  async deleteBackup(id: number): Promise<boolean> {
    const result = await db.delete(backups).where(eq(backups.id, id));
    return result.rowCount > 0;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses).where(eq(courses.is_published, true));
  }

  async getAllCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db.insert(courses).values(course).returning();
    return newCourse;
  }

  async updateCourse(id: number, updates: Partial<InsertCourse>): Promise<Course | undefined> {
    const [updatedCourse] = await db
      .update(courses)
      .set(updates)
      .where(eq(courses.id, id))
      .returning();
    return updatedCourse;
  }

  async deleteCourse(id: number): Promise<boolean> {
    const result = await db.delete(courses).where(eq(courses.id, id));
    return result.rowCount > 0;
  }

  // Course Progress
  async createCourseProgress(progress: any): Promise<any> {
    const [newProgress] = await db.insert(course_progress).values(progress).returning();
    return newProgress;
  }

  async getUserCourseProgress(userId: number): Promise<any[]> {
    return await db.select().from(course_progress).where(eq(course_progress.user_id, userId));
  }

  // Grimoires
  async getGrimoires(): Promise<Grimoire[]> {
    return await db.select().from(grimoires).where(eq(grimoires.is_published, true));
  }

  async getAllGrimoires(): Promise<Grimoire[]> {
    return await db.select().from(grimoires);
  }

  async getGrimoire(id: number): Promise<Grimoire | undefined> {
    const [grimoire] = await db.select().from(grimoires).where(eq(grimoires.id, id));
    return grimoire;
  }

  async createGrimoire(grimoire: InsertGrimoire): Promise<Grimoire> {
    const [newGrimoire] = await db.insert(grimoires).values(grimoire).returning();
    return newGrimoire;
  }

  // Grimoire Rentals/Purchases
  async createGrimoireRental(rental: any): Promise<any> {
    const [newRental] = await db.insert(grimoire_rentals).values(rental).returning();
    return newRental;
  }

  async createGrimoirePurchase(purchase: any): Promise<any> {
    const [newPurchase] = await db.insert(liber_access).values({
      user_id: purchase.user_id,
      grimoire_id: purchase.grimoire_id,
      access_type: 'purchased',
      expires_at: null,
    }).returning();
    return newPurchase;
  }

  async getUserGrimoireRentals(userId: number): Promise<any[]> {
    return await db
      .select()
      .from(grimoire_rentals)
      .where(and(
        eq(grimoire_rentals.user_id, userId),
        gte(grimoire_rentals.expires_at, new Date())
      ));
  }

  async getUserGrimoirePurchases(userId: number): Promise<any[]> {
    return await db
      .select()
      .from(liber_access)
      .where(and(
        eq(liber_access.user_id, userId),
        eq(liber_access.access_type, 'purchased')
      ));
  }

  // Oracle Sessions
  async createOracleSession(session: InsertOracleSession): Promise<OracleSession> {
    const [newSession] = await db.insert(oracle_sessions).values(session).returning();
    return newSession;
  }

  async getUserOracleHistory(userId: number): Promise<OracleSession[]> {
    return await db
      .select()
      .from(oracle_sessions)
      .where(eq(oracle_sessions.user_id, userId))
      .orderBy(desc(oracle_sessions.created_at));
  }

  // Daily Content
  async getDailyQuote(date: Date): Promise<any> {
    const [quote] = await db
      .select()
      .from(daily_quotes)
      .where(eq(daily_quotes.date, date));
    return quote;
  }

  async createDailyQuote(quote: any): Promise<any> {
    const [newQuote] = await db.insert(daily_quotes).values(quote).returning();
    return newQuote;
  }

  async getDailyPoem(date: Date): Promise<DailyPoem | undefined> {
    const [poem] = await db
      .select()
      .from(daily_poems)
      .where(eq(daily_poems.date, date));
    return poem;
  }

  async createDailyPoem(poem: InsertDailyPoem): Promise<DailyPoem> {
    const [newPoem] = await db.insert(daily_poems).values(poem).returning();
    return newPoem;
  }

  async getRecentPoems(days: number): Promise<DailyPoem[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return await db
      .select()
      .from(daily_poems)
      .where(gte(daily_poems.date, cutoffDate))
      .orderBy(desc(daily_poems.date));
  }

  // Stats
  async getStats(): Promise<{
    totalUsers: number;
    totalPages: number;
    totalAssets: number;
    lastBackup: string | null;
  }> {
    const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
    const [sectionCount] = await db.select({ count: sql<number>`count(*)` }).from(contentSections);
    const [assetCount] = await db.select({ count: sql<number>`count(*)` }).from(mediaAssets);
    const [lastBackup] = await db
      .select({ createdAt: backups.createdAt })
      .from(backups)
      .orderBy(desc(backups.createdAt))
      .limit(1);

    return {
      totalUsers: userCount.count,
      totalPages: sectionCount.count,
      totalAssets: assetCount.count,
      lastBackup: lastBackup?.createdAt?.toISOString() || null,
    };
  }

  // Blog methods
  async getBlogPosts(published?: boolean): Promise<BlogPost[]> {
    let query = db.select().from(blog_posts);
    
    if (published !== undefined) {
      query = query.where(eq(blog_posts.published, published));
    }
    
    return await query.orderBy(desc(blog_posts.publishedAt));
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blog_posts).where(eq(blog_posts.id, id));
    return post;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [post] = await db.select().from(blog_posts).where(eq(blog_posts.slug, slug));
    return post;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [newPost] = await db.insert(blog_posts).values(post).returning();
    
    // Update tag usage
    if (post.tags && post.tags.length > 0) {
      await this.updateTagUsage(post.tags);
    }
    
    return newPost;
  }

  async updateBlogPost(id: number, updates: Partial<InsertBlogPost>): Promise<BlogPost | undefined> {
    const [updatedPost] = await db
      .update(blog_posts)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(blog_posts.id, id))
      .returning();
    
    // Update tag usage if tags were changed
    if (updates.tags && updates.tags.length > 0) {
      await this.updateTagUsage(updates.tags);
    }
    
    return updatedPost;
  }

  async deleteBlogPost(id: number): Promise<boolean> {
    const result = await db.delete(blog_posts).where(eq(blog_posts.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getBlogCategories(): Promise<BlogCategory[]> {
    return await db.select().from(blog_categories).orderBy(blog_categories.name);
  }

  async createBlogCategory(category: InsertBlogCategory): Promise<BlogCategory> {
    const [newCategory] = await db.insert(blog_categories).values(category).returning();
    return newCategory;
  }

  async getBlogTags(): Promise<string[]> {
    const tags = await db.select({ name: blog_tags.name }).from(blog_tags).orderBy(desc(blog_tags.usageCount));
    return tags.map(tag => tag.name);
  }

  async updateTagUsage(tags: string[]): Promise<void> {
    for (const tagName of tags) {
      // Check if tag exists
      const [existingTag] = await db.select().from(blog_tags).where(eq(blog_tags.name, tagName));
      
      if (existingTag) {
        // Increment usage count
        await db
          .update(blog_tags)
          .set({ usageCount: existingTag.usageCount + 1 })
          .where(eq(blog_tags.id, existingTag.id));
      } else {
        // Create new tag
        await db.insert(blog_tags).values({
          name: tagName,
          slug: tagName.toLowerCase().replace(/\s+/g, '-'),
          usageCount: 1,
        });
      }
    }
  }

  async subscribeNewsletter(subscriber: InsertNewsletterSubscriber): Promise<NewsletterSubscriber> {
    const [newSubscriber] = await db.insert(newsletter_subscribers).values(subscriber).returning();
    return newSubscriber;
  }

  // Susurri Abyssos
  async getSusurriAbyssos(): Promise<SusurriAbyssos[]> {
    return await db
      .select()
      .from(susurri_abyssos)
      .where(eq(susurri_abyssos.isActive, true))
      .orderBy(susurri_abyssos.displayOrder, susurri_abyssos.createdAt);
  }

  async getSusurriAbysso(id: number): Promise<SusurriAbyssos | undefined> {
    const [susurri] = await db
      .select()
      .from(susurri_abyssos)
      .where(eq(susurri_abyssos.id, id));
    return susurri;
  }

  async createSusurriAbysso(susurri: InsertSusurriAbyssos): Promise<SusurriAbyssos> {
    const [newSusurri] = await db
      .insert(susurri_abyssos)
      .values(susurri)
      .returning();
    return newSusurri;
  }

  async updateSusurriAbysso(id: number, updates: Partial<InsertSusurriAbyssos>): Promise<SusurriAbyssos | undefined> {
    const [updated] = await db
      .update(susurri_abyssos)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(susurri_abyssos.id, id))
      .returning();
    return updated;
  }

  async deleteSusurriAbysso(id: number): Promise<boolean> {
    const result = await db
      .delete(susurri_abyssos)
      .where(eq(susurri_abyssos.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getRandomSusurriAbyssos(limit: number): Promise<SusurriAbyssos[]> {
    return await db
      .select()
      .from(susurri_abyssos)
      .where(eq(susurri_abyssos.isActive, true))
      .orderBy(sql`RANDOM()`)
      .limit(limit);
  }

  // API Configurations
  async getApiConfigurations(): Promise<ApiConfiguration[]> {
    return await db
      .select()
      .from(api_configurations)
      .orderBy(api_configurations.category, api_configurations.priority);
  }

  async getApiConfiguration(serviceName: string): Promise<ApiConfiguration | undefined> {
    const [config] = await db
      .select()
      .from(api_configurations)
      .where(eq(api_configurations.serviceName, serviceName));
    return config;
  }

  async createApiConfiguration(config: InsertApiConfiguration): Promise<ApiConfiguration> {
    const [newConfig] = await db
      .insert(api_configurations)
      .values(config)
      .returning();
    return newConfig;
  }

  async updateApiConfiguration(serviceName: string, updates: Partial<InsertApiConfiguration>): Promise<ApiConfiguration | undefined> {
    const [updated] = await db
      .update(api_configurations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(api_configurations.serviceName, serviceName))
      .returning();
    return updated;
  }

  async deleteApiConfiguration(serviceName: string): Promise<boolean> {
    const result = await db
      .delete(api_configurations)
      .where(eq(api_configurations.serviceName, serviceName));
    return (result.rowCount || 0) > 0;
  }

  async testApiConnection(serviceName: string): Promise<{success: boolean, message: string}> {
    const config = await this.getApiConfiguration(serviceName);
    if (!config) {
      return { success: false, message: "Configuração não encontrada" };
    }

    try {
      // Update test status
      await this.updateApiConfiguration(serviceName, {
        lastTested: new Date(),
        testStatus: "testing",
        testMessage: "Testando conexão..."
      });

      // Simple connectivity test based on service type
      let testResult = { success: false, message: "Teste não implementado" };

      switch (serviceName) {
        case "openai":
          // Test OpenAI API
          if (config.configuration?.apiKey) {
            testResult = { success: true, message: "Chave de API válida" };
          } else {
            testResult = { success: false, message: "Chave de API não configurada" };
          }
          break;
        
        case "paypal":
          if (config.configuration?.clientId && config.configuration?.clientSecret) {
            testResult = { success: true, message: "Credenciais PayPal configuradas" };
          } else {
            testResult = { success: false, message: "Credenciais PayPal incompletas" };
          }
          break;
        
        case "mercadopago":
          if (config.configuration?.accessToken) {
            testResult = { success: true, message: "Token Mercado Pago válido" };
          } else {
            testResult = { success: false, message: "Token Mercado Pago não configurado" };
          }
          break;
        
        case "infinitepay":
          if (config.configuration?.clientId && config.configuration?.clientSecret) {
            testResult = { success: true, message: "Credenciais InfinitePay configuradas" };
          } else {
            testResult = { success: false, message: "Credenciais InfinitePay incompletas" };
          }
          break;
        
        case "pagseguro":
          if (config.configuration?.token) {
            testResult = { success: true, message: "Token PagSeguro válido" };
          } else {
            testResult = { success: false, message: "Token PagSeguro não configurado" };
          }
          break;
      }

      // Update final test result
      await this.updateApiConfiguration(serviceName, {
        testStatus: testResult.success ? "success" : "failed",
        testMessage: testResult.message
      });

      return testResult;
    } catch (error) {
      await this.updateApiConfiguration(serviceName, {
        testStatus: "failed",
        testMessage: `Erro no teste: ${error instanceof Error ? error.message : "Erro desconhecido"}`
      });
      
      return { success: false, message: "Erro durante o teste de conexão" };
    }
  }

  // Pages methods
  async getPages(): Promise<Page[]> {
    return await db.select().from(pages).orderBy(pages.sortOrder, pages.title);
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.slug, slug));
    return page;
  }

  async getPageById(id: number): Promise<Page | undefined> {
    const [page] = await db.select().from(pages).where(eq(pages.id, id));
    return page;
  }

  async createPage(pageData: InsertPage): Promise<Page> {
    const [page] = await db.insert(pages).values(pageData).returning();
    return page;
  }

  async updatePage(id: number, updates: Partial<InsertPage>): Promise<Page | undefined> {
    const [updated] = await db
      .update(pages)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(pages.id, id))
      .returning();
    return updated;
  }

  async deletePage(id: number): Promise<boolean> {
    const result = await db.delete(pages).where(eq(pages.id, id));
    return (result.rowCount || 0) > 0;
  }

  async publishPage(id: number): Promise<Page | undefined> {
    const [updated] = await db
      .update(pages)
      .set({ 
        status: 'published', 
        publishedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(pages.id, id))
      .returning();
    return updated;
  }

  // Page Revisions methods
  async createPageRevision(revisionData: InsertPageRevision): Promise<PageRevision> {
    const [revision] = await db.insert(page_revisions).values(revisionData).returning();
    return revision;
  }

  async getPageRevisions(pageId: number): Promise<PageRevision[]> {
    return await db.select().from(page_revisions)
      .where(eq(page_revisions.pageId, pageId))
      .orderBy(desc(page_revisions.createdAt));
  }

  // Media Library methods
  async uploadMedia(mediaData: InsertMediaLibrary): Promise<MediaLibrary> {
    const [media] = await db.insert(media_library).values(mediaData).returning();
    return media;
  }

  async getMediaFiles(): Promise<MediaLibrary[]> {
    return await db.select().from(media_library).orderBy(desc(media_library.uploadedAt));
  }

  async deleteMedia(id: number): Promise<boolean> {
    const result = await db.delete(media_library).where(eq(media_library.id, id));
    return (result.rowCount || 0) > 0;
  }

  // Scriptures methods
  async getScriptures(): Promise<Scripture[]> {
    return await db.select().from(scriptures).orderBy(scriptures.category, scriptures.title);
  }

  async getScriptureBySlug(slug: string): Promise<Scripture | undefined> {
    const [scripture] = await db.select().from(scriptures).where(eq(scriptures.slug, slug));
    return scripture;
  }

  async createScripture(scriptureData: InsertScripture): Promise<Scripture> {
    const [scripture] = await db.insert(scriptures).values(scriptureData).returning();
    return scripture;
  }

  async updateScripture(id: number, updates: Partial<InsertScripture>): Promise<Scripture | undefined> {
    const [updated] = await db
      .update(scriptures)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(scriptures.id, id))
      .returning();
    return updated;
  }

  async deleteScripture(id: number): Promise<boolean> {
    const result = await db.delete(scriptures).where(eq(scriptures.id, id));
    return (result.rowCount || 0) > 0;
  }

  async publishScripture(id: number): Promise<Scripture | undefined> {
    const [updated] = await db
      .update(scriptures)
      .set({ 
        isPublic: true, 
        publishedAt: new Date(),
        updatedAt: new Date() 
      })
      .where(eq(scriptures.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();