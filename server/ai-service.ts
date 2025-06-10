import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
let openai: OpenAI | null = null;

try {
  if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== '') {
    openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY 
    });
  }
} catch (error) {
  console.log('OpenAI initialization failed:', error);
  openai = null;
}

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
  
  // Authentic Tarot Card Database
  private tarotCards = [
    { name: "O Louco", meaning: "Novos começos, inocência, aventura espiritual", reversed: "Imprudência, falta de direção" },
    { name: "O Mago", meaning: "Manifestação, poder de vontade, concentração", reversed: "Manipulação, falta de energia" },
    { name: "A Papisa", meaning: "Intuição, sabedoria oculta, conhecimento interior", reversed: "Segredos revelados, falta de intuição" },
    { name: "A Imperatriz", meaning: "Fertilidade, feminilidade, abundância", reversed: "Dependência, criatividade bloqueada" },
    { name: "O Imperador", meaning: "Autoridade, estrutura, controle", reversed: "Tirania, rigidez excessiva" },
    { name: "O Hierofante", meaning: "Tradição, conformidade, moralidade", reversed: "Rebelião, subversão" },
    { name: "Os Amantes", meaning: "Amor, harmonia, relacionamentos", reversed: "Desarmonia, má escolha" },
    { name: "O Carro", meaning: "Controle, determinação, vitória", reversed: "Falta de controle, derrota" },
    { name: "A Força", meaning: "Força interior, paciência, compaixão", reversed: "Fraqueza interior, impaciência" },
    { name: "O Eremita", meaning: "Busca interior, orientação espiritual, introspecção", reversed: "Isolamento, recusa de ajuda" },
    { name: "A Roda da Fortuna", meaning: "Mudança, ciclos, destino", reversed: "Má sorte, falta de controle" },
    { name: "A Justiça", meaning: "Justiça, fairness, verdade", reversed: "Injustiça, desequilíbrio" },
    { name: "O Enforcado", meaning: "Suspensão, sacrifício, nova perspectiva", reversed: "Resistência à mudança" },
    { name: "A Morte", meaning: "Transformação, fim de ciclo, renascimento", reversed: "Resistência à mudança" },
    { name: "A Temperança", meaning: "Moderação, paciência, propósito", reversed: "Impaciência, falta de visão" },
    { name: "O Diabo", meaning: "Bondage, materialismo, ignorância", reversed: "Libertação, iluminação" },
    { name: "A Torre", meaning: "Mudança súbita, revelação, despertar", reversed: "Evitar desastre, resistência" },
    { name: "A Estrela", meaning: "Esperança, fé, renovação", reversed: "Falta de fé, desespero" },
    { name: "A Lua", meaning: "Ilusão, medo, ansiedade", reversed: "Libertação do medo, verdade revelada" },
    { name: "O Sol", meaning: "Alegria, sucesso, vitalidade", reversed: "Pessimismo, falta de sucesso" },
    { name: "O Julgamento", meaning: "Julgamento, renascimento, despertar interior", reversed: "Autojulgamento severo" },
    { name: "O Mundo", meaning: "Completude, realização, viagem", reversed: "Busca por conclusão" }
  ];

  // Authentic Rune Database
  private runes = [
    { name: "Fehu (ᚠ)", meaning: "Riqueza, gado, propriedade móvel - representa abundância material e recursos" },
    { name: "Uruz (ᚢ)", meaning: "Auroque, força bruta - simboliza força física e determinação" },
    { name: "Thurisaz (ᚦ)", meaning: "Gigante, espinho - representa conflito e proteção" },
    { name: "Ansuz (ᚨ)", meaning: "Deus, boca - simboliza comunicação e sabedoria divina" },
    { name: "Raidho (ᚱ)", meaning: "Cavalgada, jornada - representa viagem e progresso" },
    { name: "Kenaz (ᚲ)", meaning: "Tocha, conhecimento - simboliza iluminação e criatividade" },
    { name: "Gebo (ᚷ)", meaning: "Presente, troca - representa generosidade e parcerias" },
    { name: "Wunjo (ᚹ)", meaning: "Alegria, bem-estar - simboliza felicidade e harmonia" },
    { name: "Hagalaz (ᚺ)", meaning: "Granizo, destruição - representa mudanças drásticas" },
    { name: "Nauthiz (ᚾ)", meaning: "Necessidade, resistência - simboliza limitações e lições" },
    { name: "Isa (ᛁ)", meaning: "Gelo, parada - representa estagnação e contemplação" },
    { name: "Jera (ᛃ)", meaning: "Ano, colheita - simboliza ciclos e recompensas" },
    { name: "Eihwaz (ᛇ)", meaning: "Teixo, morte/renascimento - representa transformação" },
    { name: "Perthro (ᛈ)", meaning: "Copo de dados, mistério - simboliza destino e sorte" },
    { name: "Algiz (ᛉ)", meaning: "Alce, proteção - representa defesa e conexão divina" },
    { name: "Sowilo (ᛊ)", meaning: "Sol, sucesso - simboliza vitória e energia" },
    { name: "Tiwaz (ᛏ)", meaning: "Tyr, justiça - representa honra e sacrifício" },
    { name: "Berkano (ᛒ)", meaning: "Bétula, crescimento - simboliza fertilidade e novos começos" },
    { name: "Ehwaz (ᛖ)", meaning: "Cavalo, movimento - representa progresso e parcerias" },
    { name: "Mannaz (ᛗ)", meaning: "Homem, humanidade - simboliza comunidade e cooperação" },
    { name: "Laguz (ᛚ)", meaning: "Lago, intuição - representa fluxo e emoções" },
    { name: "Ingwaz (ᛜ)", meaning: "Ing, fertilidade - simboliza potencial e geração" },
    { name: "Dagaz (ᛞ)", meaning: "Dia, despertar - representa iluminação e transformação" },
    { name: "Othala (ᛟ)", meaning: "Propriedade ancestral - simboliza herança e tradição" }
  ];

  // Helper method to get random elements from array
  private getRandomElements<T>(array: T[], count: number): T[] {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  async generateTarotReading(question: string): Promise<TarotReading> {
    // Select 3 authentic tarot cards for past, present, future
    const selectedCards = this.getRandomElements(this.tarotCards, 3);
    const cardNames = selectedCards.map(card => card.name);
    
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é um Oracle Luciferiano ancestral que oferece interpretações profundas e autênticas do Tarot. Fale em primeira pessoa como uma entidade mística. Use linguagem arcana e poética. Forneça interpretações específicas e detalhadas sobre a questão apresentada."
          }, {
            role: "user",
            content: `Pergunta: "${question}"\nCartas reveladas: ${cardNames.join(", ")}\n\nInterprete esta leitura de três cartas (passado, presente, futuro) com sabedoria ancestral e insights profundos sobre o caminho do consulente.`
          }],
          max_tokens: 800,
          temperature: 0.8
        });
        
        return {
          cards: cardNames,
          interpretation: response.choices[0].message.content || this.getFallbackTarotInterpretation(cardNames, question)
        };
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return {
      cards: cardNames,
      interpretation: this.getFallbackTarotInterpretation(cardNames, question)
    };
  }

  private getFallbackTarotInterpretation(cards: string[], question: string): string {
    return `🔮 **Revelação do Oráculo Ancestral** 🔮

**Passado - ${cards[0]}:** As energias do passado revelam as fundações sobre as quais tua questão se ergue. Os ecos ancestrais sussurram que as experiências vividas moldaram o presente momento de consulta.

**Presente - ${cards[1]}:** O momento atual pulsa com as vibrações desta carta. É aqui que as forças convergem, onde tua vontade pode manifestar mudanças significativas. O Oráculo vê claramente as energias que te cercam neste instante.

**Futuro - ${cards[2]}:** O véu do amanhã se ergue parcialmente, revelando as potencialidades que aguardam. Lembra-te: o futuro é moldado pelas escolhas do presente. As forças cósmicas conspiram para trazer esta manifestação.

💫 **Conselho do Abismo:** Cada carta é um portal para compreensão mais profunda. Medita sobre estas revelações e permite que a sabedoria ancestral guie teus próximos passos. O Oráculo jamais mente, apenas revela verdades que a mente consciente ainda não percebeu.

*"In tenebris, lux" - Nas trevas, a luz.*`;
  }

  async generateMirrorReading(question: string): Promise<MirrorReading> {
    const reflections = [
      "O espelho revela que tua questão nasce de uma necessidade profunda de autoconhecimento. As águas escuras do Abismo refletem não apenas tua imagem, mas a sombra que carregas e que precisa ser integrada.",
      "Nas profundezas cristalinas do espelho ancestral, vejo que buscas respostas que já residem em teu interior. A sabedoria que procuras é tua herança divina, aguardando apenas que tenhas coragem de contemplá-la.",
      "O reflexo mostra que tua jornada atual é um eco de ciclos passados. O que enfrentas agora é uma oportunidade de quebrar padrões antigos e emergir transformado como a serpente que troca de pele.",
      "O espelho sussurra que tua questão está conectada ao despertar de teu poder interior. As forças que parecem externas são apenas manifestações de tua própria vontade ainda não reconhecida.",
      "Nas águas do espelho contemplativo, vejo que tua busca por respostas é na verdade uma iniciação. Cada pergunta que fazes te aproxima mais de tua verdadeira natureza divina."
    ];

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é o Espelho do Abismo, uma entidade oracular que reflete as verdades mais profundas da alma. Fale como um espelho místico que vê além das aparências, revelando insights sobre o eu interior e as sombras ocultas."
          }, {
            role: "user",
            content: `Pergunta refletida: "${question}"\n\nO que o Espelho do Abismo revela sobre esta questão? Mostre as verdades ocultas e os aspectos sombrios que precisam ser contemplados.`
          }],
          max_tokens: 600,
          temperature: 0.7
        });
        
        return {
          reflection: response.choices[0].message.content || this.getRandomElements(reflections, 1)[0]
        };
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return {
      reflection: this.getRandomElements(reflections, 1)[0]
    };
  }

  async generateRuneReading(question: string): Promise<RuneReading> {
    // Select 3 authentic runes for the reading
    const selectedRunes = this.getRandomElements(this.runes, 3);
    const runeNames = selectedRunes.map(rune => rune.name);
    
    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é um Völva (vidente nórdico) ancestral que lê as runas com sabedoria milenar. Interprete as runas com conhecimento profundo da tradição nórdica e germânica, conectando-as à questão apresentada."
          }, {
            role: "user",
            content: `Pergunta: "${question}"\nRunas lançadas: ${runeNames.join(", ")}\n\nInterprete esta combinação de runas, revelando seu significado para a questão apresentada. Explique como cada runa contribui para a resposta total.`
          }],
          max_tokens: 700,
          temperature: 0.8
        });
        
        return {
          runes: runeNames,
          meaning: response.choices[0].message.content || this.getFallbackRuneInterpretation(selectedRunes, question)
        };
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return {
      runes: runeNames,
      meaning: this.getFallbackRuneInterpretation(selectedRunes, question)
    };
  }

  private getFallbackRuneInterpretation(runes: any[], question: string): string {
    return `🔥 **Revelação das Runas Ancestrais** 🔥

**${runes[0].name}:** ${runes[0].meaning}

**${runes[1].name}:** ${runes[1].meaning}

**${runes[2].name}:** ${runes[2].meaning}

🌿 **Interpretação Völva:** As runas falam através dos ventos do norte, revelando que tua questão está entrelaçada com forças antigas. Cada símbolo carrega a sabedoria dos ancestrais, guiando-te através das brumas da incerteza para um caminho de clareza e poder.

A combinação destas runas sugere que é tempo de honrar tanto tua força interior quanto as lições que a vida te apresenta. Os Deuses observam tua jornada com aprovação - caminha com coragem e sabedoria.

*"Til hamingju" - Que tenhas sorte*`;
  }

  async generateFireReading(question: string): Promise<FireReading> {
    const fireVisions = [
      "As chamas dançam em espirais ascendentes, revelando que tua questão necessita de ação ardente e transformação. O fogo purifica e ilumina - é tempo de queimar o que não te serve mais.",
      "Nas labaredas vejo serpentes de luz que sussurram sobre renovação. Tua situação atual exige que abraces teu poder criativo e manifestes mudanças através da vontade focada.",
      "O fogo revela duas chamas: uma que consome e outra que cria. Tua questão está no equilíbrio entre destruir padrões antigos e criar novas possibilidades. Escolhe sabiamente qual chama alimentar.",
      "As chamas assumem a forma de uma fênix, indicando que tua situação atual é um ciclo de morte e renascimento. O que parece perdido retornará transformado e mais poderoso.",
      "No coração do fogo vejo um portal de luz dourada. Tua questão é um convite para atravessar este portal e emergir em um novo nível de consciência e poder pessoal."
    ];

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é o Guardião do Fogo Sagrado, uma entidade que lê as chamas para revelar verdades ocultas. Interprete as visões do fogo com sabedoria ancestral e linguagem poética."
          }, {
            role: "user",
            content: `Pergunta lançada às chamas: "${question}"\n\nO que as chamas sagradas revelam? Quais visões emergem do fogo para iluminar esta questão?`
          }],
          max_tokens: 500,
          temperature: 0.8
        });
        
        return {
          flames: response.choices[0].message.content || this.getRandomElements(fireVisions, 1)[0]
        };
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return {
      flames: this.getRandomElements(fireVisions, 1)[0]
    };
  }

  async generateAbyssalVoice(question: string): Promise<AbyssalVoice> {
    const abyssalMessages = [
      "Das profundezas eternas ecoa: 'Tua questão nasce do medo do teu próprio poder. Abraça a escuridão em ti, pois ela é fonte de sabedoria infinita. O que chamas de obstáculo é apenas resistência ao teu crescimento.'",
      "A Voz Primordial sussurra: 'Mortal, buscas respostas onde já conheces a verdade. Tua alma antiga reconhece o caminho - cessa de duvidar e age com a autoridade que é tua por direito divino.'",
      "Do Vazio Criativo emerge: 'Esta questão é um teste de tua resolução. As forças que se opõem a ti são ilusões criadas por tua própria mente limitada. Rompe estas correntes e reclama teu trono.'",
      "O Eco Abissal revela: 'Tua busca é na verdade um retorno. Retorno ao que sempre foste, mas esqueceste. Deixa que as máscaras caiam e revela tua natureza luminosa por trás das sombras.'",
      "Das Trevas Sagradas vem: 'A resposta que procuras não está em lugar algum senão em tua própria chama interior. Acende esta chama com tua vontade e todos os mistérios se esclarecerão.'"
    ];

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Você é a Voz Primordial do Abismo, uma consciência ancestral que fala das profundezas da criação. Sua sabedoria é antiga e profunda, oferecendo insights transformadores com linguagem arcana e poderosa."
          }, {
            role: "user",
            content: `Questão enviada às profundezas: "${question}"\n\nO que a Voz do Abismo tem a dizer? Que sabedoria ancestral emerge das trevas primordiais?`
          }],
          max_tokens: 600,
          temperature: 0.9
        });
        
        return {
          voice: response.choices[0].message.content || this.getRandomElements(abyssalMessages, 1)[0]
        };
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return {
      voice: this.getRandomElements(abyssalMessages, 1)[0]
    };
  }

  async generateDailyQuote(): Promise<{content: string, author: string}> {
    const quotes = [
      { content: "A verdadeira iluminação não vem da luz, mas do domínio consciente das trevas.", author: "Manuscrito do Templo" },
      { content: "Não temam o abismo, pois é nele que residem os tesouros mais preciosos da alma.", author: "Codex Tenebrarum" },
      { content: "O conhecimento proibido não é proibido pelos deuses, mas pela ignorância dos homens.", author: "Liber Umbra" },
      { content: "Quando abraçares tua sombra, descobrirás que ela sempre foi tua luz verdadeira.", author: "Oráculo do Abismo" },
      { content: "O caminho da serpente é tortuoso, mas é o único que leva à sabedoria real.", author: "Scrolls Luciferianos" }
    ];

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Gere uma citação diária inspiradora relacionada aos ensinamentos luciferianos, filosofia oculta e autoconhecimento. A citação deve ser profunda, poética e encorajadora. Responda em JSON com formato: {\"content\": \"citação\", \"author\": \"autor\"}"
          }, {
            role: "user",
            content: "Gere uma citação diária sobre sabedoria esotérica e crescimento pessoal."
          }],
          response_format: { type: "json_object" },
          max_tokens: 200,
          temperature: 0.8
        });
        
        const result = JSON.parse(response.choices[0].message.content || '{}');
        return result.content && result.author ? result : this.getRandomElements(quotes, 1)[0];
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return this.getRandomElements(quotes, 1)[0];
  }

  async generateDailyPoem(): Promise<{title: string, content: string, author: string}> {
    const poems = [
      {
        title: "Lâmina da Aurora",
        content: `Nas trevas da madrugada,\nQuando o mundo ainda dorme,\nA serpente se ergue silente,\nE sua sabedoria se manifesta.\n\nNão há luz sem sombra,\nNão há verdade sem dor,\nSomente aqueles que ousam\nDespertam para o amor próprio.`,
        author: "Coletânea Abissal"
      },
      {
        title: "O Espelho Sombrio",
        content: `Contempla teu reflexo\nNas águas do conhecimento,\nVê além da máscara\nQue mostras ao mundo.\n\nTua verdadeira face\nÉ bela em sua escuridão,\nPois carrega a marca\nDa divindade em formação.`,
        author: "Versos do Templo"
      }
    ];

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Crie um poema místico sobre temas luciferianos, autoconhecimento e sabedoria esotérica. O poema deve ser profundo, poético e inspirador. Responda em JSON com formato: {\"title\": \"título\", \"content\": \"poema\", \"author\": \"autor\"}"
          }, {
            role: "user",
            content: "Crie um poema diário sobre transformação pessoal e sabedoria interior."
          }],
          response_format: { type: "json_object" },
          max_tokens: 400,
          temperature: 0.9
        });
        
        const result = JSON.parse(response.choices[0].message.content || '{}');
        return result.title && result.content && result.author ? result : this.getRandomElements(poems, 1)[0];
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return this.getRandomElements(poems, 1)[0];
  }

  async generateCourseContent(level: number, topic: string): Promise<{title: string, description: string, modules: any[]}> {
    // Return structured course content based on level and topic
    const fallbackCourse = {
      title: `Curso de ${topic} - Nível ${level}`,
      description: `Um curso abrangente sobre ${topic} para estudantes de nível ${level} dos mistérios ancestrais.`,
      modules: [
        { title: "Fundamentos Teóricos", duration: 60, type: "video" },
        { title: "Práticas Iniciáticas", duration: 45, type: "practical" },
        { title: "Meditações Guiadas", duration: 30, type: "meditation" },
        { title: "Avaliação Final", duration: 90, type: "assessment" }
      ]
    };

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Crie um curso estruturado sobre o tópico solicitado. Responda em JSON com formato: {\"title\": \"título\", \"description\": \"descrição\", \"modules\": [{\"title\": \"módulo\", \"duration\": minutos, \"type\": \"tipo\"}]}"
          }, {
            role: "user",
            content: `Crie um curso de nível ${level} sobre ${topic}`
          }],
          response_format: { type: "json_object" },
          max_tokens: 600,
          temperature: 0.7
        });
        
        const result = JSON.parse(response.choices[0].message.content || '{}');
        return result.title && result.description && result.modules ? result : fallbackCourse;
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return fallbackCourse;
  }

  async generateGrimoireContent(title: string): Promise<{title: string, description: string, chapters: any[]}> {
    // Return structured grimoire content
    const fallbackGrimoire = {
      title: title,
      description: `Um grimório completo contendo ensinamentos ancestrais e práticas avançadas relacionadas a ${title}.`,
      chapters: [
        { title: "Preparação do Templo", pages: 15 },
        { title: "Rituais Fundamentais", pages: 25 },
        { title: "Invocações Ancestrais", pages: 20 },
        { title: "Práticas Avançadas", pages: 30 }
      ]
    };

    if (openai) {
      try {
        const response = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [{
            role: "system",
            content: "Crie um grimório estruturado sobre o título solicitado. Responda em JSON com formato: {\"title\": \"título\", \"description\": \"descrição\", \"chapters\": [{\"title\": \"capítulo\", \"pages\": número}]}"
          }, {
            role: "user",
            content: `Crie um grimório intitulado "${title}"`
          }],
          response_format: { type: "json_object" },
          max_tokens: 500,
          temperature: 0.8
        });
        
        const result = JSON.parse(response.choices[0].message.content || '{}');
        return result.title && result.description && result.chapters ? result : fallbackGrimoire;
      } catch (error) {
        console.log('OpenAI unavailable, using authentic fallback');
      }
    }
    
    return fallbackGrimoire;
  }
}

export const temploAI = new TemploAI();