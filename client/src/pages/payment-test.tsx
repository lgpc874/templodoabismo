import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PaymentGateway from '@/components/PaymentGateway';
import { CreditCard, DollarSign, TestTube } from 'lucide-react';

const PaymentTest: React.FC = () => {
  const [showPayment, setShowPayment] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(197);
  const [paymentCurrency, setPaymentCurrency] = useState('BRL');
  const [paymentDescription, setPaymentDescription] = useState('Curso Avançado de Luciferian Studies');

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    setShowPayment(false);
    alert('Pagamento realizado com sucesso!');
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    alert(`Erro no pagamento: ${error}`);
  };

  const testCourses = [
    {
      name: 'Fundamentos Luciferianos',
      price: 97,
      currency: 'BRL',
      description: 'Curso introdutório aos ensinamentos ancestrais'
    },
    {
      name: 'Ritual Avançado',
      price: 197,
      currency: 'BRL',
      description: 'Práticas rituais avançadas'
    },
    {
      name: 'Gnosis Superior',
      price: 297,
      currency: 'BRL',
      description: 'Conhecimentos superiores do caminho'
    }
  ];

  if (showPayment) {
    return (
      <div className="min-h-screen bg-black text-white p-8">
        <div className="container mx-auto max-w-2xl">
          <div className="mb-6">
            <Button
              onClick={() => setShowPayment(false)}
              variant="outline"
              className="text-white border-gray-700 hover:bg-gray-800"
            >
              ← Voltar
            </Button>
          </div>
          
          <PaymentGateway
            amount={paymentAmount}
            currency={paymentCurrency}
            description={paymentDescription}
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-black">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center space-x-3 mb-4">
            <TestTube className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold">Payment Gateway Test</h1>
          </div>
          <p className="text-gray-400">
            Sistema de teste para os gateways de pagamento integrados
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Configuration */}
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5" />
                <span>Configuração do Pagamento</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label className="text-white">Valor</Label>
                <Input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Moeda</Label>
                <Input
                  value={paymentCurrency}
                  onChange={(e) => setPaymentCurrency(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Descrição</Label>
                <Input
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <Button
                onClick={() => setShowPayment(true)}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                Testar Pagamento
              </Button>
            </CardContent>
          </Card>

          {/* Available Gateways */}
          <Card className="border-gray-800 bg-gray-900">
            <CardHeader>
              <CardTitle className="text-white">Gateways Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Stripe</h3>
                    <p className="text-gray-400 text-sm">Cartões de crédito/débito</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">PayPal</h3>
                    <p className="text-gray-400 text-sm">Conta PayPal</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">Mercado Pago</h3>
                    <p className="text-gray-400 text-sm">PIX e cartões</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">PagSeguro</h3>
                    <p className="text-gray-400 text-sm">PIX e boleto</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div>
                    <h3 className="text-white font-medium">InfinitePay</h3>
                    <p className="text-gray-400 text-sm">Pagamento instantâneo</p>
                  </div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Test Courses */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Cursos para Teste</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testCourses.map((course, index) => (
              <Card key={index} className="border-gray-800 bg-gray-900 hover:border-red-500 transition-colors">
                <CardContent className="p-6">
                  <h3 className="text-white font-bold text-lg mb-2">{course.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-red-400">
                      {course.currency} {course.price}
                    </span>
                    <Button
                      onClick={() => {
                        setPaymentAmount(course.price);
                        setPaymentCurrency(course.currency);
                        setPaymentDescription(course.description);
                        setShowPayment(true);
                      }}
                      size="sm"
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Comprar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentTest;