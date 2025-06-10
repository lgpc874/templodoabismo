import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Search, 
  Filter,
  Download,
  Eye,
  Clock,
  Star,
  Library,
  Scroll,
  FileText,
  Award
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
    const matchesSearch = searchTerm === "" || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "artigo": return <FileText className="w-4 h-4" />;
      case "ensaio": return <Scroll className="w-4 h-4" />;
      case "guia": return <BookOpen className="w-4 h-4" />;
      case "estudo": return <Award className="w-4 h-4" />;
      case "pesquisa": return <Star className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
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
            <div className="text-amber-400 text-6xl mb-4">📚</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              BIBLIOTHECA ARCANA
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
              Arquivo Digital do Conhecimento Sagrado
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Uma coleção curada de <strong className="text-amber-400">documentos esotéricos</strong>, 
              <strong className="text-red-400"> estudos acadêmicos</strong> e textos fundamentais 
              da tradição luciferiana.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Scientia Est Lux"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                O conhecimento é luz
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="floating-card max-w-4xl w-full mb-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-amber-400" />
                  <Input
                    placeholder="Buscar documentos, autores ou temas..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500"
                  />
                </div>
              </div>
              <div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-black/40 border-amber-500/30 text-gray-300">
                    <Filter className="w-4 h-4 mr-2 text-amber-400" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-amber-500/30">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-cinzel-decorative text-amber-300">
                Documentos Disponíveis
              </h3>
              <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                {filteredDocuments.length} documentos encontrados
              </Badge>
            </div>

            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-black/20 border-amber-500/20 hover:border-amber-400/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-amber-400 text-lg leading-tight">
                          {doc.title}
                        </CardTitle>
                        <Badge variant="outline" className="border-amber-500/30 text-amber-300 flex items-center">
                          {getTypeIcon(doc.type)}
                          <span className="ml-1 capitalize">{doc.type}</span>
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        por {doc.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
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
                            {doc.downloads}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-amber-400 mr-1" />
                            <span className="text-amber-400 font-semibold">{doc.rating}</span>
                          </div>
                          <Badge 
                            variant="secondary" 
                            className="bg-amber-600/20 text-amber-200 capitalize"
                          >
                            {categories.find(c => c.value === doc.category)?.label}
                          </Badge>
                        </div>

                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1 bg-amber-600 hover:bg-amber-700 text-black">
                            <Eye className="w-4 h-4 mr-2" />
                            Visualizar
                          </Button>
                          <Button size="sm" variant="outline" className="border-amber-500/30 text-amber-300">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Library className="w-16 h-16 mx-auto text-amber-400 opacity-50 mb-4" />
                <h4 className="text-xl font-semibold text-amber-300 mb-2">
                  Nenhum documento encontrado
                </h4>
                <p className="text-gray-400">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Categories Overview */}
        <div className="floating-card max-w-6xl w-full mt-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6 text-center">
              Categorias de Conhecimento
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.slice(1).map((category) => {
                const count = documents.filter(doc => doc.category === category.value).length;
                return (
                  <div 
                    key={category.value}
                    className="text-center p-4 bg-black/20 rounded-lg border border-amber-500/20 hover:border-amber-400/40 transition-colors cursor-pointer"
                    onClick={() => setSelectedCategory(category.value)}
                  >
                    <div className="text-2xl text-amber-400 mb-2">
                      {category.value === "filosofia" && "🔮"}
                      {category.value === "historia" && "📜"}
                      {category.value === "pratica" && "🕯️"}
                      {category.value === "simbolismo" && "🔯"}
                      {category.value === "mitologia" && "🐲"}
                      {category.value === "psicologia" && "🧠"}
                    </div>
                    <h4 className="text-amber-300 font-semibold text-sm mb-1">
                      {category.label}
                    </h4>
                    <p className="text-xs text-gray-400">
                      {count} documento{count !== 1 ? 's' : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Uma biblioteca não é apenas um depósito de livros, mas um templo da sabedoria onde as almas buscam a iluminação"
            </p>
            <p className="text-amber-400 font-semibold">
              — Guardião da Bibliotheca
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}