import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createVozPlumaTable() {
  console.log('Creating voz_pluma_manifestations table...');
  
  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS voz_pluma_manifestations (
        id SERIAL PRIMARY KEY,
        manifestation_time TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        author TEXT NOT NULL,
        posted_date TEXT NOT NULL,
        posted_at TIMESTAMP DEFAULT NOW(),
        is_current BOOLEAN DEFAULT TRUE
      );
    `
  });

  if (error) {
    console.error('Error creating table:', error);
    return false;
  }

  console.log('Table created successfully');
  return true;
}

async function insertSampleManifestations() {
  console.log('Inserting sample manifestations...');
  
  const today = new Date().toISOString().split('T')[0];
  
  const manifestations = [
    {
      manifestation_time: '07:00',
      type: 'dica',
      title: 'Despertar da Consciência',
      content: 'Inicie este dia conectando-se com sua essência mais profunda. Permita que a sabedoria interior guie seus passos rumo ao autoconhecimento.',
      author: 'Guardião do Amanhecer',
      posted_date: today,
      is_current: true
    },
    {
      manifestation_time: '09:00',
      type: 'verso',
      title: 'Verso da Pluma Dourada',
      content: 'No silêncio da manhã, a alma desperta,\nEntre sombras e luz, a verdade se revela,\nÉ no abismo do ser que a força se liberta,\nE a chama interior eternamente cintila.',
      author: 'Poeta das Profundezas',
      posted_date: today,
      is_current: true
    },
    {
      manifestation_time: '11:00',
      type: 'ritual',
      title: 'Prática Ancestral',
      content: 'Acenda uma vela branca e contemple sua chama por alguns minutos. Respire profundamente e conecte-se com a energia que flui através de você.',
      author: 'Mestre dos Rituais',
      posted_date: today,
      is_current: true
    }
  ];

  // Clear existing manifestations for today
  await supabase
    .from('voz_pluma_manifestations')
    .delete()
    .eq('posted_date', today);

  // Insert new manifestations
  const { data, error } = await supabase
    .from('voz_pluma_manifestations')
    .insert(manifestations)
    .select();

  if (error) {
    console.error('Error inserting manifestations:', error);
    return false;
  }

  console.log('Sample manifestations inserted:', data.length);
  return true;
}

async function testVozPluma() {
  try {
    // Test database connection
    const { data, error } = await supabase
      .from('voz_pluma_manifestations')
      .select('count(*)')
      .single();

    if (error && error.code === '42P01') {
      console.log('Table does not exist, creating...');
      await createVozPlumaTable();
    }

    // Insert sample data
    await insertSampleManifestations();

    // Test retrieval
    const { data: manifestations, error: fetchError } = await supabase
      .from('voz_pluma_manifestations')
      .select('*')
      .eq('posted_date', new Date().toISOString().split('T')[0])
      .order('manifestation_time');

    if (fetchError) {
      console.error('Error fetching manifestations:', fetchError);
      return;
    }

    console.log('\nCurrent manifestations:');
    manifestations.forEach(m => {
      console.log(`${m.manifestation_time} - ${m.title} (${m.type})`);
    });

    console.log('\nVoz da Pluma system is ready!');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testVozPluma();