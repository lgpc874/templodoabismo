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
    requirements: ["Mente aberta", "Interesse em filosofia esotérica", "Comprometimento com estudos"],
    what_you_learn: [
      "Princípios fundamentais do Luciferianismo",
      "História e desenvolvimento da tradição",
      "Símbolos e arquétipos luciferianos",
      "Técnicas de meditação sombria",
      "Rituais básicos de autodivindade",
      "Desenvolvimento da vontade pessoal"
    ],
    levels: [
      {
        id: 1,
        level_number: 1,
        title: "Nível 1: Fundamentos Teóricos",
        description: "Introdução aos conceitos básicos, história e filosofia luciferiana.",
        price_brl: "97.00",
        duration_hours: 6,
        materials_included: ["Manual PDF (50 páginas)", "3 Áudios de meditação", "Certificado de conclusão"],
        unlock_requirements: [],
        is_unlocked: true,
        is_purchased: false,
        is_completed: false,
        modules: [
          { id: "1.1", title: "História do Luciferianismo", duration: 45, type: "video", is_completed: false },
          { id: "1.2", title: "Conceitos Fundamentais", duration: 60, type: "video", is_completed: false },
          { id: "1.3", title: "Símbolos e Arquétipos", duration: 30, type: "reading", is_completed: false }
        ]
      },
      {
        id: 2,
        level_number: 2,
        title: "Nível 2: Práticas Iniciais",
        description: "Introdução às práticas básicas e rituais de autodivindade.",
        price_brl: "147.00",
        duration_hours: 8,
        materials_included: ["Manual PDF (75 páginas)", "5 Áudios rituais", "Kit básico de símbolos", "Certificado"],
        unlock_requirements: ["Conclusão do Nível 1"],
        is_unlocked: false,
        is_purchased: false,
        is_completed: false,
        modules: [
          { id: "2.1", title: "Meditação Sombria", duration: 40, type: "video", is_completed: false },
          { id: "2.2", title: "Rituais Básicos", duration: 55, type: "video", is_completed: false },
          { id: "2.3", title: "Desenvolvimento da Vontade", duration: 35, type: "exercise", is_completed: false }
        ]
      }
    ]
  };

  const { data: course = mockCourse, isLoading } = useQuery({
    queryKey: [`/api/courses/${params?.slug}`],
    enabled: !!params?.slug,
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center">
        <div className="text-amber-500 animate-pulse text-xl">Carregando curso...</div>
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
        <div className="text-center mb-12 max-w-6xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">📚</div>
            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              {course.title}
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
            <h2 className="text-2xl md:text-3xl font-cinzel-decorative text-amber-300 mb-6 floating-title-slow">
              {course.short_description}
            </h2>
            
            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                {course.category}
              </Badge>
              <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                Nível {course.difficulty_level}
              </Badge>
              <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                {course.estimated_duration_hours}h totais
              </Badge>
              <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                {course.total_levels} níveis
              </Badge>
            </div>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Scientia Potentia Est"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Conhecimento é poder
              </p>
            </div>
          </div>
        </div>

        {/* Course Overview Cards */}
        <div className="max-w-6xl w-full mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Course Info */}
            <div className="floating-card bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6">
              <div className="text-center">
                <BookOpen className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-cinzel-decorative text-amber-300 mb-2">Conteúdo</h3>
                <p className="text-3xl font-bold text-amber-400 mb-2">{course.total_levels}</p>
                <p className="text-gray-400">Níveis progressivos</p>
              </div>
            </div>

            {/* Duration */}
            <div className="floating-card bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6">
              <div className="text-center">
                <Clock className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-cinzel-decorative text-amber-300 mb-2">Duração</h3>
                <p className="text-3xl font-bold text-amber-400 mb-2">{course.estimated_duration_hours}h</p>
                <p className="text-gray-400">Estudo autônomo</p>
              </div>
            </div>

            {/* Investment */}
            <div className="floating-card bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl p-6">
              <div className="text-center">
                <Star className="w-12 h-12 text-amber-400 mx-auto mb-4" />
                <h3 className="text-xl font-cinzel-decorative text-amber-300 mb-2">Investimento</h3>
                <p className="text-3xl font-bold text-amber-400 mb-2">R$ {course.full_course_price_brl}</p>
                <p className="text-gray-400">Curso completo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Tabs */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-black/40 border border-amber-600/30">
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
                value="enrollment"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Matrícula
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <div className="space-y-8">
                <div>
                  <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-4">Sobre o Curso</h3>
                  <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                      {course.full_description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-cinzel-decorative text-amber-300 mb-4">O que você aprenderá</h4>
                    <ul className="space-y-2">
                      {course.what_you_learn.map((item, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-cinzel-decorative text-amber-300 mb-4">Pré-requisitos</h4>
                    <ul className="space-y-2">
                      {course.requirements.map((req, index) => (
                        <li key={index} className="flex items-start">
                          <ArrowRight className="w-5 h-5 text-amber-400 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="curriculum" className="p-6">
              <div className="space-y-6">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6">Estrutura do Curso</h3>
                
                {course.levels.map((level) => (
                  <Card key={level.id} className="bg-black/20 border-amber-500/20">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-amber-400 flex items-center">
                          {level.is_completed ? (
                            <CheckCircle className="w-6 h-6 text-green-400 mr-3" />
                          ) : level.is_unlocked ? (
                            <Play className="w-6 h-6 text-amber-400 mr-3" />
                          ) : (
                            <Lock className="w-6 h-6 text-gray-400 mr-3" />
                          )}
                          {level.title}
                        </CardTitle>
                        <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                          R$ {level.price_brl}
                        </Badge>
                      </div>
                      <CardDescription className="text-gray-300">
                        {level.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between text-sm text-gray-400">
                          <span>📚 {level.duration_hours}h de conteúdo</span>
                          <span>📄 {level.materials_included.length} materiais inclusos</span>
                        </div>

                        <div className="space-y-2">
                          <h5 className="font-semibold text-amber-300">Módulos:</h5>
                          {level.modules.map((module) => (
                            <div key={module.id} className="flex items-center justify-between py-2 px-3 bg-black/20 rounded">
                              <div className="flex items-center">
                                {module.is_completed ? (
                                  <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                                ) : (
                                  <Play className="w-4 h-4 text-gray-400 mr-2" />
                                )}
                                <span className="text-gray-300">{module.title}</span>
                              </div>
                              <span className="text-sm text-gray-400">{module.duration}min</span>
                            </div>
                          ))}
                        </div>

                        {level.unlock_requirements.length > 0 && (
                          <div className="border-t border-amber-500/20 pt-4">
                            <p className="text-sm text-gray-400">
                              <Lock className="w-4 h-4 inline mr-1" />
                              Requisitos: {level.unlock_requirements.join(", ")}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="enrollment" className="p-6">
              <div className="space-y-8">
                <h3 className="text-2xl font-cinzel-decorative text-amber-300 mb-6 text-center">
                  Opções de Matrícula
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Individual Level Purchase */}
                  <Card className="bg-black/20 border-amber-500/20">
                    <CardHeader className="text-center">
                      <CardTitle className="text-amber-400">Compra Individual</CardTitle>
                      <CardDescription className="text-gray-300">
                        Adquira apenas o nível desejado
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {course.levels.map((level) => (
                        <div key={level.id} className="flex items-center justify-between p-3 bg-black/20 rounded">
                          <div>
                            <p className="font-semibold text-amber-300">{level.title}</p>
                            <p className="text-sm text-gray-400">{level.duration_hours}h • {level.modules.length} módulos</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-bold text-amber-400">R$ {level.price_brl}</p>
                            <Button 
                              size="sm" 
                              className="bg-amber-600 hover:bg-amber-700 text-black"
                              disabled={!level.is_unlocked}
                            >
                              {level.is_unlocked ? "Comprar" : "Bloqueado"}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* Full Course Package */}
                  <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-400/30 relative">
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-amber-600 text-black">
                        {course.discount_percentage}% OFF
                      </Badge>
                    </div>
                    <CardHeader className="text-center">
                      <CardTitle className="text-amber-300 text-xl">Curso Completo</CardTitle>
                      <CardDescription className="text-gray-300">
                        Acesso total a todos os níveis
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-amber-400 mb-2">
                          R$ {course.full_course_price_brl}
                        </p>
                        <p className="text-gray-400">
                          {course.estimated_duration_hours}h de conteúdo • {course.total_levels} níveis
                        </p>
                      </div>

                      <div className="space-y-2">
                        <h5 className="font-semibold text-amber-300">Inclui:</h5>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>✓ Acesso vitalício a todos os níveis</li>
                          <li>✓ Todos os materiais e recursos</li>
                          <li>✓ Certificados de conclusão</li>
                          <li>✓ Suporte da comunidade</li>
                          <li>✓ Atualizações futuras incluídas</li>
                        </ul>
                      </div>

                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold py-3">
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Adquirir Curso Completo
                      </Button>

                      <p className="text-xs text-center text-gray-500">
                        Garantia de 30 dias ou seu dinheiro de volta
                      </p>
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
              "O verdadeiro aprendizado acontece quando a teoria encontra a prática na fornalha da experiência"
            </p>
            <p className="text-amber-400 font-semibold">
              — Máxima do Templo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}