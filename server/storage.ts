import { supabaseAdmin } from './supabase-client';
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<any>;
  getUserByEmail(email: string): Promise<any>;
  getUserByUsername(username: string): Promise<any>;
  createUser(userData: any): Promise<any>;
  updateUser(id: string, userData: any): Promise<any>;
  
  // Admin operations
  authenticateAdmin(email: string, password: string): Promise<{ user: any; token: string } | null>;
  validateAdminToken(token: string): Promise<any>;
  createAdminSession(userId: string): Promise<string>;
  revokeAdminSession(token: string): Promise<void>;
}

export class SupabaseStorage implements IStorage {
  async getUser(id: string): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return null;
    return data;
  }

  async getUserByEmail(email: string): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return null;
    return data;
  }

  async getUserByUsername(username: string): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) return null;
    return data;
  }

  async createUser(userData: any): Promise<any> {
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
    
    if (error) throw error;
    return data;
  }

  async updateUser(id: string, userData: any): Promise<any> {
    const { data, error } = await supabaseAdmin
      .from('users')
      .update({
        ...userData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async authenticateAdmin(email: string, password: string): Promise<{ user: any; token: string } | null> {
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

  async validateAdminToken(token: string): Promise<any> {
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

    if (error) throw error;
    return token;
  }

  async revokeAdminSession(token: string): Promise<void> {
    await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('token', token);
  }
}

export const storage = new SupabaseStorage();