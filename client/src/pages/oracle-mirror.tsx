import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Search, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function OracleMirror() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConsult = async () => {
    if (!question.trim()) {
      toast({
        title: "Pergunta necessária",
        description: "Por favor, faça uma pergunta antes de consultar o Espelho.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/oracle/consult", {
        method: "POST",
        body: JSON.stringify({
          type: "mirror",
          question: question.trim(),
        }),
      });

      setResult(response.result);
      toast({
        title: "Consulta realizada",
        description: "O espelho revelou suas verdades ocultas.",
      });
    } catch (error: any) {
      console.error("Erro na consulta:", error);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível consultar o Espelho.",
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
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">◯</div>
        </div>
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">☿</div>
        </div>
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">⸸</div>
        </div>
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">●</div>
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
            ESPELHO DO ABISMO
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-crimson">
            Contemple as verdades ocultas em seu reflexo interior através das águas primordiais
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="floating-card bg-black/8 backdrop-blur-sm border border-white/10">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-cinzel-decorative text-amber-300">
                Reflexão Abissal
              </CardTitle>
              <CardDescription className="text-gray-400">
                Olhe profundamente no espelho e permita que as verdades se revelem
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="block text-amber-300 font-medium mb-3">
                  Sua Pergunta ao Espelho
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="O que você busca ver em seu reflexo interior..."
                  className="bg-black/40 border-amber-500/30 text-gray-300 min-h-[120px]"
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleConsult}
                disabled={isLoading || !question.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-medium py-3"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Contemplando o Espelho...
                  </div>
                ) : (
                  "Consultar Espelho do Abismo"
                )}
              </Button>

              {result && (
                <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
                  <h3 className="text-xl font-cinzel-decorative text-amber-300 mb-4 text-center">
                    Reflexão Revelada
                  </h3>
                  
                  <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20">
                    <h4 className="text-lg text-amber-300 mb-3 font-cinzel-decorative">Verdade Interior:</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.reflection}
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