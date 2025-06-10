import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Gem, Eye, Flame, Search, FileText, MessageCircle, Crown, CreditCard } from "lucide-react";
import { Link } from "wouter";
import PaymentGateway from "@/components/PaymentGateway";

const oracleTypes = [
  {
    id: 'tarot',
    name: 'Tarot Infernal',
    description: 'Consulte as cartas ancestrais que revelam os caminhos do destino',
    icon: Gem,
    color: 'from-purple-600 to-indigo-600',
    route: '/oraculo/ritual/tarot',
    pricePerConsultation: 9.90
  },
  {
    id: 'mirror',
    name: 'Espelho do Abismo',
    description: 'Converse diretamente com Speculum, o Refletor das Profundezas',
    icon: Search,
    color: 'from-blue-600 to-cyan-600',
    route: '/oraculo/ritual/espelho',
    pricePerConsultation: 12.90
  },
  {
    id: 'runes',
    name: 'Runas Ancestrais',
    description: 'Dialogue com Runicus, o Escriba das Runas Primordiais',
    icon: FileText,
    color: 'from-amber-600 to-orange-600',
    route: '/oraculo/ritual/runas',
    pricePerConsultation: 11.90
  },
  {
    id: 'fire',
    name: 'Chamas Reveladoras',
    description: 'Converse com Ignis, o Senhor das Chamas que Purificam',
    icon: Flame,
    color: 'from-red-600 to-rose-600',
    route: '/oraculo/ritual/fogo',
    pricePerConsultation: 13.90
  },
  {
    id: 'voice',
    name: 'Voz do Abismo',
    description: 'Dialogue com Abyssos, a Voz Primordial das Profundezas',
    icon: Eye,
    color: 'from-gray-600 to-slate-700',
    route: '/oraculo/ritual/voz',
    pricePerConsultation: 15.90
  }
];

