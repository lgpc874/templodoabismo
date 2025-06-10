import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Gem, ArrowLeft, Download } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function OracleTarot() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConsult = async () => {
    if (!question.trim()) {
      toast({
        title: "Pergunta necessária",
        description: "Por favor, faça uma pergunta antes de consultar o Tarot.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/oracle/consult", {
        method: "POST",
        body: JSON.stringify({
          type: "tarot",
          question: question.trim(),
        }),
      });

      setResult(response.result);
      toast({
        title: "Consulta realizada",
        description: "As cartas foram lançadas e revelaram seus segredos.",
      });
    } catch (error: any) {
      console.error("Erro na consulta:", error);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível consultar o Tarot.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Mystical Particles with Mood Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

      {/* Dynamic Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/40 rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Smoke Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 opacity-15 smoke-effect"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-96px',
              animationDelay: `${Math.random() * 8}s`,
              background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)'
            }}
          />
        ))}
      </div>

      {/* Selo Central Fixo */}
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        {/* Outer rotating ring */}
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">
            ◯
          </div>
        </div>
        
        {/* Middle layer with mystical symbols */}
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">
            ☿
          </div>
        </div>
        
        {/* Main central seal */}
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">
            ⸸
          </div>
        </div>
        
        {/* Inner pulsing core */}
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">
            ●
          </div>
        </div>
      </div>

      {/* Mystical Energy Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/15 to-transparent animate-flicker" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent animate-flicker" style={{animationDelay: '2.5s'}} />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '3.5s'}} />
      </div>

      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/oraculo">
            <Button variant="ghost" className="mb-4 text-amber-300 hover:text-amber-400">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Oráculos
            </Button>
          </Link>
          
          <div className="floating-symbols mb-6">
            <span>⚹</span>
            <span>𖤍</span>
            <span>⚹</span>
            <span>☿</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-300 mb-4 floating-title mystical-glow">
            TAROT INFERNAL
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-crimson">
            Consulte as cartas ancestrais que revelam os caminhos do destino através dos véus da realidade
          </p>
        </div>

        {/* Consultation Interface */}
        <div className="max-w-4xl mx-auto">
          <Card className="floating-card bg-black/8 backdrop-blur-sm border border-white/10">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-full flex items-center justify-center">
                <Gem className="w-8 h-8 text-white/70" />
              </div>
              <CardTitle className="text-2xl font-cinzel-decorative text-amber-400/70">
                Consulta das Cartas
              </CardTitle>
              <CardDescription className="text-gray-400/70">
                Concentre-se em sua pergunta e permita que as cartas revelem os mistérios
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="block text-amber-400/70 font-medium mb-3">
                  Sua Pergunta ao Tarot
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Faça sua pergunta às cartas ancestrais..."
                  className="bg-black/10 border-white/20 text-gray-300/70 min-h-[120px]"
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleConsult}
                disabled={isLoading || !question.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-medium py-3"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Consultando as Cartas...
                  </div>
                ) : (
                  "Consultar Tarot Infernal"
                )}
              </Button>

              {/* Results */}
              {result && (
                <div className="mt-8 p-6 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                  <h3 className="text-xl font-cinzel-decorative text-amber-300 mb-4 text-center">
                    Revelação das Cartas
                  </h3>
                  
                  {result.cards && (
                    <div className="mb-6">
                      <h4 className="text-lg text-purple-300 mb-3">Cartas Reveladas:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {result.cards.map((card: string, index: number) => (
                          <div key={index} className="bg-black/40 p-4 rounded-lg border border-purple-500/20 text-center">
                            <div className="text-amber-400 font-cinzel-decorative text-lg">{card}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20">
                    <h4 className="text-lg text-amber-300 mb-3 font-cinzel-decorative">Interpretação:</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.interpretation}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}