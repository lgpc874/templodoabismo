import { useQuery } from "@tanstack/react-query";
import { Scroll, Flame, Star, Eye, Moon, Crown } from "lucide-react";
import Navigation from "../components/navigation";
import { Link } from "wouter";

interface DailyQuote {
  content: string;
  author: string;
}

export default function Home() {
  const { data: dailyQuote, isLoading } = useQuery({
    queryKey: ["/api/daily-quote"],
    refetchInterval: 24 * 60 * 60 * 1000, // Refetch every 24 hours
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      {/* Fixed Central Rotating Seal - Your Custom Image */}
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Welcome Section */}
        <div className="text-center mb-12 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-600 animate-pulse">
            TEMPLO DO ABISMO
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Portal ancestral de conhecimentos Luciferianos onde iniciados descobrem os mistérios antigos, 
            acessam grimórios sagrados, consultam oráculos primordiais e despertam sua essência através 
            da gnose abissal.
          </p>
        </div>

        {/* Daily AI Quote */}
        {!isLoading && dailyQuote && (
          <div className="floating-card max-w-2xl mx-auto mb-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-amber-400 mb-4 flex items-center justify-center gap-2">
                <Scroll className="w-6 h-6" />
                Citação Diária
              </h3>
              <div className="text-lg text-gray-300 italic leading-relaxed mb-4">
                "{dailyQuote.content}"
              </div>
              <div className="text-amber-400 font-semibold">
                — {dailyQuote.author}
              </div>
            </div>
          </div>
        )}

        {/* Exploration Grid - Clean buttons without prices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          
          {/* Oráculo Section */}
          <Link href="/oraculo">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <Eye className="w-12 h-12 mx-auto mb-4 text-red-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Oráculo Abissal</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Consulte as forças primordiais através do Tarô Luciferiano, Espelhos Negros, 
                  Runas Antigas e a Voz do Abismo. Revelações profundas aguardam os iniciados.
                </p>
              </div>
            </div>
          </Link>

          {/* Courses Section */}
          <Link href="/courses">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <Flame className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Iniciação Luciferiana</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Jornada progressiva pelos mistérios antigos. Desperte sua chama interior 
                  através de ensinamentos ancestrais e práticas transformadoras.
                </p>
              </div>
            </div>
          </Link>

          {/* Grimoires Section */}
          <Link href="/grimoires">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <Scroll className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Grimórios Ancestrais</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Acesso aos textos sagrados e conhecimentos ocultos. Biblioteca de sabedoria 
                  luciferiana para estudos profundos e prática ritual.
                </p>
              </div>
            </div>
          </Link>



          {/* Bibliotheca Section */}
          <Link href="/bibliotheca">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <Star className="w-12 h-12 mx-auto mb-4 text-blue-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Bibliotheca Secreta</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Arquivo seleto de textos raros e conhecimentos avançados. 
                  Disponível apenas para iniciados de nível superior.
                </p>
              </div>
            </div>
          </Link>

          {/* Pluma Section */}
          <Link href="/voz-da-pluma">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <Moon className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Voz da Pluma</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Reflexões diárias canalizadas do abismo. Sabedoria ancestral 
                  expressa através de poesia mística e prosa profunda.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-20 py-8 border-t border-amber-500/20 bg-black/20 backdrop-blur-lg">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 Templo do Abismo. Todos os direitos reservados aos mistérios ancestrais.
          </p>
        </div>
      </footer>
    </div>
  );
}