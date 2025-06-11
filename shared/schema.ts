// Schema exclusivo para Supabase - Templo do Abismo
export interface User {
  id: string;
  email: string;
  password: string;
  username?: string;
  magical_name?: string;
  role: 'user' | 'admin';
  member_type: 'visitante' | 'iniciado' | 'vip' | 'admin';
  initiation_level: number;
  personal_seal_generated: boolean;
  personal_seal_url?: string;
  courses_completed: string[];
  achievements: string[];
  join_date: string;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  is_active: boolean;
  subscription_type?: string;
  subscription_expires_at?: string;
}

export interface AdminSession {
  id: string;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty_level: number;
  instructor: string;
  price_brl: number;
  is_active: boolean;
  featured_image?: string;
  tags: string[];
  created_at: string;
}

export interface Grimoire {
  id: string;
  title: string;
  description: string;
  author: string;
  level: 'iniciante' | 'intermediario' | 'avancado';
  price_brl: number;
  pdf_url?: string;
  cover_image?: string;
  is_active: boolean;
  tags: string[];
  created_at: string;
}

export interface OracleConsultation {
  id: string;
  user_id?: string;
  type: 'tarot' | 'mirror' | 'runes' | 'fire' | 'abyssal';
  question: string;
  response: any;
  created_at: string;
}

export interface VozPlumaPost {
  id: string;
  title: string;
  content: string;
  author: string;
  category: 'poem' | 'article' | 'ritual';
  type: 'daily' | 'special';
  posted_date: string;
  created_at: string;
}

export type InsertUser = Omit<User, 'id' | 'created_at'>;
export type UpdateUser = Partial<Omit<User, 'id' | 'created_at'>>;
export type InsertAdminSession = Omit<AdminSession, 'id' | 'created_at'>;
export type InsertCourse = Omit<Course, 'id' | 'created_at'>;
export type InsertGrimoire = Omit<Grimoire, 'id' | 'created_at'>;
export type InsertOracleConsultation = Omit<OracleConsultation, 'id' | 'created_at'>;
export type InsertVozPlumaPost = Omit<VozPlumaPost, 'id' | 'created_at'>;