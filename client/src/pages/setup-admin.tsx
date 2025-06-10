import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Shield, CheckCircle, AlertCircle } from 'lucide-react';

export default function SetupAdmin() {
  const [email, setEmail] = useState('admin@templodoabismo.com');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/make-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        toast({
          title: "Sucesso!",
          description: "Usuário promovido a administrador com sucesso.",
        });
      } else {
        toast({
          title: "Erro",
          description: data.error || "Falha ao promover usuário.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro de conexão. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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

        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
          <Card className="w-full max-w-md bg-black/30 backdrop-blur-lg border border-green-500/20">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 mx-auto text-green-400 mb-4" />
              <CardTitle className="text-2xl font-cinzel-decorative text-green-400">
                Magus do Templo Criado!
              </CardTitle>
              <CardDescription className="text-gray-300">
                O usuário foi promovido a Magus do Templo com sucesso.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-gray-300 mb-4">
                  Agora você pode acessar o sanctum do Magus do Templo.
                </p>
                <div className="space-y-2">
                  <a href="/admin">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-black">
                      Acessar Sanctum Magus
                    </Button>
                  </a>
                  <a href="/">
                    <Button variant="outline" className="w-full border-amber-500/30 text-amber-300">
                      Voltar ao Templo
                    </Button>
                  </a>
                </div>
              </div>
              <div className="text-amber-400 text-2xl text-center">𖤍 ⸸ 𖤍</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <Card className="w-full max-w-md bg-black/30 backdrop-blur-lg border border-amber-500/20">
          <CardHeader className="text-center">
            <Shield className="w-16 h-16 mx-auto text-amber-400 mb-4" />
            <CardTitle className="text-2xl font-cinzel-decorative text-amber-400">
              Configuração Inicial
            </CardTitle>
            <CardDescription className="text-gray-300">
              Configure o primeiro Magus do Templo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-amber-300">
                  Email do Usuário
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite o email do usuário"
                  required
                  className="bg-black/50 border-amber-500/30 text-white"
                />
                <p className="text-xs text-gray-400">
                  Digite o email de um usuário já registrado para promovê-lo a Magus do Templo.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-amber-600 hover:bg-amber-700 text-black"
                disabled={loading}
              >
                {loading ? 'Processando...' : 'Criar Magus do Templo'}
              </Button>
            </form>
            
            <div className="mt-6 p-4 bg-amber-900/20 border border-amber-500/30 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-amber-300 font-medium">Importante:</p>
                  <p className="text-xs text-gray-300 mt-1">
                    Esta funcionalidade só funciona quando não há Magus do Templo no sistema. 
                    Após criar o primeiro Magus, esta página será desabilitada por segurança.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-amber-400 text-2xl text-center mt-6">𖤍 ⸸ 𖤍</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}