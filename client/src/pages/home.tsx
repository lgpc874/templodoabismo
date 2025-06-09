import { useState, useEffect } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { 
  BookOpen, 
  Scroll, 
  Eye, 
  Flame, 
  Star,
  Crown,
  Feather,
  Shield,
  Users,
  DollarSign,
  Gem
} from "lucide-react";

interface DailyPoem {
  title: string;
  content: string;
  author: string;
}

export default function Home() {
  const { user } = useAuth();
  const [dailyPoem, setDailyPoem] = useState<DailyPoem | null>(null);

  useEffect(() => {
    loadDailyPoem();
  }, []);

  const loadDailyPoem = async () => {
    try {
      const response = await fetch('/api/daily-poem');
      if (response.ok) {
        const poem = await response.json();
        setDailyPoem(poem);
      }
    } catch (error) {
      console.error('Error loading daily poem:', error);
    }
  };

  const sections = [
    {
      icon: Eye,
      title: "Oráculos Ancestrais",
      description: "Consulte os cinco oráculos sagrados para obter sabedoria ancestral",
      href: "/oraculo",
      cost: "10-25 T'KAZH",
      color: "text-purple-400"
    },
    {
      icon: BookOpen,
      title: "Cursos Esotéricos", 
      description: "Caminhos de conhecimento luciferiano em 7 níveis de iniciação",
      href: "/courses",
      cost: "50-200 T'KAZH",
      color: "text-blue-400"
    },
    {
      icon: Scroll,
      title: "Grimórios Sagrados",
      description: "Textos ancestrais e códices de sabedoria oculta",
      href: "/grimoires",
      cost: "100+ T'KAZH",
      color: "text-red-400"
    },
    {
      icon: Flame,
      title: "Biblioteca Secreta",
      description: "Acesso à vasta coleção de conhecimentos ocultos",
      href: "/bibliotheca",
      cost: "Gratuito",
      color: "text-orange-400"
    },
    {
      icon: Feather,
      title: "Voz da Pluma",
      description: "Poesias místicas e textos inspiracionais diários",
      href: "/voz-da-pluma",
      cost: "Gratuito",
      color: "text-cyan-400"
    },
    {
      icon: Star,
      title: "Área VIP",
      description: "Conteúdo exclusivo para iniciados avançados",
      href: "/vip",
      cost: "Premium",
      color: "text-yellow-400"
    },
    {
      icon: Shield,
      title: "Liber Prohibitus",
      description: "Conhecimentos restritos aos mais preparados",
      href: "/liber-prohibitus",
      cost: "Especial",
      color: "text-red-500"
    },
    {
      icon: Users,
      title: "Sobre o Templo",
      description: "Conheça nossa história e filosofia ancestral",
      href: "/sobre", 
      cost: "Gratuito",
      color: "text-green-400"
    },
    {
      icon: DollarSign,
      title: "Adquirir T'KAZH",
      description: "Compre créditos para acessar todos os serviços",
      href: "/comprar-tkazh",
      cost: "Pagamento",
      color: "text-emerald-400"
    }
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Fixed Central Rotating Seal - Larger and more prominent */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <div className="rotating-seal w-80 h-80 opacity-15">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle cx="100" cy="100" r="90" fill="none" stroke="rgb(234, 179, 8)" strokeWidth="2"/>
            <polygon points="100,20 130,80 190,80 140,120 160,180 100,140 40,180 60,120 10,80 70,80" 
                     fill="none" stroke="rgb(234, 179, 8)" strokeWidth="2"/>
            <circle cx="100" cy="100" r="15" fill="rgb(234, 179, 8)"/>
            <path d="M100,85 L115,100 L100,115 L85,100 Z" fill="rgb(234, 179, 8)"/>
          </svg>
        </div>
      </div>

      {/* Mystical floating particles */}
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
      </div>
      
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center z-10 pt-20">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-6xl md:text-8xl font-titles text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-yellow-500 to-amber-600 mb-6 drop-shadow-2xl">
              TEMPLO DO ABISMO
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-serif mb-8 drop-shadow-lg">
              Portal Místico de Ensinamentos Luciferiano-Ancestrais
            </p>
          </div>

          {user ? (
            <div className="bg-black/30 backdrop-blur-md border border-yellow-600/40 rounded-xl p-6 mb-8 shadow-2xl">
              <p className="text-gray-200 mb-4 text-lg">
                Bem-vindo de volta, <span className="text-yellow-500 font-semibold">{user.username}</span>
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm">
                <div className="text-center">
                  <Gem className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                  <div className="text-yellow-500 font-bold text-xl">{user.tkazh_credits}</div>
                  <div className="text-gray-300">T'KAZH</div>
                </div>
                <div className="text-center">
                  <Star className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <div className="text-blue-400 font-bold text-xl">{user.free_credits}</div>
                  <div className="text-gray-300">Grátis</div>
                </div>
                <div className="text-center">
                  <Crown className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <div className="text-purple-400 font-bold text-xl">Nível {user.initiation_level}</div>
                  <div className="text-gray-300">Iniciação</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <Link href="/login">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 text-black px-8 py-4 font-bold text-lg shadow-2xl border-2 border-yellow-500/50"
                >
                  <Crown className="w-6 h-6 mr-2" />
                  Entrar no Templo
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Sections Grid */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <h2 className="text-4xl font-titles text-yellow-600 text-center mb-12">
          Portais do Conhecimento
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <Link key={index} href={section.href}>
              <Card className="bg-black/20 backdrop-blur-md border border-yellow-600/30 hover:border-yellow-500/60 hover:scale-105 transition-all duration-300 cursor-pointer group h-full shadow-lg hover:shadow-2xl">
                <CardHeader className="text-center pb-4">
                  <section.icon className={`w-12 h-12 ${section.color} mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg`} />
                  <CardTitle className="font-titles text-xl text-yellow-600 group-hover:text-yellow-400 transition-colors">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-200 mb-4 leading-relaxed">{section.description}</p>
                  <div className="text-sm text-yellow-500 font-semibold px-3 py-1 bg-yellow-600/20 rounded-full inline-block">
                    {section.cost}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Daily Poem Section */}
      {dailyPoem && (
        <div className="relative z-10 container mx-auto px-4 py-16">
          <Card className="bg-black/20 backdrop-blur-md border border-yellow-600/30 max-w-3xl mx-auto shadow-2xl">
            <CardHeader className="text-center">
              <CardTitle className="font-titles text-3xl text-yellow-600 flex items-center justify-center">
                <Feather className="w-8 h-8 mr-3 text-cyan-400 filter drop-shadow-lg" />
                Voz da Pluma
              </CardTitle>
              <CardDescription className="text-gray-300 text-lg">
                Poema Místico do Dia
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <h3 className="text-2xl font-bold text-yellow-500 mb-6">{dailyPoem.title}</h3>
              <div className="text-gray-200 mb-6 whitespace-pre-line font-serif leading-relaxed text-lg">
                {dailyPoem.content}
              </div>
              <p className="text-gray-400 italic text-lg">— {dailyPoem.author}</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Footer />
    </div>
  );
}