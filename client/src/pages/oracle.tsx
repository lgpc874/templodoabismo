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
    freeConsultations: 3,
    premiumPrice: 29.90
  },
  {
    id: 'mirror',
    name: 'Espelho do Abismo',
    description: 'Converse diretamente com Speculum, o Refletor das Profundezas',
    icon: Search,
    color: 'from-blue-600 to-cyan-600',
    route: '/oraculo/ritual/espelho',
    freeConsultations: 2,
    premiumPrice: 39.90
  },
  {
    id: 'runes',
    name: 'Runas Ancestrais',
    description: 'Dialogue com Runicus, o Escriba das Runas Primordiais',
    icon: FileText,
    color: 'from-amber-600 to-orange-600',
    route: '/oraculo/ritual/runas',
    freeConsultations: 2,
    premiumPrice: 34.90
  },
  {
    id: 'fire',
    name: 'Chamas Reveladoras',
    description: 'Converse com Ignis, o Senhor das Chamas que Purificam',
    icon: Flame,
    color: 'from-red-600 to-rose-600',
    route: '/oraculo/ritual/fogo',
    freeConsultations: 2,
    premiumPrice: 37.90
  },
  {
    id: 'voice',
    name: 'Voz do Abismo',
    description: 'Dialogue com Abyssos, a Voz Primordial das Profundezas',
    icon: Eye,
    color: 'from-gray-600 to-slate-700',
    route: '/oraculo/ritual/voz',
    freeConsultations: 1,
    premiumPrice: 49.90
  }
];

export default function Oracle() {
  const [selectedOracle, setSelectedOracle] = useState<any>(null);
  const [showPayment, setShowPayment] = useState(false);

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
        {/* Hero Section */}
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
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-300 mb-6 floating-title-slow">
              Desperte os Véus Entre Mundos
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Adentre o <strong className="text-amber-400">sanctum divinatório</strong> onde as forças primordiais sussurram através de antigos rituais oraculares. 
              Cada método de consulta conecta-te diretamente às <strong className="text-red-400">correntes ctônicas</strong> que fluem através dos véus da realidade.
            </p>
            
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

        {/* Oracle Types Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
          {oracleTypes.map((oracle) => {
            const IconComponent = oracle.icon;
            return (
              <div key={oracle.id} className="floating-card group transform hover:scale-105 transition-all duration-300">
                <div className="p-6 text-center space-y-4">
                  <IconComponent className="w-12 h-12 mx-auto mb-4 text-red-500" />
                  <h3 className="text-xl font-bold text-amber-400 mb-3">{oracle.name}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {oracle.description}
                  </p>
                  
                  {/* Free consultations info */}
                  <div className="bg-amber-900/20 p-3 rounded-lg border border-amber-700/30 mb-4">
                    <div className="flex items-center justify-center gap-2 text-amber-300 text-sm">
                      <Crown className="w-4 h-4" />
                      <span>{oracle.freeConsultations} consultas gratuitas</span>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <Link href={oracle.route} className="block">
                      <Button className="w-full bg-amber-900/50 hover:bg-amber-800/70 text-amber-200 border-amber-700">
                        Consulta Gratuita
                      </Button>
                    </Link>
                    
                    <Button 
                      onClick={() => {
                        setSelectedOracle(oracle);
                        setShowPayment(true);
                      }}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Premium R$ {oracle.premiumPrice}
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
                Consulta Premium: {selectedOracle?.name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedOracle && (
              <div className="space-y-6">
                <div className="bg-amber-900/20 p-4 rounded-lg border border-amber-700/30">
                  <h4 className="text-lg font-semibold text-amber-300 mb-2">Acesso Premium Inclui:</h4>
                  <ul className="text-amber-200/70 text-sm space-y-2">
                    <li>• Consultas ilimitadas por 30 dias</li>
                    <li>• Respostas mais detalhadas e personalizadas</li>
                    <li>• Acesso prioritário aos oráculos</li>
                    <li>• Histórico completo de consultas</li>
                    <li>• Interpretações avançadas</li>
                  </ul>
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-amber-400 font-bold text-xl">
                      R$ {selectedOracle.premiumPrice}
                    </span>
                    <Badge variant="outline" className="border-purple-600 text-purple-300">
                      Acesso Premium
                    </Badge>
                  </div>
                </div>

                <PaymentGateway
                  amount={selectedOracle.premiumPrice}
                  currency="BRL"
                  description={`Consulta Premium: ${selectedOracle.name}`}
                  onSuccess={(paymentData) => {
                    console.log('Pagamento realizado:', paymentData);
                    setShowPayment(false);
                    // Redirect to premium oracle access
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