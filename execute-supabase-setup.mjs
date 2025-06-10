import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

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

async function executeSQLSetup() {
  console.log('🔥 Executando setup completo do banco Supabase...\n');
  
  try {
    // Ler o arquivo SQL
    const sqlContent = fs.readFileSync('supabase-complete-setup.sql', 'utf8');
    
    // Dividir em comandos individuais
    const commands = sqlContent
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));
    
    console.log(`📋 Executando ${commands.length} comandos SQL...\n`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < commands.length; i++) {
      const command = commands[i];
      
      if (command.includes('CREATE TABLE') || command.includes('INSERT INTO') || command.includes('CREATE INDEX')) {
        console.log(`[${i + 1}/${commands.length}] Executando: ${command.substring(0, 50)}...`);
        
        try {
          const { error } = await supabase.rpc('exec_sql', { 
            sql: command + ';' 
          });
          
          if (error) {
            if (error.message.includes('already exists') || error.message.includes('duplicate key')) {
              console.log('   ⚠️  Já existe, pulando...');
            } else {
              console.error(`   ❌ Erro: ${error.message}`);
              errorCount++;
            }
          } else {
            console.log('   ✅ Sucesso');
            successCount++;
          }
        } catch (err) {
          console.error(`   ❌ Erro de execução: ${err.message}`);
          errorCount++;
        }
        
        // Pequena pausa entre comandos
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`\n🎯 Setup concluído:`);
    console.log(`   ✅ Sucessos: ${successCount}`);
    console.log(`   ❌ Erros: ${errorCount}`);
    
    // Verificar se as tabelas principais foram criadas
    console.log('\n📊 Verificando tabelas criadas...');
    
    const tablesToCheck = [
      'users',
      'voz_pluma_manifestations', 
      'oracle_consultations',
      'grimoires',
      'courses',
      'site_config'
    ];
    
    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`   ❌ ${table}: ${error.message}`);
        } else {
          console.log(`   ✅ ${table}: OK`);
        }
      } catch (err) {
        console.log(`   ❌ ${table}: ${err.message}`);
      }
    }
    
    console.log('\n🚀 Setup do banco Supabase concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

executeSQLSetup();