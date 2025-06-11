import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Eye, Zap, Flame, MessageSquare, CreditCard, Star, Crown, Search } from "lucide-react";
import { Link } from "wouter";
import Footer from "../components/footer";
import { CentralLogo } from '@/components/CentralLogo';

const oracleTypes = [
  {
    id: 'tarot',
    name: 'Tarot Infernal',
    description: 'Consulte as cartas ancestrais que revelam os caminhos ocultos através dos véus da realidade. Cada arcano maior e menor carrega os segredos primordiais.',
    icon: Sparkles,
    pricePerConsultation: 25.00,
    route: '/oracle/tarot'
  },
  {
    id: 'mirror',
    name: 'Espelho do Abismo',
    description: 'Contemple o reflexo de sua alma nas águas negras do conhecimento. O espelho revela verdades que a mente consciente oculta.',
    icon: Eye,
    pricePerConsultation: 20.00,
    route: '/oracle/mirror'
  },
  {
    id: 'runes',
    name: 'Runas Ancestrais',
    description: 'Desperte os símbolos sagrados gravados nos ossos da terra. Cada runa carrega o poder dos antigos e sussurra destinos.',
    icon: Zap,
    pricePerConsultation: 30.00,
    route: '/oracle/runes'
  },
  {
    id: 'fire',
    name: 'Chamas Reveladoras',
    description: 'Contemple as danças hipnóticas do fogo sagrado. Nas chamas crepitantes, os espíritos ancestrais revelam visões do porvir.',
    icon: Flame,
    pricePerConsultation: 35.00,
    route: '/oracle/fire'
  },
  {
    id: 'voice',
    name: 'Voz do Abismo',
    description: 'Ouça os sussurros que ecoam das profundezas infinitas. A voz primordial fala através dos ventos etéreos da consciência.',
    icon: MessageSquare,
    pricePerConsultation: 40.00,
    route: '/oracle/voice'
  },
  {
    id: 'ritual-chat',
    name: 'Ritual Divinatório',
    description: 'Participe de um ritual completo onde múltiplas forças oraculares convergem para revelar aspectos profundos de sua jornada espiritual.',
    icon: Crown,
    pricePerConsultation: 50.00,
    route: '/oracle/ritual-chat'
  }
];

export default function Oracle() {
  const [selectedOracle, setSelectedOracle] = useState<any>(null);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Mystical Particles with Mood Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none mystical-particles"></div>

      {/* Dynamic Atmosphere Particles */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 particle rounded-full particle-effect"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 15}s`,
              animationDuration: `${12 + Math.random() * 8}s`,
              background: 'radial-gradient(circle, rgba(251, 191, 36, 0.8) 0%, transparent 70%)'
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

      {/* Logo Central Girando */}
      <CentralLogo />

      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Saudação Esotérica Completa */}
        <div className="text-center mb-12 max-w-5xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">⛧</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              ORACULUM TENEBRAE
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="text-center mb-12 max-w-5xl bg-black/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-400/70 mb-6 floating-title-slow">
              Desperte os Véus Entre Mundos
            </h2>
            
            <p className="text-xl text-gray-300/70 leading-relaxed font-crimson mb-6">
              Adentre o <strong className="text-amber-400/80">sanctum divinatório</strong> onde as forças primordiais sussurram através de antigos rituais oraculares. 
              Cada método de consulta conecta-te diretamente às <strong className="text-amber-400/80">correntes ctônicas</strong> que fluem através dos véus da realidade.
            </p>
            
            <p className="text-lg text-gray-300/70 leading-relaxed font-crimson mb-6">
              Aqui, as <strong className="text-red-400/80">entidades oraculares</strong> convergem através de portais dimensionais, 
              canalizando os <strong className="text-amber-400/80">ensinamentos divinatórios</strong> - as revelações ancestrais 
              que desvelam o futuro e iluminam os caminhos ocultos da existência.
            </p>
            
            <div className="border-t border-b border-amber-700/30 py-6 my-8">
              <p className="text-2xl font-cinzel-decorative text-red-400 mb-4">⚠️ ADVERTENTIA ORACULARIS ⚠️</p>
              <p className="text-lg text-gray-300 font-crimson leading-relaxed">
                As consultas oraculares aqui realizadas são <strong className="text-red-400">rituais sagrados e poderosos</strong>. 
                Não são meras leituras ou entretenimento. Cada método divinatório carrega o peso de tradições milenares. 
                Procede com <strong className="text-amber-400">certeza absoluta</strong> e <strong className="text-amber-400">responsabilidade total</strong>. 
                O Oráculo contempla aqueles que o contemplam, e toda pergunta gera revelações nos planos visíveis e invisíveis.
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Veritas Per Tenebras Revelatur"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                A verdade é revelada através das trevas
              </p>
            </div>
          </div>
        </div>

        {/* Oracle Types - Following home page card structure */}
        <div className="floating-card max-w-6xl mx-auto mb-12 p-8 bg-black/8 backdrop-blur-sm border border-white/10 rounded-xl">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-red-400/70 mb-4 flex items-center justify-center gap-2">
              <Eye className="w-6 h-6" />
              Métodos Oraculares
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {oracleTypes.map((oracle, index) => {
              const IconComponent = oracle.icon;
              return (
                <div 
                  key={oracle.id} 
                  className="group p-4 bg-black/10 backdrop-blur-sm border border-white/5 rounded-lg hover:bg-black/15 hover:border-amber-500/20 transition-all duration-300"
                >
                  <div className="text-center space-y-3">
                    <IconComponent className="w-8 h-8 mx-auto text-red-500/70 group-hover:text-red-400/80 transition-colors" />
                    
                    <h4 className="text-lg font-bold text-amber-400/70 group-hover:text-amber-300/80 transition-colors">
                      {oracle.name}
                    </h4>
                    
                    <p className="text-gray-300/70 text-sm leading-relaxed">
                      {oracle.description}
                    </p>
                    
                    <div className="bg-red-900/10 p-2 rounded border border-red-700/20">
                      <div className="flex items-center justify-center gap-2 text-red-300/70 text-sm">
                        <CreditCard className="w-4 h-4" />
                        <span>R$ {oracle.pricePerConsultation}</span>
                      </div>
                    </div>
                    
                    <Link to={oracle.route} className="block">
                      <Button 
                        size="sm"
                        className="w-full bg-gradient-to-r from-red-900/30 to-amber-900/30 text-amber-300/80 border border-amber-600/30 hover:from-red-800/40 hover:to-amber-800/40 hover:text-amber-200/90 hover:border-amber-500/40 transition-all duration-300"
                      >
                        <Search className="w-4 h-4 mr-2" />
                        Consultar
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}