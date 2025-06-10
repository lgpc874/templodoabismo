import { useState } from "react";
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
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 animate-pulse font-['Cinzel_Decorative']">
            BIBLIOTHECA ABYSSOS
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Manuscritos sombrios onde repousam invocações primordiais e rituais ctônicos. Cada página pulsa com poder ancestral das correntes abissais.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="floating-card max-w-4xl mx-auto mb-12 p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
              <Input
                placeholder="Buscar por título, autor ou conteúdo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-amber-500/50 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
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
                    ? 'bg-amber-600 hover:bg-amber-700 text-black'
                    : 'border-amber-500/50 text-amber-400 hover:bg-amber-500/10'
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

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
            <div key={doc.id} className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300 p-6">
              <div className="flex items-start justify-between mb-4">
                <Badge variant="outline" className="border-amber-500/50 text-amber-400">
                  {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                </Badge>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-amber-500 mr-1" />
                  <span className="text-amber-500 text-sm">{doc.rating}</span>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-amber-400 mb-3 group-hover:text-orange-400 transition-colors font-['Cinzel_Decorative']">
                {doc.title}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4">
                Por {doc.author}
              </p>
              
              <div className="space-y-4">
                <p className="text-gray-300 text-sm leading-relaxed">
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
                    className="flex-1 border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button 
                    size="sm"
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-black"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <div className="floating-card text-center py-12 max-w-md mx-auto">
            <Library className="w-16 h-16 text-amber-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-amber-400 mb-2 font-['Cinzel_Decorative']">
              Nenhum documento encontrado
            </h3>
            <p className="text-gray-300 mb-4">
              Tente ajustar os filtros ou termos de busca.
            </p>
            <Button 
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("all");
              }}
            >
              Limpar Filtros
            </Button>
          </div>
        )}

        {/* Featured Collections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="floating-card p-6">
            <h3 className="text-xl font-bold text-amber-400 mb-2 font-['Cinzel_Decorative']">
              Coleção Essencial
            </h3>
            <p className="text-gray-300 mb-4">
              Textos fundamentais para iniciantes
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-300">
                <BookOpen className="w-4 h-4 mr-2 text-amber-400" />
                15 documentos essenciais
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-amber-400" />
                Leitura estimada: 8 horas
              </div>
            </div>
            <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black">
              Acessar Coleção
            </Button>
          </div>

          <div className="floating-card p-6">
            <h3 className="text-xl font-bold text-amber-400 mb-2 font-['Cinzel_Decorative']">
              Novos Lançamentos
            </h3>
            <p className="text-gray-300 mb-4">
              Últimas adições à biblioteca
            </p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-300">
                <BookOpen className="w-4 h-4 mr-2 text-amber-400" />
                6 novos documentos
              </div>
              <div className="flex items-center text-sm text-gray-300">
                <Clock className="w-4 h-4 mr-2 text-amber-400" />
                Adicionados esta semana
              </div>
            </div>
            <Button 
              variant="outline"
              className="w-full border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            >
              Ver Novidades
            </Button>
          </div>
        </div>

        {/* Access Notice */}
        <div className="floating-card text-center py-8 max-w-2xl mx-auto mt-12">
          <Library className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-amber-400 mb-4 font-['Cinzel_Decorative']">
            Acesso Livre ao Conhecimento
          </h3>
          <p className="text-gray-300 leading-relaxed">
            A Bibliotheca Secreta oferece acesso gratuito a uma vasta coleção de textos esotéricos, 
            artigos acadêmicos e documentos históricos. Todo o conteúdo está disponível para download 
            e estudo, contribuindo para a preservação e disseminação do conhecimento ancestral.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 border-t border-amber-500/30 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2024 Templo do Abismo. Todos os direitos reservados.
            </p>
            <p className="text-gray-500 text-xs mt-2">
              Portal dedicado aos ensinamentos luciferianos ancestrais
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}