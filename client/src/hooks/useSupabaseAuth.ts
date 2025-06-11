import { useState, useEffect } from 'react';
import { getSupabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
}

export function useSupabaseAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    let subscription: any = null;

    async function initializeAuth() {
      try {
        const supabase = await getSupabase();
        
        // Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          isAuthenticated: !!session,
        });

        // Listen for auth changes
        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          setAuthState({
            user: session?.user ?? null,
            session,
            loading: false,
            isAuthenticated: !!session,
          });
        });
        subscription = data.subscription;
      } catch (error) {
        console.error('Failed to initialize Supabase auth:', error);
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    }

    initializeAuth();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signUp = async (email: string, password: string, metadata?: { username?: string }) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { data, error };
  };

  const signIn = async (email: string, password: string) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  };

  const signOut = async () => {
    const supabase = await getSupabase();
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const resetPassword = async (email: string) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);
    return { data, error };
  };

  const updateProfile = async (updates: { username?: string; email?: string }) => {
    const supabase = await getSupabase();
    const { data, error } = await supabase.auth.updateUser({
      email: updates.email,
      data: { username: updates.username },
    });
    return { data, error };
  };

  return {
    ...authState,
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateProfile,
  };
}