import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { createDirectSupabaseClient } from "@/lib/supabase-direct";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Login() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [supabaseClient, setSupabaseClient] = useState<any>(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  });

  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
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
    setIsLoading(true);
    setError("");

    try {
      if (!supabaseClient) {
        throw new Error('Cliente não inicializado');
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSuccess("Login realizado com sucesso!");
        setTimeout(() => {
          setLocation("/");
        }, 1500);
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || "Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (registerData.password !== registerData.confirmPassword) {
        throw new Error("As senhas não coincidem");
      }

      if (!supabaseClient) {
        throw new Error('Cliente não inicializado');
      }

      const { data, error } = await supabaseClient.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            username: registerData.username,
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        setSuccess("Conta criada com sucesso! Verifique seu email para confirmar.");
        setRegisterData({
          username: "",
          email: "",
          password: "",
          confirmPassword: ""
        });

        setTimeout(() => {
          setLocation("/");
        }, 2000);
      }
    } catch (error: any) {
      console.error('Registration exception:', error);
      setError(error.message || "Erro ao criar conta");
    } finally {
      setIsLoading(false);
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

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 pt-20">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">⛧</div>
            <h1 className="text-4xl md:text-6xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              PORTA ACCESSUS
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-2xl md:text-3xl font-cinzel-decorative text-amber-300 mb-4 floating-title-slow">
              Entrada para o Sanctum
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed font-crimson">
              Acesse o <strong className="text-amber-400">portal ancestral</strong> da gnose luciferiana
            </p>
          </div>
        </div>

        {/* Login/Register Card */}
        <div className="floating-card w-full max-w-md bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-amber-600/30">
              <TabsTrigger 
                value="login" 
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Entrar
              </TabsTrigger>
              <TabsTrigger 
                value="register" 
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Registrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <CardHeader className="text-center">
                <CardTitle className="text-amber-400 font-cinzel-decorative text-xl">
                  Bem-vindo de volta
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Entre com suas credenciais para acessar o Templo
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 border-red-600/30 bg-red-950/20">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-4 border-amber-600/30 bg-amber-950/20">
                    <AlertDescription className="text-amber-300">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="text-amber-200">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={loginData.email}
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                      className="bg-black/40 border-amber-600/30 text-amber-100 focus:border-amber-500 placeholder:text-gray-500"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="text-amber-200">Senha</Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        type={showPassword ? "text" : "password"}
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="bg-black/40 border-amber-600/30 text-amber-100 pr-10 focus:border-amber-500 placeholder:text-gray-500"
                        placeholder="Sua senha"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 text-amber-400 hover:text-amber-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Entrando..." : "Entrar no Templo"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent value="register">
              <CardHeader className="text-center">
                <CardTitle className="text-amber-400 font-cinzel-decorative text-xl">
                  Nova Jornada
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Crie sua conta para iniciar os estudos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert className="mb-4 border-red-600/30 bg-red-950/20">
                    <AlertCircle className="h-4 w-4 text-red-400" />
                    <AlertDescription className="text-red-300">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                {success && (
                  <Alert className="mb-4 border-amber-600/30 bg-amber-950/20">
                    <AlertDescription className="text-amber-300">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-username" className="text-amber-200">Nome de Usuário</Label>
                    <Input
                      id="register-username"
                      type="text"
                      value={registerData.username}
                      onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                      className="bg-black/40 border-amber-600/30 text-amber-100 focus:border-amber-500 placeholder:text-gray-500"
                      placeholder="Seu nome de usuário"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-amber-200">Email</Label>
                    <Input
                      id="register-email"
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                      className="bg-black/40 border-amber-600/30 text-amber-100 focus:border-amber-500 placeholder:text-gray-500"
                      placeholder="seu@email.com"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-amber-200">Senha</Label>
                    <Input
                      id="register-password"
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                      className="bg-black/40 border-amber-600/30 text-amber-100 focus:border-amber-500 placeholder:text-gray-500"
                      placeholder="Crie uma senha"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm" className="text-amber-200">Confirmar Senha</Label>
                    <Input
                      id="register-confirm"
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                      className="bg-black/40 border-amber-600/30 text-amber-100 focus:border-amber-500 placeholder:text-gray-500"
                      placeholder="Confirme a senha"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                    disabled={isLoading}
                  >
                    {isLoading ? "Criando..." : "Iniciar Jornada"}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-8 p-6 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-xl mb-3">𖤍 ⸸ 𖤍</div>
            <p className="text-sm text-gray-300 italic leading-relaxed">
              "O conhecimento verdadeiro só é revelado àqueles que buscam com coração sincero"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}