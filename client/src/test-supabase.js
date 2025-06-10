// Teste direto do Supabase
import { createClient } from '@supabase/supabase-js';

async function testSupabase() {
  try {
    console.log('Testing Supabase connection...');
    
    // Get config from server
    const configResponse = await fetch('/api/config/supabase');
    const config = await configResponse.json();
    
    console.log('Config received:', { url: config.url, hasKey: !!config.key });
    
    // Create client
    const supabase = createClient(config.url, config.key);
    
    // Test sign up
    const testEmail = 'test@templo.com';
    const testPassword = 'test123456';
    
    console.log('Attempting signup...');
    const { data, error } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          username: 'testuser'
        }
      }
    });
    
    if (error) {
      console.error('Signup error:', error);
    } else {
      console.log('Signup success:', data);
    }
    
  } catch (err) {
    console.error('Test failed:', err);
  }
}

// Run test
testSupabase();