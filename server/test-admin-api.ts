import { supabase, supabaseAdmin } from '../shared/supabase';

async function testAdminCreation() {
  try {
    console.log('Testing admin creation...');
    
    const email = 'admin@templo.com';
    
    // Test database connection
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id, email, is_admin');

    console.log('Database query result:', { allUsers, allUsersError });

    if (allUsersError) {
      console.error('Database error:', allUsersError);
      return;
    }

    // Find user by email
    const userData = allUsers?.find(user => user.email === email);
    
    if (!userData) {
      console.log('User not found. Creating test user...');
      
      // Create a test user first
      const { data: newUser, error: createError } = await supabaseAdmin
        .from('users')
        .insert({ 
          email,
          first_name: 'Admin',
          last_name: 'User',
          is_admin: false
        })
        .select()
        .single();
        
      console.log('User creation result:', { newUser, createError });
      
      if (createError) {
        console.error('Failed to create user:', createError);
        return;
      }
    }

    // Now promote to admin
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('users')
      .update({ is_admin: true })
      .eq('email', email)
      .select()
      .single();

    console.log('Admin promotion result:', { updatedUser, updateError });

  } catch (error) {
    console.error('Test error:', error);
  }
}

testAdminCreation();