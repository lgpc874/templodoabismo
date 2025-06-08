import { 
  users, 
  adminSessions, 
  siteConfig, 
  contentSections, 
  mediaAssets, 
  activityLogs, 
  backups,
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
  type InsertBackup 
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
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
  
  // Stats
  getStats(): Promise<{
    totalUsers: number;
    totalPages: number;
    totalAssets: number;
    lastBackup: string | null;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private adminSessions: Map<string, AdminSession> = new Map();
  private siteConfigs: Map<string, SiteConfig> = new Map();
  private contentSections: Map<number, ContentSection> = new Map();
  private mediaAssets: Map<number, MediaAsset> = new Map();
  private activityLogs: Map<number, ActivityLog> = new Map();
  private backups: Map<number, Backup> = new Map();
  
  private currentUserId = 1;
  private currentSiteConfigId = 1;
  private currentContentSectionId = 1;
  private currentMediaAssetId = 1;
  private currentActivityLogId = 1;
  private currentBackupId = 1;

  constructor() {
    // Initialize with default admin user
    this.users.set(1, {
      id: 1,
      username: "admin",
      email: "admin@magussecretum.com",
      password: "$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // password
      role: "admin",
      createdAt: new Date(),
    });
    this.currentUserId = 2;

    // Initialize default site configuration
    this.initializeDefaultConfig();
    // Initialize default admin user
    this.initializeDefaultAdmin();
  }

  private initializeDefaultConfig() {
    const defaultConfigs = [
      { key: "site_title", value: "Templo do Abismo", category: "general" },
      { key: "site_tagline", value: "Journey into the depths of mystical knowledge", category: "general" },
      { key: "site_description", value: "A sanctuary for mystical exploration and spiritual growth", category: "general" },
      { key: "primary_color", value: "#3B82F6", category: "theme" },
      { key: "secondary_color", value: "#64748B", category: "theme" },
      { key: "accent_color", value: "#10B981", category: "theme" },
      { key: "heading_font", value: "Inter", category: "typography" },
      { key: "body_font", value: "Inter", category: "typography" },
    ];

    defaultConfigs.forEach(config => {
      this.siteConfigs.set(config.key, {
        id: this.currentSiteConfigId++,
        key: config.key,
        value: config.value,
        category: config.category,
        updatedAt: new Date(),
      });
    });
  }

  private initializeDefaultAdmin() {
    try {
      // Create default admin user if none exists
      const adminPassword = bcrypt.hashSync('admin123', 10);
      
      const adminUser: User = {
        id: 1,
        username: 'admin',
        email: 'admin@templo.com',
        password: adminPassword,
        role: 'admin',
        createdAt: new Date(),
      };
      
      this.users.set(1, adminUser);
      
      // Create default test user
      const userPassword = bcrypt.hashSync('user123', 10);
      
      const testUser: User = {
        id: 2,
        username: 'usuario',
        email: 'usuario@templo.com',
        password: userPassword,
        role: 'user',
        createdAt: new Date(),
      };
      
      this.users.set(2, testUser);
      this.currentUserId = 3;
    } catch (error) {
      console.error('Error initializing users:', error);
    }
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const newUser: User = {
      ...user,
      id,
      role: user.role || "user",
      createdAt: new Date(),
    };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  // Admin Sessions
  async createAdminSession(userId: number, token: string, expiresAt: Date): Promise<AdminSession> {
    const session: AdminSession = {
      id: Date.now(),
      userId,
      token,
      expiresAt,
      createdAt: new Date(),
    };
    this.adminSessions.set(token, session);
    return session;
  }

  async getAdminSession(token: string): Promise<AdminSession | undefined> {
    const session = this.adminSessions.get(token);
    if (session && session.expiresAt > new Date()) {
      return session;
    }
    if (session) {
      this.adminSessions.delete(token);
    }
    return undefined;
  }

  async deleteAdminSession(token: string): Promise<boolean> {
    return this.adminSessions.delete(token);
  }

  // Site Configuration
  async getSiteConfig(key?: string): Promise<SiteConfig[]> {
    const configs = Array.from(this.siteConfigs.values());
    return key ? configs.filter(config => config.key === key) : configs;
  }

  async setSiteConfig(config: InsertSiteConfig): Promise<SiteConfig> {
    const existing = this.siteConfigs.get(config.key);
    if (existing) {
      const updated = { ...existing, ...config, updatedAt: new Date() };
      this.siteConfigs.set(config.key, updated);
      return updated;
    } else {
      const newConfig: SiteConfig = {
        ...config,
        id: this.currentSiteConfigId++,
        updatedAt: new Date(),
      };
      this.siteConfigs.set(config.key, newConfig);
      return newConfig;
    }
  }

  async deleteSiteConfig(key: string): Promise<boolean> {
    return this.siteConfigs.delete(key);
  }

  // Content Sections
  async getContentSections(pageId?: string): Promise<ContentSection[]> {
    const sections = Array.from(this.contentSections.values());
    return pageId 
      ? sections.filter(section => section.pageId === pageId).sort((a, b) => a.order - b.order)
      : sections.sort((a, b) => a.order - b.order);
  }

  async getContentSection(id: number): Promise<ContentSection | undefined> {
    return this.contentSections.get(id);
  }

  async createContentSection(section: InsertContentSection): Promise<ContentSection> {
    const id = this.currentContentSectionId++;
    const newSection: ContentSection = {
      id,
      pageId: section.pageId,
      sectionType: section.sectionType,
      title: section.title ?? null,
      content: section.content,
      order: section.order ?? 0,
      isEnabled: section.isEnabled ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.contentSections.set(id, newSection);
    return newSection;
  }

  async updateContentSection(id: number, updates: Partial<InsertContentSection>): Promise<ContentSection | undefined> {
    const section = this.contentSections.get(id);
    if (!section) return undefined;
    
    const updatedSection = { ...section, ...updates, updatedAt: new Date() };
    this.contentSections.set(id, updatedSection);
    return updatedSection;
  }

  async deleteContentSection(id: number): Promise<boolean> {
    return this.contentSections.delete(id);
  }

  async reorderContentSections(pageId: string, sectionIds: number[]): Promise<boolean> {
    try {
      sectionIds.forEach((id, index) => {
        const section = this.contentSections.get(id);
        if (section && section.pageId === pageId) {
          section.order = index;
          section.updatedAt = new Date();
        }
      });
      return true;
    } catch {
      return false;
    }
  }

  // Media Assets
  async getMediaAssets(): Promise<MediaAsset[]> {
    return Array.from(this.mediaAssets.values()).sort((a, b) => 
      b.uploadedAt!.getTime() - a.uploadedAt!.getTime()
    );
  }

  async getMediaAsset(id: number): Promise<MediaAsset | undefined> {
    return this.mediaAssets.get(id);
  }

  async createMediaAsset(asset: InsertMediaAsset): Promise<MediaAsset> {
    const id = this.currentMediaAssetId++;
    const newAsset: MediaAsset = {
      id,
      filename: asset.filename,
      originalName: asset.originalName,
      mimeType: asset.mimeType,
      size: asset.size,
      url: asset.url,
      alt: asset.alt ?? null,
      tags: asset.tags ?? null,
      uploadedAt: new Date(),
    };
    this.mediaAssets.set(id, newAsset);
    return newAsset;
  }

  async updateMediaAsset(id: number, updates: Partial<InsertMediaAsset>): Promise<MediaAsset | undefined> {
    const asset = this.mediaAssets.get(id);
    if (!asset) return undefined;
    
    const updatedAsset = { ...asset, ...updates };
    this.mediaAssets.set(id, updatedAsset);
    return updatedAsset;
  }

  async deleteMediaAsset(id: number): Promise<boolean> {
    return this.mediaAssets.delete(id);
  }

  // Activity Logs
  async getActivityLogs(limit = 50): Promise<ActivityLog[]> {
    const logs = Array.from(this.activityLogs.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    return logs.slice(0, limit);
  }

  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const id = this.currentActivityLogId++;
    const newLog: ActivityLog = {
      id,
      userId: log.userId ?? null,
      action: log.action,
      target: log.target,
      metadata: log.metadata ?? {},
      createdAt: new Date(),
    };
    this.activityLogs.set(id, newLog);
    return newLog;
  }

  // Backups
  async getBackups(): Promise<Backup[]> {
    return Array.from(this.backups.values()).sort((a, b) => 
      b.createdAt!.getTime() - a.createdAt!.getTime()
    );
  }

  async getBackup(id: number): Promise<Backup | undefined> {
    return this.backups.get(id);
  }

  async createBackup(backup: InsertBackup): Promise<Backup> {
    const id = this.currentBackupId++;
    const newBackup: Backup = {
      id,
      name: backup.name,
      type: backup.type,
      path: backup.path,
      size: backup.size,
      createdBy: backup.createdBy ?? null,
      createdAt: new Date(),
    };
    this.backups.set(id, newBackup);
    return newBackup;
  }

  async deleteBackup(id: number): Promise<boolean> {
    return this.backups.delete(id);
  }

  // Stats
  async getStats(): Promise<{
    totalUsers: number;
    totalPages: number;
    totalAssets: number;
    lastBackup: string | null;
  }> {
    const backupList = await this.getBackups();
    const uniquePages = new Set(Array.from(this.contentSections.values()).map(s => s.pageId));
    
    return {
      totalUsers: this.users.size,
      totalPages: uniquePages.size,
      totalAssets: this.mediaAssets.size,
      lastBackup: backupList.length > 0 ? backupList[0].createdAt!.toISOString() : null,
    };
  }
}

export const storage = new MemStorage();
