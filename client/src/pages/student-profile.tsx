import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Clock, Star, Award, Play, Download, 
  CheckCircle, TrendingUp, Calendar, User
} from "lucide-react";
import SiteNavigation from "@/components/SiteNavigation";

interface StudentCourse {
  id: number;
  title: string;
  slug: string;
  enrollment_type: "level" | "full_course";
  progress_percentage: number;
  current_level: number;
  total_levels: number;
  completed_levels: number[];
  enrolled_date: string;
  last_accessed: string;
  certificate_earned: boolean;
  levels: {
    level_number: number;
    title: string;
    is_completed: boolean;
    completion_date?: string;
    progress_percentage: number;
  }[];
}

interface StudentProfile {
  id: number;
  username: string;
  email: string;
  magical_name?: string;
  initiation_level: number;
  member_type: string;
  join_date: string;
  total_courses: number;
  completed_courses: number;
  total_study_hours: number;
  certificates_earned: number;
  current_streak: number;
}

export default function StudentProfile() {
  const [selectedTab, setSelectedTab] = useState("courses");

  // Mock data do perfil do estudante
  const mockProfile: StudentProfile = {
    id: 1,
    username: "estudante_sombrio",
    email: "estudante@email.com",
    magical_name: "Umbra Seeker",
    initiation_level: 2,
    member_type: "member",
    join_date: "2024-01-15",
    total_courses: 3,
    completed_courses: 1,
    total_study_hours: 45,
    certificates_earned: 4,
    current_streak: 7
  };

  // Mock data dos cursos do estudante
  const mockCourses: StudentCourse[] = [
    {
      id: 1,
      title: "Fundamentos do Luciferianismo",
      slug: "fundamentos-luciferianismo",
      enrollment_type: "full_course",
      progress_percentage: 75,
      current_level: 3,
      total_levels: 3,
      completed_levels: [1, 2],
      enrolled_date: "2024-01-20",
      last_accessed: "2024-06-08",
      certificate_earned: false,
      levels: [
        {
          level_number: 1,
          title: "Nível 1: Fundamentos Teóricos",
          is_completed: true,
          completion_date: "2024-02-15",
          progress_percentage: 100
        },
        {
          level_number: 2,
          title: "Nível 2: Práticas Iniciais",
          is_completed: true,
          completion_date: "2024-04-10",
          progress_percentage: 100
        },
        {
          level_number: 3,
          title: "Nível 3: Integração Avançada",
          is_completed: false,
          progress_percentage: 25
        }
      ]
    },
    {
      id: 2,
      title: "Tarot Luciferiano Avançado",
      slug: "tarot-luciferiano-avancado",
      enrollment_type: "level",
      progress_percentage: 100,
      current_level: 1,
      total_levels: 4,
      completed_levels: [1],
      enrolled_date: "2024-03-01",
      last_accessed: "2024-05-20",
      certificate_earned: true,
      levels: [
        {
          level_number: 1,
          title: "Nível 1: Fundamentos do Tarot",
          is_completed: true,
          completion_date: "2024-05-20",
          progress_percentage: 100
        }
      ]
    },
    {
      id: 3,
      title: "Magia Cerimonial das Sombras",
      slug: "magia-cerimonial-sombras",
      enrollment_type: "level",
      progress_percentage: 60,
      current_level: 1,
      total_levels: 5,
      completed_levels: [],
      enrolled_date: "2024-05-15",
      last_accessed: "2024-06-09",
      certificate_earned: false,
      levels: [
        {
          level_number: 1,
          title: "Nível 1: Fundamentos Cerimoniais",
          is_completed: false,
          progress_percentage: 60
        }
      ]
    }
  ];

  const getInitiationLevelName = (level: number) => {
    switch (level) {
      case 0: return "Aspirante";
      case 1: return "Iniciado";
      case 2: return "Adepto";
      case 3: return "Mentor";
      case 4: return "Mestre";
      default: return "Desconhecido";
    }
  };

  const getNextLevel = (current: number) => {
    const levels = ["Aspirante", "Iniciado", "Adepto", "Mentor", "Mestre"];
    return current < 4 ? levels[current + 1] : "Grão-Mestre";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateOverallProgress = () => {
    if (mockCourses.length === 0) return 0;
    const totalProgress = mockCourses.reduce((sum, course) => sum + course.progress_percentage, 0);
    return Math.round(totalProgress / mockCourses.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <SiteNavigation />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Profile Header */}
        <div className="grid lg:grid-cols-4 gap-6 mb-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader className="text-center">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-600 to-amber-600 rounded-full flex items-center justify-center mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <CardTitle className="text-xl text-white">{mockProfile.magical_name || mockProfile.username}</CardTitle>
                <CardDescription className="text-gray-400">
                  {getInitiationLevelName(mockProfile.initiation_level)} • {mockProfile.member_type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <Badge className="bg-purple-600 text-white">
                    Nível {mockProfile.initiation_level}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Membro desde:</span>
                    <span className="text-white">{formatDate(mockProfile.join_date)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Sequência atual:</span>
                    <span className="text-amber-400">{mockProfile.current_streak} dias</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Cards */}
          <div className="lg:col-span-3 grid md:grid-cols-4 gap-4">
            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{mockProfile.total_courses}</div>
                <div className="text-xs text-gray-400">Cursos Ativos</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{mockProfile.completed_courses}</div>
                <div className="text-xs text-gray-400">Concluídos</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Clock className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{mockProfile.total_study_hours}h</div>
                <div className="text-xs text-gray-400">Estudadas</div>
              </CardContent>
            </Card>

            <Card className="bg-black/40 border-purple-500/30">
              <CardContent className="p-4 text-center">
                <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{mockProfile.certificates_earned}</div>
                <div className="text-xs text-gray-400">Certificados</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="bg-black/40 border-purple-500/30 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Progresso nos Cursos</span>
                  <span className="text-sm text-white">{calculateOverallProgress()}%</span>
                </div>
                <Progress value={calculateOverallProgress()} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-400">Próximo Nível: {getNextLevel(mockProfile.initiation_level)}</span>
                  <span className="text-sm text-white">75%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/40">
            <TabsTrigger value="courses">Meus Cursos</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
            <TabsTrigger value="activity">Atividade</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="mt-6">
            <div className="space-y-6">
              {mockCourses.map((course) => (
                <Card key={course.id} className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white mb-2">{course.title}</CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mb-3">
                          <Badge variant="outline" className={course.enrollment_type === "full_course" ? "border-amber-400 text-amber-400" : "border-purple-400 text-purple-400"}>
                            {course.enrollment_type === "full_course" ? "Curso Completo" : "Nível Individual"}
                          </Badge>
                          <span>Matriculado em {formatDate(course.enrolled_date)}</span>
                          <span>Último acesso: {formatDate(course.last_accessed)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-400">Progresso:</span>
                          <span className="text-sm text-white">{course.progress_percentage}%</span>
                        </div>
                        <Progress value={course.progress_percentage} className="h-2 mb-3" />
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Link href={`/curso/${course.slug}`}>
                          <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                            <Play className="w-4 h-4 mr-2" />
                            Continuar
                          </Button>
                        </Link>
                        {course.certificate_earned && (
                          <Button size="sm" variant="outline" className="border-amber-400 text-amber-400">
                            <Download className="w-4 h-4 mr-2" />
                            Certificado
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-white">Níveis:</h4>
                      {course.levels.map((level) => (
                        <div key={level.level_number} className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                          <div className="flex items-center gap-3">
                            {level.is_completed ? (
                              <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : (
                              <div className="w-5 h-5 rounded-full border-2 border-purple-400" />
                            )}
                            <div>
                              <span className="text-sm font-medium text-white">{level.title}</span>
                              {level.completion_date && (
                                <p className="text-xs text-gray-400">Concluído em {formatDate(level.completion_date)}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-white">{level.progress_percentage}%</div>
                            <Progress value={level.progress_percentage} className="h-1 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {mockCourses.length === 0 && (
                <Card className="bg-black/40 border-purple-500/30">
                  <CardContent className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg text-white mb-2">Nenhum curso matriculado</h3>
                    <p className="text-gray-400 mb-4">Explore nossa Academia e inicie sua jornada de conhecimento.</p>
                    <Link href="/cursos">
                      <Button className="bg-purple-600 hover:bg-purple-700">
                        Explorar Cursos
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Certificados de exemplo */}
              <Card className="bg-black/40 border-amber-500/30">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Fundamentos Teóricos</h3>
                  <p className="text-sm text-gray-400 mb-3">Nível 1 - Fundamentos do Luciferianismo</p>
                  <p className="text-xs text-gray-500 mb-4">Emitido em 15/02/2024</p>
                  <Button size="sm" variant="outline" className="border-amber-400 text-amber-400">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-amber-500/30">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Práticas Iniciais</h3>
                  <p className="text-sm text-gray-400 mb-3">Nível 2 - Fundamentos do Luciferianismo</p>
                  <p className="text-xs text-gray-500 mb-4">Emitido em 10/04/2024</p>
                  <Button size="sm" variant="outline" className="border-amber-400 text-amber-400">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-black/40 border-amber-500/30">
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                  <h3 className="font-semibold text-white mb-2">Tarot Luciferiano</h3>
                  <p className="text-sm text-gray-400 mb-3">Nível 1 - Tarot Avançado</p>
                  <p className="text-xs text-gray-500 mb-4">Emitido em 20/05/2024</p>
                  <Button size="sm" variant="outline" className="border-amber-400 text-amber-400">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Atividade Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 bg-gray-900/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-white">Progresso no curso "Magia Cerimonial das Sombras"</p>
                      <p className="text-xs text-gray-400">Hoje às 14:30</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-900/30 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-white">Concluído módulo "História do Tarot"</p>
                      <p className="text-xs text-gray-400">Ontem às 19:45</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 bg-gray-900/30 rounded-lg">
                    <Award className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-white">Certificado "Tarot Luciferiano" emitido</p>
                      <p className="text-xs text-gray-400">2 dias atrás</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}