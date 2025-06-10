import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zvvoxfkdxihkysihtwiy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in environment');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function testVozPlumaDatabase() {
  console.log('🔥 Testing Voz da Pluma Database Connection 🔥\n');
  
  try {
    // 1. Test basic connection
    console.log('1. Testing Supabase connection...');
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Connection failed:', tablesError.message);
      return;
    }
    console.log('✅ Supabase connection successful');
    
    // 2. Check if voz_pluma_manifestations table exists
    console.log('\n2. Checking voz_pluma_manifestations table...');
    const { data: tableExists, error: tableError } = await supabase
      .from('voz_pluma_manifestations')
      .select('count(*)')
      .limit(1);
    
    if (tableError) {
      console.log('❌ Table does not exist, creating it...');
      await createVozPlumaTable();
    } else {
      console.log('✅ Table exists');
    }
    
    // 3. Test inserting sample data
    console.log('\n3. Testing data insertion...');
    const today = new Date().toISOString().split('T')[0];
    const sampleData = {
      manifestation_time: '09:00',
      type: 'verso',
      title: 'Teste de Manifestação',
      content: 'Este é um teste do sistema Voz da Pluma.',
      author: 'Sistema de Teste',
      posted_date: today,
      is_current: true
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('voz_pluma_manifestations')
      .insert(sampleData)
      .select();
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
    } else {
      console.log('✅ Insert successful:', insertResult[0]?.id);
    }
    
    // 4. Test fetching data
    console.log('\n4. Testing data retrieval...');
    const { data: fetchResult, error: fetchError } = await supabase
      .from('voz_pluma_manifestations')
      .select('*')
      .eq('posted_date', today)
      .order('manifestation_time');
    
    if (fetchError) {
      console.error('❌ Fetch failed:', fetchError.message);
    } else {
      console.log('✅ Fetch successful, found', fetchResult?.length || 0, 'records');
    }
    
    // 5. Clean up test data
    console.log('\n5. Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from('voz_pluma_manifestations')
      .delete()
      .eq('author', 'Sistema de Teste');
    
    if (!deleteError) {
      console.log('✅ Cleanup successful');
    }
    
    console.log('\n🎯 Database test completed successfully! 🎯');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

async function createVozPlumaTable() {
  console.log('Creating voz_pluma_manifestations table...');
  
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS voz_pluma_manifestations (
      id SERIAL PRIMARY KEY,
      manifestation_time TEXT NOT NULL,
      type TEXT NOT NULL,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL,
      posted_date TEXT NOT NULL,
      posted_at TIMESTAMP DEFAULT NOW(),
      is_current BOOLEAN DEFAULT true
    );
  `;
  
  const { error } = await supabase.rpc('exec_sql', { sql: createTableQuery });
  
  if (error) {
    console.error('❌ Failed to create table:', error.message);
  } else {
    console.log('✅ Table created successfully');
  }
}

testVozPlumaDatabase();