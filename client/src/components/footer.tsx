export default function Footer() {
  return (
    <footer className="relative z-10 mt-16 py-8 border-t border-amber-500/20 bg-black/20 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        {/* Main footer content */}
        <div className="text-center">
          {/* Logo and name section */}
          <div className="flex items-center justify-center mb-3">
            <div className="w-8 h-8 mr-2">
              <img
                src="/seal.png"
                alt="Selo do Templo do Abismo"
                className="w-full h-full object-contain filter drop-shadow-lg"
              />
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
