import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, Search, Filter, Download, Star, Eye, Skull, 
  AlertTriangle, Lock, Crown, Flame, Shield
} from "lucide-react";

export default function Bibliotheca() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLevel, setSelectedLevel] = useState("all");

  const mockDocuments = [
    {
      id: 1,
      title: "Necronomicon Vetitus",
      author: "Al-Hazred ibn Yusuf",
      description: "O livro proibido dos nomes mortos. Contém conhecimentos que precedem a criação e invocações que desafiam a própria realidade.",
      type: "grimório",
      category: "forbidden",
      pages: 666,
      downloads: 13,
      rating: 5.0,
      price: "Acesso Restrito",
      level: "⚠️ EXTREMO",
      warning: "Leitura pode causar alterações permanentes na percepção da realidade"
    },
    {
      id: 2,
      title: "Liber Umbra Mortis",
      author: "Magister Mortuum",
      description: "Rituais necromânticos ancestrais. Comunicação com os mortos e manipulação das energias post-mortem das almas perdidas.",
      type: "manual",
      category: "necromancy",
      pages: 444,
      downloads: 7,
      rating: 4.9,
      price: "Selo Sangüíneo",
      level: "⚠️ PERIGOSO",
      warning: "Práticas podem atrair entidades hostis do plano astral"
    },
    {
      id: 3,
      title: "Codex Daemonium Primordialis",
      author: "Ordo Serpentis Nigrae",
      description: "Catálogo completo dos demônios primordiais e seus selos de comando. Hierarquias infernais reveladas pela primeira vez.",
      type: "escritura",
      category: "demonology",
      pages: 999,
      downloads: 21,
      rating: 5.0,
      price: "Pacto Ritual",
      level: "⚠️ EXTREMO",
      warning: "Conhecimento destinado apenas aos Grão-Mestres Iniciados"
    },
    {
      id: 4,
      title: "Ars Goetia Completa",
      author: "Rex Salomonis",
      description: "A verdadeira Arte Goética. 72 demônios e seus poderes secretos. Selos originais nunca antes revelados ao mundo profano.",
      type: "tratado",
      category: "goetia",
      pages: 333,
      downloads: 18,
      rating: 4.8,
      price: "Sangue & Ouro",
      level: "⚠️ PERIGOSO",
      warning: "Uso incorreto pode resultar em possessão ou morte espiritual"
    },
    {
      id: 5,
      title: "Apocalypsis Luciferiana",
      author: "Pontifex Maximus Tenebrarum",
      description: "Profecias do fim dos tempos segundo a tradição luciferiana. O despertar da Besta e a Nova Era das Trevas Eternas.",
      type: "profecia",
      category: "apocalyptic",
      pages: 777,
      downloads: 3,
      rating: 5.0,
      price: "Alma Iniciática",
      level: "⚠️ EXTREMO",
      warning: "Revelações podem causar terror existencial permanente"
    },
    {
      id: 6,
      title: "Ritualia Sanguinaria",
      author: "Magus Cruor",
      description: "Rituais de sangue dos antigos cultos. Oferendas de vida para obter poder absoluto sobre a matéria e espírito.",
      type: "manual",
      category: "blood_magic",
      pages: 234,
      downloads: 9,
      rating: 4.7,
      price: "Juramento Eterno",
      level: "⚠️ PERIGOSO",
      warning: "Práticas envolvem riscos físicos e espirituais extremos"
    },
    {
      id: 7,
      title: "Clavis Inferni",
      author: "Guardião das Chaves",
      description: "As chaves verdadeiras do inferno. Portais dimensionais e passagens para os planos sombrios da existência cósmica.",
      type: "grimório",
      category: "portals",
      pages: 555,
      downloads: 1,
      rating: 5.0,
      price: "Preço Inominável",
      level: "⚠️ EXTREMO",
      warning: "Abertura de portais pode ser irreversível"
    },
    {
      id: 8,
      title: "Corpus Hermeticum Tenebrarum",
      author: "Hermes Trismegistus Niger",
      description: "A versão sombria dos ensinamentos herméticos. Alquimia negra e transmutação através das trevas primordiais.",
      type: "tratado",
      category: "dark_alchemy",
      pages: 411,
      downloads: 11,
      rating: 4.9,
      price: "Conhecimento Selado",
      level: "⚠️ PERIGOSO",
      warning: "Transformações alquímicas podem ser irreversíveis"
    }
  ];

  const categories = [
    { value: "all", label: "Todas as Categorias" },
    { value: "forbidden", label: "📖 Livros Proibidos" },
    { value: "necromancy", label: "💀 Necromancia" },
    { value: "demonology", label: "👹 Demonologia" },
    { value: "goetia", label: "🔥 Arte Goética" },
    { value: "apocalyptic", label: "⚡ Profecias" },
    { value: "blood_magic", label: "🩸 Magia Sanguínea" },
    { value: "portals", label: "🌀 Portais" },
    { value: "dark_alchemy", label: "⚗️ Alquimia Negra" }
  ];

  const levels = [
    { value: "all", label: "Todos os Níveis" },
    { value: "⚠️ PERIGOSO", label: "⚠️ PERIGOSO" },
    { value: "⚠️ EXTREMO", label: "⚠️ EXTREMO" }
  ];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesLevel = selectedLevel === "all" || doc.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "grimório": return "📜";
      case "manual": return "📋";
      case "escritura": return "📿";
      case "tratado": return "📚";
      case "profecia": return "🔮";
      default: return "📖";
    }
  };

  const getDangerLevel = (level: string) => {
    switch (level) {
      case "⚠️ EXTREMO": 
        return "bg-red-900/30 text-red-300 border-red-500/50 animate-pulse";
      case "⚠️ PERIGOSO": 
        return "bg-orange-900/30 text-orange-300 border-orange-500/50";
      default: 
        return "bg-gray-900/30 text-gray-300 border-gray-500/50";
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
            <div className="text-red-500 text-6xl mb-4">📚</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-red-500 mystical-glow mb-6 floating-title">
              BIBLIOTHECA ARCANA
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
              Os Segredos Mais Selados do Mundo
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Aqui repousam os <strong className="text-red-400">conhecimentos proibidos</strong> que foram 
              banidos da luz do mundo. Textos <strong className="text-amber-400">perigosos e arcanos</strong> que 
              guardam os mistérios mais sombrios da existência.
            </p>
            
            <div className="text-center">
              <div className="text-red-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-red-300">
                "Scientia Potentia Est"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                O conhecimento é poder
              </p>
            </div>
          </div>
        </div>

        {/* Critical Warning */}
        <div className="floating-card max-w-4xl w-full mb-8 bg-red-900/20 backdrop-blur-lg border border-red-500/30 rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-red-400 mr-3" />
              <h3 className="text-2xl font-cinzel-decorative text-red-300">ADVERTÊNCIA SOLENE</h3>
              <AlertTriangle className="w-8 h-8 text-red-400 ml-3" />
            </div>
            
            <div className="space-y-4 text-center">
              <p className="text-gray-300 leading-relaxed">
                Os documentos contidos nesta biblioteca são de <strong className="text-red-400">natureza extremamente perigosa</strong>. 
                Seu uso inadequado pode resultar em consequências irreversíveis para o praticante e seu entorno.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-red-950/30 border border-red-500/20 rounded">
                  <Skull className="w-8 h-8 text-red-400 mx-auto mb-2" />
                  <h4 className="text-red-300 font-semibold mb-2">Riscos Espirituais</h4>
                  <p className="text-gray-400 text-sm">Possessão, maldições, perda da alma</p>
                </div>
                
                <div className="p-4 bg-orange-950/30 border border-orange-500/20 rounded">
                  <Eye className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                  <h4 className="text-orange-300 font-semibold mb-2">Riscos Mentais</h4>
                  <p className="text-gray-400 text-sm">Loucura, terror existencial, fragmentação psíquica</p>
                </div>
                
                <div className="p-4 bg-purple-950/30 border border-purple-500/20 rounded">
                  <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                  <h4 className="text-purple-300 font-semibold mb-2">Responsabilidade</h4>
                  <p className="text-gray-400 text-sm">O usuário assume total responsabilidade</p>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-black/40 border border-red-500/30 rounded">
                <p className="text-red-300 font-semibold text-sm">
                  ⚠️ ESTE CONTEÚDO É DESTINADO APENAS PARA FINS EDUCACIONAIS E HISTÓRICOS. 
                  O TEMPLO DO ABISMO NÃO SE RESPONSABILIZA POR USO INDEVIDO OU CONSEQUÊNCIAS DECORRENTES.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="floating-card max-w-6xl w-full mb-8 bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl">
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400 w-5 h-5" />
                <Input
                  placeholder="Buscar nos arquivos proibidos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-black/40 border-red-500/30 text-gray-300 placeholder:text-gray-500 focus:border-red-500"
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-black/40 border-red-500/30 text-gray-300">
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-red-500/30">
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value} className="text-gray-300 focus:bg-red-500/20">
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="bg-black/40 border-red-500/30 text-gray-300">
                  <SelectValue placeholder="Nível de Perigo" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-red-500/30">
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value} className="text-gray-300 focus:bg-red-500/20">
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Documents Grid */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-cinzel-decorative text-red-300">
                Arquivos Classificados
              </h3>
              <Badge variant="outline" className="border-red-500/30 text-red-300 bg-red-500/10">
                {filteredDocuments.length} documentos encontrados
              </Badge>
            </div>

            {filteredDocuments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocuments.map((doc) => (
                  <Card key={doc.id} className="bg-black/20 border-red-500/20 hover:border-red-400/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-red-400 text-lg leading-tight">
                          {doc.title}
                        </CardTitle>
                        <Badge variant="outline" className="border-red-500/30 text-red-300 flex items-center">
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
                            {doc.downloads} acessos
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-red-400 mr-1" />
                            <span className="text-red-400 font-semibold">{doc.rating}</span>
                          </div>
                          <Badge className={getDangerLevel(doc.level)}>
                            {doc.level}
                          </Badge>
                        </div>

                        {doc.warning && (
                          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded text-xs">
                            <div className="flex items-start">
                              <AlertTriangle className="w-4 h-4 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="text-red-300">{doc.warning}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <Lock className="w-4 h-4 mr-2" />
                            Solicitar Acesso
                          </Button>
                        </div>

                        <div className="text-center text-xs text-gray-500">
                          Preço: <span className="text-red-400 font-semibold">{doc.price}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-12">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Nenhum documento encontrado com os filtros selecionados</p>
              </div>
            )}
          </div>
        </div>

        {/* Final Warning */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-red-900/20 backdrop-blur-lg border border-red-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-red-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Há conhecimentos que não devem ser despertados, pois uma vez liberados, não podem ser novamente adormecidos"
            </p>
            <p className="text-red-400 font-semibold">
              — Guardião dos Arquivos Proibidos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}