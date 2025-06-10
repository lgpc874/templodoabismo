import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest('/api/auth/login', credentials);
      
      if (response.success) {
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo, Magus do Templo"
        });
        setLocation('/admin');
      } else {
        throw new Error(response.message || 'Credenciais inválidas');
      }
    } catch (error: any) {
      toast({
        title: "Erro no login",
        description: error.message || "Credenciais inválidas",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black p-4">
      <Card className="w-full max-w-md bg-black/50 border-amber-500/30">
        <CardHeader className="text-center">
          <div className="text-amber-400 text-4xl mb-4">⛧</div>
          <CardTitle className="text-2xl font-cinzel-decorative text-amber-400">
            Portal Administrativo
          </CardTitle>
          <CardDescription className="text-gray-400">
            Acesso restrito ao Magus do Templo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Nome de usuário"
                value={credentials.username}
                onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                className="bg-gray-800/50 border-amber-500/30 text-white"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Senha"
                value={credentials.password}
                onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                className="bg-gray-800/50 border-amber-500/30 text-white"
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
              disabled={isLoading}
            >
              {isLoading ? 'Autenticando...' : 'Entrar no Sanctum'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}