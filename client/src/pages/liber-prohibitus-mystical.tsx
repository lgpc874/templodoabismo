import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skull, Lock, Crown, Flame, Eye, Shield, Star, BookOpen } from "lucide-react";
import MysticalGate from "@/components/MysticalGate";
// import SiteNavigation from "@/components/SiteNavigation";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

interface ProhibitedText {
  id: string;
  title: string;
  description: string;
  requiredLevel: number;
  price_brl: number;
  category: string;
  dangerLevel: number;
  warnings: string[];
  preview: string;
}

function LiberProhibitusContent() {
  const { user } = useAuth();
  const [selectedText, setSelectedText] = useState<ProhibitedText | null>(null);
  const [showWarning, setShowWarning] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: userAccess = [] } = useQuery({
    queryKey: ['/api/user/liber-access'],
    enabled: !!user,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (textId: string) => {
      return await apiRequest(`/api/liber-prohibitus/${textId}/purchase`, {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/liber-access'] });
    },
  });

  const prohibitedTexts: ProhibitedText[] = [
    {
      id: "necronomicon-fragments",
      title: "Fragmentos do Necronomicon",
      description: "Páginas recuperadas do livro dos nomes mortos, contendo invocações primordiais aos Antigos.",
      requiredLevel: 6,
      price_brl: 7500, // R$ 75.00
      category: "Invocações Ctônicas",
      dangerLevel: 9,
      warnings: ["Apenas para praticantes experientes", "Requer proteções rituais avançadas", "Não praticar sozinho"],
      preview: "Ph'nglui mglw'nafh Cthulhu R'lyeh wgah'nagl fhtagn..."
    },
    {
      id: "clavicula-salomonis-negra",
      title: "Clavícula Salomonis Negra",
      description: "Versão sombria das chaves de Salomão, revelando métodos de evocação demoníaca sem proteções.",
      requiredLevel: 7,
      price_brl: 8500, // R$ 85.00
      category: "Goetia Suprema",
      dangerLevel: 10,
      warnings: ["Extremamente perigoso", "Apenas mestres experientes", "Riscos espirituais graves"],
      preview: "Conjuro-te, ó príncipe das trevas, pelo poder do nome inefável..."
    },
    {
      id: "liber-azerate",
      title: "Liber Azerate",
      description: "Grimório das correntes anti-cósmicas e filosofia draconiana mais radical.",
      requiredLevel: 5,
      price_brl: 6000, // R$ 60.00
      category: "Filosofia Draconiana",
      dangerLevel: 8,
      warnings: ["Conteúdo psicologicamente intenso", "Visão de mundo radical", "Não para iniciantes"],
      preview: "A árvore da morte ergue-se contra a ordem cósmica..."
    },
    {
      id: "codex-vampiricus",
      title: "Codex Vampiricus",
      description: "Práticas de vampirismo psíquico e manipulação energética avançada.",
      requiredLevel: 4,
      price_brl: 5000, // R$ 50.00
      category: "Vampirismo Psíquico",
      dangerLevel: 7,
      warnings: ["Práticas eticamente questionáveis", "Riscos de dependência energética", "Uso responsável apenas"],
      preview: "A sede eterna da alma que busca a essência vital alheia..."
    },
    {
      id: "ars-diaboli",
      title: "Ars Diaboli",
      description: "Arte diabólica completa incluindo pactos, possessões e inversões sagradas.",
      requiredLevel: 6,
      price_brl: 7000, // R$ 70.00
      category: "Arte Diabólica",
      dangerLevel: 9,
      warnings: ["Conteúdo blasfematório", "Riscos espirituais extremos", "Apenas para pesquisa séria"],
      preview: "Inversa est crux, inversus est mundus, diabolo gloria..."
    },
    {
      id: "manuscrito-aghori",
      title: "Manuscrito Aghori",
      description: "Práticas tântricas extremas da tradição Aghori, incluindo rituais com cadáveres.",
      requiredLevel: 5,
      price_brl: 5500, // R$ 55.00
      category: "Tantra Extremo",
      dangerLevel: 8,
      warnings: ["Práticas culturalmente sensíveis", "Métodos extremos", "Contexto tradicional necessário"],
      preview: "Shiva dança sobre os cadáveres, e nós dançamos com Shiva..."
    }
  ];

  const getUserAccessLevel = () => {
    return user?.initiation_level || 1;
  };

  const canAccessDocument = (requiredLevel: number) => {
    return getUserAccessLevel() >= requiredLevel;
  };

  const hasDocument = (textId: string) => {
    return userAccess.some((access: any) => access.text_id === textId);
  };

  const getDangerColor = (level: number) => {
    if (level >= 9) return "text-red-400 border-red-500";
    if (level >= 7) return "text-orange-400 border-orange-500";
    if (level >= 5) return "text-yellow-400 border-yellow-500";
    return "text-green-400 border-green-500";
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Invocações Ctônicas": return <Skull className="w-5 h-5" />;
      case "Goetia Suprema": return <Crown className="w-5 h-5" />;
      case "Filosofia Draconiana": return <Flame className="w-5 h-5" />;
      case "Vampirismo Psíquico": return <Eye className="w-5 h-5" />;
      case "Arte Diabólica": return <Shield className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const handlePurchase = (text: ProhibitedText) => {
    setShowWarning(text.id);
  };

  const confirmPurchase = (textId: string) => {
    purchaseMutation.mutate(textId);
    setShowWarning(null);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SiteNavigation />
      
      {/* Mystical background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-red-950/20 via-black to-purple-950/20"></div>
        <div className="mystical-particles"></div>
      </div>

      {/* Central rotating seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-5">
          <img 
            src="/seal.png" 
            alt="Selo Proibido" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-purple-500 to-black">
              LIBER PROHIBITUS
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Arquivo dos conhecimentos mais perigosos e controversos do ocultismo. 
              Textos que foram banidos, censurados ou considerados demasiadamente perigosos 
              para circulação pública. Apenas mestres comprovados podem acessar estes escritos.
            </p>
          </div>

          {/* Danger Warning */}
          <div className="glass-effect p-6 border border-red-900/50 mb-8 text-center">
            <Skull className="w-8 h-8 mx-auto mb-3 text-red-500" />
            <h3 className="text-xl font-cinzel text-red-400 mb-2">⚠️ AVISO EXTREMO ⚠️</h3>
            <p className="text-red-300 font-crimson">
              Os textos contidos nesta seção são de natureza extremamente avançada e potencialmente perigosa. 
              Destina-se exclusivamente a pesquisadores sérios e praticantes experientes. 
              O Templo do Abismo não se responsabiliza pelo uso inadequado destes conhecimentos.
            </p>
          </div>

          {/* User Status */}
          <div className="glass-effect p-6 border border-purple-900/50 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-cinzel text-purple-400 mb-2">Status do Iniciado</h3>
                <p className="text-gray-300">
                  Nível de Iniciação: {getUserAccessLevel()} / 7
                </p>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">
                  {prohibitedTexts.filter(t => canAccessDocument(t.requiredLevel)).length}
                </div>
                <div className="text-gray-400">Textos Acessíveis</div>
              </div>
            </div>
          </div>

          {/* Prohibited Texts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prohibitedTexts.map((text) => {
              const canAccess = canAccessDocument(text.requiredLevel);
              const hasAccess = hasDocument(text.id);
              const dangerColor = getDangerColor(text.dangerLevel);

              return (
                <Card key={text.id} className={`glass-effect border-red-900/30 hover:shadow-2xl transition-all duration-300 overflow-hidden ${!canAccess ? 'opacity-60' : ''}`}>
                  {/* Header */}
                  <div className="h-32 bg-gradient-to-br from-red-950 to-black relative flex items-center justify-center">
                    <div className="text-center">
                      {getCategoryIcon(text.category)}
                      <div className="text-xs text-gray-300 mt-2">
                        {text.category}
                      </div>
                    </div>
                    
                    {/* Danger Level */}
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs border ${dangerColor}`}>
                      Perigo: {text.dangerLevel}/10
                    </div>

                    {/* Required Level */}
                    <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-xs text-purple-400">
                      Nível {text.requiredLevel}
                    </div>

                    {/* Access Status */}
                    {hasAccess && (
                      <div className="absolute bottom-2 left-2 bg-green-900/70 px-2 py-1 rounded text-xs text-green-300">
                        Possuído
                      </div>
                    )}
                  </div>

                  <CardHeader>
                    <CardTitle className="font-cinzel text-red-300 text-lg">
                      {text.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {text.description}
                    </p>

                    {/* Preview */}
                    <div className="mb-4 p-3 bg-black/40 rounded border border-red-900/30">
                      <div className="text-xs text-red-400 mb-1">Prévia:</div>
                      <div className="text-xs text-gray-300 italic">
                        "{text.preview}"
                      </div>
                    </div>

                    {/* Warnings */}
                    <div className="mb-4">
                      <div className="text-xs text-red-400 mb-2">Advertências:</div>
                      <div className="space-y-1">
                        {text.warnings.map((warning, index) => (
                          <div key={index} className="text-xs text-red-300 flex items-center gap-2">
                            <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                            {warning}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Button */}
                    {!canAccess ? (
                      <Button disabled className="w-full bg-gray-700 text-gray-400 cursor-not-allowed font-cinzel">
                        <Lock className="w-4 h-4 mr-2" />
                        Nível Insuficiente
                      </Button>
                    ) : hasAccess ? (
                      <Button className="w-full bg-green-800 hover:bg-green-700 font-cinzel">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Estudar Texto
                      </Button>
                    ) : (
                      <Button
                        onClick={() => handlePurchase(text)}
                        className="w-full bg-gradient-to-r from-red-800 to-purple-800 hover:from-red-700 hover:to-purple-700 font-cinzel"
                      >
                        <Skull className="w-4 h-4 mr-2" />
                        Adquirir (R$ {(text.price_brl / 100).toFixed(2)})
                      </Button>
                    )}

                    {/* Footer Warning */}
                    <div className="mt-4 pt-3 border-t border-gray-800 text-xs text-red-500 text-center">
                      "Conhecimento perigoso exige sabedoria suprema"
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Warning Modal */}
          {showWarning && (
            <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
              <Card className="glass-effect border-red-900/50 max-w-md w-full">
                <CardHeader>
                  <CardTitle className="text-red-400 font-cinzel text-center">
                    ⚠️ CONFIRMAÇÃO NECESSÁRIA ⚠️
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center space-y-4">
                  <p className="text-gray-300">
                    Você está prestes a adquirir conhecimento classificado como extremamente perigoso. 
                    Confirma que é um praticante experiente e assume total responsabilidade?
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={() => confirmPurchase(showWarning)}
                      disabled={purchaseMutation.isPending}
                      className="w-full bg-red-800 hover:bg-red-700 font-cinzel"
                    >
                      {purchaseMutation.isPending ? "Processando..." : "Confirmar Aquisição"}
                    </Button>
                    <Button
                      onClick={() => setShowWarning(null)}
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300 font-cinzel"
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LiberProhibitus() {
  return (
    <MysticalGate
      title="LIBER PROHIBITUS"
      description="Arquivo amaldiçoado dos conhecimentos que podem fragmentar a mente humana. Textos que sussurram loucura, grimórios que corrompem a alma e escrituras que testam os limites da sanidade mortal."
      mysticText="Apenas aqueles que dominam as trevas podem caminhar seguramente pelos abismos do conhecimento proibido"
      icon={<Skull className="w-8 h-8 text-red-400" />}
    >
      <LiberProhibitusContent />
    </MysticalGate>
  );
}