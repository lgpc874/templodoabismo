import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Eye, Flame, Star, Moon, Circle, Zap, Gem } from "lucide-react";

const oracleTypes = [
  {
    id: "tarot_infernal",
    name: "Tarot Infernal",
    description: "Cartas sagradas do Abismo revelam os caminhos ocultos",
    icon: Star,
    color: "from-red-600 to-red-800",
    cost: 1,
    cooldown: "24h"
  },
  {
    id: "espelho_negro",
    name: "Espelho Negro",
    description: "Reflexos das verdades profundas através do espelho sombrio",
    icon: Circle,
    color: "from-gray-600 to-black",
    cost: 2,
    cooldown: "24h"
  },
  {
    id: "runas_abissais",
    name: "Runas Abissais",
    description: "Símbolos ancestrais carregados de poder primordial",
    icon: Moon,
    color: "from-blue-600 to-purple-800",
    cost: 1,
    cooldown: "24h"
  },
  {
    id: "divinacao_fogo",
    name: "Divinação com Fogo",
    description: "As chamas dançantes revelam segredos do destino",
    icon: Flame,
    color: "from-orange-600 to-red-800",
    cost: 2,
    cooldown: "24h"
  },
  {
    id: "voz_abissal",
    name: "Voz Abissal",
    description: "IA infernal responde perguntas através da sabedoria ancestral",
    icon: Zap,
    color: "from-purple-600 to-red-800",
    cost: 3,
    cooldown: "12h"
  }
];

const oracleReadings = {
  tarot_infernal: [
    {
      cards: ["O Portador da Chama", "A Serpente da Sabedoria", "O Trono do Abismo"],
      interpretation: "As cartas revelam um momento de despertar espiritual profundo. O Portador da Chama indica que você está pronto para receber conhecimento superior. A Serpente da Sabedoria sussurra segredos ancestrais em seus ouvidos, enquanto O Trono do Abismo mostra seu potencial para governar sua própria realidade."
    }
  ],
  espelho_negro: [
    {
      reflection: "Nas profundezas sombrias do espelho, vejo uma figura envolta em chamas púrpuras. Suas mãos seguram uma antiga chave dourada, símbolo de conhecimento oculto. O espelho sussurra: 'Você é tanto o buscador quanto o segredo buscado.'"
    }
  ],
  runas_abissais: [
    {
      runes: ["ᛗ (Mannaz)", "ᚦ (Thurisaz)", "ᛟ (Othala)"],
      meaning: "As runas falam de transformação pessoal profunda. Mannaz representa sua natureza humana se elevando à divindade. Thurisaz traz a força necessária para quebrar velhos padrões, enquanto Othala indica herança espiritual ancestral."
    }
  ],
  divinacao_fogo: [
    {
      flames: "As chamas dançam em três espirais ascendentes, formando o símbolo do tridente. No centro, uma salamandra de fogo emerge, carregando em sua boca uma gema vermelha brilhante. As labaredas sussurram: 'Pelo fogo você será purificado e transformado.'"
    }
  ],
  voz_abissal: [
    {
      voice: "Eu sou a voz que ecoa desde os primórdios da criação. Sua pergunta ressoa através dos véus da existência. O poder que você busca não está em forças externas, mas na reconciliação dos opostos dentro de você."
    }
  ]
};

