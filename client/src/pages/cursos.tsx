import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, Crown, Flame, Eye, Clock, Users, Award } from "lucide-react";
import { Link } from "wouter";
import Footer from "../components/footer";

interface Course {
  id: number;
  title: string;
  description: string;
  price: number;
  level: string;
  duration: string;
  status: string;
  modules: string[];
  instructor: string;
  students_count: number;
  rating: number;
  image_url?: string;
  created_at: string;
}

export default function Cursos() {
  const { data: courses = [], isLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const getLevelIcon = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'iniciante':
        return <Star className="w-4 h-4" />;
      case 'intermediario':
        return <Flame className="w-4 h-4" />;
      case 'avancado':
        return <Crown className="w-4 h-4" />;
      default:
        return <BookOpen className="w-4 h-4" />;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'iniciante':
        return 'bg-emerald-900 text-emerald-300 border-emerald-700';
      case 'intermediario':
        return 'bg-amber-900 text-amber-300 border-amber-700';
      case 'avancado':
        return 'bg-purple-900 text-purple-300 border-purple-700';
      default:
        return 'bg-gray-900 text-gray-300 border-gray-700';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Fixed Central Rotating Seal */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-96 h-96 opacity-10">
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

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <Link href="/">
          <Button variant="ghost" className="text-amber-400 hover:text-amber-300 hover:bg-amber-400/10">
            <Eye className="w-4 h-4 mr-2" />
            Retornar ao Templo
          </Button>
        </Link>
      </nav>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="text-amber-400 text-4xl mb-4">⛧</div>
          <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-400 mystical-glow mb-6">
            ENSINAMENTOS ANCESTRAIS
          </h1>
          <div className="flex justify-center items-center space-x-6 text-amber-500 text-2xl mb-8">
            <span>📚</span>
            <span>⚹</span>
            <span>🔥</span>
            <span>⚹</span>
            <span>📚</span>
          </div>
          <p className="text-xl text-amber-200/80 max-w-3xl mx-auto leading-relaxed">
            Mergulhe nos mistérios da gnose luciferiana através de nossos cursos estruturados. 
            Cada ensinamento é uma chave para desbloquear os segredos do conhecimento ancestral.
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-20">
            <div className="text-amber-400 text-xl">
              <Flame className="w-8 h-8 animate-pulse mx-auto mb-4" />
              Carregando os Ensinamentos Sagrados...
            </div>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && courses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Card 
                key={course.id} 
                className="bg-black/70 border-amber-900/50 hover:border-amber-700/70 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/20 backdrop-blur-sm group"
              >
                <CardHeader className="relative">
                  {course.image_url && (
                    <div className="w-full h-48 mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={course.image_url} 
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={`${getLevelColor(course.level)} flex items-center gap-1`}>
                      {getLevelIcon(course.level)}
                      {course.level || 'Iniciante'}
                    </Badge>
                    
                    {course.rating && (
                      <div className="flex items-center text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-sm">{course.rating}</span>
                      </div>
                    )}
                  </div>

                  <CardTitle className="text-xl text-amber-400 group-hover:text-amber-300 transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-amber-200/70 text-sm leading-relaxed">
                    {course.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center justify-between text-xs text-amber-300/60">
                    {course.duration && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {course.duration}
                      </div>
                    )}
                    
                    {course.students_count && (
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.students_count} estudantes
                      </div>
                    )}
                  </div>

                  {/* Modules Preview */}
                  {course.modules && course.modules.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold text-amber-400">Módulos:</h4>
                      <div className="space-y-1">
                        {course.modules.slice(0, 3).map((module, index) => (
                          <div key={index} className="text-xs text-amber-200/60 flex items-center gap-2">
                            <BookOpen className="w-3 h-3" />
                            {module}
                          </div>
                        ))}
                        {course.modules.length > 3 && (
                          <div className="text-xs text-amber-300/40">
                            +{course.modules.length - 3} módulos adicionais
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Instructor */}
                  {course.instructor && (
                    <div className="flex items-center gap-2 text-xs text-amber-300/60">
                      <Award className="w-3 h-3" />
                      Instrutor: {course.instructor}
                    </div>
                  )}

                  {/* Price and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-amber-900/30">
                    <div className="text-lg font-bold text-amber-400">
                      {course.price > 0 ? `R$ ${course.price}` : 'Gratuito'}
                    </div>
                    
                    <Link href={`/curso/${course.id}`}>
                      <Button 
                        size="sm" 
                        className="bg-amber-900/50 hover:bg-amber-800/70 text-amber-200 border-amber-700 hover:border-amber-600 transition-all duration-300"
                      >
                        Explorar
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Courses State */}
        {!isLoading && courses.length === 0 && (
          <div className="text-center py-20">
            <div className="text-amber-400/60 text-6xl mb-6">📚</div>
            <h3 className="text-2xl text-amber-400 mb-4">Os Ensinamentos Estão Se Manifestando</h3>
            <p className="text-amber-200/60 max-w-md mx-auto">
              Os conhecimentos ancestrais estão sendo preparados pelos Mestres. 
              Retorne em breve para acessar os mistérios do Templo.
            </p>
            <Link href="/">
              <Button 
                className="mt-8 bg-amber-900/50 hover:bg-amber-800/70 text-amber-200 border-amber-700"
              >
                <Eye className="w-4 h-4 mr-2" />
                Retornar ao Templo
              </Button>
            </Link>
          </div>
        )}

        {/* Call to Action Section */}
        {courses.length > 0 && (
          <div className="mt-20 text-center bg-gradient-to-r from-amber-900/20 to-purple-900/20 rounded-xl p-8 border border-amber-900/30">
            <h3 className="text-2xl font-cinzel-decorative text-amber-400 mb-4">
              Inicie Sua Jornada de Conhecimento
            </h3>
            <p className="text-amber-200/70 mb-6 max-w-2xl mx-auto">
              Cada curso é uma porta para dimensões mais profundas da compreensão. 
              Escolha seu caminho e deixe que a sabedoria ancestral guie seus passos.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register">
                <Button className="bg-amber-900/70 hover:bg-amber-800 text-amber-100 border-amber-700">
                  Criar Conta
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" className="border-amber-700 text-amber-400 hover:bg-amber-900/20">
                  Fazer Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}