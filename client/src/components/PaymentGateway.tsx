import React, { useState, useEffect } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CreditCard, QrCode, Globe, ShieldCheck, Zap } from 'lucide-react';

// Load Stripe with your publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

interface PaymentGatewayProps {
  amount: number;
  currency: string;
  description?: string;
  onSuccess?: (paymentData: any) => void;
  onError?: (error: string) => void;
}

const PaymentForm: React.FC<PaymentGatewayProps> = ({
  amount,
  currency,
  description,
  onSuccess,
  onError
}) => {
  const [selectedGateway, setSelectedGateway] = useState<string>('stripe');
  const [loading, setLoading] = useState(false);
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const { toast } = useToast();
  
  const stripe = useStripe();
  const elements = useElements();

  const gateways = [
    { 
      id: 'stripe', 
      name: 'Stripe', 
      icon: CreditCard, 
      description: 'Cartão de Crédito/Débito',
      color: 'from-purple-500 to-blue-600'
    },
    { 
      id: 'paypal', 
      name: 'PayPal', 
      icon: Globe, 
      description: 'Conta PayPal',
      color: 'from-blue-500 to-blue-700'
    },
    { 
      id: 'mercadopago', 
      name: 'Mercado Pago', 
      icon: QrCode, 
      description: 'PIX e Cartões',
      color: 'from-blue-400 to-cyan-500'
    },
    { 
      id: 'pagseguro', 
      name: 'PagSeguro', 
      icon: ShieldCheck, 
      description: 'PIX e Boleto',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'infinitepay', 
      name: 'InfinitePay', 
      icon: Zap, 
      description: 'Pagamento Instantâneo',
      color: 'from-orange-500 to-red-500'
    }
  ];

  const handlePayment = async () => {
    if (!customerEmail || !customerName) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      if (selectedGateway === 'stripe') {
        await handleStripePayment();
      } else {
        await handleOtherGateways();
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Erro no Pagamento",
        description: error.message || 'Falha ao processar pagamento',
        variant: "destructive"
      });
      onError?.(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStripePayment = async () => {
    if (!stripe || !elements) {
      throw new Error('Stripe não carregado');
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      throw new Error('Elemento do cartão não encontrado');
    }

    // Create payment intent
    const paymentData = await apiRequest('POST', '/api/payments/create', {
      amount,
      currency,
      description,
      customerEmail,
      customerName,
      gateway: 'stripe'
    });

    if (!paymentData.success || !paymentData.clientSecret) {
      throw new Error(paymentData.error || 'Falha ao criar intenção de pagamento');
    }

    // Confirm payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(paymentData.clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: customerName,
          email: customerEmail,
        },
      }
    });

    if (error) {
      throw new Error(error.message);
    }

    if (paymentIntent.status === 'succeeded') {
      toast({
        title: "Pagamento Realizado",
        description: "Seu pagamento foi processado com sucesso!",
      });
      onSuccess?.(paymentIntent);
    }
  };

  const handleOtherGateways = async () => {
    const paymentData = await apiRequest('POST', '/api/payments/create', {
      amount,
      currency,
      description,
      customerEmail,
      customerName,
      gateway: selectedGateway
    });

    if (!paymentData.success) {
      throw new Error(paymentData.error || 'Falha ao processar pagamento');
    }

    setPaymentResult(paymentData);

    if (paymentData.redirectUrl) {
      window.open(paymentData.redirectUrl, '_blank');
    }

    if (paymentData.qrCode) {
      toast({
        title: "QR Code Gerado",
        description: "Use o QR Code para finalizar o pagamento",
      });
    }

    toast({
      title: "Pagamento Iniciado",
      description: `Pagamento de ${currency} ${amount} iniciado via ${selectedGateway}`,
    });
    
    onSuccess?.(paymentData);
  };

  const selectedGatewayData = gateways.find(g => g.id === selectedGateway);

  return (
    <div className="max-w-md mx-auto space-y-6">
      <Card className="border-gray-800 bg-gray-900">
        <CardHeader>
          <CardTitle className="text-white text-center">
            Pagamento - {currency} {amount.toFixed(2)}
          </CardTitle>
          {description && (
            <p className="text-gray-400 text-center text-sm">{description}</p>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Gateway Selection */}
          <div className="space-y-2">
            <Label className="text-white">Método de Pagamento</Label>
            <Select value={selectedGateway} onValueChange={setSelectedGateway}>
              <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                {gateways.map((gateway) => {
                  const Icon = gateway.icon;
                  return (
                    <SelectItem key={gateway.id} value={gateway.id} className="text-white">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span>{gateway.name}</span>
                        <span className="text-xs text-gray-400">- {gateway.description}</span>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Info */}
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-white">Nome Completo</Label>
              <Input
                placeholder="Seu nome completo"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white">Email</Label>
              <Input
                type="email"
                placeholder="seu@email.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>

          {/* Stripe Card Element */}
          {selectedGateway === 'stripe' && (
            <div className="space-y-2">
              <Label className="text-white">Dados do Cartão</Label>
              <div className="p-3 border border-gray-700 rounded-md bg-gray-800">
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#fff',
                        '::placeholder': {
                          color: '#9ca3af',
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Payment Result Display */}
          {paymentResult && selectedGateway !== 'stripe' && (
            <div className="p-4 bg-gray-800 rounded-md border border-gray-700">
              {paymentResult.qrCode && (
                <div className="text-center">
                  <p className="text-white mb-2">Escaneie o QR Code:</p>
                  <div className="bg-white p-4 rounded-md inline-block">
                    <img src={`data:image/png;base64,${paymentResult.qrCode}`} alt="QR Code" className="w-32 h-32" />
                  </div>
                </div>
              )}
              {paymentResult.paymentId && (
                <p className="text-gray-400 text-sm">ID: {paymentResult.paymentId}</p>
              )}
            </div>
          )}

          {/* Payment Button */}
          <Button
            onClick={handlePayment}
            disabled={loading || !customerEmail || !customerName}
            className={`w-full bg-gradient-to-r ${selectedGatewayData?.color} hover:opacity-90 transition-opacity`}
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Processando...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                {selectedGatewayData && <selectedGatewayData.icon className="w-4 h-4" />}
                <span>Pagar {currency} {amount.toFixed(2)}</span>
              </div>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

const PaymentGateway: React.FC<PaymentGatewayProps> = (props) => {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
};

export default PaymentGateway;