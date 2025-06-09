import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  BookOpen, 
  Star, 
  Clock, 
  Download, 
  Play, 
  Lock,
  Trophy,
  Calendar,
  Progress
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress as ProgressBar } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SiteNavigation from "@/components/SiteNavigation";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
  level?: number;
  experience?: number;
  totalCoursesCompleted?: number;
  totalHoursStudied?: number;
}

interface EnrolledCourse {
  id: number;
  courseId: number;
  title: string;
  description: string;
  type: string;
  level: number;
  progress: number;
  completedModules: number;
  totalModules: number;
  lastAccessedAt: string;
  enrolledAt: string;
  completedAt?: string;
  certificate?: string;
  featuredImage?: string;
}

interface PurchasedGrimoire {
  id: number;
  grimoireId: number;
  title: string;
  author: string;
  category: string;
  pdf_url: string;
  purchasedAt: string;
  downloads: number;
  maxDownloads: number;
}

export default function Profile() {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/user/profile"],
    retry: false,
  });

  const { data: enrolledCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/user/progress"],
    retry: false,
  });

  const { data: purchasedGrimoires = [], isLoading: grimoiresLoading } = useQuery({
    queryKey: ["/api/user/purchases"],
    retry: false,
  });

  const downloadGrimoire = useMutation({
    mutationFn: async (grimoireId: number) => {
      const response = await apiRequest(`/api/grimoires/${grimoireId}/download`, {
        method: "POST",
      });
      return response;
    },
    onSuccess: (data) => {
      // Trigger download
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download iniciado",
        description: "O grimório está sendo baixado...",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/user/purchases"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no download",
        description: error.message || "Não foi possível baixar o grimório",
        variant: "destructive",
      });
    },
  });

  const continueModule = useMutation({
    mutationFn: async ({ courseId, moduleId }: { courseId: number; moduleId: number }) => {
      return await apiRequest(`/api/courses/${courseId}/modules/${moduleId}/continue`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Progresso salvo",
        description: "Continuando de onde parou...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/progress"] });
    },
  });

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <SiteNavigation />
      
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-amber-400 mb-4">
            👤 MEU PERFIL 👤
          </h1>
          <p className="text-xl text-gray-300">
            Acompanhe sua jornada de evolução espiritual
          </p>
        </div>

        {/* Profile Header */}
        <Card className="mb-8 bg-black/60 border-purple-500/30">
          <CardHeader>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-amber-600 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-amber-400">{user?.username}</h2>
                <p className="text-gray-300">{user?.email}</p>
                <p className="text-sm text-gray-400">
                  Membro desde {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-purple-600/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-amber-400">{user?.totalCoursesCompleted || 0}</div>
                  <div className="text-sm text-gray-300">Cursos Concluídos</div>
                </div>
                <div className="bg-amber-600/20 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-400">{user?.totalHoursStudied || 0}h</div>
                  <div className="text-sm text-gray-300">Horas Estudadas</div>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-purple-500/30">
            <TabsTrigger value="overview" className="text-amber-400">
              <User className="w-4 h-4 mr-2" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="courses" className="text-amber-400">
              <BookOpen className="w-4 h-4 mr-2" />
              Meus Cursos
            </TabsTrigger>
            <TabsTrigger value="grimoires" className="text-amber-400">
              <Download className="w-4 h-4 mr-2" />
              Grimórios
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-amber-400">
              <Trophy className="w-4 h-4 mr-2" />
              Conquistas
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-black/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Cursos em Andamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {enrolledCourses.filter((course: EnrolledCourse) => !course.completedAt).length}
                  </div>
                  <p className="text-gray-300 text-sm">
                    Continue seus estudos para evoluir
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Grimórios Adquiridos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-400 mb-2">
                    {purchasedGrimoires.length}
                  </div>
                  <p className="text-gray-300 text-sm">
                    Conhecimentos ancestrais em sua biblioteca
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-black/60 border-purple-500/30">
                <CardHeader>
                  <CardTitle className="text-amber-400 flex items-center gap-2">
                    <Star className="w-5 h-5" />
                    Nível Atual
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {user?.level || 1}
                  </div>
                  <p className="text-gray-300 text-sm">
                    Experiência: {user?.experience || 0} XP
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Courses Tab */}
          <TabsContent value="courses" className="space-y-6">
            {coursesLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Carregando cursos...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {enrolledCourses.map((course: EnrolledCourse) => (
                  <Card key={course.id} className="bg-black/60 border-purple-500/30 hover:border-amber-500/50 transition-all duration-300">
                    <CardHeader>
                      {course.featuredImage && (
                        <div className="w-full h-32 bg-gray-800 rounded-lg mb-4 overflow-hidden">
                          <img 
                            src={course.featuredImage} 
                            alt={course.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-2">
                        <Badge 
                          variant="outline" 
                          className={course.completedAt ? "border-green-500 text-green-400" : "border-blue-500 text-blue-400"}
                        >
                          {course.completedAt ? "Concluído" : "Em Progresso"}
                        </Badge>
                        <Badge variant="outline" className="border-purple-500 text-purple-400">
                          Nível {course.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-amber-400 text-lg">
                        {course.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-sm">
                        {course.description}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress Bar */}
                        <div>
                          <div className="flex justify-between text-sm text-gray-300 mb-2">
                            <span>Progresso: {course.completedModules}/{course.totalModules} módulos</span>
                            <span>{course.progress}%</span>
                          </div>
                          <ProgressBar value={course.progress} className="h-2" />
                        </div>

                        {/* Course Info */}
                        <div className="flex justify-between text-sm text-gray-400">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Iniciado em {new Date(course.enrolledAt).toLocaleDateString()}
                            </span>
                          </div>
                          {course.lastAccessedAt && (
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>
                                Último acesso: {new Date(course.lastAccessedAt).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Action Button */}
                        <div className="flex gap-2">
                          {course.completedAt ? (
                            <>
                              <Button 
                                variant="outline" 
                                className="flex-1 border-green-500 text-green-400 hover:bg-green-500/10"
                              >
                                <Trophy className="w-4 h-4 mr-2" />
                                Ver Certificado
                              </Button>
                              <Button 
                                variant="outline"
                                className="border-blue-500 text-blue-400 hover:bg-blue-500/10"
                              >
                                <Play className="w-4 h-4 mr-2" />
                                Revisar
                              </Button>
                            </>
                          ) : (
                            <Button 
                              onClick={() => continueModule.mutate({ 
                                courseId: course.courseId, 
                                moduleId: course.completedModules + 1 
                              })}
                              disabled={continueModule.isPending}
                              className="flex-1 bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              {continueModule.isPending ? "Carregando..." : "Continuar"}
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {enrolledCourses.length === 0 && !coursesLoading && (
              <div className="text-center py-12">
                <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Nenhum curso adquirido
                </h3>
                <p className="text-gray-400 mb-4">
                  Explore nossa biblioteca de cursos e inicie sua jornada de conhecimento.
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ver Cursos Disponíveis
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Grimoires Tab */}
          <TabsContent value="grimoires" className="space-y-6">
            {grimoiresLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
                <p className="text-gray-300">Carregando grimórios...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {purchasedGrimoires.map((grimoire: PurchasedGrimoire) => (
                  <Card key={grimoire.id} className="bg-black/60 border-purple-500/30 hover:border-amber-500/50 transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className="border-amber-500 text-amber-400">
                          {grimoire.category}
                        </Badge>
                        <div className="text-sm text-gray-400">
                          Downloads: {grimoire.downloads}/{grimoire.maxDownloads}
                        </div>
                      </div>
                      <CardTitle className="text-amber-400 text-lg">
                        {grimoire.title}
                      </CardTitle>
                      <CardDescription className="text-gray-300 text-sm">
                        Por {grimoire.author}
                      </CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-sm text-gray-400">
                          <div className="flex items-center gap-1 mb-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              Adquirido em {new Date(grimoire.purchasedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <Button 
                          onClick={() => downloadGrimoire.mutate(grimoire.grimoireId)}
                          disabled={downloadGrimoire.isPending || grimoire.downloads >= grimoire.maxDownloads}
                          className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 disabled:opacity-50"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {downloadGrimoire.isPending ? "Baixando..." : 
                           grimoire.downloads >= grimoire.maxDownloads ? "Limite Atingido" : "Baixar PDF"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {purchasedGrimoires.length === 0 && !grimoiresLoading && (
              <div className="text-center py-12">
                <Download className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  Nenhum grimório adquirido
                </h3>
                <p className="text-gray-400 mb-4">
                  Explore nossa coleção de grimórios e expanda seu conhecimento místico.
                </p>
                <Button className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Ver Grimórios Disponíveis
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="text-center py-12">
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                Sistema de Conquistas
              </h3>
              <p className="text-gray-400">
                Em breve, acompanhe suas conquistas e marcos de evolução espiritual.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}