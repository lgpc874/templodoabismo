export default function Footer() {
  const footerLinks = [
    { href: "/politica-privacidade", label: "Política de Privacidade" },
    { href: "/termos-uso", label: "Termos de Uso" },
    { href: "/sobre", label: "Sobre o Templo" },
    { href: "/contato", label: "Contato" }
  ];

  return (
    <footer className="relative z-10 mt-20 py-12 border-t border-amber-500/20 bg-black/20 backdrop-blur-lg">
      <div className="container mx-auto px-6">
        {/* Main footer content */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Logo and name section */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-4">
              <div className="w-12 h-12 mr-3">
                <img
                  src="/seal.png"
                  alt="Selo do Templo do Abismo"
                  className="w-full h-full object-contain filter drop-shadow-lg"
                />
              </div>
              <div className="font-cinzel-decorative text-xl font-bold text-amber-400">
                Templo do Abismo
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Portal dos ensinamentos luciferiano ancestrais onde almas corajosas 
              adentram os mistérios primordiais da gnose ctônica.
            </p>
          </div>

          {/* Links section */}
          <div className="text-center">
            <h3 className="text-amber-400 font-semibold mb-4">Navegação</h3>
            <div className="space-y-2">
              <div><a href="/courses" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">Academia Luciferiana</a></div>
              <div><a href="/grimoires" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">Bibliotheca Abyssos</a></div>
              <div><a href="/oraculo" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">Oraculum Tenebrae</a></div>
              <div><a href="/voz-da-pluma" className="text-gray-300 hover:text-amber-400 transition-colors text-sm">Vox Plumae</a></div>
            </div>
          </div>

          {/* Legal links section */}
          <div className="text-center md:text-right">
            <h3 className="text-amber-400 font-semibold mb-4">Informações</h3>
            <div className="space-y-2">
              {footerLinks.map((link) => (
                <div key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-300 hover:text-amber-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Copyright section */}
        <div className="text-center pt-8 border-t border-amber-500/20">
          <div className="text-sm text-gray-400">
            © 2024 Templo do Abismo. Todos os direitos reservados aos mistérios ancestrais.
          </div>
          <div className="text-xs text-gray-500 mt-2">
            "Per Aspera Ad Astra" - Através das adversidades, às estrelas
          </div>
        </div>
      </div>
    </footer>
  );
}
