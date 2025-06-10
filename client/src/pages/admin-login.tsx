import { useState } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Shield, Lock, Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest('POST', '/api/auth/login', credentials);
    },
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.session?.access_token || '');
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      toast({
        title: 'Acesso concedido',
        description: 'Bem-vindo ao painel administrativo',
      });
      setLocation('/admin');
    },
    onError: (error: any) => {
      toast({
        title: 'Acesso negado',
        description: error.message || 'Credenciais inválidas',
        variant: 'destructive',
      });
    }
  });

  const emergencyLoginMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      return apiRequest('POST', '/api/emergency-admin', credentials);
    },
    onSuccess: (data) => {
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      toast({
        title: 'Acesso de emergência autorizado',
        description: 'Sistema administrativo ativado',
      });
      setLocation('/admin');
    },
    onError: (error: any) => {
      toast({
        title: 'Acesso de emergência negado',
        description: error.message || 'Credenciais de emergência inválidas',
        variant: 'destructive',
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Erro de validação',
        description: 'Email e senha são obrigatórios',
        variant: 'destructive',
      });
      return;
    }

    // Try emergency login first if admin@templodoabismo.com
    if (email === 'admin@templodoabismo.com') {
      emergencyLoginMutation.mutate({ email, password });
    } else {
      loginMutation.mutate({ email, password });
    }
  };

  const isLoading = loginMutation.isPending || emergencyLoginMutation.isPending;

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-purple-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-purple-600 bg-clip-text text-transparent">
            Sanctum Magus
          </h1>
          <p className="text-gray-400 mt-2">
            Portal de acesso reservado ao Magus do Templo
          </p>
        </div>

        <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              Autenticação Requerida
            </CardTitle>
            <CardDescription className="text-center text-gray-400">
              Apenas iniciados autorizados podem acessar este domínio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email do Administrador
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@templodoabismo.com"
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Palavra-chave Arcana
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-purple-600 hover:from-red-600 hover:to-purple-700 text-white font-medium py-2 px-4 rounded-md transition-all duration-200 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verificando credenciais...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <Lock className="w-4 h-4" />
                    <span>Acessar Sanctum</span>
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <div className="text-center text-sm text-gray-500">
                <p className="mb-2">Acesso de emergência disponível para:</p>
                <code className="bg-gray-800 px-2 py-1 rounded text-red-400">
                  admin@templodoabismo.com
                </code>
                <p className="mt-2 text-xs">
                  Sistema de contingência para recuperação de acesso
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
            <Shield className="w-4 h-4" />
            <span>Protegido por encriptação arcana</span>
          </div>
        </div>
      </div>
    </div>
  );
}