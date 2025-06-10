import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSupabase } from '@/lib/supabase';
import type { Database } from '@shared/supabase';

type Tables = Database['public']['Tables'];
type Courses = Tables['courses']['Row'];
type Grimoires = Tables['grimoires']['Row'];
type BlogPosts = Tables['blog_posts']['Row'];
type DailyPoems = Tables['daily_poems']['Row'];

// Hook para buscar cursos
export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook para buscar grimórios
export function useGrimoires() {
  return useQuery({
    queryKey: ['grimoires'],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('grimoires')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook para buscar posts do blog
export function useBlogPosts() {
  return useQuery({
    queryKey: ['blog_posts'],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook para buscar poema diário
export function useDailyPoem(date?: string) {
  const today = date || new Date().toISOString().split('T')[0];
  
  return useQuery({
    queryKey: ['daily_poem', today],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('daily_poems')
        .select('*')
        .eq('date', today)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
  });
}

// Hook para buscar poemas recentes
export function useRecentPoems(limit = 5) {
  return useQuery({
    queryKey: ['recent_poems', limit],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('daily_poems')
        .select('*')
        .order('date', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      return data;
    },
  });
}

// Hook para consultas do oráculo
export function useOracleConsultations(userId: string) {
  return useQuery({
    queryKey: ['oracle_consultations', userId],
    queryFn: async () => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('oracle_consultations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

// Hook para criar consulta do oráculo
export function useCreateOracleConsultation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { user_id: string; type: string; question: string; result: any }) => {
      const supabase = await getSupabase();
      const { data: result, error } = await supabase
        .from('oracle_consultations')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['oracle_consultations', data.user_id] });
    },
  });
}

// Hook para criar poema diário
export function useCreateDailyPoem() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { title: string; content: string; author: string; date: string }) => {
      const supabase = await getSupabase();
      const { data: result, error } = await supabase
        .from('daily_poems')
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['daily_poem'] });
      queryClient.invalidateQueries({ queryKey: ['recent_poems'] });
    },
  });
}

// Hook para upload de arquivos
export function useFileUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const supabase = await getSupabase();
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(fileName, file);
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);
      
      return { ...data, publicUrl };
    },
  });
}

// Hook para subscrição de newsletter
export function useNewsletterSubscription() {
  return useMutation({
    mutationFn: async (email: string) => {
      const supabase = await getSupabase();
      const { data, error } = await supabase
        .from('newsletter_subscriptions')
        .insert([{ email }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
  });
}