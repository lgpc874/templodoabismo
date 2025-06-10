import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, ArrowLeft, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface MirrorResult {
  reflection: string;
}

interface OracleResponse {
  type: string;
  question: string;
  result: MirrorResult;
  timestamp: string;
}

export default function OracleMirror() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<OracleResponse | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  const consultMutation = useMutation({
    mutationFn: async (data: { type: string; question: string }): Promise<OracleResponse> => {
      return await apiRequest("/api/oracle/consult", data);
    },
    onSuccess: (data: OracleResponse) => {
      setResult(data);
      generateOracleImage(data);
      toast({
        title: "Reflexão Revelada",
        description: "O Espelho Astral mostrou sua verdade",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Consulta",
        description: "Não foi possível acessar o Espelho",
        variant: "destructive",
      });
    },
  });

  const generateOracleImage = (data: OracleResponse) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 1000;

    // Create mystical background gradient
    const gradient = ctx.createRadialGradient(400, 500, 0, 400, 500, 500);
    gradient.addColorStop(0, '#1a0b2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f0f23');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 800, 1000);

    // Add mystical border
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 4;
    ctx.setLineDash([10, 5]);
    ctx.strokeRect(20, 20, 760, 960);

    // Draw pentagram symbol
    ctx.strokeStyle = '#d4af37';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    const centerX = 400;
    const centerY = 150;
    const radius = 40;
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();

    // Title
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 36px serif';
    ctx.textAlign = 'center';
    ctx.fillText('ESPELHO ASTRAL', 400, 250);

    // Question
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px serif';
    const questionLines = wrapText(ctx, data.question, 720);
    questionLines.forEach((line, index) => {
      ctx.fillText(line, 400, 320 + (index * 25));
    });

    // Reflection text
    ctx.fillStyle = '#e0c097';
    ctx.font = '20px serif';
    const reflectionLines = wrapText(ctx, data.result.reflection, 720);
    reflectionLines.forEach((line, index) => {
      ctx.fillText(line, 400, 450 + (index * 30));
    });

    // Watermark
    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 24px serif';
    ctx.fillText('TEMPLO DO ABISMO', 400, 920);

    // Timestamp
    ctx.fillStyle = '#888888';
    ctx.font = '14px serif';
    ctx.fillText(new Date(data.timestamp).toLocaleDateString('pt-BR'), 400, 950);
  };

  const wrapText = (ctx: CanvasRenderingContext2D, text: string, maxWidth: number) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + ' ' + word).width;
      if (width < maxWidth) {
        currentLine += ' ' + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `templo-do-abismo-oraculo-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "Imagem Baixada",
      description: "Sua consulta foi salva com sucesso",
    });
  };

  const shareImage = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;

        if (navigator.share && navigator.canShare) {
          const file = new File([blob], 'templo-do-abismo-oraculo.png', { type: 'image/png' });
          await navigator.share({
            title: 'Consulta do Templo do Abismo',
            text: 'Compartilhando minha consulta mística do Templo do Abismo',
            files: [file]
          });
        } else {
          // Fallback for browsers without native sharing
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'templo-do-abismo-oraculo.png';
          link.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/png');

      toast({
        title: "Compartilhamento",
        description: "Pronto para compartilhar sua consulta",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível compartilhar a imagem",
        variant: "destructive",
      });
    }
  };

  const handleConsult = () => {
    if (!question.trim()) {
      toast({
        title: "Contemplação Necessária",
        description: "Formule sua questão interior antes de olhar no espelho",
        variant: "destructive",
      });
      return;
    }

    consultMutation.mutate({
      type: "mirror",
      question: question.trim(),
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Central Rotating Seal */}
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
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-20">
        {/* Back Button */}
        <div className="w-full max-w-4xl mb-6">
          <Link href="/oracle">
            <Button variant="ghost" className="text-amber-400 hover:text-amber-300">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Oracle
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">🪞</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              SPECULUM ASTRALIS
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-300 mb-6 floating-title-slow">
              Espelho da Contemplação Interior
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              O <strong className="text-amber-400">Espelho Astral</strong> revela as verdades mais profundas da 
              <strong className="text-red-400"> alma em busca</strong>. Olhe através do véu e veja sua essência.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Nosce Te Ipsum"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Conhece-te a ti mesmo
              </p>
            </div>
          </div>
        </div>

        {/* Consultation Interface */}
        <div className="floating-card max-w-4xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Question Form */}
              <div className="space-y-6">
                <Card className="bg-black/40 border-amber-500/30">
                  <CardHeader>
                    <CardTitle className="text-amber-400 flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Questão Interior
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Contemple profundamente e formule sua pergunta para o espelho astral
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="question" className="text-gray-300">
                        Pergunta para Contemplação
                      </Label>
                      <Textarea
                        id="question"
                        placeholder="O que preciso ver em mim mesmo neste momento?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        className="mt-2 bg-black/20 border-amber-500/30 text-gray-200 placeholder-gray-500"
                        rows={4}
                      />
                    </div>
                    
                    <Button
                      onClick={handleConsult}
                      disabled={consultMutation.isPending || !question.trim()}
                      className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                    >
                      {consultMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Contemplando no Espelho...
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Consultar Espelho
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* Mirror Visualization */}
                <Card className="bg-black/40 border-amber-500/30">
                  <CardContent className="p-6">
                    <div className="aspect-square bg-gradient-to-br from-gray-900 via-gray-800 to-black border-4 border-amber-500/30 rounded-full relative overflow-hidden shadow-2xl">
                      <div className="absolute inset-4 bg-gradient-to-br from-amber-500/10 via-transparent to-blue-500/10 rounded-full">
                        <div className="absolute inset-2 bg-black/50 rounded-full flex items-center justify-center">
                          <div className="text-amber-400/70 text-4xl animate-pulse">
                            👁️
                          </div>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-white/5 rounded-full"></div>
                    </div>
                    <p className="text-center text-gray-400 text-sm mt-4 font-cinzel-decorative">
                      Espelho da Verdade Interior
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {result ? (
                  <Card className="bg-black/40 border-amber-500/30">
                    <CardHeader>
                      <CardTitle className="text-amber-400">Reflexão Astral</CardTitle>
                      <CardDescription className="text-gray-400">
                        O que o espelho revelou sobre sua consulta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-gradient-to-b from-amber-500/10 via-purple-500/10 to-black/20 border border-amber-500/20 rounded-lg p-6">
                        <h4 className="text-lg font-cinzel-decorative text-amber-300 mb-4 flex items-center">
                          <Eye className="w-5 h-5 mr-2" />
                          Visão Interior
                        </h4>
                        <div className="text-gray-300 leading-relaxed text-lg italic">
                          "{result.result.reflection}"
                        </div>
                      </div>

                      <div className="text-center">
                        <div className="text-amber-400 text-xl mb-2">✨ ⚹ ✨</div>
                        <p className="text-sm text-gray-400 font-cinzel-decorative">
                          "A verdade reside no olhar interior"
                        </p>
                      </div>

                      <div className="text-center text-xs text-gray-500">
                        Reflexão contemplada em {new Date(result.timestamp).toLocaleString('pt-BR')}
                      </div>

                      {/* Download and Share Buttons */}
                      <div className="flex gap-4 justify-center mt-6">
                        <Button
                          onClick={downloadImage}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Imagem
                        </Button>
                        <Button
                          onClick={shareImage}
                          variant="outline"
                          className="border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Compartilhar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-black/40 border-amber-500/30">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="text-6xl mb-4 opacity-50">🪞</div>
                      <p className="text-gray-400 text-center">
                        O espelho aguarda sua contemplação para revelar as verdades interiores
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "No espelho da alma, toda verdade se manifesta sem máscaras"
            </p>
            <p className="text-amber-400 font-semibold">
              — Ensinamento do Sanctum
            </p>
          </div>
        </div>
      </div>

      {/* Hidden Canvas for Image Generation */}
      <canvas
        ref={canvasRef}
        width={800}
        height={1000}
        style={{ display: 'none' }}
      />
    </div>
  );
}