import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Flame, Crystal, Zap, Eye, BookOpen, History, Skull, Moon, Star } from "lucide-react";
import MysticalGate from "@/components/MysticalGate";
import Navigation from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

interface OracleReading {
  id?: number;
  question: string;
  result: string;
  cost_brl: number;
  payment_id?: string;
  type: string;
  created_at?: string;
}

function OracleContent() {
  const { user } = useAuth();
  const [question, setQuestion] = useState("");
  const [oracleType, setOracleType] = useState("tarot");
  const [currentReading, setCurrentReading] = useState<OracleReading | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [isPerformingRitual, setIsPerformingRitual] = useState(false);
  const queryClient = useQueryClient();

  const consultMutation = useMutation({
    mutationFn: async (data: { question: string; type: string }) => {
      setIsPerformingRitual(true);
      await new Promise(resolve => setTimeout(resolve, 3000)); // Ritual delay
      const response = await apiRequest('/api/oracle/consult', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      setIsPerformingRitual(false);
      setCurrentReading(response);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/oracle/history'] });
      setQuestion("");
      setShowPayment(false);
    },
  });

  const { data: recentReadings } = useQuery({
    queryKey: ['/api/oracle/history'],
    enabled: !!user,
  });

  const oracleTypes = {
    tarot: {
      name: "Arcanos do Abismo",
      price: 300, // R$ 3.00
      icon: <Star className="w-6 h-6" />,
      description: "As cartas ancestrais revelam os segredos ocultos do seu destino através dos 78 arcanos sagrados.",
      ritual: "Invocação dos Espíritos Cartomantes"
    },
    mirror: {
      name: "Espelho da Alma",
      price: 500, // R$ 5.00
      icon: <Eye className="w-6 h-6" />,
      description: "O espelho negro reflete as verdades mais profundas da sua essência espiritual e sombras internas.",
      ritual: "Contemplação do Reflexo Abissal"
    },
    runes: {
      name: "Runas Primordiais",
      price: 400, // R$ 4.00
      icon: <Zap className="w-6 h-6" />,
      description: "Símbolos nórdicos ancestrais conectam-se com as forças primais para revelar caminhos ocultos.",
      ritual: "Conjuração das Pedras Sagradas"
    },
    fire: {
      name: "Chamas Oraculares",
      price: 600, // R$ 6.00
      icon: <Flame className="w-6 h-6" />,
      description: "O fogo sagrado dança revelando visões do futuro nas labaredas hipnóticas do ritual.",
      ritual: "Invocação dos Salamandros"
    },
    abyss: {
      name: "Voz do Abismo",
      price: 1000, // R$ 10.00
      icon: <Skull className="w-6 h-6" />,
      description: "A comunicação direta com as entidades abissais revela conhecimentos vedados aos mortais.",
      ritual: "Evocação das Trevas Primordiais"
    }
  };

  const handleConsultation = () => {
    if (!question.trim()) return;
    consultMutation.mutate({ question, type: oracleType });
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navigation />
      
      {/* Mystical background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-950/20 via-black to-red-950/20"></div>
        <div className="mystical-particles"></div>
      </div>

      {/* Central rotating seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
          <img 
            src="/seal.png" 
            alt="Selo Oracular" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-red-500 to-amber-400">
              ORÁCULOS ABISSAIS
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Adentre os mistérios ancestrais através de rituais divinatórios milenares. 
              Cada consulta é um portal para dimensões ocultas onde entidades primordiais 
              revelam verdades vedadas aos não-iniciados.
            </p>
          </div>

          {/* Ritual Status */}
          {isPerformingRitual && (
            <div className="glass-effect p-8 border border-purple-900/50 mb-8 text-center">
              <div className="animate-pulse">
                <Flame className="w-12 h-12 mx-auto mb-4 text-red-500 animate-bounce" />
                <h3 className="text-2xl font-cinzel text-purple-400 mb-2">Ritual em Progresso</h3>
                <p className="text-gray-300">As entidades estão sendo invocadas... Aguarde o resultado da consulta.</p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Oracle Selection */}
            <div className="space-y-6">
              <Card className="glass-effect border-purple-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-purple-400 font-cinzel">
                    <Crystal className="w-6 h-6" />
                    Escolha Seu Oráculo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup value={oracleType} onValueChange={setOracleType} className="space-y-4">
                    {Object.entries(oracleTypes).map(([key, oracle]) => (
                      <div key={key} className="glass-effect p-4 border border-gray-800/50 hover:border-purple-900/50 transition-all">
                        <div className="flex items-center space-x-3">
                          <RadioGroupItem value={key} id={key} />
                          <Label htmlFor={key} className="flex-1 cursor-pointer">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {oracle.icon}
                                <div>
                                  <div className="font-cinzel text-lg text-purple-300">{oracle.name}</div>
                                  <div className="text-sm text-gray-400">{oracle.ritual}</div>
                                </div>
                              </div>
                              <div className="text-amber-400 font-bold">
                                R$ {(oracle.price / 100).toFixed(2)}
                              </div>
                            </div>
                            <p className="text-sm text-gray-300 mt-2 ml-9">{oracle.description}</p>
                          </Label>
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </CardContent>
              </Card>

              {/* Question Input */}
              <Card className="glass-effect border-red-900/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-red-400 font-cinzel">
                    <BookOpen className="w-6 h-6" />
                    Formule Sua Pergunta Ritual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Sussurre sua pergunta aos espíritos... Seja específico e respeitoso, pois as entidades respondem apenas àqueles que demonstram verdadeiro propósito."
                    className="min-h-32 bg-black/40 border-red-900/30 text-red-100 placeholder:text-red-900/70"
                    disabled={isPerformingRitual}
                  />
                  <div className="mt-4 flex justify-between items-center">
                    <div className="text-sm text-gray-400">
                      Custo do Ritual: <span className="text-amber-400 font-bold">
                        R$ {(oracleTypes[oracleType as keyof typeof oracleTypes].price / 100).toFixed(2)}
                      </span>
                    </div>
                    <Button
                      onClick={handleConsultation}
                      disabled={!question.trim() || isPerformingRitual}
                      className="bg-gradient-to-r from-purple-800 to-red-800 hover:from-purple-700 hover:to-red-700 font-cinzel"
                    >
                      {isPerformingRitual ? (
                        <>
                          <Flame className="w-4 h-4 mr-2 animate-spin" />
                          Invocando...
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4 mr-2" />
                          Iniciar Ritual
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reading Result */}
            <div className="space-y-6">
              {currentReading && (
                <Card className="glass-effect border-amber-900/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-amber-400 font-cinzel">
                      <Star className="w-6 h-6" />
                      Revelação Oracular
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-l-4 border-amber-500 pl-4">
                        <h4 className="font-crimson text-lg text-amber-300 mb-2">Sua Pergunta:</h4>
                        <p className="text-gray-300">{currentReading.question}</p>
                      </div>
                      <div className="border-l-4 border-red-500 pl-4">
                        <h4 className="font-crimson text-lg text-red-300 mb-2">Resposta dos Espíritos:</h4>
                        <p className="text-gray-100 leading-relaxed whitespace-pre-wrap">{currentReading.result}</p>
                      </div>
                      <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-800">
                        Ritual realizado em {new Date(currentReading.created_at!).toLocaleString('pt-BR')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Recent Consultations */}
              <Card className="glass-effect border-gray-800/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-gray-400 font-cinzel">
                    <History className="w-6 h-6" />
                    Consultas Anteriores
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentReadings && recentReadings.length > 0 ? (
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {recentReadings.slice(0, 5).map((reading: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-900/30 rounded border border-gray-800/50">
                          <div className="text-sm font-cinzel text-purple-300 mb-1">
                            {oracleTypes[reading.type as keyof typeof oracleTypes]?.name || reading.type}
                          </div>
                          <div className="text-xs text-gray-400 truncate">{reading.question}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(reading.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      Suas consultas aparecerão aqui após os primeiros rituais.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Oraculo() {
  return (
    <MysticalGate
      title="ORÁCULOS ABISSAIS"
      description="Portal sagrado onde iniciados consultam entidades ancestrais através de rituais divinatórios milenares. Cinco métodos oraculares aguardam aqueles que buscam conhecimento além do véu da realidade."
      mysticText="Que os espíritos sussurrem verdades aos corajosos o suficiente para questionar o destino"
      icon={<Crystal className="w-8 h-8 text-purple-400" />}
    >
      <OracleContent />
    </MysticalGate>
  );
}