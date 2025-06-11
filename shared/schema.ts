import { z } from "zod";

// User types for Supabase
export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  role: string;
  member_type: string;
  initiation_level: number;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: number;
  user_id: string;
  token: string;
  expires_at: string;
  created_at: string;
}

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(1, "Senha é obrigatória"),
});

export const createUserSchema = z.object({
  email: z.string().email("Email inválido"),
  username: z.string().min(3, "Nome de usuário deve ter pelo menos 3 caracteres"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  role: z.string().default("user"),
  member_type: z.string().default("visitante"),
  initiation_level: z.number().default(0),
  is_active: z.boolean().default(true),
});

// Types
export type LoginRequest = z.infer<typeof loginSchema>;
export type CreateUserRequest = z.infer<typeof createUserSchema>;