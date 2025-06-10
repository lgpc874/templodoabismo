import { useQuery } from "@tanstack/react-query";
import { Scroll, Flame, Star, Eye, Moon, Crown, BookOpen } from "lucide-react";

import Footer from "../components/footer";
import { Link } from "wouter";

interface DailyQuote {
  content: string;
  author: string;
}

export default function Home() {
  const { data: dailyQuote, isLoading } = useQuery<DailyQuote>({
    queryKey: ["/api/daily-quote"],
    refetchInterval: 24 * 60 * 60 * 1000, // Refetch every 24 hours
  });

  return (
    <div className="min-h-screen relative overflow-hidden">

      
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
            TEMPLUM ABYSSOS
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
            Portal das trevas sagradas onde almas corajosas adentram os mistérios primordiais. 
            Aqui repousam grimórios ancestrais, oráculos abissais e conhecimentos vedados que 
            despertam a chama interior através da gnose luciferiana.
          </p>
        </div>

        {/* Daily AI Quote */}
        {!isLoading && dailyQuote && (
          <div className="floating-card max-w-2xl mx-auto mb-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center justify-center gap-2">
                <Flame className="w-6 h-6" />
                Susurri Abyssos
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
                <h3 className="text-xl font-bold text-amber-400 mb-3">Oraculum Tenebrae</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Desperte os véus entre mundos através de rituais divinatórios ancestrais. 
                  As entidades sussurram segredos àqueles que ousam questionar o destino.
                </p>
              </div>
            </div>
          </Link>

          {/* Courses Section */}
          <Link href="/courses">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <Flame className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Academia Luciferiana</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Sete círculos de conhecimento forbidden onde almas destemidas transcendem 
                  os limites da consciência mortal através da gnose luciferiana.
                </p>
              </div>
            </div>
          </Link>

          {/* Grimoires Section */}
          <Link href="/grimoires">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <Scroll className="w-12 h-12 mx-auto mb-4 text-purple-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Bibliotheca Abyssos</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Manuscritos sombrios onde repousam invocações primordiais e rituais ctônicos. 
                  Cada página pulsa com poder ancestral das correntes abissais.
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
                  Câmara vedada onde dormem os segredos supremos dos antigos mestres. 
                  Manuscritos que testam os limites da sanidade e transcendência.
                </p>
              </div>
            </div>
          </Link>

          {/* Pluma Section */}
          <Link href="/voz-da-pluma">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <Moon className="w-12 h-12 mx-auto mb-4 text-indigo-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Vox Plumae</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Sussurros poéticos das musas sombrias onde a beleza emerge das trevas. 
                  Versos que nutrem a alma através da contemplação mística.
                </p>
              </div>
            </div>
          </Link>

          {/* Blog Section */}
          <Link href="/blog">
            <div className="floating-card group cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="p-6 text-center">
                <BookOpen className="w-12 h-12 mx-auto mb-4 text-emerald-500" />
                <h3 className="text-xl font-bold text-amber-400 mb-3">Gnosis Abyssos</h3>
                <p className="text-gray-300 text-sm leading-relaxed">
                  Portal público de conhecimento sobre luciferianismo ancestral e gnose ctônica. 
                  Artigos educativos para todos os buscadores da sabedoria oculta.
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}