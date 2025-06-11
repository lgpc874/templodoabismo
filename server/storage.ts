import { supabaseAdmin } from './supabase-client';
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import type { User, AdminSession, InsertUser, UpdateUser, InsertAdminSession } from '@shared/schema';

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  getUserByUsername(username: string): Promise<User | null>;
  createUser(userData: InsertUser): Promise<User>;
  updateUser(id: string, userData: UpdateUser): Promise<User>;
  
  // Admin operations
  authenticateAdmin(email: string, password: string): Promise<{ user: User; token: string } | null>;
  validateAdminToken(token: string): Promise<User | null>;
  createAdminSession(userId: string): Promise<string>;
  revokeAdminSession(token: string): Promise<void>;
  getAdminUsers(): Promise<User[]>;
  createAdminUser(userData: InsertUser): Promise<User>;
}

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) return null;
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return null;
    return data as User;
  }

  async getUserByUsername(username: string): Promise<User | null> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error || !data) return null;
    return data as User;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        ...userData,
        password: hashedPassword,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create user: ${error.message}`);
    return data as User;
  }

  async updateUser(id: string, userData: UpdateUser): Promise<User> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw new Error(`Failed to update user: ${error.message}`);
    return data as User;
  }

  async authenticateAdmin(email: string, password: string): Promise<{ user: User; token: string } | null> {
    try {
      const user = await this.getUserByEmail(email);
      
      if (!user || user.role !== 'admin') {
        return null;
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return null;
      }

      const token = await this.createAdminSession(user.id);
      
      // Update last login
      await this.updateUser(user.id, { last_login: new Date().toISOString() });
      
      return { user, token };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  async validateAdminToken(token: string): Promise<User | null> {
    try {
      const { data: session, error } = await supabaseAdmin
        .from('admin_sessions')
        .select('user_id, expires_at')
        .eq('token', token)
        .single();

      if (error || !session || new Date(session.expires_at) < new Date()) {
        return null;
      }

      const user = await this.getUser(session.user_id);
      if (!user || user.role !== 'admin') {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  async createAdminSession(userId: string): Promise<string> {
    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const { error } = await supabaseAdmin
      .from('admin_sessions')
      .insert({
        user_id: userId,
        token,
        expires_at: expiresAt.toISOString(),
        created_at: new Date().toISOString()
      });

    if (error) throw new Error(`Failed to create session: ${error.message}`);
    return token;
  }

  async revokeAdminSession(token: string): Promise<void> {
    await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('token', token);
  }

  async getAdminUsers(): Promise<User[]> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('role', 'admin');
    
    if (error) return [];
    return (data || []) as User[];
  }

  async createAdminUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .insert({
        email: userData.email,
        password: hashedPassword,
        username: userData.username || userData.email.split('@')[0],
        magical_name: userData.magical_name || 'Administrador Principal',
        role: 'admin',
        member_type: 'admin',
        initiation_level: 100,
        personal_seal_generated: false,
        courses_completed: [],
        achievements: [],
        join_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw new Error(`Failed to create admin user: ${error.message}`);
    return data as User;
  }
}

export const storage = new SupabaseStorage();