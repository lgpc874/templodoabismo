
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff, Flame, Crown } from "lucide-react";
import Navigation from "@/components/navigation";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, register } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login(loginData.email, loginData.password);
      if (success) {
        setLocation("/");
      } else {
        setError("Credenciais inválidas");
      }
    } catch (error) {
      setError("Erro interno do servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (registerData.password !== registerData.confirmPassword) {
      setError("Senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (registerData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    try {
      const success = await register(
        registerData.username,
        registerData.email,
        registerData.password
      );
      if (success) {
        setLocation("/");
      } else {
        setError("Erro ao criar conta");
      }
    } catch (error) {
      setError("Erro interno do servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-red-100">
      <Navigation />
      
      <div className="min-h-screen flex items-center justify-center px-6 pt-20">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Flame className="w-16 h-16 mx-auto text-red-500 mb-4 animate-pulse" />
            <h1 className="text-3xl font-bold text-red-400 mb-2">
              Portal de Acesso
            </h1>
            <p className="text-red-300">
              Entre no Templo do Abismo
            </p>
          </div>

          <Card className="bg-black/60 backdrop-blur-sm border-red-900/30">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-black/40">
                <TabsTrigger value="login" className="data-[state=active]:bg-red-800">
                  Entrar
                </TabsTrigger>
                <TabsTrigger value="register" className="data-[state=active]:bg-red-800">
                  Registrar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <CardHeader>
                  <CardTitle className="text-red-400">Bem-vindo de volta</CardTitle>
                  <CardDescription className="text-red-300">
                    Entre com suas credenciais para acessar o Templo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-red-200">Email</Label>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginData.email}
                        onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                        className="bg-black/40 border-red-900/30 text-red-100"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-red-200">Senha</Label>
                      <div className="relative">
                        <Input
                          id="login-password"
                          type={showPassword ? "text" : "password"}
                          value={loginData.password}
                          onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                          className="bg-black/40 border-red-900/30 text-red-100 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-red-400 hover:text-red-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    {error && (
                      <div className="text-red-400 text-sm text-center">
                        {error}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-red-800 hover:bg-red-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Entrando..." : "Entrar no Templo"}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>

              <TabsContent value="register">
                <CardHeader>
                  <CardTitle className="text-red-400">Inicie sua Jornada</CardTitle>
                  <CardDescription className="text-red-300">
                    Entre no portal de conhecimentos ancestrais
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username" className="text-red-200">Nome de Usuário</Label>
                      <Input
                        id="register-username"
                        type="text"
                        value={registerData.username}
                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                        className="bg-black/40 border-red-900/30 text-red-100"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-red-200">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerData.email}
                        onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
                        className="bg-black/40 border-red-900/30 text-red-100"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-red-200">Senha</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          value={registerData.password}
                          onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                          className="bg-black/40 border-red-900/30 text-red-100 pr-10"
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 text-red-400 hover:text-red-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password" className="text-red-200">Confirmar Senha</Label>
                      <Input
                        id="register-confirm-password"
                        type="password"
                        value={registerData.confirmPassword}
                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                        className="bg-black/40 border-red-900/30 text-red-100"
                        required
                      />
                    </div>
                    {error && (
                      <div className="text-red-400 text-sm text-center">
                        {error}
                      </div>
                    )}
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
                      disabled={isLoading}
                    >
                      {isLoading ? "Criando..." : (
                        <>
                          <Crown className="w-4 h-4 mr-2" />
                          Iniciar Jornada Mística
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
}
