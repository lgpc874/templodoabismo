const { createClient } = require('@supabase/supabase-js');

// Test Supabase connection
async function testSupabase() {
  try {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.log('❌ Missing Supabase environment variables');
      return;
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Test connection with a simple query
    const { data, error } = await supabase
      .from('voz_pluma_manifestations')
      .select('count')
      .limit(1);

    if (error) {
      console.log('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('✅ Database integration working properly');
    }
  } catch (err) {
    console.log('❌ Connection test failed:', err.message);
  }
}

testSupabase();