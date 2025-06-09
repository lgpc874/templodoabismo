import { supabase } from "@shared/supabase";
import type {
  User,
  CreateUser,
  Course,
  Grimoire,
  BlogPost,
  DailyPoem,
  OracleConsultation,
  Enrollment,
  GrimoireRental,
  GrimoirePurchase,
} from "@shared/supabase";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: CreateUser): Promise<User>;
  updateUser(id: string, userData: Partial<User>): Promise<User>;

  // Course operations
  getCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course>;
  updateCourse(id: number, courseData: Partial<Course>): Promise<Course>;
  deleteCourse(id: number): Promise<void>;

  // Grimoire operations
  getGrimoires(): Promise<Grimoire[]>;
  getGrimoire(id: number): Promise<Grimoire | undefined>;
  createGrimoire(grimoireData: Omit<Grimoire, 'id' | 'created_at' | 'updated_at'>): Promise<Grimoire>;
  updateGrimoire(id: number, grimoireData: Partial<Grimoire>): Promise<Grimoire>;
  deleteGrimoire(id: number): Promise<void>;

  // Blog operations
  getBlogPosts(): Promise<BlogPost[]>;
  getBlogPost(id: number): Promise<BlogPost | undefined>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost>;
  updateBlogPost(id: number, postData: Partial<BlogPost>): Promise<BlogPost>;
  deleteBlogPost(id: number): Promise<void>;

  // Daily Poem operations
  getDailyPoems(): Promise<DailyPoem[]>;
  getDailyPoem(date: string): Promise<DailyPoem | undefined>;
  createDailyPoem(poemData: Omit<DailyPoem, 'id' | 'created_at'>): Promise<DailyPoem>;

  // Oracle operations
  getOracleConsultations(userId: string): Promise<OracleConsultation[]>;
  createOracleConsultation(consultationData: Omit<OracleConsultation, 'id' | 'created_at'>): Promise<OracleConsultation>;

  // Enrollment operations
  getUserEnrollments(userId: string): Promise<Enrollment[]>;
  createEnrollment(enrollmentData: Omit<Enrollment, 'id' | 'enrolled_at'>): Promise<Enrollment>;

  // Grimoire rental/purchase operations
  getUserGrimoireRentals(userId: string): Promise<GrimoireRental[]>;
  getUserGrimoirePurchases(userId: string): Promise<GrimoirePurchase[]>;
  createGrimoireRental(rentalData: Omit<GrimoireRental, 'id'>): Promise<GrimoireRental>;
  createGrimoirePurchase(purchaseData: Omit<GrimoirePurchase, 'id'>): Promise<GrimoirePurchase>;
}

export class SupabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createUser(userData: CreateUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password_hash, 10);
    
    const { data, error } = await supabase
      .from('users')
      .insert({
        ...userData,
        password_hash: hashedPassword,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Course operations
  async getCourses(): Promise<Course[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getCourse(id: number): Promise<Course | undefined> {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return undefined;
    return data;
  }

  async createCourse(courseData: Omit<Course, 'id' | 'created_at' | 'updated_at'>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .insert(courseData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCourse(id: number, courseData: Partial<Course>): Promise<Course> {
    const { data, error } = await supabase
      .from('courses')
      .update(courseData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCourse(id: number): Promise<void> {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Grimoire operations
  async getGrimoires(): Promise<Grimoire[]> {
    const { data, error } = await supabase
      .from('grimoires')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getGrimoire(id: number): Promise<Grimoire | undefined> {
    const { data, error } = await supabase
      .from('grimoires')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return undefined;
    return data;
  }

  async createGrimoire(grimoireData: Omit<Grimoire, 'id' | 'created_at' | 'updated_at'>): Promise<Grimoire> {
    const { data, error } = await supabase
      .from('grimoires')
      .insert(grimoireData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateGrimoire(id: number, grimoireData: Partial<Grimoire>): Promise<Grimoire> {
    const { data, error } = await supabase
      .from('grimoires')
      .update(grimoireData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteGrimoire(id: number): Promise<void> {
    const { error } = await supabase
      .from('grimoires')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Blog operations
  async getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async getBlogPost(id: number): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) return undefined;
    return data;
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return undefined;
    return data;
  }

  async createBlogPost(postData: Omit<BlogPost, 'id' | 'created_at' | 'updated_at'>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .insert(postData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateBlogPost(id: number, postData: Partial<BlogPost>): Promise<BlogPost> {
    const { data, error } = await supabase
      .from('blog_posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteBlogPost(id: number): Promise<void> {
    const { error } = await supabase
      .from('blog_posts')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // Daily Poem operations
  async getDailyPoems(): Promise<DailyPoem[]> {
    const { data, error } = await supabase
      .from('daily_poems')
      .select('*')
      .order('date', { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  async getDailyPoem(date: string): Promise<DailyPoem | undefined> {
    const { data, error } = await supabase
      .from('daily_poems')
      .select('*')
      .eq('date', date)
      .single();

    if (error) return undefined;
    return data;
  }

  async createDailyPoem(poemData: Omit<DailyPoem, 'id' | 'created_at'>): Promise<DailyPoem> {
    const { data, error } = await supabase
      .from('daily_poems')
      .insert(poemData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Oracle operations
  async getOracleConsultations(userId: string): Promise<OracleConsultation[]> {
    const { data, error } = await supabase
      .from('oracle_consultations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async createOracleConsultation(consultationData: Omit<OracleConsultation, 'id' | 'created_at'>): Promise<OracleConsultation> {
    const { data, error } = await supabase
      .from('oracle_consultations')
      .insert(consultationData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Enrollment operations
  async getUserEnrollments(userId: string): Promise<Enrollment[]> {
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  async createEnrollment(enrollmentData: Omit<Enrollment, 'id' | 'enrolled_at'>): Promise<Enrollment> {
    const { data, error } = await supabase
      .from('enrollments')
      .insert(enrollmentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Grimoire rental/purchase operations
  async getUserGrimoireRentals(userId: string): Promise<GrimoireRental[]> {
    const { data, error } = await supabase
      .from('grimoire_rentals')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true);

    if (error) throw error;
    return data || [];
  }

  async getUserGrimoirePurchases(userId: string): Promise<GrimoirePurchase[]> {
    const { data, error } = await supabase
      .from('grimoire_purchases')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  async createGrimoireRental(rentalData: Omit<GrimoireRental, 'id'>): Promise<GrimoireRental> {
    const { data, error } = await supabase
      .from('grimoire_rentals')
      .insert(rentalData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async createGrimoirePurchase(purchaseData: Omit<GrimoirePurchase, 'id'>): Promise<GrimoirePurchase> {
    const { data, error } = await supabase
      .from('grimoire_purchases')
      .insert(purchaseData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export const storage = new SupabaseStorage();