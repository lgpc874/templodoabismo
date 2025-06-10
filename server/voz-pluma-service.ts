import { supabaseAdmin } from './supabase-admin';
import OpenAI from 'openai';
import type { VozPlumaManifestation, InsertVozPlumaManifestation } from '@shared/schema-fixed';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class VozPlumaService {
  
  // Gerar conteúdo específico para cada horário
  async generateManifestation(time: string): Promise<InsertVozPlumaManifestation> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const dayOfWeek = new Date().getDay(); // 0 = domingo, 1 = segunda, etc.
    
    let type: string;
    let prompt: string;
    
    switch (time) {
      case '07:00':
        // Rituais ancestrais apenas aos domingos às 7h da manhã
        if (dayOfWeek === 0) {
          type = 'ritual';
          prompt = `Descreva um ritual ancestral simples para iniciar a semana dominical com poder e clareza espiritual. Focado em proteção, purificação ou conexão com as forças ancestrais. Inclua passos práticos mas mantenha a linguagem poética e mística. Este ritual deve ser adequado para começar um domingo. Máximo 3-4 frases.`;
        } else {
          type = 'dica';
          prompt = `Crie uma dica mística luciferiana para começar o dia. Deve ser uma orientação prática e inspiradora sobre autoconhecimento, poder pessoal ou desenvolvimento espiritual. Formato: Um título conciso e um texto de 2-3 frases. Não mencione "Lúcifer" diretamente, use linguagem sutil e poética.`;
        }
        break;
      case '09:00':
        type = 'verso';
        prompt = `Escreva um verso poético da "Pluma Dourada" - uma poesia curta sobre sabedoria ancestral, despertar da consciência ou conexão com o divino interior. Deve ser elegante, místico e profundo. 4-6 linhas no máximo.`;
        break;
      case '11:00':
        // Às 11h sempre será uma reflexão complementar
        type = 'reflexao';
        prompt = `Crie uma reflexão espiritual profunda para o meio da manhã. Deve inspirar contemplação sobre a jornada interior, os mistérios da existência ou a conexão com o divino. Use linguagem poética e filosófica. 2-3 frases máximo.`;
        break;
      default:
        throw new Error('Horário de manifestação inválido');
    }

    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
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
        temperature: 0.8,
      });

      const result = JSON.parse(completion.choices[0].message.content || '{}');
      
      return {
        manifestation_time: time,
        type: type,
        title: result.title || `Manifestação ${time}`,
        content: result.content || 'Conteúdo em preparação...',
        author: result.author || 'Escriba do Templo',
        posted_date: today,
        is_current: true
      };

    } catch (error) {
      console.error('Erro ao gerar manifestação:', error);
      
      // Fallback com conteúdo místico genérico
      const fallbackContent = this.getFallbackContent(type, time);
      
      return {
        manifestation_time: time,
        type: type,
        title: fallbackContent.title,
        content: fallbackContent.content,
        author: fallbackContent.author,
        posted_date: today,
        is_current: true
      };
    }
  }

  // Conteúdo de emergência quando a IA falha
  private getFallbackContent(type: string, time: string) {
    const fallbacks = {
      dica: {
        title: "Reflexão Matinal",
        content: "Inicie este dia conectando-se com sua essência mais profunda. Permita que a sabedoria interior guie seus passos rumo ao despertar da consciência.",
        author: "Guardião do Amanhecer"
      },
      verso: {
        title: "Verso da Pluma Dourada",
        content: "No silêncio da manhã, a alma desperta,\nEntre sombras e luz, a verdade se revela,\nÉ no abismo do ser que a força se liberta,\nE a chama interior eternamente cintila.",
        author: "Poeta das Profundezas"
      },
      ritual: {
        title: "Prática Ancestral Dominical",
        content: "Acenda uma vela branca e contemple sua chama por alguns minutos. Respire profundamente e conecte-se com a energia que flui através de você, honrando a sabedoria dos antigos para iniciar esta semana.",
        author: "Mestre dos Rituais"
      },
      reflexao: {
        title: "Reflexão Matinal",
        content: "No meio da manhã, permita-se uma pausa contemplativa. Observe os pensamentos que fluem como rio e reconheça a sabedoria que emerge do silêncio interior.",
        author: "Sábio das Profundezas"
      }
    };

    return fallbacks[type as keyof typeof fallbacks] || fallbacks.dica;
  }

  // Buscar manifestações atuais
  async getCurrentManifestations(): Promise<VozPlumaManifestation[]> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabaseAdmin
      .from('voz_pluma_manifestations')
      .select('*')
      .eq('posted_date', today)
      .eq('is_current', true)
      .order('manifestation_time');

    if (error) {
      console.error('Erro ao buscar manifestações:', error);
      return [];
    }

    return data || [];
  }

  // Substituir manifestação antiga pela nova
  async replaceManifestationForTime(time: string): Promise<VozPlumaManifestation | null> {
    const today = new Date().toISOString().split('T')[0];
    
    try {
      // 1. Remover manifestação anterior deste horário (substituição, não arquivamento)
      await supabaseAdmin
        .from('voz_pluma_manifestations')
        .delete()
        .eq('manifestation_time', time);

      // 2. Gerar nova manifestação
      const newManifestation = await this.generateManifestation(time);

      // 3. Inserir a nova manifestação
      const { data, error } = await supabaseAdmin
        .from('voz_pluma_manifestations')
        .insert(newManifestation)
        .select()
        .single();

      if (error) {
        console.error('Erro ao inserir manifestação:', error);
        return null;
      }

      console.log(`Nova manifestação gerada para ${time}:`, data.title);
      return data;

    } catch (error) {
      console.error('Erro ao substituir manifestação:', error);
      return null;
    }
  }

  // Gerar todas as três manifestações do dia
  async generateDailyManifestations(): Promise<VozPlumaManifestation[]> {
    const times = ['07:00', '09:00', '11:00'];
    const results: VozPlumaManifestation[] = [];

    for (const time of times) {
      const manifestation = await this.replaceManifestationForTime(time);
      if (manifestation) {
        results.push(manifestation);
      }
    }

    return results;
  }

  // Verificar se precisa gerar manifestações para o dia
  async checkAndGenerateIfNeeded(): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const currentManifestations = await this.getCurrentManifestations();
    
    // Se não há manifestações para hoje, gerar todas
    if (currentManifestations.length === 0) {
      console.log('Gerando manifestações para o dia:', today);
      await this.generateDailyManifestations();
      return;
    }

    // Verificar se algum horário está faltando
    const times = ['07:00', '09:00', '11:00'];
    const existingTimes = currentManifestations.map(m => m.manifestation_time);
    
    for (const time of times) {
      if (!existingTimes.includes(time)) {
        console.log(`Gerando manifestação faltante para ${time}`);
        await this.replaceManifestationForTime(time);
      }
    }
  }

  // Forçar regeneração de uma manifestação específica
  async regenerateManifestationForTime(time: string): Promise<VozPlumaManifestation | null> {
    if (!['07:00', '09:00', '11:00'].includes(time)) {
      throw new Error('Horário inválido. Use: 07:00, 09:00 ou 11:00');
    }

    return await this.replaceManifestationForTime(time);
  }

  // Missing methods required by scheduler
  shouldAutoPublish(): boolean {
    return true; // Always auto-publish
  }

  async generateAndSaveContent(): Promise<void> {
    await this.checkAndGenerateIfNeeded();
  }

  async getTodayContent(): Promise<VozPlumaManifestation[]> {
    return await this.getCurrentManifestations();
  }

  async getRecentContent(): Promise<VozPlumaManifestation[]> {
    const { data, error } = await supabaseAdmin
      .from('voz_pluma_manifestations')
      .select('*')
      .order('posted_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar conteúdo recente:', error);
      return [];
    }

    return data || [];
  }

  async getSettings(): Promise<any> {
    return {
      autoPublish: true,
      publishTimes: ['07:00', '09:00', '11:00']
    };
  }

  async updateSettings(settings: any): Promise<void> {
    // Settings are static for this implementation
    console.log('Settings update requested:', settings);
  }
}

export const vozPlumaService = new VozPlumaService();