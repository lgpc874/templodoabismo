import { useState } from "react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { 
  Gem, 
  Crown, 
  Star,
  Zap,
  CreditCard,
  Shield,
  CheckCircle
} from "lucide-react";

export default function ComprarTkazh() {
  const { user } = useAuth();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string>("");

  const packages = [
    {
      id: "starter",
      name: "Pacote Iniciante",
      tkazh: 100,
      price: 15.00,
      currency: "BRL",
      bonus: 0,
      popular: false,
      description: "Perfeito para primeiras consultas",
      features: ["100 T'KAZH", "Válido por 6 meses", "Suporte básico"]
    },
    {
      id: "apprentice", 
      name: "Pacote Aprendiz",
      tkazh: 300,
      price: 40.00,
      currency: "BRL", 
      bonus: 50,
      popular: true,
      description: "Mais popular entre iniciados",
      features: ["300 T'KAZH", "+50 T'KAZH bônus", "Válido por 12 meses", "Suporte prioritário"]
    },
    {
      id: "adept",
      name: "Pacote Adepto",
      tkazh: 600,
      price: 75.00,
      currency: "BRL",
      bonus: 150,
      popular: false,
      description: "Para estudos avançados",
      features: ["600 T'KAZH", "+150 T'KAZH bônus", "Válido por 12 meses", "Acesso VIP", "Suporte premium"]
    },
    {
      id: "master",
      name: "Pacote Mestre",
      tkazh: 1500,
      price: 180.00,
      currency: "BRL",
      bonus: 500,
      popular: false,
      description: "Para mestres do conhecimento",
      features: ["1500 T'KAZH", "+500 T'KAZH bônus", "Válido por 18 meses", "Todos os acessos", "Consultoria pessoal"]
    }
  ];

  const paymentMethods = [
    { id: "pix", name: "PIX", description: "Instantâneo", icon: Zap },
    { id: "paypal", name: "PayPal", description: "Internacional", icon: CreditCard },
    { id: "mercadopago", name: "Mercado Pago", description: "Cartão/PIX", icon: Shield },
    { id: "infinitepay", name: "InfinitePay", description: "Cartão", icon: CreditCard }
  ];

  const handlePurchase = (packageId: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    
    if (!paymentMethod) {
      alert('Selecione um método de pagamento');
      return;
    }

    setSelectedPackage(packageId);
    // Here would integrate with payment processing
    console.log('Processing payment for package:', packageId, 'with method:', paymentMethod);
  };

  if (!user) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        <Navigation />
        
        <div className="fixed inset-0 overflow-hidden z-0">
          <div className="mystical-particles"></div>
        </div>

        <div className="relative z-10 min-h-screen flex items-center justify-center pt-20">
          <Card className="abyssal-card-transparent max-w-md mx-auto">
            <CardHeader className="text-center">
              <Crown className="w-16 h-16 text-yellow-600 mx-auto mb-4" />
              <CardTitle className="text-2xl font-titles text-yellow-600">Acesso Requerido</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-200 mb-6">
                Para adquirir T'KAZH você precisa estar logado no templo.
              </p>
              <Link href="/login">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-black font-bold">
                  Entrar no Templo
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navigation />
      
      <div className="fixed inset-0 overflow-hidden z-0">
        <div className="mystical-particles"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-24">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-titles text-yellow-600 mb-4 flame-text-clean">
            Adquirir T'KAZH
          </h1>
          <p className="text-xl text-gray-200 font-serif">
            Créditos sagrados para acessar os mistérios ancestrais
          </p>
        </div>

        {/* Current Balance */}
        <Card className="abyssal-card-transparent max-w-md mx-auto mb-12">
          <CardContent className="text-center py-6">
            <Gem className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <div className="text-3xl font-bold text-yellow-500 mb-2">{user.tkazh_credits}</div>
            <p className="text-gray-300">T'KAZH Atual</p>
          </CardContent>
        </Card>

        {/* Package Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {packages.map((pkg) => (
            <Card 
              key={pkg.id}
              className={`abyssal-card-transparent cursor-pointer transition-all duration-300 hover:scale-105 relative ${
                selectedPackage === pkg.id ? 'ring-2 ring-yellow-500' : ''
              }`}
              onClick={() => setSelectedPackage(pkg.id)}
            >
              {pkg.popular && (
                <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-600 text-black">
                  Mais Popular
                </Badge>
              )}
              
              <CardHeader className="text-center">
                <Star className="w-10 h-10 text-yellow-600 mx-auto mb-3" />
                <CardTitle className="text-xl font-titles text-yellow-600">
                  {pkg.name}
                </CardTitle>
                <CardDescription className="text-gray-300">
                  {pkg.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="mb-4">
                  <div className="text-3xl font-bold text-yellow-500">{pkg.tkazh}</div>
                  <div className="text-sm text-gray-400">T'KAZH</div>
                  {pkg.bonus > 0 && (
                    <div className="text-green-400 text-sm mt-1">+{pkg.bonus} bônus</div>
                  )}
                </div>
                
                <div className="text-2xl font-bold text-white mb-4">
                  R$ {pkg.price.toFixed(2)}
                </div>
                
                <div className="space-y-2 mb-6">
                  {pkg.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                      {feature}
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full ${
                    selectedPackage === pkg.id 
                      ? 'bg-yellow-600 hover:bg-yellow-700 text-black' 
                      : 'bg-transparent border border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-black'
                  }`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {selectedPackage === pkg.id ? 'Selecionado' : 'Selecionar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Payment Methods */}
        {selectedPackage && (
          <Card className="abyssal-card-transparent max-w-2xl mx-auto mb-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-titles text-yellow-600">
                Método de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 ${
                      paymentMethod === method.id
                        ? 'border-yellow-500 bg-yellow-600/10'
                        : 'border-yellow-600/30 hover:border-yellow-500/60'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center">
                      <method.icon className="w-6 h-6 text-yellow-600 mr-3" />
                      <div>
                        <div className="font-semibold text-white">{method.name}</div>
                        <div className="text-sm text-gray-400">{method.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <Button 
                className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-bold py-3"
                onClick={() => handlePurchase(selectedPackage)}
                disabled={!paymentMethod}
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Finalizar Compra
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Security Notice */}
        <Card className="abyssal-card-transparent max-w-2xl mx-auto">
          <CardContent className="text-center py-6">
            <Shield className="w-8 h-8 text-green-400 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-yellow-600 mb-2">Pagamento Seguro</h3>
            <p className="text-gray-300 text-sm">
              Todas as transações são processadas com criptografia SSL e seguem os mais altos padrões de segurança. 
              Seus dados estão protegidos e nunca são armazenados em nossos servidores.
            </p>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}