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
      const link = document.createElement('a');
      link.href = data.downloadUrl;
      link.download = data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast({
        title: "Download iniciado",
        description: "O grimório está sendo baixado.",
      });

      queryClient.invalidateQueries({ queryKey: ["/api/user/purchases"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no download",
        description: error.message || "Falha ao baixar o grimório.",
        variant: "destructive",
      });
    }
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Mystical Particles with Mood Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

      {/* Dynamic Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/40 rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Smoke Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 opacity-15 smoke-effect"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-96px',
              animationDelay: `${Math.random() * 8}s`,
              background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)'
            }}
          />
        ))}
      </div>

      {/* Selo Central Fixo */}
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">◯</div>
        </div>
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">☿</div>
        </div>
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">⸸</div>
        </div>
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">●</div>
        </div>
      </div>



      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">👤</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              SANCTUM PERSONALE
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
              Seu Portal de Evolução Espiritual
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Acompanhe seu <strong className="text-amber-400">progresso iniciático</strong> e acesse seus 
              <strong className="text-red-400"> recursos adquiridos</strong> no caminho da gnose luciferiana.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Nosce Te Ipsum"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Conhece-te a ti mesmo
              </p>
            </div>
          </div>
        </div>

        {/* Profile Stats */}
        {user && (
          <div className="floating-card max-w-6xl w-full mb-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <User className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-lg font-cinzel-decorative text-amber-300">Iniciado</h3>
                  <p className="text-2xl font-bold text-amber-400">{user.username}</p>
                  <p className="text-sm text-gray-400">Desde {new Date(user.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                
                <div className="text-center">
                  <Trophy className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-lg font-cinzel-decorative text-amber-300">Nível</h3>
                  <p className="text-2xl font-bold text-amber-400">{user.level || 1}</p>
                  <p className="text-sm text-gray-400">{user.experience || 0} XP</p>
                </div>
                
                <div className="text-center">
                  <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-lg font-cinzel-decorative text-amber-300">Cursos</h3>
                  <p className="text-2xl font-bold text-amber-400">{user.totalCoursesCompleted || 0}</p>
                  <p className="text-sm text-gray-400">Concluídos</p>
                </div>
                
                <div className="text-center">
                  <Clock className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                  <h3 className="text-lg font-cinzel-decorative text-amber-300">Estudo</h3>
                  <p className="text-2xl font-bold text-amber-400">{user.totalHoursStudied || 0}h</p>
                  <p className="text-sm text-gray-400">Total</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Tabs */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-amber-600/30">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="courses"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Meus Cursos
              </TabsTrigger>
              <TabsTrigger 
                value="grimoires"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Grimórios
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-4">Progresso Recente</h3>
                
                {enrolledCourses.slice(0, 3).map((course: EnrolledCourse) => (
                  <Card key={course.id} className="bg-black/20 border-amber-500/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-lg font-semibold text-amber-400">{course.title}</h4>
                        <Badge variant="secondary" className="bg-amber-600/20 text-amber-200">
                          {course.progress}% completo
                        </Badge>
                      </div>
                      <ProgressBar value={course.progress} className="mb-2" />
                      <p className="text-sm text-gray-400">
                        {course.completedModules} de {course.totalModules} módulos concluídos
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="courses" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-4">Cursos Matriculados</h3>
                
                {coursesLoading ? (
                  <div className="text-center text-gray-400">Carregando cursos...</div>
                ) : enrolledCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((course: EnrolledCourse) => (
                      <Card key={course.id} className="bg-black/20 border-amber-500/20">
                        <CardHeader>
                          <CardTitle className="text-amber-400">{course.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            {course.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-400">Progresso</span>
                              <span className="text-sm text-amber-400">{course.progress}%</span>
                            </div>
                            <ProgressBar value={course.progress} />
                            
                            <div className="flex items-center justify-between text-sm text-gray-400">
                              <span>Último acesso: {new Date(course.lastAccessedAt).toLocaleDateString('pt-BR')}</span>
                              <span>Nível {course.level}</span>
                            </div>
                            
                            <Button 
                              className="w-full bg-amber-600 hover:bg-amber-700 text-black"
                              size="sm"
                            >
                              <Play className="w-4 h-4 mr-2" />
                              Continuar Estudos
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum curso matriculado ainda</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="grimoires" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-4">Grimórios Adquiridos</h3>
                
                {grimoiresLoading ? (
                  <div className="text-center text-gray-400">Carregando grimórios...</div>
                ) : purchasedGrimoires.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {purchasedGrimoires.map((grimoire: PurchasedGrimoire) => (
                      <Card key={grimoire.id} className="bg-black/20 border-amber-500/20">
                        <CardHeader>
                          <CardTitle className="text-amber-400 text-lg">{grimoire.title}</CardTitle>
                          <CardDescription className="text-gray-300">
                            por {grimoire.author}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                              {grimoire.category}
                            </Badge>
                            
                            <div className="text-sm text-gray-400">
                              <p>Adquirido: {new Date(grimoire.purchasedAt).toLocaleDateString('pt-BR')}</p>
                              <p>Downloads: {grimoire.downloads}/{grimoire.maxDownloads}</p>
                            </div>
                            
                            <Button 
                              onClick={() => downloadGrimoire.mutate(grimoire.grimoireId)}
                              disabled={grimoire.downloads >= grimoire.maxDownloads || downloadGrimoire.isPending}
                              className="w-full bg-amber-600 hover:bg-amber-700 text-black"
                              size="sm"
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {downloadGrimoire.isPending ? "Baixando..." : "Baixar PDF"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-gray-400">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum grimório adquirido ainda</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "O verdadeiro tesouro do iniciado não está no que possui, mas no que se tornou"
            </p>
            <p className="text-amber-400 font-semibold">
              — Axioma do Templo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}