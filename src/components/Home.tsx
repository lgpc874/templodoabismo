export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        {/* Pentagrama */}
        <div className="text-amber-400 text-8xl mb-8 animate-glow-pulse">⛧</div>
        
        {/* Título */}
        <h1 className="text-6xl md:text-8xl font-cinzel text-amber-400 mystical-glow mb-8 animate-float">
          TEMPLO DO ABISMO
        </h1>
        
        {/* Símbolos */}
        <div className="flex justify-center items-center space-x-8 text-amber-400 text-3xl">
          <span>☿</span>
          <span>⚹</span>
          <span>𖤍</span>
          <span>⚹</span>
          <span>☿</span>
        </div>
      </div>
    </div>
  );
}