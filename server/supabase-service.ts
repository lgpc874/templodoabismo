import { supabaseAdmin } from './supabase-client';
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";

export class SupabaseService {
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabaseAdmin
        .from('users')
        .select('count')
        .limit(1);
      
      return !error;
    } catch (error) {
      console.error('Supabase connection test failed:', error);
      return false;
    }
  }

  async createAdminIfNotExists(): Promise<void> {
    try {
      // Check if admin exists
      const { data: adminExists } = await supabaseAdmin
        .from('users')
        .select('id')
        .eq('role', 'admin')
        .limit(1);

      if (!adminExists || adminExists.length === 0) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        await supabaseAdmin
          .from('users')
          .insert({
            email: 'admin@templo.com',
            password: hashedPassword,
            username: 'admin',
            magical_name: 'Administrador Principal',
            role: 'admin',
            member_type: 'admin',
            initiation_level: 100
          });
        
        console.log('Admin user created successfully');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  }

  async authenticateUser(email: string, password: string): Promise<any> {
    try {
      const { data: user } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) return null;

      // Create session token
      const token = randomBytes(32).toString('hex');
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await supabaseAdmin
        .from('admin_sessions')
        .insert({
          user_id: user.id,
          token,
          expires_at: expiresAt.toISOString()
        });

      return { user, token };
    } catch (error) {
      console.error('Authentication error:', error);
      return null;
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const { data: session } = await supabaseAdmin
        .from('admin_sessions')
        .select('user_id, expires_at')
        .eq('token', token)
        .single();

      if (!session || new Date(session.expires_at) < new Date()) {
        return null;
      }

      const { data: user } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', session.user_id)
        .single();

      return user;
    } catch (error) {
      return null;
    }
  }

  async revokeToken(token: string): Promise<void> {
    await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('token', token);
  }
}

export const supabaseService = new SupabaseService();