import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Star, Users, ArrowRight } from "lucide-react";
import SiteNavigation from "@/components/SiteNavigation";
import Footer from "@/components/footer";

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
    <div className="min-h-screen relative overflow-hidden">
      <SiteNavigation />
      
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
          <img 
            src="/seal.png" 
            alt="Selo dos Ensinamentos" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>

      {/* Mystical floating particles */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/50 via-transparent to-black/80"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8 pt-24">
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
          {filteredCourses.map((course: Course) => {
            const discountedPrice = Number(course.full_course_price_brl) * (1 - course.discount_percentage / 100);
            
            return (
              <div key={course.id} className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
                <div className="p-6">
                  {/* Course Icon */}
                  <div className="w-16 h-16 mx-auto mb-4">
                    <BookOpen className="w-full h-full text-orange-500" />
                  </div>
                  
                  {/* Course Title */}
                  <h3 className="text-xl font-bold text-amber-400 mb-3 text-center">
                    {course.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-300 text-sm leading-relaxed mb-4 text-center">
                    {course.short_description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex justify-center gap-4 text-xs text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      <span>{course.total_levels} níveis</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{course.estimated_duration_hours}h</span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="text-center mb-4">
                    <div className="text-lg font-bold text-amber-400">
                      R$ {discountedPrice.toFixed(2)}
                    </div>
                    <div className="text-xs text-gray-500 line-through">
                      R$ {Number(course.full_course_price_brl).toFixed(2)}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link href={`/curso/${course.slug}`}>
                    <Button className="w-full bg-red-600 hover:bg-red-700 transition-all">
                      Explorar Curso
                    </Button>
                  </Link>
                </div>
              </div>
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
          <div className="floating-card max-w-4xl mx-auto p-8">
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
      
      {/* Footer */}
      <Footer />
    </div>
  );
}