import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Link } from "wouter";

interface TarotResult {
  cards: string[];
  interpretation: string;
}

interface OracleResponse {
  type: string;
  question: string;
  result: TarotResult;
  timestamp: string;
}

export default function OracleTarot() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<OracleResponse | null>(null);
  const { toast } = useToast();

  const consultMutation = useMutation({
    mutationFn: async (data: { type: string; question: string }): Promise<OracleResponse> => {
      const response = await fetch("/api/oracle/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error('Falha na consulta');
      }
      return response.json();
    },
    onSuccess: (data: OracleResponse) => {
      setResult(data);
      toast({
        title: "Consulta Realizada",
        description: "O Tarot revelou suas respostas",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Consulta",
        description: "Não foi possível conectar com o Oracle",
        variant: "destructive",
      });
    },
  });

  const handleConsult = () => {
    if (!question.trim()) {
      toast({
        title: "Pergunta Necessária",
        description: "Formule sua pergunta antes de consultar o Tarot",
        variant: "destructive",
      });
      return;
    }

    consultMutation.mutate({
      type: "tarot",
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
            <div className="text-amber-400 text-6xl mb-4">🔮</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              TAROT LUCIFERIANO
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
              Consulta às Cartas Ancestrais
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              O <strong className="text-amber-400">Tarot Luciferiano</strong> revela as verdades ocultas através das 
              <strong className="text-red-400"> cartas ancestrais</strong>. Cada leitura conecta-te com a sabedoria primordial.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Veritas in Cartis"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                A verdade está nas cartas
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
                      <Sparkles className="w-5 h-5 mr-2" />
                      Formule Sua Pergunta
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Concentre-se na sua questão e permita que as cartas revelem as respostas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="question" className="text-gray-300">
                        Pergunta para o Tarot
                      </Label>
                      <Textarea
                        id="question"
                        placeholder="O que o futuro reserva para minha jornada espiritual?"
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
                          Consultando as Cartas...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Consultar Tarot
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Results */}
              <div className="space-y-6">
                {result ? (
                  <Card className="bg-black/40 border-amber-500/30">
                    <CardHeader>
                      <CardTitle className="text-amber-400">Revelação do Tarot</CardTitle>
                      <CardDescription className="text-gray-400">
                        As cartas escolhidas para sua consulta
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Cards Display */}
                      <div className="grid grid-cols-3 gap-4">
                        {result.result.cards.map((card, index) => (
                          <div key={index} className="text-center">
                            <div className="bg-gradient-to-b from-amber-500/20 to-red-500/20 border border-amber-500/30 rounded-lg p-4 mb-2">
                              <div className="text-2xl mb-2">🃏</div>
                              <div className="text-sm text-amber-300 font-cinzel-decorative">
                                {card}
                              </div>
                            </div>
                            <div className="text-xs text-gray-400">
                              {index === 0 ? "Passado" : index === 1 ? "Presente" : "Futuro"}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Interpretation */}
                      <div className="bg-black/20 border border-amber-500/20 rounded-lg p-6">
                        <h4 className="text-lg font-cinzel-decorative text-amber-300 mb-4">
                          Interpretação Ancestral
                        </h4>
                        <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                          {result.result.interpretation}
                        </div>
                      </div>

                      <div className="text-center text-xs text-gray-500">
                        Consulta realizada em {new Date(result.timestamp).toLocaleString('pt-BR')}
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-black/40 border-amber-500/30">
                    <CardContent className="flex flex-col items-center justify-center py-16">
                      <div className="text-6xl mb-4 opacity-50">🔮</div>
                      <p className="text-gray-400 text-center">
                        As cartas aguardam sua pergunta para revelar os mistérios do futuro
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
              "O Tarot não prediz o futuro, ele revela as forças que moldam o destino"
            </p>
            <p className="text-amber-400 font-semibold">
              — Axioma do Templo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}