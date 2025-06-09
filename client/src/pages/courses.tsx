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
import SiteNavigation from "@/components/SiteNavigation";

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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando Academia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <SiteNavigation />
      
      <div className="container mx-auto px-4 pt-20 pb-12">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-amber-400 mb-4">
            🔥 ACADEMIA LUCIFERIANA 🔥
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Desperte seu potencial através dos ensinamentos ancestrais da tradição luciferiana
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar cursos por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/40 border-purple-500/30 text-gray-200 placeholder-gray-400"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-purple-500/30 text-gray-300"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtros
            </Button>
            
            {(selectedLevel !== "all" || selectedType !== "all" || searchTerm) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-400 hover:text-gray-200"
              >
                <X className="w-4 h-4 mr-2" />
                Limpar
              </Button>
            )}
          </div>

          {/* Collapsible Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-black/30 rounded-lg border border-purple-500/20">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nível de Dificuldade</label>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="bg-black/40 border-purple-500/30 text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os níveis</SelectItem>
                    <SelectItem value="1">Iniciante</SelectItem>
                    <SelectItem value="2">Aprendiz</SelectItem>
                    <SelectItem value="3">Avançado</SelectItem>
                    <SelectItem value="4">Adepto</SelectItem>
                    <SelectItem value="5">Mestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Curso</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="bg-black/40 border-purple-500/30 text-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="regular">Regular</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="master">Mestre</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter */}
        <div className="mb-6">
          <p className="text-gray-400">
            {filteredCourses.length} {filteredCourses.length === 1 ? 'curso encontrado' : 'cursos encontrados'}
          </p>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course: Course) => (
              <Card 
                key={course.id} 
                className="bg-black/40 border-purple-500/30 hover:border-amber-400/50 transition-all duration-300 group cursor-pointer"
                onClick={() => viewCourse(course)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(course.type)}
                      <Badge 
                        variant="outline" 
                        className={`${getLevelColor(course.level)} text-white border-0`}
                      >
                        Nível {course.level}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                      {typeNames[course.type] || course.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-100 group-hover:text-amber-400 transition-colors line-clamp-2">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-gray-400 line-clamp-3">
                    {course.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  {/* Course Info */}
                  <div className="space-y-3">
                    {/* Requirements */}
                    {course.requirements && course.requirements.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Pré-requisitos:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.requirements.slice(0, 2).map((req, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-gray-700/50">
                              {req}
                            </Badge>
                          ))}
                          {course.requirements.length > 2 && (
                            <Badge variant="secondary" className="text-xs bg-gray-700/50">
                              +{course.requirements.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Rewards */}
                    {course.rewards && course.rewards.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Recompensas:</p>
                        <div className="flex flex-wrap gap-1">
                          {course.rewards.slice(0, 2).map((reward, index) => (
                            <Badge key={index} variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                              {reward}
                            </Badge>
                          ))}
                          {course.rewards.length > 2 && (
                            <Badge variant="outline" className="text-xs text-amber-400 border-amber-400/30">
                              +{course.rewards.length - 2}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Stats */}
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <div className="flex items-center space-x-4">
                        {course.estimatedDuration && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{course.estimatedDuration}h</span>
                          </div>
                        )}
                        {course.enrolledCount && (
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>{course.enrolledCount}</span>
                          </div>
                        )}
                        {course.rating && (
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span>{course.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="flex justify-between items-center pt-2 border-t border-purple-500/20">
                      <div>
                        <span className="text-xl font-bold text-amber-400">
                          R$ {Number(course.price_brl || 0).toFixed(2)}
                        </span>
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-purple-600 hover:bg-purple-700"
                        onClick={(e) => {
                          e.stopPropagation();
                          viewCourse(course);
                        }}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Curso
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-500 mb-4">
              Tente ajustar os filtros ou termo de busca
            </p>
            {(selectedLevel !== "all" || selectedType !== "all" || searchTerm) && (
              <Button variant="outline" onClick={clearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Course Details Modal */}
      <Dialog open={showCourseModal} onOpenChange={setShowCourseModal}>
        <DialogContent className="bg-gray-900 border-purple-500/30 max-w-2xl">
          {selectedCourse && (
            <>
              <DialogHeader>
                <div className="flex items-center space-x-2 mb-2">
                  {getTypeIcon(selectedCourse.type)}
                  <Badge 
                    variant="outline" 
                    className={`${getLevelColor(selectedCourse.level)} text-white border-0`}
                  >
                    Nível {selectedCourse.level} - {levelNames[selectedCourse.level]}
                  </Badge>
                  <Badge variant="outline" className="text-amber-400 border-amber-400/30">
                    {typeNames[selectedCourse.type] || selectedCourse.type}
                  </Badge>
                </div>
                <DialogTitle className="text-2xl text-amber-400">
                  {selectedCourse.title}
                </DialogTitle>
                <DialogDescription className="text-gray-300 text-base">
                  {selectedCourse.description}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-black/30 rounded-lg">
                    <div className="text-2xl font-bold text-amber-400">
                      {selectedCourse.level}
                    </div>
                    <div className="text-sm text-gray-400">Nível</div>
                  </div>
                  {selectedCourse.estimatedDuration && (
                    <div className="text-center p-3 bg-black/30 rounded-lg">
                      <div className="text-2xl font-bold text-blue-400">
                        {selectedCourse.estimatedDuration}h
                      </div>
                      <div className="text-sm text-gray-400">Duração</div>
                    </div>
                  )}
                  {selectedCourse.enrolledCount && (
                    <div className="text-center p-3 bg-black/30 rounded-lg">
                      <div className="text-2xl font-bold text-green-400">
                        {selectedCourse.enrolledCount}
                      </div>
                      <div className="text-sm text-gray-400">Alunos</div>
                    </div>
                  )}
                  {selectedCourse.rating && (
                    <div className="text-center p-3 bg-black/30 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-400">
                        {selectedCourse.rating.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-400">Avaliação</div>
                    </div>
                  )}
                </div>

                {/* Requirements */}
                {selectedCourse.requirements && selectedCourse.requirements.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                      <Lock className="w-5 h-5 mr-2 text-red-400" />
                      Pré-requisitos
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="bg-red-900/30 text-red-300">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rewards */}
                {selectedCourse.rewards && selectedCourse.rewards.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center">
                      <Award className="w-5 h-5 mr-2 text-amber-400" />
                      Recompensas
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.rewards.map((reward, index) => (
                        <Badge key={index} variant="outline" className="text-amber-400 border-amber-400/30">
                          {reward}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Price and Enrollment */}
                <div className="border-t border-purple-500/30 pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-3xl font-bold text-amber-400">
                        R$ {Number(selectedCourse.price_brl || 0).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-400">
                        Acesso completo ao curso
                      </div>
                    </div>
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700"
                      onClick={() => enrollMutation.mutate(selectedCourse.id)}
                      disabled={enrollMutation.isPending}
                    >
                      {enrollMutation.isPending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <ShoppingCart className="w-5 h-5 mr-2" />
                      )}
                      {enrollMutation.isPending ? 'Processando...' : 'Matricular-se'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}