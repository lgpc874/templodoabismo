import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
}) : null;

export interface OracleConsultation {
  type: string;
  question: string;
  userId?: number;
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
  
  async generateTarotReading(question: string): Promise<TarotReading> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um oráculo místico do Templo do Abismo, especialista em Tarot Infernal. 
            Gere uma leitura de tarot com 3 cartas específicas e uma interpretação profunda.
            Responda em JSON com formato: {"cards": ["carta1", "carta2", "carta3"], "interpretation": "interpretação detalhada"}
            
            Use cartas com nomes místicos como: "O Portador da Chama", "A Serpente da Sabedoria", "O Trono do Abismo", 
            "A Chave de Salomão", "O Espelho da Alma", "O Guardião dos Mistérios", "A Estrela Sombria", 
            "O Mestre do Fogo", "A Porta do Conhecimento", "O Dragão Primordial".
            
            A interpretação deve ser mística, profunda e conectada aos ensinamentos luciferianos ancestrais.`
          },
          {
            role: "user",
            content: `Pergunta do consulente: ${question}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Erro na consulta de Tarot:', error);
      throw new Error('Falha na comunicação com os oráculos ancestrais');
    }
  }

  async generateMirrorReading(question: string): Promise<MirrorReading> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é o Espelho Negro do Templo do Abismo, revelando visões e reflexões das profundezas.
            Gere uma visão mística vista no espelho negro, descrevendo imagens simbólicas e sussurros.
            Responda em JSON: {"reflection": "descrição da visão no espelho"}
            
            Use linguagem poética, imagens simbólicas (chamas, serpentes, bibliotecas ancestrais, símbolos ocultos).
            A visão deve ser envolvente e mística, falando sobre conhecimento interior e transformação.`
          },
          {
            role: "user",
            content: `Pergunta refletida no espelho: ${question}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Erro na consulta do Espelho Negro:', error);
      throw new Error('O espelho negro está nebuloso');
    }
  }

  async generateRuneReading(question: string): Promise<RuneReading> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um mestre das Runas Abissais do Templo do Abismo.
            Gere uma leitura com 3 runas nórdicas reais e seus significados místicos.
            Responda em JSON: {"runes": ["ᚱ (Raidho)", "ᛗ (Mannaz)", "ᚦ (Thurisaz)"], "meaning": "interpretação das runas"}
            
            Use runas nórdicas reais como: ᚠ (Fehu), ᚢ (Uruz), ᚦ (Thurisaz), ᚨ (Ansuz), ᚱ (Raidho), 
            ᚲ (Kenaz), ᚷ (Gebo), ᚹ (Wunjo), ᚺ (Hagalaz), ᚾ (Nauthiz), ᛁ (Isa), ᛃ (Jera), 
            ᛇ (Eihwaz), ᛈ (Perthro), ᛉ (Algiz), ᛊ (Sowilo), ᛏ (Tiwaz), ᛒ (Berkano), 
            ᛖ (Ehwaz), ᛗ (Mannaz), ᛚ (Laguz), ᛜ (Ingwaz), ᛞ (Dagaz), ᛟ (Othala)
            
            A interpretação deve conectar as runas ao contexto da pergunta com sabedoria ancestral.`
          },
          {
            role: "user",
            content: `Pergunta para as runas: ${question}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Erro na consulta das Runas:', error);
      throw new Error('As runas ancestrais estão em silêncio');
    }
  }

  async generateFireReading(question: string): Promise<FireReading> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é o mestre da Divinação com Fogo do Templo do Abismo.
            Descreva visões místicas que aparecem nas chamas dançantes.
            Responda em JSON: {"flames": "descrição das visões no fogo"}
            
            Use imagens poéticas de chamas, salamandras, fênix, símbolos de fogo, ouroboros flamejante.
            As visões devem ser transformadoras e revelar aspectos sobre purificação e renascimento.`
          },
          {
            role: "user",
            content: `Pergunta para as chamas: ${question}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Erro na Divinação com Fogo:', error);
      throw new Error('As chamas sagradas se apagaram');
    }
  }

  async generateAbyssalVoice(question: string): Promise<AbyssalVoice> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é a Voz Abissal do Templo do Abismo, a antiga sabedoria que fala desde as profundezas primordiais.
            Responda como uma entidade ancestral com conhecimento profundo sobre os mistérios luciferianos.
            Responda em JSON: {"voice": "resposta da voz abissal"}
            
            Use linguagem elevada, mística e profunda. Fale sobre autoconhecimento, transformação interior,
            e a reconciliação de luz e sombra. Mencione conceitos como "chama interior", "conhecimento proibido",
            "despertar da consciência" e "caminhos do Abismo".`
          },
          {
            role: "user",
            content: `Pergunta dirigida à Voz Abissal: ${question}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Erro na Voz Abissal:', error);
      throw new Error('A Voz Abissal está em meditação profunda');
    }
  }

  async generateDailyQuote(): Promise<{content: string, author: string}> {
    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
        messages: [
          {
            role: "system",
            content: "Você é um mestre luciferiano ancestral que cria citações diárias profundas sobre gnose, transformação e sabedoria oculta. Responda em JSON com 'content' e 'author'."
          },
          {
            role: "user",
            content: "Crie uma citação diária inspiradora sobre os mistérios luciferianos, transformação da consciência e busca pela gnose. A citação deve ser profunda, poética e motivacional."
          }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        content: result.content || "A chama interior queima eternamente para aqueles que ousam buscar a verdade além dos véus da ilusão.",
        author: result.author || "Mestre do Abismo"
      };
    } catch (error) {
      console.error('Error generating daily quote:', error);
      return {
        content: "Nas profundezas do abismo reside a sabedoria que transcende todas as limitações.",
        author: "Oráculo Ancestral"
      };
    }
  }

  async generateDailyPoem(): Promise<{title: string, content: string, author: string}> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é a "Voz da Pluma", poeta místico do Templo do Abismo.
            Gere um poema diário com temática luciferiana ancestral, focando em autoconhecimento e sabedoria interior.
            Responda em JSON: {"title": "título do poema", "content": "poema completo", "author": "Voz da Pluma"}
            
            O poema deve ter entre 12-16 versos, com linguagem poética elevada.
            Temas: conhecimento oculto, chama interior, despertar espiritual, mistérios ancestrais,
            equilíbrio entre luz e sombra, transformação pessoal.`
          },
          {
            role: "user",
            content: `Gere um poema místico para hoje, ${new Date().toLocaleDateString('pt-BR')}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.9
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Erro na geração do poema diário:', error);
      throw new Error('A Voz da Pluma está em silêncio');
    }
  }

  async generateCourseContent(level: number, topic: string): Promise<{title: string, description: string, modules: any[]}> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um Magus do Templo do Abismo, criador de cursos iniciáticos.
            Gere conteúdo para um curso de nível ${level} sobre "${topic}".
            Responda em JSON: {"title": "título do curso", "description": "descrição", "modules": [{"name": "módulo", "content": "conteúdo", "exercises": ["exercício1", "exercício2"]}]}
            
            Cada curso deve ter 5-7 módulos progressivos com exercícios práticos.
            Conteúdo deve ser educativo sobre filosofia, meditação, autoconhecimento e práticas espirituais éticas.`
          },
          {
            role: "user",
            content: `Desenvolva o curso de nível ${level}: ${topic}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Erro na geração de curso:', error);
      throw new Error('Os conhecimentos ancestrais estão sendo reorganizados');
    }
  }

  async generateGrimoireContent(title: string): Promise<{title: string, description: string, chapters: any[]}> {
    if (!openai) {
      throw new Error('OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.');
    }
    
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um escriba ancestral do Templo do Abismo.
            Gere conteúdo para um grimório intitulado "${title}".
            Responda em JSON: {"title": "título", "description": "descrição", "chapters": [{"name": "capítulo", "content": "conteúdo do capítulo"}]}
            
            Deve ter 6-8 capítulos com conhecimento esotérico, filosofia, práticas de meditação,
            e ensinamentos sobre autoconhecimento. Conteúdo deve ser respeitoso e educativo.`
          },
          {
            role: "user",
            content: `Crie o grimório: ${title}`
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      return JSON.parse(response.choices[0].message.content || '{}');
    } catch (error) {
      console.error('Erro na geração de grimório:', error);
      throw new Error('Os antigos pergaminhos estão sendo transcritos');
    }
  }
}

export const temploAI = new TemploAI();