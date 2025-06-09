import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Scroll, 
  Star, 
  Clock, 
  BookOpen,
  Lock,
  CheckCircle,
  Gem,
  Eye
} from "lucide-react";

export default function Grimoires() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const grimoires = [
    {
      id: 1,
      title: "Liber Umbra",
      description: "O Livro das Sombras Primordiais - Conhecimentos fundamentais da via sinistra",
      category: "fundamental",
      chapters: 12,
      pages: 240,
      difficulty: "Iniciante",
      price: 100,
      rating: 4.9,
      author: "Antiquus Magister",
      preview: "Exploração das bases filosóficas e práticas do caminho luciferiano",
      requiredLevel: 1
    },
    {
      id: 2,
      title: "Codex Ignis",
      description: "Códice do Fogo Sagrado - Rituais e invocações flamejantes",
      category: "ritual",
      chapters: 8,
      pages: 180,
      difficulty: "Intermediário",
      price: 150,
      rating: 4.8,
      author: "Ignis Magus",
      preview: "Técnicas avançadas de trabalho com o elemento fogo e energias ígneas",
      requiredLevel: 3
    },
    {
      id: 3,
      title: "Serpentis Gnosis",
      description: "A Gnose da Serpente - Sabedoria ofidia e kundalini luciferiana",
      category: "gnosis",
      chapters: 15,
      pages: 320,
      difficulty: "Avançado",
      price: 200,
      rating: 5.0,
      author: "Ophidian Hierophant",
      preview: "Despertar da serpente interior e alquimia espiritual avançada",
      requiredLevel: 4
    },
    {
      id: 4,
      title: "Qliphothic Emanations",
      description: "Emanações Qliphóticas - Navegação pelas esferas sombrias",
      category: "advanced",
      chapters: 22,
      pages: 450,
      difficulty: "Especialista",
      price: 300,
      rating: 4.9,
      author: "Avatar Qliphothicus",
      preview: "Jornada profunda através da Árvore da Morte e suas emanações",
      requiredLevel: 6
    },
    {
      id: 5,
      title: "Draconian Apotheosis",
      description: "Apoteose Draconiana - O caminho da auto-deificação final",
      category: "mastery",
      chapters: 30,
      pages: 600,
      difficulty: "Magus",
      price: 500,
      rating: 5.0,
      author: "Draconis Rex",
      preview: "Realização máxima do potencial divino através da corrente draconiana",
      requiredLevel: 7
    }
  ];

  const categories = [
    { value: "all", label: "Todos os Grimórios" },
    { value: "fundamental", label: "Fundamentos" },
    { value: "ritual", label: "Rituais" },
    { value: "gnosis", label: "Gnose" },
    { value: "advanced", label: "Avançados" },
    { value: "mastery", label: "Maestria" }
  ];

  const filteredGrimoires = selectedCategory === "all" 
    ? grimoires 
    : grimoires.filter(grimoire => grimoire.category === selectedCategory);

  const canAccessGrimoire = (requiredLevel: number) => {
    if (!user) return false;
    return user.initiation_level >= requiredLevel;
  };

  const purchaseGrimoire = (grimoire: any) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!canAccessGrimoire(grimoire.requiredLevel)) {
      alert(`Você precisa estar no nível ${grimoire.requiredLevel} de iniciação para acessar este grimório.`);
      return;
    }

    if (user.tkazh_credits < grimoire.price) {
      window.location.href = '/comprar-tkazh';
      return;
    }

    console.log('Purchasing grimoire:', grimoire.title);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-titles text-yellow-600 mb-4 flame-text-clean">
            Grimórios Sagrados
          </h1>
          <p className="text-xl text-gray-200 font-serif">
            Textos Ancestrais e Códices de Sabedoria Oculta
          </p>
        </div>

        {/* Category Filter */}
        <Card className="abyssal-card-transparent max-w-4xl mx-auto mb-12">
          <CardContent className="py-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  className={`${
                    selectedCategory === category.value
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-black'
                      : 'border-yellow-600/50 text-yellow-600 hover:bg-yellow-600/10'
                  }`}
                  onClick={() => setSelectedCategory(category.value)}
                >
                  {category.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Grimoires Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredGrimoires.map((grimoire) => (
            <Card key={grimoire.id} className="abyssal-card-transparent h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge 
                    variant={canAccessGrimoire(grimoire.requiredLevel) ? "default" : "secondary"}
                    className={`${
                      canAccessGrimoire(grimoire.requiredLevel) 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    Nível {grimoire.requiredLevel} - {grimoire.difficulty}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-500 font-semibold">{grimoire.rating}</span>
                  </div>
                </div>
                
                <CardTitle className="text-xl font-titles text-yellow-600 mb-2 flex items-center">
                  <Scroll className="w-6 h-6 mr-2 text-yellow-600" />
                  {grimoire.title}
                </CardTitle>
                
                <CardDescription className="text-gray-300">
                  {grimoire.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {grimoire.preview}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-300">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                      {grimoire.chapters} capítulos
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Eye className="w-4 h-4 mr-2 text-green-400" />
                      {grimoire.pages} páginas
                    </div>
                    <div className="flex items-center text-gray-300 col-span-2">
                      <Scroll className="w-4 h-4 mr-2 text-purple-400" />
                      Autor: {grimoire.author}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-yellow-600/20">
                    <div className="text-2xl font-bold text-yellow-500">
                      {grimoire.price} T'KAZH
                    </div>
                    
                    {!user ? (
                      <Button 
                        className="bg-yellow-600 hover:bg-yellow-700 text-black"
                        onClick={() => window.location.href = '/login'}
                      >
                        Entrar para Acessar
                      </Button>
                    ) : !canAccessGrimoire(grimoire.requiredLevel) ? (
                      <Button disabled className="opacity-50 cursor-not-allowed">
                        <Lock className="w-4 h-4 mr-2" />
                        Nível {grimoire.requiredLevel} Requerido
                      </Button>
                    ) : user.tkazh_credits < grimoire.price ? (
                      <Button 
                        variant="outline"
                        className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black"
                        onClick={() => window.location.href = '/comprar-tkazh'}
                      >
                        Comprar T'KAZH
                      </Button>
                    ) : (
                      <Button 
                        className="bg-yellow-600 hover:bg-yellow-700 text-black"
                        onClick={() => purchaseGrimoire(grimoire)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Adquirir
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGrimoires.length === 0 && (
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Scroll className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-titles text-yellow-600 mb-2">
                Nenhum grimório encontrado
              </h3>
              <p className="text-gray-400">
                Não há grimórios disponíveis na categoria selecionada.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Featured Collection */}
        <Card className="abyssal-card-transparent max-w-4xl mx-auto mt-16">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-titles text-yellow-600">
              Coleção Completa dos Grimórios
            </CardTitle>
            <CardDescription className="text-gray-300">
              Acesso ilimitado a todos os textos sagrados
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="space-y-4">
              <div className="text-4xl font-bold text-yellow-500 mb-4">
                1,200 T'KAZH
              </div>
              <div className="text-lg text-green-400 mb-4">
                Economia de 50% comparado à compra individual
              </div>
              <ul className="text-gray-300 space-y-2 mb-6">
                <li>• Acesso a todos os 5 grimórios</li>
                <li>• Atualizações futuras incluídas</li>
                <li>• Suporte prioritário</li>
                <li>• Certificado de Maestria</li>
              </ul>
              {user && user.initiation_level >= 7 ? (
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-black font-bold"
                >
                  <Gem className="w-5 h-5 mr-2" />
                  Adquirir Coleção Completa
                </Button>
              ) : (
                <Button disabled className="opacity-50">
                  <Lock className="w-5 h-5 mr-2" />
                  Requer Nível 7 (Magus)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}