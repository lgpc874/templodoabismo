import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, Flame, Star, Moon, Sun } from "lucide-react";

const oracleTypes = [
  {
    id: "tarot",
    name: "Tarô Ancestral",
    description: "Consulta através das cartas sagradas",
    icon: Star,
    color: "from-purple-600 to-purple-800"
  },
  {
    id: "runes",
    name: "Runas Nórdicas",
    description: "Sabedoria dos antigos vikings",
    icon: Moon,
    color: "from-blue-600 to-blue-800"
  },
  {
    id: "pendulum",
    name: "Pêndulo Místico",
    description: "Respostas através do movimento sagrado",
    icon: Sun,
    color: "from-yellow-600 to-yellow-800"
  }
];

const sampleReadings = [
  {
    question: "Qual caminho devo seguir?",
    answer: "As energias indicam um momento de introspecção. O caminho da sabedoria interior se apresenta diante de você. Confie em sua intuição e busque o conhecimento nas profundezas do seu ser.",
    cards: ["O Eremita", "A Estrela", "O Sol"]
  },
  {
    question: "Como superar os obstáculos?",
    answer: "A força reside na perseverança. Como o fogo que purifica o metal, as adversidades forjam sua verdadeira natureza. Mantenha-se firme em seus propósitos.",
    cards: ["A Força", "A Torre", "O Mundo"]
  }
];

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