import { vozPlumaService } from './voz-pluma-service';

class AutoPublishScheduler {
  private isRunning = false;
  private intervalId: NodeJS.Timeout | null = null;

  start() {
    if (this.isRunning) {
      console.log('Auto-publish scheduler is already running');
      return;
    }

    console.log('Starting Voz da Pluma auto-publish scheduler...');
    this.isRunning = true;

    // Verifica a cada 30 minutos se deve publicar
    this.intervalId = setInterval(async () => {
      await this.checkAndPublish();
    }, 30 * 60 * 1000); // 30 minutos

    // Executa uma verificação inicial
    this.checkAndPublish();
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    this.isRunning = false;
    console.log('Auto-publish scheduler stopped');
  }

  private async checkAndPublish() {
    try {
      const shouldPublish = await vozPlumaService.shouldAutoPublish();
      
      if (shouldPublish) {
        console.log('Auto-publishing new Voz da Pluma content...');
        await vozPlumaService.generateAndSaveContent();
        console.log('Auto-published new manifestations');
      }
    } catch (error) {
      console.error('Error in auto-publish scheduler:', error);
    }
  }

  getStatus() {
    return {
      isRunning: this.isRunning,
      intervalId: this.intervalId !== null
    };
  }
}

export const autoPublishScheduler = new AutoPublishScheduler();

// Inicia o agendador quando o módulo é carregado
if (process.env.NODE_ENV !== 'test') {
  autoPublishScheduler.start();
}