import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Lock, Crown, Scroll, Eye, Flame, Star } from "lucide-react";
import MysticalGate from "@/components/MysticalGate";
import Navigation from "@/components/navigation";
import { useAuth } from "@/contexts/AuthContext";

function BibliothecaContent() {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState<string | null>(null);

  const libraryCollections = [
    {
      id: "manuscritos-perdidos",
      title: "Manuscritos Perdidos",
      description: "Textos ancestrais recuperados das ruínas de templos esquecidos, contendo rituais e invocações de civilizações perdidas.",
      icon: <Scroll className="w-8 h-8" />,
      accessLevel: 3,
      documents: 47,
      bgClass: "from-amber-900 to-black",
      borderClass: "border-amber-500/50",
      textClass: "text-amber-300"
    },
    {
      id: "tratados-alquimicos",
      title: "Tratados Alquímicos",
      description: "Compêndios sobre a grande obra hermética, transmutação espiritual e os segredos da pedra filosofal interior.",
      icon: <Star className="w-8 h-8" />,
      accessLevel: 4,
      documents: 23,
      bgClass: "from-purple-900 to-black",
      borderClass: "border-purple-500/50",
      textClass: "text-purple-300"
    },
    {
      id: "codices-sombrios",
      title: "Códices Sombrios",
      description: "Escrituras das tradições ctônicas e abissais, revelando os mistérios das correntes da mão esquerda.",
      icon: <Eye className="w-8 h-8" />,
      accessLevel: 5,
      documents: 31,
      bgClass: "from-red-900 to-black",
      borderClass: "border-red-500/50",
      textClass: "text-red-300"
    },
    {
      id: "arcana-suprema",
      title: "Arcana Suprema",
      description: "Os textos mais secretos do templo, contendo as chaves finais para a gnose abissal e mestria espiritual.",
      icon: <Crown className="w-8 h-8" />,
      accessLevel: 7,
      documents: 12,
      bgClass: "from-indigo-900 to-black",
      borderClass: "border-indigo-500/50",
      textClass: "text-indigo-300"
    }
  ];

  const getUserAccessLevel = () => {
    // Simulate user progression based on completed courses
    return user?.initiation_level || 1;
  };

  const canAccessCollection = (collection: any) => {
    return getUserAccessLevel() >= collection.accessLevel;
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <Navigation />
      
      {/* Mystical background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-indigo-950/20 via-black to-amber-950/20"></div>
        <div className="mystical-particles"></div>
      </div>

      {/* Central rotating seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-5">
          <img 
            src="/seal.png" 
            alt="Selo da Bibliotheca" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-amber-400">
              BIBLIOTHECA SECRETA
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Santuário dos conhecimentos mais secretos do templo, onde repousam as escrituras 
              proibidas dos antigos mestres. Apenas iniciados que demonstraram dedicação aos 
              mistérios podem adentrar estas câmaras sagradas.
            </p>
          </div>

          {/* Access Status */}
          <div className="glass-effect p-6 border border-indigo-900/50 mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <Eye className="w-6 h-6 text-indigo-400 mr-3" />
              <span className="text-xl font-cinzel text-indigo-400">
                Nível de Iniciação: {getUserAccessLevel()} / 7
              </span>
            </div>
            <p className="text-gray-300">
              {getUserAccessLevel() >= 7 
                ? "Você alcançou a mestria completa e pode acessar todos os arquivos secretos."
                : "Continue sua jornada iniciática para desbloquear coleções mais profundas."
              }
            </p>
          </div>

          {/* Collections Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {libraryCollections.map((collection) => {
              const hasAccess = canAccessCollection(collection);

              return (
                <Card key={collection.id} className={`glass-effect ${collection.borderClass} hover:shadow-2xl transition-all duration-300 overflow-hidden ${hasAccess ? '' : 'opacity-60'}`}>
                  {/* Collection Header */}
                  <div className={`h-32 bg-gradient-to-br ${collection.bgClass} relative flex items-center justify-center`}>
                    <div className="text-center">
                      {collection.icon}
                      <div className="text-xs text-gray-300 mt-2">
                        Nível {collection.accessLevel} Requerido
                      </div>
                    </div>
                    
                    {/* Document Count */}
                    <div className="absolute top-3 right-3 bg-black/70 px-3 py-1 rounded text-sm text-amber-400">
                      {collection.documents} textos
                    </div>

                    {/* Access Status */}
                    <div className="absolute top-3 left-3">
                      {hasAccess ? (
                        <div className="bg-green-900/70 px-2 py-1 rounded text-xs text-green-300">
                          Acessível
                        </div>
                      ) : (
                        <div className="bg-red-900/70 px-2 py-1 rounded text-xs text-red-300 flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          Selado
                        </div>
                      )}
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className={`font-cinzel ${collection.textClass} text-xl`}>
                      {collection.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {collection.description}
                    </p>

                    {/* Sample Texts Preview */}
                    <div className="mb-6">
                      <div className="text-xs text-gray-500 mb-2">Exemplos de Textos:</div>
                      <div className="text-xs text-gray-400 space-y-1">
                        {collection.id === "manuscritos-perdidos" && (
                          <>
                            <div>• O Livro dos Sussurros Primordiais</div>
                            <div>• Rituais da Antiga Babilônia</div>
                            <div>• Códex dos Anjos Caídos</div>
                          </>
                        )}
                        {collection.id === "tratados-alquimicos" && (
                          <>
                            <div>• A Transmutação da Alma</div>
                            <div>• Segredos do Mercúrio Filosofal</div>
                            <div>• O Casamento Químico Interior</div>
                          </>
                        )}
                        {collection.id === "codices-sombrios" && (
                          <>
                            <div>• O Grimório das Trevas Sagradas</div>
                            <div>• Invocações aos Senhores do Abismo</div>
                            <div>• A Gnose Luciferiana Completa</div>
                          </>
                        )}
                        {collection.id === "arcana-suprema" && (
                          <>
                            <div>• As Chaves Finais da Iniciação</div>
                            <div>• O Último Mistério Revelado</div>
                            <div>• A União com o Absoluto</div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {hasAccess ? (
                      <Button 
                        onClick={() => setSelectedSection(collection.id)}
                        className={`w-full bg-gradient-to-r ${collection.bgClass} text-white hover:opacity-80 font-cinzel`}
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        Explorar Coleção
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <Button disabled className="w-full bg-gray-700 text-gray-400 cursor-not-allowed font-cinzel">
                          <Lock className="w-4 h-4 mr-2" />
                          Acesso Restrito
                        </Button>
                        <p className="text-xs text-gray-500 text-center">
                          Complete mais cursos da Academia para desbloquear
                        </p>
                      </div>
                    )}

                    {/* Mystical Quote */}
                    <div className="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500 text-center italic">
                      "O conhecimento supremo é revelado apenas aos dignos"
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Special Unlock Notice */}
          {getUserAccessLevel() >= 3 && (
            <div className="mt-8 glass-effect p-6 border border-amber-900/50 text-center">
              <Crown className="w-8 h-8 mx-auto mb-3 text-amber-500" />
              <h3 className="text-xl font-cinzel text-amber-400 mb-2">Acesso Conquistado</h3>
              <p className="text-gray-300">
                Sua dedicação aos estudos místicos desbloqueou acesso às coleções secretas. 
                Continue sua jornada para alcançar os mistérios supremos.
              </p>
            </div>
          )}

          {/* Warning Notice */}
          <div className="mt-8 glass-effect p-6 border border-red-900/50 text-center">
            <Flame className="w-6 h-6 mx-auto mb-3 text-red-500" />
            <p className="text-red-300 font-cinzel text-sm">
              "Advertência: Os textos aqui contidos são de natureza avançada e destinam-se 
              apenas a praticantes experientes. O conhecimento mal aplicado pode ser perigoso."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Bibliotheca() {
  return (
    <MysticalGate
      title="BIBLIOTHECA SECRETA"
      description="Câmara sagrada dos conhecimentos mais profundos do templo, onde repousam manuscritos proibidos, tratados alquímicos e escrituras perdidas. Apenas iniciados que demonstraram verdadeira dedicação aos mistérios podem adentrar estes arquivos secretos."
      mysticText="Que apenas os dignos contemplem os segredos dos antigos mestres"
      icon={<BookOpen className="w-8 h-8 text-indigo-400" />}
    >
      <BibliothecaContent />
    </MysticalGate>
  );
}