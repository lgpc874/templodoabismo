import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcrypt';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestAdmin() {
  try {
    console.log('Creating test admin user...');
    
    // Create auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email: 'admin@templodoabismo.com',
      password: 'magus123',
      email_confirm: true
    });

    if (authError) {
      console.error('Auth error:', authError);
      return;
    }

    console.log('Auth user created:', authUser.user.id);

    // Create user profile
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({
        id: authUser.user.id,
        email: 'admin@templodoabismo.com',
        name: 'Admin Templo',
        role: 'admin',
        is_admin: true,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      return;
    }

    console.log('Admin profile created successfully');
    console.log('Login credentials:');
    console.log('Email: admin@templodoabismo.com');
    console.log('Password: magus123');

  } catch (error) {
    console.error('Error creating admin:', error);
  }
}

createTestAdmin();