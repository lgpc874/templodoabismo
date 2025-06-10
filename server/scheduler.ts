import { supabase } from './supabase-client';
import { voxPlumaAI } from './ai-vox-service';

class VozPlumaScheduler {
  private intervalId: NodeJS.Timeout | null = null;
  private isRunning = false;

  async start() {
    if (this.isRunning) return;
    
    console.log('Iniciando Voz da Pluma Scheduler...');
    this.isRunning = true;
    
    // Executar primeira verificação imediatamente
    await this.checkAndPublish();
    
    // Verificar a cada hora
    this.intervalId = setInterval(async () => {
      await this.checkAndPublish();
    }, 60 * 60 * 1000); // 1 hora
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Voz da Pluma Scheduler parado.');
  }

  private async checkAndPublish() {
    try {
      // Buscar configurações
      const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('category', 'voz_pluma');

      if (!settings || settings.length === 0) {
        console.log('Configurações da Voz da Pluma não encontradas');
        return;
      }

      const settingsMap = settings.reduce((acc: any, setting: any) => {
        acc[setting.key] = JSON.parse(setting.value);
        return acc;
      }, {});

      const autoEnabled = settingsMap.voz_pluma_auto;
      const interval = parseInt(settingsMap.voz_pluma_interval || '3600'); // padrão 1 hora
      const customPrompt = settingsMap.voz_pluma_prompt;

      if (!autoEnabled) {
        console.log('Publicação automática da Voz da Pluma desabilitada');
        return;
      }

      // Verificar última publicação
      const { data: lastPublication } = await supabase
        .from('blog_posts')
        .select('created_at')
        .eq('category', 'voz-pluma')
        .order('created_at', { ascending: false })
        .limit(1);

      const now = new Date();
      const shouldPublish = !lastPublication || 
        lastPublication.length === 0 || 
        (now.getTime() - new Date(lastPublication[0].created_at).getTime()) >= (interval * 1000);

      if (shouldPublish) {
        console.log('Publicando novo conteúdo da Voz da Pluma...');
        await voxPlumaAI.publishPoem(customPrompt);
        console.log('Conteúdo da Voz da Pluma publicado com sucesso');
      } else {
        console.log('Intervalo de publicação da Voz da Pluma ainda não atingido');
      }

    } catch (error) {
      console.error('Erro no scheduler da Voz da Pluma:', error);
    }
  }

  async publishNow(customPrompt?: string) {
    try {
      await voxPlumaAI.publishPoem(customPrompt);
      return { success: true, message: 'Conteúdo publicado com sucesso' };
    } catch (error) {
      console.error('Erro ao publicar conteúdo:', error);
      return { success: false, error: error.message };
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      hasInterval: !!this.intervalId
    };
  }
}

export const vozPlumaScheduler = new VozPlumaScheduler();

// Auto-iniciar o scheduler
vozPlumaScheduler.start();