import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Lock, CheckCircle, Star, Flame, Crown, Shield, Eye } from "lucide-react";
import MysticalGate from "@/components/MysticalGate";
// import SiteNavigation from "@/components/SiteNavigation";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";

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
  price_brl: number;
}

interface UserProgress {
  courseId: number;
  moduleIndex: number;
  completed: boolean;
}

function CoursesContent() {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ['/api/courses'],
  });

  const { data: userProgress = [] } = useQuery<UserProgress[]>({
    queryKey: ['/api/user/progress'],
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/progress'] });
    },
  });

  const getUserProgress = (courseId: number) => {
    return userProgress.find((p: UserProgress) => p.courseId === courseId);
  };

  const canAccessCourse = (course: Course): boolean => {
    if (course.level === 1) return true;
    
    const previousLevelCourse = courses.find((c: Course) => c.level === course.level - 1);
    if (!previousLevelCourse) return true;
    
    const prevProgress = getUserProgress(previousLevelCourse.id);
    return prevProgress?.completed || false;
  };

  const getCourseTypeInfo = (course: Course) => {
    switch (course.level) {
      case 1:
        return {
          type: "Iniciação Primária",
          icon: <Star className="w-5 h-5" />,
          bgClass: "from-blue-900 to-black",
          borderClass: "border-blue-500/50",
          textClass: "text-blue-300"
        };
      case 2:
        return {
          type: "Despertar Interior",
          icon: <Eye className="w-5 h-5" />,
          bgClass: "from-purple-900 to-black",
          borderClass: "border-purple-500/50",
          textClass: "text-purple-300"
        };
      case 3:
        return {
          type: "Gnose Intermediária",
          icon: <Shield className="w-5 h-5" />,
          bgClass: "from-red-900 to-black",
          borderClass: "border-red-500/50",
          textClass: "text-red-300"
        };
      case 4:
        return {
          type: "Mistérios Avançados",
          icon: <Flame className="w-5 h-5" />,
          bgClass: "from-orange-900 to-black",
          borderClass: "border-orange-500/50",
          textClass: "text-orange-300"
        };
      default:
        return {
          type: "Mestria Abissal",
          icon: <Crown className="w-5 h-5" />,
          bgClass: "from-amber-900 to-black",
          borderClass: "border-amber-500/50",
          textClass: "text-amber-300"
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="rotating-seal w-16 h-16 mx-auto mb-4">
            <GraduationCap className="w-full h-full text-red-500" />
          </div>
          <p className="text-gray-400">Preparando os Ensinamentos Ancestrais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <SiteNavigation />
      
      {/* Mystical background */}
      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-purple-950/20 via-black to-amber-950/20"></div>
        <div className="mystical-particles"></div>
      </div>

      {/* Central rotating seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
          <img 
            src="/seal.png" 
            alt="Selo dos Ensinamentos" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-cinzel font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-amber-500 to-red-400">
              ACADEMIA LUCIFERIANA
            </h1>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Trilha sombria onde almas corajosas descendem através dos sete círculos da gnose abissal. 
              Cada curso fragmenta a realidade percebida, revelando verdades que podem destruir 
              a sanidade dos fracos e illuminar apenas os verdadeiramente preparados.
            </p>
          </div>

          {/* Progress Overview */}
          <div className="glass-effect p-6 border border-purple-900/50 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-cinzel text-purple-400">Jornada do Iniciado</h3>
              <div className="text-amber-400">
                Nível {Math.max(...userProgress.map((p: UserProgress) => p.completed ? courses.find(c => c.id === p.courseId)?.level || 0 : 0), 0)} / 7
              </div>
            </div>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7].map((level) => {
                const levelCourse = courses.find(c => c.level === level);
                const progress = levelCourse ? getUserProgress(levelCourse.id) : null;
                const isCompleted = progress?.completed || false;
                const isAccessible = levelCourse ? canAccessCourse(levelCourse) : false;
                
                return (
                  <div
                    key={level}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-green-600 text-white'
                        : isAccessible
                        ? 'bg-amber-600 text-black'
                        : 'bg-gray-800 text-gray-400'
                    }`}
                  >
                    {level}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const progress = getUserProgress(course.id);
              const isEnrolled = !!progress;
              const isCompleted = progress?.completed || false;
              const canAccess = canAccessCourse(course);
              const typeInfo = getCourseTypeInfo(course);

              return (
                <Card key={course.id} className={`glass-effect ${typeInfo.borderClass} hover:shadow-2xl transition-all duration-300 overflow-hidden`}>
                  {/* Course Header */}
                  <div className={`h-32 bg-gradient-to-br ${typeInfo.bgClass} relative flex items-center justify-center`}>
                    <div className="text-center">
                      {typeInfo.icon}
                      <div className={`text-sm ${typeInfo.textClass} mt-2 font-cinzel`}>
                        {typeInfo.type}
                      </div>
                    </div>
                    
                    {/* Level Badge */}
                    <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-amber-400">
                      Círculo {course.level}
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      {isCompleted ? (
                        <Badge className="bg-green-800 text-green-100">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Concluído
                        </Badge>
                      ) : isEnrolled ? (
                        <Badge className="bg-blue-800 text-blue-100">
                          Em Progresso
                        </Badge>
                      ) : !canAccess ? (
                        <Badge className="bg-gray-800 text-gray-400">
                          <Lock className="w-3 h-3 mr-1" />
                          Selado
                        </Badge>
                      ) : null}
                    </div>
                  </div>

                  <CardHeader>
                    <CardTitle className={`font-cinzel ${typeInfo.textClass} text-lg`}>
                      {course.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      {course.description}
                    </p>

                    {/* Modules Preview */}
                    {course.modules && course.modules.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-2">Ensinamentos Inclusos:</div>
                        <div className="text-xs text-gray-400 space-y-1">
                          {course.modules.slice(0, 3).map((module: string, index: number) => (
                            <div key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-amber-500 rounded-full"></div>
                              {module}
                            </div>
                          ))}
                          {course.modules.length > 3 && (
                            <div className="text-gray-500">... e mais {course.modules.length - 3} módulos</div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Requirements */}
                    {course.requirements && course.requirements.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Pré-requisitos:</div>
                        <div className="text-xs text-gray-400">
                          {course.requirements.join(", ")}
                        </div>
                      </div>
                    )}

                    {/* Rewards */}
                    {course.rewards && course.rewards.length > 0 && (
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">Recompensas da Iniciação:</div>
                        <div className="text-xs text-amber-400">
                          {course.rewards.join(", ")}
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <div className="mt-6">
                      {!canAccess ? (
                        <button disabled className="w-full bg-gray-600 text-gray-400 py-2 rounded-lg cursor-not-allowed font-cinzel">
                          <Lock className="w-4 h-4 inline mr-2" />
                          Círculo Selado
                        </button>
                      ) : !isEnrolled ? (
                        <Button
                          onClick={() => enrollMutation.mutate(course.id)}
                          disabled={enrollMutation.isPending}
                          className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white hover:from-amber-700 hover:to-red-700 font-cinzel"
                        >
                          {enrollMutation.isPending ? "Iniciando..." : `Iniciar Jornada (R$ ${(course.price_brl / 100).toFixed(2)})`}
                        </Button>
                      ) : isCompleted ? (
                        <Button
                          onClick={() => setSelectedCourse(course)}
                          className="w-full bg-green-600 text-white hover:bg-green-700 font-cinzel"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Revisitar Ensinamentos
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setSelectedCourse(course)}
                          className="w-full bg-blue-600 text-white hover:bg-blue-700 font-cinzel"
                        >
                          <GraduationCap className="w-4 h-4 inline mr-2" />
                          Continuar Estudos
                        </Button>
                      )}
                    </div>

                    {/* Mystical Footer */}
                    <div className="mt-4 pt-3 border-t border-gray-800 text-xs text-gray-500 text-center">
                      "A sabedoria é conquistada através da dedicação aos mistérios"
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Special Achievement Notice */}
          {userProgress.filter((p: UserProgress) => p.completed).length >= 3 && (
            <div className="mt-8 glass-effect p-6 border border-amber-900/50 text-center">
              <Crown className="w-8 h-8 mx-auto mb-3 text-amber-500" />
              <h3 className="text-xl font-cinzel text-amber-400 mb-2">Portal Desbloqueado</h3>
              <p className="text-gray-300 mb-4">
                Sua dedicação aos estudos ancestrais desbloqueou acesso à Bibliotheca Secreta.
                Textos proibidos aguardam os verdadeiros iniciados.
              </p>
              <Button className="bg-gradient-to-r from-purple-800 to-amber-800 hover:from-purple-700 hover:to-amber-700 font-cinzel">
                Acessar Bibliotheca Secreta
              </Button>
            </div>
          )}

          {/* Empty State */}
          {courses.length === 0 && (
            <div className="text-center py-16">
              <Lock className="w-16 h-16 mx-auto mb-4 text-gray-600" />
              <h3 className="text-xl font-cinzel text-gray-400 mb-2">Currículo em Preparação</h3>
              <p className="text-gray-600">
                Os mestres estão organizando os ensinamentos ancestrais para os novos iniciados.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Courses() {
  return (
    <MysticalGate
      title="ACADEMIA LUCIFERIANA"
      description="Academia das trevas onde almas registradas transcendem os sete círculos da gnose abissal. Cada curso desvela mistérios que podem fragmentar a mente despreparada, conduzindo apenas os corajosos através da illuminação sombria."
      mysticText="Que a luz interior guie aqueles que buscam transcender as limitações da ignorância"
      icon={<GraduationCap className="w-8 h-8 text-purple-400" />}
    >
      <CoursesContent />
    </MysticalGate>
  );
}