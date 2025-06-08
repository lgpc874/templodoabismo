
import { useEffect, useRef } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  Flame, 
  BookOpen, 
  GraduationCap, 
  Gem, 
  Scroll,
  Eye,
  Crown,
  Zap
} from "lucide-react";

export default function Home() {
  const sealRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
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

  const features = [
    {
      icon: Gem,
      title: "Oráculos do Abismo",
      description: "Tarot Infernal, Espelho Negro, Runas ancestrais e mais",
      href: "/oraculo",
      color: "text-purple-400"
    },
    {
      icon: BookOpen,
      title: "Grimórios Digitais",
      description: "Compêndios de sabedoria oculta e rituais ancestrais",
      href: "/grimorios",
      color: "text-red-400"
    },
    {
      icon: GraduationCap,
      title: "Trilha Iniciática",
      description: "7 níveis de conhecimento esotérico profundo",
      href: "/cursos",
      color: "text-yellow-400"
    },
    {
      icon: Scroll,
      title: "Voz da Pluma",
      description: "Poesia e sabedoria infernal diária",
      href: "/voz-da-pluma",
      color: "text-green-400"
    }
  ];

  return (
    <div className="min-h-screen text-red-100">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Central Rotating Seal */}
        <div className="absolute inset-0 flex items-center justify-center">
          <img 
            ref={sealRef}
            src="https://i.postimg.cc/g20gqmdX/IMG-20250527-182235-1.png"
            alt="Selo do Templo"
            className="w-64 h-64 md:w-96 md:h-96 opacity-30"
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="mb-8">
            <Flame className="w-16 h-16 mx-auto text-red-500 mb-4 animate-pulse" />
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-red-500 via-red-400 to-yellow-400 bg-clip-text text-transparent">
              TEMPLO DO ABISMO
            </h1>
            <p className="text-xl md:text-2xl text-red-300 mb-8 italic">
              "Portal Místico de Sabedoria Infernal"
            </p>
            <p className="text-lg text-red-200 max-w-2xl mx-auto leading-relaxed">
              Adentre os mistérios ancestrais através de oráculos sagrados, grimórios proibidos 
              e a trilha iniciática que conduz ao verdadeiro conhecimento interior.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/oraculo">
              <Button size="lg" className="bg-red-800 hover:bg-red-700 text-white px-8 py-4">
                <Gem className="w-5 h-5 mr-2" />
                Consultar Oráculos
              </Button>
            </Link>
            <Link href="/cursos">
              <Button size="lg" variant="outline" className="border-red-400 text-red-400 hover:bg-red-900/20 px-8 py-4">
                <GraduationCap className="w-5 h-5 mr-2" />
                Iniciar Jornada
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-red-400">
              Caminhos do Conhecimento
            </h2>
            <p className="text-xl text-red-300 max-w-3xl mx-auto">
              Explore as diferentes dimensões da sabedoria ancestral através de nossas ferramentas místicas
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link key={index} href={feature.href}>
                  <div className="group bg-black/40 backdrop-blur-sm border border-red-900/30 rounded-lg p-6 hover:border-red-500/50 transition-all duration-300 cursor-pointer h-full">
                    <div className="text-center">
                      <Icon className={`w-12 h-12 mx-auto mb-4 ${feature.color} group-hover:scale-110 transition-transform`} />
                      <h3 className="text-xl font-bold text-red-200 mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-red-300 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-red-900/20 to-black/40">
        <div className="max-w-4xl mx-auto text-center">
          <Eye className="w-16 h-16 mx-auto text-red-400 mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-red-300">
            Desperte Sua Natureza Superior
          </h2>
          <p className="text-xl text-red-200 mb-8 max-w-2xl mx-auto">
            O verdadeiro poder reside no autoconhecimento. Inicie sua jornada através dos mistérios 
            do Abismo e descubra as chamas da sabedoria que já ardem dentro de você.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white px-10 py-4 text-lg">
              <Crown className="w-6 h-6 mr-2" />
              Iniciar Jornada Mística
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
