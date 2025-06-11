import Header from "../components/Header";
import { CentralLogo } from '@/components/CentralLogo';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Header fixo no topo */}
      <Header />

      {/* Logo central girando de fundo */}
      <CentralLogo />

      {/* Partículas de fundo */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 10}s`,
              background: 'rgba(251, 191, 36, 0.3)'
            }}
          />
        ))}
      </div>

      {/* Conteúdo principal centralizado */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <div className="text-center max-w-2xl">
          {/* Pentagrama principal */}
          <div className="text-amber-400 text-7xl mb-6 animate-glow-pulse">⛧</div>
          
          {/* Título principal */}
          <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-8 animate-float">
            TEMPLO DO ABISMO
          </h1>
          
          {/* Símbolos decorativos */}
          <div className="flex justify-center items-center space-x-6 text-amber-400 text-2xl mb-8">
            <span>☿</span>
            <span>⚹</span>
            <span>𖤍</span>
            <span>⚹</span>
            <span>☿</span>
          </div>
          
          {/* Subtítulo */}
          <h2 className="text-xl md:text-2xl font-cinzel-decorative text-white/90 leading-relaxed">
            AVE, BUSCADOR<br/>
            DAS TREVAS SAGRADAS
          </h2>
        </div>
      </main>

      {/* Footer mínimo */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 py-4 text-center">
        <div className="text-xs text-gray-500">
          © 2024 Templo do Abismo
        </div>
      </footer>
    </div>
  );
}