import { useState, useEffect, useRef } from "react";
import { Feather, Share2, Instagram, Facebook, Twitter, Download, Clock, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface DailyContent {
  id: string;
  type: 'dica' | 'poema' | 'ritual' | 'conjuracao';
  title: string;
  content: string;
  author: string;
  date: string;
  image_url?: string;
  generated_at: string;
}

interface ShareData {
  text: string;
  hashtags: string[];
  image?: string;
}

export default function VozDaPluma() {
  const { toast } = useToast();
  const [todayContent, setTodayContent] = useState<DailyContent | null>(null);
  const [recentContent, setRecentContent] = useState<DailyContent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Carrega conteúdo do dia ao carregar a página
  useEffect(() => {
    loadTodayContent();
    loadRecentContent();
  }, []);

  const loadTodayContent = async () => {
    try {
      const response = await fetch('/api/voz-pluma/today');
      if (response.ok) {
        const data = await response.json();
        setTodayContent(data);
      }
    } catch (error) {
      console.error('Erro ao carregar conteúdo do dia:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadRecentContent = async () => {
    try {
      const response = await apiRequest('GET', '/api/voz-pluma/recent');
      setRecentContent(response);
    } catch (error) {
      console.error('Erro ao carregar conteúdo recente:', error);
    }
  };



  const generateContentImage = async (content: DailyContent): Promise<string> => {
    const canvas = canvasRef.current;
    if (!canvas) throw new Error('Canvas não disponível');

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Contexto do canvas não disponível');

    // Configurar canvas
    canvas.width = 1080;
    canvas.height = 1080;

    // Fundo gradiente místico
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(0.5, '#1a0a1a');
    gradient.addColorStop(1, '#0a0a0a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Bordas decorativas
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    // Símbolos místicos nos cantos
    ctx.fillStyle = '#d4af37';
    ctx.font = '40px serif';
    ctx.textAlign = 'center';
    
    // Símbolo superior
    const typeSymbols = {
      'dica': '⚡',
      'poema': '🕯️',
      'ritual': '🔮',
      'conjuracao': '⭐'
    };
    
    ctx.fillText(typeSymbols[content.type] || '✨', canvas.width / 2, 120);

    // Título
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 48px serif';
    ctx.textAlign = 'center';
    
    const titleLines = wrapText(ctx, content.title, canvas.width - 160, 50);
    let yPosition = 220;
    titleLines.forEach(line => {
      ctx.fillText(line, canvas.width / 2, yPosition);
      yPosition += 60;
    });

    // Conteúdo principal
    ctx.fillStyle = '#ffffff';
    ctx.font = '32px serif';
    yPosition += 40;
    
    const contentLines = wrapText(ctx, content.content, canvas.width - 160, 32);
    contentLines.forEach(line => {
      ctx.fillText(line, canvas.width / 2, yPosition);
      yPosition += 45;
    });

    // Autor
    ctx.fillStyle = '#d4af37';
    ctx.font = 'italic 28px serif';
    ctx.fillText(`- ${content.author}`, canvas.width / 2, yPosition + 60);

    // Tipo de conteúdo
    ctx.fillStyle = '#888888';
    ctx.font = '24px sans-serif';
    const typeText = content.type.charAt(0).toUpperCase() + content.type.slice(1);
    ctx.fillText(typeText, canvas.width / 2, yPosition + 100);

    // Marca d'água - Templo do Abismo
    ctx.fillStyle = 'rgba(212, 175, 55, 0.7)';
    ctx.font = 'bold 28px serif';
    ctx.fillText('TEMPLO DO ABISMO', canvas.width / 2, canvas.height - 60);

    return canvas.toDataURL('image/png');
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number, fontSize: number): string[] => {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  };

  const downloadContentImage = async (content: DailyContent) => {
    try {
      const imageDataUrl = await generateContentImage(content);
      
      const link = document.createElement('a');
      link.download = `templo-do-abismo-${content.type}-${content.date}.png`;
      link.href = imageDataUrl;
      link.click();

      toast({
        title: "Imagem baixada!",
        description: "O conteúdo foi salvo em seu dispositivo.",
      });
    } catch (error) {
      toast({
        title: "Erro no download",
        description: "Não foi possível gerar a imagem.",
        variant: "destructive"
      });
    }
  };

  const shareToSocial = (platform: string, content: DailyContent) => {
    const shareData: ShareData = {
      text: getShareText(content),
      hashtags: getShareHashtags(content.type),
    };

    let url = "";
    const encodedText = encodeURIComponent(shareData.text);
    const encodedHashtags = encodeURIComponent(shareData.hashtags.join(' '));

    switch (platform) {
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&hashtags=${shareData.hashtags.join(',')}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodedText}`;
        break;
      case 'instagram':
        // Para Instagram, copiamos o texto e abrimos o app
        navigator.clipboard.writeText(`${shareData.text}\n\n${shareData.hashtags.join(' ')}`);
        toast({
          title: "Texto copiado!",
          description: "Cole no Instagram junto com a imagem baixada.",
        });
        return;
    }

    if (url) {
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  const getShareText = (content: DailyContent): string => {
    const typeTexts = {
      'dica': '💡 Dica Mística do Dia',
      'poema': '🕯️ Verso da Pluma Dourada',
      'ritual': '🔮 Ritual Ancestral',
      'conjuracao': '⭐ Conjuração Luciferiana'
    };

    return `${typeTexts[content.type]}\n\n"${content.content}"\n\n- ${content.author}\n\nTemplo do Abismo`;
  };

  const getShareHashtags = (type: string): string[] => {
    const baseHashtags = ['#TemploDoAbismo', '#VozDaPluma', '#Luciferiano', '#Sabedoria'];
    
    const typeHashtags = {
      'dica': ['#DicaMistica', '#Gnose'],
      'poema': ['#PoesiaMistica', '#PlumaDourada'],
      'ritual': ['#RitualAncestral', '#Magia'],
      'conjuracao': ['#Conjuracao', '#Invocacao']
    };

    return [...baseHashtags, ...(typeHashtags[type] || [])];
  };

  const getTypeColor = (type: string): string => {
    const colors = {
      'dica': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'poema': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'ritual': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'conjuracao': 'bg-red-500/20 text-red-400 border-red-500/30'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'dica': '⚡',
      'poema': '🕯️',
      'ritual': '🔮',
      'conjuracao': '⭐'
    };
    return icons[type] || '✨';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <Feather className="w-16 h-16 text-amber-400 mx-auto mb-4 animate-pulse" />
            <h1 className="text-4xl font-cinzel-decorative text-amber-400 mb-8">Voz da Pluma</h1>
            <div className="text-amber-300">Canalizando as revelações matinais...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black p-8">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Feather className="w-16 h-16 text-amber-400 mx-auto mb-4" />
          <h1 className="text-4xl font-cinzel-decorative text-amber-400 mb-4">Voz da Pluma</h1>
          <p className="text-amber-300 text-lg mb-6">
            Revelações Matinais Canalizadas pelas Correntes Abissais
          </p>
          
          <div className="text-amber-300/80 text-sm">
            Conteúdo gerado automaticamente todas as manhãs às 7h
          </div>
        </div>

        {/* Conteúdo Principal de Hoje */}
        {todayContent && (
          <Card className="bg-black/50 border-amber-500/30 mb-12">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{getTypeIcon(todayContent.type)}</span>
                  <div>
                    <CardTitle className="text-2xl text-amber-400 font-cinzel-decorative">
                      {todayContent.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={getTypeColor(todayContent.type)}>
                        {todayContent.type.charAt(0).toUpperCase() + todayContent.type.slice(1)}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        <Clock className="w-4 h-4 inline mr-1" />
                        {new Date(todayContent.date).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <blockquote className="text-lg text-amber-100 italic mb-4 border-l-4 border-amber-500 pl-4">
                "{todayContent.content}"
              </blockquote>
              
              <div className="text-right text-amber-300 font-semibold mb-6">
                — {todayContent.author}
              </div>

              {/* Botões de Ação */}
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => downloadContentImage(todayContent)}
                  variant="outline"
                  className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar Imagem
                </Button>

                <Button
                  onClick={() => shareToSocial('twitter', todayContent)}
                  variant="outline"
                  className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                >
                  <Twitter className="w-4 h-4 mr-2" />
                  Twitter
                </Button>

                <Button
                  onClick={() => shareToSocial('facebook', todayContent)}
                  variant="outline"
                  className="border-blue-600/30 text-blue-400 hover:bg-blue-600/10"
                >
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>

                <Button
                  onClick={() => shareToSocial('instagram', todayContent)}
                  variant="outline"
                  className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Instagram
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Publicações Recentes */}
        {recentContent.length > 0 && (
          <div>
            <h2 className="text-2xl font-cinzel-decorative text-amber-400 mb-6">
              Revelações Anteriores
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentContent.slice(0, 6).map((content) => (
                <Card key={content.id} className="bg-black/30 border-purple-500/30 hover:border-amber-500/30 transition-colors">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xl">{getTypeIcon(content.type)}</span>
                      <Badge className={getTypeColor(content.type)} variant="outline">
                        {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg text-amber-400 line-clamp-2">
                      {content.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-300 text-sm line-clamp-3 mb-3">
                      "{content.content}"
                    </p>
                    
                    <div className="text-xs text-amber-300 mb-3">
                      — {content.author}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => downloadContentImage(content)}
                        size="sm"
                        variant="ghost"
                        className="text-amber-400 hover:text-amber-300"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </Button>
                      
                      <Button
                        onClick={() => shareToSocial('twitter', content)}
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Informações sobre Automação */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-black/30 border-purple-500/30 mt-12">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-purple-400 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-purple-400 mb-2">
                  Revelações Automáticas
                </h3>
                <p className="text-gray-300 mb-3">
                  A Voz da Pluma manifesta automaticamente todos os dias:
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• <strong>Manhã (7h):</strong> Dica Mística do Dia</li>
                  <li>• <strong>Manhã (9h):</strong> Verso da Pluma Dourada</li>
                  <li>• <strong>Manhã (11h):</strong> Ritual ou Conjuração Ancestral</li>
                </ul>
                <p className="text-xs text-purple-300 mt-3">
                  Cada revelação pode ser baixada como imagem com marca d'água e compartilhada nas redes sociais.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}