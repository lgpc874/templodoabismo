import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, Clock, Star, Users, ArrowRight, Play, Lock, 
  CheckCircle, ShoppingCart, Award, Download 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CourseLevel {
  id: number;
  level_number: number;
  title: string;
  description: string;
  price_brl: string;
  duration_hours: number;
  materials_included: string[];
  unlock_requirements: string[];
  is_unlocked: boolean;
  is_purchased: boolean;
  is_completed: boolean;
  modules: {
    id: string;
    title: string;
    duration: number;
    type: string;
    is_completed: boolean;
  }[];
}

interface CourseDetail {
  id: number;
  title: string;
  short_description: string;
  full_description: string;
  slug: string;
  category: string;
  difficulty_level: number;
  total_levels: number;
  full_course_price_brl: string;
  discount_percentage: number;
  estimated_duration_hours: number;
  cover_image?: string;
  preview_video_url?: string;
  requirements: string[];
  what_you_learn: string[];
  levels: CourseLevel[];
  user_enrollment?: {
    enrollment_type: string;
    progress_percentage: number;
    completed_levels: number[];
  };
}

export default function CourseDetail() {
  const [match, params] = useRoute("/curso/:slug");
  const [selectedTab, setSelectedTab] = useState("overview");
  const { toast } = useToast();

  const mockCourse: CourseDetail = {
    id: 1,
    title: "Fundamentos do Luciferianismo",
    short_description: "Uma introdução completa aos princípios fundamentais da filosofia luciferiana e autodivindade.",
    full_description: `Este curso oferece uma jornada profunda pelos fundamentos do Luciferianismo, explorando os princípios ancestrais da autodivindade e rebelião espiritual. 

Através de três níveis progressivos, você desenvolverá uma compreensão sólida dos conceitos luciferianos, práticas rituais e técnicas de transformação pessoal.

O curso é estruturado para guiá-lo desde os conceitos básicos até práticas avançadas, sempre respeitando seu ritmo de aprendizado e nível de experiência.`,
    slug: "fundamentos-luciferianismo",
    category: "iniciação",
    difficulty_level: 1,
    total_levels: 3,
    full_course_price_brl: "297.00",
    discount_percentage: 30,
    estimated_duration_hours: 20,
    requirements: [
      "Mente aberta para conceitos espirituais alternativos",
      "Dedicação para estudos esotéricos",
      "Maturidade emocional e psicológica"
    ],
    what_you_learn: [
      "Fundamentos da filosofia luciferiana",
      "Técnicas básicas de meditação e ritual",
      "História e tradições da gnose luciferiana",
      "Práticas de autodivindade e empoderamento pessoal"
    ],
    levels: [
      {
        id: 1,
        level_number: 1,
        title: "Despertar da Consciência",
        description: "Introdução aos conceitos básicos do Luciferianismo",
        price_brl: "97.00",
        duration_hours: 6,
        materials_included: ["E-book Introdutório", "Áudios Guiados", "Exercícios Práticos"],
        unlock_requirements: [],
        is_unlocked: true,
        is_purchased: false,
        is_completed: false,
        modules: [
          { id: "1-1", title: "História do Luciferianismo", duration: 90, type: "video", is_completed: false },
          { id: "1-2", title: "Princípios Fundamentais", duration: 120, type: "video", is_completed: false },
          { id: "1-3", title: "Primeira Meditação", duration: 45, type: "audio", is_completed: false }
        ]
      },
      {
        id: 2,
        level_number: 2,
        title: "Caminhos da Sombra",
        description: "Aprofundamento nas práticas luciferianas",
        price_brl: "127.00",
        duration_hours: 8,
        materials_included: ["Grimório Digital", "Rituais Guiados", "Consulta Individual"],
        unlock_requirements: ["Completar Nível 1"],
        is_unlocked: false,
        is_purchased: false,
        is_completed: false,
        modules: [
          { id: "2-1", title: "Rituais Básicos", duration: 120, type: "video", is_completed: false },
          { id: "2-2", title: "Trabalho com Sombras", duration: 90, type: "video", is_completed: false },
          { id: "2-3", title: "Prática Ritual", duration: 60, type: "audio", is_completed: false }
        ]
      },
      {
        id: 3,
        level_number: 3,
        title: "Maestria Interior",
        description: "Técnicas avançadas de transformação",
        price_brl: "167.00",
        duration_hours: 10,
        materials_included: ["Grimório Avançado", "Sessões ao Vivo", "Certificado de Conclusão"],
        unlock_requirements: ["Completar Níveis 1 e 2"],
        is_unlocked: false,
        is_purchased: false,
        is_completed: false,
        modules: [
          { id: "3-1", title: "Rituais Avançados", duration: 150, type: "video", is_completed: false },
          { id: "3-2", title: "Autodivindade", duration: 120, type: "video", is_completed: false },
          { id: "3-3", title: "Iniciação Final", duration: 90, type: "live", is_completed: false }
        ]
      }
    ]
  };

  const handleEnrollment = (levelId: number) => {
    toast({
      title: "Matrícula iniciada",
      description: "Redirecionando para o pagamento...",
    });
  };

  const handleFullCourseEnrollment = () => {
    toast({
      title: "Curso completo selecionado",
      description: "Redirecionando para o pagamento com desconto...",
    });
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
            <div className="text-amber-400 text-6xl mb-4">📚</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              CURSUS INITIATICUS
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
              {mockCourse.title}
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              {mockCourse.short_description}
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Sapientia Est Potentia"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                O conhecimento é poder
              </p>
            </div>
          </div>
        </div>

        {/* Course Stats */}
        <div className="floating-card max-w-6xl w-full mb-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <div className="flex items-center gap-2 mb-6 justify-center flex-wrap">
              <Badge variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/10 capitalize">
                {mockCourse.category}
              </Badge>
              <div className="flex items-center">
                {[...Array(mockCourse.difficulty_level)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                {[...Array(3 - mockCourse.difficulty_level)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-gray-400" />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <Clock className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <h3 className="text-lg font-cinzel-decorative text-amber-300">Duração</h3>
                <p className="text-2xl font-bold text-amber-400">{mockCourse.estimated_duration_hours}h</p>
                <p className="text-sm text-gray-400">Total</p>
              </div>
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <h3 className="text-lg font-cinzel-decorative text-amber-300">Níveis</h3>
                <p className="text-2xl font-bold text-amber-400">{mockCourse.total_levels}</p>
                <p className="text-sm text-gray-400">Progressivos</p>
              </div>
              <div className="text-center">
                <Users className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <h3 className="text-lg font-cinzel-decorative text-amber-300">Iniciados</h3>
                <p className="text-2xl font-bold text-amber-400">1,247</p>
                <p className="text-sm text-gray-400">Estudantes</p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 text-amber-400 mx-auto mb-2" />
                <h3 className="text-lg font-cinzel-decorative text-amber-300">Certificado</h3>
                <p className="text-2xl font-bold text-amber-400">✓</p>
                <p className="text-sm text-gray-400">Incluído</p>
              </div>
            </div>
          </div>
        </div>

        {/* Course Content Tabs */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-black/40 border border-amber-600/30">
              <TabsTrigger 
                value="overview"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="curriculum"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Currículo
              </TabsTrigger>
              <TabsTrigger 
                value="levels"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Níveis
              </TabsTrigger>
              <TabsTrigger 
                value="enroll"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Matrícula
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-4">Sobre este Curso</h3>
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {mockCourse.full_description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-cinzel-decorative text-amber-300 mb-3">Requisitos</h4>
                    <ul className="space-y-2">
                      {mockCourse.requirements.map((req, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <CheckCircle className="w-5 h-5 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-cinzel-decorative text-amber-300 mb-3">O que você aprenderá</h4>
                    <ul className="space-y-2">
                      {mockCourse.what_you_learn.map((item, index) => (
                        <li key={index} className="flex items-start text-gray-300">
                          <Star className="w-5 h-5 text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-4">Estrutura do Curso</h3>
                
                {mockCourse.levels.map((level) => (
                  <Card key={level.id} className="bg-black/20 border-amber-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-amber-400">
                          Nível {level.level_number}: {level.title}
                        </CardTitle>
                        <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                          {level.duration_hours}h
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        {level.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {level.modules.map((module) => (
                          <div key={module.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-amber-500/10">
                            <div className="flex items-center">
                              {module.type === 'video' && <Play className="w-4 h-4 text-amber-400 mr-2" />}
                              {module.type === 'audio' && <BookOpen className="w-4 h-4 text-amber-400 mr-2" />}
                              {module.type === 'live' && <Users className="w-4 h-4 text-amber-400 mr-2" />}
                              <span className="text-gray-300">{module.title}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-400">{module.duration}min</span>
                              {level.is_unlocked ? (
                                <CheckCircle className="w-4 h-4 text-amber-400" />
                              ) : (
                                <Lock className="w-4 h-4 text-gray-500" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="levels" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-4">Níveis de Aprendizado</h3>
                
                <div className="grid gap-6">
                  {mockCourse.levels.map((level) => (
                    <Card key={level.id} className={`bg-black/20 border-amber-500/20 ${!level.is_unlocked ? 'opacity-75' : ''}`}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-amber-400 flex items-center">
                              {!level.is_unlocked && <Lock className="w-5 h-5 mr-2" />}
                              Nível {level.level_number}: {level.title}
                            </CardTitle>
                            <CardDescription className="text-gray-300 mt-2">
                              {level.description}
                            </CardDescription>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-amber-400">
                              R$ {level.price_brl}
                            </div>
                            <div className="text-sm text-gray-400">
                              {level.duration_hours} horas
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-amber-300 font-semibold mb-2">Materiais Incluídos:</h5>
                            <ul className="space-y-1">
                              {level.materials_included.map((material, index) => (
                                <li key={index} className="flex items-center text-gray-300 text-sm">
                                  <CheckCircle className="w-4 h-4 text-amber-400 mr-2" />
                                  {material}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          {level.unlock_requirements.length > 0 && (
                            <div>
                              <h5 className="text-red-300 font-semibold mb-2">Requisitos:</h5>
                              <ul className="space-y-1">
                                {level.unlock_requirements.map((req, index) => (
                                  <li key={index} className="flex items-center text-gray-300 text-sm">
                                    <Lock className="w-4 h-4 text-red-400 mr-2" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          <Button
                            onClick={() => handleEnrollment(level.id)}
                            disabled={!level.is_unlocked}
                            className="w-full bg-amber-600 hover:bg-amber-700 text-black"
                          >
                            {level.is_purchased ? "Acessar Nível" : "Matricular-se"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="enroll" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-4">Opções de Matrícula</h3>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Individual Levels */}
                  <Card className="bg-black/20 border-amber-500/20">
                    <CardHeader>
                      <CardTitle className="text-amber-400">Níveis Individuais</CardTitle>
                      <CardDescription className="text-gray-300">
                        Compre cada nível separadamente
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {mockCourse.levels.map((level) => (
                          <div key={level.id} className="flex items-center justify-between p-3 bg-black/20 rounded border border-amber-500/10">
                            <div>
                              <div className="text-amber-300 font-semibold">Nível {level.level_number}</div>
                              <div className="text-sm text-gray-400">{level.title}</div>
                            </div>
                            <div className="text-amber-400 font-bold">R$ {level.price_brl}</div>
                          </div>
                        ))}
                        <div className="border-t border-amber-500/20 pt-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Individual:</span>
                            <span className="text-xl font-bold text-amber-400">
                              R$ {mockCourse.levels.reduce((sum, level) => sum + parseFloat(level.price_brl), 0).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Full Course */}
                  <Card className="bg-amber-900/20 border-amber-500/30 ring-2 ring-amber-500/50">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-amber-400">Curso Completo</CardTitle>
                          <CardDescription className="text-gray-300">
                            Todos os níveis com desconto
                          </CardDescription>
                        </div>
                        <Badge className="bg-red-600/20 text-red-300 border-red-500/30">
                          {mockCourse.discount_percentage}% OFF
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-400 line-through">
                            De: R$ {mockCourse.levels.reduce((sum, level) => sum + parseFloat(level.price_brl), 0).toFixed(2)}
                          </div>
                          <div className="text-3xl font-bold text-amber-400">
                            R$ {mockCourse.full_course_price_brl}
                          </div>
                          <div className="text-sm text-green-400">
                            Economia de R$ {(mockCourse.levels.reduce((sum, level) => sum + parseFloat(level.price_brl), 0) - parseFloat(mockCourse.full_course_price_brl)).toFixed(2)}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center text-amber-300 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Acesso a todos os 3 níveis
                          </div>
                          <div className="flex items-center text-amber-300 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Todos os materiais incluídos
                          </div>
                          <div className="flex items-center text-amber-300 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Certificado de conclusão
                          </div>
                          <div className="flex items-center text-amber-300 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Suporte prioritário
                          </div>
                        </div>

                        <Button
                          onClick={handleFullCourseEnrollment}
                          className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold h-12"
                        >
                          <ShoppingCart className="w-5 h-5 mr-2" />
                          Matricular-se no Curso Completo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
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
              "O verdadeiro conhecimento não é transmitido, mas despertado no coração do buscador sincero"
            </p>
            <p className="text-amber-400 font-semibold">
              — Mestre do Templo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}