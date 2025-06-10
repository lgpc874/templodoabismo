import { createClient, SupabaseClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable')
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_KEY environment variable')
}

// Database types for better TypeScript support
export interface User {
  id: string
  username: string
  email: string
  password_hash: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

export interface CreateUser {
  username: string
  email: string
  password_hash: string
  is_admin?: boolean
}

export interface Course {
  id: number
  title: string
  description: string
  level: number
  price: number
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CreateCourse {
  title: string
  description?: string
  level?: number
  price?: number
  is_published?: boolean
}

export interface Grimoire {
  id: number
  title: string
  description: string
  price: number
  pdf_url: string | null
  is_published: boolean
  created_at: string
  updated_at: string
}

export interface CreateGrimoire {
  title: string
  description?: string
  price?: number
  pdf_url?: string
  is_published?: boolean
}

export interface BlogPost {
  id: number
  title: string
  content: string
  slug: string
  excerpt: string | null
  category_id: number | null
  is_published: boolean
  published_at: string | null
  created_at: string
  updated_at: string
}

export interface CreateBlogPost {
  title: string
  content: string
  slug: string
  excerpt?: string
  category_id?: number
  is_published?: boolean
  published_at?: string
}

export interface DailyPoem {
  id: number
  title: string
  content: string
  author: string
  date: string
  created_at: string
}

export interface CreateDailyPoem {
  title: string
  content: string
  author: string
  date: string
}

export interface OracleConsultation {
  id: number
  user_id: string
  type: string
  question: string
  response: string
  created_at: string
}

export interface CreateOracleConsultation {
  user_id: string
  type: string
  question: string
  response: string
}

export interface Enrollment {
  id: number
  user_id: string
  course_id: number
  enrolled_at: string
}

export interface CreateEnrollment {
  user_id: string
  course_id: number
}

export interface GrimoireRental {
  id: number
  user_id: string
  grimoire_id: number
  rental_start: string
  rental_end: string
  is_active: boolean
}

export interface CreateGrimoireRental {
  user_id: string
  grimoire_id: number
  rental_start: string
  rental_end: string
  is_active?: boolean
}

export interface GrimoirePurchase {
  id: number
  user_id: string
  grimoire_id: number
  purchased_at: string
}

export interface CreateGrimoirePurchase {
  user_id: string
  grimoire_id: number
  purchased_at: string
}

// Database types for TypeScript support
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User
        Insert: CreateUser
        Update: Partial<CreateUser>
      }
      courses: {
        Row: Course
        Insert: CreateCourse
        Update: Partial<CreateCourse>
      }
      grimoires: {
        Row: Grimoire
        Insert: CreateGrimoire
        Update: Partial<CreateGrimoire>
      }
      blog_posts: {
        Row: BlogPost
        Insert: CreateBlogPost
        Update: Partial<CreateBlogPost>
      }
      daily_poems: {
        Row: DailyPoem
        Insert: CreateDailyPoem
        Update: Partial<CreateDailyPoem>
      }
      oracle_consultations: {
        Row: OracleConsultation
        Insert: CreateOracleConsultation
        Update: Partial<CreateOracleConsultation>
      }
      enrollments: {
        Row: Enrollment
        Insert: CreateEnrollment
        Update: Partial<CreateEnrollment>
      }
      grimoire_rentals: {
        Row: GrimoireRental
        Insert: CreateGrimoireRental
        Update: Partial<CreateGrimoireRental>
      }
      grimoire_purchases: {
        Row: GrimoirePurchase
        Insert: CreateGrimoirePurchase
        Update: Partial<CreateGrimoirePurchase>
      }
    }
  }
}

export const supabase: SupabaseClient<Database> = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    },
    realtime: {
      params: {
        eventsPerSecond: 10
      }
    }
  }
)

// Admin client with service role key for privileged operations
export const supabaseAdmin: SupabaseClient<Database> = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types for better TypeScript support
export interface User {
  id: string
  username: string
  email: string
  password_hash: string
  is_admin: boolean
  created_at: string
  updated_at: string
}

