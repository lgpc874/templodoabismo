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

  // Initialize Supabase client
  useEffect(() => {
    let subscription: any = null;

    async function initializeSupabase() {
      try {
        const client = await createDirectSupabaseClient();
        setSupabaseClient(client);
        
        // Get initial session
        const { data: { session } } = await client.auth.getSession();
        const currentUser = session?.user ?? null;
        setSupabaseUser(currentUser);
        
        if (currentUser) {
          const userData: User = {
            id: currentUser.id,
            username: currentUser.user_metadata?.username || currentUser.email?.split('@')[0] || 'Iniciado',
            email: currentUser.email || '',
            initiation_level: 1,
            personal_seal_generated: false
          };
          setUser(userData);
        }
        
        // Listen for auth changes
        const { data } = client.auth.onAuthStateChange((_event: any, session: any) => {
          const authUser = session?.user ?? null;
          setSupabaseUser(authUser);
          
          if (authUser) {
            const userData: User = {
              id: authUser.id,
              username: authUser.user_metadata?.username || authUser.email?.split('@')[0] || 'Iniciado',
              email: authUser.email || '',
              initiation_level: 1,
              personal_seal_generated: false
            };
            setUser(userData);
          } else {
            setUser(null);
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
      
      return !!data.user;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    if (!supabaseClient) {
      console.error('Supabase client not initialized');
      return false;
    }
    
    try {
      console.log('Starting registration for:', email);
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username
          }
        }
      });
      
      if (error) {
        console.error('Supabase signup error:', error);
        return false;
      }
      
      if (data?.user) {
        console.log('User registered successfully:', data.user.id);
        return true;
      }
      
      console.warn('No user returned from signup');
      return false;
    } catch (error: any) {
      console.error('Registration exception:', error);
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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};