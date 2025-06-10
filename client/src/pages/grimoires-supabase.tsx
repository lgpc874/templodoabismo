import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, 
  Download, 
  Clock, 
  Eye, 
  Star, 
  ShoppingCart, 
  Calendar,
  FileText,
  Crown,
  Zap,
  Search,
  Filter,
  Book,
  Bookmark,
  PlayCircle
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGrimoires } from "@/hooks/useSupabaseData";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/footer";

export default function GrimoiresSupabase() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  // Fetch all grimoires using Supabase
  const { data: grimoires = [], isLoading } = useGrimoires();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Filter and sort grimoires
  const filteredGrimoires = grimoires
    .filter(grimoire => {
      const matchesSearch = grimoire.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           grimoire.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || grimoire.category === selectedCategory;
      const matchesLevel = selectedLevel === "all" || grimoire.level === parseInt(selectedLevel);
      return matchesSearch && matchesCategory && matchesLevel;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

  // Get unique categories and levels
  const categories = ["all", ...Array.from(new Set(grimoires.map(g => g.category)))];
  const levels = ["all", "1", "2", "3", "4"];

  const handlePurchase = async (grimoireId: number, price: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso requerido",
        description: "Faça login para adquirir grimórios",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processando compra...",
      description: "Redirecionando para pagamento",
    });
    // Implement purchase logic with Supabase
  };

  const handleRent = async (grimoireId: number, price: number) => {
    if (!isAuthenticated) {
      toast({
        title: "Acesso requerido",
        description: "Faça login para alugar grimórios",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Processando aluguel...",
      description: "Redirecionando para pagamento",
    });
    // Implement rental logic with Supabase
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-gold mb-4">
            Bibliotheca Obscura
          </h1>
          <p className="text-xl text-gray-300 font-crimson max-w-2xl mx-auto">
            Grimórios ancestrais e conhecimentos proibidos dos grandes mestres
          </p>
        </div>

        {/* Filters and Search */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar grimórios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-gold/20 text-gold placeholder:text-gray-500"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="bg-black/40 border-gold/20 text-gold">
              <SelectValue placeholder="Categoria" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gold/20">
              <SelectItem value="all">Todas Categorias</SelectItem>
              {categories.slice(1).map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLevel} onValueChange={setSelectedLevel}>
            <SelectTrigger className="bg-black/40 border-gold/20 text-gold">
              <SelectValue placeholder="Nível" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gold/20">
              <SelectItem value="all">Todos Níveis</SelectItem>
              {levels.slice(1).map((level) => (
                <SelectItem key={level} value={level}>
                  Nível {level}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-black/40 border-gold/20 text-gold">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-black border-gold/20">
              <SelectItem value="newest">Mais Recentes</SelectItem>
              <SelectItem value="oldest">Mais Antigos</SelectItem>
              <SelectItem value="price-low">Menor Preço</SelectItem>
              <SelectItem value="price-high">Maior Preço</SelectItem>
              <SelectItem value="rating">Melhor Avaliação</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grimoires Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-black/40 border-gold/20 backdrop-blur-sm">
                <CardHeader className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded animate-pulse" />
                  <div className="h-3 bg-gray-700 rounded w-3/4 animate-pulse" />
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 bg-gray-700 rounded animate-pulse" />
                    <div className="h-3 bg-gray-700 rounded w-1/2 animate-pulse" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGrimoires.map((grimoire) => {
              const isPurchased = user?.id && grimoire.purchased_by?.includes(user.id);
              const isRented = user?.id && grimoire.rented_by?.includes(user.id);
              const hasAccess = isPurchased || isRented;

              return (
                <Card key={grimoire.id} className="bg-black/40 border-gold/20 backdrop-blur-sm hover:border-gold/40 transition-all group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant="outline"
                        className="border-gold/30 text-gold"
                      >
                        {grimoire.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        {grimoire.level > 2 && <Crown className="w-4 h-4 text-gold" />}
                        <span className="text-xs text-gray-400">Nível {grimoire.level}</span>
                      </div>
                    </div>
                    
                    <CardTitle className="text-gold font-cinzel-decorative group-hover:text-orange-400 transition-colors">
                      {grimoire.title}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-300 font-crimson">
                      {grimoire.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <FileText className="w-4 h-4" />
                          {grimoire.pages} páginas
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {grimoire.views || 0}
                        </div>
                        {grimoire.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {grimoire.rating.toFixed(1)}
                          </div>
                        )}
                      </div>

                      {/* Author */}
                      <div className="text-sm text-gray-300">
                        <span className="text-gold">Autor:</span> {grimoire.author}
                      </div>

                      {/* Pricing */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-400">Comprar</span>
                          <span className="text-gold font-bold">
                            {grimoire.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                          </span>
                        </div>
                        {grimoire.rental_price && (
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-400">Alugar (30 dias)</span>
                            <span className="text-orange-400 font-bold">
                              {grimoire.rental_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="space-y-2">
                    {hasAccess ? (
                      <Button className="w-full bg-green-700 hover:bg-green-600 text-white font-cinzel-regular">
                        <Download className="w-4 h-4 mr-2" />
                        Baixar Grimório
                      </Button>
                    ) : (
                      <div className="w-full space-y-2">
                        <Button 
                          onClick={() => handlePurchase(grimoire.id, grimoire.price)}
                          className="w-full bg-gradient-to-r from-gold/80 to-orange-600/80 hover:from-gold hover:to-orange-600 text-black font-cinzel-regular"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Comprar
                        </Button>
                        {grimoire.rental_price && (
                          <Button 
                            onClick={() => handleRent(grimoire.id, grimoire.rental_price)}
                            variant="outline"
                            className="w-full border-orange-600/50 text-orange-400 hover:bg-orange-600/10 font-cinzel-regular"
                          >
                            <Clock className="w-4 h-4 mr-2" />
                            Alugar
                          </Button>
                        )}
                      </div>
                    )}
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}

        {filteredGrimoires.length === 0 && !isLoading && (
          <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <Book className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-cinzel-decorative text-gray-400 mb-2">
                Nenhum grimório encontrado
              </h3>
              <p className="text-gray-500 font-crimson">
                Tente ajustar seus filtros de busca
              </p>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Compra vs Aluguel
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 font-crimson space-y-2">
              <p><strong className="text-gold">Compra:</strong> Acesso vitalício ao grimório</p>
              <p><strong className="text-orange-400">Aluguel:</strong> Acesso por 30 dias</p>
              <p>Grimórios comprados ficam disponíveis para sempre em sua biblioteca</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Níveis de Acesso
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 font-crimson space-y-2">
              <p><strong className="text-gold">Nível 1-2:</strong> Disponível para todos</p>
              <p><strong className="text-orange-400">Nível 3-4:</strong> Requer iniciação</p>
              <p>Avance nos cursos para desbloquear grimórios superiores</p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Formatos
              </CardTitle>
            </CardHeader>
            <CardContent className="text-gray-300 font-crimson space-y-2">
              <p><strong className="text-gold">PDF:</strong> Leitura offline</p>
              <p><strong className="text-orange-400">Interativo:</strong> Exercícios práticos</p>
              <p>Todos os grimórios incluem materiais complementares</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}