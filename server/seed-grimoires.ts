import { db } from "./db";
import { grimoires, grimoireChapters } from "@shared/schema";

export async function seedGrimoires() {
  try {
    console.log("Seeding grimoires...");

    // Criar grimórios de exemplo
    const grimoireData = [
      {
        title: "Liber Lucifer - O Livro da Iluminação",
        description: "Um tratado completo sobre os princípios fundamentais do luciferianismo, explorando a natureza da iluminação através da rebelião espiritual e o despertar da consciência.",
        author: "Asenath Mason",
        level: 1,
        purchase_price_brl: 3500,
        rental_price_brl: 800,
        chapter_price_brl: 400,
        rental_days: 7,
        total_chapters: 12,
        enable_rental: true,
        enable_purchase: true,
        enable_chapter_purchase: true,
        enable_online_reading: true,
        tags: ["iniciante", "luciferianismo", "filosofia"],
        is_active: true,
      },
      {
        title: "Qliphoth - Árvore das Sombras",
        description: "Uma exploração profunda das esferas qliphóticas, revelando os mistérios do lado sombrio da Árvore da Vida e os caminhos para a transformação através da adversidade.",
        author: "Asenath Mason",
        level: 3,
        purchase_price_brl: 5500,
        rental_price_brl: 1200,
        chapter_price_brl: 600,
        rental_days: 7,
        total_chapters: 22,
        enable_rental: true,
        enable_purchase: true,
        enable_chapter_purchase: true,
        enable_online_reading: true,
        tags: ["avançado", "qliphoth", "magia"],
        is_active: true,
      },
      {
        title: "Rituais de Belial - Senhor da Terra",
        description: "Coletânea de rituais e invocações dedicados a Belial, o Rei da Terra, incluindo práticas para manifestação material e domínio terrestre.",
        author: "S. Ben Qayin",
        level: 4,
        purchase_price_brl: 4200,
        rental_price_brl: 950,
        chapter_price_brl: 500,
        rental_days: 7,
        total_chapters: 18,
        enable_rental: true,
        enable_purchase: true,
        enable_chapter_purchase: true,
        enable_online_reading: true,
        tags: ["ritual", "belial", "manifestação"],
        is_active: true,
      },
      {
        title: "Grimório da Chama Negra",
        description: "Antigo grimório contendo invocações, sigilos e rituais da tradição da Chama Negra. Texto para praticantes experientes em artes obscuras.",
        author: "Templo do Abismo",
        level: 5,
        purchase_price_brl: 7500,
        rental_price_brl: 1800,
        chapter_price_brl: 800,
        rental_days: 7,
        total_chapters: 31,
        enable_rental: true,
        enable_purchase: true,
        enable_chapter_purchase: true,
        enable_online_reading: true,
        tags: ["mestre", "chama-negra", "invocações"],
        is_active: true,
      },
      {
        title: "Caminhos da Serpente - Kundalini Sombria",
        description: "Guia prático para o despertar da kundalini através dos caminhos sombrios, explorando técnicas avançadas de transformação energética.",
        author: "Asenath Mason",
        level: 2,
        purchase_price_brl: 2800,
        rental_price_brl: 650,
        chapter_price_brl: 350,
        rental_days: 7,
        total_chapters: 15,
        enable_rental: true,
        enable_purchase: true,
        enable_chapter_purchase: true,
        enable_online_reading: true,
        tags: ["energia", "kundalini", "transformação"],
        is_active: true,
      },
    ];

    // Inserir grimórios
    const insertedGrimoires = await db.insert(grimoires).values(grimoireData).returning();

    // Criar capítulos de exemplo para o primeiro grimório
    const chapterData = [
      {
        grimoire_id: insertedGrimoires[0].id,
        chapter_number: 1,
        title: "Introdução ao Luciferianismo",
        content: `O luciferianismo é uma filosofia espiritual que abraça a figura de Lúcifer como símbolo de iluminação, conhecimento e rebelião contra a tirania. 

Este primeiro capítulo explora os fundamentos históricos e filosóficos desta tradição, examinando como diferentes culturas interpretaram o arquétipo luciferino ao longo dos séculos.

Principais tópicos abordados:
- Origens históricas do luciferianismo
- Símbolos e arquétipos fundamentais
- Diferenças entre luciferianismo e satanismo
- A busca pela gnose e auto-deificação

O praticante deve compreender que o luciferianismo não é uma religião dogmática, mas sim um caminho de autodescoberta e transformação pessoal através do questionamento e da busca pelo conhecimento proibido.`,
        summary: "Introdução aos conceitos fundamentais do luciferianismo e sua filosofia.",
        is_preview: true,
      },
      {
        grimoire_id: insertedGrimoires[0].id,
        chapter_number: 2,
        title: "O Caminho da Iluminação",
        content: `A iluminação luciferina não é um estado final a ser alcançado, mas um processo contínuo de despertar e transformação. Este capítulo detalha as práticas e técnicas para iniciar esta jornada.

Métodos de desenvolvimento espiritual:
- Meditação contemplativa
- Trabalho com sonhos lúcidos
- Práticas de autoconhecimento
- Rituais de purificação mental

A chave está em desenvolver a capacidade de questionar todas as verdades aceitas e buscar o conhecimento através da experiência direta, não da fé cega.`,
        summary: "Práticas para iniciar o caminho da iluminação luciferina.",
        is_preview: false,
      },
      {
        grimoire_id: insertedGrimoires[0].id,
        chapter_number: 3,
        title: "Rituais de Iniciação",
        content: `Os rituais de iniciação marcam pontos importantes na jornada do praticante. Este capítulo apresenta cerimônias tradicionais adaptadas para o praticante moderno.

Rituais fundamentais incluídos:
- Ritual de Dedicação Pessoal
- Cerimônia do Primeiro Despertar
- Invocação da Chama Interior
- Banimento de Dogmas Limitantes

Cada ritual é explicado em detalhes, incluindo preparação, materiais necessários, e interpretação dos resultados.`,
        summary: "Rituais tradicionais para marcar etapas importantes da jornada.",
        is_preview: false,
      },
    ];

    // Inserir capítulos
    await db.insert(grimoireChapters).values(chapterData);

    console.log(`Seeded ${insertedGrimoires.length} grimoires with sample chapters`);
    return insertedGrimoires;
  } catch (error) {
    console.error("Error seeding grimoires:", error);
    throw error;
  }
}