import { useMutation } from "@tanstack/react-query";
import { 
  BookOpen, 
  Clock, 
  ShoppingCart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Courses() {
  const { toast } = useToast();

  // Cursos infernais do Templo
  const cursosInfernais = [
    {
      id: 1,
      title: "🔥 Despertar da Chama Interior",
      description: "Desperte sua natureza luciferiana e rompa com as limitações impostas pela sociedade profana.",
      price: "R$ 97,00",
      level: "Iniciante",
      duration: "4 semanas",
      modules: 12
    },
    {
      id: 2,
      title: "🐍 Sabedoria da Serpente Primordial",
      description: "Conecte-se com a antiga sabedoria reptiliana e desenvolva sua intuição mágica suprema.",
      price: "R$ 147,00",
      level: "Intermediário",
      duration: "6 semanas",
      modules: 18
    },
    {
      id: 3,
      title: "👑 Alquimia da Autodivindade",
      description: "Transforme-se no deus de sua própria existência através da alquimia espiritual luciferiana.",
      price: "R$ 197,00",
      level: "Avançado",
      duration: "8 semanas",
      modules: 24
    },
    {
      id: 4,
      title: "⚔️ Guerra Psíquica e Proteção",
      description: "Domine técnicas de combate espiritual e proteja-se contra ataques energéticos e vampirismo.",
      price: "R$ 127,00",
      level: "Intermediário",
      duration: "5 semanas",
      modules: 15
    },
    {
      id: 5,
      title: "🌑 Magia das Sombras Ancestrais",
      description: "Explore os mistérios das trevas e aprenda a manipular as forças obscuras da natureza.",
      price: "R$ 247,00",
      level: "Avançado",
      duration: "10 semanas",
      modules: 30
    },
    {
      id: 6,
      title: "💀 Necromancia e Comunicação Espiritual",
      description: "Estabeleça contato com entidades desencarnadas e domine os segredos da morte e renascimento.",
      price: "R$ 297,00",
      level: "Mestre",
      duration: "12 semanas",
      modules: 36
    }
  ];

  const purchaseMutation = useMutation({
    mutationFn: async (courseId: number) => {
      // Simular compra por enquanto
      return { success: true, courseId };
    },
    onSuccess: () => {
      toast({
        title: "Curso adquirido!",
        description: "Redirecionando para o pagamento...",
      });
    },
    onError: () => {
      toast({
        title: "Erro na compra",
        description: "Tente novamente em alguns momentos",
        variant: "destructive",
      });
    },
  });

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
            <div className="text-amber-400 text-6xl mb-4">🔥</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              ACADEMIA INFERNAL
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
              Do Iniciante ao Mestre das Trevas
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Adentre o <strong className="text-red-400">caminho da autodivindade</strong> através de nossos cursos infernais. 
              Cada ensinamento foi forjado nas <strong className="text-amber-400">chamas primordiais do conhecimento proibido</strong>, 
              conduzindo sua alma desde o despertar inicial até a <strong className="text-red-400">maestria absoluta das artes sombrias</strong>.
            </p>

            <p className="text-lg text-gray-300 leading-relaxed font-crimson mb-6">
              Aqui você <strong className="text-amber-400">não apenas aprende teoria</strong> - você se transforma completamente. 
              Cada curso é uma <strong className="text-red-400">jornada de transmutação espiritual</strong> que desperta poderes 
              dormentes e quebra as correntes da ignorância humana.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Ab Initio Ad Astra"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Do início às estrelas - Transformação total da alma
              </p>
            </div>
          </div>
        </div>

        {/* Cursos Grid */}
        <div className="floating-card max-w-6xl w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-cinzel-decorative text-amber-300">
                Cursos Disponíveis
              </h3>
              <Badge variant="outline" className="border-amber-500/30 text-amber-300 bg-amber-500/10">
                {cursosInfernais.length} cursos
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cursosInfernais.map((course) => (
                <Card key={course.id} className="bg-black/20 border-amber-500/20 hover:border-amber-400/40 transition-all duration-300 transform hover:scale-105">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-amber-400 text-lg leading-tight">
                      {course.title}
                    </CardTitle>
                    <CardDescription className="text-gray-400 text-sm leading-relaxed">
                      {course.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {course.duration}
                        </div>
                        <div className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {course.modules} módulos
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge className="bg-amber-600/20 text-amber-300 border-amber-500/30 text-xs">
                          {course.level}
                        </Badge>
                        <span className="text-xl font-bold text-amber-400">
                          {course.price}
                        </span>
                      </div>
                      
                      <Button 
                        onClick={() => purchaseMutation.mutate(course.id)}
                        disabled={purchaseMutation.isPending}
                        className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                      >
                        {purchaseMutation.isPending ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                        ) : (
                          <ShoppingCart className="w-4 h-4 mr-2" />
                        )}
                        Comprar Curso
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}