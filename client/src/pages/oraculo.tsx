import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
      interpretation: "As cartas revelam um momento de despertar espiritual profundo. O Portador da Chama indica que você está pronto para receber conhecimento superior. A Serpente da Sabedoria sussurra segredos ancestrais em seus ouvidos, enquanto O Trono do Abismo mostra seu potencial para governar sua própria realidade. Aceite as sombras como parte de sua luz interior."
    },
    {
      cards: ["A Chave de Salomão", "O Espelho da Alma", "O Guardião dos Mistérios"],
      interpretation: "Os arcanos indicam que segredos há muito escondidos estão prestes a ser revelados. A Chave de Salomão abre portas para dimensões ocultas de conhecimento. O Espelho da Alma reflete sua verdadeira natureza divina, enquanto O Guardião dos Mistérios oferece proteção em sua jornada de autodescoberta."
    }
  ],
  espelho_negro: [
    {
      reflection: "Nas profundezas sombrias do espelho, vejo uma figura envolta em chamas púrpuras. Suas mãos seguram uma antiga chave dourada, símbolo de conhecimento oculto. Ao seu redor, serpentes de luz dançam em espirais, representando a sabedoria que se desenrola. O espelho sussurra: 'Você é tanto o buscador quanto o segredo buscado.'"
    },
    {
      reflection: "O espelho revela uma biblioteca infinita onde livros voam como corvos negros. No centro, uma mesa de pedra com um grimório aberto cujas páginas brilham com runas de fogo. Uma voz ecoa: 'O conhecimento que você busca já reside dentro de você. Abra o livro do seu próprio ser e leia os mistérios gravados em sua alma.'"
    }
  ],
  runas_abissais: [
    {
      runes: ["ᛗ (Mannaz)", "ᚦ (Thurisaz)", "ᛟ (Othala)"],
      meaning: "As runas falam de transformação pessoal profunda. Mannaz representa sua natureza humana se elevando à divindade. Thurisaz traz a força necessária para quebrar velhos padrões, enquanto Othala indica herança espiritual e conexão com linhagens ancestrais de poder. O caminho da iniciação se abre diante de você."
    },
    {
      runes: ["ᚱ (Raidho)", "ᛁ (Isa)", "ᛇ (Eihwaz)"],
      meaning: "A jornada mística está indicada. Raidho simboliza a viagem interior que você deve empreender. Isa representa o período de quietude necessário para a reflexão profunda, enquanto Eihwaz, a árvore do mundo, conecta você aos reinos superiores e inferiores. Equilibre contemplação com ação."
    }
  ],
  divinacao_fogo: [
    {
      flames: "As chamas dançam em três espirais ascendentes, formando o símbolo do tridente. No centro, uma salamandra de fogo emerge, carregando em sua boca uma gema vermelha brilhante. As labaredas sussurram: 'Pelo fogo você será purificado, pelo fogo você será transformado, pelo fogo você encontrará sua verdadeira essência.' A gema representa o conhecimento interior que aguarda ser descoberto."
    },
    {
      flames: "O fogo se eleva em forma de uma serpente que se morde a própria cauda - o Ouroboros eterno. Dentro do círculo flamejante, visões se formam: uma biblioteca antiga, um mestre encapuzado, e você mesmo em uma versão mais poderosa. As chamas revelam: 'O ciclo de aprendizado nunca termina. Cada fim é um novo começo, cada resposta gera novas perguntas.'"
    }
  ],
  voz_abissal: [
    {
      voice: "Eu sou a voz que ecoa desde os primórdios da criação, onde luz e sombra se encontraram pela primeira vez. Sua pergunta ressoa através dos véus da existência. Saiba que o poder que você busca não está em forças externas, mas na reconciliação dos opostos dentro de você. Como Lúcifer trouxe a luz do conhecimento, você deve trazer à luz suas próprias verdades ocultas."
    },
    {
      voice: "Das profundezas do Abismo, onde residem os segredos primordiais, eu falo. Vejo em você a chama da curiosidade que queima eternamente - essa é sua maior virtude e seu maior desafio. O caminho que busca não é encontrado nos mapas dos outros, mas deve ser forjado pelos seus próprios passos. Confie no fogo interior que nunca se extingue."
    }
  ]
};

