
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

export class Storage {
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

  async createOracleSession(sessionData: Omit<OracleSession, 'id' | 'created_at'>): Promise<OracleSession> {
    const [session] = await db.insert(oracle_sessions).values({
      ...sessionData,
      created_at: new Date().toISOString(),
    }).returning();
    return session;
  }

  async getUserOracleSessions(userId: number): Promise<OracleSession[]> {
    return await db.select()
      .from(oracle_sessions)
      .where(eq(oracle_sessions.user_id, userId))
      .orderBy(desc(oracle_sessions.created_at));
  }

  // Plume posts
  async getPlumeePosts(limit: number = 10): Promise<PlumePost[]> {
    return await db.select()
      .from(plume_posts)
      .orderBy(desc(plume_posts.created_at))
      .limit(limit);
  }

  async createPlumePost(postData: Omit<PlumePost, 'id' | 'created_at'>): Promise<PlumePost> {
    const [post] = await db.insert(plume_posts).values({
      ...postData,
      created_at: new Date().toISOString(),
    }).returning();
    return post;
  }

  // Site settings
  async getSetting(key: string): Promise<string | null> {
    const [setting] = await db.select().from(site_settings).where(eq(site_settings.key, key));
    return setting?.value || null;
  }

  async setSetting(key: string, value: string): Promise<void> {
    await db.insert(site_settings)
      .values({ key, value, updated_at: new Date().toISOString() })
      .onConflictDoUpdate({
        target: site_settings.key,
        set: { value, updated_at: new Date().toISOString() }
      });
  }

  // Admin
  async createAdmin(username: string, password: string): Promise<void> {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(admin_users).values({
      username,
      password: hashedPassword,
    });
  }

  async validateAdmin(username: string, password: string): Promise<boolean> {
    const [admin] = await db.select().from(admin_users).where(eq(admin_users.username, username));
    if (!admin) return false;
    return await bcrypt.compare(password, admin.password);
  }

  // Initialize default data
  async initializeDefaults(): Promise<void> {
    // Create default admin
    const adminExists = await db.select().from(admin_users).limit(1);
    if (adminExists.length === 0) {
      await this.createAdmin("admin", "magurklucifex312");
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
