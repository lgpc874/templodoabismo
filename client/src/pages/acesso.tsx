import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, User, Mail, Lock, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function Acesso() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    confirmPassword: "" 
  });
  
  const { toast } = useToast();

  const loginMutation = useMutation({
    mutationFn: async (data: typeof loginData) => {
      return await apiRequest("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      toast({
        title: "Acesso concedido",
        description: "Bem-vindo ao Templo do Abismo",
      });
      window.location.href = "/";
    },
    onError: (error: any) => {
      toast({
        title: "Acesso negado",
        description: error.message || "Credenciais inválidas",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (data: typeof registerData) => {
      if (data.password !== data.confirmPassword) {
        throw new Error("Senhas não coincidem");
      }
      return await apiRequest("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          password: data.password,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Registro realizado",
        description: "Sua conta foi criada com sucesso",
      });
      setRegisterData({ username: "", email: "", password: "", confirmPassword: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro no registro",
        description: error.message || "Falha ao criar conta",
        variant: "destructive",
      });
    },
  });

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
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {/* Hero Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="mb-8">
            <div className="text-amber-400 text-6xl mb-4">🚪</div>
            <h1 className="text-5xl md:text-7xl font-cinzel-decorative text-amber-400 mystical-glow mb-6 floating-title">
              PORTA TEMPLI
            </h1>
            <div className="flex justify-center items-center space-x-8 text-amber-500 text-3xl mb-6">
              <span>☿</span>
              <span>⚹</span>
              <span>𖤍</span>
              <span>⚹</span>
              <span>☿</span>
            </div>
          </div>
          
          <div className="floating-card p-8 space-y-6 bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
            <h2 className="text-3xl md:text-4xl font-cinzel-decorative text-amber-300 mb-6 floating-title-slow">
              Portal de Acesso ao Sanctuário
            </h2>
            
            <p className="text-xl text-gray-300 leading-relaxed font-crimson mb-6">
              Entre no <strong className="text-amber-400">templo sagrado</strong> ou inicie sua 
              <strong className="text-red-400"> jornada iniciática</strong> nos mistérios luciferianos.
            </p>
            
            <div className="text-center">
              <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
              <p className="text-lg font-cinzel-decorative text-amber-300">
                "Audax et Fidelis"
              </p>
              <p className="text-sm text-gray-400 font-crimson italic mt-2">
                Ousado e fiel
              </p>
            </div>
          </div>
        </div>

        {/* Authentication Forms */}
        <div className="floating-card max-w-md w-full bg-black/30 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-black/40 border border-amber-600/30">
              <TabsTrigger 
                value="login"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Acesso
              </TabsTrigger>
              <TabsTrigger 
                value="register"
                className="data-[state=active]:bg-amber-600/20 data-[state=active]:text-amber-200 text-gray-400"
              >
                Registro
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="p-6">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-amber-400 text-center text-xl">
                    Entrada do Iniciado
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-center">
                    Acesse sua conta no templo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-amber-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-amber-400" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-amber-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-amber-400" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        className="pl-10 pr-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-2.5 text-amber-400 hover:text-amber-300"
                      >
                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    onClick={() => loginMutation.mutate(loginData)}
                    disabled={loginMutation.isPending}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                  >
                    {loginMutation.isPending ? "Verificando..." : "Entrar no Templo"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="register" className="p-6">
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader className="pb-4">
                  <CardTitle className="text-amber-400 text-center text-xl">
                    Iniciação
                  </CardTitle>
                  <CardDescription className="text-gray-300 text-center">
                    Torne-se um iniciado do templo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-amber-300">Nome de Usuário</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-2.5 h-5 w-5 text-amber-400" />
                      <Input
                        id="username"
                        type="text"
                        placeholder="seu_nome"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-email" className="text-amber-300">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-2.5 h-5 w-5 text-amber-400" />
                      <Input
                        id="reg-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reg-password" className="text-amber-300">Senha</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-2.5 h-5 w-5 text-amber-400" />
                      <Input
                        id="reg-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.password}
                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                        className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password" className="text-amber-300">Confirmar Senha</Label>
                    <div className="relative">
                      <Key className="absolute left-3 top-2.5 h-5 w-5 text-amber-400" />
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="••••••••"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className="pl-10 bg-black/40 border-amber-500/30 text-gray-300 placeholder:text-gray-500"
                      />
                    </div>
                  </div>
                  <Button 
                    onClick={() => registerMutation.mutate(registerData)}
                    disabled={registerMutation.isPending}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-black font-semibold"
                  >
                    {registerMutation.isPending ? "Criando..." : "Iniciar Jornada"}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Mystical Quote */}
        <div className="floating-card max-w-2xl mx-auto mt-12 p-8 bg-black/20 backdrop-blur-lg border border-amber-500/20 rounded-xl">
          <div className="text-center">
            <div className="text-amber-400 text-2xl mb-4">𖤍 ⸸ 𖤍</div>
            <p className="text-lg text-gray-300 italic leading-relaxed mb-4">
              "Aqueles que buscam a verdade devem primeiro atravessar a porta da dúvida"
            </p>
            <p className="text-amber-400 font-semibold">
              — Guardião do Portal
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}