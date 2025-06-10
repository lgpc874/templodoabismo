import OpenAI from "openai";
import { supabase } from "./supabase-client";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class VozPlumaService {
  private readonly contentTypes = ['dica', 'poema', 'ritual', 'conjuracao'] as const;
  
  private readonly mysticAuthors = [
    'Mestre Astaroth',
    'Sacerdotisa Lilith', 
    'Mago Baphomet',
    'Oracle Abyssos',
    'Hierofante Lucifer',
    'Sibila das Trevas',
    'Archon Belial',
    'Visionária Hecate'
  ];

  async generateDailyContent(type: 'dica' | 'poema' | 'ritual' | 'conjuracao'): Promise<{
    title: string;
    content: string;
    author: string;
    type: string;
  }> {
    try {
      const prompt = this.getPromptForType(type);
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um mestre luciferiano que canaliza sabedoria ancestral através de revelações místicas. Responda sempre em português brasileiro com linguagem poética e profunda, mantendo o tom solene e reverente dos ensinamentos abissais."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8,
        max_tokens: 800
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        title: result.title || this.getFallbackContent(type).title,
        content: result.content || this.getFallbackContent(type).content,
        author: this.getRandomAuthor(),
        type: type
      };

    } catch (error) {
      console.error('Erro ao gerar conteúdo com IA:', error);
      return this.getFallbackContent(type);
    }
  }

  private getPromptForType(type: string): string {
    const prompts = {
      'dica': `
        Gere uma dica mística luciferiana para o dia. Responda em JSON com:
        {
          "title": "Título místico da dica (máximo 60 caracteres)",
          "content": "Dica prática de sabedoria luciferiana para aplicar no dia (máximo 280 caracteres)"
        }
        
        A dica deve ser sobre desenvolvimento espiritual, autoconhecimento, manifestação de vontade ou práticas mágicas básicas.
      `,
      
      'poema': `
        Crie um poema místico luciferiano. Responda em JSON com:
        {
          "title": "Título poético evocativo (máximo 60 caracteres)", 
          "content": "Verso poético completo sobre temas luciferianos (máximo 400 caracteres)"
        }
        
        O poema deve abordar temas como iluminação interior, liberdade espiritual, conhecimento oculto ou a jornada do iniciado.
      `,
      
      'ritual': `
        Descreva um ritual luciferiano básico. Responda em JSON com:
        {
          "title": "Nome do ritual (máximo 60 caracteres)",
          "content": "Descrição concisa do ritual com propósito e passos básicos (máximo 350 caracteres)"
        }
        
        O ritual deve ser seguro para iniciantes, focando em meditação, invocação de sabedoria ou fortalecimento da vontade.
      `,
      
      'conjuracao': `
        Crie uma conjuração luciferiana de poder. Responda em JSON com:
        {
          "title": "Nome da conjuração (máximo 60 caracteres)",
          "content": "Texto da conjuração em linguagem solene e poderosa (máximo 300 caracteres)"
        }
        
        A conjuração deve invocar força interior, sabedoria abissal ou proteção espiritual.
      `
    };

    return prompts[type] || prompts['dica'];
  }

  private getFallbackContent(type: string): { title: string; content: string; author: string; type: string } {
    const fallbacks = {
      'dica': {
        title: 'Despertar da Consciência',
        content: 'Nas sombras do desconhecido reside a chave para o autoconhecimento. Questione as verdades impostas e busque sua própria luz interior.',
      },
      'poema': {
        title: 'Canto das Esferas',
        content: 'Entre luz e trevas dança a alma, buscando verdades no abismo eterno. Cada passo na jornada revela mistérios ancestrais.',
      },
      'ritual': {
        title: 'Ritual do Espelho Negro',
        content: 'Acenda uma vela vermelha diante de um espelho. Contemple seu reflexo e declare: "Eu sou o arquiteto de meu destino". Medite sobre suas verdadeiras aspirações.',
      },
      'conjuracao': {
        title: 'Invocação da Força Interior',
        content: 'Pela chama que queima em meu ser, pelo conhecimento que flui em minha mente, invoco a força primordial que habita as profundezas de minha alma.',
      }
    };

    return {
      ...fallbacks[type] || fallbacks['dica'],
      author: this.getRandomAuthor(),
      type: type
    };
  }

  private getRandomAuthor(): string {
    return this.mysticAuthors[Math.floor(Math.random() * this.mysticAuthors.length)];
  }

  async getTodayContent(): Promise<any> {
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('voz_pluma_content')
      .select('*')
      .eq('date', today)
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erro ao buscar conteúdo do dia:', error);
      return null;
    }

    return data?.[0] || null;
  }

  async getRecentContent(limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('voz_pluma_content')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar conteúdo recente:', error);
      return [];
    }

    return data || [];
  }

  async generateAndSaveContent(): Promise<any> {
    // Determina o tipo baseado no horário ou aleatorio
    const hour = new Date().getHours();
    let type: 'dica' | 'poema' | 'ritual' | 'conjuracao';
    
    if (hour >= 6 && hour < 9) {
      type = 'dica';
    } else if (hour >= 9 && hour < 12) {
      type = 'poema'; 
    } else if (hour >= 12 && hour < 15) {
      type = 'ritual';
    } else {
      type = 'conjuracao';
    }

    const content = await this.generateDailyContent(type);
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('voz_pluma_content')
      .insert({
        type: content.type,
        title: content.title,
        content: content.content,
        author: content.author,
        date: today,
        published: true
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar conteúdo:', error);
      throw error;
    }

    return data;
  }

  async getSettings(): Promise<any> {
    const { data, error } = await supabase
      .from('voz_pluma_settings')
      .select('*')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar configurações:', error);
      return this.getDefaultSettings();
    }

    return data || this.getDefaultSettings();
  }

  async updateSettings(settings: any): Promise<any> {
    const { data, error } = await supabase
      .from('voz_pluma_settings')
      .upsert({
        id: 1,
        ...settings,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }

    return data;
  }

  private getDefaultSettings() {
    return {
      auto_publish_enabled: true,
      daily_dica_time: "07:00",
      daily_poema_time: "09:00", 
      daily_ritual_time: "11:00",
      last_auto_publish: null
    };
  }

  async shouldAutoPublish(): Promise<boolean> {
    const settings = await this.getSettings();
    if (!settings.auto_publish_enabled) return false;

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    // Verifica se já publicou hoje
    const existingContent = await this.getTodayContent();
    if (existingContent) return false;

    // Verifica horários de publicação
    const currentTime = now.toTimeString().slice(0, 5);
    const publishTimes = [
      settings.daily_dica_time,
      settings.daily_poema_time,
      settings.daily_ritual_time
    ];

    return publishTimes.some(time => currentTime >= time);
  }
}

export const vozPlumaService = new VozPlumaService();