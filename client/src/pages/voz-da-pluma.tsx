import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Feather, 
  Calendar, 
  Clock, 
  Heart, 
  Share2, 
  Search,
  Filter,
  BookOpen,
  Scroll,
  Star,
  Eye
} from "lucide-react";

export default function VozDaPluma() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [dailyPoem, setDailyPoem] = useState(null);

  useEffect(() => {
    loadDailyPoem();
  }, []);

  const loadDailyPoem = async () => {
    try {
      const response = await fetch('/api/daily-poem');
      if (response.ok) {
        const poem = await response.json();
        setDailyPoem(poem);
      }
    } catch (error) {
      console.error('Error loading daily poem:', error);
    }
  };

  const poems = [
    {
      id: 1,
      title: "Lamentações do Abismo",
      author: "Voz Ancestral",
      category: "mistico",
      date: "2024-06-09",
      likes: 45,
      content: `Nas profundezas onde a luz se esconde,
Ecoa o sussurro da verdade antiga,
Onde sombras dançam e o tempo se despede,
Ali encontro minha alma perdida.

O abismo me chama com voz sedutora,
Promete segredos que o mundo ignora,
Entre as chamas do conhecimento proibido,
Descubro quem realmente sou agora.`,
      preview: "Uma jornada através das profundezas da alma..."
    },
    {
      id: 2,
      title: "Serpente de Sabedoria",
      author: "Pluma Sombria",
      category: "filosofico",
      date: "2024-06-08",
      likes: 67,
      content: `A serpente antiga se ergue do solo,
Trazendo frutos do conhecimento,
Seus olhos brilham com fogo dourado,
Revelando o caminho do despertar.

Não temas a mordida da sabedoria,
Pois seu veneno é transformação,
Cada escama reflete uma verdade,
Cada movimento, uma iniciação.`,
      preview: "A sabedoria ancestral da serpente desperta..."
    },
    {
      id: 3,
      title: "Ritual da Aurora Negra",
      author: "Escriba do Crepúsculo",
      category: "ritual",
      date: "2024-06-07",
      likes: 32,
      content: `Quando a aurora negra se levanta,
E as estrelas se curvam em reverência,
Acendo as velas da invocação,
Chamando espíritos de antiga presença.

O círculo traçado com sangue e cinza,
Protege o ritual dos não iniciados,
Enquanto sussurro nomes esquecidos,
Pelos ventos do tempo carregados.`,
      preview: "Invocação dos espíritos ancestrais na aurora..."
    },
    {
      id: 4,
      title: "Espelho da Alma",
      author: "Reflexo Eterno",
      category: "introspectivo",
      date: "2024-06-06",
      likes: 58,
      content: `No espelho negro vejo minha face,
Mas não é apenas carne que contemplo,
Vejo camadas de existências passadas,
E futuros que ainda não tento.

Cada reflexo conta uma história,
De vidas vividas em outros planos,
O espelho sussurra verdades ocultas,
Revelando meus poderes arcanos.`,
      preview: "Contemplação profunda através do espelho negro..."
    },
    {
      id: 5,
      title: "Chamas do Despertar",
      author: "Ignis Poeticus",
      category: "transformacao",
      date: "2024-06-05",
      likes: 41,
      content: `As chamas dançam em minha alma,
Queimando ilusões e medos antigos,
Cada fagulha é uma revelação,
Cada brasão, conhecimentos amigos.

No fogo encontro minha essência,
Purificada pelas labaredas ardentes,
Renasço das cinzas da ignorância,
Forte entre os seres conscientes.`,
      preview: "Transformação através do fogo interior..."
    }
  ];

  const categories = [
    { value: "all", label: "Todos os Poemas" },
    { value: "mistico", label: "Místicos" },
    { value: "filosofico", label: "Filosóficos" },
    { value: "ritual", label: "Rituais" },
    { value: "introspectivo", label: "Introspectivos" },
    { value: "transformacao", label: "Transformação" }
  ];

  const filteredPoems = poems.filter(poem => {
    const matchesSearch = poem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poem.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         poem.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || poem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-titles text-yellow-600 mb-4 flame-text-clean">
            Voz da Pluma
          </h1>
          <p className="text-xl text-gray-200 font-serif">
            Poesias Místicas e Textos Inspiracionais dos Tempos Ancestrais
          </p>
        </div>

        {/* Daily Featured Poem */}
        {dailyPoem && (
          <Card className="abyssal-card-transparent max-w-4xl mx-auto mb-12">
            <CardHeader className="text-center">
              <Badge className="bg-yellow-600 text-black mb-4 w-fit mx-auto">
                Poema do Dia
              </Badge>
              <CardTitle className="text-2xl font-titles text-yellow-600 flex items-center justify-center">
                <Feather className="w-6 h-6 mr-2 mystical-glow" />
                {dailyPoem.title}
              </CardTitle>
              <CardDescription className="text-gray-300">
                Por {dailyPoem.author}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-gray-200 mb-6 whitespace-pre-line font-serif leading-relaxed text-lg max-w-2xl mx-auto">
                {dailyPoem.content}
              </div>
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Hoje
                </div>
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-1" />
                  Visualização diária
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Search and Filter */}
        <Card className="abyssal-card-transparent max-w-4xl mx-auto mb-12">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Buscar por título, autor ou conteúdo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/50 border-yellow-600/50 text-white"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  size="sm"
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

        {/* Results Info */}
        <div className="text-center mb-8">
          <p className="text-gray-300">
            Encontrados {filteredPoems.length} poemas
            {searchTerm && (
              <span> para "{searchTerm}"</span>
            )}
          </p>
        </div>

        {/* Poems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredPoems.map((poem) => (
            <Card key={poem.id} className="abyssal-card-transparent h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="border-yellow-600/50 text-yellow-600">
                    {categories.find(c => c.value === poem.category)?.label}
                  </Badge>
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 text-red-400 mr-1" />
                    <span className="text-gray-400 text-sm">{poem.likes}</span>
                  </div>
                </div>
                
                <CardTitle className="text-xl font-titles text-yellow-600 mb-2">
                  {poem.title}
                </CardTitle>
                
                <CardDescription className="text-gray-300 flex items-center justify-between">
                  <span>Por {poem.author}</span>
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(poem.date).toLocaleDateString('pt-BR')}
                  </div>
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-400 text-sm italic">
                    {poem.preview}
                  </p>
                  
                  <div className="text-gray-200 font-serif leading-relaxed text-sm whitespace-pre-line bg-black/20 p-4 rounded-lg border border-yellow-600/20">
                    {poem.content}
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-yellow-600/20">
                    <div className="flex items-center space-x-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                      >
                        <Heart className="w-4 h-4 mr-1" />
                        {poem.likes}
                      </Button>
                      <Button 
                        size="sm"
                        variant="outline"
                        className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600/10"
                      >
                        <Share2 className="w-4 h-4 mr-1" />
                        Compartilhar
                      </Button>
                    </div>
                    
                    <Button 
                      size="sm"
                      className="bg-yellow-600 hover:bg-yellow-700 text-black"
                    >
                      <BookOpen className="w-4 h-4 mr-1" />
                      Ler Completo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPoems.length === 0 && (
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Feather className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-titles text-yellow-600 mb-2">
                Nenhum poema encontrado
              </h3>
              <p className="text-gray-400 mb-4">
                Tente ajustar os filtros ou termos de busca.
              </p>
              <Button 
                variant="outline"
                className="border-yellow-600/50 text-yellow-600"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
              >
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Featured Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <Card className="abyssal-card-transparent">
            <CardHeader>
              <CardTitle className="text-xl font-titles text-yellow-600">
                Antologia Ancestral
              </CardTitle>
              <CardDescription className="text-gray-300">
                Coleção dos poemas mais antigos e poderosos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <Scroll className="w-4 h-4 mr-2 text-purple-400" />
                  25 poemas clássicos
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Star className="w-4 h-4 mr-2 text-yellow-400" />
                  Avaliação: 4.9/5
                </div>
              </div>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">
                Explorar Antologia
              </Button>
            </CardContent>
          </Card>

          <Card className="abyssal-card-transparent">
            <CardHeader>
              <CardTitle className="text-xl font-titles text-yellow-600">
                Poemas Rituais
              </CardTitle>
              <CardDescription className="text-gray-300">
                Versos para acompanhar práticas ritualísticas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <Scroll className="w-4 h-4 mr-2 text-purple-400" />
                  18 poemas rituais
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Clock className="w-4 h-4 mr-2 text-green-400" />
                  Para diferentes cerimônias
                </div>
              </div>
              <Button 
                variant="outline"
                className="w-full border-yellow-600/50 text-yellow-600 hover:bg-yellow-600/10"
              >
                Ver Coleção Ritual
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Submission Notice */}
        <Card className="abyssal-card-transparent max-w-2xl mx-auto mt-12">
          <CardContent className="text-center py-8">
            <Feather className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-titles text-yellow-600 mb-4">
              Contribua com Sua Voz
            </h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              A Voz da Pluma acolhe contribuições de todos os iniciados. Se você possui 
              poemas místicos, textos inspiracionais ou reflexões esotéricas, 
              compartilhe sua sabedoria com a comunidade do templo.
            </p>
            <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
              Enviar Minha Obra
            </Button>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}