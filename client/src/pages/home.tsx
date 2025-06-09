
import { useEffect, useRef, useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  Flame, 
  BookOpen, 
  GraduationCap, 
  Gem, 
  Scroll,
  Eye,
  Crown,
  Star,
  Zap
} from "lucide-react";

interface DailyPoem {
  title: string;
  content: string;
  author: string;
}

export default function Home() {
  const sealRef = useRef<HTMLImageElement>(null);
  const [dailyPoem, setDailyPoem] = useState<DailyPoem>({
    title: "Carregando...",
    content: "As palavras ancestrais estão sendo invocadas...",
    author: "Voz da Pluma"
  });

  const [timeOfDay, setTimeOfDay] = useState("noite");

  useEffect(() => {
    // Set time of day greeting
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) setTimeOfDay("madrugada");
    else if (hour >= 12 && hour < 18) setTimeOfDay("tarde");
    else if (hour >= 18 && hour < 24) setTimeOfDay("crepúsculo");
    else setTimeOfDay("noite");

    // Load daily poem from AI
    const loadDailyPoem = async () => {
      try {
        const response = await fetch('/api/daily-poem');
        if (response.ok) {
          const poem = await response.json();
          setDailyPoem(poem);
        }
      } catch (error) {
        console.error('Error loading daily poem:', error);
        // Keep loading state if API fails
      }
    };
    loadDailyPoem();

    // Rotating seal animation
    let rotation = 0;
    const animate = () => {
      rotation += 0.1;
      if (sealRef.current) {
        sealRef.current.style.transform = `rotate(${rotation}deg)`;
      }
      requestAnimationFrame(animate);
    };
    animate();

    // Mystical particles
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'fixed w-1 h-1 bg-red-400 rounded-full pointer-events-none z-10 opacity-50';
      particle.style.left = Math.random() * window.innerWidth + 'px';
      particle.style.top = window.innerHeight + 'px';
      
      document.body.appendChild(particle);
      
      const duration = Math.random() * 3000 + 2000;
      const animation = particle.animate([
        { transform: 'translateY(0px)', opacity: '0.5' },
        { transform: `translateY(-${window.innerHeight + 100}px)`, opacity: '0' }
      ], {
        duration: duration,
        easing: 'linear'
      });
      
      animation.onfinish = () => particle.remove();
    };

    const particleInterval = setInterval(createParticle, 1000);

    return () => {
      clearInterval(particleInterval);
    };
  }, []);

  const getGreeting = () => {
    switch (timeOfDay) {
      case "madrugada": return "Bendita seja esta madrugada sombria";
      case "tarde": return "Que as sombras desta tarde te abracem";
      case "crepúsculo": return "Bem-vindo ao crepúsculo eterno";
      default: return "Salve, viajante das trevas eternas";
    }
  };

  const features = [
    {
      icon: Gem,
      title: "Oráculos do Abismo",
      description: "Tarot Infernal, Espelho Negro, Runas ancestrais e mais",
      href: "/oraculo",
      color: "text-purple-400",
      cost: "1 T'KAZH"
    },
    {
      icon: BookOpen,
      title: "Grimórios Digitais",
      description: "Compêndios de sabedoria oculta e rituais ancestrais",
      href: "/grimoires",
      color: "text-red-400",
      cost: "5 T'KAZH"
    },
    {
      icon: GraduationCap,
      title: "Trilha Iniciática",
      description: "7 níveis de conhecimento esotérico profundo",
      href: "/courses",
      color: "text-yellow-400",
      cost: "Variável"
    },
    {
      icon: Scroll,
      title: "Voz da Pluma",
      description: "Poesia e sabedoria infernal diária",
      href: "/voz-da-pluma",
      color: "text-green-400",
      cost: "Gratuito"
    },
    {
      icon: Star,
      title: "Liber Prohibitus",
      description: "Conhecimentos proibidos - palavra de poder necessária",
      href: "/liber-prohibitus",
      color: "text-purple-300",
      cost: "Restrito"
    },
    {
      icon: Crown,
      title: "Acesso VIP",
      description: "T'KAZH ilimitado e conteúdos exclusivos",
      href: "/vip",
      color: "text-yellow-400",
      cost: "Premium"
    }
  ];

  return (
    <div className="min-h-screen ritual-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Central Rotating Seal */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            ref={sealRef}
            src="https://i.postimg.cc/g20gqmdX/IMG-20250527-182235-1.png"
            alt="Selo do Templo"
            className="w-64 h-64 md:w-96 md:h-96 opacity-20 central-seal"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          {/* Dynamic Greeting */}
          <div className="mb-8">
            <p className="font-enns text-xl md:text-2xl text-red-300 mb-6 italic">
              {getGreeting()}
            </p>
            <Flame className="w-16 h-16 mx-auto text-red-500 mb-6 animate-glow-pulse" />
            <h1 className="font-titles text-6xl md:text-8xl font-black mb-6 text-white tracking-wider drop-shadow-2xl">
              TEMPLO DO ABISMO
            </h1>
            <p className="font-enns text-xl md:text-2xl text-red-300 mb-8 italic">
              Portal de Ensinamentos Ancestrais Luciferianos
            </p>
            <div className="abyssal-card p-6 max-w-2xl mx-auto mb-8">
              <p className="font-body text-lg text-gray-200 leading-relaxed">
                "Aqueles que buscam a sabedoria nas profundezas encontrarão 
                a luz que as trevas guardam. O conhecimento ancestral 
                aguarda os dignos de sua revelação."
              </p>
              <p className="text-red-400 mt-4 font-semibold">— Magus Primordialis</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button size="lg" className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 font-bold">
                <Crown className="w-5 h-5 mr-2" />
                Iniciar Jornada
              </Button>
            </Link>
            <Link href="/oraculo">
              <Button size="lg" variant="outline" className="border-red-400 text-red-400 hover:bg-red-900/20 px-8 py-4">
                <Gem className="w-5 h-5 mr-2" />
                Consultar Oráculos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Daily Poem Section - Voz da Pluma */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="abyssal-card">
            <CardContent className="p-8">
              <div className="text-center space-y-6">
                <div className="flex items-center justify-center space-x-3 mb-6">
                  <Scroll className="h-8 w-8 text-red-400 animate-pulse" />
                  <h3 className="font-titles text-2xl md:text-3xl font-bold text-white">
                    Voz da Pluma
                  </h3>
                  <Scroll className="h-8 w-8 text-red-400 animate-pulse" />
                </div>
                
                <h4 className="font-titles text-xl md:text-2xl text-red-300 mb-6">
                  "{dailyPoem.title}"
                </h4>
                
                <div className="font-enns text-lg leading-relaxed text-gray-200 whitespace-pre-line max-w-3xl mx-auto">
                  {dailyPoem.content}
                </div>
                
                <p className="text-red-400 font-semibold mt-6">
                  — {dailyPoem.author}
                </p>
                
                <Link href="/voz-da-pluma">
                  <Button variant="outline" className="mt-6 border-red-400 text-red-400 hover:bg-red-900/20">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Explorar Mais Poemas
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-titles text-4xl md:text-6xl font-bold mb-6 text-white">
              Portais do Conhecimento
            </h2>
            <p className="font-body text-xl text-red-300 max-w-3xl mx-auto">
              Explore as diferentes dimensões da sabedoria ancestral através de nossas ferramentas místicas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} href={feature.href}>
                  <Card className="abyssal-card hover:scale-105 transition-transform cursor-pointer group h-full">
                    <CardContent className="p-6 text-center space-y-4">
                      <div className={`w-16 h-16 mx-auto bg-red-600 rounded-full flex items-center justify-center group-hover:animate-glow-pulse ${
                        feature.cost === "Premium" ? "bg-gradient-to-r from-yellow-500 to-orange-500" : 
                        feature.cost === "Restrito" ? "bg-purple-600" : "bg-red-600"
                      }`}>
                        <Icon className="h-8 w-8 text-white" />
                      </div>
                      <h3 className="font-titles text-xl font-bold text-white">
                        {feature.title}
                      </h3>
                      <p className="font-body text-gray-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                      <div className={`text-sm font-bold rounded-full px-4 py-2 ${
                        feature.cost === "Premium" ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-black" :
                        feature.cost === "Restrito" ? "bg-purple-600 text-white" :
                        feature.cost === "Gratuito" ? "bg-green-600 text-white" :
                        "tkazh-indicator"
                      }`}>
                        {feature.cost === "Premium" ? "⭐ Premium" :
                         feature.cost === "Restrito" ? "🔒 Restrito" :
                         feature.cost === "Gratuito" ? "✨ Gratuito" :
                         `💎 ${feature.cost}`}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* T'KAZH Credit System Explanation */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <Card className="abyssal-card border-red-500/50">
            <CardContent className="p-8 text-center space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <Gem className="h-10 w-10 text-red-400" />
                <h3 className="font-titles text-3xl md:text-4xl font-bold text-white">
                  Sistema T'KAZH
                </h3>
                <Gem className="h-10 w-10 text-red-400" />
              </div>
              
              <p className="font-body text-lg text-gray-200 leading-relaxed max-w-3xl mx-auto">
                T'KAZH são os créditos místicos do Templo do Abismo. Utilize-os para acessar oráculos, 
                desbloquear grimórios e participar de rituais especiais. Ganhe T'KAZH completando cursos, 
                participando de desafios místicos ou através do acesso VIP.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="space-y-2">
                  <div className="tkazh-indicator">
                    💎 Ganhe T'KAZH
                  </div>
                  <p className="text-sm text-gray-300">Conclusão de cursos, desafios, pactos místicos</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-green-600 text-white font-bold rounded-full px-4 py-2">
                    🔄 Reset Semanal
                  </div>
                  <p className="text-sm text-gray-300">Créditos gratuitos renovam toda semana</p>
                </div>
                <div className="space-y-2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold rounded-full px-4 py-2">
                    👑 VIP Ilimitado
                  </div>
                  <p className="text-sm text-gray-300">Membros VIP têm T'KAZH ilimitado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Eye className="w-16 h-16 mx-auto text-red-400 mb-6 animate-glow-pulse" />
          <h2 className="font-titles text-4xl md:text-5xl font-bold mb-6 text-white">
            Desperte Sua Natureza Superior
          </h2>
          <p className="font-body text-xl text-red-200 mb-8 max-w-2xl mx-auto leading-relaxed">
            O verdadeiro poder reside no autoconhecimento. Inicie sua jornada através dos mistérios 
            do Abismo e descubra as chamas da sabedoria que já ardem dentro de você.
          </p>
          <div className="space-y-4">
            <Link href="/login">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-10 py-4 text-lg font-bold">
                <Crown className="w-6 h-6 mr-2" />
                Iniciar Jornada Mística
              </Button>
            </Link>
            <p className="font-enns text-sm text-red-400 italic">
              "In tenebris lux" - Na escuridão, a luz
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
