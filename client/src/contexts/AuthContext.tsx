import React, { createContext, useContext, useState, useEffect } from 'react';
import { createDirectSupabaseClient } from '@/lib/supabase-direct';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  username: string;
  email: string;
  initiation_level: number;
  personal_seal_generated: boolean;
  is_admin?: boolean;
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  updateUser: () => {},
  isAuthenticated: false,
  loading: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  // Initialize Supabase client and auth state
  useEffect(() => {
    let subscription: any;

    async function initializeSupabase() {
      try {
        const client = await createDirectSupabaseClient();
        setSupabaseClient(client);

        // Get current user
        const { data: { user: authUser } } = await client.auth.getUser();
        
        if (authUser) {
          const userData: User = {
            id: authUser.id,
            username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Iniciado',
            email: authUser.email || '',
            initiation_level: authUser.user_metadata?.initiation_level || 1,
            personal_seal_generated: authUser.user_metadata?.personal_seal_generated || false,
            is_admin: authUser.user_metadata?.is_admin || false
          };
          setUser(userData);
          setSupabaseUser(authUser);
        }

        // Listen for auth changes
        const { data } = client.auth.onAuthStateChange((event: any, session: any) => {
          console.log('Auth state changed:', event, session?.user?.id);
          
          if (session?.user) {
            const userData: User = {
              id: session.user.id,
              username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'Iniciado',
              email: session.user.email || '',
              initiation_level: session.user.user_metadata?.initiation_level || 1,
              personal_seal_generated: session.user.user_metadata?.personal_seal_generated || false,
              is_admin: session.user.user_metadata?.is_admin || false
            };
            setUser(userData);
            setSupabaseUser(session.user);
          } else {
            setUser(null);
            setSupabaseUser(null);
          }
        });
        
        subscription = data.subscription;
        setLoading(false);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setLoading(false);
      }
    }

    initializeSupabase();

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!supabaseClient) return false;
    
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('Login error:', error);
        return false;
      }
      
      return !!data?.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    if (!supabaseClient) return false;
    
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
            initiation_level: 1,
            personal_seal_generated: false,
            is_admin: false
          }
        }
      });
      
      if (error) {
        console.error('Registration error:', error);
        return false;
      }
      
      return !!data?.user;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    if (!supabaseClient) return;
    
    try {
      await supabaseClient.auth.signOut();
      setUser(null);
      setSupabaseUser(null);
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

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};