import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { 
  BookOpen, 
  Star, 
  Clock, 
  Users, 
  Award,
  Lock,
  CheckCircle,
  Gem,
  Crown
} from "lucide-react";

export default function Courses() {
  const { user } = useAuth();
  const [selectedLevel, setSelectedLevel] = useState("all");

  const courses = [
    {
      id: 1,
      title: "Filosofia Luciferiana Básica",
      description: "Fundamentos dos ensinamentos ancestrais e filosofia do despertar",
      level: 1,
      modules: 7,
      duration: "6 semanas",
      students: 342,
      price: 50,
      rating: 4.8,
      instructor: "Mestre Astaroth",
      difficulty: "Iniciante",
      preview: "Introdução aos princípios fundamentais da filosofia luciferiana e auto-deificação"
    },
    {
      id: 2,
      title: "Meditação Abissal",
      description: "Técnicas de meditação para conexão com as profundezas do inconsciente",
      level: 2,
      modules: 5,
      duration: "4 semanas", 
      students: 218,
      price: 75,
      rating: 4.9,
      instructor: "Sacerdotisa Lilith",
      difficulty: "Básico",
      preview: "Práticas meditativas para explorar os reinos internos e expandir a consciência"
    },
    {
      id: 3,
      title: "Rituais de Invocação",
      description: "Cerimônias e rituais para invocação de energias ancestrais",
      level: 3,
      modules: 8,
      duration: "8 semanas",
      students: 156,
      price: 120,
      rating: 4.7,
      instructor: "Hierofante Bael",
      difficulty: "Intermediário",
      preview: "Conhecimento prático de rituais e cerimônias de invocação"
    },
    {
      id: 4,
      title: "Alquimia Espiritual",
      description: "Transformação interior através dos princípios alquímicos",
      level: 4,
      modules: 10,
      duration: "12 semanas",
      students: 89,
      price: 180,
      rating: 4.9,
      instructor: "Mago Hermes",
      difficulty: "Avançado",
      preview: "Processos de transmutação interior e desenvolvimento espiritual"
    },
    {
      id: 5,
      title: "Magia Caótica",
      description: "Paradigmas modernos de prática mágica e realidade consensual",
      level: 5,
      modules: 6,
      duration: "8 semanas",
      students: 67,
      price: 200,
      rating: 4.8,
      instructor: "Caósofo Discordia",
      difficulty: "Especialista",
      preview: "Exploração dos paradigmas da magia caótica e manipulação da realidade"
    },
    {
      id: 6,
      title: "Gnose Draconiana",
      description: "Caminhos draconiano e sua aplicação na jornada iniciática",
      level: 6,
      modules: 12,
      duration: "16 semanas",
      students: 34,
      price: 300,
      rating: 5.0,
      instructor: "Dragão Ancião Tiamat",
      difficulty: "Mestre",
      preview: "Conhecimentos avançados da corrente draconiana e auto-deificação"
    },
    {
      id: 7,
      title: "Iniciação Qliphótica",
      description: "Exploração das esferas sombrias da Árvore da Morte",
      level: 7,
      modules: 15,
      duration: "24 semanas",
      students: 12,
      price: 500,
      rating: 5.0,
      instructor: "Avatar do Abismo",
      difficulty: "Magus",
      preview: "Jornada através das Qliphoth e integração das sombras cósmicas"
    }
  ];

  const levels = [
    { value: "all", label: "Todos os Níveis" },
    { value: "1", label: "Nível 1 - Iniciante" },
    { value: "2", label: "Nível 2 - Básico" },
    { value: "3", label: "Nível 3 - Intermediário" },
    { value: "4", label: "Nível 4 - Avançado" },
    { value: "5", label: "Nível 5 - Especialista" },
    { value: "6", label: "Nível 6 - Mestre" },
    { value: "7", label: "Nível 7 - Magus" }
  ];

  const filteredCourses = selectedLevel === "all" 
    ? courses 
    : courses.filter(course => course.level.toString() === selectedLevel);

  const canAccessCourse = (courseLevel: number) => {
    if (!user) return false;
    return user.initiation_level >= courseLevel;
  };

  const enrollInCourse = (course: any) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!canAccessCourse(course.level)) {
      alert(`Você precisa estar no nível ${course.level} de iniciação para acessar este curso.`);
      return;
    }

    if (user.tkazh_credits < course.price) {
      window.location.href = '/comprar-tkazh';
      return;
    }

    // Here would process enrollment
    console.log('Enrolling in course:', course.title);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-titles text-yellow-600 mb-4 flame-text-clean">
            Cursos Esotéricos
          </h1>
          <p className="text-xl text-gray-200 font-serif">
            Caminhos de Conhecimento Luciferiano em Sete Níveis de Iniciação
          </p>
        </div>

        {/* Level Filter */}
        <Card className="abyssal-card-transparent max-w-4xl mx-auto mb-12">
          <CardContent className="py-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {levels.map((level) => (
                <Button
                  key={level.value}
                  variant={selectedLevel === level.value ? "default" : "outline"}
                  className={`${
                    selectedLevel === level.value
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-black'
                      : 'border-yellow-600/50 text-yellow-600 hover:bg-yellow-600/10'
                  }`}
                  onClick={() => setSelectedLevel(level.value)}
                >
                  {level.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Progress */}
        {user && (
          <Card className="abyssal-card-transparent max-w-2xl mx-auto mb-12">
            <CardHeader className="text-center">
              <Crown className="w-12 h-12 text-purple-400 mx-auto mb-3" />
              <CardTitle className="text-2xl font-titles text-yellow-600">
                Seu Progresso Iniciático
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex items-center justify-center space-x-8 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{user.initiation_level}</div>
                  <div className="text-gray-300">Nível Atual</div>
                </div>
                <div className="text-center">
                  <Gem className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-xl font-bold text-yellow-500">{user.tkazh_credits}</div>
                  <div className="text-gray-300">T'KAZH</div>
                </div>
              </div>
              <Progress value={(user.initiation_level / 7) * 100} className="w-full" />
              <p className="text-gray-400 mt-2">
                Progresso: {user.initiation_level}/7 níveis completos
              </p>
            </CardContent>
          </Card>
        )}

        {/* Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="abyssal-card-transparent h-full">
              <CardHeader>
                <div className="flex items-start justify-between mb-3">
                  <Badge 
                    variant={canAccessCourse(course.level) ? "default" : "secondary"}
                    className={`${
                      canAccessCourse(course.level) 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}
                  >
                    Nível {course.level} - {course.difficulty}
                  </Badge>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-yellow-500 font-semibold">{course.rating}</span>
                  </div>
                </div>
                
                <CardTitle className="text-xl font-titles text-yellow-600 mb-2">
                  {course.title}
                </CardTitle>
                
                <CardDescription className="text-gray-300">
                  {course.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  <p className="text-gray-200 text-sm leading-relaxed">
                    {course.preview}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-300">
                      <BookOpen className="w-4 h-4 mr-2 text-blue-400" />
                      {course.modules} módulos
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-4 h-4 mr-2 text-green-400" />
                      {course.duration}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="w-4 h-4 mr-2 text-purple-400" />
                      {course.students} estudantes
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Award className="w-4 h-4 mr-2 text-yellow-400" />
                      {course.instructor}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-yellow-600/20">
                    <div className="text-2xl font-bold text-yellow-500">
                      {course.price} T'KAZH
                    </div>
                    
                    {!user ? (
                      <Button 
                        className="bg-yellow-600 hover:bg-yellow-700 text-black"
                        onClick={() => window.location.href = '/login'}
                      >
                        Entrar para Acessar
                      </Button>
                    ) : !canAccessCourse(course.level) ? (
                      <Button disabled className="opacity-50 cursor-not-allowed">
                        <Lock className="w-4 h-4 mr-2" />
                        Nível {course.level} Requerido
                      </Button>
                    ) : user.tkazh_credits < course.price ? (
                      <Button 
                        variant="outline"
                        className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black"
                        onClick={() => window.location.href = '/comprar-tkazh'}
                      >
                        Comprar T'KAZH
                      </Button>
                    ) : (
                      <Button 
                        className="bg-yellow-600 hover:bg-yellow-700 text-black"
                        onClick={() => enrollInCourse(course)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Inscrever-se
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-titles text-yellow-600 mb-2">
                Nenhum curso encontrado
              </h3>
              <p className="text-gray-400">
                Não há cursos disponíveis para o nível selecionado.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}