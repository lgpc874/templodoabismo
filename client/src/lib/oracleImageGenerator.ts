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

  private async loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  private drawBackground() {
    // Dark gradient background
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.3, '#1a1a2e');
    gradient.addColorStop(0.7, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Add subtle texture overlay
    this.ctx.globalAlpha = 0.1;
    for (let i = 0; i < 1000; i++) {
      this.ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
      this.ctx.fillRect(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height,
        1,
        1
      );
    }
    this.ctx.globalAlpha = 1;
  }

  private drawWatermark() {
    // Semi-transparent watermark background
    this.ctx.globalAlpha = 0.15;
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.fillRect(0, this.canvas.height - 150, this.canvas.width, 150);
    this.ctx.globalAlpha = 1;

    // Templo do Abismo text
    this.ctx.font = 'bold 48px serif';
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('TEMPLO DO ABISMO', this.canvas.width / 2, this.canvas.height - 80);

    // Mystical symbols
    this.ctx.font = '36px serif';
    this.ctx.fillStyle = '#d97706';
    this.ctx.fillText('𖤍 ⸸ 𖤍', this.canvas.width / 2, this.canvas.height - 30);
  }

  private drawHeader(title: string, subtitle: string) {
    // Title
    this.ctx.font = 'bold 72px serif';
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(title, this.canvas.width / 2, 120);

    // Subtitle
    this.ctx.font = '36px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.fillText(subtitle, this.canvas.width / 2, 180);

    // Decorative line
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();
    this.ctx.moveTo(150, 220);
    this.ctx.lineTo(this.canvas.width - 150, 220);
    this.ctx.stroke();
  }

  private wrapText(text: string, maxWidth: number, lineHeight: number, startY: number) {
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

  async generateTarotImage(data: OracleImageData): Promise<string> {
    this.drawBackground();
    this.drawHeader('CONSULTA TAROT', 'Revelação das Cartas Ancestrais');

    // Question
    this.ctx.font = 'italic 32px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 45, 300);

    // Cards
    if (data.result.cards) {
      this.ctx.font = 'bold 28px serif';
      this.ctx.fillStyle = '#f59e0b';
      
      const cardLabels = ['PASSADO', 'PRESENTE', 'FUTURO'];
      const cardWidth = 200;
      const cardSpacing = (this.canvas.width - (3 * cardWidth)) / 4;
      
      data.result.cards.forEach((card: string, index: number) => {
        const x = cardSpacing + (index * (cardWidth + cardSpacing));
        const y = questionY + 80;
        
        // Card background
        this.ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        this.ctx.fillRect(x, y, cardWidth, 280);
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, cardWidth, 280);
        
        // Card label
        this.ctx.fillStyle = '#fbbf24';
        this.ctx.font = 'bold 20px serif';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(cardLabels[index], x + cardWidth/2, y + 30);
        
        // Card name
        this.ctx.fillStyle = '#f3f4f6';
        this.ctx.font = '24px serif';
        const cardLines = this.wrapText(card, cardWidth - 20, 30, y + 80);
      });
    }

    // Interpretation
    this.ctx.font = '28px serif';
    this.ctx.fillStyle = '#d1d5db';
    this.ctx.textAlign = 'center';
    this.wrapText(data.result.interpretation.replace(/\*\*/g, '').replace(/🔮/g, ''), 900, 35, questionY + 400);

    this.drawWatermark();
    return this.canvas.toDataURL('image/png');
  }

  async generateMirrorImage(data: OracleImageData): Promise<string> {
    this.drawBackground();
    this.drawHeader('SPECULUM ASTRALIS', 'Espelho da Contemplação Interior');

    // Question
    this.ctx.font = 'italic 32px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 45, 300);

    // Mirror frame
    const mirrorSize = 300;
    const mirrorX = (this.canvas.width - mirrorSize) / 2;
    const mirrorY = questionY + 60;
    
    // Outer frame
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 8;
    this.ctx.beginPath();
    this.ctx.arc(mirrorX + mirrorSize/2, mirrorY + mirrorSize/2, mirrorSize/2, 0, 2 * Math.PI);
    this.ctx.stroke();
    
    // Inner mirror surface
    const gradient = this.ctx.createRadialGradient(
      mirrorX + mirrorSize/2, mirrorY + mirrorSize/2, 0,
      mirrorX + mirrorSize/2, mirrorY + mirrorSize/2, mirrorSize/2
    );
    gradient.addColorStop(0, 'rgba(245, 158, 11, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.8)');
    
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(mirrorX + mirrorSize/2, mirrorY + mirrorSize/2, mirrorSize/2 - 20, 0, 2 * Math.PI);
    this.ctx.fill();

    // Eye symbol in center
    this.ctx.font = '72px serif';
    this.ctx.fillStyle = '#f59e0b';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('👁️', mirrorX + mirrorSize/2, mirrorY + mirrorSize/2 + 25);

    // Reflection text
    this.ctx.font = '28px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.textAlign = 'center';
    this.wrapText(`"${data.result.reflection}"`, 900, 35, mirrorY + mirrorSize + 80);

    this.drawWatermark();
    return this.canvas.toDataURL('image/png');
  }

  async generateRunesImage(data: OracleImageData): Promise<string> {
    this.drawBackground();
    this.drawHeader('REVELAÇÃO RÚNICA', 'Sabedoria dos Ancestrais Nórdicos');

    // Question
    this.ctx.font = 'italic 32px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 45, 300);

    // Runes
    if (data.result.runes) {
      const runeSpacing = this.canvas.width / (data.result.runes.length + 1);
      
      data.result.runes.forEach((rune: string, index: number) => {
        const x = runeSpacing * (index + 1);
        const y = questionY + 100;
        
        // Rune stone background
        this.ctx.fillStyle = 'rgba(120, 113, 108, 0.8)';
        this.ctx.beginPath();
        this.ctx.ellipse(x, y, 80, 60, 0, 0, 2 * Math.PI);
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // Rune symbol
        this.ctx.font = 'bold 48px serif';
        this.ctx.fillStyle = '#f59e0b';
        this.ctx.textAlign = 'center';
        const runeSymbol = rune.match(/\((.+)\)/)?.[1] || rune;
        this.ctx.fillText(runeSymbol, x, y + 15);
        
        // Rune name
        this.ctx.font = '20px serif';
        this.ctx.fillStyle = '#fbbf24';
        const runeName = rune.split(' (')[0];
        this.ctx.fillText(runeName, x, y + 100);
      });
    }

    // Interpretation
    this.ctx.font = '28px serif';
    this.ctx.fillStyle = '#d1d5db';
    this.ctx.textAlign = 'center';
    this.wrapText(data.result.meaning.replace(/\*\*/g, '').replace(/🔥/g, ''), 900, 35, questionY + 280);

    this.drawWatermark();
    return this.canvas.toDataURL('image/png');
  }

  async generateFireImage(data: OracleImageData): Promise<string> {
    this.drawBackground();
    this.drawHeader('VISÃO DAS CHAMAS', 'Revelações do Fogo Sagrado');

    // Question
    this.ctx.font = 'italic 32px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 45, 300);

    // Fire visualization
    const fireY = questionY + 60;
    const fireHeight = 200;
    
    // Fire base
    this.ctx.fillStyle = '#dc2626';
    this.ctx.beginPath();
    this.ctx.ellipse(this.canvas.width/2, fireY + fireHeight, 150, 30, 0, 0, 2 * Math.PI);
    this.ctx.fill();
    
    // Flame shapes
    for (let i = 0; i < 7; i++) {
      const x = (this.canvas.width/2) - 100 + (i * 30);
      const height = fireHeight - (Math.abs(i - 3) * 20);
      
      this.ctx.fillStyle = i % 2 === 0 ? '#dc2626' : '#f97316';
      this.ctx.beginPath();
      this.ctx.ellipse(x, fireY + fireHeight - height/2, 15, height/2, 0, 0, 2 * Math.PI);
      this.ctx.fill();
    }

    // Fire symbols
    this.ctx.font = '48px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('🔥 ✨ 🔥', this.canvas.width/2, fireY - 20);

    // Flames revelation
    this.ctx.font = '28px serif';
    this.ctx.fillStyle = '#fbbf24';
    this.ctx.textAlign = 'center';
    this.wrapText(`"${data.result.flames}"`, 900, 35, fireY + fireHeight + 80);

    this.drawWatermark();
    return this.canvas.toDataURL('image/png');
  }

  async generateVoiceImage(data: OracleImageData): Promise<string> {
    this.drawBackground();
    this.drawHeader('VOZ DO ABISMO', 'Sussurros do Vazio Criativo');

    // Question
    this.ctx.font = 'italic 32px serif';
    this.ctx.fillStyle = '#e5e7eb';
    this.ctx.textAlign = 'center';
    const questionY = this.wrapText(`"${data.question}"`, 800, 45, 300);

    // Abyss visualization
    const abyssY = questionY + 60;
    const abyssSize = 250;
    
    // Concentric circles representing the abyss
    for (let i = 5; i >= 0; i--) {
      const radius = (abyssSize/2) * ((i + 1) / 6);
      this.ctx.strokeStyle = `rgba(245, 158, 11, ${0.8 - (i * 0.1)})`;
      this.ctx.lineWidth = 4;
      this.ctx.beginPath();
      this.ctx.arc(this.canvas.width/2, abyssY + abyssSize/2, radius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }

    // Center void
    this.ctx.fillStyle = '#000000';
    this.ctx.beginPath();
    this.ctx.arc(this.canvas.width/2, abyssY + abyssSize/2, 40, 0, 2 * Math.PI);
    this.ctx.fill();

    // Mystical symbols around
    const symbols = ['𖤍', '⸸', '☿', '⚹'];
    symbols.forEach((symbol, index) => {
      const angle = (index * Math.PI * 2) / symbols.length;
      const x = this.canvas.width/2 + Math.cos(angle) * 180;
      const y = abyssY + abyssSize/2 + Math.sin(angle) * 180;
      
      this.ctx.font = '36px serif';
      this.ctx.fillStyle = '#f59e0b';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(symbol, x, y);
    });

    // Voice text
    this.ctx.font = '28px serif';
    this.ctx.fillStyle = '#d1d5db';
    this.ctx.textAlign = 'center';
    this.wrapText(`"${data.result.voice}"`, 900, 35, abyssY + abyssSize + 80);

    this.drawWatermark();
    return this.canvas.toDataURL('image/png');
  }

  async generateImage(data: OracleImageData): Promise<string> {
    switch (data.type) {
      case 'tarot':
        return this.generateTarotImage(data);
      case 'mirror':
        return this.generateMirrorImage(data);
      case 'runes':
        return this.generateRunesImage(data);
      case 'fire':
        return this.generateFireImage(data);
      case 'voice':
        return this.generateVoiceImage(data);
      default:
        throw new Error('Tipo de oracle não suportado');
    }
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