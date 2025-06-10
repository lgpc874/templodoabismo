import { useState } from "react";
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
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-8">
            <div className="text-red-500 text-6xl mb-4">💀</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-red-500 mystical-glow mb-6 floating-title">
              LIBER PROHIBITUS
            </h1>
            <div className="flex justify-center items-center space-x-8 text-red-400 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-red-300 mb-6 floating-title-slow">
              Conhecimentos Restritos aos Mais Preparados
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Textos <strong className="text-red-400">extremamente perigosos</strong> que foram banidos por 
              <strong className="text-amber-400"> eras inteiras</strong>. Acesso restrito apenas para iniciados de alto nível.
            </p>
            
            <div className="text-center">
              <div className="text-red-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-red-300">
                "Scientia Potentia Est"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Conhecimento é poder
              </p>
            </div>
          </div>
        </div>

        {/* Access Warning */}
        {!canAccess && (
          <div className="floating-card max-w-4xl w-full mb-8 bg-red-900/20 backdrop-blur-lg border border-red-500/30 rounded-xl">
            <div className="p-6 text-center">
              <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-cinzel-decorative text-red-400 mb-4">
                Acesso Restrito
              </h3>
              <p className="text-gray-300 mb-4">
                Esta seção contém conhecimentos perigosos. Você precisa atingir pelo menos o nível 6 de iniciação.
              </p>
              <p className="text-sm text-gray-500">
                Seu nível atual: {user?.initiation_level || 0}
              </p>
            </div>
          </div>
        )}

        {/* Prohibited Texts */}
        {canAccess && (
          <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-cinzel-decorative text-red-300">
                  Textos Proibidos
                </h3>
                <Badge variant="outline" className="border-red-500/30 text-red-300">
                  {prohibitedTexts.length} documentos disponíveis
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {prohibitedTexts.map((doc) => {
                  const DangerIcon = getDangerIcon(doc.dangerLevel);
                  const canAccessDoc = canAccessDocument(doc.requiredLevel);
                  
                  return (
                    <Card key={doc.id} className="bg-black/20 border-red-500/20 hover:border-red-400/40 transition-colors">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-red-400 text-lg leading-tight">
                            {doc.title}
                          </CardTitle>
                          <div className="flex items-center">
                            <DangerIcon className="w-5 h-5 mr-2" />
                            <Badge className={`${getDangerColor(doc.dangerLevel)} bg-red-900/20`}>
                              {doc.dangerLevel}
                            </Badge>
                          </div>
                        </div>
                        <CardDescription className="text-gray-300">
                          Por: {doc.author}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-300 text-sm">
                            {doc.description}
                          </p>
                          
                          <div className="bg-red-900/20 p-3 rounded border border-red-500/20">
                            <p className="text-red-300 text-sm">
                              <strong>⚠️ Aviso:</strong> {doc.warning}
                            </p>
                          </div>

                          <div className="flex items-center justify-between text-sm">
                            <div className="text-gray-400">
                              Nível requerido: {doc.requiredLevel}
                            </div>
                            <div className="text-2xl font-bold text-red-400">
                              R$ {(doc.price_brl / 100).toFixed(2)}
                            </div>
                          </div>

                          {canAccessDoc ? (
                            <Button 
                              onClick={() => accessDocument(doc)}
                              className="w-full bg-red-600 hover:bg-red-700 text-white"
                            >
                              <Lock className="w-4 h-4 mr-2" />
                              Acessar Documento
                            </Button>
                          ) : (
                            <Button 
                              disabled 
                              className="w-full bg-gray-800 text-gray-500"
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              Nível Insuficiente
                            </Button>
                          )}

                          {selectedDocument === doc.id && (
                            <div className="mt-4 p-4 bg-red-950/30 border border-red-500/20 rounded">
                              <h5 className="text-red-300 font-semibold mb-2">Conteúdo:</h5>
                              <p className="text-red-200 font-mono text-sm">
                                {doc.content}
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Final Warning */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-red-900/20 backdrop-blur-lg border border-red-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Aqueles que buscam conhecimento proibido devem estar preparados para pagar o preço com sua própria essência"
            </p>
            <p className="text-red-400 font-semibold">
              — Guardião dos Textos Sombrios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}