import { supabase } from './supabase-client';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export interface PersonalSeal {
  id: string;
  userId: string;
  magicalName: string;
  sealImageUrl: string;
  sealDescription: string;
  energyType: string;
  generatedAt: Date;
}

export class PersonalSealService {
  async hasPersonalSeal(userId: string): Promise<boolean> {
    const { data } = await supabase
      .from('personal_seals')
      .select('id')
      .eq('user_id', userId)
      .single();

    return !!data;
  }

  async getPersonalSeal(userId: string): Promise<PersonalSeal | null> {
    const { data } = await supabase
      .from('personal_seals')
      .select('*')
      .eq('user_id', userId)
      .single();

    return data ? {
      id: data.id,
      userId: data.user_id,
      magicalName: data.magical_name,
      sealImageUrl: data.seal_image_url,
      sealDescription: data.seal_description,
      energyType: data.energy_type,
      generatedAt: new Date(data.generated_at)
    } : null;
  }

  async generatePersonalSeal(userId: string, magicalName: string): Promise<PersonalSeal> {
    // Verificar se já tem selo
    const existingSeal = await this.hasPersonalSeal(userId);
    if (existingSeal) {
      throw new Error('Usuário já possui um selo pessoal. Apenas um selo pode ser gerado por pessoa.');
    }

    // Gerar descrição do selo com IA
    const sealDescription = await this.generateSealDescription(magicalName);
    const energyType = this.determineEnergyType(magicalName);

    // Gerar imagem do selo (simular URL por enquanto)
    const sealImageUrl = await this.generateSealImage(magicalName, sealDescription);

    // Salvar no banco
    const { data } = await supabase
      .from('personal_seals')
      .insert({
        user_id: userId,
        magical_name: magicalName,
        seal_image_url: sealImageUrl,
        seal_description: sealDescription,
        energy_type: energyType
      })
      .select()
      .single();

    // Atualizar usuário
    await supabase
      .from('users')
      .update({
        personal_seal_generated: true,
        personal_seal_url: sealImageUrl,
        magical_name: magicalName
      })
      .eq('id', userId);

    return {
      id: data.id,
      userId: data.user_id,
      magicalName: data.magical_name,
      sealImageUrl: data.seal_image_url,
      sealDescription: data.seal_description,
      energyType: data.energy_type,
      generatedAt: new Date(data.generated_at)
    };
  }

  private async generateSealDescription(magicalName: string): Promise<string> {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Você é um especialista em magia ritual e simbolismo esotérico do Templo do Abismo. 
            Crie uma descrição mística e poderosa para um selo pessoal baseado no nome mágico fornecido.
            A descrição deve ser única, profunda e conectada às energias primordiais.
            Use linguagem ritualística e mencione símbolos, elementos e características específicas do selo.
            Máximo 200 palavras.`
          },
          {
            role: "user",
            content: `Crie uma descrição para o selo pessoal do iniciado com nome mágico: ${magicalName}`
          }
        ],
        max_tokens: 300
      });

      return response.choices[0].message.content || this.getFallbackSealDescription(magicalName);
    } catch (error) {
      console.error('Erro ao gerar descrição do selo:', error);
      return this.getFallbackSealDescription(magicalName);
    }
  }

  private async generateSealImage(magicalName: string, description: string): Promise<string> {
    try {
      // Criar prompt para imagem do selo
      const imagePrompt = `Create a mystical personal seal for the magical name "${magicalName}". 
      The seal should be circular, dark and mystical, with intricate geometric patterns, 
      occult symbols, and esoteric elements. Style: dark gothic, ritual magic, black and gold colors, 
      ancient symbols, sigil-like design. High contrast, detailed linework, suitable for ritual use.`;

      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: imagePrompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
      });

      return response.data[0].url || this.getFallbackSealImage();
    } catch (error) {
      console.error('Erro ao gerar imagem do selo:', error);
      return this.getFallbackSealImage();
    }
  }

  private determineEnergyType(magicalName: string): string {
    const name = magicalName.toLowerCase();
    
    if (name.includes('luc') || name.includes('luci') || name.includes('ifer')) {
      return 'Luciferiana';
    } else if (name.includes('abys') || name.includes('void') || name.includes('chaos')) {
      return 'Abissal';
    } else if (name.includes('fire') || name.includes('flame') || name.includes('ignis')) {
      return 'Ígnea';
    } else if (name.includes('shadow') || name.includes('dark') || name.includes('umbra')) {
      return 'Sombria';
    } else if (name.includes('star') || name.includes('stellar') || name.includes('astro')) {
      return 'Estelar';
    } else if (name.includes('serpent') || name.includes('dragon') || name.includes('draco')) {
      return 'Dracônica';
    } else {
      return 'Primordial';
    }
  }

  private getFallbackSealDescription(magicalName: string): string {
    return `O selo de ${magicalName} manifesta-se como um círculo de poder primordial, 
    gravado com símbolos ancestrais que conectam o portador às correntes ctônicas do Abismo. 
    No centro, um sigilo único pulsa com energia sombria, rodeado por runas de proteção e 
    invocação. As bordas são adornadas com serpentes entrelaçadas, representando a sabedoria 
    oculta e a transformação espiritual. Este selo é único e irrepetível, forjado nas 
    profundezas da consciência mágica e selado com o poder do nome verdadeiro.`;
  }

  private getFallbackSealImage(): string {
    // URL de uma imagem de selo genérico
    return 'https://i.postimg.cc/g20gqmdX/IMG-20250527-182235-1.png';
  }
}

export const personalSealService = new PersonalSealService();