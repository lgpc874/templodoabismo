import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupTables() {
  console.log('Setting up Supabase tables...');
  
  try {
    // Create users table
    const { error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError && usersError.message.includes('does not exist')) {
      console.log('Creating users table...');
      // Since we can't execute DDL directly, we'll create a minimal record to ensure table exists
      const { error } = await supabase
        .from('users')
        .insert({
          email: 'admin@templo.com',
          password: '$2b$10$dummy.hash.for.initial.setup',
          name: 'Administrador Principal',
          role: 'admin',
          username: 'admin'
        });
      
      if (error && !error.message.includes('already exists')) {
        console.log('Note: Manual table creation required in Supabase dashboard');
        console.log('Required tables: users, admin_sessions');
      }
    }
    
    // Test admin_sessions table
    const { error: sessionsError } = await supabase
      .from('admin_sessions')
      .select('id')
      .limit(1);
    
    if (sessionsError && sessionsError.message.includes('does not exist')) {
      console.log('Note: admin_sessions table needs to be created in Supabase dashboard');
    }
    
    console.log('Supabase setup check completed');
    
  } catch (error) {
    console.error('Setup error:', error.message);
  }
}

setupTables();