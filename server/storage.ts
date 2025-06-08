
import { db } from "./db";
import { 
  users, 
  grimoires, 
  courses, 
  oracles, 
  oracle_sessions, 
  user_grimoire_access,
  user_courses,
  plume_posts,
  site_settings,
  admin_users,
  type InsertUser,
  type User,
  type Grimoire,
  type Course,
  type Oracle,
  type OracleSession,
  type PlumePost
} from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import bcrypt from "bcrypt";
import Database from 'better-sqlite3';

export class Storage {
  constructor() {
    this.initializeDatabase();
  }

  private initializeDatabase() {
    try {
      // Criar tabelas se não existirem (SQLite)
      const sqlite = new Database('database.sqlite');
      
      // Users table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          email TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          tkazh_credits INTEGER DEFAULT 0,
          free_credits INTEGER DEFAULT 10,
          last_credit_reset TEXT,
          personal_seal_generated INTEGER DEFAULT 0,
          initiation_level INTEGER DEFAULT 0,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `);

      // Grimoires table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS grimoires (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          content TEXT NOT NULL,
          price_tkazh INTEGER,
          price_real REAL,
          is_free INTEGER DEFAULT 0,
          chapter_count INTEGER DEFAULT 1,
          image_url TEXT
        )
      `);

      // Courses table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          level INTEGER NOT NULL,
          is_professional INTEGER DEFAULT 0,
          price_real REAL,
          modules TEXT,
          requirements TEXT,
          image_url TEXT
        )
      `);

      // Oracles table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS oracles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          tkazh_cost INTEGER NOT NULL,
          oracle_type TEXT NOT NULL
        )
      `);

      // Oracle sessions table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS oracle_sessions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES users(id),
          oracle_id INTEGER REFERENCES oracles(id),
          question TEXT NOT NULL,
          response TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `);

      // User grimoire access table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS user_grimoire_access (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES users(id),
          grimoire_id INTEGER REFERENCES grimoires(id),
          access_type TEXT NOT NULL,
          expires_at TEXT,
          purchased_at TEXT DEFAULT (datetime('now'))
        )
      `);

      // User courses table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS user_courses (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER REFERENCES users(id),
          course_id INTEGER REFERENCES courses(id),
          progress INTEGER DEFAULT 0,
          completed INTEGER DEFAULT 0,
          enrolled_at TEXT DEFAULT (datetime('now'))
        )
      `);

      // Plume posts table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS plume_posts (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          author TEXT DEFAULT 'Voz da Pluma',
          created_at TEXT DEFAULT (datetime('now')),
          is_featured INTEGER DEFAULT 0
        )
      `);

      // Site settings table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS site_settings (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          key TEXT NOT NULL UNIQUE,
          value TEXT NOT NULL,
          updated_at TEXT DEFAULT (datetime('now'))
        )
      `);

      // Admin users table
      sqlite.exec(`
        CREATE TABLE IF NOT EXISTS admin_users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          created_at TEXT DEFAULT (datetime('now'))
        )
      `);

      sqlite.close();
      console.log("Tabelas do banco de dados inicializadas com sucesso");
    } catch (error) {
      console.log("Erro ao inicializar banco de dados:", error);
    }
  }

  // User management
  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
      free_credits: 10,
      last_credit_reset: new Date().toISOString(),
    }).returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || null;
  }

  async getUserById(id: number): Promise<User | null> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || null;
  }

  async updateUserCredits(userId: number, tkazhCredits: number, freeCredits?: number): Promise<void> {
    const updateData: any = { tkazh_credits: tkazhCredits };
    if (freeCredits !== undefined) {
      updateData.free_credits = freeCredits;
    }
    await db.update(users).set(updateData).where(eq(users.id, userId));
  }

  async resetWeeklyCredits(): Promise<void> {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    await db.update(users)
      .set({ 
        free_credits: 10, 
        last_credit_reset: new Date().toISOString() 
      })
      .where(eq(users.last_credit_reset, oneWeekAgo));
  }

  // Grimoires
  async getGrimoires(): Promise<Grimoire[]> {
    return await db.select().from(grimoires);
  }

  async getGrimoireById(id: number): Promise<Grimoire | null> {
    const [grimoire] = await db.select().from(grimoires).where(eq(grimoires.id, id));
    return grimoire || null;
  }

  async createGrimoire(grimoireData: Omit<Grimoire, 'id'>): Promise<Grimoire> {
    const [grimoire] = await db.insert(grimoires).values(grimoireData).returning();
    return grimoire;
  }

  // Courses
  async getCourses(): Promise<Course[]> {
    return await db.select().from(courses);
  }

  async getCourseById(id: number): Promise<Course | null> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course || null;
  }

  async createCourse(courseData: Omit<Course, 'id'>): Promise<Course> {
    const [course] = await db.insert(courses).values(courseData).returning();
    return course;
  }

  // Oracles
  async getOracles(): Promise<Oracle[]> {
    return await db.select().from(oracles);
  }

  async getOracleById(id: number): Promise<Oracle | null> {
    const [oracle] = await db.select().from(oracles).where(eq(oracles.id, id));
    return oracle || null;
  }

  async createOracleSession(sessionData: Omit<OracleSession, 'id' | 'created_at'>): Promise<OracleSession> {
    const [session] = await db.insert(oracle_sessions).values({
      ...sessionData,
      created_at: new Date().toISOString(),
    }).returning();
    return session;
  }

  async getUserOracleSessions(userId: number): Promise<OracleSession[]> {
    return await db.select().from(oracle_sessions)
      .where(eq(oracle_sessions.user_id, userId))
      .orderBy(desc(oracle_sessions.created_at));
  }

  // Plume Posts
  async getPlumePosts(): Promise<PlumePost[]> {
    return await db.select().from(plume_posts).orderBy(desc(plume_posts.created_at));
  }

  async getFeaturedPlumePosts(): Promise<PlumePost[]> {
    return await db.select().from(plume_posts)
      .where(eq(plume_posts.is_featured, 1))
      .orderBy(desc(plume_posts.created_at));
  }

  async createPlumePost(postData: Omit<PlumePost, 'id' | 'created_at'>): Promise<PlumePost> {
    const [post] = await db.insert(plume_posts).values({
      ...postData,
      created_at: new Date().toISOString(),
    }).returning();
    return post;
  }

  // Site Settings
  async getSetting(key: string): Promise<string | null> {
    const [setting] = await db.select().from(site_settings).where(eq(site_settings.key, key));
    return setting?.value || null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    const existing = await this.getSetting(key);
    if (existing) {
      await db.update(site_settings)
        .set({ value, updated_at: new Date().toISOString() })
        .where(eq(site_settings.key, key));
    } else {
      await db.insert(site_settings).values({
        key,
        value,
        updated_at: new Date().toISOString(),
      });
    }
  }

  // Admin
  async createAdminUser(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(admin_users).values({
      username,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    });
  }

  async verifyAdminUser(username: string, password: string): Promise<boolean> {
    const [admin] = await db.select().from(admin_users).where(eq(admin_users.username, username));
    if (!admin) return false;
    return await bcrypt.compare(password, admin.password);
  }

  // Initialize default data
  async initializeDefaultData(): Promise<void> {
    // Create default admin user if none exists
    const adminExists = await db.select().from(admin_users).limit(1);
    if (adminExists.length === 0) {
      await this.createAdminUser("admin", "admin123");
    }

    // Create default oracles
    const oraclesExist = await db.select().from(oracles).limit(1);
    if (oraclesExist.length === 0) {
      const defaultOracles = [
        { name: "Tarot Infernal", description: "Cartas do Abismo revelam seu destino", tkazh_cost: 5, oracle_type: "tarot" },
        { name: "Espelho Negro", description: "Vislumbre através do véu da realidade", tkazh_cost: 3, oracle_type: "mirror" },
        { name: "Runas do Abismo", description: "Símbolos ancestrais falam sua verdade", tkazh_cost: 4, oracle_type: "runes" },
        { name: "Chamas Negras", description: "Divinação através do fogo sagrado", tkazh_cost: 6, oracle_type: "flames" },
        { name: "Voz Abissal", description: "Resposta oracular direta das trevas", tkazh_cost: 8, oracle_type: "voice" },
      ];

      for (const oracle of defaultOracles) {
        await db.insert(oracles).values(oracle);
      }
    }

    // Set default site settings
    await this.setSetting("site_logo", "https://i.postimg.cc/g20gqmdX/IMG-20250527-182235-1.png");
    await this.setSetting("site_background", "https://i.postimg.cc/qqX1Q7zn/Textura-envelhecida-e-marcada-pelo-tempo.png");
    await this.setSetting("liber_password", "tenebrae");
  }
}

export const storage = new Storage();
