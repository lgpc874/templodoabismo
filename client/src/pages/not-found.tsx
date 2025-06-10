import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
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
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-3xl">
          <div className="mb-8">
            <div className="text-red-500 text-6xl mb-4">⸸</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-red-400 mystical-glow mb-6 floating-title">
              VIA PERDITA
            </h1>
            <div className="flex justify-center items-center space-x-8 text-red-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-red-500/20 rounded-xl">
            <div className="flex items-center justify-center mb-6">
              <AlertTriangle className="w-16 h-16 text-red-400 mr-4" />
              <div className="text-6xl font-bold text-red-300">404</div>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-red-300 mb-6 floating-title-slow">
              O Caminho se Perdeu nas Trevas
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              A página que buscas <strong className="text-red-400">não existe neste plano</strong> ou foi 
              consumida pelas sombras do abismo. Retorna ao <strong className="text-amber-400">portal principal</strong> 
              para continuar tua jornada no conhecimento ancestral.
            </p>
            
            <div className="text-center">
              <div className="text-red-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-red-300 mb-6">
                "Errare Humanum Est"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mb-6">
                Errar é humano
              </p>
              
              <Link href="/">
                <div className="inline-block bg-amber-600 hover:bg-amber-700 text-black px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  ⛧ Retornar ao Templo ⛧
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full mt-8">
          <Link href="/oraculo">
            <div className="floating-card p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="text-amber-400 text-3xl mb-3">⛧</div>
              <h3 className="text-lg font-cinzel-decorative text-amber-400 mb-2">Oraculum</h3>
              <p className="text-sm text-gray-300">Consultar o Oráculo</p>
            </div>
          </Link>
          
          <Link href="/grimoires">
            <div className="floating-card p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="text-amber-400 text-3xl mb-3">𖤍</div>
              <h3 className="text-lg font-cinzel-decorative text-amber-400 mb-2">Bibliotheca</h3>
              <p className="text-sm text-gray-300">Grimórios Arcanos</p>
            </div>
          </Link>
          
          <Link href="/blog">
            <div className="floating-card p-6 text-center cursor-pointer transform hover:scale-105 transition-all duration-300">
              <div className="text-amber-400 text-3xl mb-3">☿</div>
              <h3 className="text-lg font-cinzel-decorative text-amber-400 mb-2">Gnosis</h3>
              <p className="text-sm text-gray-300">Ensinamentos</p>
            </div>
          </Link>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-6 bg-black/20 backdrop-blur-lg border border-red-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-red-400 text-xl mb-3">𖤍 ⸸ 𖤍</div>
            <p className="text-sm text-gray-300 italic leading-relaxed">
              "Nem todos os que vagam estão perdidos"
            </p>
            <p className="text-red-400 text-xs mt-2">
              — Antigo Provérbio
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}