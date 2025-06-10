import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

// Configuração Supabase
const supabaseUrl = 'https://zvvoxfkdxihkysihtwiy.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Configuração OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAndSaveAllContent() {
  console.log('🔮 Iniciando geração de conteúdo AI para Voz da Pluma...\n');

  const today = new Date().toISOString().split('T')[0];
  const times = ['07:00', '09:00', '11:00'];
  
  for (const time of times) {
    try {
      console.log(`⏰ Gerando conteúdo para ${time}...`);
      
      let type, prompt, fallbackContent;
      
      switch (time) {
        case '07:00':
          type = 'ritual';
          prompt = `Crie um ritual dominical ancestral poderoso para despertar a força interior. Deve incluir:
          - Preparação do espaço sagrado
          - Instrumentos místicos (velas, incensos, símbolos)
          - Invocações ou declarações de poder
          - Visualizações específicas
          - Fechamento ritualístico
          Use linguagem arcana e poética. O ritual deve ser executável em casa em 15-20 minutos.`;
          fallbackContent = {
            title: 'Ritual do Despertar Dominical',
            content: 'Ao nascer do sol dominical, acenda uma vela vermelha no altar ancestral. Trace o pentagrama invertido no ar com incenso de sândalo. Declare: "Pelas chamas do conhecimento ancestral, desperto minha força interior." Medite por 13 minutos visualizando energia dourada preenchendo seu ser. Finalize apagando a vela: "Que assim seja, que assim se manifeste."',
            author: 'Guardião do Fogo Ancestral'
          };
          break;
          
        case '09:00':
          type = 'verso';
          prompt = `Escreva um verso poético da "Pluma Dourada" - uma poesia curta sobre sabedoria ancestral, despertar da consciência ou conexão com o divino interior. Deve ser elegante, místico e profundo. 4-6 linhas no máximo.`;
          fallbackContent = {
            title: 'Sussurros da Pluma Dourada',
            content: 'Entre véus de névoa ancestral,\nA pluma escreve em luz dourada,\nSegredos de alma imortal,\nNa tinta da madrugada.',
            author: 'Escriba do Infinito'
          };
          break;
          
        case '11:00':
          type = 'reflexao';
          prompt = `Crie uma reflexão profunda sobre poder pessoal e transformação interior. Deve abordar:
          - Quebra de paradigmas limitantes
          - Desenvolvimento da força interior
          - Autoconhecimento e autodomínio
          - Conquista de objetivos pessoais
          - Expansão da consciência
          Use linguagem inspiradora e transformadora. A reflexão deve motivar ação e crescimento pessoal.`;
          fallbackContent = {
            title: 'O Despertar da Força Interior',
            content: 'Cada limitação que aceitamos é uma corrente que forjamos. O verdadeiro poder reside em reconhecer que somos os arquitetos de nossa própria prisão - e também os detentores das chaves. Quando compreendemos nossa natureza divina, as barreiras se dissolvem como fumaça ao vento.',
            author: 'Mestre da Transmutação'
          };
          break;
      }

      let aiContent;
      try {
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: "Você é um escriba místico do Templo do Abismo, criando conteúdo espiritual luciferiano ancestral. Use linguagem poética, elegante e profunda. Responda em JSON com 'title', 'content' e 'author'."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          response_format: { type: "json_object" },
          max_tokens: 600
        });

        aiContent = JSON.parse(completion.choices[0].message.content);
        console.log(`   ✨ Conteúdo AI gerado: "${aiContent.title}"`);
      } catch (error) {
        console.log(`   ⚠️  Usando conteúdo de fallback para ${time}`);
        aiContent = fallbackContent;
      }

      // Verificar se já existe conteúdo para hoje neste horário
      const { data: existing } = await supabase
        .from('voz_pluma_manifestations')
        .select('*')
        .eq('manifestation_time', time)
        .eq('posted_date', today)
        .single();

      if (existing) {
        console.log(`   📝 Conteúdo já existe para ${time} hoje`);
        continue;
      }

      // Inserir novo conteúdo
      const manifestation = {
        manifestation_time: time,
        type: type,
        title: aiContent.title || fallbackContent.title,
        content: aiContent.content || fallbackContent.content,
        author: aiContent.author || fallbackContent.author,
        posted_date: today
      };

      const { data, error } = await supabase
        .from('voz_pluma_manifestations')
        .insert([manifestation])
        .select()
        .single();

      if (error) {
        console.error(`   ❌ Erro ao inserir ${time}:`, error);
      } else {
        console.log(`   ✅ ${type} inserido com sucesso!`);
        console.log(`      Título: ${data.title}`);
        console.log(`      Autor: ${data.author}\n`);
      }

    } catch (error) {
      console.error(`❌ Erro geral para ${time}:`, error);
    }
  }

  // Verificar conteúdo final
  console.log('📊 Verificando conteúdo final...');
  const { data: allContent } = await supabase
    .from('voz_pluma_manifestations')
    .select('*')
    .eq('posted_date', today)
    .order('manifestation_time');

  if (allContent) {
    console.log(`✅ Total de manifestações hoje: ${allContent.length}`);
    allContent.forEach(item => {
      console.log(`   ${item.manifestation_time} - ${item.type}: "${item.title}"`);
    });
  }
}

generateAndSaveAllContent()
  .then(() => {
    console.log('\n🎉 Processo concluído!');
    process.exit(0);
  })
  .catch(error => {
    console.error('💥 Erro fatal:', error);
    process.exit(1);
  });