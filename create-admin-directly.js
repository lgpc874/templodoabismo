import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdmin() {
  try {
    console.log('Connecting to Supabase...');
    
    // Test connection by listing all users
    const { data: users, error: listError } = await supabase
      .from('users')
      .select('id, email, role')
      .limit(5);
    
    console.log('Current users:', users);
    console.log('List error:', listError);
    
    if (listError) {
      console.error('Database connection failed:', listError);
      return;
    }
    
    // Check if any admins exist
    const admins = users?.filter(user => user.role === 'admin') || [];
    console.log('Existing admins:', admins.length);
    
    if (admins.length > 0) {
      console.log('Admin already exists. Cannot create another.');
      return;
    }
    
    // Find a user to promote (or create one)
    const userEmail = 'admin@templo.com';
    let targetUser = users?.find(user => user.email === userEmail);
    
    if (!targetUser) {
      console.log('Creating admin user...');
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({ 
          email: userEmail,
          username: 'admin',
          role: 'admin'
        })
        .select()
        .single();
        
      if (createError) {
        console.error('Failed to create user:', createError);
        return;
      }
      
      console.log('Admin user created:', newUser);
    } else {
      console.log('Promoting existing user to admin...');
      const { data: updatedUser, error: updateError } = await supabase
        .from('users')
        .update({ role: 'admin' })
        .eq('id', targetUser.id)
        .select()
        .single();
        
      if (updateError) {
        console.error('Failed to promote user:', updateError);
        return;
      }
      
      console.log('User promoted to admin:', updatedUser);
    }
    
    console.log('Admin setup complete!');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createAdmin();