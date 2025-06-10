import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, Users, Star, Play, Lock, Crown } from "lucide-react";
// import SiteNavigation from "../components/SiteNavigation";
import Footer from "../components/footer";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses } from "@/hooks/useSupabaseData";

export default function CoursesSupabase() {
  const { user, isAuthenticated } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState("all");

  // Fetch courses using Supabase
  const { data: courses = [], isLoading } = useCourses();

  // Filter courses by level
  const filteredCourses = courses.filter(course => 
    selectedLevel === "all" || course.level === parseInt(selectedLevel)
  );

  const levels = [
    { value: "all", label: "Todos os Níveis" },
    { value: "1", label: "Iniciante" },
    { value: "2", label: "Intermediário" },
    { value: "3", label: "Avançado" },
    { value: "4", label: "Mestre" }
  ];

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
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 animate-pulse font-['Cinzel_Decorative']">
            DISCIPLINAE LUCIFERIANAE
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Sete círculos de conhecimento forbidden onde almas destemidas transcendem os limites da consciência mortal através da gnose luciferiana.
          </p>
        </div>

        {/* Level Filter */}
        <div className="mb-8">
          <Tabs value={selectedLevel} onValueChange={setSelectedLevel} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-black/40 border border-gold/20">
              {levels.map((level) => (
                <TabsTrigger 
                  key={level.value} 
                  value={level.value}
                  className="text-gray-300 data-[state=active]:text-gold data-[state=active]:bg-gold/20"
                >
                  {level.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Courses Grid */}
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
            {filteredCourses.map((course) => {
              const isEnrolled = user?.id && course.enrolled_users?.includes(user.id);
              const canAccess = !course.requires_initiation || 
                               (user?.initiation_level && user.initiation_level >= course.level);

              return (
                <Card key={course.id} className="bg-black/40 border-gold/20 backdrop-blur-sm hover:border-gold/40 transition-all group">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge 
                        variant={course.level <= 2 ? "secondary" : "default"}
                        className={`${
                          course.level <= 2 
                            ? "bg-green-900/50 text-green-400 border-green-600/30" 
                            : "bg-red-900/50 text-red-400 border-red-600/30"
                        }`}
                      >
                        Nível {course.level}
                      </Badge>
                      {course.level > 2 && <Crown className="w-4 h-4 text-gold" />}
                    </div>
                    
                    <CardTitle className="text-gold font-cinzel-decorative group-hover:text-orange-400 transition-colors">
                      {course.title}
                    </CardTitle>
                    
                    <CardDescription className="text-gray-300 font-crimson">
                      {course.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-4">
                      {/* Course Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {course.duration_weeks} semanas
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-4 h-4" />
                          {course.modules?.length || 0} módulos
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {course.enrolled_count || 0}
                        </div>
                      </div>

                      {/* Progress Bar (if enrolled) */}
                      {isEnrolled && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Progresso</span>
                            <span className="text-gold">0%</span>
                          </div>
                          <Progress value={0} className="h-2 bg-gray-800" />
                        </div>
                      )}

                      {/* Action Button */}
                      <Button
                        className={`w-full ${
                          isEnrolled
                            ? "bg-green-700 hover:bg-green-600 text-white"
                            : "bg-gradient-to-r from-gold/80 to-orange-600/80 hover:from-gold hover:to-orange-600 text-black"
                        } font-cinzel-regular`}
                        onClick={() => {
                          if (course.price > 0 && !isAuthenticated) {
                            window.location.href = '/login';
                            return;
                          }
                          // Handle enrollment/purchase logic here
                        }}
                      >
                        {!canAccess ? (
                          <>
                            <Lock className="w-4 h-4 mr-2" />
                            Iniciação Requerida
                          </>
                        ) : isEnrolled ? (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Continuar
                          </>
                        ) : course.price > 0 ? (
                          `Adquirir - ${course.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}`
                        ) : (
                          "Iniciar Gratuitamente"
                        )}
                      </Button>

                      {/* Additional Info */}
                      {course.requires_initiation && (
                        <p className="text-xs text-yellow-400 text-center font-crimson">
                          Requer iniciação de nível {course.level}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {filteredCourses.length === 0 && !isLoading && (
          <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-cinzel-decorative text-gray-400 mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-gray-500 font-crimson">
                Não há cursos disponíveis para este nível
              </p>
            </CardContent>
          </Card>
        )}

        {/* Information Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
                <Star className="w-5 h-5" />
                Sistema de Iniciação
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-300 font-crimson">
                <p><strong className="text-gold">Nível 1:</strong> Fundamentos e primeiros passos</p>
                <p><strong className="text-gold">Nível 2:</strong> Práticas intermediárias</p>
                <p><strong className="text-gold">Nível 3:</strong> Conhecimentos avançados</p>
                <p><strong className="text-gold">Nível 4:</strong> Mistérios dos mestres</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black/40 border-gold/20 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-gold font-cinzel-decorative flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Benefícios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-gray-300 font-crimson">
                <p>• Progressão estruturada no conhecimento</p>
                <p>• Acesso vitalício ao conteúdo</p>
                <p>• Certificados de conclusão</p>
                <p>• Comunidade exclusiva de praticantes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}