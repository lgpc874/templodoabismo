import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const EmergencyAdminLogin: React.FC = () => {
  const [email, setEmail] = useState('admin@templodoabismo.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmergencyLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/emergency-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store emergency admin session
        localStorage.setItem('emergency-admin', JSON.stringify(data.user));
        localStorage.setItem('emergency-admin-token', data.token);
        
        toast({
          title: "Acesso de Emergência Concedido",
          description: "Redirecionando para o painel administrativo...",
        });

        // Redirect to admin panel
        window.location.href = '/admin';
      } else {
        toast({
          title: "Acesso Negado",
          description: data.error || "Credenciais de emergência inválidas",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha na conexão com o servidor",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Card className="w-full max-w-md bg-black/30 backdrop-blur-lg border-red-500/20">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-red-500/20 border border-red-500/30">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </div>
            <CardTitle className="text-2xl font-cinzel-decorative text-red-400">
              ACESSO DE EMERGÊNCIA
            </CardTitle>
            <CardDescription className="text-gray-300">
              Sistema de backup para administradores do templo
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleEmergencyLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email do Administrador</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white"
                  required
                  disabled
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Senha de Emergência</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-900/50 border-gray-700 text-white"
                  placeholder="Digite a senha de emergência"
                  required
                />
              </div>

              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                <p className="text-xs text-red-300 text-center">
                  ⚠️ Este é um sistema de acesso de emergência. Use apenas em caso de problemas críticos de autenticação.
                </p>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={loading}
              >
                {loading ? 'Verificando...' : 'Acessar Sanctum'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <a href="/login" className="text-amber-400 hover:text-amber-300 text-sm">
                ← Voltar ao login normal
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmergencyAdminLogin;