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
          title: "Nível 3: Aprofundamento",
          is_completed: false,
          progress_percentage: 25
        }
      ]
    },
    {
      id: 2,
      title: "Ritual e Magia Cerimonial",
      slug: "ritual-magia-cerimonial",
      enrollment_type: "level",
      progress_percentage: 40,
      current_level: 1,
      total_levels: 2,
      completed_levels: [],
      enrolled_date: "2024-03-15",
      last_accessed: "2024-06-07",
      certificate_earned: false,
      levels: [
        {
          level_number: 1,
          title: "Nível 1: Fundamentos Rituais",
          is_completed: false,
          progress_percentage: 40
        }
      ]
    }
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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">🎓</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              PROFILUS STUDENTIS
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
              Jornada do Iniciado {mockProfile.magical_name}
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Acompanhe sua <strong className="text-amber-400">evolução espiritual</strong> e o 
              <strong className="text-red-400"> progresso</strong> em sua caminhada pelo conhecimento luciferiano.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Per Aspera Ad Astra"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Através das dificuldades, às estrelas
              </p>
            </div>
          </div>
        </div>

        {/* Student Stats */}
        <div className="floating-card max-w-6xl w-full mb-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6 text-center">
              Status do Iniciado
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
              <div className="text-center">
                <User className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-cinzel-decorative text-amber-300">Nome Mágico</h4>
                <p className="text-lg font-bold text-amber-400">{mockProfile.magical_name}</p>
                <p className="text-xs text-gray-400">Nível {mockProfile.initiation_level}</p>
              </div>
              
              <div className="text-center">
                <BookOpen className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-cinzel-decorative text-amber-300">Cursos</h4>
                <p className="text-lg font-bold text-amber-400">{mockProfile.total_courses}</p>
                <p className="text-xs text-gray-400">Matriculados</p>
              </div>
              
              <div className="text-center">
                <CheckCircle className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-cinzel-decorative text-amber-300">Completos</h4>
                <p className="text-lg font-bold text-amber-400">{mockProfile.completed_courses}</p>
                <p className="text-xs text-gray-400">Finalizados</p>
              </div>
              
              <div className="text-center">
                <Clock className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-cinzel-decorative text-amber-300">Estudo</h4>
                <p className="text-lg font-bold text-amber-400">{mockProfile.total_study_hours}h</p>
                <p className="text-xs text-gray-400">Dedicadas</p>
              </div>
              
              <div className="text-center">
                <Award className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-cinzel-decorative text-amber-300">Certificados</h4>
                <p className="text-lg font-bold text-amber-400">{mockProfile.certificates_earned}</p>
                <p className="text-xs text-gray-400">Conquistados</p>
              </div>
              
              <div className="text-center">
                <TrendingUp className="w-10 h-10 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-cinzel-decorative text-amber-300">Sequência</h4>
                <p className="text-lg font-bold text-amber-400">{mockProfile.current_streak}</p>
                <p className="text-xs text-gray-400">Dias consecutivos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-amber-600/30">
              <TabsTrigger 
                value="courses"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Meus Cursos
              </TabsTrigger>
              <TabsTrigger 
                value="achievements"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Conquistas
              </TabsTrigger>
              <TabsTrigger 
                value="timeline"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Linha do Tempo
              </TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6">Cursos em Andamento</h3>
                
                <div className="grid grid-cols-1 gap-6">
                  {mockCourses.map((course) => (
                    <Card key={course.id} className="bg-black/20 border-amber-500/20">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-amber-400">{course.title}</CardTitle>
                          <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                            {course.enrollment_type === "full_course" ? "Curso Completo" : "Nível Individual"}
                          </Badge>
                        </div>
                        <CardDescription className="text-gray-300">
                          Progresso: {course.progress_percentage}% • Nível atual: {course.current_level} de {course.total_levels}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <Progress value={course.progress_percentage} className="mb-4" />
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h5 className="font-semibold text-amber-300 mb-2">Níveis do Curso:</h5>
                              <div className="space-y-2">
                                {course.levels.map((level) => (
                                  <div key={level.level_number} className="flex items-center justify-between py-2 px-3 bg-black/20 rounded">
                                    <div className="flex items-center">
                                      {level.is_completed ? (
                                        <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                                      ) : (
                                        <Play className="w-4 h-4 text-amber-400 mr-2" />
                                      )}
                                      <span className="text-gray-300">{level.title}</span>
                                    </div>
                                    <span className="text-sm text-gray-400">{level.progress_percentage}%</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h5 className="font-semibold text-amber-300 mb-2">Informações:</h5>
                              <div className="space-y-2 text-sm text-gray-400">
                                <p>📅 Matriculado: {new Date(course.enrolled_date).toLocaleDateString('pt-BR')}</p>
                                <p>🕐 Último acesso: {new Date(course.last_accessed).toLocaleDateString('pt-BR')}</p>
                                <p>🏆 Certificado: {course.certificate_earned ? "✓ Conquistado" : "⏳ Em progresso"}</p>
                                <p>📈 Níveis concluídos: {course.completed_levels.length} de {course.total_levels}</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 pt-4">
                            <Link href={`/curso/${course.slug}`}>
                              <Button className="bg-amber-600 hover:bg-amber-700 text-black" size="sm">
                                <Play className="w-4 h-4 mr-2" />
                                Continuar Estudos
                              </Button>
                            </Link>
                            {course.certificate_earned && (
                              <Button variant="outline" className="border-amber-500/30 text-amber-300" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                Baixar Certificado
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {mockCourses.length === 0 && (
                  <div className="text-center text-gray-400 py-12">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Nenhum curso em andamento</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="achievements" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6 text-center">
                  Conquistas do Iniciado
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-400/30">
                    <CardContent className="p-6 text-center">
                      <Award className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-amber-300 mb-2">Primeiro Passo</h4>
                      <p className="text-sm text-gray-300">Completou o primeiro nível de um curso</p>
                      <Badge className="mt-3 bg-amber-600 text-black">Conquistado</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-gradient-to-br from-purple-900/20 to-indigo-900/20 border-purple-400/30">
                    <CardContent className="p-6 text-center">
                      <Star className="w-12 h-12 text-purple-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-purple-300 mb-2">Dedicação</h4>
                      <p className="text-sm text-gray-300">Estudou por 7 dias consecutivos</p>
                      <Badge className="mt-3 bg-purple-600 text-white">Conquistado</Badge>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 border-gray-500/20">
                    <CardContent className="p-6 text-center">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-semibold text-gray-300 mb-2">Scholar</h4>
                      <p className="text-sm text-gray-400">Complete 3 cursos diferentes</p>
                      <Badge variant="outline" className="mt-3 border-gray-500">Em progresso</Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6 text-center">
                  Linha do Tempo da Jornada
                </h3>
                
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-400 to-red-400"></div>
                  
                  <div className="space-y-8">
                    <div className="relative flex items-start pl-12">
                      <div className="absolute left-0 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-black" />
                      </div>
                      <Card className="bg-black/20 border-amber-500/20 flex-1">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-amber-400 font-semibold">Registro no Templo</h4>
                              <p className="text-gray-300 text-sm">Iniciou sua jornada no Templo do Abismo</p>
                            </div>
                            <span className="text-xs text-gray-400">15/01/2024</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="relative flex items-start pl-12">
                      <div className="absolute left-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                        <BookOpen className="w-4 h-4 text-white" />
                      </div>
                      <Card className="bg-black/20 border-purple-500/20 flex-1">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-purple-400 font-semibold">Primeira Matrícula</h4>
                              <p className="text-gray-300 text-sm">Matriculou-se em "Fundamentos do Luciferianismo"</p>
                            </div>
                            <span className="text-xs text-gray-400">20/01/2024</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="relative flex items-start pl-12">
                      <div className="absolute left-0 w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-4 h-4 text-white" />
                      </div>
                      <Card className="bg-black/20 border-green-500/20 flex-1">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-green-400 font-semibold">Primeiro Nível Concluído</h4>
                              <p className="text-gray-300 text-sm">Completou o Nível 1: Fundamentos Teóricos</p>
                            </div>
                            <span className="text-xs text-gray-400">15/02/2024</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="relative flex items-start pl-12">
                      <div className="absolute left-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <Card className="bg-black/20 border-blue-500/20 flex-1">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-blue-400 font-semibold">Nova Matrícula</h4>
                              <p className="text-gray-300 text-sm">Iniciou "Ritual e Magia Cerimonial"</p>
                            </div>
                            <span className="text-xs text-gray-400">15/03/2024</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "A jornada de mil milhas começa com um único passo na escuridão"
            </p>
            <p className="text-amber-400 font-semibold">
              — Provérbio do Iniciado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}