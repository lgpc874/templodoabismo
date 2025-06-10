import OpenAI from "openai";
import { supabaseAdmin } from "./supabase-client";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export class VoxPlumaAI {
  private readonly mysticThemes = [
    "A jornada da alma em busca da verdade interior",
    "Os mistérios da transformação espiritual",
    "A dança entre luz e sombra na consciência",
    "O despertar da divindade interior",
    "Os segredos do conhecimento ancestral",
    "A alquimia da consciência e autodescoberta",
    "Os caminhos ocultos da sabedoria",
    "A rebelião espiritual contra limitações",
    "Os sussurros do abismo primordial",
    "A chama eterna da busca espiritual"
  ];

  private readonly poeticStyles = [
    "soneto místico com rimas profundas",
    "verso livre com linguagem simbólica",
    "poema em prosa de caráter contemplativo",
    "elegia espiritual sobre transformação",
    "hino de invocação aos mistérios",
    "lamento lírico sobre a condição humana",
    "ode à sabedoria ancestral",
    "balada sobre o despertar interior"
  ];

  async generatePoem(): Promise<{title: string, content: string, author: string, category: string}> {
    const theme = this.mysticThemes[Math.floor(Math.random() * this.mysticThemes.length)];
    const style = this.poeticStyles[Math.floor(Math.random() * this.poeticStyles.length)];

    const prompt = `Crie um poema místico sobre "${theme}" no estilo de ${style}. 
    O poema deve:
    - Ter entre 12-20 versos
    - Usar linguagem elevada e simbólica
    - Incorporar elementos da filosofia luciferiana de autodivindade
    - Evitar referências religiosas convencionais
    - Focar na jornada interior e transformação pessoal
    - Usar metáforas de luz, trevas, fogo, abismo, serpente
    - Ter um título poético e impactante
    
    Responda no formato JSON com: title, content, author (um nome místico fictício), category`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system", 
            content: "Você é um poeta místico especializado em criar versos profundos sobre espiritualidade e transformação interior. Sempre responda em JSON válido."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.8
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        title: result.title || "Versos do Mistério",
        content: result.content || "Em busca da verdade...",
        author: result.author || "Vate dos Mistérios",
        category: result.category || "mystical"
      };
    } catch (error) {
      console.error("Erro ao gerar poema:", error);
      return this.getFallbackPoem();
    }
  }

  async generateArticle(customPrompt?: string): Promise<{title: string, content: string, excerpt: string, category: string, tags: string[]}> {
    const defaultTopics = [
      "A importância da autodeterminação espiritual",
      "Símbolos ancestrais e seu significado moderno", 
      "Meditação e desenvolvimento da consciência",
      "A filosofia da transformação interior",
      "Rituais de autoconhecimento e crescimento"
    ];

    const topic = customPrompt || defaultTopics[Math.floor(Math.random() * defaultTopics.length)];

    const prompt = `Escreva um artigo profundo e educativo sobre "${topic}".
    O artigo deve:
    - Ter entre 800-1200 palavras
    - Ser dividido em seções claras
    - Incluir insights práticos
    - Manter tom respeitoso e educativo
    - Focar em desenvolvimento pessoal
    - Evitar dogmatismo religioso
    - Incluir exercícios ou reflexões práticas
    
    Responda no formato JSON com: title, content (em HTML), excerpt, category, tags (array)`;

    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Você é um escritor especializado em espiritualidade e desenvolvimento pessoal. Sempre responda em JSON válido com conteúdo em HTML estruturado."
          },
          {
            role: "user", 
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      
      return {
        title: result.title || "Reflexões Espirituais",
        content: result.content || "<p>Artigo em desenvolvimento...</p>",
        excerpt: result.excerpt || "Uma reflexão sobre o desenvolvimento espiritual.",
        category: result.category || "filosofia",
        tags: result.tags || ["espiritualidade", "desenvolvimento", "reflexão"]
      };
    } catch (error) {
      console.error("Erro ao gerar artigo:", error);
      return this.getFallbackArticle();
    }
  }

  async publishPoem(): Promise<void> {
    try {
      const poem = await this.generatePoem();
      
      const { error } = await supabaseAdmin
        .from('daily_poems')
        .insert({
          title: poem.title,
          content: poem.content,
          author: poem.author,
          date: new Date().toISOString().split('T')[0],
          category: poem.category,
          is_active: true
        });

      if (error) {
        console.error("Erro ao salvar poema:", error);
      } else {
        console.log("Poema publicado com sucesso:", poem.title);
      }
    } catch (error) {
      console.error("Erro no processo de publicação do poema:", error);
    }
  }

  async publishArticle(customPrompt?: string): Promise<void> {
    try {
      const article = await this.generateArticle(customPrompt);
      
      // Buscar categoria no banco
      const { data: categories } = await supabaseAdmin
        .from('blog_categories')
        .select('id')
        .eq('name', 'Filosofia Luciferiana')
        .single();

      const categoryId = categories?.id || 1;

      // Gerar slug único
      const slug = article.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);

      const { error } = await supabaseAdmin
        .from('blog_posts')
        .insert({
          title: article.title,
          slug: slug,
          content: article.content,
          excerpt: article.excerpt,
          category_id: categoryId,
          tags: article.tags,
          is_published: true,
          published_at: new Date().toISOString(),
          generated_by_ai: true,
          ai_prompt: customPrompt || 'Geração automática',
          reading_time_minutes: Math.ceil(article.content.length / 200),
          meta_description: article.excerpt,
          seo_title: article.title
        });

      if (error) {
        console.error("Erro ao salvar artigo:", error);
      } else {
        console.log("Artigo publicado com sucesso:", article.title);
      }
    } catch (error) {
      console.error("Erro no processo de publicação do artigo:", error);
    }
  }

  private getFallbackPoem() {
    return {
      title: "O Chamado Interior",
      content: `No silêncio da alma desperta,
Ecoa o chamado ancestral,
A voz que nunca se cala,
O fogo que jamais se apaga.

Atravessa as brumas do tempo,
A sabedoria que liberta,
Cada passo é um sacramento,
Cada escolha, uma oferenda.

Não busco paraísos distantes,
Nem salvação em céus alheios,
Mas a chama que arde constante,
No templo dos meus próprios anseios.`,
      author: "Escriba do Abismo",
      category: "mystical"
    };
  }

  private getFallbackArticle() {
    return {
      title: "O Caminho da Autodescoberta",
      content: "<h2>A Jornada Interior</h2><p>O desenvolvimento espiritual é uma jornada pessoal de autodescoberta e crescimento...</p>",
      excerpt: "Uma reflexão sobre a importância do autoconhecimento no desenvolvimento espiritual.",
      category: "filosofia",
      tags: ["autoconhecimento", "espiritualidade", "desenvolvimento"]
    };
  }
}

export const voxPlumaAI = new VoxPlumaAI();