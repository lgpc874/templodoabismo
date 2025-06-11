import { useState, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { createDirectSupabaseClient } from "@/lib/supabase-direct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, AlertCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import RotatingSeal from "@/components/RotatingSeal";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  // Initialize Supabase client
  useEffect(() => {
    async function initializeSupabase() {
      try {
        const client = await createDirectSupabaseClient();
        setSupabaseClient(client);
      } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        setError('Erro ao conectar com o servidor');
      }
    }

    initializeSupabase();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseClient) {
      setError('Cliente não inicializado');
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      // Primeiro, fazer login no Supabase
      const { data, error: authError } = await supabaseClient.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password
      });

      if (authError) {
        setError(authError.message);
        return;
      }

      if (data.user) {
        // Verificar se o usuário é admin
        const { data: userData, error: userError } = await supabaseClient
          .from('users')
          .select('role, member_type')
          .eq('email', data.user.email)
          .single();

        if (userError || !userData) {
          setError('Usuário não encontrado no sistema');
          await supabaseClient.auth.signOut();
          return;
        }

        if (userData.role !== 'admin') {
          setError('Acesso negado. Apenas administradores podem acessar este painel.');
          await supabaseClient.auth.signOut();
          return;
        }

        // Redirecionar para o painel admin
        setLocation('/admin');
      }
    } catch (error: any) {
      setError('Erro ao fazer login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Admin Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      {/* Selo Giratório Padrão */}
      <RotatingSeal variant="simple" opacity={5} size="lg" />

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        {/* Admin Login Form */}
        <div className="w-full max-w-md">
          <Card className="bg-white/10 backdrop-blur-lg border border-purple-500/20 shadow-2xl">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-white">
                Painel Administrativo
              </CardTitle>
              <CardDescription className="text-gray-300">
                Acesso restrito apenas para administradores
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              {error && (
                <Alert className="mb-6 border-red-500/50 bg-red-500/10">
                  <AlertCircle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-400">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-purple-200">
                    Email do Administrador
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@templodoabismo.com"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                    required
                    className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-purple-200">
                    Senha
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                      className="bg-white/10 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  {isLoading ? "Verificando..." : "Acessar Painel"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <Link href="/login">
                  <Button variant="ghost" className="text-purple-300 hover:text-white">
                    ← Voltar ao login comum
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}