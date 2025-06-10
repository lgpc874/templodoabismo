import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BookOpen, Star, Crown, Flame, Eye, Clock, Users, Award, CreditCard } from "lucide-react";
import { Link } from "wouter";
import Footer from "../components/footer";
import PaymentGateway from "@/components/PaymentGateway";

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

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showPayment, setShowPayment] = useState(false);

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
      {/* Enhanced Mystical Particles with Mood Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

      {/* Dynamic Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/40 rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`
            }}
          />
        ))}
      </div>

      {/* Enhanced Floating Smoke Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 opacity-15 smoke-effect"
            style={{
              left: `${Math.random() * 100}%`,
              bottom: '-96px',
              animationDelay: `${Math.random() * 8}s`,
              background: 'radial-gradient(circle, rgba(239,68,68,0.5) 0%, transparent 70%)'
            }}
          />
        ))}
      </div>

      {/* Selo Central Fixo */}
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        {/* Outer rotating ring */}
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">
            ◯
          </div>
        </div>
        
        {/* Middle layer with mystical symbols */}
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">
            ☿
          </div>
        </div>
        
        {/* Main central seal */}
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">
            ⸸
          </div>
        </div>
        
        {/* Inner pulsing core */}
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">
            ●
          </div>
        </div>
      </div>

      {/* Mystical Energy Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/15 to-transparent animate-flicker" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent animate-flicker" style={{animationDelay: '2.5s'}} />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '3.5s'}} />
      </div>

      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
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
                className="floating-card bg-black/8 backdrop-blur-sm border border-white/10 hover:border-amber-500/30 transition-all duration-300 group"
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

                  <CardTitle className="text-xl text-amber-400/70 group-hover:text-amber-300/80 transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-300/70 text-sm leading-relaxed group-hover:text-gray-200/80 transition-colors">
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
                    
                    {course.price > 0 ? (
                      <Button 
                        size="sm" 
                        onClick={() => {
                          setSelectedCourse(course);
                          setShowPayment(true);
                        }}
                        className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white border-amber-500 hover:border-amber-400 transition-all duration-300"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Adquirir
                      </Button>
                    ) : (
                      <Link href={`/curso/${course.id}`}>
                        <Button 
                          size="sm" 
                          className="bg-amber-900/50 hover:bg-amber-800/70 text-amber-200 border-amber-700 hover:border-amber-600 transition-all duration-300"
                        >
                          Acessar
                        </Button>
                      </Link>
                    )}
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

        {/* Payment Dialog */}
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent className="bg-black/95 border-amber-700/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-cinzel-decorative text-amber-400">
                Adquirir Curso: {selectedCourse?.title}
              </DialogTitle>
            </DialogHeader>
            
            {selectedCourse && (
              <div className="space-y-6">
                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700/30">
                  <h4 className="text-lg font-semibold text-amber-300 mb-2">Detalhes do Curso</h4>
                  <p className="text-amber-200/70 text-sm mb-3">{selectedCourse.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-amber-400 font-bold text-xl">
                      R$ {selectedCourse.price}
                    </span>
                    <Badge variant="outline" className="border-amber-600 text-amber-300">
                      {selectedCourse.level}
                    </Badge>
                  </div>
                </div>

                <PaymentGateway
                  amount={selectedCourse.price}
                  currency="BRL"
                  description={`Curso: ${selectedCourse.title}`}
                  onSuccess={(paymentData) => {
                    console.log('Pagamento realizado:', paymentData);
                    setShowPayment(false);
                    // Aqui você pode redirecionar para o curso ou mostrar sucesso
                  }}
                  onError={(error) => {
                    console.error('Erro no pagamento:', error);
                  }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Footer />
    </div>
  );
}