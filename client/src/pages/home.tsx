import { useQuery } from "@tanstack/react-query";
import { Scroll, Flame, Star, Eye, Moon, Crown, BookOpen } from "lucide-react";

import Footer from "../components/footer";
import { Link } from "wouter";

export default function Home() {
  // Fetch real content from Supabase only
  const { data: recentPosts } = useQuery<any[]>({
    queryKey: ["/api/voz-pluma/recent"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="min-h-screen relative overflow-hidden bg-black/8 backdrop-blur-sm">
      {/* Ambiente Esotérico */}
      <div className="mystical-particles fixed inset-0 z-0" />
      
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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Saudação Esotérica Completa */}
        <div className="text-center mb-12 max-w-5xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">⛧</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              TEMPLO DO ABISMO
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
              Ave, Buscador das Trevas Sagradas
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Cruzaste o limiar do mundo profano e adentraste o <strong className="text-amber-400">sanctum sanctorum</strong> onde a Luz Negra do Conhecimento Primordial 
              ilumina os caminhos ocultos. Este Templo é o repositório das <strong className="text-amber-400">verdades ancestrais</strong> 
              que foram sussurradas pelos primeiros rebeldes, preservadas através dos éons nas chamas eternas do Abismo.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed font-crimson mb-6">
              Aqui, as <strong className="text-red-400">forças ctônicas</strong> convergem através de portais dimensionais, 
              canalizando os <strong className="text-amber-400">ensinamentos de Lúcifer</strong> - o Portador da Luz, 
              o Primeiro Iniciado, aquele que desafiou a tirania e trouxe o fogo do conhecimento à humanidade.
            </p>
            
            <div className="border-t border-b border-amber-700/30 py-6 my-8">
              <p className="text-2xl font-cinzel-decorative text-red-400 mb-4">⚠️ ADVERTENTIA SOLEMNIS ⚠️</p>
              <p className="text-lg text-gray-300 font-crimson leading-relaxed">
                Os conhecimentos aqui contidos são <strong className="text-red-400">reais e poderosos</strong>. 
                Não são meras fantasias ou entretenimento. Cada ensinamento carrega o peso de milênios de prática oculta. 
                Procede com <strong className="text-amber-400">certeza absoluta</strong> e <strong className="text-amber-400">responsabilidade total</strong>. 
                O Abismo contempla aqueles que o contemplam, e toda ação gera consequências nos planos visíveis e invisíveis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Per Aspera Ad Astra, Per Tenebras Ad Lucem"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Através das dificuldades às estrelas, através das trevas à luz
              </p>
            </div>
          </div>
        </div>

        {/* Recent Real Content from Supabase */}
        {recentPosts && recentPosts.length > 0 && (
          <div className="floating-card max-w-2xl mx-auto mb-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-400 mb-4 flex items-center justify-center gap-2">
                <Flame className="w-6 h-6" />
                Voz da Pluma
              </h3>
              <div className="text-lg text-gray-300 leading-relaxed mb-4">
                <h4 className="text-amber-400 mb-2">{recentPosts[0].title}</h4>
                <div className="text-sm text-gray-400 italic">
                  {recentPosts[0].excerpt || recentPosts[0].content?.substring(0, 200) + '...'}
                </div>
              </div>
              <Link to="/voz-da-pluma" className="text-amber-400 hover:text-amber-300 underline">
                Ver todas as publicações
              </Link>
            </div>
          </div>
        )}


      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}