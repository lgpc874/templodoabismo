import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Shield, 
  Lock,
  Eye,
  Key,
  Skull,
  Crown,
  Zap,
  AlertTriangle
} from "lucide-react";

export default function Secret() {
  const { user } = useAuth();
  const [accessCode, setAccessCode] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const secretCodes = [
    "ABYSSOS",
    "LUCIFER",
    "QLIPHOTH", 
    "BAPHOMET",
    "LEVIATHAN"
  ];

  const secretContent = [
    {
      id: 1,
      title: "Ritual Primordial de Despertar",
      level: "Altamente Restrito",
      description: "Técnicas avançadas para despertar a consciência luciferiana latente",
      content: "Esta seção contém instruções detalhadas para rituais de transformação profunda...",
      danger: "Extremo"
    },
    {
      id: 2,
      title: "Invocações dos Anciões",
      level: "Somente Iniciados",
      description: "Chamados diretos às forças primordiais do cosmos",
      content: "Os nomes secretos e as palavras de poder para contato com entidades antigas...",
      danger: "Alto"
    },
    {
      id: 3,
      title: "Alquimia da Alma Sombria",
      level: "Mestre Exclusivo",
      description: "Transformação da essência através dos caminhos sombrios",
      content: "Processos alquímicos para a transmutação da consciência humana...",
      danger: "Moderado"
    }
  ];

  useEffect(() => {
    if (attempts >= 3) {
      setIsLocked(true);
      setTimeout(() => {
        setIsLocked(false);
        setAttempts(0);
      }, 30000); // 30 seconds lockout
    }
  }, [attempts]);

  const handleAccessAttempt = () => {
    if (isLocked) {
      alert("Muitas tentativas incorretas. Aguarde 30 segundos.");
      return;
    }

    if (secretCodes.includes(accessCode.toUpperCase())) {
      setHasAccess(true);
      setAttempts(0);
    } else {
      setAttempts(prev => prev + 1);
      setAccessCode("");
      alert(`Código incorreto. Tentativas restantes: ${3 - attempts - 1}`);
    }
  };

  const getDangerColor = (level: string) => {
    switch (level) {
      case "Extremo": return "text-red-500 border-red-500/30 bg-red-900/20";
      case "Alto": return "text-orange-500 border-orange-500/30 bg-orange-900/20";
      case "Moderado": return "text-yellow-500 border-yellow-500/30 bg-yellow-900/20";
      default: return "text-gray-500 border-gray-500/30 bg-gray-900/20";
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
            <div className="text-red-500 text-6xl mb-4">🔐</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-red-500 mystical-glow mb-6 floating-title">
              ARCANA SECRETA
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
              Conhecimentos Ocultos dos Mestres
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Área de <strong className="text-red-400">acesso altamente restrito</strong> contendo os 
              <strong className="text-amber-400"> segredos mais profundos</strong> da tradição luciferiana.
            </p>
            
            <div className="text-center">
              <div className="text-red-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-red-300">
                "Secretum Secretorum"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                O segredo dos segredos
              </p>
            </div>
          </div>
        </div>

        {!hasAccess ? (
          /* Access Control */
          <div className="floating-card max-w-2xl w-full bg-red-900/20 backdrop-blur-lg border border-red-500/30 rounded-xl">
            <div className="p-8 text-center">
              <Shield className="w-20 h-20 text-red-500 mx-auto mb-6" />
              
              <h3 className="text-2xl font-cinzel-decorative text-red-400 mb-6">
                Código de Acesso Requerido
              </h3>
              
              <p className="text-gray-300 mb-6">
                Esta seção contém conhecimentos extremamente perigosos. 
                Apenas iniciados de alto nível possuem os códigos de acesso.
              </p>

              <div className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                  <Input
                    type="password"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Digite o código secreto..."
                    className="pl-10 bg-black/40 border-red-500/30 text-gray-300 placeholder:text-gray-500"
                    disabled={isLocked}
                    onKeyPress={(e) => e.key === 'Enter' && handleAccessAttempt()}
                  />
                </div>

                <Button
                  onClick={handleAccessAttempt}
                  disabled={isLocked || !accessCode.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLocked ? (
                    <>
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Bloqueado
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Verificar Código
                    </>
                  )}
                </Button>

                {attempts > 0 && !isLocked && (
                  <p className="text-red-400 text-sm">
                    Tentativas restantes: {3 - attempts}
                  </p>
                )}

                {isLocked && (
                  <p className="text-red-400 text-sm">
                    Acesso bloqueado por 30 segundos devido a tentativas incorretas.
                  </p>
                )}
              </div>

              <div className="mt-8 p-4 bg-red-950/30 border border-red-500/20 rounded">
                <p className="text-red-300 text-sm">
                  <strong>⚠️ Aviso:</strong> Os códigos são fornecidos apenas durante rituais específicos 
                  ou cerimônias de iniciação de alto grau.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Secret Content */
          <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-cinzel-decorative text-red-300">
                  Conteúdo Secreto Desbloqueado
                </h3>
                <Badge variant="outline" className="border-red-500/30 text-red-300">
                  {secretContent.length} documentos disponíveis
                </Badge>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {secretContent.map((item) => (
                  <Card key={item.id} className="bg-black/20 border-red-500/20 hover:border-red-400/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-red-400 text-lg leading-tight">
                          {item.title}
                        </CardTitle>
                        <div className="flex items-center">
                          <Skull className="w-5 h-5 mr-2 text-red-500" />
                          <Badge className={getDangerColor(item.danger)}>
                            {item.danger}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-gray-300">
                        {item.level}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-300 text-sm">
                          {item.description}
                        </p>
                        
                        <div className="bg-red-950/30 p-4 rounded border border-red-500/20">
                          <h5 className="text-red-300 font-semibold mb-2">Conteúdo Secreto:</h5>
                          <p className="text-red-200 text-sm leading-relaxed">
                            {item.content}
                          </p>
                        </div>

                        <Button 
                          className="w-full bg-red-600 hover:bg-red-700 text-white"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Acessar Conteúdo Completo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 p-6 bg-red-900/20 border border-red-500/20 rounded-xl">
                <div className="text-center">
                  <Crown className="w-12 h-12 text-red-400 mx-auto mb-4" />
                  <h4 className="text-xl font-cinzel-decorative text-red-300 mb-4">
                    Acesso Concedido
                  </h4>
                  <p className="text-gray-300 mb-4">
                    Você foi considerado digno de acessar estes conhecimentos sagrados. 
                    Use-os com sabedoria e responsabilidade.
                  </p>
                  <Button
                    onClick={() => setHasAccess(false)}
                    variant="outline"
                    className="border-red-500/30 text-red-300"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Bloquear Acesso
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Warning Footer */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-red-900/20 backdrop-blur-lg border border-red-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Conhecimento sem sabedoria é perigoso; sabedoria sem coragem é inútil"
            </p>
            <p className="text-red-400 font-semibold">
              — Guardião dos Segredos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}