import { db } from "./db";
import { courses } from "@shared/schema";

export async function seedCourses() {
  try {
    console.log("Seeding courses...");

    const courseData = [
      {
        title: "Fundamentos do Luciferianismo",
        description: "Uma introdução completa aos princípios fundamentais da filosofia luciferiana, explorando conceitos de autodivindade, rebelião espiritual e iluminação interior.",
        type: "regular",
        level: 1,
        price_brl: 89.90,
        modules: JSON.stringify([
          { title: "História do Luciferianismo", duration: 45 },
          { title: "Símbolos e Arquétipos", duration: 60 },
          { title: "Meditação Luciferiana", duration: 75 },
          { title: "Primeiros Rituais", duration: 90 }
        ]),
        requirements: ["Mente aberta", "Interesse em filosofia esotérica"],
        rewards: ["Certificado Iniciante", "Acesso ao Fórum", "Material Complementar"],
        is_active: true,
      },
      {
        title: "Magia Cerimonial Avançada",
        description: "Técnicas avançadas de magia cerimonial, incluindo invocações, evocações e trabalho com entidades da tradição luciferiana.",
        type: "premium",
        level: 4,
        price_brl: 299.90,
        modules: JSON.stringify([
          { title: "Preparação do Templo", duration: 90 },
          { title: "Invocações Planetárias", duration: 120 },
          { title: "Trabalho com Demônios", duration: 150 },
          { title: "Rituais de Transformação", duration: 180 }
        ]),
        requirements: ["Curso Fundamentos", "2 anos de prática", "Dedicação séria"],
        rewards: ["Certificado Adepto", "Mentoria Personalizada", "Acesso VIP"],
        is_active: true,
      },
      {
        title: "Qliphoth - Navegando as Sombras",
        description: "Exploração profunda das esferas qliphóticas, incluindo trabalho prático com as casca e aspectos sombrios da Árvore da Vida.",
        type: "master",
        level: 5,
        price_brl: 599.90,
        modules: JSON.stringify([
          { title: "Teoria Qliphótica", duration: 120 },
          { title: "Pathworking nas Esferas", duration: 180 },
          { title: "Trabalho com Demônios Qliphóticos", duration: 240 },
          { title: "Integração e Equilíbrio", duration: 120 }
        ]),
        requirements: ["Curso Magia Cerimonial", "5 anos experiência", "Supervisão mentor"],
        rewards: ["Certificado Mestre", "Autorização para Ensinar", "Linhagem Iniciática"],
        is_active: true,
      },
      {
        title: "Tarot Luciferiano",
        description: "Aprenda a interpretar o Tarot sob a perspectiva luciferiana, utilizando os arcanos para desenvolver intuição e sabedoria interior.",
        type: "regular",
        level: 2,
        price_brl: 149.90,
        modules: JSON.stringify([
          { title: "História do Tarot", duration: 60 },
          { title: "Arcanos Maiores Luciferianos", duration: 90 },
          { title: "Técnicas de Leitura", duration: 75 },
          { title: "Criando seu Próprio Método", duration: 45 }
        ]),
        requirements: ["Curso Fundamentos", "Deck de Tarot"],
        rewards: ["Certificado Tarólogo", "Deck Digital Exclusivo", "Manual Avançado"],
        is_active: true,
      },
      {
        title: "Kundalini Sombria",
        description: "Técnicas avançadas para despertar e trabalhar com a energia kundalini através dos caminhos sombrios da transformação espiritual.",
        type: "premium",
        level: 3,
        price_brl: 249.90,
        modules: JSON.stringify([
          { title: "Anatomia Energética", duration: 90 },
          { title: "Técnicas de Despertar", duration: 120 },
          { title: "Trabalho com Chakras Sombrios", duration: 150 },
          { title: "Integração e Segurança", duration: 90 }
        ]),
        requirements: ["Experiência em meditação", "Curso Fundamentos", "Estabilidade emocional"],
        rewards: ["Certificado Avançado", "Sessões de Supervisão", "Material Exclusivo"],
        is_active: true,
      },
      {
        title: "Astrologia Luciferiana",
        description: "Interprete mapas astrais sob a ótica luciferiana, compreendendo planetas e aspectos como ferramentas de autodescoberta e transformação.",
        type: "regular",
        level: 2,
        price_brl: 179.90,
        modules: JSON.stringify([
          { title: "Fundamentos Astrológicos", duration: 75 },
          { title: "Planetas Luciferianos", duration: 90 },
          { title: "Casas e Aspectos Sombrios", duration: 60 },
          { title: "Interpretação Prática", duration: 105 }
        ]),
        requirements: ["Conhecimentos básicos de astrologia", "Curso Fundamentos"],
        rewards: ["Certificado Astrólogo", "Software Astrológico", "Análise Pessoal"],
        is_active: true,
      }
    ];

    const insertedCourses = await db.insert(courses).values(courseData).returning();
    console.log(`Seeded ${insertedCourses.length} courses successfully`);
    return insertedCourses;
  } catch (error) {
    console.error("Error seeding courses:", error);
    throw error;
  }
}