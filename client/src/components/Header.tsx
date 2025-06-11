import { Link } from "wouter";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-amber-500/20">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo esquerdo */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8">
            <svg viewBox="0 0 32 32" className="w-full h-full text-amber-400">
              <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1"/>
              <path d="M16 6 L20 12 L28 12 L22.5 17 L24 24 L16 19.5 L8 24 L9.5 17 L4 12 L12 12 Z" 
                    fill="none" stroke="currentColor" strokeWidth="1"/>
              <circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </div>
          <div className="text-amber-400 font-cinzel-decorative text-lg font-bold">
            TEMPLO<br/>
            DO<br/>
            ABISMO
          </div>
        </div>

        {/* Navegação central */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-white hover:text-amber-400 transition-colors">
            Início
          </Link>
          <Link href="/grimoires" className="text-white hover:text-amber-400 transition-colors">
            Grimórios
          </Link>
          <Link href="/cursos" className="text-white hover:text-amber-400 transition-colors">
            Cursos
          </Link>
          <Link href="/oraculo" className="text-white hover:text-amber-400 transition-colors">
            Oráculo
          </Link>
          <Link href="/voz-pluma" className="text-white hover:text-amber-400 transition-colors">
            Voz da Pluma
          </Link>
        </nav>

        {/* Botões direita */}
        <div className="flex items-center space-x-4">
          <button className="px-4 py-2 text-white border border-amber-500/50 hover:bg-amber-500/10 transition-colors rounded">
            Entrar
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-amber-500 to-red-500 text-black font-bold rounded hover:from-amber-400 hover:to-red-400 transition-colors">
            Registrar
          </button>
        </div>
      </div>
    </header>
  );
}