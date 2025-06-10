
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { getSupabase } from '@/lib/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  username: string;
  email: string;
  initiation_level: number;
  personal_seal_generated: boolean;
}

interface AuthContextType {
  user: User | null;
  supabaseUser: SupabaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { 
    user: supabaseUser, 
    loading, 
    isAuthenticated: supabaseAuthenticated,
    signIn,
    signUp,
    signOut
  } = useSupabaseAuth();

  useEffect(() => {
    if (supabaseUser && supabaseAuthenticated) {
      // Create or update user profile based on Supabase user
      const userData: User = {
        id: supabaseUser.id,
        username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'Iniciado',
        email: supabaseUser.email || '',
        initiation_level: 1,
        personal_seal_generated: false
      };
      setUser(userData);
    } else {
      setUser(null);
    }
  }, [supabaseUser, supabaseAuthenticated]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await signIn(email, password);
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await signUp(email, password, { username });
      if (error) {
        console.error('Register error:', error.message || error);
        throw new Error(error.message || 'Erro no registro');
      }
      
      if (data.user) {
        // Create user profile after successful registration
        // Profile will be created automatically by Supabase triggers
        console.log('User registered successfully:', data.user.id);
        
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Register error:', error.message || error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const value = {
    user,
    supabaseUser,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
