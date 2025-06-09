import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Flame, Lock, CheckCircle, Crown, Star, Eye } from "lucide-react";
import Navigation from "../components/navigation";
import { useAuth } from "../contexts/AuthContext";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "../hooks/use-toast";

interface Course {
  id: number;
  title: string;
  description: string;
  level: number;
  modules: string[];
  requirements: string[];
  rewards: string[];
  type: string;
  is_active: boolean;
  price_tkazh: number;
}

interface UserProgress {
  courseId: number;
  moduleIndex: number;
  completed: boolean;
}

export default function Courses() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/courses"],
  });

  const { data: userProgress = [] } = useQuery({
    queryKey: ["/api/user/progress"],
    enabled: isAuthenticated,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return await apiRequest(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Iniciação Confirmada",
        description: "Você foi inscrito no curso com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na Iniciação",
        description: error.message || "Não foi possível inscrever no curso.",
        variant: "destructive",
      });
    },
  });

  const completeModuleMutation = useMutation({
    mutationFn: async ({ courseId, moduleIndex }: { courseId: number; moduleIndex: number }) => {
      return await apiRequest(`/api/courses/${courseId}/modules/${moduleIndex}/complete`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Módulo Concluído",
        description: "Você avançou em sua jornada iniciática.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
  });

  const getUserProgress = (courseId: number): UserProgress | undefined => {
    return userProgress.find((p: UserProgress) => p.courseId === courseId);
  };

  const canAccessCourse = (course: Course): boolean => {
    if (!isAuthenticated) return false;
    if (course.level === 1) return true;
    
    // Check if user completed previous level
    const previousLevelCourse = courses.find((c: Course) => c.level === course.level - 1);
    if (previousLevelCourse) {
      const progress = getUserProgress(previousLevelCourse.id);
      return progress?.completed || false;
    }
    return false;
  };

  const getCourseIcon = (level: number) => {
    switch (level) {
      case 1: return <Flame className="w-8 h-8 text-orange-500" />;
      case 2: return <Eye className="w-8 h-8 text-red-500" />;
      case 3: return <Star className="w-8 h-8 text-purple-500" />;
      default: return <Crown className="w-8 h-8 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-15">
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

      <div className="relative z-10 container mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600">
            INICIAÇÃO LUCIFERIANA
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Jornada progressiva pelos mistérios ancestrais. Cada nível desperta novos poderes e conhecimentos, 
            guiando o iniciado através das profundezas da gnose abissal.
          </p>
        </div>

        {!isAuthenticated && (
          <div className="floating-card max-w-2xl mx-auto mb-12 p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-4 text-amber-500" />
            <h3 className="text-2xl font-bold text-amber-400 mb-4">Acesso Restrito</h3>
            <p className="text-gray-300 mb-6">
              Para iniciar sua jornada pelos mistérios luciferianos, é necessário fazer login no templo.
            </p>
            <button className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors">
              Entrar no Templo
            </button>
          </div>
        )}

        {/* Courses Grid */}
        {isAuthenticated && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course: Course) => {
              const progress = getUserProgress(course.id);
              const canAccess = canAccessCourse(course);
              const isEnrolled = !!progress;
              const isCompleted = progress?.completed || false;

              return (
                <div key={course.id} className="floating-card group">
                  <div className="p-6">
                    {/* Course Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getCourseIcon(course.level)}
                        <span className="text-sm font-semibold text-amber-400">
                          NÍVEL {course.level}
                        </span>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      )}
                      {!canAccess && (
                        <Lock className="w-6 h-6 text-gray-500" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-amber-400 mb-3">
                      {course.title}
                    </h3>
                    
                    <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Progress Bar */}
                    {isEnrolled && (
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progresso</span>
                          <span>{progress.moduleIndex + 1}/{course.modules.length}</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-amber-500 to-red-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${((progress.moduleIndex + 1) / course.modules.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    {course.requirements.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Requisitos:</h4>
                        <ul className="text-xs text-gray-500 space-y-1">
                          {course.requirements.map((req, index) => (
                            <li key={index}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6">
                      {!canAccess ? (
                        <button disabled className="w-full bg-gray-600 text-gray-400 py-2 rounded-lg cursor-not-allowed">
                          <Lock className="w-4 h-4 inline mr-2" />
                          Bloqueado
                        </button>
                      ) : !isEnrolled ? (
                        <button
                          onClick={() => enrollMutation.mutate(course.id)}
                          disabled={enrollMutation.isPending}
                          className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors disabled:opacity-50"
                        >
                          {enrollMutation.isPending ? "Iniciando..." : `Iniciar (R$ ${(course.price_brl / 100).toFixed(2)})`}
                        </button>
                      ) : isCompleted ? (
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Revisitar
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedCourse(course)}
                          className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-2 rounded-lg font-semibold hover:from-amber-700 hover:to-red-700 transition-colors"
                        >
                          Continuar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
            <div className="floating-card max-w-4xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl font-bold text-amber-400 mb-2">
                      {selectedCourse.title}
                    </h2>
                    <p className="text-gray-300">{selectedCourse.description}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>

                {/* Modules */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-amber-400">Módulos do Curso</h3>
                  {selectedCourse.modules.map((module, index) => {
                    const progress = getUserProgress(selectedCourse.id);
                    const isUnlocked = !progress || index <= progress.moduleIndex;
                    const isCompleted = progress && index < progress.moduleIndex;

                    return (
                      <div key={index} className="flex items-center gap-4 p-4 bg-black/20 rounded-lg">
                        <div className="flex-shrink-0">
                          {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : isUnlocked ? (
                            <div className="w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                              {index + 1}
                            </div>
                          ) : (
                            <Lock className="w-6 h-6 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <h4 className={`font-semibold ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                            Módulo {index + 1}: {module}
                          </h4>
                        </div>
                        {isUnlocked && !isCompleted && (
                          <button
                            onClick={() => completeModuleMutation.mutate({ 
                              courseId: selectedCourse.id, 
                              moduleIndex: index 
                            })}
                            disabled={completeModuleMutation.isPending}
                            className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-amber-700 hover:to-red-700 transition-colors disabled:opacity-50"
                          >
                            {completeModuleMutation.isPending ? "Concluindo..." : "Concluir"}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}