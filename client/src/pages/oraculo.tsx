import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye, Flame, Zap, Skull, Circle } from "lucide-react";
import Navigation from "../components/navigation";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

interface OracleReading {
  type: string;
  question: string;
  result: any;
  cost_brl: number;
  payment_id: string;
}

export default function Oraculo() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedOracle, setSelectedOracle] = useState<string | null>(null);
  const [question, setQuestion] = useState("");
  const [currentReading, setCurrentReading] = useState<OracleReading | null>(null);

  const { data: recentReadings = [] } = useQuery({
    queryKey: ["/api/oracle/history"],
    enabled: isAuthenticated,
  });

  const consultMutation = useMutation({
    mutationFn: async ({ type, question, paymentId }: { type: string; question: string; paymentId: string }) => {
      return await apiRequest("/api/oracle/consult", "POST", { type, question, paymentId });
    },
    onSuccess: (data) => {
      setCurrentReading(data);
      setQuestion("");
      toast({
        title: "Consulta Realizada",
        description: "Os mistérios foram revelados.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/oracle/history"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Consulta",
        description: error.message || "Não foi possível realizar a consulta.",
        variant: "destructive",
      });
    },
  });

  const oracles = [
    {
      id: "tarot",
      name: "Tarô Luciferiano",
      description: "Consulte as cartas ancestrais para revelar caminhos ocultos e verdades profundas sobre seu destino.",
      icon: Eye,
      price_brl: 700, // R$ 7.00
      color: "text-red-500",
    },
    {
      id: "mirror",
      name: "Espelho Negro",
      description: "Olhe nas profundezas do espelho abissal e veja reflexões de sua alma e futuro.",
      icon: Circle,
      price_brl: 500, // R$ 5.00
      color: "text-purple-500",
    },
    {
      id: "runes",
      name: "Runas Antigas",
      description: "As pedras ancestrais revelam mensagens dos antigos poderes e guiam sua jornada.",
      icon: Zap,
      price_brl: 500, // R$ 5.00
      color: "text-blue-500",
    },
    {
      id: "fire",
      name: "Leitura do Fogo",
      description: "As chamas dançantes mostram visões do presente e futuro através da piromancia sagrada.",
      icon: Flame,
      price_brl: 300, // R$ 3.00
      color: "text-orange-500",
    },
    {
      id: "abyssal",
      name: "Voz do Abismo",
      description: "Canalize diretamente as vozes primordiais do abismo para orientação suprema.",
      icon: Skull,
      price_brl: 1000, // R$ 10.00
      color: "text-yellow-500",
    },
  ];

  const handleConsult = () => {
    if (!selectedOracle || !question.trim()) {
      toast({
        title: "Dados Incompletos",
        description: "Selecione um oráculo e faça uma pergunta.",
        variant: "destructive",
      });
      return;
    }

    const oracle = oracles.find(o => o.id === selectedOracle);
    if (!oracle) return;

    // For now, simulate successful payment - in production, integrate with PayPal
    const mockPaymentId = "mock_" + Date.now();
    consultMutation.mutate({ type: selectedOracle, question, paymentId: mockPaymentId });
  };

  const renderReading = (reading: OracleReading) => {
    switch (reading.type) {
      case "tarot":
        return (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-red-400">Leitura do Tarô Luciferiano</h4>
            <div className="grid grid-cols-3 gap-4">
              {reading.result.cards?.map((card: string, index: number) => (
                <div key={index} className="p-4 bg-black/30 rounded-lg text-center">
                  <div className="text-lg font-semibold text-amber-400 mb-2">
                    {["Passado", "Presente", "Futuro"][index]}
                  </div>
                  <div className="text-gray-300">{card}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-red-900/20 rounded-lg">
              <h5 className="font-semibold text-red-300 mb-2">Interpretação:</h5>
              <p className="text-gray-300 leading-relaxed">{reading.result.interpretation}</p>
            </div>
          </div>
        );

      case "mirror":
        return (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-purple-400">Reflexão do Espelho Negro</h4>
            <div className="p-6 bg-purple-900/20 rounded-lg border-2 border-purple-500/30">
              <div className="text-center mb-4">
                <Circle className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                <h5 className="font-semibold text-purple-300 mb-2">O Espelho Revela:</h5>
              </div>
              <p className="text-gray-300 leading-relaxed text-center italic">
                "{reading.result.reflection}"
              </p>
            </div>
          </div>
        );

      case "runes":
        return (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-blue-400">Leitura das Runas Antigas</h4>
            <div className="flex justify-center gap-4 mb-4">
              {reading.result.runes?.map((rune: string, index: number) => (
                <div key={index} className="p-4 bg-blue-900/20 rounded-lg text-center border border-blue-500/30">
                  <div className="text-2xl font-bold text-blue-300 mb-2">{rune}</div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-blue-900/20 rounded-lg">
              <h5 className="font-semibold text-blue-300 mb-2">Significado:</h5>
              <p className="text-gray-300 leading-relaxed">{reading.result.meaning}</p>
            </div>
          </div>
        );

      case "fire":
        return (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-orange-400">Visão das Chamas</h4>
            <div className="p-6 bg-orange-900/20 rounded-lg border-2 border-orange-500/30">
              <div className="text-center mb-4">
                <Flame className="w-16 h-16 mx-auto text-orange-400 mb-4" />
                <h5 className="font-semibold text-orange-300 mb-2">As Chamas Mostram:</h5>
              </div>
              <p className="text-gray-300 leading-relaxed text-center">
                {reading.result.flames}
              </p>
            </div>
          </div>
        );

      case "abyssal":
        return (
          <div className="space-y-4">
            <h4 className="text-xl font-bold text-yellow-400">Voz do Abismo</h4>
            <div className="p-6 bg-yellow-900/20 rounded-lg border-2 border-yellow-500/30">
              <div className="text-center mb-4">
                <Skull className="w-16 h-16 mx-auto text-yellow-400 mb-4" />
                <h5 className="font-semibold text-yellow-300 mb-2">O Abismo Sussurra:</h5>
              </div>
              <p className="text-gray-300 leading-relaxed text-center italic text-lg">
                "{reading.result.voice}"
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="p-4 bg-gray-900/20 rounded-lg">
            <p className="text-gray-300">Resultado da consulta não reconhecido.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-15">
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

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">
            ORÁCULO ABISSAL
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Consulte as forças primordiais através de métodos divinatórios ancestrais. 
            Cada consulta revela verdades ocultas sobre seu caminho e destino.
          </p>
        </div>

        {/* Payment Notice */}
        {isAuthenticated && (
          <div className="floating-card max-w-md mx-auto mb-12 p-6 text-center bg-gradient-to-r from-amber-900/20 to-red-900/20">
            <h3 className="text-xl font-bold text-amber-400 mb-3">Consultas Oraculares</h3>
            <p className="text-gray-300 text-sm mb-4">
              Pagamento direto por consulta com preços justos em Real Brasileiro
            </p>
            <div className="text-xs text-gray-400">
              Valores: R$ 3,00 - R$ 10,00 por consulta
            </div>
          </div>
        )}

        {!isAuthenticated && (
          <div className="floating-card max-w-2xl mx-auto mb-12 p-8 text-center">
            <Eye className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Acesso aos Oráculos</h3>
            <p className="text-gray-300 mb-6">
              Para consultar os oráculos ancestrais e receber orientação dos mistérios profundos, 
              é necessário estar iniciado no templo.
            </p>
            <button className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors">
              Entrar no Templo
            </button>
          </div>
        )}

        {/* Oracle Selection */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {oracles.map((oracle) => {
              const IconComponent = oracle.icon;
              const isSelected = selectedOracle === oracle.id;
              
              return (
                <div
                  key={oracle.id}
                  onClick={() => setSelectedOracle(oracle.id)}
                  className={`floating-card cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? 'ring-2 ring-amber-500 bg-amber-900/20' 
                      : 'hover:bg-white/5'
                  }`}
                >
                  <div className="p-6 text-center">
                    <IconComponent className={`w-12 h-12 mx-auto mb-4 ${oracle.color}`} />
                    <h3 className="text-lg font-bold text-amber-400 mb-2">
                      {oracle.name}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {oracle.description}
                    </p>
                    <div className="text-amber-500 font-semibold">
                      R$ {(oracle.price_brl / 100).toFixed(2)}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Question Input */}
        {isAuthenticated && selectedOracle && (
          <div className="floating-card max-w-2xl mx-auto mb-12">
            <div className="p-8">
              <h3 className="text-xl font-bold text-amber-400 mb-4 text-center">
                Faça Sua Pergunta aos Mistérios
              </h3>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Digite sua pergunta para o oráculo... Seja específico e abra seu coração aos mistérios."
                className="w-full h-32 bg-black/20 border border-amber-500/30 rounded-lg p-4 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 resize-none"
              />
              <button
                onClick={handleConsult}
                disabled={consultMutation.isPending || !question.trim()}
                className="w-full mt-4 bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {consultMutation.isPending ? "Consultando os Mistérios..." : "Realizar Consulta"}
              </button>
            </div>
          </div>
        )}

        {/* Current Reading Result */}
        {currentReading && (
          <div className="floating-card max-w-4xl mx-auto mb-12">
            <div className="p-8">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-amber-400 mb-2">Revelação dos Mistérios</h3>
                <p className="text-gray-400">Pergunta: "{currentReading.question}"</p>
              </div>
              {renderReading(currentReading)}
            </div>
          </div>
        )}

        {/* Recent Readings History */}
        {isAuthenticated && recentReadings.length > 0 && (
          <div className="floating-card max-w-4xl mx-auto">
            <div className="p-8">
              <h3 className="text-xl font-bold text-amber-400 mb-6 text-center">
                Consultas Recentes
              </h3>
              <div className="space-y-4">
                {recentReadings.slice(0, 5).map((reading: any, index: number) => (
                  <div key={index} className="p-4 bg-black/20 rounded-lg border border-amber-500/20">
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-amber-300 font-semibold">
                        {oracles.find(o => o.id === reading.oracle_type)?.name || reading.oracle_type}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(reading.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-gray-300 text-sm mb-2">
                      Pergunta: "{reading.question}"
                    </div>
                    <div className="text-xs text-gray-500">
                      Custo: R$ {(reading.cost_brl / 100).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}