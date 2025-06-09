import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { BookOpen, Star, Clock, Users, ShoppingCart, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import SiteNavigation from "@/components/SiteNavigation";

interface Course {
  id: number;
  title: string;
  description: string;
  type: string;
  level: number;
  price_brl: number;
  currency?: string;
  discountPrice?: number;
  discountValidUntil?: string;
  featuredImage?: string;
  requirements: string[];
  rewards: string[];
  estimatedDuration?: number;
  enrolledCount?: number;
  rating?: number;
  is_active: boolean;
  created_at: string;
}

export default function Courses() {
  const [selectedLevel, setSelectedLevel] = useState<string>("all");
  const [selectedType, setSelectedType] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/courses"],
    retry: false,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: number) => {
      return await apiRequest(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });
    },
    onSuccess: () => {
      toast({
        title: "Inscrição realizada!",
        description: "Redirecionando para o pagamento...",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    },
    onError: (error: any) => {
      toast({
        title: "Erro na inscrição",
        description: error.message || "Erro ao processar inscrição",
        variant: "destructive",
      });
    },
  });

  const filteredCourses = courses.filter((course: Course) => {
    if (!course.is_active) return false;
    if (selectedLevel !== "all" && course.level.toString() !== selectedLevel) return false;
    if (selectedType !== "all" && course.type !== selectedType) return false;
    return true;
  });

  const levelNames = {
    1: "Iniciante",
    2: "Intermediário", 
    3: "Avançado",
    4: "Mestre"
  };

  const formatPrice = (price: number, discount?: number) => {
    if (discount && discount > 0) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-red-400">R$ {discount.toFixed(2)}</span>
          <span className="text-sm text-gray-400 line-through">R$ {price.toFixed(2)}</span>
        </div>
      );
    }
    return <span className="text-lg font-bold text-amber-400">R$ {price.toFixed(2)}</span>;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando cursos...</p>
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
            🔥 CURSOS LUCIFERINOS 🔥
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Desperte seu potencial através dos ensinamentos ancestrais das trevas.
            Cursos estruturados para guiar sua jornada de transformação espiritual.
          </p>
        </div>

        {/* Filtros */}
        <div className="mb-8 flex flex-wrap gap-4 justify-center">
          <div className="flex gap-2">
            <Button
              variant={selectedLevel === "all" ? "default" : "outline"}
              onClick={() => setSelectedLevel("all")}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Todos os Níveis
            </Button>
            {Object.entries(levelNames).map(([level, name]) => (
              <Button
                key={level}
                variant={selectedLevel === level ? "default" : "outline"}
                onClick={() => setSelectedLevel(level)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {name}
              </Button>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              onClick={() => setSelectedType("all")}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Todas as Categorias
            </Button>
            <Button
              variant={selectedType === "practical" ? "default" : "outline"}
              onClick={() => setSelectedType("practical")}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Prático
            </Button>
            <Button
              variant={selectedType === "theoretical" ? "default" : "outline"}
              onClick={() => setSelectedType("theoretical")}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Teórico
            </Button>
            <Button
              variant={selectedType === "ritual" ? "default" : "outline"}
              onClick={() => setSelectedType("ritual")}
              className="bg-amber-600 hover:bg-amber-700"
            >
              Ritual
            </Button>
          </div>
        </div>

        {/* Grid de Cursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course: Course) => (
            <Card key={course.id} className="bg-black/60 border-purple-500/30 hover:border-amber-500/50 transition-all duration-300 group">
              <CardHeader>
                {course.featuredImage && (
                  <div className="w-full h-48 bg-gray-800 rounded-lg mb-4 overflow-hidden">
                    <img 
                      src={course.featuredImage} 
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="flex justify-between items-start mb-2">
                  <Badge 
                    variant="outline" 
                    className="border-amber-500 text-amber-400"
                  >
                    {levelNames[course.level as keyof typeof levelNames]}
                  </Badge>
                  <Badge 
                    variant="outline" 
                    className="border-purple-500 text-purple-400"
                  >
                    {course.type}
                  </Badge>
                </div>
                <CardTitle className="text-amber-400 text-xl mb-2">
                  {course.title}
                </CardTitle>
                <CardDescription className="text-gray-300 text-sm">
                  {course.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Estatísticas do Curso */}
                  <div className="flex justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{course.enrolledCount || 0} alunos</span>
                    </div>
                    {course.estimatedDuration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.estimatedDuration}h</span>
                      </div>
                    )}
                    {course.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span>{course.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>

                  {/* Requisitos e Recompensas */}
                  {course.requirements && course.requirements.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Requisitos:</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {course.requirements.slice(0, 2).map((req, index) => (
                          <li key={index}>• {req}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {course.rewards && course.rewards.length > 0 && (
                    <div>
                      <h4 className="text-sm font-semibold text-gray-300 mb-2">Você vai aprender:</h4>
                      <ul className="text-xs text-gray-400 space-y-1">
                        {course.rewards.slice(0, 2).map((reward, index) => (
                          <li key={index}>• {reward}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Preço e Botão de Compra */}
                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center">
                      <div>
                        {formatPrice(course.price_brl, course.discountPrice)}
                        {course.discountValidUntil && (
                          <p className="text-xs text-red-400">
                            Oferta válida até {new Date(course.discountValidUntil).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <Button 
                        onClick={() => enrollMutation.mutate(course.id)}
                        disabled={enrollMutation.isPending}
                        className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        {enrollMutation.isPending ? "Processando..." : "Comprar"}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              Nenhum curso encontrado
            </h3>
            <p className="text-gray-400">
              Ajuste os filtros ou aguarde novos cursos serem publicados.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}