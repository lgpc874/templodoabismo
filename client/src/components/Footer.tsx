import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="relative mt-20 border-t border-purple-500/20 bg-black/40 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <h3 className="text-2xl font-cinzel text-amber-400 mb-4">
              Templo do Abismo
            </h3>
            <p className="text-purple-300 text-sm leading-relaxed mb-4">
              Portal dedicado aos ensinamentos ancestrais e desenvolvimento espiritual através da tradição luciferiana. 
              Explore os mistérios profundos da consciência e descubra sua divindade interior.
            </p>
            <div className="text-xs text-purple-500">
              © 2024 Templo do Abismo. Todos os direitos reservados.
            </div>
          </div>

          {/* Links Úteis */}
          <div>
            <h4 className="text-lg font-medium text-amber-400 mb-4">Links Úteis</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sanctuarium" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Sanctuarium
                </Link>
              </li>
              <li>
                <Link href="/grimorium" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Grimorium
                </Link>
              </li>
              <li>
                <Link href="/oraculum" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Oraculum
                </Link>
              </li>
              <li>
                <Link href="/gnosis" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Gnosis
                </Link>
              </li>
              <li>
                <Link href="/vox-pluma" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Vox da Pluma
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-lg font-medium text-amber-400 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/termos-de-uso" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/politica-de-privacidade" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <a href="mailto:contato@templodoabismo.com" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Contato
                </a>
              </li>
              <li>
                <a href="mailto:suporte@templodoabismo.com" className="text-purple-300 hover:text-amber-400 transition-colors">
                  Suporte
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Aviso */}
        <div className="mt-8 pt-8 border-t border-purple-500/20">
          <p className="text-xs text-purple-500 text-center leading-relaxed">
            Este portal destina-se exclusivamente a fins educacionais e de desenvolvimento pessoal. 
            Os ensinamentos aqui apresentados são baseados em tradições ancestrais e filosofias esotéricas. 
            Recomendamos discernimento e responsabilidade pessoal em todas as práticas.
          </p>
        </div>
      </div>

      {/* Partículas místicas do footer */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="mystical-particles opacity-30" />
      </div>
    </footer>
  );
}