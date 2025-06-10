export default function StudentProfile() {
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
        <div className="text-center">
          <div className="text-amber-400 text-6xl mb-4">👤</div>
          <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
            PERFIL DO ESTUDANTE
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
              Sistema de perfil de estudante em desenvolvimento
            </p>
            <p className="text-gray-400 mt-2">
              Disponível quando o sistema de cursos for implementado
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}