import { createClient } from '@supabase/supabase-js'

if (!process.env.SUPABASE_URL) {
  throw new Error('Missing SUPABASE_URL environment variable')
}

if (!process.env.SUPABASE_KEY) {
  throw new Error('Missing SUPABASE_KEY environment variable')
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
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

export interface DailyPoem {
  id: number
  title: string
  content: string
  author: string
  date: string
  created_at: string
}

export interface OracleConsultation {
  id: number
  user_id: string
  type: string
  question: string
  response: string
  created_at: string
}

export interface Enrollment {
  id: number
  user_id: string
  course_id: number
  enrolled_at: string
}

export interface GrimoireRental {
  id: number
  user_id: string
  grimoire_id: number
  rental_start: string
  rental_end: string
  is_active: boolean
}

export interface GrimoirePurchase {
  id: number
  user_id: string
  grimoire_id: number
  purchased_at: string
}