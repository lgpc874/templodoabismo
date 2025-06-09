import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Crown, 
  Star, 
  Lock,
  CheckCircle,
  Gem,
  Shield,
  Zap,
  Eye,
  Users,
  Calendar
} from "lucide-react";

export default function Vip() {
  const { user } = useAuth();
  const [selectedTier, setSelectedTier] = useState("platinum");

  const vipTiers = [
    {
      id: "platinum",
      name: "Platinum VIP",
      price: 300,
      duration: "3 meses",
      color: "from-gray-400 to-gray-600",
      features: [
        "Acesso antecipado a novos cursos",
        "Consultas oracle ilimitadas",
        "Chat direto com instrutores", 
        "Biblioteca VIP exclusiva",
        "Certificados especiais"
      ]
    },
    {
      id: "diamond",
      name: "Diamond VIP", 
      price: 500,
      duration: "6 meses",
      color: "from-blue-400 to-blue-600",
      popular: true,
      features: [
        "Todos os benefícios Platinum",
        "Sessões de coaching 1:1",
        "Acesso ao fórum secreto",
        "Rituais exclusivos mensais",
        "Suporte prioritário 24/7"
      ]
    },
    {
      id: "obsidian",
      name: "Obsidian VIP",
      price: 800,
      duration: "12 meses", 
      color: "from-purple-400 to-purple-600",
      features: [
        "Todos os benefícios Diamond",
        "Mentoria pessoal com Magus",
        "Acesso aos arquivos Qliphóticos",
        "Participação em rituais presenciais",
        "Selo pessoal criado por IA"
      ]
    }
  ];

  const exclusiveContent = [
    {
      title: "Arquivos Proibidos",
      description: "Textos que não estão disponíveis publicamente",
      icon: Lock,
      tier: "diamond"
    },
    {
      title: "Rituais Presenciais",
      description: "Participação em cerimônias exclusivas",
      icon: Users,
      tier: "obsidian"
    },
    {
      title: "Coaching Personalizado",
      description: "Sessões individuais com mestres",
      icon: Crown,
      tier: "diamond"
    },
    {
      title: "Selo Pessoal IA",
      description: "Sigilo mágico único gerado por inteligência artificial",
      icon: Star,
      tier: "obsidian"
    }
  ];

  const hasVipAccess = user && user.initiation_level >= 4;

  const purchaseVip = (tier: any) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (!hasVipAccess) {
      alert('Você precisa estar no nível 4 de iniciação ou superior para acessar a área VIP.');
      return;
    }

    if (user.tkazh_credits < tier.price) {
      window.location.href = '/comprar-tkazh';
      return;
    }

    console.log('Purchasing VIP tier:', tier.name);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-titles text-yellow-600 mb-4 flame-text-clean">
            Área VIP
          </h1>
          <p className="text-xl text-gray-200 font-serif">
            Conteúdo Exclusivo para Iniciados Avançados
          </p>
        </div>

        {!user ? (
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardHeader className="text-center">
              <Crown className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <CardTitle className="text-2xl font-titles text-yellow-600">Acesso Requerido</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 mb-6">
                Para acessar a área VIP você precisa estar logado no templo.
              </p>
              <Button 
                className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold"
                onClick={() => window.location.href = '/login'}
              >
                Entrar no Templo
              </Button>
            </CardContent>
          </Card>
        ) : !hasVipAccess ? (
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardHeader className="text-center">
              <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-2xl font-titles text-yellow-600">Nível Insuficiente</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 mb-6">
                A área VIP requer nível 4 de iniciação ou superior. Seu nível atual: {user.initiation_level}
              </p>
              <Button 
                variant="outline"
                className="border-yellow-600 text-yellow-600"
                onClick={() => window.location.href = '/courses'}
              >
                Ver Cursos de Iniciação
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* VIP Tiers */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {vipTiers.map((tier) => (
                <Card 
                  key={tier.id}
                  className={`abyssal-card-transparent relative cursor-pointer transition-all duration-300 hover:scale-105 ${
                    selectedTier === tier.id ? 'ring-2 ring-yellow-500' : ''
                  }`}
                  onClick={() => setSelectedTier(tier.id)}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-black">
                      Mais Popular
                    </Badge>
                  )}
                  
                  <CardHeader className="text-center">
                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${tier.color} mx-auto mb-4 flex items-center justify-center`}>
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-titles text-yellow-600">
                      {tier.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      Acesso por {tier.duration}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="text-center">
                    <div className="text-3xl font-bold text-yellow-500 mb-4">
                      {tier.price} T'KAZH
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {tier.features.map((feature, index) => (
                        <div key={index} className="flex items-center text-sm text-gray-300">
                          <CheckCircle className="w-4 h-4 text-green-400 mr-2 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                    
                    <Button 
                      className={`w-full ${
                        selectedTier === tier.id 
                          ? 'bg-yellow-600 hover:bg-yellow-700 text-black' 
                          : 'bg-transparent border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black'
                      }`}
                      onClick={() => purchaseVip(tier)}
                    >
                      {selectedTier === tier.id ? 'Adquirir Agora' : 'Selecionar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Exclusive Content Preview */}
            <Card className="abyssal-card-transparent mb-16">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-titles text-yellow-600">
                  Conteúdo Exclusivo VIP
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Acesso a conhecimentos restritos e experiências únicas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exclusiveContent.map((content, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 border border-yellow-600/20 rounded-lg">
                      <content.icon className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-yellow-600 mb-2">{content.title}</h3>
                        <p className="text-gray-300 text-sm mb-2">{content.description}</p>
                        <Badge 
                          variant="outline" 
                          className="border-yellow-600/50 text-yellow-600 text-xs"
                        >
                          {content.tier === 'diamond' ? 'Diamond+' : content.tier === 'obsidian' ? 'Obsidian' : 'Platinum+'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Current Benefits */}
            <Card className="abyssal-card-transparent mb-16">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-titles text-yellow-600">
                  Seus Benefícios VIP
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-6 border border-yellow-600/20 rounded-lg">
                    <Zap className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-yellow-600 mb-2">Status Atual</h3>
                    <p className="text-gray-300">Usuário Padrão</p>
                    <p className="text-sm text-gray-400 mt-2">Upgrade para desbloquear benefícios</p>
                  </div>
                  
                  <div className="text-center p-6 border border-yellow-600/20 rounded-lg">
                    <Calendar className="w-8 h-8 text-green-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-yellow-600 mb-2">Próxima Renovação</h3>
                    <p className="text-gray-300">Sem assinatura ativa</p>
                    <p className="text-sm text-gray-400 mt-2">Adquira um plano VIP</p>
                  </div>
                  
                  <div className="text-center p-6 border border-yellow-600/20 rounded-lg">
                    <Eye className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                    <h3 className="font-semibold text-yellow-600 mb-2">Conteúdo Acessível</h3>
                    <p className="text-gray-300">Conteúdo Público</p>
                    <p className="text-sm text-gray-400 mt-2">VIP desbloqueia conteúdo exclusivo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Section */}
            <Card className="abyssal-card-transparent">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-titles text-yellow-600">
                  Perguntas Frequentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-yellow-600 mb-2">
                      Posso cancelar minha assinatura VIP?
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Sim, você pode cancelar a qualquer momento. O acesso permanece até o final do período pago.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-yellow-600 mb-2">
                      O que acontece se eu não renovar?
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Você retorna ao nível padrão, mas mantém todo o conhecimento e certificados obtidos.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-yellow-600 mb-2">
                      Posso fazer upgrade do meu plano?
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Sim, você pode fazer upgrade a qualquer momento pagando a diferença proporcional.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}