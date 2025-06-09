import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Shield, 
  Lock,
  Eye,
  Skull,
  AlertTriangle,
  Crown,
  Zap,
  BookOpen,
  Star,
  Flame
} from "lucide-react";

export default function LiberProhibitus() {
  const { user } = useAuth();
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const prohibitedTexts = [
    {
      id: "necronomicon-fragment",
      title: "Fragmento do Necronomicon",
      author: "Abdul Alhazred (Fragmento)",
      dangerLevel: "Extremo",
      requiredLevel: 7,
      description: "Fragmentos autênticos do livro proibido que revela os nomes dos Antigos",
      warning: "Pode causar insanidade permanente em mentes não preparadas",
      content: "███████ ████ ██ ████████ ████ ███████",
      price_brl: 5000 // R$ 50.00
    },
    {
      id: "qliphothic-invocations", 
      title: "Invocações Qliphóticas Supremas",
      author: "Magus Tenebrarum",
      dangerLevel: "Alto",
      requiredLevel: 6,
      description: "Rituais para contato direto com as Qliphoth mais perigosas",
      warning: "Risco de possessão ou fragmentação da alma",
      content: "█████ ███████ ████ ██████ ███",
      price_brl: 3500 // R$ 35.00
    },
    {
      id: "blood-pacts",
      title: "Pactos de Sangue Eternos",
      author: "Vampyr Antiquus",
      dangerLevel: "Alto",
      requiredLevel: 6,
      description: "Contratos irreversíveis com entidades dimensionais",
      warning: "Consequências permanentes e hereditárias",
      content: "██████ ████ ███████ ████",
      price_brl: 4000 // R$ 40.00
    },
    {
      id: "soul-extraction",
      title: "Técnicas de Extração da Alma",
      author: "Necromante Supremo",
      dangerLevel: "Extremo",
      requiredLevel: 7,
      description: "Métodos para separar e manipular a essência vital",
      warning: "Uso incorreto pode resultar em morte espiritual",
      content: "████████ ██ ███████ ████ ██",
      price_brl: 6000 // R$ 60.00
    },
    {
      id: "dimensional-gates",
      title: "Portais Dimensionais Instáveis",
      author: "Mago do Caos",
      dangerLevel: "Crítico",
      requiredLevel: 7,
      description: "Abertura de passagens para dimensões hostis",
      warning: "Pode permitir invasões de entidades malévolas",
      content: "███ ████████ ███ ██████",
      price_brl: 7500 // R$ 75.00
    }
  ];

  const getDangerColor = (level: string) => {
    switch (level) {
      case "Extremo": return "text-red-500";
      case "Crítico": return "text-purple-500";
      case "Alto": return "text-orange-500";
      default: return "text-yellow-500";
    }
  };

  const getDangerIcon = (level: string) => {
    switch (level) {
      case "Extremo": return Skull;
      case "Crítico": return AlertTriangle;
      case "Alto": return Flame;
      default: return Eye;
    }
  };

  const canAccess = user && user.initiation_level >= 6;
  const canAccessDocument = (requiredLevel: number) => {
    return user && user.initiation_level >= requiredLevel;
  };

  const accessDocument = (doc: any) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!canAccessDocument(doc.requiredLevel)) {
      alert(`Este documento requer nível ${doc.requiredLevel} de iniciação. Seu nível atual: ${user.initiation_level}`);
      return;
    }

    // Payment would be handled through PayPal integration
    // For now, show payment required message
    alert(`Este documento custa R$ ${(doc.price_brl / 100).toFixed(2)}. Pagamento direto será implementado.`);
    return;

    // Show final warning
    const confirmed = confirm(
      `AVISO FINAL: Você está prestes a acessar "${doc.title}". ${doc.warning}. Tem certeza absoluta?`
    );
    
    if (confirmed) {
      setSelectedDocument(doc.id);
      console.log('Accessing prohibited document:', doc.title);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-titles text-red-500 mb-4 flame-text-clean">
            LIBER PROHIBITUS
          </h1>
          <p className="text-xl text-gray-200 font-serif">
            Conhecimentos Restritos aos Mais Preparados
          </p>
        </div>

        {/* Warning Banner */}
        <Card className="bg-red-950/20 border-red-500/50 max-w-4xl mx-auto mb-12">
          <CardContent className="py-6">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500 mr-3" />
              <h2 className="text-2xl font-bold text-red-500">AVISO CRÍTICO</h2>
            </div>
            <div className="text-center space-y-2 text-gray-200">
              <p className="font-semibold">
                Os textos contidos no Liber Prohibitus são EXTREMAMENTE PERIGOSOS
              </p>
              <p className="text-sm">
                • Podem causar danos psicológicos permanentes<br/>
                • Consequências espirituais irreversíveis<br/>
                • Risco de possessão ou fragmentação da alma<br/>
                • Acesso restrito apenas a Iniciados de Nível 6+
              </p>
              <p className="text-red-400 font-bold text-lg mt-4">
                PROSSIGA SOB SUA PRÓPRIA RESPONSABILIDADE
              </p>
            </div>
          </CardContent>
        </Card>

        {!user ? (
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardHeader className="text-center">
              <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-titles text-red-500">Acesso Negado</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 mb-6">
                O Liber Prohibitus requer autenticação no templo para verificar seu nível de iniciação.
              </p>
              <Button 
                className="bg-red-600 hover:bg-red-700 text-white font-bold"
                onClick={() => window.location.href = '/login'}
              >
                Entrar no Templo
              </Button>
            </CardContent>
          </Card>
        ) : !canAccess ? (
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardHeader className="text-center">
              <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-titles text-red-500">Nível Insuficiente</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 mb-4">
                O Liber Prohibitus requer nível 6 de iniciação ou superior.
              </p>
              <p className="text-red-400 mb-6">
                Seu nível atual: {user.initiation_level}
              </p>
              <div className="space-y-3">
                <Button 
                  variant="outline"
                  className="w-full border-yellow-600 text-yellow-600"
                  onClick={() => window.location.href = '/courses'}
                >
                  Avançar na Iniciação
                </Button>
                <p className="text-xs text-gray-400">
                  Recomendamos fortemente alcançar o nível máximo antes de tentar acessar estes textos
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Access Level Display */}
            <Card className="abyssal-card-transparent max-w-2xl mx-auto mb-12">
              <CardContent className="text-center py-6">
                <Crown className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-titles text-yellow-600 mb-2">
                  Acesso Autorizado
                </h3>
                <p className="text-gray-300 mb-4">
                  Nível de Iniciação: {user.initiation_level} / 7
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-400">
                      {prohibitedTexts.filter(t => canAccessDocument(t.requiredLevel)).length}
                    </div>
                    <div className="text-gray-400">Textos Acessíveis</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Prohibited Texts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {prohibitedTexts.map((text) => {
                const DangerIcon = getDangerIcon(text.dangerLevel);
                const canAccessThis = canAccessDocument(text.requiredLevel);
                
                return (
                  <Card key={text.id} className="bg-red-950/10 border-red-800/30 h-full">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <Badge 
                          variant="outline" 
                          className={`border-red-500/50 ${getDangerColor(text.dangerLevel)}`}
                        >
                          <DangerIcon className="w-3 h-3 mr-1" />
                          {text.dangerLevel}
                        </Badge>
                        <Badge 
                          variant={canAccessThis ? "default" : "secondary"}
                          className={canAccessThis ? "bg-green-600" : "bg-red-600"}
                        >
                          Nível {text.requiredLevel}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-xl font-titles text-red-400 mb-2">
                        {text.title}
                      </CardTitle>
                      
                      <CardDescription className="text-gray-300">
                        Autor: {text.author}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-200 text-sm leading-relaxed">
                          {text.description}
                        </p>
                        
                        <div className="bg-red-950/20 border border-red-800/30 rounded-lg p-3">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="w-4 h-4 text-red-400 mr-2" />
                            <span className="text-red-400 font-semibold text-sm">Aviso:</span>
                          </div>
                          <p className="text-red-300 text-xs">
                            {text.warning}
                          </p>
                        </div>
                        
                        {selectedDocument === text.id ? (
                          <div className="bg-black/50 border border-yellow-600/30 rounded-lg p-4">
                            <h4 className="text-yellow-600 font-semibold mb-2">Conteúdo Revelado:</h4>
                            <div className="text-gray-200 font-mono text-sm">
                              {text.content}
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                              Conteúdo parcialmente censurado por segurança
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between pt-4 border-t border-red-800/20">
                            <div className="text-xl font-bold text-red-400">
                              R$ {(text.price_brl / 100).toFixed(2)}
                            </div>
                            
                            {!canAccessThis ? (
                              <Button disabled className="opacity-50 cursor-not-allowed">
                                <Lock className="w-4 h-4 mr-2" />
                                Nível {text.requiredLevel} Requerido
                              </Button>
                            ) : (
                              <Button 
                                className="bg-red-600 hover:bg-red-700 text-white"
                                onClick={() => accessDocument(text)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Revelar Conteúdo
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Disclaimer */}
            <Card className="bg-red-950/10 border-red-800/30 max-w-4xl mx-auto mt-16">
              <CardContent className="py-8">
                <div className="text-center space-y-4">
                  <Skull className="w-12 h-12 text-red-500 mx-auto" />
                  <h3 className="text-xl font-titles text-red-400">
                    Isenção de Responsabilidade
                  </h3>
                  <div className="text-gray-300 text-sm space-y-2 max-w-2xl mx-auto">
                    <p>
                      O Templo do Abismo não se responsabiliza por quaisquer consequências físicas, 
                      mentais, espirituais ou dimensionais resultantes do uso destes textos.
                    </p>
                    <p>
                      Ao acessar o Liber Prohibitus, você aceita total responsabilidade por suas ações 
                      e reconhece os riscos inerentes ao conhecimento proibido.
                    </p>
                    <p className="text-red-400 font-semibold">
                      "Aquele que olha muito tempo para o abismo, o abismo também olha para ele." - Nietzsche
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}