import { useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Clock, Twitter, Facebook, Instagram, Feather, Sun, Sunrise, Zap, ArrowLeft } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'wouter';
import Footer from '../components/footer';

interface VozPlumaManifestation {
  id: number;
  manifestation_time: string; // '07:00', '09:00', '11:00'
  type: string; // 'dica', 'verso', 'ritual'
  title: string;
  content: string;
  author: string;
  posted_date: string; // YYYY-MM-DD
  posted_at: string;
  is_current: boolean;
}

export default function VozDaPluma() {
  const { toast } = useToast();
  const { data: manifestations = [], isLoading } = useQuery<VozPlumaManifestation[]>({
    queryKey: ['/api/voz-pluma/manifestations'],
  });

  const manifestationsByTime = useMemo(() => ({
    '07:00': manifestations?.find((m: VozPlumaManifestation) => m.manifestation_time === '07:00'),
    '09:00': manifestations?.find((m: VozPlumaManifestation) => m.manifestation_time === '09:00'),
    '11:00': manifestations?.find((m: VozPlumaManifestation) => m.manifestation_time === '11:00')
  }), [manifestations]);

  const downloadContentImage = useCallback(async (content: VozPlumaManifestation) => {
    try {
      // Mostrar indicador de carregamento
      toast({
        title: "Gerando Imagem",
        description: "Aguarde enquanto criamos sua imagem...",
        className: "bg-purple-900 border-purple-500 text-white",
      });

      // Usar setTimeout para não bloquear a UI
      setTimeout(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Canvas não suportado');
        }

        // Usar resolução menor para dispositivos móveis
        const isMobile = window.innerWidth < 768;
        const size = isMobile ? 720 : 1080;
        canvas.width = size;
        canvas.height = size;

        // Fundo gradiente simples
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        const colors = {
          '07:00': ['#0a0a0a', '#4c1d95', '#0a0a0a'],
          '09:00': ['#0a0a0a', '#7c2d12', '#0a0a0a'],
          default: ['#0a0a0a', '#991b1b', '#0a0a0a']
        };
        
        const colorSet = colors[content.manifestation_time as keyof typeof colors] || colors.default;
        gradient.addColorStop(0, colorSet[0]);
        gradient.addColorStop(0.5, colorSet[1]);
        gradient.addColorStop(1, colorSet[2]);
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Estrelas otimizadas (menos quantidade)
        const starCount = isMobile ? 30 : 50;
        for (let i = 0; i < starCount; i++) {
          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;
          
          ctx.fillStyle = `rgba(255, 255, 255, ${0.3 + Math.random() * 0.4})`;
          ctx.fillRect(x, y, 1, 1); // Usar fillRect ao invés de arc para performance
        }

        // Textos com fontes otimizadas
        const fontSize = isMobile ? 24 : 36;
        ctx.fillStyle = '#D4AF37';
        ctx.font = `bold ${fontSize}px Arial, sans-serif`; // Arial é mais rápido que serif
        ctx.textAlign = 'center';
        ctx.fillText(content.title, canvas.width / 2, 120);

        // Horário e tipo
        ctx.fillStyle = '#9333ea';
        ctx.font = `${fontSize * 0.6}px Arial, sans-serif`;
        ctx.fillText(`${content.manifestation_time} • ${content.type.toUpperCase()}`, canvas.width / 2, 180);

        // Conteúdo otimizado
        const maxCharsPerLine = isMobile ? 30 : 40;
        const words = content.content.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
          if ((currentLine + word).length > maxCharsPerLine && currentLine !== '') {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
          } else {
            currentLine += word + ' ';
          }
        }
        if (currentLine.trim()) lines.push(currentLine.trim());

        ctx.font = `${fontSize * 0.7}px Arial, sans-serif`;
        ctx.fillStyle = '#e5e7eb';

        let lineY = 250;
        lines.slice(0, 8).forEach(line => { // Limitar linhas para performance
          ctx.fillText(line, canvas.width / 2, lineY);
          lineY += fontSize * 0.9;
        });

        // Autor
        ctx.fillStyle = '#D4AF37';
        ctx.font = `italic ${fontSize * 0.6}px Arial, sans-serif`;
        ctx.fillText(`— ${content.author}`, canvas.width / 2, lineY + 40);

        // Data
        ctx.fillStyle = '#9333ea';
        ctx.font = `${fontSize * 0.5}px Arial, sans-serif`;
        const formattedDate = new Date(content.posted_date).toLocaleDateString('pt-BR');
        ctx.fillText(formattedDate, canvas.width / 2, lineY + 80);

        // Marca d'água
        ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
        ctx.font = `${fontSize * 0.4}px Arial, sans-serif`;
        ctx.fillText('Templo do Abismo', canvas.width / 2, canvas.height - 40);

        // Usar qualidade menor para dispositivos móveis
        const quality = isMobile ? 0.7 : 0.9;
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `voz-da-pluma-${content.type}-${content.manifestation_time.replace(':', '')}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            toast({
              title: "Download Concluído",
              description: "Imagem salva com sucesso!",
              className: "bg-purple-900 border-purple-500 text-white",
            });
          }
        }, 'image/png', quality);
      }, 100);

    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast({
        title: "Erro no Download",
        description: "Falha ao gerar a imagem.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const shareToSocial = useCallback((platform: string, content: VozPlumaManifestation) => {
    const formattedDate = new Date(content.posted_date).toLocaleDateString('pt-BR');
    const text = `${content.title}\n\n"${content.content}"\n\n— ${content.author}\n\nManifestação das ${content.manifestation_time} • ${formattedDate}\n\n#TemploDoAbismo #VozDaPluma`;
    const url = window.location.href;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'instagram':
        navigator.clipboard.writeText(text).then(() => {
          toast({
            title: "Texto Copiado",
            description: "Cole no Instagram para compartilhar!",
            className: "bg-purple-900 border-purple-500 text-white",
          });
        });
        return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  }, [toast]);

  const getManifestationConfig = useCallback((time: string, manifestation?: VozPlumaManifestation) => {
    const today = new Date();
    const isSunday = today.getDay() === 0;
    
    switch (time) {
      case '07:00':
        if (isSunday || (manifestation && manifestation.type === 'ritual')) {
          return {
            icon: <Zap className="w-6 h-6" />,
            title: 'Rituais Ancestrais',
            description: 'Manifestados todos os domingos às 7h da manhã',
            color: 'from-red-900/50 to-orange-900/30',
            borderColor: 'border-red-500/30',
            timeColor: 'text-red-400',
            bgGlow: 'bg-red-500/5'
          };
        }
        return {
          icon: <Sunrise className="w-6 h-6" />,
          title: 'Dica Mística do Dia',
          description: '',
          color: 'from-purple-900/50 to-indigo-900/30',
          borderColor: 'border-purple-500/30',
          timeColor: 'text-purple-400',
          bgGlow: 'bg-purple-500/5'
        };
      case '09:00':
        return {
          icon: <Sun className="w-6 h-6" />,
          title: 'Verso da Pluma Dourada',
          description: '',
          color: 'from-amber-900/50 to-orange-900/30',
          borderColor: 'border-amber-500/30',
          timeColor: 'text-amber-400',
          bgGlow: 'bg-amber-500/5'
        };
      case '11:00':
        return {
          icon: <Feather className="w-6 h-6" />,
          title: 'Reflexão Matinal',
          description: '',
          color: 'from-purple-900/50 to-violet-900/30',
          borderColor: 'border-purple-500/30',
          timeColor: 'text-purple-400',
          bgGlow: 'bg-purple-500/5'
        };
      default:
        return {
          icon: <Feather className="w-6 h-6" />,
          title: 'Manifestação',
          color: 'from-gray-900/50 to-slate-900/30',
          borderColor: 'border-gray-500/30',
          timeColor: 'text-gray-400',
          bgGlow: 'bg-gray-500/5'
        };
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden">
        {/* Fixed Central Rotating Seal - Your Custom Image */}
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
          <div className="rotating-seal w-96 h-96 opacity-20">
            <img 
              src="/seal.png" 
              alt="Selo do Templo do Abismo" 
              className="w-full h-full object-contain filter drop-shadow-lg"
            />
          </div>
        </div>

        {/* Mystical floating particles */}
        <div className="fixed inset-0 overflow-hidden z-0">
          <div className="mystical-particles"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>
        </div>

        {/* Main content */}
        <div className="relative z-10 min-h-screen px-4 pt-16">
        {/* Navigation back to home */}
        <div className="absolute top-6 left-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retornar ao Templo
            </Button>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <div className="text-amber-400 text-4xl mb-4">🪶</div>
          <h1 className="text-5xl md:text-6xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
            VOZ DA PLUMA
          </h1>
          <div className="flex justify-center items-center space-x-8 text-amber-500 text-2xl mb-6">
            <span>☽</span>
            <span>⚹</span>
            <span>𖤍</span>
            <span>⚹</span>
            <span>☾</span>
          </div>
          <p className="text-purple-300 text-lg max-w-3xl mx-auto font-cinzel">
            Três manifestações diárias emanadas das profundezas do conhecimento ancestral.<br/>
            <span className="text-amber-400">Rituais ancestrais manifestam-se aos domingos às 7h da manhã.</span>
          </p>
        </div>

        {/* Grid das Três Manifestações */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {Object.entries(manifestationsByTime).map(([time, manifestation]) => {
              const config = getManifestationConfig(time, manifestation);
              
              return (
                <Card 
                  key={time} 
                  className="bg-black/40 backdrop-blur-sm border border-amber-500/30 hover:border-amber-500/50 transition-all duration-300 mystical-glow"
                >
                  <CardHeader className="text-center pb-4">
                    <div className={`flex items-center justify-center gap-2 mb-3 ${config.timeColor}`}>
                      {config.icon}
                      <span className="text-lg font-semibold">{time}</span>
                    </div>
                    <CardTitle className="text-xl font-cinzel-decorative text-amber-400 mb-2">
                      {config.title}
                    </CardTitle>
                    {config.description && (
                      <p className="text-xs text-red-300 italic mb-2">
                        {config.description}
                      </p>
                    )}
                    
                    {manifestation ? (
                      <div className="space-y-2">
                        <h3 className="text-lg text-purple-200 font-medium font-cinzel">
                          {manifestation.title}
                        </h3>
                        <p className="text-sm text-amber-400">
                          {new Date(manifestation.posted_date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    ) : (
                      <p className="text-purple-400 text-sm">
                        Aguardando manifestação...
                      </p>
                    )}
                  </CardHeader>
                  
                  {manifestation && (
                    <CardContent className="text-center space-y-4">
                      <blockquote className="text-purple-200 leading-relaxed italic font-cinzel">
                      "{manifestation.content}"
                    </blockquote>
                    
                    <div className="text-amber-300 text-sm">
                      — {manifestation.author}
                    </div>

                    <div className="flex flex-wrap justify-center gap-2">
                      <Button
                        onClick={() => downloadContentImage(manifestation)}
                        size="sm"
                        className="bg-amber-600/80 hover:bg-amber-700 text-black font-medium"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Baixar
                      </Button>
                      
                      <Button
                        onClick={() => shareToSocial('twitter', manifestation)}
                        size="sm"
                        variant="outline"
                        className="border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                      >
                        <Twitter className="w-3 h-3 mr-1" />
                        Twitter
                      </Button>

                      <Button
                        onClick={() => shareToSocial('instagram', manifestation)}
                        size="sm"
                        variant="outline"
                        className="border-pink-500/30 text-pink-400 hover:bg-pink-500/10"
                      >
                        <Instagram className="w-3 h-3 mr-1" />
                        Instagram
                      </Button>
                    </div>
                  </CardContent>
                )}
              </Card>
            );
          })}
          </div>
        </div>

        {/* Informações sobre o Sistema */}
        <Card className="bg-black/40 backdrop-blur-sm border border-purple-500/30 mystical-glow">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <Clock className="w-8 h-8 text-amber-400 mt-1" />
              <div>
                <h3 className="text-xl font-cinzel-decorative text-amber-400 mb-2">
                  Manifestações Automáticas
                </h3>
                <p className="text-purple-300 mb-3 font-cinzel">
                  A Voz da Pluma se manifesta automaticamente três vezes ao dia:
                </p>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-purple-300">
                    <Sunrise className="w-4 h-4" />
                    <span><strong>07:00:</strong> Dica Mística / Ritual Ancestral (Domingos)</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300">
                    <Sun className="w-4 h-4" />
                    <span><strong>09:00:</strong> Verso da Pluma</span>
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Feather className="w-4 h-4" />
                    <span><strong>11:00:</strong> Reflexão Matinal</span>
                  </div>
                </div>
                <p className="text-amber-400 text-xs mt-3 italic">
                  "As manifestações são substituídas diariamente, mantendo sempre o conteúdo mais atual das energias presentes."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>

        <Footer />
      </div>
    </>
  );
}