export interface OracleImageData {
  type: string;
  question: string;
  result: any;
  timestamp: string;
}

export class OracleImageGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 1080;
    this.canvas.height = 1350;
    this.ctx = this.canvas.getContext('2d')!;
  }

  private drawBackground() {
    // Dark mystical gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.3, '#1a1a2e');
    gradient.addColorStop(0.7, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Mystical texture overlay
    this.ctx.globalAlpha = 0.05;
    for (let i = 0; i < 500; i++) {
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.fillRect(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        Math.random() * 2,
        Math.random() * 2
      );
    }
    this.ctx.globalAlpha = 1;
  }

  private drawTemploWatermark() {
    // Main watermark area
    this.ctx.globalAlpha = 0.9;
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, this.canvas.height - 180, this.canvas.width, 180);
    
    // Golden border
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 4;
    this.ctx.strokeRect(0, this.canvas.height - 180, this.canvas.width, 180);
    this.ctx.globalAlpha = 1;

    // Templo do Abismo title
    this.ctx.font = 'bold 56px serif';
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('TEMPLO DO ABISMO', this.canvas.width / 2, this.canvas.height - 120);

    // Subtitle
    this.ctx.font = '28px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fillText('Portal Luciferiano de Sabedoria Ancestral', this.canvas.width / 2, this.canvas.height - 80);

    // Mystical symbols
    this.ctx.font = '36px serif';
    this.ctx.fillStyle = '#d97706';
    this.ctx.fillText('𖤍 ⸸ 𖤍', this.canvas.width / 2, this.canvas.height - 35);
  }

  private drawHeader(title: string, subtitle: string, icon: string) {
    // Icon
    this.ctx.font = '96px serif';
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(icon, this.canvas.width / 2, 120);

    // Title
    this.ctx.font = 'bold 64px serif';
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.fillText(title, this.canvas.width / 2, 200);

    // Subtitle
    this.ctx.font = '32px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fillText(subtitle, this.canvas.width / 2, 240);

    // Decorative line
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(150, 280);
    this.ctx.lineTo(this.canvas.width - 150, 280);
    this.ctx.stroke();
  }

  private wrapText(text: string, maxWidth: number, lineHeight: number, startY: number): number {
    const words = text.split(' ');
    let line = '';
    let y = startY;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = this.ctx.measureText(testLine);
      const testWidth = metrics.width;
      
      if (testWidth > maxWidth && n > 0) {
        this.ctx.fillText(line, this.canvas.width / 2, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line, this.canvas.width / 2, y);
    return y + lineHeight;
  }

  async generateOracleImage(data: OracleImageData): Promise<string> {
    this.drawBackground();

    // Generate based on oracle type
    switch (data.type) {
      case 'tarot':
        this.drawHeader('CONSULTA TAROT', 'Revelação das Cartas Ancestrais', '🔮');
        await this.drawTarotContent(data);
        break;
      case 'mirror':
        this.drawHeader('SPECULUM ASTRALIS', 'Espelho da Contemplação', '🪞');
        await this.drawMirrorContent(data);
        break;
      case 'runes':
        this.drawHeader('REVELAÇÃO RÚNICA', 'Sabedoria Ancestral Nórdica', '🗿');
        await this.drawRunesContent(data);
        break;
      case 'fire':
        this.drawHeader('VISÃO DAS CHAMAS', 'Fogo Sagrado Revelador', '🔥');
        await this.drawFireContent(data);
        break;
      case 'voice':
        this.drawHeader('VOZ DO ABISMO', 'Sussurros Primordiais', '👁️');
        await this.drawVoiceContent(data);
        break;
    }

    this.drawTemploWatermark();
    return this.canvas.toDataURL('image/png', 0.9);
  }

  private async drawTarotContent(data: OracleImageData) {
    // Question
    this.ctx.font = 'italic 28px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 40, 340);

    // Cards
    if (data.result.cards) {
      const cardLabels = ['PASSADO', 'PRESENTE', 'FUTURO'];
      const cardWidth = 180;
      const cardSpacing = (this.canvas.width - (3 * cardWidth)) / 4;
      
      data.result.cards.forEach((card: string, index: number) => {
        const x = cardSpacing + (index * (cardWidth + cardSpacing));
        const y = questionY + 60;
        
        // Card background
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        this.ctx.fillRect(x, y, cardWidth, 240);
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, cardWidth, 240);
        
        // Card symbol
        this.ctx.font = '48px serif';
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('🃏', x + cardWidth/2, y + 60);
        
        // Card label
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = 'bold 16px serif';
        this.ctx.fillText(cardLabels[index], x + cardWidth/2, y + 90);
        
        // Card name
        this.ctx.fillStyle = '#f3f4f6';
        this.ctx.font = '18px serif';
        this.wrapText(card, cardWidth - 10, 22, y + 120);
      });
    }

    // Interpretation
    this.ctx.font = '24px serif';
    this.ctx.fillStyle = '#d1d5db';
    this.ctx.textAlign = 'center';
    const cleanInterpretation = data.result.interpretation
      .replace(/\*\*/g, '')
      .replace(/🔮/g, '')
      .replace(/💫/g, '')
      .substring(0, 400) + '...';
    this.wrapText(cleanInterpretation, 900, 30, questionY + 350);
  }

  private async drawMirrorContent(data: OracleImageData) {
    // Question
    this.ctx.font = 'italic 28px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 40, 340);

    // Mirror
    const mirrorSize = 200;
    const mirrorX = (this.canvas.width - mirrorSize) / 2;
    const mirrorY = questionY + 40;
    
    // Mirror frame
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 6;
    this.ctx.beginPath();
    this.ctx.arc(mirrorX + mirrorSize/2, mirrorY + mirrorSize/2, mirrorSize/2, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    // Mirror surface
    const gradient = this.ctx.createRadialGradient(
      mirrorX + mirrorSize/2, mirrorY + mirrorSize/2, 0,
      mirrorX + mirrorSize/2, mirrorY + mirrorSize/2, mirrorSize/2
    );
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(mirrorX + mirrorSize/2, mirrorY + mirrorSize/2, mirrorSize/2 - 15, 0, 2 * Math.PI);
    this.ctx.fill();

    // Eye in center
    this.ctx.font = '60px serif';
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('👁️', mirrorX + mirrorSize/2, mirrorY + mirrorSize/2 + 20);

    // Reflection
    this.ctx.font = '26px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.textAlign = 'center';
    this.wrapText(`"${data.result.reflection}"`, 900, 32, mirrorY + mirrorSize + 60);
  }

  private async drawRunesContent(data: OracleImageData) {
    // Question
    this.ctx.font = 'italic 28px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 40, 340);

    // Runes
    if (data.result.runes) {
      const runeSpacing = this.canvas.width / (data.result.runes.length + 1);
      
      data.result.runes.forEach((rune: string, index: number) => {
        const x = runeSpacing * (index + 1);
        const y = questionY + 80;
        
        // Rune stone
        this.ctx.fillStyle = 'rgba(120, 113, 108, 0.8)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 70, 50, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Rune symbol
        this.ctx.font = 'bold 36px serif';
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.textAlign = 'center';
        const runeSymbol = rune.match(/\((.+)\)/)?.[1] || '᚛';
        this.ctx.fillText(runeSymbol, x, y + 10);
        
        // Rune name
        this.ctx.font = '16px serif';
        this.ctx.fillStyle = '#fbbf24';
        const runeName = rune.split(' (')[0];
        this.ctx.fillText(runeName, x, y + 80);
      });
    }

    // Meaning
    this.ctx.font = '24px serif';
    this.ctx.fillStyle = '#d1d5db';
    this.ctx.textAlign = 'center';
    const cleanMeaning = data.result.meaning
      .replace(/\*\*/g, '')
      .replace(/🔥/g, '')
      .replace(/🌿/g, '')
      .substring(0, 350) + '...';
    this.wrapText(cleanMeaning, 900, 30, questionY + 200);
  }

  private async drawFireContent(data: OracleImageData) {
    // Question
    this.ctx.font = 'italic 28px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 40, 340);

    // Fire visualization
    const fireY = questionY + 40;
    const fireHeight = 160;
    
    // Fire base
    this.ctx.fillStyle = '#dc2626';
    this.ctx.beginPath();
    this.ctx.ellipse(this.canvas.width/2, fireY + fireHeight, 120, 25, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // Flames
    for (let i = 0; i < 7; i++) {
      const x = (this.canvas.width/2) - 80 + (i * 25);
      const height = fireHeight - (Math.abs(i - 3) * 15);
      
      this.ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f97316';
      this.ctx.beginPath();
      this.ctx.ellipse(x, fireY + fireHeight - height/2, 12, height/2, 0, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    // Fire symbols
    this.ctx.font = '40px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🔥 ✨ 🔥', this.canvas.width/2, fireY - 10);

    // Flames revelation
    this.ctx.font = '26px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.textAlign = 'center';
    this.wrapText(`"${data.result.flames}"`, 900, 32, fireY + fireHeight + 50);
  }

  private async drawVoiceContent(data: OracleImageData) {
    // Question
    this.ctx.font = 'italic 28px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 40, 340);

    // Abyss visualization
    const abyssY = questionY + 40;
    const abyssSize = 200;
    
    // Concentric circles
    for (let i = 5; i >= 0; i--) {
      const radius = (abyssSize/2) * ((i + 1) / 6);
      this.ctx.strokeStyle = `rgba(245, 158, 11, ${0.8 - (i * 0.1)})`;
      this.ctx.lineWidth = 3;
      this.ctx.beginPath();
      this.ctx.arc(this.canvas.width/2, abyssY + abyssSize/2, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

    // Center void
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width/2, abyssY + abyssSize/2, 30, 0, 2 * Math.PI);
    this.ctx.fill();

    // Mystical symbols
    const symbols = ['𖤍', '⸸', '☿', '⚹'];
    symbols.forEach((symbol, index) => {
      const angle = (index * Math.PI * 2) / symbols.length;
      const x = this.canvas.width/2 + Math.cos(angle) * 140;
      const y = abyssY + abyssSize/2 + Math.sin(angle) * 140;
      
      this.ctx.font = '28px serif';
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(symbol, x, y);
    });

    // Voice text
    this.ctx.font = '26px serif';
    this.ctx.fillStyle = '#d1d5db';
    this.ctx.textAlign = 'center';
    this.wrapText(`"${data.result.voice}"`, 900, 32, abyssY + abyssSize + 60);
  }

  downloadImage(dataUrl: string, filename: string) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

// Social sharing functions
export class SocialSharer {
  static shareToFacebook(imageUrl: string, text: string) {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  static shareToTwitter(imageUrl: string, text: string) {
    const tweetText = `${text}\n\n#TemploDoAbismo #Oracle #Misticismo`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}&url=${encodeURIComponent(window.location.href)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
  }

  static shareToInstagram(imageUrl: string) {
    // Instagram doesn't have direct sharing API, so we copy the image and show instructions
    navigator.clipboard.writeText('Consulta realizada no Templo do Abismo - Portal Luciferiano de Sabedoria Ancestral').then(() => {
      alert('Texto copiado! Faça o download da imagem e poste no Instagram com o texto copiado.');
    });
  }

  static shareToWhatsApp(imageUrl: string, text: string) {
    const message = `${text}\n\nConsulta realizada no Templo do Abismo\n${window.location.href}`;
    const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
  }

  static shareToTelegram(imageUrl: string, text: string) {
    const message = `${text}\n\nConsulta realizada no Templo do Abismo\n${window.location.href}`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(message)}`;
    window.open(shareUrl, '_blank');
  }

  static async shareNative(imageUrl: string, text: string) {
    if (navigator.share) {
      try {
        // Convert data URL to blob for native sharing
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'oracle-consultation.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'Consulta do Oracle - Templo do Abismo',
          text: text,
          files: [file]
        });
      } catch (error) {
        console.log('Native sharing failed, falling back to manual methods');
      }
    }
  }
}