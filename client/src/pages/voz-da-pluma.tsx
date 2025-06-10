import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Clock, Twitter, Facebook, Instagram, Share2, Feather, Sun, Sunrise, Zap, ArrowLeft } from 'lucide-react';
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

  // Ordenar manifestações por horário
  const sortedManifestations = manifestations.sort((a, b) => a.manifestation_time.localeCompare(b.manifestation_time));

  const downloadContentImage = async (content: VozPlumaManifestation) => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Canvas não suportado');
      }

      canvas.width = 1080;
      canvas.height = 1080;

      // Fundo gradiente místico baseado no horário
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      if (content.manifestation_time === '07:00') {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#4c1d95'); // Roxo escuro
        gradient.addColorStop(1, '#0a0a0a');
      } else if (content.manifestation_time === '09:00') {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#7c2d12'); // Âmbar escuro
        gradient.addColorStop(1, '#0a0a0a');
      } else {
        gradient.addColorStop(0, '#0a0a0a');
        gradient.addColorStop(0.5, '#991b1b'); // Vermelho escuro
        gradient.addColorStop(1, '#0a0a0a');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Textura de estrelas
      for (let i = 0; i < 100; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 2;
        
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`;
        ctx.fill();
      }

      // Título
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'bold 36px serif';
      ctx.textAlign = 'center';
      ctx.fillText(content.title, canvas.width / 2, 120);

      // Horário e tipo
      ctx.fillStyle = '#9333ea';
      ctx.font = '24px serif';
      ctx.fillText(`${content.manifestation_time} • ${content.type.toUpperCase()}`, canvas.width / 2, 180);

      // Conteúdo principal
      const words = content.content.split(' ');
      const lines = [];
      let currentLine = '';
      const maxWidth = canvas.width - 120;

      ctx.font = '28px serif';
      ctx.fillStyle = '#e5e7eb';

      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine !== '') {
          lines.push(currentLine);
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      }
      lines.push(currentLine);

      let lineY = 280;
      for (const line of lines) {
        ctx.fillText(line.trim(), canvas.width / 2, lineY);
        lineY += 40;
      }

      // Autor
      ctx.fillStyle = '#D4AF37';
      ctx.font = 'italic 24px serif';
      ctx.fillText(`— ${content.author}`, canvas.width / 2, lineY + 60);

      // Data
      ctx.fillStyle = '#9333ea';
      ctx.font = '20px serif';
      const formattedDate = new Date(content.posted_date).toLocaleDateString('pt-BR');
      ctx.fillText(formattedDate, canvas.width / 2, lineY + 100);

      // Marca d'água
      ctx.fillStyle = 'rgba(212, 175, 55, 0.3)';
      ctx.font = '18px serif';
      ctx.fillText('Templo do Abismo', canvas.width / 2, canvas.height - 40);

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `voz-da-pluma-${content.type}-${content.manifestation_time.replace(':', '')}-${Date.now()}.png`;
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
      }, 'image/png');

    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast({
        title: "Erro no Download",
        description: "Falha ao gerar a imagem.",
        variant: "destructive",
      });
    }
  };

  const shareToSocial = (platform: string, content: VozPlumaManifestation) => {
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
  };

  const getManifestationConfig = (time: string) => {
    switch (time) {
      case '07:00':
        return {
          icon: <Sunrise className="w-6 h-6" />,
          title: 'Dica Mística do Dia',
          color: 'from-purple-900/50 to-indigo-900/30',
          borderColor: 'border-purple-500/30',
          timeColor: 'text-purple-400',
          bgGlow: 'bg-purple-500/5'
        };
      case '09:00':
        return {
          icon: <Sun className="w-6 h-6" />,
          title: 'Verso da Pluma Dourada',
          color: 'from-amber-900/50 to-orange-900/30',
          borderColor: 'border-amber-500/30',
          timeColor: 'text-amber-400',
          bgGlow: 'bg-amber-500/5'
        };
      case '11:00':
        return {
          icon: <Zap className="w-6 h-6" />,
          title: 'Ritual Ancestral',
          color: 'from-red-900/50 to-rose-900/30',
          borderColor: 'border-red-500/30',
          timeColor: 'text-red-400',
          bgGlow: 'bg-red-500/5'
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
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-purple-950 to-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  // Organizar manifestações por horário
  const manifestationsByTime = {
    '07:00': manifestations?.find((m: VozPlumaManifestation) => m.manifestation_time === '07:00'),
    '09:00': manifestations?.find((m: VozPlumaManifestation) => m.manifestation_time === '09:00'),
    '11:00': manifestations?.find((m: VozPlumaManifestation) => m.manifestation_time === '11:00')
  };

  return (
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
            <span className="text-amber-400">Rituais ancestrais manifestam-se apenas nos domingos.</span>
          </p>
        </div>

        {/* Grid das Três Manifestações */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {Object.entries(manifestationsByTime).map(([time, manifestation]) => {
              const config = getManifestationConfig(time);
              
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
                    <span><strong>07:00:</strong> Dica Mística</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300">
                    <Sun className="w-4 h-4" />
                    <span><strong>09:00:</strong> Verso da Pluma</span>
                  </div>
                  <div className="flex items-center gap-2 text-red-300">
                    <Zap className="w-4 h-4" />
                    <span><strong>11:00:</strong> Ritual Ancestral (Domingos)</span>
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
      </div>

      <Footer />
    </div>
  );
}