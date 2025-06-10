import { useRoute } from "wouter";

export default function CourseDetail() {
  const [match, params] = useRoute("/curso/:slug");
  
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Mystical Particles with Mood Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

      {/* Dynamic Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-red-500/40 rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`
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

      {/* Selo Central Fixo */}
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">◯</div>
        </div>
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">☿</div>
        </div>
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">⸸</div>
        </div>
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">●</div>
        </div>
      </div>



      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        <div className="text-center">
          <div className="text-amber-400 text-6xl mb-4">📚</div>
          <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
            CURSUS INITIATICUS
          </h1>
          <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
            <span>☿</span>
            <span>⚹</span>
            <span>𖤍</span>
            <span>⚹</span>
            <span>☿</span>
          </div>
          <div className="floating-card p-8 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <p className="text-xl text-gray-300">
              Sistema de cursos em desenvolvimento
            </p>
            <p className="text-gray-400 mt-2">
              Disponível em breve pelo painel administrativo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}