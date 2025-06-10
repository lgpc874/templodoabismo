import { voxPlumaAI } from "./ai-vox-service";
import { supabaseAdmin } from "./supabase-client";

class ContentScheduler {
  private poemInterval: NodeJS.Timeout | null = null;
  private articleInterval: NodeJS.Timeout | null = null;

  async startSchedulers() {
    // Obter configurações do banco
    const { data: configs } = await supabaseAdmin
      .from('site_config')
      .select('key, value')
      .in('key', ['voz_pluma_enabled', 'voz_pluma_frequency_hours', 'voz_pluma_auto_publish']);

    const configMap = new Map(configs?.map(c => [c.key, c.value]) || []);
    
    const isEnabled = configMap.get('voz_pluma_enabled') === true;
    const isAutoPublish = configMap.get('voz_pluma_auto_publish') === true;
    const frequencyHours = Number(configMap.get('voz_pluma_frequency_hours')) || 24;

    if (!isEnabled || !isAutoPublish) {
      console.log('Voz da Pluma agendamento desabilitado');
      return;
    }

    // Publicar poemas a cada hora
    this.poemInterval = setInterval(async () => {
      try {
        await voxPlumaAI.publishPoem();
        console.log('Poema automático publicado');
      } catch (error) {
        console.error('Erro ao publicar poema automático:', error);
      }
    }, 60 * 60 * 1000); // 1 hora

    // Publicar artigos baseado na frequência configurada
    this.articleInterval = setInterval(async () => {
      try {
        await voxPlumaAI.publishArticle();
        console.log('Artigo automático publicado');
      } catch (error) {
        console.error('Erro ao publicar artigo automático:', error);
      }
    }, frequencyHours * 60 * 60 * 1000);

    console.log(`Agendamento iniciado: poemas a cada hora, artigos a cada ${frequencyHours}h`);
  }

  stopSchedulers() {
    if (this.poemInterval) {
      clearInterval(this.poemInterval);
      this.poemInterval = null;
    }
    if (this.articleInterval) {
      clearInterval(this.articleInterval);
      this.articleInterval = null;
    }
    console.log('Agendamento parado');
  }

  async restartSchedulers() {
    this.stopSchedulers();
    await this.startSchedulers();
  }

  // Publicar poema manual pelo admin
  async publishPoemNow(customPrompt?: string): Promise<void> {
    if (customPrompt) {
      // Para poemas personalizados, usar o service de artigos com adaptação
      const poemPrompt = `Crie um poema místico sobre: ${customPrompt}
      
      O poema deve:
      - Ter entre 12-20 versos
      - Usar linguagem elevada e simbólica
      - Incorporar elementos espirituais
      - Ter um título poético e impactante
      
      Responda no formato JSON com: title, content, author (um nome místico fictício), category`;
      
      await voxPlumaAI.publishArticle(poemPrompt);
    } else {
      await voxPlumaAI.publishPoem();
    }
  }

  // Publicar artigo manual pelo admin
  async publishArticleNow(customPrompt?: string): Promise<void> {
    await voxPlumaAI.publishArticle(customPrompt);
  }
}

export const contentScheduler = new ContentScheduler();