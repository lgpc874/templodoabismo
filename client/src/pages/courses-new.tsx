import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Star, Users, ArrowRight } from "lucide-react";
import SiteNavigation from "@/components/SiteNavigation";

interface Course {
  id: number;
  title: string;
  short_description: string;
  slug: string;
  category: string;
  difficulty_level: number;
  total_levels: number;
  full_course_price_brl: string;
  discount_percentage: number;
  estimated_duration_hours: number;
  cover_image?: string;
  requirements: string[];
  what_you_learn: string[];
  is_active: boolean;
}

export default function CoursesNew() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["/api/courses-new"],
    retry: false,
  });

  // Transform database data to match interface
  const transformedCourses: Course[] = (courses as any[]).map(course => ({
    id: course.id,
    title: course.title,
    short_description: course.short_description || course.description?.substring(0, 150) + "...",
    slug: course.slug,
    category: course.category || "luciferiano",
    difficulty_level: course.difficulty_level || 1,
    total_levels: course.total_levels || 1,
    full_course_price_brl: course.full_course_price_brl || "0",
    discount_percentage: course.discount_percentage || 30,
    estimated_duration_hours: course.estimated_duration_hours || 10,
    cover_image: course.cover_image || "",
    requirements: course.requirements || [],
    what_you_learn: course.what_you_learn || [],
    is_active: course.is_active
  }));

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

  const filteredCourses = selectedCategory === "all" 
    ? transformedCourses 
    : transformedCourses.filter(course => course.category === selectedCategory);

  const categories = ["all", "iniciação", "divinação", "magia", "energia"];
  const categoryNames: { [key: string]: string } = {
    "all": "Todos",
    "iniciação": "Iniciação",
    "divinação": "Divinação",
    "magia": "Magia",
    "energia": "Energia"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando Academia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      <SiteNavigation />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-600 mb-4">
            Academia Luciferiana
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Desperte seu potencial através dos ensinamentos ancestrais. Cursos estruturados por níveis 
            progressivos com conteúdo autêntico e transformador.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              onClick={() => setSelectedCategory(category)}
              className={`${
                selectedCategory === category 
                  ? "bg-purple-600 hover:bg-purple-700" 
                  : "border-purple-500/30 text-gray-300 hover:border-purple-400"
              }`}
            >
              {categoryNames[category]}
            </Button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map(course => {
            const discountedPrice = Number(course.full_course_price_brl) * (1 - course.discount_percentage / 100);
            
            return (
              <Card key={course.id} className="bg-black/40 border-purple-500/30 hover:border-purple-400/60 transition-all duration-300 group">
                <CardHeader className="space-y-4">
                  {/* Course Image Placeholder */}
                  <div className="w-full h-48 bg-gradient-to-br from-purple-800/30 to-gray-900/50 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-16 h-16 text-purple-400" />
                  </div>
                  
                  {/* Course Title and Category */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge className={`${getDifficultyColor(course.difficulty_level)} text-white`}>
                        {getDifficultyText(course.difficulty_level)}
                      </Badge>
                      <span className="text-sm text-gray-400 capitalize">{course.category}</span>
                    </div>
                    <CardTitle className="text-xl text-white group-hover:text-amber-400 transition-colors">
                      {course.title}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Description */}
                  <CardDescription className="text-gray-300 line-clamp-3">
                    {course.short_description}
                  </CardDescription>

                  {/* Course Stats */}
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      <span>{course.total_levels} níveis</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{course.estimated_duration_hours}h</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>Online</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-amber-400">
                        R$ {discountedPrice.toFixed(2)}
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        R$ {Number(course.full_course_price_brl).toFixed(2)}
                      </span>
                      <Badge variant="destructive" className="text-xs">
                        -{course.discount_percentage}%
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">
                      Ou compre por níveis individuais
                    </p>
                  </div>

                  {/* Action Button */}
                  <Link href={`/curso/${course.slug}`}>
                    <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-amber-600 transition-all">
                      Ver Curso
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl text-gray-300 mb-2">Nenhum curso encontrado</h3>
            <p className="text-gray-500">
              Não há cursos disponíveis nesta categoria no momento.
            </p>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-16 text-center">
          <div className="bg-black/20 border border-purple-500/30 rounded-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-amber-400 mb-4">
              Sistema de Aprendizado Progressivo
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-white mb-2">📚 Níveis Progressivos</h3>
                <p className="text-gray-300 text-sm">
                  Cada curso é dividido em níveis que devem ser completados sequencialmente.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">💰 Flexibilidade de Pagamento</h3>
                <p className="text-gray-300 text-sm">
                  Compre por nível individual ou o curso completo com 30% de desconto.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-white mb-2">👤 Perfil do Estudante</h3>
                <p className="text-gray-300 text-sm">
                  Acompanhe seu progresso e acesse seus cursos no perfil personalizado.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}