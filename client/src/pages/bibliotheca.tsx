import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Filter,
  Download,
  Eye,
  Clock,
  Star,
  Library
} from "lucide-react";

export default function Bibliotheca() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const documents = [
    {
      id: 1,
      title: "Filosofia Luciferiana: Uma Introdução",
      author: "Mestre Astaroth",
      category: "filosofia",
      type: "artigo",
      pages: 15,
      rating: 4.9,
      downloads: 1245,
      description: "Exploração dos fundamentos filosóficos do luciferianismo moderno"
    },
    {
      id: 2,
      title: "História dos Cultos Ancestrais",
      author: "Dr. Occultus",
      category: "historia",
      type: "ensaio",
      pages: 32,
      rating: 4.7,
      downloads: 892,
      description: "Análise histórica dos cultos e tradições esotéricas ancestrais"
    },
    {
      id: 3,
      title: "Meditação e Estados Alterados",
      author: "Sacerdotisa Luna",
      category: "pratica",
      type: "guia",
      pages: 24,
      rating: 4.8,
      downloads: 1567,
      description: "Técnicas práticas para alcançar estados alterados de consciência"
    },
    {
      id: 4,
      title: "Simbolismo Oculto na Arte",
      author: "Prof. Hermético",
      category: "simbolismo",
      type: "estudo",
      pages: 45,
      rating: 4.6,
      downloads: 634,
      description: "Análise do simbolismo esotérico presente na arte através dos séculos"
    },
    {
      id: 5,
      title: "Mitologia Comparada: Serpentes e Dragões",
      author: "Dra. Serpentis",
      category: "mitologia",
      type: "pesquisa",
      pages: 38,
      rating: 4.9,
      downloads: 723,
      description: "Estudo comparativo das figuras serpentinas e draconianas nas mitologias"
    },
    {
      id: 6,
      title: "Alquimia Psicológica",
      author: "Magus Jung",
      category: "psicologia",
      type: "artigo",
      pages: 28,
      rating: 4.8,
      downloads: 1089,
      description: "Aplicação dos princípios alquímicos na psicologia profunda"
    }
  ];

  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "filosofia", label: "Filosofia" },
    { value: "historia", label: "História" },
    { value: "pratica", label: "Práticas" },
    { value: "simbolismo", label: "Simbolismo" },
    { value: "mitologia", label: "Mitologia" },
    { value: "psicologia", label: "Psicologia" }
  ];

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
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
            Bibliotheca Secreta
          </h1>
          <p className="text-xl text-gray-200 font-serif">
            Vasta Coleção de Conhecimentos Ocultos e Textos Ancestrais
          </p>
        </div>

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
              <Button
                variant="outline"
                className="border-yellow-600/50 text-yellow-600 hover:bg-yellow-600/10"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros Avançados
              </Button>
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
            Encontrados {filteredDocuments.length} documentos
            {searchTerm && (
              <span> para "{searchTerm}"</span>
            )}
          </p>
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <Card key={doc.id} className="abyssal-card-transparent h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge variant="outline" className="border-yellow-600/50 text-yellow-600">
                    {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-500 text-sm">{doc.rating}</span>
                  </div>
                </div>
                
                <CardTitle className="text-lg font-titles text-yellow-600 mb-2 line-clamp-2">
                  {doc.title}
                </CardTitle>
                
                <CardDescription className="text-gray-300 text-sm">
                  Por {doc.author}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-200 text-sm leading-relaxed line-clamp-3">
                    {doc.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      {doc.pages} páginas
                    </div>
                    <div className="flex items-center">
                      <Download className="w-3 h-3 mr-1" />
                      {doc.downloads} downloads
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      size="sm"
                      variant="outline"
                      className="flex-1 border-yellow-600/50 text-yellow-600 hover:bg-yellow-600/10"
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button 
                      size="sm"
                      className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-black"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Library className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-titles text-yellow-600 mb-2">
                Nenhum documento encontrado
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
                Coleção Essencial
              </CardTitle>
              <CardDescription className="text-gray-300">
                Textos fundamentais para iniciantes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                  15 documentos essenciais
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Clock className="w-4 h-4 mr-2 text-green-400" />
                  Leitura estimada: 8 horas
                </div>
              </div>
              <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">
                Acessar Coleção
              </Button>
            </CardContent>
          </Card>

          <Card className="abyssal-card-transparent">
            <CardHeader>
              <CardTitle className="text-xl font-titles text-yellow-600">
                Novos Lançamentos
              </CardTitle>
              <CardDescription className="text-gray-300">
                Últimas adições à biblioteca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-300">
                  <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                  6 novos documentos
                </div>
                <div className="flex items-center text-sm text-gray-300">
                  <Clock className="w-4 h-4 mr-2 text-green-400" />
                  Adicionados esta semana
                </div>
              </div>
              <Button 
                variant="outline"
                className="w-full border-yellow-600/50 text-yellow-600 hover:bg-yellow-600/10"
              >
                Ver Novidades
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Access Notice */}
        <Card className="abyssal-card-transparent max-w-2xl mx-auto mt-12">
          <CardContent className="text-center py-8">
            <Library className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
            <h3 className="text-xl font-titles text-yellow-600 mb-4">
              Acesso Livre ao Conhecimento
            </h3>
            <p className="text-gray-300 leading-relaxed">
              A Bibliotheca Secreta oferece acesso gratuito a uma vasta coleção de textos esotéricos, 
              artigos acadêmicos e documentos históricos. Todo o conteúdo está disponível para download 
              e estudo, contribuindo para a preservação e disseminação do conhecimento ancestral.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}