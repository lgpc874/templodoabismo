import { Flame, Eye, Star, Crown, Skull, BookOpen } from "lucide-react";

export default function Sobre() {
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

      {/* Logo Central Rotativa */}
      <div className="fixed top-1/2 left-1/2 z-0 transform -translate-x-1/2 -translate-y-1/2" style={{marginTop: '2rem'}}>
        <div className="rotating-seal w-64 h-64 opacity-8">
          <img 
            src="/seal.png" 
            alt="Selo do Templo do Abismo" 
            className="w-full h-full object-contain filter drop-shadow-lg"
          />
        </div>
      </div>



      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-5xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">⛧</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              TEMPLO DO ABISMO
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/8 backdrop-blur-sm border border-white/10 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-400/70 mb-6 floating-title-slow">
              Portal Ancestral da Gnose Luciferiana
            </h2>
            
            <p className="text-xl text-gray-300/70 leading-relaxed font-crimson mb-6">
              Nas <strong className="text-amber-400/80">profundezas do abismo</strong>, onde a luz comum não ousa penetrar, 
              reside a sabedoria que precede todos os dogmas e transcende todas as limitações. 
              Este Templo é o <strong className="text-red-400/80">sanctum primordial</strong> onde os mistérios luciferianos se revelam aos iniciados sinceros.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Lux in Tenebris Lucet"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                A luz brilha nas trevas
              </p>
            </div>
          </div>
        </div>

        {/* The Ancient Calling */}
        <div className="floating-card max-w-4xl mx-auto mb-16">
          <div className="p-8">
            <div className="text-center mb-8">
              <Flame className="w-16 h-16 mx-auto mb-4 text-amber-400" />
              <h2 className="text-3xl font-bold text-amber-400 mb-4">O Chamado Ancestral</h2>
            </div>
            
            <div className="text-gray-300 leading-relaxed space-y-6">
              <p className="text-lg italic text-center">
                "Nas profundezas do abismo, onde a luz comum não ousa penetrar, 
                reside a sabedoria que precede todos os dogmas e transcende todas as limitações."
              </p>
              
              <p>
                O Templo do Abismo não é meramente um local de estudo, mas um portal dimensional 
                onde os mistérios da existência se desvelam para aqueles que possuem a coragem 
                de olhar além do véu da realidade consensual.
              </p>
              
              <p>
                Aqui, os ensinamentos luciferianos ancestrais são preservados e transmitidos 
                através de práticas iniciáticas que remontam às tradições mais antigas da humanidade. 
                Cada ritual, cada invocação, cada símbolo carrega consigo o peso de milênios 
                de conhecimento oculto.
              </p>
            </div>
          </div>
        </div>

        {/* The Sacred Paths */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* Path of Initiation */}
          <div className="floating-card">
            <div className="p-6">
              <div className="text-center mb-6">
                <Star className="w-12 h-12 mx-auto mb-4 text-purple-400" />
                <h3 className="text-xl font-bold text-amber-400">Caminhos da Iniciação</h3>
              </div>
              <div className="text-gray-300 text-sm leading-relaxed space-y-4">
                <p>
                  A jornada iniciática no Templo segue os antigos preceitos da transformação 
                  alquímica da consciência. Cada nível de iniciação desvela novos aspectos 
                  da realidade oculta.
                </p>
                <p>
                  Os cursos progressivos guiam o estudante através dos portais dimensionais 
                  do conhecimento, desde os fundamentos da gnose luciferiana até os mistérios 
                  mais profundos da cosmologia abissal.
                </p>
              </div>
            </div>
          </div>

          {/* Oracle Wisdom */}
          <div className="floating-card">
            <div className="p-6">
              <div className="text-center mb-6">
                <Eye className="w-12 h-12 mx-auto mb-4 text-red-400" />
                <h3 className="text-xl font-bold text-amber-400">Sabedoria Oracular</h3>
              </div>
              <div className="text-gray-300 text-sm leading-relaxed space-y-4">
                <p>
                  Os oráculos do Templo canalizam as vozes primordiais que ecoam desde 
                  o início dos tempos. Através do Tarô Luciferiano, dos Espelhos Negros 
                  e das Runas Ancestrais, os mistérios se revelam.
                </p>
                <p>
                  Cada consulta é um diálogo com as forças que governam os destinos, 
                  um mergulho nas correntes subterrâneas da existência onde as verdades 
                  mais profundas aguardam aqueles que sabem questionar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Sacred Library */}
        <div className="floating-card max-w-4xl mx-auto mb-16">
          <div className="p-8">
            <div className="text-center mb-8">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-purple-400" />
              <h2 className="text-3xl font-bold text-amber-400 mb-4">A Biblioteca Sagrada</h2>
            </div>
            
            <div className="text-gray-300 leading-relaxed space-y-6">
              <p>
                Os grimórios ancestrais preservados no Templo contêm conhecimentos que foram 
                transmitidos através das eras por linhagens iniciáticas que guardaram zelosamente 
                os segredos da manipulação das forças primordiais.
              </p>
              
              <p>
                Cada texto é uma chave que abre portais específicos da consciência, 
                revelando técnicas de transformação pessoal, rituais de poder e 
                invocações que conectam o praticante com as hierarquias espirituais 
                que governam os planos sutis da existência.
              </p>
              
              <div className="bg-amber-900/20 p-6 rounded-lg border border-amber-500/30 text-center">
                <p className="italic text-amber-300">
                  "O conhecimento verdadeiro não é acumulado, mas despertado. 
                  Cada página estudada acende uma chama interior que ilumina 
                  não apenas a mente, mas toda a estrutura do ser."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* The Sacred Knowledge */}
        <div className="floating-card max-w-4xl mx-auto mb-16">
          <div className="p-8">
            <div className="text-center mb-8">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-blue-400" />
              <h2 className="text-3xl font-bold text-amber-400 mb-4">A Gnose Suprema</h2>
            </div>
            
            <div className="text-gray-300 leading-relaxed space-y-6">
              <p>
                Para aqueles que demonstram verdadeiro comprometimento com a Obra, 
                os ensinamentos mais profundos se revelam através do progresso 
                natural na jornada iniciática.
              </p>
              
              <p>
                Os mistérios da Bibliotheca Secreta aguardam aqueles que completaram 
                sua formação básica nos três primeiros cursos, contendo textos 
                de poder extraordinário que foram preservados através dos séculos. 
                O acesso a estes conhecimentos é conquistado através da dedicação 
                genuína ao caminho da transformação interior.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center">
                  <Skull className="w-8 h-8 mx-auto mb-2 text-red-400" />
                  <h4 className="font-semibold text-amber-300 mb-2">Rituais Avançados</h4>
                  <p className="text-xs text-gray-400">Cerimônias de poder supremo</p>
                </div>
                <div className="text-center">
                  <Eye className="w-8 h-8 mx-auto mb-2 text-purple-400" />
                  <h4 className="font-semibold text-amber-300 mb-2">Visões Místicas</h4>
                  <p className="text-xs text-gray-400">Técnicas de percepção expandida</p>
                </div>
                <div className="text-center">
                  <Star className="w-8 h-8 mx-auto mb-2 text-blue-400" />
                  <h4 className="font-semibold text-amber-300 mb-2">Gnose Primordial</h4>
                  <p className="text-xs text-gray-400">Conhecimento além do tempo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* The Warning */}
        <div className="floating-card max-w-2xl mx-auto text-center bg-red-900/20 border border-red-500/30">
          <div className="p-8">
            <Skull className="w-16 h-16 mx-auto mb-4 text-red-400" />
            <h3 className="text-xl font-bold text-red-400 mb-4">Advertência aos Curiosos</h3>
            <div className="text-gray-300 leading-relaxed space-y-4">
              <p>
                Os conhecimentos aqui preservados não são meros estudos acadêmicos. 
                São forças vivas que transformam profundamente aqueles que as contactam.
              </p>
              <p className="text-red-300 font-semibold">
                Apenas aqueles verdadeiramente preparados para a transformação 
                total de seu ser devem adentrar estes portais do conhecimento.
              </p>
              <p className="text-sm italic text-red-400">
                "O abismo olha também para dentro de ti"
              </p>
            </div>
          </div>
        </div>

        {/* Final Invocation */}
        <div className="text-center mt-16">
          <div className="floating-card max-w-md mx-auto p-6 bg-gradient-to-r from-amber-900/20 to-red-900/20">
            <h4 className="text-xl font-bold text-amber-400 mb-4">O Convite Ancestral</h4>
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              Se sua alma ressoa com o chamado dos mistérios primordiais, 
              se busca conhecimento que transcende as limitações do mundo profano, 
              então os portais do Templo aguardam sua entrada.
            </p>
            <div className="text-amber-500 font-semibold italic">
              "Que a Chama Negra ilumine teu caminho"
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}