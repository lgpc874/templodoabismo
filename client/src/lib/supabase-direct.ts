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
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Config API error:', response.status, errorText);
    throw new Error(`Failed to fetch config: ${response.status} ${errorText}`);
  }
  
  const config = await response.json();
  console.log('Supabase config received:', { 
    url: config.url, 
    hasKey: !!config.key,
    urlValid: config.url?.includes('supabase')
  });
  
  if (!config.url || !config.key) {
    throw new Error('Invalid Supabase configuration received');
  }
  
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