export default function Oracle() {
  const [selectedOracle, setSelectedOracle] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);

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
        {/* Outer rotating ring */}
        <div className="absolute w-80 h-80 opacity-8 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow-reverse text-amber-500/15 text-[20rem] leading-none flex items-center justify-center h-full">
            ◯
          </div>
        </div>
        
        {/* Middle layer with mystical symbols */}
        <div className="absolute w-72 h-72 opacity-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-400/20 text-[18rem] leading-none flex items-center justify-center h-full">
            ☿
          </div>
        </div>
        
        {/* Main central seal */}
        <div className="rotating-seal absolute w-64 h-64 opacity-15 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="animate-spin-slow text-red-500/30 text-[16rem] leading-none flex items-center justify-center h-full">
            ⸸
          </div>
        </div>
        
        {/* Inner pulsing core */}
        <div className="absolute w-16 h-16 opacity-25 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-red-300/40 text-4xl leading-none flex items-center justify-center h-full">
            ●
          </div>
        </div>
      </div>

      {/* Mystical Energy Lines */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-red-500/15 to-transparent animate-flicker" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '1.5s'}} />
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-500/15 to-transparent animate-flicker" style={{animationDelay: '2.5s'}} />
        <div className="absolute bottom-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent animate-flicker" style={{animationDelay: '3.5s'}} />
      </div>

      {/* Atmospheric Gradient Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/60 via-transparent to-black/80"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-radial from-transparent via-red-900/5 to-black/40"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-5xl bg-black/5 backdrop-blur-sm rounded-2xl p-8 border border-white/5">
          <div className="mb-8">
            <div className="text-amber-400/60 text-6xl mb-4">⛧</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400/70 mb-6 floating-title">
              ORACULUM TENEBRAE
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500/60 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/10 backdrop-blur-md border border-amber-500/15 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-300/65 mb-6 floating-title-slow">
              Desperte os Véus Entre Mundos
            </h2>
            
            <p className="text-xl text-gray-300/80 leading-relaxed font-crimson mb-6">
              Adentre o <strong className="text-amber-400/80">sanctum divinatório</strong> onde as forças primordiais sussurram através de antigos rituais oraculares. 
              Cada método de consulta conecta-te diretamente às <strong className="text-red-400/80">correntes ctônicas</strong> que fluem através dos véus da realidade.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400/60 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300/60">
                "Veritas Per Tenebras Revelatur"
              </p>
              <p className="text-sm text-gray-400/70 font-crimson italic mt-2">
                A verdade é revelada através das trevas
              </p>
            </div>
          </div>
        </div>

        {/* Oracle Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {oracleTypes.map((oracle, index) => {
            const IconComponent = oracle.icon;
            return (
              <div 
                key={oracle.id} 
                className="floating-card group transform hover:scale-105 transition-all duration-500 animate-float relative overflow-hidden bg-black/8 backdrop-blur-sm border border-white/10 rounded-xl"
                style={{
                  animationDelay: `${index * 0.5}s`,
                  animationDuration: `${6 + index * 0.5}s`
                }}
              >
                {/* Mystical shimmer overlay */}
                <div className="absolute inset-0 mystical-shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Glowing border effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-500/10 via-amber-500/10 to-red-500/10 opacity-0 group-hover:opacity-100 animate-glow-pulse transition-opacity duration-500" />
                
                <div className="relative p-6 text-center space-y-4">
                  {/* Enhanced icon with floating animation */}
                  <div className="relative">
                    <div className="absolute inset-0 animate-glow-pulse">
                      <IconComponent className="w-12 h-12 mx-auto text-red-500/20" />
                    </div>
                    <IconComponent className="w-12 h-12 mx-auto mb-4 text-red-500/70 relative z-10" />
                  </div>
                  
                  {/* Title with mystical glow */}
                  <h3 className="text-xl font-bold text-amber-400/70 mb-3 group-hover:text-amber-300/80 transition-colors duration-300">
                    {oracle.name}
                  </h3>
                  
                  <p className="text-gray-300/70 text-sm leading-relaxed mb-4 group-hover:text-gray-200/80 transition-colors duration-300">
                    {oracle.description}
                  </p>
                  
                  {/* Enhanced pricing info with glow effect */}
                  <div className="bg-red-900/10 p-3 rounded-lg border border-red-700/20 mb-4 group-hover:bg-red-900/15 group-hover:border-red-600/30 transition-all duration-300 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/5 to-transparent group-hover:animate-pulse" />
                    <div className="flex items-center justify-center gap-2 text-red-300/70 text-sm relative z-10">
                      <CreditCard className="w-4 h-4" />
                      <span>R$ {oracle.pricePerConsultation} por consulta</span>
                    </div>
                  </div>

                  {/* Enhanced action button */}
                  <div className="space-y-2">
                    <Button 
                      onClick={() => {
                        setSelectedOracle(oracle);
                        setShowPayment(true);
                      }}
                      className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white relative overflow-hidden group/btn transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700" />
                      <CreditCard className="w-4 h-4 mr-2 animate-glow-pulse" />
                      <span className="relative z-10">Realizar Consulta - R$ {oracle.pricePerConsultation}</span>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Nas trevas da ignorância, a luz do conhecimento brilha mais intensa"
            </p>
            <p className="text-amber-400 font-semibold">
              — Antigo Provérbio Luciferiano
            </p>
          </div>
        </div>

        {/* Payment Dialog */}
        <Dialog open={showPayment} onOpenChange={setShowPayment}>
          <DialogContent className="bg-black/95 border-amber-700/50 max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-cinzel-decorative text-amber-400">
                Consulta: {selectedOracle?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOracle && (
              <div className="space-y-6">
                <div className="bg-red-900/20 p-4 rounded-lg border border-red-700/30">
                  <h4 className="text-lg font-semibold text-red-300 mb-2">Esta Consulta Inclui:</h4>
                  <ul className="text-red-200/70 text-sm space-y-2">
                    <li>• Resposta personalizada e detalhada</li>
                    <li>• Interpretação completa dos símbolos</li>
                    <li>• Orientação específica para sua situação</li>
                    <li>• Acesso imediato após o pagamento</li>
                    <li>• Consulta salva no seu histórico</li>
                  </ul>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-red-400 font-bold text-xl">
                      R$ {selectedOracle.pricePerConsultation}
                    </span>
                    <Badge variant="outline" className="border-red-600 text-red-300">
                      Consulta Individual
                    </Badge>
                  </div>
                </div>

                <PaymentGateway
                  amount={selectedOracle.pricePerConsultation}
                  currency="BRL"
                  description={`Consulta: ${selectedOracle.name}`}
                  onSuccess={(paymentData) => {
                    console.log('Pagamento realizado:', paymentData);
                    setShowPayment(false);
                    // Redirect to oracle consultation
                  }}
                  onError={(error) => {
                    console.error('Erro no pagamento:', error);
                  }}
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}