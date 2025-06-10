import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Eye, 
  Flame, 
  Sparkles, 
  Moon, 
  Crown, 
  Zap,
  History,
  BookOpen,
  MessageCircle
} from "lucide-react";
// import SiteNavigation from "../components/SiteNavigation";
import Footer from "../components/footer";
import { useAuth } from "@/contexts/AuthContext";
import { useOracleConsultations, useCreateOracleConsultation } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";

type OracleType = "tarot" | "mirror" | "runes" | "fire" | "abyssal";

interface OracleResult {
  type: string;
  question: string;
  result: any;
  created_at: string;
}

export default function OraculoSupabase() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  
  const [selectedOracle, setSelectedOracle] = useState<OracleType>("tarot");
  const [question, setQuestion] = useState("");
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  // Fetch oracle history using Supabase
  const { data: consultations = [] } = useOracleConsultations(user?.id || "");
  
  // Create oracle consultation using Supabase
  const createConsultation = useCreateOracleConsultation();

  const oracleTypes = [
    {
      id: "tarot" as OracleType,
      name: "Tarot das Sombras",
      description: "Cartas ancestrais revelam os caminhos ocultos",
      icon: Crown,
      color: "from-purple-600 to-purple-800",
      level: 1
    },
    {
      id: "mirror" as OracleType,
      name: "Espelho Negro",
      description: "Reflexões da alma nas trevas do inconsciente",
      icon: Eye,
      color: "from-gray-600 to-gray-800",
      level: 2
    },
    {
      id: "runes" as OracleType,
      name: "Runas Primordiais",
      description: "Símbolos ancestrais dos antigos mistérios",
      icon: Sparkles,
      color: "from-blue-600 to-blue-800",
      level: 2
    },
    {
      id: "fire" as OracleType,
      name: "Chamas Oraculares",
      description: "O fogo sagrado revela verdades ardentes",
      icon: Flame,
      color: "from-red-600 to-red-800",
      level: 3
    },
    {
      id: "abyssal" as OracleType,
      name: "Voz do Abismo",
      description: "Comunicação direta com as entidades ancestrais",
      icon: Moon,
      color: "from-black to-red-900",
      level: 4
    }
  ];

  const canAccessOracle = (level: number) => {
    return !user?.initiation_level || user.initiation_level >= level;
  };

  const handleConsultation = async () => {
    if (!question.trim()) {
      toast({
        title: "Pergunta necessária",
        description: "Digite sua pergunta para o oráculo",
        variant: "destructive",
      });
      return;
    }

    const oracle = oracleTypes.find(o => o.id === selectedOracle);
    if (!oracle) {
      toast({
        title: "Erro no oráculo",
        description: "Tipo de oráculo não encontrado",
        variant: "destructive",
      });
      return;
    }

    setIsConsulting(true);
    
    try {
      // Generate oracle result based on type
      let result;
      switch (selectedOracle) {
        case "tarot":
          result = {
            cards: ["A Morte", "O Diabo", "A Torre"],
            interpretation: "As cartas revelam uma transformação profunda se aproximando. O Diabo sugere que você deve enfrentar suas sombras internas, enquanto A Morte indica o fim de um ciclo e A Torre anuncia mudanças súbitas que liberarão você de estruturas limitantes."
          };
          break;
        case "mirror":
          result = {
            reflection: "No espelho negro, vejo uma alma em busca de sua verdadeira essência. As sombras dançam ao redor de uma luz interior que luta para emergir. Sua pergunta ecoa nas profundezas do inconsciente, revelando medos que precisam ser enfrentados para alcançar a iluminação."
          };
          break;
        case "runes":
          result = {
            runes: ["ᚦ Thurisaz", "ᚨ Ansuz", "ᚱ Raidho"],
            meaning: "Thurisaz adverte sobre desafios que fortalecerão seu espírito. Ansuz traz mensagens divinas e sabedoria ancestral. Raidho indica uma jornada espiritual que transformará sua percepção da realidade."
          };
          break;
        case "fire":
          result = {
            flames: "As chamas dançam em espirais ascendentes, revelando que sua energia interior está se intensificando. O fogo sagrado mostra um caminho de purificação através das provações. As labaredas sussurram segredos de transformação alquímica."
          };
          break;
        case "abyssal":
          result = {
            voice: "Do abismo profundo emerge uma voz ancestral... 'Filho das trevas, sua pergunta ressoa através dos véus dimensionais. O caminho que buscas está gravado nas estrelas invertidas. Aceite o chamado da sombra e encontrará a luz que procura nas profundezas de sua própria essência.'"
          };
          break;
      }

      // Save consultation to Supabase if user is authenticated
      if (isAuthenticated && user) {
        try {
          await createConsultation.mutateAsync({
            user_id: user.id,
            type: selectedOracle,
            question: question.trim(),
            result
          });
        } catch (error) {
          console.log('Could not save consultation to history:', error);
        }
      }

      setCurrentResult(result);
      toast({
        title: "Consulta realizada",
        description: "O oráculo respondeu à sua pergunta",
      });
      
    } catch (error) {
      console.error("Erro na consulta:", error);
      toast({
        title: "Erro na consulta",
        description: "Tente novamente em alguns momentos",
        variant: "destructive",
      });
    } finally {
      setIsConsulting(false);
    }
  };

  const renderOracleResult = () => {
    if (!currentResult) return null;

    switch (selectedOracle) {
      case "tarot":
        return (
          <Card className="bg-black/60 border-purple-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-purple-400 font-cinzel-decorative">
                Cartas Reveladas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {currentResult.cards.map((card: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-purple-400 text-purple-300">
                    {card}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-300 font-crimson">{currentResult.interpretation}</p>
            </CardContent>
          </Card>
        );
      
      case "mirror":
        return (
          <Card className="bg-black/60 border-gray-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gray-400 font-cinzel-decorative">
                Reflexão do Espelho
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 font-crimson italic">{currentResult.reflection}</p>
            </CardContent>
          </Card>
        );

      case "runes":
        return (
          <Card className="bg-black/60 border-blue-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-blue-400 font-cinzel-decorative">
                Runas Manifestadas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {currentResult.runes.map((rune: string, index: number) => (
                  <Badge key={index} variant="outline" className="border-blue-400 text-blue-300">
                    {rune}
                  </Badge>
                ))}
              </div>
              <p className="text-gray-300 font-crimson">{currentResult.meaning}</p>
            </CardContent>
          </Card>
        );

      case "fire":
        return (
          <Card className="bg-black/60 border-red-500/30 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400 font-cinzel-decorative">
                Visão das Chamas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 font-crimson">{currentResult.flames}</p>
            </CardContent>
          </Card>
        );

      case "abyssal":
        return (
          <Card className="bg-black/80 border-red-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-red-400 font-cinzel-decorative">
                Mensagem do Abismo
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 font-crimson italic text-center">{currentResult.voice}</p>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">

      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-gold mb-4">
            Oraculum Tenebrae
          </h1>
          <p className="text-xl text-gray-300 font-crimson max-w-2xl mx-auto">
            Consulte os oráculos ancestrais e desvende os mistérios do seu destino
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Oracle Selection */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold font-cinzel-decorative">
                  Escolha seu Oráculo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {oracleTypes.map((oracle) => {
                  const Icon = oracle.icon;
                  const canAccess = canAccessOracle(oracle.level);
                  
                  return (
                    <button
                      key={oracle.id}
                      onClick={() => canAccess && setSelectedOracle(oracle.id)}
                      disabled={!canAccess}
                      className={`w-full p-3 rounded-lg border transition-all text-left ${
                        selectedOracle === oracle.id
                          ? 'border-gold/50 bg-gold/10'
                          : canAccess
                          ? 'border-gray-600 hover:border-gold/30 bg-black/20'
                          : 'border-gray-800 bg-gray-900/50 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${canAccess ? 'text-gold' : 'text-gray-600'}`} />
                        <div className="flex-1">
                          <div className={`font-cinzel-decorative ${canAccess ? 'text-gold' : 'text-gray-500'}`}>
                            {oracle.name}
                          </div>
                          <div className={`text-xs ${canAccess ? 'text-gray-300' : 'text-gray-600'}`}>
                            {oracle.description}
                          </div>
                          {!canAccess && (
                            <div className="text-xs text-red-400 mt-1">
                              Requer nível {oracle.level}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Oracle History */}
            {isAuthenticated && consultations.length > 0 && (
              <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Consultas Recentes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48">
                    <div className="space-y-2">
                      {consultations.slice(0, 5).map((consultation: any, index: number) => (
                        <div key={index} className="p-2 bg-black/20 rounded border border-gray-700">
                          <div className="text-xs text-gold font-cinzel-decorative">
                            {consultation.type.charAt(0).toUpperCase() + consultation.type.slice(1)}
                          </div>
                          <div className="text-sm text-gray-300 font-crimson truncate">
                            {consultation.question}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(consultation.created_at).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Consultation Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Input */}
            <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Sua Pergunta
                </CardTitle>
                <CardDescription className="text-gray-300 font-crimson">
                  Formule sua pergunta com clareza e intenção. O oráculo responderá conforme sua sinceridade.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Digite sua pergunta para o oráculo..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="bg-black/20 border-gold/20 text-gold placeholder:text-gray-500 min-h-24"
                  maxLength={500}
                />
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    {question.length}/500 caracteres
                  </span>
                  <Button
                    onClick={handleConsultation}
                    disabled={isConsulting || !question.trim() || !isAuthenticated}
                    className="bg-gradient-to-r from-gold/80 to-orange-600/80 hover:from-gold hover:to-orange-600 text-black font-cinzel-regular"
                  >
                    {isConsulting ? (
                      <>
                        <Zap className="w-4 h-4 mr-2 animate-spin" />
                        Consultando...
                      </>
                    ) : (
                      <>
                        <Eye className="w-4 h-4 mr-2" />
                        Consultar Oráculo
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Oracle Result */}
            {currentResult && (
              <div className="space-y-4">
                <h3 className="text-2xl font-cinzel-decorative text-gold">Revelação Oracle</h3>
                {renderOracleResult()}
              </div>
            )}

            {/* Instructions */}
            <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Como Consultar
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300 font-crimson space-y-2">
                <p>• Concentre-se em sua pergunta antes de consultar</p>
                <p>• Seja específico e sincero em sua intenção</p>
                <p>• Reflita sobre a resposta antes de fazer nova consulta</p>
                <p>• Oráculos de nível superior requerem iniciação adequada</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}