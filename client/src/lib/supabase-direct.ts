import { createClient } from '@supabase/supabase-js';

// Direct Supabase client for testing
export async function createDirectSupabaseClient() {
  // Try environment variables first
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_KEY;
  
  if (envUrl && envKey) {
    console.log('Using environment variables for Supabase');
    return createClient(envUrl, envKey);
  }
  
  // Fallback to API endpoint
  console.log('Fetching Supabase config from API');
  const response = await fetch('/api/config/supabase');
  const config = await response.json();
  
  console.log('Supabase config:', { url: config.url, hasKey: !!config.key });
  
  return createClient(config.url, config.key);
}

// Test function
export async function testSupabaseAuth() {
  try {
    const supabase = await createDirectSupabaseClient();
    
    // Test signup
    const { data, error } = await supabase.auth.signUp({
      email: 'test@example.com',
      password: 'test123456',
      options: {
        data: {
          username: 'testuser'
        }
      }
    });
    
    console.log('Test signup result:', { data, error });
    return { data, error };
  } catch (err) {
    console.error('Test failed:', err);
    return { data: null, error: err };
  }
}