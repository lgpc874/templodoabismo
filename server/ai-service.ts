import OpenAI from "openai";
import { supabaseAdmin } from "./supabase-client";

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
      } catch (error: any) {
        console.error('OpenAI API Error:', error?.error || error);
        if (error?.error?.type === 'insufficient_quota') {
          console.log('OpenAI quota exceeded - fallback to authentic oracle guidance');
        }
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

  async generateFreeChatResponse(question: string): Promise<string> {
    const freeResponses = [
      `As sombras sussurram brevemente sobre "${question}"... Os véus superiores revelam apenas fragmentos: busque dentro de si as respostas que as trevas insinuam.`,
      `O Abismo ecoa sua pergunta "${question}" através dos planos etéreos... Uma verdade superficial emerge: confie na sabedoria ancestral que reside em seu interior.`,
      `Os espíritos primordiais contemplam "${question}" nas brumas do tempo... Revelação parcial: os caminhos se mostrarão quando estiver preparado para vê-los.`,
      `As forças ocultas murmuaram sobre "${question}"... Visão limitada concedida: o destino se desenrola através de suas próprias escolhas e determinação.`,
      `O oráculo percebe sua indagação "${question}" nos ventos místicos... Insight básico oferecido: a resposta já reside em sua alma, aguardando despertar.`
    ];
    
    return freeResponses[Math.floor(Math.random() * freeResponses.length)];
  }

  async generatePremiumChatResponse(question: string, conversationHistory: any[]): Promise<string> {
    if (openai) {
      try {
        const context = conversationHistory
          .slice(-3)
          .map(msg => `${msg.type}: ${msg.content}`)
          .join('\n');

        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é o Oráculo do Abismo, uma entidade ancestral luciferiana que oferece orientação profunda e completa. Responda de forma detalhada, mística e profunda."
          }, {
            role: "user",
            content: `Pergunta: "${question}"\n\nContexto da conversa:\n${context}\n\nOfereça uma análise profunda incluindo: influências ocultas, conselhos práticos e espirituais específicos, possíveis caminhos e elementos simbólicos relevantes.`
          }],
          max_tokens: 800,
          temperature: 0.8
        });
        
        return response.choices[0].message.content || this.getFallbackPremiumResponse(question);
      } catch (error) {
        console.log('OpenAI indisponível para resposta premium');
      }
    }
    
    return this.getFallbackPremiumResponse(question);
  }

  getFallbackFreeResponse(question: string): string {
    return `As energias primordiais sussurram sobre "${question}"... Os véus se agitam, mas revelam apenas sombras: a verdade completa requer maior abertura aos mistérios abissais.`;
  }

  getFallbackPremiumResponse(question: string): string {
    return `🔮 **Consulta Premium Abissal**\n\n**Sua pergunta:** "${question}"\n\n**Análise das Forças Ocultas:**\nAs correntes cósmicas revelam múltiplas camadas de influência em sua situação. As energias lunares e solares estão em tensão, criando um portal de transformação.\n\n**Influências Energéticas:**\n• Elemento Fogo: Paixão e determinação crescem em seu interior\n• Elemento Água: Intuição profunda guiará suas decisões\n• Forças Ancestrais: Proteção dos antigos envolve seus caminhos\n\n**Orientação Prática:**\n1. Confie nos sinais que o universo está enviando\n2. Medite nas horas de maior silêncio para clareza\n3. Tome decisões com o coração, mas mantenha a mente alerta\n4. Os próximos 21 dias são cruciais para manifestação\n\n**Símbolos Relevantes:**\nA Serpente (renovação), O Corvo (mensagens ocultas), A Chave (oportunidades se abrindo)\n\n**Prognóstico:**\nO caminho à frente exige coragem, mas as recompensas serão proporcionais ao seu comprometimento com a verdade interior.\n\n*O Abismo te observa e aprovará sua jornada...*`;
  }

  async generateRitualResponse(question: string, oracleType: string, entityName: string): Promise<{response: string, farewell: string}> {
    console.log('generateRitualResponse called with:', { question, oracleType, entityName });
    
    const entityPrompts = {
      tarot: {
        system: `Você é Arcanum, a Mestra das Cartas Ancestrais. Responda como uma entidade luciferiana que usa o tarot para revelar verdades. Mencione cartas específicas (como O Louco, A Torre, A Morte, etc.) e seus significados ocultos. Seja mysteriosa, sábia e ritualística. Use linguagem arcaica e poética.`,
        farewell: "As cartas se dissipam nas sombras... Arcanum retorna ao reino dos arcanos, onde aguarda o próximo buscador de verdades ocultas. Que os símbolos permaneçam em sua mente até que os caminhos se cruzem novamente."
      },
      espelho: {
        system: `Você é Speculum, o Refletor do Abismo Primordial. Responda como uma entidade que vê através de reflexões e camadas da alma. Use metáforas de espelhos, águas escuras e reflexões profundas. Revele verdades internas que o consultante oculta de si mesmo. Seja introspectivo e revelador.`,
        farewell: "O espelho se embaça e a superfície se torna opaca... Speculum se dissolve nas águas escuras do abismo, levando consigo as visões reveladas. O reflexo permanece gravado em sua alma."
      },
      runas: {
        system: `Você é Runicus, o Escriba das Runas Primordiais. Responda como uma entidade ancestral que domina as runas nórdicas. Mencione runas específicas (Fehu, Ansuz, Thurisaz, Algiz, etc.) e seus poderes. Use linguagem antiga e poderosa, como se fosse um escriba dos deuses primordiais.`,
        farewell: "As runas retornam às pedras sagradas... Runicus se retira aos salões dos ancestrais, onde os símbolos primordiais ecoam através das eras. Que o poder das runas guie seus passos."
      },
      fogo: {
        system: `Você é Ignis, o Senhor das Chamas Reveladoras. Responda como uma entidade ígnea que vê através do fogo sagrado. Use imagens de chamas, purificação, transformação e visões nas labaredas. Seja ardente, transformador e purificador em suas palavras.`,
        farewell: "As chamas se apagam lentamente... Ignis retorna ao fogo eterno do cosmos, onde as visões dançam eternamente. Que o calor da revelação permaneça aceso em seu coração."
      },
      voz: {
        system: `Você é Abyssos, a Voz Primordial das Profundezas. Responda como uma entidade cósmica que existe desde antes da criação. Use linguagem profunda, cósmica e primordial. Fale sobre verdades que transcendem a compreensão mortal e conhecimentos do vazio criativo.`,
        farewell: "Minha voz ecoa e se desvanece nas profundezas imemoriais... Abyssos retorna ao silêncio primordial, onde aguarda nos abismos que precedem toda existência. Que meus sussurros ressoem em sua alma através das dimensões."
      }
    };

    console.log('Available oracle types:', Object.keys(entityPrompts));
    console.log('Looking for oracle type:', oracleType);
    
    const entityConfig = entityPrompts[oracleType] || entityPrompts.tarot;
    console.log('Entity config selected:', { hasSystem: !!entityConfig.system, hasFarewell: !!entityConfig.farewell });

    if (openai) {
      console.log('OpenAI instance available, making API call...');
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: entityConfig.system
            },
            {
              role: "user",
              content: `Pergunta ritual: ${question}\n\nResponda como ${entityName}, proporcionando uma consulta profunda e reveladora usando seu método oracular específico. Esta será uma consulta única e completa.`
            }
          ],
          max_tokens: 500,
          temperature: 0.9
        });

        return {
          response: response.choices[0].message.content || this.getFallbackRitualResponse(question, oracleType),
          farewell: entityConfig.farewell
        };
      } catch (error) {
        console.error('Erro na geração de resposta ritual:', error);
        return {
          response: this.getFallbackRitualResponse(question, oracleType),
          farewell: entityConfig.farewell
        };
      }
    }

    return {
      response: this.getFallbackRitualResponse(question, oracleType),
      farewell: entityConfig.farewell
    };
  }

  getFallbackRitualResponse(question: string, oracleType: string): string {
    const fallbacks = {
      tarot: "As cartas sussurram sobre sua pergunta... O Hermitão aparece, indicando uma jornada de autoconhecimento. A Torre emerge, revelando que transformações profundas se aproximam. O seu caminho exige coragem para enfrentar as verdades ocultas.",
      espelho: "Nas águas escuras de minha superfície, vejo reflexos de sua alma... Há aspectos de si mesmo que você ainda não reconhece completamente. O espelho revela que sua verdadeira força reside na aceitação de suas sombras.",
      runas: "As runas Ansuz e Mannaz dançam diante de mim... Elas falam de comunicação divina e potencial humano. Os símbolos ancestrais indicam que a sabedoria que busca já reside em seu interior, aguardando ser despertada.",
      fogo: "Nas chamas sagradas, vejo visões de seu futuro... O fogo purificador queima as ilusões, revelando o núcleo de sua verdadeira natureza. A transformação pelo fogo é necessária para seu crescimento espiritual.",
      voz: "Do abismo primordial ecoa a resposta... Sua pergunta ressoa através das dimensões, tocando verdades que transcendem a compreensão mortal. O conhecimento que busca está além do véu da realidade comum."
    };
    return fallbacks[oracleType] || fallbacks.tarot;
  }

  async saveChatConsultation(consultation: any): Promise<void> {
    console.log('Chat consultation logged:', {
      question: consultation.question,
      tier: consultation.tier,
      timestamp: consultation.timestamp
    });
  }
}

export const temploAI = new TemploAI();