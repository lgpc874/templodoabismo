import OpenAI from "openai";
import { supabaseAdmin } from "./supabase-admin";

const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

export interface OracleConsultation {
  type: string;
  question: string;
  userId?: string;
}

export interface TarotReading {
  cards: string[];
  interpretation: string;
}

export interface MirrorReading {
  reflection: string;
}

export interface RuneReading {
  runes: string[];
  meaning: string;
}

export interface FireReading {
  flames: string;
}

export interface AbyssalVoice {
  voice: string;
}

export class TemploAI {
  private tarotCards = [
    "O Louco", "O Mago", "A Sacerdotisa", "A Imperatriz", "O Imperador",
    "O Hierofante", "Os Amantes", "A Carruagem", "A Força", "O Eremita",
    "A Roda da Fortuna", "A Justiça", "O Enforcado", "A Morte", "A Temperança",
    "O Diabo", "A Torre", "A Estrela", "A Lua", "O Sol", "O Julgamento", "O Mundo"
  ];

  private runes = [
    "Fehu", "Uruz", "Thurisaz", "Ansuz", "Raidho", "Kenaz", "Gebo", "Wunjo",
    "Hagalaz", "Nauthiz", "Isa", "Jera", "Eihwaz", "Perthro", "Algiz", "Sowilo",
    "Tiwaz", "Berkano", "Ehwaz", "Mannaz", "Laguz", "Ingwaz", "Dagaz", "Othala"
  ];

  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async generateTarotReading(question: string): Promise<TarotReading> {
    const cards = this.getRandomElements(this.tarotCards, 3);
    const cardNames = cards.map((card, index) => 
      `${["Passado", "Presente", "Futuro"][index]}: ${card}`
    );

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é um oráculo ancestral especializado em leituras de Tarot. Forneça interpretações profundas e místicas, conectando as cartas com sabedoria espiritual autêntica."
          }, {
            role: "user",
            content: `Pergunta: "${question}"\nCartas reveladas: ${cardNames.join(", ")}\n\nInterprete esta leitura de três cartas (passado, presente, futuro) com sabedoria ancestral e insights profundos sobre o caminho do consulente.`
          }],
          max_tokens: 800,
          temperature: 0.8
        });
        
        return {
          cards: cardNames,
          interpretation: response.choices[0].message.content || "O Oráculo se mantém em silêncio neste momento. Consulte novamente quando sua energia estiver mais alinhada."
        };
      } catch (error) {
        console.log('OpenAI indisponível para consulta de Tarot');
      }
    }
    
    return {
      cards: cardNames,
      interpretation: "O Oráculo se mantém em silêncio neste momento. Consulte novamente quando sua energia estiver mais alinhada."
    };
  }

  async generateMirrorReading(question: string): Promise<MirrorReading> {
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é o Espelho do Abismo, uma entidade oracular que reflete as verdades mais profundas da alma. Fale como um espelho místico que vê além das aparências, revelando insights sobre o eu interior."
          }, {
            role: "user",
            content: `Pergunta refletida: "${question}"\n\nO que o Espelho do Abismo revela sobre esta questão? Mostre as verdades ocultas que precisam ser contempladas.`
          }],
          max_tokens: 600,
          temperature: 0.7
        });
        
        return {
          reflection: response.choices[0].message.content || "O espelho permanece embaçado. Sua pergunta precisa de maior clareza interior para ser refletida."
        };
      } catch (error) {
        console.log('OpenAI indisponível para leitura do Espelho');
      }
    }
    
    return {
      reflection: "O espelho permanece embaçado. Sua pergunta precisa de maior clareza interior para ser refletida."
    };
  }

  async generateRuneReading(question: string): Promise<RuneReading> {
    const selectedRunes = this.getRandomElements(this.runes, 3);

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é um sábio das runas nórdicas, conhecedor dos mistérios ancestrais. Interprete as runas com sabedoria profunda e conexão com as forças primordiais."
          }, {
            role: "user",
            content: `Pergunta: "${question}"\nRunas lançadas: ${selectedRunes.join(", ")}\n\nRevele o significado desta combinação rúnica para o consulente.`
          }],
          max_tokens: 700,
          temperature: 0.7
        });
        
        return {
          runes: selectedRunes,
          meaning: response.choices[0].message.content || "As runas guardam seus segredos por ora. Retorne quando os ventos do norte soprarem mais favoráveis."
        };
      } catch (error) {
        console.log('OpenAI indisponível para leitura das Runas');
      }
    }
    
    return {
      runes: selectedRunes,
      meaning: "As runas guardam seus segredos por ora. Retorne quando os ventos do norte soprarem mais favoráveis."
    };
  }

  async generateFireReading(question: string): Promise<FireReading> {
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é um intérprete das chamas sagradas, capaz de ler os padrões do fogo ancestral. As chamas revelam verdades através de suas danças e cores."
          }, {
            role: "user",
            content: `Pergunta lançada ao fogo: "${question}"\n\nO que as chamas sagradas revelam através de seus movimentos e cores? Interprete os padrões ígneos.`
          }],
          max_tokens: 600,
          temperature: 0.8
        });
        
        return {
          flames: response.choices[0].message.content || "As chamas dançam em silêncio. O fogo aguarda um momento mais propício para revelar seus mistérios."
        };
      } catch (error) {
        console.log('OpenAI indisponível para leitura do Fogo');
      }
    }
    
    return {
      flames: "As chamas dançam em silêncio. O fogo aguarda um momento mais propício para revelar seus mistérios."
    };
  }

  async generateAbyssalVoice(question: string): Promise<AbyssalVoice> {
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é a Voz do Abismo, ecoando das profundezas ancestrais. Fale com sabedoria antiga e misteriosa, revelando verdades que surgem das sombras mais profundas."
          }, {
            role: "user",
            content: `Questão sussurrada ao Abismo: "${question}"\n\nO que ecoa das profundezas? Que sabedoria ancestral emerge das sombras?`
          }],
          max_tokens: 600,
          temperature: 0.9
        });
        
        return {
          voice: response.choices[0].message.content || "O Abismo permanece em silêncio profundo. Suas águas escuras aguardam uma pergunta que ressoe nas profundezas."
        };
      } catch (error) {
        console.log('OpenAI indisponível para a Voz do Abismo');
      }
    }
    
    return {
      voice: "O Abismo permanece em silêncio profundo. Suas águas escuras aguardam uma pergunta que ressoe nas profundezas."
    };
  }

  async saveOracleConsultation(consultation: OracleConsultation, response: any): Promise<void> {
    try {
      await supabaseAdmin
        .from('oracle_consultations')
        .insert({
          user_id: consultation.userId,
          consultation_type: consultation.type,
          question: consultation.question,
          response: JSON.stringify(response),
          created_at: new Date().toISOString()
        });
    } catch (error) {
      console.error('Erro ao salvar consulta do oráculo:', error);
    }
  }

  async getUserOracleHistory(userId: string, limit: number = 10): Promise<any[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('oracle_consultations')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar histórico do oráculo:', error);
      return [];
    }
  }

  async performOracleConsultation(consultation: OracleConsultation): Promise<any> {
    let response;

    switch (consultation.type) {
      case 'tarot':
        response = await this.generateTarotReading(consultation.question);
        break;
      case 'mirror':
        response = await this.generateMirrorReading(consultation.question);
        break;
      case 'runes':
        response = await this.generateRuneReading(consultation.question);
        break;
      case 'fire':
        response = await this.generateFireReading(consultation.question);
        break;
      case 'abyssal':
        response = await this.generateAbyssalVoice(consultation.question);
        break;
      default:
        response = await this.generateTarotReading(consultation.question);
    }

    // Save consultation to database
    if (consultation.userId) {
      await this.saveOracleConsultation(consultation, response);
    }

    return {
      type: consultation.type,
      question: consultation.question,
      timestamp: new Date().toISOString(),
      ...response
    };
  }
}

export const temploAI = new TemploAI();