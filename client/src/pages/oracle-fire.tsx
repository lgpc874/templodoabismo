import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Flame, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function OracleFire() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleConsult = async () => {
    if (!question.trim()) {
      toast({
        title: "Pergunta necessária",
        description: "Por favor, faça uma pergunta antes de consultar as Chamas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiRequest("/api/oracle/consult", {
        method: "POST",
        body: JSON.stringify({
          type: "fire",
          question: question.trim(),
        }),
      });

      setResult(response.result);
      toast({
        title: "Consulta realizada",
        description: "As chamas revelaram suas visões sagradas.",
      });
    } catch (error: any) {
      console.error("Erro na consulta:", error);
      toast({
        title: "Erro na consulta",
        description: error.message || "Não foi possível consultar as Chamas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-black/8 backdrop-blur-sm">
      <div className="mystical-particles fixed inset-0 z-0" />
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

          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-300 mb-4 floating-title">
            Chamas Reveladoras
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-crimson">
            Vislumbre visões nas labaredas do fogo sagrado que dança entre os mundos
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="floating-card bg-black/30 backdrop-blur-lg border-amber-500/20">
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-red-600 to-rose-600 rounded-full flex items-center justify-center">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-cinzel-decorative text-amber-300">
                Contemplação das Chamas
              </CardTitle>
              <CardDescription className="text-gray-400">
                Fixe seu olhar nas chamas e permita que as visões se manifestem
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div>
                <label className="block text-amber-300 font-medium mb-3">
                  Sua Pergunta às Chamas
                </label>
                <Textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Que visões você busca no fogo sagrado..."
                  className="bg-black/40 border-amber-500/30 text-gray-300 min-h-[120px]"
                  disabled={isLoading}
                />
              </div>

              <Button
                onClick={handleConsult}
                disabled={isLoading || !question.trim()}
                className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-medium py-3"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Contemplando as Chamas...
                  </div>
                ) : (
                  "Consultar Chamas Reveladoras"
                )}
              </Button>

              {result && (
                <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-lg">
                  <h3 className="text-xl font-cinzel-decorative text-amber-300 mb-4 text-center">
                    Visões do Fogo
                  </h3>
                  
                  <div className="bg-black/30 p-4 rounded-lg border border-amber-500/20">
                    <h4 className="text-lg text-amber-300 mb-3 font-cinzel-decorative">Visão Revelada:</h4>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                      {result.flames}
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