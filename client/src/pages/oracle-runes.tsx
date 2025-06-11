import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import RotatingSeal from "@/components/RotatingSeal";

export default function OracleRunes() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConsult = async () => {
    if (!question.trim()) {
      toast({
        title: "Pergunta necessária",
        description: "Por favor, faça uma pergunta antes de consultar as Runas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/oracle/consult", {
        method: "POST",
        body: JSON.stringify({
          type: "runes",
          question: question.trim(),
        }),
      });

      setResult(response.result);
      toast({
        title: "Consulta realizada",
        description: "As runas ancestrais revelaram sua sabedoria.",
      });
    } catch (error: any) {
      console.error("Erro na consulta:", error);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível consultar as Runas.",
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

      {/* Selo Giratório Padrão */}
      <RotatingSeal variant="mystical" opacity={8} size="md" />



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
            RUNAS ANCESTRAIS
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-crimson">
            Decifre os símbolos nórdicos que sussurram sabedoria antiga através dos tempos
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="floating-card bg-black/30 backdrop-blur-lg border-amber-500/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-amber-600 to-orange-600 rounded-full flex items-center justify-center">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-cinzel-decorative text-amber-300">
                Lançamento das Runas
              </CardTitle>
              <CardDescription className="text-gray-400">
                Concentre-se em sua questão e permita que os símbolos ancestrais respondam
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="block text-amber-300 font-medium mb-3">
                  Sua Pergunta às Runas
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Que sabedoria ancestral você busca..."
                  className="bg-black/40 border-amber-500/30 text-gray-300 min-h-[120px]"
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleConsult}
                disabled={isLoading || !question.trim()}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-medium py-3"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Lançando as Runas...
                  </div>
                ) : (
                  "Consultar Runas Ancestrais"
                )}
              </Button>

              {result && (
                <div className="mt-8 p-6 bg-amber-900/20 border border-amber-500/30 rounded-lg">
                  <h3 className="text-xl font-cinzel-decorative text-amber-300 mb-4 text-center">
                    Runas Reveladas
                  </h3>
                  
                  {result.runes && (
                    <div className="mb-6">
                      <h4 className="text-lg text-amber-300 mb-3">Runas Lançadas:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {result.runes.map((rune: string, index: number) => (
                          <div key={index} className="bg-black/40 p-4 rounded-lg border border-amber-500/20 text-center">
                            <div className="text-amber-400 font-cinzel-decorative text-2xl mb-2">{rune}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20">
                    <h4 className="text-lg text-amber-300 mb-3 font-cinzel-decorative">Significado:</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.meaning}
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