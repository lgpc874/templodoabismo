import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users, 
  ShoppingCart, 
  Lock, 
  Search,
  Filter,
  X,
  Eye,
  Play,
  Award,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  level: number;
  price_brl: string;
  requirements: string[];
  rewards: string[];
  estimatedDuration?: number;
  enrolledCount?: number;
  rating?: number;
  is_active: boolean;
  created_at: string;
}

export default function Courses() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/courses"],
    retry: false,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return await apiRequest(`/api/courses/${courseId}/enroll`, {
        method: "POST",
        body: JSON.stringify({}),
      });
    },
    onSuccess: () => {
      toast({
        title: "Inscrição realizada!",
        description: "Redirecionando para o pagamento...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      setShowCourseModal(false);
    },
    onError: (error: any) => {
      toast({
        title: "Erro na inscrição",
        description: error.message || "Erro ao processar inscrição",
        variant: "destructive",
      });
    },
  });

  const filteredCourses = Array.isArray(courses) ? courses.filter((course: Course) => {
    if (!course.is_active) return false;
    if (selectedLevel !== "all" && course.level.toString() !== selectedLevel) return false;
    if (selectedType !== "all" && course.type !== selectedType) return false;
    if (searchTerm && !course.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !course.description.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  }) : [];

  const levelNames: { [key: number]: string } = {
    1: "Iniciante",
    2: "Aprendiz", 
    3: "Avançado",
    4: "Adepto",
    5: "Mestre"
  };

  const typeNames: { [key: string]: string } = {
    regular: "Regular",
    premium: "Premium",
    master: "Mestre"
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-600";
      case 2: return "bg-blue-600";
      case 3: return "bg-yellow-600";
      case 4: return "bg-orange-600";
      case 5: return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "premium": return <Star className="w-4 h-4" />;
      case "master": return <Award className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  const clearFilters = () => {
    setSelectedLevel("all");
    setSelectedType("all");
    setSearchTerm("");
  };

  const viewCourse = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-amber-400 text-xl">Carregando Academia...</p>
        </div>
      </div>
    );
  }

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
            <div className="text-amber-400 text-6xl mb-4">🔥</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              ACADEMIA LUCIFERIANA
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
              Desperte Seu Potencial Através dos Ensinamentos Ancestrais
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Explore <strong className="text-amber-400">cursos estruturados</strong> que guiarão sua 
              <strong className="text-red-400"> jornada de autodivindade</strong> através da tradição luciferiana.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Magister Sui Ipsius"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Mestre de si mesmo
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="floating-card max-w-6xl w-full mb-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Buscar cursos por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-between items-center mb-4">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="border-amber-500/30 text-amber-300 hover:bg-amber-600/20"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filtros
              </Button>
              
              {(selectedLevel !== "all" || selectedType !== "all" || searchTerm) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="text-gray-400 hover:text-amber-300"
                >
                  <X className="w-4 h-4 mr-2" />
                  Limpar
                </Button>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/20 rounded-lg border border-amber-500/20">
                <div>
                  <label className="block text-amber-300 text-sm font-medium mb-2">Nível</label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger className="bg-black/40 border-amber-500/30 text-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-amber-500/30">
                      <SelectItem value="all">Todos os Níveis</SelectItem>
                      {Object.entries(levelNames).map(([level, name]) => (
                        <SelectItem key={level} value={level}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="block text-amber-300 text-sm font-medium mb-2">Tipo</label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="bg-black/40 border-amber-500/30 text-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-amber-500/30">
                      <SelectItem value="all">Todos os Tipos</SelectItem>
                      {Object.entries(typeNames).map(([type, name]) => (
                        <SelectItem key={type} value={type}>{name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-cinzel-decorative text-amber-300">
                Cursos Disponíveis
              </h3>
              <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                {filteredCourses.length} cursos encontrados
              </Badge>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course: Course) => (
                  <Card key={course.id} className="bg-black/20 border-amber-500/20 hover:border-amber-400/40 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-amber-400 text-lg leading-tight">
                          {course.title}
                        </CardTitle>
                        <div className="flex items-center">
                          {getTypeIcon(course.type)}
                          <Badge 
                            className={`ml-2 text-white ${getLevelColor(course.level)}`}
                          >
                            {levelNames[course.level]}
                          </Badge>
                        </div>
                      </div>
                      <CardDescription className="text-gray-300">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.estimatedDuration || 8}h
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1" />
                            {course.enrolledCount || 0}
                          </div>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 mr-1 text-amber-400" />
                            {course.rating || 4.5}
                          </div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-2xl font-bold text-amber-400 mb-2">
                            R$ {parseFloat(course.price_brl).toFixed(2)}
                          </div>
                          <Badge variant="secondary" className="bg-amber-600/20 text-amber-200">
                            {typeNames[course.type] || course.type}
                          </Badge>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            onClick={() => viewCourse(course)}
                            variant="outline" 
                            size="sm" 
                            className="flex-1 border-amber-500/30 text-amber-300"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Detalhes
                          </Button>
                          <Button 
                            onClick={() => enrollMutation.mutate(course.id)}
                            disabled={enrollMutation.isPending}
                            size="sm" 
                            className="flex-1 bg-amber-600 hover:bg-amber-700 text-black"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Matricular
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 mx-auto text-amber-400 opacity-50 mb-4" />
                <h4 className="text-xl font-semibold text-amber-300 mb-2">
                  Nenhum curso encontrado
                </h4>
                <p className="text-gray-400">
                  Tente ajustar os filtros ou termos de busca
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Course Detail Modal */}
        <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
          <DialogContent className="bg-black/90 border border-amber-500/30 text-gray-300 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-amber-400 text-xl">
                {selectedCourse?.title}
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Detalhes completos do curso
              </DialogDescription>
            </DialogHeader>
            {selectedCourse && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-amber-300 font-semibold mb-2">Descrição</h4>
                  <p className="text-gray-300">{selectedCourse.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-amber-300 font-semibold mb-2">Nível</h4>
                    <Badge className={`${getLevelColor(selectedCourse.level)} text-white`}>
                      {levelNames[selectedCourse.level]}
                    </Badge>
                  </div>
                  <div>
                    <h4 className="text-amber-300 font-semibold mb-2">Preço</h4>
                    <p className="text-2xl font-bold text-amber-400">
                      R$ {parseFloat(selectedCourse.price_brl).toFixed(2)}
                    </p>
                  </div>
                </div>

                {selectedCourse.requirements?.length > 0 && (
                  <div>
                    <h4 className="text-amber-300 font-semibold mb-2">Pré-requisitos</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {selectedCourse.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedCourse.rewards?.length > 0 && (
                  <div>
                    <h4 className="text-amber-300 font-semibold mb-2">O que você ganhará</h4>
                    <ul className="list-disc list-inside text-gray-300 space-y-1">
                      {selectedCourse.rewards.map((reward, index) => (
                        <li key={index}>{reward}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button 
                    onClick={() => enrollMutation.mutate(selectedCourse.id)}
                    disabled={enrollMutation.isPending}
                    className="flex-1 bg-amber-600 hover:bg-amber-700 text-black"
                  >
                    {enrollMutation.isPending ? "Processando..." : "Matricular Agora"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "O conhecimento não buscado não transforma; apenas o que é conquistado com suor e determinação revela seus segredos"
            </p>
            <p className="text-amber-400 font-semibold">
              — Mestre da Academia
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}