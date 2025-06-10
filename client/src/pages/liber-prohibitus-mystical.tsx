import { useQuery } from "@tanstack/react-query";
import { BookOpen, Flame, Star, Eye, Moon, Crown, Shield } from "lucide-react";
import Footer from "../components/footer";
import { Link } from "wouter";

interface DailyQuote {
  content: string;
  author: string;
}

export default function LiberProhibitus() {
  const { data: dailyQuote, isLoading } = useQuery<DailyQuote>({
    queryKey: ["/api/daily-quote"],
    refetchInterval: 24 * 60 * 60 * 1000, // Refetch every 24 hours
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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-5xl">
          <div className="mb-8">
            <div className="text-red-400 text-6xl mb-4">⚠</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-red-400 mystical-glow mb-6 floating-title">
              LIBER PROHIBITUS
            </h1>
            <div className="flex justify-center items-center space-x-8 text-red-500 text-3xl mb-6">
              <span>☠</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☠</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-red-300 mb-6 floating-title-slow">
              Codex Obscurus - Os Textos Proibidos
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Bem-vindo ao <strong className="text-red-400">sanctum interdictum</strong> onde repousam os manuscritos mais perigosos 
              e controversos da tradição oculta. Estes são os <strong className="text-amber-400">libri prohibiti</strong> - 
              textos que foram banidos, censurados ou considerados demasiadamente poderosos para circulação pública.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed font-crimson mb-6">
              Cada documento aqui presente carrega o peso de <strong className="text-red-400">conhecimentos perigosos</strong>, 
              práticas que transcendem os limites da realidade consensual e ensinamentos que podem alterar 
              permanentemente a percepção do praticante sobre a natureza da existência.
            </p>
            
            <div className="border-t border-b border-red-700/30 py-6 my-8">
              <p className="text-2xl font-cinzel-decorative text-red-400 mb-4">⚠️ PERICULUM MAXIMUM ⚠️</p>
              <p className="text-lg text-gray-300 font-crimson leading-relaxed">
                Estes conhecimentos são <strong className="text-red-400">extremamente avançados</strong> e destinam-se 
                exclusivamente a <strong className="text-amber-400">mestres experientes</strong>. 
                O Templo do Abismo adverte que a aplicação inadequada destes ensinamentos pode resultar em 
                <strong className="text-red-400">consequências irreversíveis</strong> nos planos material e espiritual.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-red-400 text-2xl mb-4">𖤍 ⚠ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-red-300">
                "Scientia Potestas Est, Sed Cum Periculo"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                O conhecimento é poder, mas com perigo
              </p>
            </div>
          </div>
        </div>

        {/* Daily AI Quote */}
        {!isLoading && dailyQuote && (
          <div className="floating-card max-w-2xl mx-auto mb-12 p-8 bg-black/20 backdrop-blur-lg border border-red-500/20 rounded-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center justify-center gap-2">
                <Flame className="w-6 h-6" />
                Vox Abyssi Quotidiana
                <Flame className="w-6 h-6" />
              </h3>
              <blockquote className="text-lg text-gray-300 font-crimson italic leading-relaxed mb-4">
                "{dailyQuote.content}"
              </blockquote>
              <cite className="text-amber-400 font-cinzel">
                — {dailyQuote.author}
              </cite>
            </div>
          </div>
        )}


      </div>

      <Footer />
    </div>
  );
}