export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 py-8 border-t border-amber-500/20 bg-black/20 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        {/* Main footer content */}
        <div className="text-center">
          {/* Logo and name section */}
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 mr-2">
              <svg viewBox="0 0 32 32" className="w-full h-full text-amber-400">
                <circle cx="16" cy="16" r="14" fill="none" stroke="currentColor" strokeWidth="1"/>
                <path d="M16 6 L20 12 L28 12 L22.5 17 L24 24 L16 19.5 L8 24 L9.5 17 L4 12 L12 12 Z" 
                      fill="none" stroke="currentColor" strokeWidth="1"/>
                <circle cx="16" cy="16" r="3" fill="none" stroke="currentColor" strokeWidth="1"/>
              </svg>
            </div>
            <div className="font-cinzel-decorative text-lg font-bold text-amber-400">
              Templo do Abismo
            </div>
          </div>
          
          {/* Legal links - discrete */}
          <div className="flex justify-center gap-4 text-xs text-gray-500 mb-4">
            <a href="/politica-privacidade" className="hover:text-amber-400 transition-colors">
              Política de Privacidade
            </a>
            <a href="/termos-uso" className="hover:text-amber-400 transition-colors">
              Termos de Uso
            </a>
            <a href="/sobre" className="hover:text-amber-400 transition-colors">
              Sobre o Templo
            </a>
          </div>
          
          {/* Copyright */}
          <div className="text-xs text-gray-400">
            © 2024 Templo do Abismo. "Per Aspera Ad Astra"
          </div>
        </div>
      </div>
    </footer>
  );
}
