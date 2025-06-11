import { useQuery } from "@tanstack/react-query";
import { Scroll, Flame, Star, Eye, Moon, Crown, BookOpen } from "lucide-react";

import Footer from "../components/footer";
import { Link } from "wouter";
import { CentralLogo } from '@/components/CentralLogo';

export default function Home() {
  // Fetch real content from Supabase only
  const { data: recentPosts } = useQuery<any[]>({
    queryKey: ["/api/voz-pluma/recent"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Mystical Particles with Mood Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

      {/* Dynamic Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 particle rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)'
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

      {/* Logo Central Girando */}
      <CentralLogo />



      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
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
          
          <div className="text-center mb-12 max-w-5xl bg-black/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-400/70 mb-6 floating-title-slow">
              Ave, Buscador das Trevas Sagradas
            </h2>
            
            <p className="text-xl text-gray-300/70 leading-relaxed font-crimson mb-6">
              Cruzaste o limiar do mundo profano e adentraste o <strong className="text-amber-400/80">sanctum sanctorum</strong> onde a Luz Negra do Conhecimento Primordial 
              ilumina os caminhos ocultos. Este Templo é o repositório das <strong className="text-amber-400/80">verdades ancestrais</strong> 
              que foram sussurradas pelos primeiros rebeldes, preservadas através dos éons nas chamas eternas do Abismo.
            </p>
            
            <p className="text-lg text-gray-300/70 leading-relaxed font-crimson mb-6">
              Aqui, as <strong className="text-red-400/80">forças ctônicas</strong> convergem através de portais dimensionais, 
              canalizando os <strong className="text-amber-400/80">ensinamentos de Lúcifer</strong> - o Portador da Luz, 
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
          <div className="floating-card max-w-2xl mx-auto mb-12 p-8 bg-black/8 backdrop-blur-sm border border-white/10 rounded-xl">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-red-400/70 mb-4 flex items-center justify-center gap-2">
                <Flame className="w-6 h-6" />
                Voz da Pluma
              </h3>
              <div className="text-lg text-gray-300/70 leading-relaxed mb-4">
                <h4 className="text-amber-400/70 mb-2">{recentPosts[0].title}</h4>
                <div className="text-sm text-gray-400/70 italic">
                  {recentPosts[0].excerpt || recentPosts[0].content?.substring(0, 200) + '...'}
                </div>
              </div>
              <Link to="/voz-da-pluma" className="text-amber-400/70 hover:text-amber-300/80 underline">
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