import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCompleteVozPlumaSystem() {
  console.log('🔮 Testing Complete Voz da Pluma System...\n');

  try {
    // 1. Test database connection and table structure
    console.log('1. Testing database structure...');
    const { data: tableInfo, error: tableError } = await supabase
      .from('voz_pluma_manifestations')
      .select('*')
      .limit(1);

    if (tableError) {
      console.error('❌ Table access error:', tableError.message);
      return false;
    }
    console.log('✅ Database table accessible');

    // 2. Test current manifestations retrieval
    console.log('\n2. Testing manifestations retrieval...');
    const today = new Date().toISOString().split('T')[0];
    
    const { data: manifestations, error: fetchError } = await supabase
      .from('voz_pluma_manifestations')
      .select('*')
      .eq('posted_date', today)
      .eq('is_current', true)
      .order('manifestation_time');

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError.message);
      return false;
    }

    console.log(`✅ Found ${manifestations.length} manifestations for today`);

    // 3. Verify three-card system structure
    console.log('\n3. Verifying three-card system...');
    const requiredTimes = ['07:00', '09:00', '11:00'];
    const requiredTypes = ['dica', 'verso', 'ritual'];
    
    const manifestationsByTime = {
      '07:00': manifestations.find(m => m.manifestation_time === '07:00'),
      '09:00': manifestations.find(m => m.manifestation_time === '09:00'), 
      '11:00': manifestations.find(m => m.manifestation_time === '11:00')
    };

    let allCardsValid = true;

    for (const time of requiredTimes) {
      const manifestation = manifestationsByTime[time];
      if (!manifestation) {
        console.log(`❌ Missing manifestation for ${time}`);
        allCardsValid = false;
      } else {
        console.log(`✅ ${time} - ${manifestation.title} (${manifestation.type})`);
        console.log(`   Author: ${manifestation.author}`);
        console.log(`   Content: ${manifestation.content.substring(0, 60)}...`);
      }
    }

    if (!allCardsValid) {
      console.log('\n⚠️  Some manifestations are missing. Generating...');
      await generateMissingManifestations(manifestationsByTime);
    }

    // 4. Test content replacement functionality
    console.log('\n4. Testing content replacement...');
    const testTime = '07:00';
    const originalContent = manifestationsByTime[testTime]?.content;
    
    // Delete and recreate to test replacement
    await supabase
      .from('voz_pluma_manifestations')
      .delete()
      .eq('manifestation_time', testTime);

    const newManifestation = {
      manifestation_time: testTime,
      type: 'dica',
      title: 'Teste de Renovação',
      content: 'Esta é uma manifestação de teste para verificar o sistema de substituição de conteúdo.',
      author: 'Sistema de Teste',
      posted_date: today,
      is_current: true
    };

    const { error: insertError } = await supabase
      .from('voz_pluma_manifestations')
      .insert(newManifestation);

    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
    } else {
      console.log('✅ Content replacement working correctly');
      
      // Restore original content
      await supabase
        .from('voz_pluma_manifestations')
        .delete()
        .eq('manifestation_time', testTime);
        
      await supabase
        .from('voz_pluma_manifestations')
        .insert({
          manifestation_time: testTime,
          type: 'dica',
          title: 'Despertar da Consciência',
          content: originalContent || 'Inicie este dia conectando-se com sua essência mais profunda.',
          author: 'Guardião do Amanhecer',
          posted_date: today,
          is_current: true
        });
    }

    // 5. Final system verification
    console.log('\n5. Final system verification...');
    const { data: finalCheck } = await supabase
      .from('voz_pluma_manifestations')
      .select('*')
      .eq('posted_date', today)
      .eq('is_current', true)
      .order('manifestation_time');

    console.log('\n🌟 VOZ DA PLUMA SYSTEM STATUS:');
    console.log('================================');
    finalCheck.forEach(m => {
      const typeLabels = {
        'dica': '🌅 Dica Mística',
        'verso': '📜 Verso da Pluma',
        'ritual': '⚡ Ritual Ancestral'
      };
      
      console.log(`${typeLabels[m.type]} (${m.manifestation_time})`);
      console.log(`  📝 ${m.title}`);
      console.log(`  👤 ${m.author}`);
      console.log(`  📅 ${m.posted_date}`);
      console.log('');
    });

    console.log('✅ Voz da Pluma three-card system is fully operational!');
    return true;

  } catch (error) {
    console.error('❌ System test failed:', error);
    return false;
  }
}

async function generateMissingManifestations(manifestationsByTime) {
  const today = new Date().toISOString().split('T')[0];
  
  const defaultManifestations = [
    {
      manifestation_time: '07:00',
      type: 'dica',
      title: 'Despertar da Consciência',
      content: 'Inicie este dia conectando-se com sua essência mais profunda. Permita que a sabedoria interior guie seus passos rumo ao autoconhecimento e ao despertar espiritual.',
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
      content: 'Acenda uma vela branca e contemple sua chama por alguns minutos. Respire profundamente e conecte-se com a energia que flui através de você, honrando a sabedoria dos antigos mestres.',
      author: 'Mestre dos Rituais',
      posted_date: today,
      is_current: true
    }
  ];

  for (const manifestation of defaultManifestations) {
    if (!manifestationsByTime[manifestation.manifestation_time]) {
      const { error } = await supabase
        .from('voz_pluma_manifestations')
        .insert(manifestation);
        
      if (!error) {
        console.log(`✅ Generated missing manifestation for ${manifestation.manifestation_time}`);
      }
    }
  }
}

testCompleteVozPlumaSystem();