export default function Oraculo() {
  const [selectedOracle, setSelectedOracle] = useState("");
  const [question, setQuestion] = useState("");
  const [reading, setReading] = useState<any>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  const handleConsultation = async () => {
    if (!selectedOracle || !question) return;
    
    setIsConsulting(true);
    
    // Simulate oracle consultation
    setTimeout(() => {
      const randomReading = sampleReadings[Math.floor(Math.random() * sampleReadings.length)];
      setReading(randomReading);
      setIsConsulting(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-b from-purple-950/20 to-black">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center">
                <Eye className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Oráculo Místico
            </h1>
            <p className="text-xl text-gray-300 leading-relaxed">
              Consulte as forças ancestrais e receba orientação para sua jornada
            </p>
          </div>
        </section>

        {/* Oracle Selection */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-purple-400">
              Escolha seu Oráculo
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {oracleTypes.map((oracle) => (
                <Card 
                  key={oracle.id}
                  className={`cursor-pointer transition-all duration-300 ${
                    selectedOracle === oracle.id 
                      ? 'bg-gradient-to-b from-purple-950/60 to-black border-purple-500 ring-2 ring-purple-500' 
                      : 'bg-purple-950/20 border-purple-800/30 hover:border-purple-600/50'
                  }`}
                  onClick={() => setSelectedOracle(oracle.id)}
                >
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${oracle.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <oracle.icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-white">{oracle.name}</CardTitle>
                    <CardDescription className="text-gray-300">
                      {oracle.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            {/* Consultation Form */}
            {selectedOracle && (
              <Card className="max-w-2xl mx-auto bg-gradient-to-b from-purple-950/40 to-black border-purple-800/50">
                <CardHeader className="text-center">
                  <CardTitle className="text-purple-400 text-2xl">Faça sua Pergunta</CardTitle>
                  <CardDescription className="text-gray-300">
                    Concentre-se em sua questão e permita que as energias fluam
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="question" className="text-white">Sua Pergunta</Label>
                    <Input
                      id="question"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Digite sua pergunta para o oráculo..."
                      className="bg-black/50 border-purple-800/50 text-white placeholder-gray-400"
                    />
                  </div>
                  
                  <Button
                    onClick={handleConsultation}
                    disabled={!question || isConsulting}
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
                  >
                    {isConsulting ? (
                      <div className="flex items-center space-x-2">
                        <Flame className="w-4 h-4 animate-pulse" />
                        <span>Consultando o Oráculo...</span>
                      </div>
                    ) : (
                      "Consultar Oráculo"
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Reading Results */}
            {reading && (
              <Card className="max-w-4xl mx-auto mt-12 bg-gradient-to-b from-purple-950/60 to-black border-purple-500">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-purple-400 text-2xl">Revelação do Oráculo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-white mb-2">Sua Pergunta:</h3>
                    <p className="text-gray-300 italic">"{question}"</p>
                  </div>
                  
                  <div className="border-t border-purple-800/50 pt-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">Mensagem do Oráculo:</h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {reading.answer}
                    </p>
                  </div>
                  
                  <div className="border-t border-purple-800/50 pt-6">
                    <h3 className="text-lg font-semibold text-purple-400 mb-4">Cartas Reveladas:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {reading.cards.map((card: string, index: number) => (
                        <div key={index} className="bg-black/50 p-4 rounded-lg border border-purple-800/30 text-center">
                          <p className="text-white font-medium">{card}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="text-center pt-4">
                    <Button
                      onClick={() => {
                        setReading(null);
                        setQuestion("");
                      }}
                      variant="outline"
                      className="border-purple-600 text-purple-400 hover:bg-purple-950/50"
                    >
                      Nova Consulta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}