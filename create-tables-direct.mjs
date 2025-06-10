import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://zvvoxfkdxihkysihtwiy.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY não encontrada');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createTablesDirectly() {
  console.log('🔥 Criando tabelas diretamente no Supabase...\n');
  
  try {
    // 1. Criar tabela voz_pluma_manifestations primeiro (mais simples)
    console.log('1. Criando tabela voz_pluma_manifestations...');
    
    // Testar inserção direta para verificar se a tabela existe
    const { data: testInsert, error: insertError } = await supabase
      .from('voz_pluma_manifestations')
      .insert({
        manifestation_time: '09:00',
        type: 'teste',
        title: 'Teste de Criação',
        content: 'Teste para verificar se a tabela existe',
        author: 'Sistema',
        posted_date: new Date().toISOString().split('T')[0]
      })
      .select();
    
    if (insertError) {
      if (insertError.message.includes('does not exist')) {
        console.log('   Tabela não existe, precisa ser criada manualmente no Supabase Dashboard');
      } else {
        console.log('   Erro de inserção:', insertError.message);
      }
    } else {
      console.log('   ✅ Tabela existe e funcionando');
      
      // Limpar o teste
      await supabase
        .from('voz_pluma_manifestations')
        .delete()
        .eq('type', 'teste');
    }
    
    // 2. Inserir dados iniciais se a tabela existir
    console.log('\n2. Inserindo dados iniciais...');
    
    const initialData = [
      {
        manifestation_time: '07:00',
        type: 'dica',
        title: 'Despertar da Consciência',
        content: 'Ao amanhecer, quando as energias se renovam, permita que sua consciência desperte não apenas para o mundo físico, mas para as dimensões superiores de sua essência.',
        author: 'Escriba do Templo',
        posted_date: new Date().toISOString().split('T')[0]
      },
      {
        manifestation_time: '09:00',
        type: 'verso',
        title: 'Verso da Manhã',
        content: 'Nas brumas matinais da existência,\nEu caminho entre mundos visíveis e ocultos,\nCarregando em mim a chama ancestral\nQue jamais se extingue.',
        author: 'Voz da Pluma',
        posted_date: new Date().toISOString().split('T')[0]
      },
      {
        manifestation_time: '11:00',
        type: 'reflexao',
        title: 'Reflexão do Meio-Dia',
        content: 'No auge do dia, quando o sol atinge seu zênite, reflita sobre o poder que reside em você. Cada decisão, cada pensamento, cada ação carrega o potencial de transformação.',
        author: 'Guardião da Sabedoria',
        posted_date: new Date().toISOString().split('T')[0]
      }
    ];
    
    for (const data of initialData) {
      const { error } = await supabase
        .from('voz_pluma_manifestations')
        .upsert(data, { onConflict: 'manifestation_time,posted_date' });
      
      if (!error) {
        console.log(`   ✅ Inserido: ${data.title}`);
      } else {
        console.log(`   ❌ Erro ao inserir ${data.title}: ${error.message}`);
      }
    }
    
    console.log('\n🎯 Processo concluído!');
    console.log('\n📋 Para criar todas as tabelas necessárias, execute este SQL no Supabase Dashboard:');
    console.log('\n--- COPIE E COLE NO SQL EDITOR DO SUPABASE ---\n');
    
    const sqlScript = `
-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  initiation_level INTEGER DEFAULT 0,
  personal_seal_generated BOOLEAN DEFAULT false,
  personal_seal_url TEXT,
  magical_name TEXT,
  member_type TEXT DEFAULT 'visitante',
  role TEXT NOT NULL DEFAULT 'user',
  tkazh_credits INTEGER DEFAULT 100,
  tkazh_purchased INTEGER DEFAULT 0,
  last_weekly_reset TIMESTAMP DEFAULT NOW(),
  vip_daily_bonus BOOLEAN DEFAULT false,
  last_daily_bonus TIMESTAMP,
  courses_completed TEXT[] DEFAULT '{}',
  achievements TEXT[] DEFAULT '{}',
  join_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de manifestações Voz da Pluma
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

-- Tabela de consultas oraculares
CREATE TABLE IF NOT EXISTS oracle_consultations (
  id SERIAL PRIMARY KEY,
  user_id TEXT,
  consultation_type TEXT NOT NULL,
  question TEXT NOT NULL,
  response JSONB NOT NULL,
  cost_credits INTEGER DEFAULT 0,
  ritual_type TEXT,
  entity_name TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Outras tabelas essenciais...
CREATE TABLE IF NOT EXISTS site_config (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  category TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Inserir dados iniciais
INSERT INTO voz_pluma_manifestations (manifestation_time, type, title, content, author, posted_date) VALUES
('07:00', 'dica', 'Despertar da Consciência', 'Ao amanhecer, quando as energias se renovam, permita que sua consciência desperte não apenas para o mundo físico, mas para as dimensões superiores de sua essência.', 'Escriba do Templo', CURRENT_DATE::TEXT),
('09:00', 'verso', 'Verso da Manhã', 'Nas brumas matinais da existência, Eu caminho entre mundos visíveis e ocultos, Carregando em mim a chama ancestral Que jamais se extingue.', 'Voz da Pluma', CURRENT_DATE::TEXT),
('11:00', 'reflexao', 'Reflexão do Meio-Dia', 'No auge do dia, quando o sol atinge seu zênite, reflita sobre o poder que reside em você. Cada decisão, cada pensamento, cada ação carrega o potencial de transformação.', 'Guardião da Sabedoria', CURRENT_DATE::TEXT)
ON CONFLICT DO NOTHING;
`;
    
    console.log(sqlScript);
    console.log('\n--- FIM DO SCRIPT SQL ---\n');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

createTablesDirectly();