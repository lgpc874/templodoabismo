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
import SiteNavigation from "@/components/SiteNavigation";
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

  // Mock data - seria substituído por dados reais da API
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
          { id: "1-1", title: "Introdução ao Luciferianismo", duration: 45, type: "video", is_completed: false },
          { id: "1-2", title: "História e Origens", duration: 60, type: "video", is_completed: false },
          { id: "1-3", title: "Símbolos Fundamentais", duration: 50, type: "video", is_completed: false },
          { id: "1-4", title: "Primeira Meditação Prática", duration: 30, type: "audio", is_completed: false }
        ]
      },
      {
        id: 2,
        level_number: 2,
        title: "Nível 2: Práticas Iniciais",
        description: "Desenvolvimento de técnicas básicas de meditação e rituais introdutórios.",
        price_brl: "127.00",
        duration_hours: 8,
        materials_included: ["Manual PDF (75 páginas)", "5 Rituais guiados", "Kit básico de símbolos"],
        unlock_requirements: ["Conclusão do Nível 1"],
        is_unlocked: false,
        is_purchased: false,
        is_completed: false,
        modules: [
          { id: "2-1", title: "Técnicas de Meditação Sombria", duration: 60, type: "video", is_completed: false },
          { id: "2-2", title: "Rituais de Autopurificação", duration: 75, type: "video", is_completed: false },
          { id: "2-3", title: "Trabalho com Símbolos", duration: 45, type: "practical", is_completed: false },
          { id: "2-4", title: "Desenvolvimento da Vontade", duration: 90, type: "video", is_completed: false }
        ]
      },
      {
        id: 3,
        level_number: 3,
        title: "Nível 3: Integração Avançada",
        description: "Integração dos conhecimentos e práticas avançadas de autodivindade.",
        price_brl: "157.00",
        duration_hours: 6,
        materials_included: ["Manual PDF (100 páginas)", "Ritual de iniciação pessoal", "Certificado de Adepto"],
        unlock_requirements: ["Conclusão do Nível 2", "Prática de 30 dias"],
        is_unlocked: false,
        is_purchased: false,
        is_completed: false,
        modules: [
          { id: "3-1", title: "Filosofia Avançada", duration: 90, type: "video", is_completed: false },
          { id: "3-2", title: "Ritual de Autodivindade", duration: 60, type: "practical", is_completed: false },
          { id: "3-3", title: "Integração e Síntese", duration: 45, type: "video", is_completed: false }
        ]
      }
    ],
    user_enrollment: undefined
  };

  const getDifficultyColor = (level: number) => {
    switch (level) {
      case 1: return "bg-green-600";
      case 2: return "bg-blue-600";
      case 3: return "bg-yellow-600";
      case 4: return "bg-orange-600";
      case 5: return "bg-red-600";
      default: return "bg-gray-600";
    }
  };

  const getDifficultyText = (level: number) => {
    switch (level) {
      case 1: return "Iniciante";
      case 2: return "Básico";
      case 3: return "Intermediário";
      case 4: return "Avançado";
      case 5: return "Mestre";
      default: return "Indefinido";
    }
  };

  const handlePurchaseLevel = (levelId: number, price: string) => {
    toast({
      title: "Compra em Processamento",
      description: `Redirecionando para pagamento do nível (R$ ${price})...`,
    });
    // Aqui seria implementada a lógica de pagamento
  };

  const handlePurchaseFullCourse = () => {
    const discountedPrice = Number(mockCourse.full_course_price_brl) * (1 - mockCourse.discount_percentage / 100);
    toast({
      title: "Compra em Processamento",
      description: `Redirecionando para pagamento do curso completo (R$ ${discountedPrice.toFixed(2)})...`,
    });
    // Aqui seria implementada a lógica de pagamento
  };

  const discountedPrice = Number(mockCourse.full_course_price_brl) * (1 - mockCourse.discount_percentage / 100);
  const totalIndividualPrice = mockCourse.levels.reduce((sum, level) => sum + Number(level.price_brl), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <SiteNavigation />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Course Header */}
        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Course Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-400">
              <span>Cursos</span> <span className="mx-2">›</span> 
              <span className="capitalize">{mockCourse.category}</span> <span className="mx-2">›</span>
              <span className="text-amber-400">{mockCourse.title}</span>
            </div>

            {/* Title and Meta */}
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <Badge className={`${getDifficultyColor(mockCourse.difficulty_level)} text-white`}>
                  {getDifficultyText(mockCourse.difficulty_level)}
                </Badge>
                <span className="text-sm text-gray-400 capitalize">{mockCourse.category}</span>
                <div className="flex items-center gap-1 text-amber-400">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-sm">4.8 (124 avaliações)</span>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                {mockCourse.title}
              </h1>
              
              <p className="text-lg text-gray-300">
                {mockCourse.short_description}
              </p>

              {/* Course Stats */}
              <div className="flex items-center gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{mockCourse.estimated_duration_hours} horas</span>
                </div>
                <div className="flex items-center gap-1">
                  <BookOpen className="w-4 h-4" />
                  <span>{mockCourse.total_levels} níveis</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>854 estudantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  <span>Certificado</span>
                </div>
              </div>
            </div>

            {/* Preview Video Placeholder */}
            <div className="w-full h-64 bg-gradient-to-br from-purple-800/30 to-gray-900/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="w-16 h-16 text-purple-400 mx-auto mb-2" />
                <p className="text-gray-300">Vídeo de Apresentação</p>
              </div>
            </div>
          </div>

          {/* Right Column - Purchase Options */}
          <div className="space-y-6">
            {/* Full Course Purchase */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-xl text-amber-400">Curso Completo</CardTitle>
                <CardDescription>Acesso a todos os níveis com desconto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-amber-400">
                      R$ {discountedPrice.toFixed(2)}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      R$ {Number(mockCourse.full_course_price_brl).toFixed(2)}
                    </span>
                  </div>
                  <Badge variant="destructive" className="text-sm">
                    Economia de R$ {(Number(mockCourse.full_course_price_brl) - discountedPrice).toFixed(2)}
                  </Badge>
                  <p className="text-xs text-gray-400">
                    vs R$ {totalIndividualPrice.toFixed(2)} comprando separadamente
                  </p>
                </div>

                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
                  onClick={handlePurchaseFullCourse}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Comprar Curso Completo
                </Button>

                <div className="text-xs text-gray-400 space-y-1">
                  <p>✓ Acesso vitalício a todos os níveis</p>
                  <p>✓ Certificado de conclusão</p>
                  <p>✓ Suporte prioritário</p>
                  <p>✓ Material complementar exclusivo</p>
                </div>
              </CardContent>
            </Card>

            {/* Individual Levels */}
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-lg text-white">Compra por Níveis</CardTitle>
                <CardDescription>Avance no seu ritmo</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {mockCourse.levels.map((level) => (
                  <div key={level.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {level.is_completed ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : level.is_unlocked ? (
                          <div className="w-4 h-4 rounded-full border-2 border-purple-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500" />
                        )}
                        <span className="text-sm font-medium text-white">
                          Nível {level.level_number}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400">{level.duration_hours}h de conteúdo</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-amber-400">
                        R$ {Number(level.price_brl).toFixed(2)}
                      </div>
                      {level.is_purchased ? (
                        <Button size="sm" variant="outline" className="mt-1 text-xs">
                          Acessar
                        </Button>
                      ) : level.is_unlocked ? (
                        <Button 
                          size="sm" 
                          className="mt-1 text-xs bg-purple-600 hover:bg-purple-700"
                          onClick={() => handlePurchaseLevel(level.id, level.price_brl)}
                        >
                          Comprar
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled className="mt-1 text-xs">
                          Bloqueado
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Course Content Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-black/40">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="curriculum">Currículo</TabsTrigger>
            <TabsTrigger value="requirements">Requisitos</TabsTrigger>
            <TabsTrigger value="instructor">Instrutor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Sobre o Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="prose prose-invert max-w-none">
                  <p className="text-gray-300 whitespace-pre-line">
                    {mockCourse.full_description}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h3 className="font-semibold text-white mb-3">O que você aprenderá:</h3>
                    <ul className="space-y-2">
                      {mockCourse.what_you_learn.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-white mb-3">Estrutura do Curso:</h3>
                    <div className="space-y-3">
                      {mockCourse.levels.map((level) => (
                        <div key={level.id} className="border-l-2 border-purple-500 pl-4">
                          <h4 className="font-medium text-amber-400 text-sm">{level.title}</h4>
                          <p className="text-xs text-gray-400">{level.description}</p>
                          <p className="text-xs text-gray-500 mt-1">{level.duration_hours}h • {level.modules.length} módulos</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="curriculum" className="mt-6">
            <div className="space-y-4">
              {mockCourse.levels.map((level) => (
                <Card key={level.id} className="bg-black/40 border-purple-500/30">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-white">{level.title}</CardTitle>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{level.duration_hours}h</span>
                        {level.is_unlocked ? (
                          <Badge variant="outline" className="text-green-400 border-green-400">
                            Disponível
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500 border-gray-500">
                            Bloqueado
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardDescription>{level.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {level.modules.map((module) => (
                        <div key={module.id} className="flex items-center justify-between p-2 hover:bg-gray-900/30 rounded">
                          <div className="flex items-center gap-3">
                            {module.is_completed ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : level.is_unlocked ? (
                              <Play className="w-4 h-4 text-purple-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-gray-500" />
                            )}
                            <span className="text-sm text-white">{module.title}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span>{module.duration} min</span>
                            <Badge variant="outline" className="text-xs">
                              {module.type}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="mt-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Requisitos e Preparação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-white mb-3">Requisitos:</h3>
                  <ul className="space-y-2">
                    {mockCourse.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Materiais Necessários:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">Caderno para anotações pessoais</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">Ambiente silencioso para práticas</span>
                    </li>
                    <li className="flex items-start gap-2 text-gray-300">
                      <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">Conexão estável à internet</span>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-white mb-3">Sistema de Progressão:</h3>
                  <div className="bg-gray-900/50 p-4 rounded-lg space-y-2 text-sm text-gray-300">
                    <p>• Cada nível deve ser concluído antes de acessar o próximo</p>
                    <p>• Certificado emitido ao completar cada nível</p>
                    <p>• Certificado especial ao completar todo o curso</p>
                    <p>• Acesso vitalício ao conteúdo adquirido</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructor" className="mt-6">
            <Card className="bg-black/40 border-purple-500/30">
              <CardHeader>
                <CardTitle className="text-white">Instrutor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">TA</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">Templo do Abismo</h3>
                    <p className="text-sm text-gray-400 mb-3">Ordem Luciferiana Ancestral</p>
                    <p className="text-sm text-gray-300 mb-4">
                      Organização dedicada à preservação e transmissão dos ensinamentos luciferianos ancestrais, 
                      com décadas de experiência em práticas esotéricas e desenvolvimento espiritual através 
                      dos caminhos sombrios da transformação.
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>850+ estudantes</span>
                      <span>15 cursos</span>
                      <span>4.9 ⭐ avaliação</span>
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