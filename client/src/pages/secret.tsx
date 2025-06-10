import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Eye, 
  EyeSlash, 
  Lock, 
  Key, 
  Shield, 
  Scroll, 
  Crown, 
  Flame,
  BookOpen,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Secret() {
  const [accessCode, setAccessCode] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const { toast } = useToast();

  const secretSections = [
    {
      id: 1,
      title: "Rituais Avançados de Invocação",
      level: "Mestre",
      category: "Prática",
      description: "Técnicas avançadas para invocação de entidades e manipulação de energias primordiais",
      content: "Conteúdo restrito aos iniciados de alto grau",
      requiredLevel: 5
    },
    {
      id: 2,
      title: "A Verdadeira História do Templo",
      level: "Hierofante",
      category: "História",
      description: "Os registros ocultos da fundação e desenvolvimento do Templo do Abismo",
      content: "Arquivos históricos classificados",
      requiredLevel: 4
    },
    {
      id: 3,
      title: "Símbolos de Poder Ancestral",
      level: "Adepto",
      category: "Símbolos",
      description: "Símbolos e sigilos de poder utilizados pelos mestres ancestrais",
      content: "Grimório de símbolos de alta magia",
      requiredLevel: 3
    }
  ];

  const handleAccessAttempt = () => {
    if (accessCode === "ABYSSUM" || accessCode === "TENEBRAE") {
      setIsUnlocked(true);
      toast({
        title: "Acesso concedido",
        description: "Bem-vindo aos Arcana Secreta",
      });
    } else {
      toast({
        title: "Acesso negado",
        description: "Código de acesso inválido",
        variant: "destructive",
      });
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
            <div className="text-amber-400 text-6xl mb-4">🔒</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              ARCANA SECRETA
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-300 mb-6 floating-title-slow">
              Sanctum dos Mistérios Ocultos
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Aqui residem os <strong className="text-amber-400">conhecimentos proibidos</strong> e os 
              <strong className="text-red-400"> segredos ancestrais</strong> reservados aos iniciados de alta graduação.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Occultissima Sapientia"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                A mais oculta sabedoria
              </p>
            </div>
          </div>
        </div>

        {!isUnlocked ? (
          /* Access Control */
          <div className="floating-card max-w-md w-full bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl">
            <Card className="border-0 bg-transparent shadow-none">
              <CardHeader className="text-center">
                <CardTitle className="text-red-400 text-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 mr-3" />
                  Área Restrita
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Este conteúdo é reservado apenas para iniciados autorizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="access-code" className="text-amber-300">Código de Acesso</Label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 h-5 w-5 text-amber-400" />
                    <Input
                      id="access-code"
                      type="password"
                      placeholder="••••••••"
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                      className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500 font-mono tracking-wider"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAccessAttempt}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold"
                >
                  <Lock className="w-4 h-4 mr-2" />
                  Desbloquear Arcana
                </Button>
                <div className="text-center text-xs text-gray-500 mt-4">
                  Apenas iniciados de grau elevado podem acessar este conteúdo
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Secret Content */
          <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <Tabs defaultValue="rituals" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-amber-600/30">
                <TabsTrigger 
                  value="rituals"
                  className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
                >
                  Rituais
                </TabsTrigger>
                <TabsTrigger 
                  value="history"
                  className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
                >
                  História
                </TabsTrigger>
                <TabsTrigger 
                  value="symbols"
                  className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
                >
                  Símbolos
                </TabsTrigger>
              </TabsList>

              <div className="p-6">
                <div className="mb-6 text-center">
                  <Badge className="bg-green-600 text-white">
                    <Shield className="w-4 h-4 mr-2" />
                    Acesso Autorizado
                  </Badge>
                </div>

                {secretSections.map((section) => (
                  <TabsContent key={section.id} value={section.category.toLowerCase()} className="space-y-6">
                    <Card className="bg-black/20 border-amber-500/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-amber-400 flex items-center">
                            {section.category === "Prática" && <Flame className="w-6 h-6 mr-3" />}
                            {section.category === "História" && <Scroll className="w-6 h-6 mr-3" />}
                            {section.category === "Símbolos" && <Star className="w-6 h-6 mr-3" />}
                            {section.title}
                          </CardTitle>
                          <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                            {section.level}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-300">
                          {section.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="bg-black/40 p-6 rounded-lg border border-amber-500/20">
                            <h4 className="text-lg font-semibold text-amber-300 mb-4">
                              Conteúdo Classificado
                            </h4>
                            
                            {section.category === "Prática" && (
                              <div className="space-y-4">
                                <h5 className="text-amber-400">Ritual de Invocação Primordial</h5>
                                <p className="text-gray-300 leading-relaxed">
                                  Este ritual permite o contato direto com as forças primordiais do abismo. 
                                  Deve ser realizado apenas em condições específicas e com extrema preparação.
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h6 className="text-amber-300 mb-2">Materiais Necessários:</h6>
                                    <ul className="text-gray-400 text-sm space-y-1">
                                      <li>• Círculo de sal negro consagrado</li>
                                      <li>• Velas de cera de abelha preta</li>
                                      <li>• Incenso de mirra e olíbano</li>
                                      <li>• Selo pessoal do praticante</li>
                                    </ul>
                                  </div>
                                  <div>
                                    <h6 className="text-amber-300 mb-2">Condições Rituais:</h6>
                                    <ul className="text-gray-400 text-sm space-y-1">
                                      <li>• Lua nova ou eclipse lunar</li>
                                      <li>• Jejum de 24 horas</li>
                                      <li>• Isolamento completo</li>
                                      <li>• Estado mental purificado</li>
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}

                            {section.category === "História" && (
                              <div className="space-y-4">
                                <h5 className="text-amber-400">Origens do Templo do Abismo</h5>
                                <p className="text-gray-300 leading-relaxed">
                                  O Templo do Abismo foi fundado em 1847 por um círculo de mestres ocultistas 
                                  que buscavam preservar os conhecimentos ancestrais ameaçados pela era moderna.
                                </p>
                                <div className="bg-black/60 p-4 rounded border-l-4 border-amber-500">
                                  <h6 className="text-amber-300 mb-2">Fundadores Originais:</h6>
                                  <ul className="text-gray-400 space-y-2">
                                    <li>• <strong>Mestre Baphomet</strong> - Guardião dos Mistérios Primordiais</li>
                                    <li>• <strong>Lady Lilith</strong> - Sacerdotisa da Lua Negra</li>
                                    <li>• <strong>Conde Astaroth</strong> - Keeper dos Grimórios Antigos</li>
                                  </ul>
                                </div>
                              </div>
                            )}

                            {section.category === "Símbolos" && (
                              <div className="space-y-4">
                                <h5 className="text-amber-400">Sigilos de Poder Ancestral</h5>
                                <p className="text-gray-300 leading-relaxed">
                                  Estes símbolos carregam poder acumulado através de séculos de uso ritual 
                                  e devem ser manuseados com extremo respeito e conhecimento.
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center p-4 bg-black/60 rounded border border-amber-500/30">
                                    <div className="text-4xl text-amber-400 mb-2">𖤍</div>
                                    <p className="text-xs text-gray-400">Selo da Transformação</p>
                                  </div>
                                  <div className="text-center p-4 bg-black/60 rounded border border-red-500/30">
                                    <div className="text-4xl text-red-400 mb-2">⸸</div>
                                    <p className="text-xs text-gray-400">Cruz do Abismo</p>
                                  </div>
                                  <div className="text-center p-4 bg-black/60 rounded border border-purple-500/30">
                                    <div className="text-4xl text-purple-400 mb-2">☿</div>
                                    <p className="text-xs text-gray-400">Mercúrio Filosófico</p>
                                  </div>
                                  <div className="text-center p-4 bg-black/60 rounded border border-green-500/30">
                                    <div className="text-4xl text-green-400 mb-2">⚹</div>
                                    <p className="text-xs text-gray-400">Estrela da Gnose</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex justify-center">
                            <Button className="bg-amber-600 hover:bg-amber-700 text-black">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Baixar Documento Completo
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </div>
            </Tabs>
          </div>
        )}

        {/* Warning */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-red-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-4">⚠️ ☠️ ⚠️</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "O conhecimento sem sabedoria é a mais perigosa das armas"
            </p>
            <p className="text-red-400 font-semibold">
              — Aviso dos Guardiões
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Todo conhecimento aqui contido deve ser usado com responsabilidade e discernimento
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}