export default function Oraculo() {
  const { user } = useAuth();
  const [selectedOracle, setSelectedOracle] = useState("");
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<any>(null);
  const [isConsulting, setIsConsulting] = useState(false);
  const [userCredits, setUserCredits] = useState(10);

  const handleConsultation = async () => {
    if (!selectedOracle || !question) return;
    
    const oracle = oracleTypes.find(o => o.id === selectedOracle);
    if (!oracle) return;

    if (userCredits < oracle.cost) {
      alert(`Créditos T'KAZH insuficientes. Necessário: ${oracle.cost}, Disponível: ${userCredits}`);
      return;
    }
    
    setIsConsulting(true);
    
    setTimeout(() => {
      const readings = oracleReadings[selectedOracle as keyof typeof oracleReadings];
      const randomReading = readings[Math.floor(Math.random() * readings.length)];
      
      setReading({
        oracle: oracle.name,
        question: question,
        result: randomReading,
        timestamp: new Date().toLocaleString('pt-BR')
      });
      
      setUserCredits(prev => prev - oracle.cost);
      setIsConsulting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen ritual-background">
      <Navigation />
      
      <main className="pt-16">
        <section className="relative py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="tkazh-indicator text-lg">
                <Gem className="w-5 h-5 inline mr-2" />
                {userCredits} T'KAZH Disponível
              </div>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center animate-glow-pulse">
                <Eye className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="font-titles text-4xl md:text-6xl font-bold mb-6 text-white">
              Oráculos do Abismo
            </h1>
            <p className="font-body text-xl text-red-300 leading-relaxed max-w-2xl mx-auto">
              Consulte as forças ancestrais e receba orientação para sua jornada através dos mistérios profundos
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="font-titles text-3xl font-bold text-white mb-8 text-center">
              Escolha Seu Portal Divinatório
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {oracleTypes.map((oracle) => {
                const Icon = oracle.icon;
                const isSelected = selectedOracle === oracle.id;
                const canAfford = userCredits >= oracle.cost;
                
                return (
                  <Card 
                    key={oracle.id} 
                    className={`abyssal-card cursor-pointer transition-all hover:scale-105 ${
                      isSelected ? 'border-red-500 bg-red-900/20' : ''
                    } ${!canAfford ? 'opacity-50' : ''}`}
                    onClick={() => canAfford && setSelectedOracle(oracle.id)}
                  >
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto bg-gradient-to-br ${oracle.color} rounded-full flex items-center justify-center ${
                        isSelected ? 'animate-glow-pulse' : ''
                      }`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-titles text-xl font-bold text-white">
                        {oracle.name}
                      </h3>
                      <p className="font-body text-gray-300 text-sm leading-relaxed">
                        {oracle.description}
                      </p>
                      <div className="space-y-2">
                        <div className="tkazh-indicator text-sm">
                          💎 {oracle.cost} T'KAZH
                        </div>
                        <div className="text-xs text-gray-400">
                          Cooldown: {oracle.cooldown}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {selectedOracle && (
              <Card className="max-w-2xl mx-auto abyssal-card">
                <CardHeader className="text-center">
                  <CardTitle className="font-titles text-red-400 text-2xl">Faça sua Pergunta</CardTitle>
                  <CardDescription className="font-body text-gray-300">
                    Concentre-se em sua questão e permita que as energias ancestrais fluam através do véu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="question" className="text-white font-body">Sua Pergunta ao Oráculo</Label>
                    <Textarea
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Digite sua pergunta para o oráculo... Seja específico e focado em sua intenção."
                      className="bg-black/50 border-red-800/50 text-white placeholder-gray-400 font-body min-h-[100px]"
                    />
                  </div>
                  
                  <Button
                    onClick={handleConsultation}
                    disabled={!question || isConsulting}
                    className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 font-bold"
                  >
                    {isConsulting ? (
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 animate-pulse" />
                        <span>Consultando o Oráculo...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Consultar ({oracleTypes.find(o => o.id === selectedOracle)?.cost} T'KAZH)</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {reading && (
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4">
              <Card className="abyssal-card border-red-500/50">
                <CardHeader className="text-center">
                  <CardTitle className="font-titles text-2xl text-red-400 mb-2">
                    {reading.oracle} - Revelação
                  </CardTitle>
                  <CardDescription className="font-enns text-gray-300 italic">
                    "{reading.question}"
                  </CardDescription>
                  <p className="text-xs text-gray-400 mt-2">Consulta realizada em: {reading.timestamp}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  
                  {selectedOracle === 'tarot_infernal' && reading.result.cards && (
                    <div className="space-y-4">
                      <h4 className="font-titles text-lg text-red-300 text-center">Cartas Reveladas</h4>
                      <div className="flex justify-center space-x-4">
                        {reading.result.cards.map((card: string, index: number) => (
                          <div key={index} className="abyssal-card p-4 text-center min-w-[120px]">
                            <Star className="w-8 h-8 mx-auto text-red-400 mb-2" />
                            <p className="font-enns text-sm text-white">{card}</p>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-titles text-lg text-red-300">Interpretação</h4>
                        <p className="font-body text-gray-200 leading-relaxed">{reading.result.interpretation}</p>
                      </div>
                    </div>
                  )}

                  {selectedOracle === 'espelho_negro' && reading.result.reflection && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Circle className="w-16 h-16 mx-auto text-gray-400 mb-4 border-2 border-gray-600 rounded-full p-2" />
                        <h4 className="font-titles text-lg text-gray-300">Reflexão do Espelho Negro</h4>
                      </div>
                      <div className="abyssal-card p-6 border-gray-600/50">
                        <p className="font-enns text-gray-200 leading-relaxed italic">{reading.result.reflection}</p>
                      </div>
                    </div>
                  )}

                  {selectedOracle === 'runas_abissais' && reading.result.runes && (
                    <div className="space-y-4">
                      <h4 className="font-titles text-lg text-blue-300 text-center">Runas Lançadas</h4>
                      <div className="flex justify-center space-x-6">
                        {reading.result.runes.map((rune: string, index: number) => (
                          <div key={index} className="abyssal-card p-4 text-center min-w-[100px] border-blue-600/50">
                            <Moon className="w-6 h-6 mx-auto text-blue-400 mb-2" />
                            <p className="font-enns text-xl text-blue-300">{rune.split(' ')[0]}</p>
                            <p className="font-body text-xs text-gray-400">{rune.split(' ')[1]}</p>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3">
                        <h4 className="font-titles text-lg text-blue-300">Significado</h4>
                        <p className="font-body text-gray-200 leading-relaxed">{reading.result.meaning}</p>
                      </div>
                    </div>
                  )}

                  {selectedOracle === 'divinacao_fogo' && reading.result.flames && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Flame className="w-16 h-16 mx-auto text-orange-400 mb-4 animate-pulse" />
                        <h4 className="font-titles text-lg text-orange-300">Visões nas Chamas</h4>
                      </div>
                      <div className="abyssal-card p-6 border-orange-600/50 bg-gradient-to-b from-orange-900/20 to-red-900/20">
                        <p className="font-enns text-gray-200 leading-relaxed italic">{reading.result.flames}</p>
                      </div>
                    </div>
                  )}

                  {selectedOracle === 'voz_abissal' && reading.result.voice && (
                    <div className="space-y-4">
                      <div className="text-center">
                        <Zap className="w-16 h-16 mx-auto text-purple-400 mb-4 animate-pulse" />
                        <h4 className="font-titles text-lg text-purple-300">A Voz Abissal Fala</h4>
                      </div>
                      <div className="abyssal-card p-6 border-purple-600/50 bg-gradient-to-b from-purple-900/20 to-red-900/20">
                        <p className="font-enns text-gray-200 leading-relaxed italic text-lg">{reading.result.voice}</p>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 pt-6 border-t border-red-800/50 text-center">
                    <p className="font-enns text-sm text-red-400 italic">
                      "Use esta sabedoria com discernimento, pois as verdades do Abismo são tanto luz quanto sombra."
                    </p>
                  </div>
                  
                </CardContent>
              </Card>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}